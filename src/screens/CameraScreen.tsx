import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices, useCameraFormat } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCameraPermission,
  setStoragePermission,
  setIsScanning,
  setError,
  clearError,
  addCapturedImage,
} from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { cameraPermission, storagePermission, isScanning, error, currentSession } = useAppSelector(
    state => state.biometric,
  );

  const [hasPermission, setHasPermission] = useState(cameraPermission === 'granted');
  const [isFocusing, setIsFocusing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();

  const { imageIndex = 0, onImageCaptured } = route.params || {};

  // Find the back camera
  const deviceBack = devices.find(d => d.position === 'back') || devices[0];
  const deviceFront = devices.find(d => d.position === 'front') || devices[0];

  // Configure camera format for best quality (especially important for Android)
  const backCameraFormat = useCameraFormat(deviceBack, [
    { photoResolution: 'max' }, // Use maximum available resolution
    { fps: 60 }, // Higher FPS for faster focus
    { autoFocusSystem: 'phase-detection' }, // Better for moving subjects
  ]);

  const centerPoint = {
    x: Dimensions.get('window').width / 2,
    y: Dimensions.get('window').height / 2,
  };

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Camera.requestCameraPermission();
        const hasCamera = permission === 'granted';

        setHasPermission(hasCamera);
        dispatch(setCameraPermission(permission));

        if (!hasCamera) {
          dispatch(setError('Camera permission is required for biometric scanning'));
          Alert.alert('Camera Permission', 'Camera permission is required for biometric scanning.');
          navigation.goBack();
          return;
        }

        // Clear any previous errors
        dispatch(clearError());
        dispatch(setIsScanning(true));
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        dispatch(setError('Failed to request camera permission'));
        dispatch(setCameraPermission('denied'));
        navigation.goBack();
      }
    };

    if (cameraPermission === 'not_requested') {
      requestPermission();
    } else {
      setHasPermission(cameraPermission === 'granted');
      if (cameraPermission === 'granted') {
        dispatch(setIsScanning(true));
      }
    }
  }, [navigation, dispatch, cameraPermission]);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      dispatch(setIsScanning(false));
    };
  }, [dispatch]);

  // Removed animation effect

  const capturePhoto = async () => {
    if (camera.current && !isFocusing && !isCapturing) {
      let captureTimeout: NodeJS.Timeout | null = null;

      try {
        console.log(`Capturing image ${imageIndex + 1}...`);
        setIsCapturing(true);
        setIsFocusing(true);
        dispatch(clearError());

        // Set a timeout to prevent indefinite hanging
        captureTimeout = setTimeout(() => {
          setIsFocusing(false);
          setIsCapturing(false);
          console.error('Capture operation timed out');
          dispatch(setError('Capture operation timed out. Please try again.'));
        }, 15000); // 15 second timeout

        // Focus on the center of the frame
        try {
          await camera.current?.focus(centerPoint);
          console.log('Camera focused on center point');
        } catch (focusError) {
          console.warn('Focus error:', focusError);
          // Continue with capture even if focus fails
        }

        // Short pause before capture to let any motion settle and focus to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Configure photo options for best quality
        const photoOptions = {
          enableShutterSound: true,
          flash: 'off' as const,
          enableAutoStabilization: false,
        };

        // Take photo with configured options
        const photo = await Promise.race([
          camera.current.takePhoto(photoOptions),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Photo capture timeout')), 10000),
          ),
        ]);

        // Clear the timeout since capture was successful
        if (captureTimeout) {
          clearTimeout(captureTimeout);
          captureTimeout = null;
        }

        const imageUri = `file://${photo.path}`;
        console.log('Image captured:', imageUri);

        // Removed zoom animation

        // Save image to gallery with timeout protection
        try {
          await Promise.race([
            CameraRoll.saveAsset(imageUri, {
              type: 'photo',
              album: 'hyperI Scans',
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Save timeout')), 8000),
            ),
          ]);
          dispatch(setStoragePermission('granted'));
        } catch (saveError) {
          console.error('Error saving image:', saveError);
          dispatch(setStoragePermission('denied'));
          dispatch(setError('Failed to save image to gallery'));
        }

        // Get image dimensions for Redux store with timeout
        const imageSize = await Promise.race([
          new Promise<{ width: number; height: number }>(resolve => {
            require('react-native').Image.getSize(
              imageUri,
              (width: number, height: number) => {
                resolve({ width, height });
              },
              () => {
                resolve({ width: 0, height: 0 });
              },
            );
          }),
          new Promise<{ width: number; height: number }>(resolve =>
            setTimeout(() => resolve({ width: 0, height: 0 }), 3000),
          ),
        ]);

        // Add to Redux store
        dispatch(
          addCapturedImage({
            uri: imageUri,
            index: imageIndex,
            quality: 'high',
            size: imageSize,
          }),
        );

        setIsFocusing(false);
        setIsCapturing(false);

        // Call the callback if provided
        if (onImageCaptured) {
          onImageCaptured(imageUri, imageIndex);
        }

        console.log('Image captured and saved successfully');

        // Navigate back to previous screen after a brief delay to show the zoom effect
        setTimeout(() => {
          navigation.goBack();
        }, 600);
      } catch (error) {
        console.error('Error capturing image:', error);

        // Clear timeout if it exists
        if (captureTimeout) {
          clearTimeout(captureTimeout);
        }

        setIsFocusing(false);
        setIsCapturing(false);
        dispatch(setError('Failed to capture biometric scan. Please try again.'));
        Alert.alert('Capture Error', 'Failed to capture biometric scan. Please try again.');
      }
    }
  };

  const closeCamera = () => {
    dispatch(setIsScanning(false));
    navigation.goBack();
  };

  if (!hasPermission || !deviceBack) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
        <Text style={styles.errorText}>
          {!hasPermission
            ? 'Camera permission required for biometric scanning'
            : 'No camera device found'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={closeCamera}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <StatusBar barStyle="light-content" backgroundColor={ColorPalettes.backgrounds.overlayDark} />
      <Camera
        ref={camera}
        style={styles.camera}
        device={imageIndex < 2 ? deviceBack : deviceFront}
        format={imageIndex < 2 ? backCameraFormat : undefined}
        isActive={true}
        photo={true}
        // torch='on'
      />

      {/* Camera Overlay */}
      <View style={styles.cameraOverlay}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.imageCounter}>Image {imageIndex + 1} of 3</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.instructionText}>
          {isCapturing
            ? 'Capturing image...'
            : isFocusing
            ? 'Focusing camera...'
            : imageIndex === 0
            ? 'Place the front of your ID card in the frame'
            : imageIndex === 1
            ? 'Place the back side of your CNIC in the frame'
            : 'Position your face clearly in the frame for a selfie'}
        </Text>

        {/* Center Section - Multi-Finger Guide */}
        <View style={styles.centerSection}>
          {imageIndex === 2 ? (
            // Selfie overlay
            <View style={styles.selfieOverlay}>
              <View style={styles.faceFrame}>
                <View style={styles.faceFrameInner}>
                  {/* Face outline */}
                  <View style={styles.faceOutline} />

                  {/* Eye guides */}
                  <View style={styles.eyeGuides}>
                    <View style={styles.eyeGuide} />
                    <View style={styles.eyeGuide} />
                  </View>

                  {/* Nose guide */}
                  <View style={styles.noseGuide} />

                  {/* Mouth guide */}
                  <View style={styles.mouthGuide} />
                </View>
              </View>
              <Text style={styles.selfieInstructionText}>
                Position your face within the oval frame
              </Text>
            </View>
          ) : (
            // ID card overlay
            <View style={styles.frameOverlay1}>
              <View
                style={[
                  {
                    width: '100%',
                    height: 5,
                    backgroundColor: 'black',
                    position: 'absolute',
                    bottom: 40,
                  },
                ]}
              />
              <Text style={styles.frameOverlayText}>Place your ID card in the frame</Text>
            </View>
          )}
        </View>

        {/* Bottom Section - Controls */}
        <View style={styles.bottomSection}>
          <View style={styles.captureArea}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                (isFocusing || isCapturing) && styles.captureButtonDisabled,
              ]}
              onPress={capturePhoto}
              disabled={isFocusing || isCapturing}>
              <View style={styles.captureButtonInner}>
                {/* Removed isCapturing indicator for cleaner design */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.transparent.black10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: ColorPalettes.transparent.black10,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: ColorPalettes.transparent.black20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  closeButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.light,
    backgroundColor: ColorPalettes.transparent.black30 + '80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    width: 40,
  },
  instructionText: {
    fontSize: 22,
    color: ColorPalettes.text.light,
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    lineHeight: 30,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fingerprintGuide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameOverlay1: {
    width: width - 10,
    height: 300,
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameOverlayText: {
    position: 'absolute',
    bottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D1384A',
    letterSpacing: 1,
    textAlign: 'center',
    backgroundColor: ColorPalettes.transparent.black30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bottomSection: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  captureArea: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ColorPalettes.transparent.black30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorPalettes.semantic.camera,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: ColorPalettes.text.light,
  },
  captureButtonDisabled: {
    backgroundColor: ColorPalettes.text.disabled,
    shadowOpacity: 0.2,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ColorPalettes.text.light,
  },
  errorText: {
    fontSize: 16,
    color: ColorPalettes.interactive.error,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: ColorPalettes.semantic.camera,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  backButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  selfieOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  faceFrame: {
    width: 320,
    height: 400,
    borderWidth: 3,
    borderColor: '#1E2772',
    borderRadius: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 39, 114, 0.1)',
  },
  faceFrameInner: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  faceOutline: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#1E2772',
    borderRadius: 110,
    borderStyle: 'dashed',
  },
  eyeGuides: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',
    position: 'absolute',
    top: '30%',
  },
  eyeGuide: {
    // width: 12,
    // height: 12,
    // borderWidth: 2,
    // borderColor: '#1E2772',
    // borderRadius: 6,
    // backgroundColor: 'rgba(30, 39, 114, 0.3)',
  },
  noseGuide: {
    width: 8,
    height: 56,
    borderWidth: 2,
    borderColor: '#1E2772',
    borderRadius: 4,
    position: 'absolute',
    top: '45%',
    backgroundColor: 'rgba(30, 39, 114, 0.3)',
  },
  mouthGuide: {
    // width: 30,
    // height: 12,
    // borderWidth: 2,
    // borderColor: '#1E2772',
    // borderRadius: 15,
    // position: 'absolute',
    // top: '65%',
    // backgroundColor: 'rgba(30, 39, 114, 0.3)',
  },
  selfieInstructionText: {
    fontSize: 16,
    color: ColorPalettes.text.light,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    lineHeight: 22,
  },
});

export default CameraScreen;
