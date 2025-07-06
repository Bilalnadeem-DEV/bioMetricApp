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
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
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
  addCapturedImage 
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
  const { 
    cameraPermission, 
    storagePermission, 
    isScanning, 
    error,
    currentSession 
  } = useAppSelector((state) => state.biometric);
  
  const [hasPermission, setHasPermission] = useState(cameraPermission === 'granted');
  const [isFocusing, setIsFocusing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const { imageIndex = 0, onImageCaptured } = route.params || {};
  
  // Find the back camera
  const device = devices.find(d => d.position === 'back') || devices[0];

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

  useEffect(() => {
    // Start pulsing animation for the capture area
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => {
      pulseAnimation.stop();
      pulseAnimation.reset();
    };
  }, [pulseAnim]);

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
        
        // Focus on the fingerprint area
        const fingerprintFocusPoint = { x: 0.5, y: 0.6 };
        
        try {
          await Promise.race([
            camera.current.focus(fingerprintFocusPoint),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Focus timeout')), 5000)
            )
          ]);
          console.log('Focus successful on fingerprint area');
        } catch (focusError) {
          console.log('Focus failed:', focusError);
          // Continue without focus if it fails
        }
        
        // Wait for focus to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const photo = await Promise.race([
          camera.current.takePhoto({
            enableShutterSound: false,
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Photo capture timeout')), 10000)
          )
        ]);
        
        // Clear the timeout since capture was successful
        if (captureTimeout) {
          clearTimeout(captureTimeout);
          captureTimeout = null;
        }
        
        const imageUri = `file://${photo.path}`;
        console.log('Image captured:', imageUri);
        
        // Zoom animation after capture
        const zoomAnimation = Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]);
        zoomAnimation.start();
        
        // Save image to gallery with timeout protection
        try {
          await Promise.race([
            CameraRoll.saveAsset(imageUri, {
              type: 'photo',
              album: 'hyperI Scans'
            }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Save timeout')), 8000)
            )
          ]);
          dispatch(setStoragePermission('granted'));
        } catch (saveError) {
          console.error('Error saving image:', saveError);
          dispatch(setStoragePermission('denied'));
          dispatch(setError('Failed to save image to gallery'));
        }
        
        // Get image dimensions for Redux store with timeout
        const imageSize = await Promise.race([
          new Promise<{width: number, height: number}>((resolve) => {
            require('react-native').Image.getSize(imageUri, (width: number, height: number) => {
              resolve({ width, height });
            }, () => {
              resolve({ width: 0, height: 0 });
            });
          }),
          new Promise<{width: number, height: number}>((resolve) => 
            setTimeout(() => resolve({ width: 0, height: 0 }), 3000)
          )
        ]);
        
        // Add to Redux store
        dispatch(addCapturedImage({
          uri: imageUri,
          index: imageIndex,
          quality: 'high',
          size: imageSize,
        }));
        
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

  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
        <Text style={styles.errorText}>
          {!hasPermission ? 'Camera permission required for biometric scanning' : 'No camera device found'}
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
        device={device}
        isActive={true}
        photo={true}
        torch='on'
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
                : 'Place 4 fingers vertically from the side'}
          </Text>

        {/* Center Section - Multi-Finger Guide */}
        <View style={styles.centerSection}>
          <Animated.View 
            style={[
              styles.fingerprintGuide,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.multiFingerprintFrame}>
              <View style={styles.fingerSlots}>
                <View style={styles.fingerSlot}>
                  {/* <View style={styles.innerCircle} /> */}
                </View>
                <View style={styles.fingerSlot}>
                  {/* <View style={styles.innerCircle} /> */}
                </View>
                <View style={styles.fingerSlot}>
                  {/* <View style={styles.innerCircle} /> */}
                </View>
                <View style={styles.fingerSlot}>
                  {/* <View style={styles.innerCircle} /> */}
                </View>
              </View>
              <Text style={styles.fingerprintText}>SIDE SCAN</Text>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Section - Controls */}
        <View style={styles.bottomSection}>
          <View style={styles.captureArea}>
            <TouchableOpacity 
              style={[
                styles.captureButton,
                (isFocusing || isCapturing) && styles.captureButtonDisabled
              ]} 
              onPress={capturePhoto}
              disabled={isFocusing || isCapturing}
            >
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
    backgroundColor: ColorPalettes.backgrounds.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.overlayDark,
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
    backgroundColor: ColorPalettes.transparent.black30,
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
    backgroundColor: ColorPalettes.semantic.camera + '80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    width: 40,
  },
  instructionText: {
    fontSize: 16,
    color: ColorPalettes.text.light,
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: ColorPalettes.transparent.black20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
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
  multiFingerprintFrame: {
    width: 320,
    height: 550,
    borderWidth: 3,
    borderColor: ColorPalettes.semantic.camera,
    borderRadius: 20,
    backgroundColor: ColorPalettes.semantic.camera + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fingerSlots: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 40,
  },
  fingerSlot: {
    width: 190,
    height: 90,
    borderWidth: 2,
    borderColor: ColorPalettes.borders.light,
    borderRadius: 45,
    backgroundColor: ColorPalettes.borders.light + '1A',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: ColorPalettes.text.disabled,
    backgroundColor: ColorPalettes.text.disabled + '33',
  },
  fingerprintText: {
    position: 'absolute',
    bottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: ColorPalettes.semantic.camera,
    letterSpacing: 1,
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
    backgroundColor: ColorPalettes.semantic.camera,
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
});

export default CameraScreen; 