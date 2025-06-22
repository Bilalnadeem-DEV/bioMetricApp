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
    
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const capturePhoto = async () => {
    if (camera.current && !isFocusing && !isCapturing) {
      try {
        console.log(`Capturing image ${imageIndex + 1}...`);
        setIsCapturing(true);
        setIsFocusing(true);
        dispatch(clearError());
        
        // Focus on the fingerprint area
        const fingerprintFocusPoint = { x: 0.5, y: 0.6 };
        
        try {
          await camera.current.focus(fingerprintFocusPoint);
          console.log('Focus successful on fingerprint area');
        } catch (focusError) {
          console.log('Focus failed:', focusError);
        }
        
        // Wait for focus to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const photo = await camera.current.takePhoto({
          enableShutterSound: false,
        });
        
        const imageUri = `file://${photo.path}`;
        console.log('Image captured:', imageUri);
        
        // Zoom animation after capture
        Animated.sequence([
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
        ]).start();
        
        // Save image to gallery
        try {
          await CameraRoll.saveAsset(imageUri, {
            type: 'photo',
            album: 'BioSecure Scans'
          });
          dispatch(setStoragePermission('granted'));
        } catch (saveError) {
          console.error('Error saving image:', saveError);
          dispatch(setStoragePermission('denied'));
          dispatch(setError('Failed to save image to gallery'));
        }
        
        // Get image dimensions for Redux store
        const imageSize = await new Promise<{width: number, height: number}>((resolve) => {
          require('react-native').Image.getSize(imageUri, (width: number, height: number) => {
            resolve({ width, height });
          }, () => {
            resolve({ width: 0, height: 0 });
          });
        });
        
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
        <StatusBar barStyle="dark-content" backgroundColor="#FBF5FE" />
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
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
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
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    borderColor: '#3b82f6',
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
    borderColor: '#9ca3af',
    borderRadius: 45,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#6b7280',
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
  },
  fingerprintText: {
    position: 'absolute',
    bottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
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
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  captureButtonDisabled: {
    backgroundColor: '#6b7280',
    shadowOpacity: 0.2,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen; 