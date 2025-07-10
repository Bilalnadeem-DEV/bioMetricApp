import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  startScanSession,
  endScanSession,
  addCapturedImage,
  clearBiometricData,
  setError,
  clearError,
} from '../store/slices/biometricSlice';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { ColorPalettes } from '../theme/helpers/colorPalettes';
import { biometricService } from '../services/biometric.service';
import { setLoggedInUserDetail } from '../store/slices/userSlice';
import Toast from 'react-native-toast-message';

type BiometricLoginNavigationProp = StackNavigationProp<RootStackParamList, 'BiometricLogin'>;

interface BiometricLoginProps {
  navigation: BiometricLoginNavigationProp;
}

const { width, height } = Dimensions.get('window');

const BiometricLogin: React.FC<BiometricLoginProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const userName = useAppSelector(state => state.user.name);
  const scanConfig = useAppSelector(state => state.scan);
  const {
    capturedImages,
    isScanning,
    currentSession,
    error: biometricError,
    totalScansCompleted,
  } = useAppSelector(state => state.biometric);

  // Local state for SDK management
  const [captureStatus, setCaptureStatus] = useState<string>('Loading fingerprint service...');
  const [fingerRects, setFingerRects] = useState<any[]>([]);
  const [fingerprintSDK, setFingerprintSDK] = useState<any>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { CNIC } = useAppSelector(state => state.user);

  // Add cleanup state to track if component is unmounting
  const [isUnmounting, setIsUnmounting] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        const sdk = await import('@biopassid/fingerprint-sdk-react-native');
        setFingerprintSDK(sdk);
        setSdkLoaded(true);
        setCaptureStatus('Bio metric service is live');
        dispatch(clearError());
      } catch (error) {
        console.error('Failed to load fingerprint service:', error);
        setSdkError('Fingerprint service not available. Please restart the app.');
        setCaptureStatus('Service temporarily unavailable');
        dispatch(setError('Fingerprint service not available'));
      }
    };

    loadSDK();

    // Cleanup function to handle component unmounting
    return () => {
      stopScanning();
      setIsUnmounting(true);
      // Clear any ongoing scan sessions
      dispatch(endScanSession({ status: 'cancelled' }));
      // Clear biometric data
      dispatch(clearBiometricData());
      // Reset states
      setCaptureStatus('Service stopped');
      setFingerRects([]);
    };
  }, [dispatch]);

  useEffect(() => {
    setShowInstructions(true);
  }, [dispatch]);

  const configg = {
    licenseKey: '9KM2-DLW6-E8VY-ADFI',
    numberFingersToCapture: 4,
    captureType: scanConfig.captureType,
    outputType: scanConfig.outputType,
    timeToCapture: scanConfig.timeToCapture,
    overlayColor: scanConfig.overlayColor,
    imageQuality: {
      compressionQuality: scanConfig.imageQuality.compressionQuality,
      imageFormat: scanConfig.imageQuality.imageFormat,
      enableHighResolution: scanConfig.imageQuality.enableHighResolution,
      antiAliasing: scanConfig.imageQuality.antiAliasing,
    },
    cameraSettings: {
      focusMode: scanConfig.cameraSettings.focusMode,
      exposureMode: scanConfig.cameraSettings.exposureMode,
      whiteBalanceMode: scanConfig.cameraSettings.whiteBalanceMode,
      stabilization: scanConfig.cameraSettings.stabilization,
      highQualityMode: scanConfig.cameraSettings.highQualityMode,
    },
    processingSettings: {
      enableNoiseReduction: scanConfig.processingSettings.enableNoiseReduction,
      enableSharpening: scanConfig.processingSettings.enableSharpening,
      contrastEnhancement: scanConfig.processingSettings.contrastEnhancement,
      brightnessAdjustment: scanConfig.processingSettings.brightnessAdjustment,
      qualityThreshold: scanConfig.processingSettings.qualityThreshold,
    },
    captureCountdown: {
      enabled: scanConfig.captureCountdown.enabled,
      backgroundColor: scanConfig.captureCountdown.backgroundColor,
      progressColor: scanConfig.captureCountdown.progressColor,
      textColor: scanConfig.captureCountdown.textColor,
      countdownDuration: scanConfig.captureCountdown.countdownDuration,
    },
    backButton: {
      enabled: scanConfig.backButton.enabled,
      backgroundColor: scanConfig.backButton.backgroundColor,
      buttonPadding: scanConfig.backButton.buttonPadding,
      buttonSize: { width: 56, height: 56 },
      iconOptions: {
        enabled: true,
        iconFile: 'fingerprintsdk_ic_close',
        iconColor: ColorPalettes.text.light,
        iconSize: { width: 32, height: 32 },
      },
      labelOptions: {
        enabled: false,
        content: 'Back',
        textColor: ColorPalettes.text.light,
        textSize: 14,
      },
    },
    helpText: {
      enabled: scanConfig.helpText.enabled,
      messages: {
        leftHandMessage: 
          'Place your left hand (without thumb)\nuntil the marker is centered.',
        rightHandMessage:
          'Place your right hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        thumbsMessage:
          'Place your thumbs\nuntil the marker is centered.\nHold steady for sharp images.',
      },
      textColor: scanConfig.helpText.textColor,
      textSize: scanConfig.helpText.textSize,      
    },
    fingerEllipse: {
      enabled: scanConfig.fingerEllipse.enabled,
      thickness: scanConfig.fingerEllipse.thickness,
    },
    distanceIndicator: {
      enabled: scanConfig.distanceIndicator.enabled,
      selectedBarColor: scanConfig.distanceIndicator.selectedBarColor,
      unselectedBarColor: scanConfig.distanceIndicator.unselectedBarColor,
      arrowColor: scanConfig.distanceIndicator.arrowColor,
      sensitivity: scanConfig.distanceIndicator.sensitivity,
      tooCloseText: {
        enabled: true,
        content: 'Too close',
        textColor: ColorPalettes.interactive.error,
        textSize: 16,
      },
      tooFarText: {
        enabled: true,
        content: 'Too far',
        textColor: ColorPalettes.interactive.error,
        textSize: 16,
      },
      perfectDistanceText: {
        enabled: true,
        content: 'Perfect distance - hold steady!',
        textColor: ColorPalettes.interactive.success,
        textSize: 16,
      },
    },
    motionDetection: {
      enabled: scanConfig.motionDetection.enabled,
      sensitivity: scanConfig.motionDetection.sensitivity,
      stabilizationTime: scanConfig.motionDetection.stabilizationTime,
      motionThreshold: scanConfig.motionDetection.motionThreshold,
    },
    qualityValidation: {
      enabled: scanConfig.qualityValidation.enabled,
      minimumQualityScore: scanConfig.qualityValidation.minimumQualityScore,
      rejectBlurryImages: scanConfig.qualityValidation.rejectBlurryImages,
      rejectLowContrastImages: scanConfig.qualityValidation.rejectLowContrastImages,
      enableQualityFeedback: scanConfig.qualityValidation.enableQualityFeedback,
    },
  };

  const config = {
    licenseKey: '9KM2-DLW6-E8VY-ADFI',
    numberFingersToCapture: 4,
    captureType: 'LEFT_HAND_FINGERS',
    outputType: 'CAPTURE_AND_SEGMENTATION',
    timeToCapture: 1,
    overlayColor: ColorPalettes.transparent.black30,
    imageQuality: {
      compressionQuality: 100,
      imageFormat: 'PNG',
      enableHighResolution: true,
      antiAliasing: true,
    },
    cameraSettings: {
      focusMode: 'auto',
      exposureMode: 'auto',
      whiteBalanceMode: 'auto',
      stabilization: true,
      highQualityMode: true,
    },
    processingSettings: {
      enableNoiseReduction: true,
      enableSharpening: true,
      contrastEnhancement: true,
      brightnessAdjustment: 'auto',
      qualityThreshold: 80,
    },

    captureCountdown: {
      enabled: true,
      backgroundColor: ColorPalettes.transparent.black20,
      progressColor: ColorPalettes.semantic.fingerprint,
      textColor: ColorPalettes.text.light,
      countdownDuration: 2,
    },
    backButton: {
      enabled: true,
      backgroundColor: ColorPalettes.transparent.clear,
      buttonPadding: 20,
      buttonSize: { width: 56, height: 56 },
      iconOptions: {
        enabled: true,
        iconFile: 'fingerprintsdk_ic_close',
        iconColor: ColorPalettes.text.light,
        iconSize: { width: 32, height: 32 },
      },
      labelOptions: {
        enabled: false,
        content: 'Back',
        textColor: ColorPalettes.text.light,
        textSize: 14,
      },
    },
    helpText: {
      enabled: true,
      messages: {
        leftHandMessage: 
          'Place your left hand (without thumb)\nuntil the marker is centered.',
        rightHandMessage:
          'Place your right hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        thumbsMessage:
          'Place your thumbs\nuntil the marker is centered.\nHold steady for sharp images.',
      },
      textColor: ColorPalettes.text.light,
      textSize: 20,      
    },
    fingerEllipse: {
      enabled: true,
      // ellipseColor: ColorPalettes.semantic.fingerprint + '80',
      thickness: 3,
    },
    distanceIndicator: {
      enabled: true,
      selectedBarColor: ColorPalettes.semantic.fingerprint,
      unselectedBarColor: ColorPalettes.text.light,
      arrowColor: ColorPalettes.semantic.fingerprint,
      sensitivity: 'medium',
      tooCloseText: {
        enabled: true,
        content: 'Too close',
        textColor: ColorPalettes.interactive.error,
        textSize: 16,
      },
      tooFarText: {
        enabled: true,
        content: 'Too far',
        textColor: ColorPalettes.interactive.error,
        textSize: 16,
      },
      perfectDistanceText: {
        enabled: true,
        content: 'Perfect distance - hold steady!',
        textColor: ColorPalettes.interactive.success,
        textSize: 16,
      },
    },
    motionDetection: {
      enabled: true,
      sensitivity: 'low',
      stabilizationTime: 1,
      motionThreshold: 1.0,
    },
    qualityValidation: {
      enabled: true,
      minimumQualityScore: 75,
      rejectBlurryImages: true,
      rejectLowContrastImages: true,
      enableQualityFeedback: true,
    },
  };

  const handleBack = () => {
    // Set unmounting flag to prevent further SDK operations
    setIsUnmounting(true);

    // Clear any ongoing scan sessions
    dispatch(endScanSession({ status: 'cancelled' }));

    // Clear biometric data
    dispatch(clearBiometricData());

    // Reset states
    setCaptureStatus('Service stopped');
    setFingerRects([]);

    // Navigate back
    navigation.goBack();
  };

  const handleCaptureFingerprints = async () => {
    if (!sdkLoaded || !fingerprintSDK) {
      Alert.alert(
        'Service Unavailable',
        'The fingerprint service is not available right now. Please:\n\n1. Close the app completely\n2. Restart the app\n3. Try again',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      // Start scan session in Redux
      dispatch(startScanSession({ userName: userName || 'Unknown User' }));
      setCaptureStatus('Preparing fingerprint capture...');

      const { useFingerprint } = fingerprintSDK;
      const { takeFingerprint } = useFingerprint();

      await takeFingerprint({
        config,
        onFingerCapture: (images: string[], error: string | null) => {
          if (error) {
            setCaptureStatus(`Capture failed: ${error}`);
            dispatch(endScanSession({ status: 'error', error }));
            Alert.alert('Capture Error', error);
          } else {
            // Validate and process each captured image
            const processedImages: any[] = [];
            let qualityIssues = 0;

            images.forEach((imageBase64, index) => {
              const imageSize = imageBase64.length;
              const estimatedQuality =
                imageSize > 50000 ? 'high' : imageSize > 20000 ? 'medium' : 'low';

              // Store with enhanced metadata
              const processedImage = {
                uri: `data:image/jpeg;base64,${imageBase64}`,
                index,
                quality: estimatedQuality as 'low' | 'medium' | 'high',
                size: { width: 1280, height: 720 },
                fileSize: imageSize,
                processingTimestamp: new Date().toISOString(),
                qualityScore:
                  estimatedQuality === 'high' ? 90 : estimatedQuality === 'medium' ? 70 : 50,
              };

              processedImages.push(processedImage);

              dispatch(addCapturedImage(processedImage));
            });

            setCaptureStatus(`Successfully captured ${images.length} high-quality fingerprint(s)`);
            dispatch(endScanSession({ status: 'completed' }));

            // Show quality feedback
            const qualityMessage =
              qualityIssues > 0
                ? `Captured ${images.length} images. ${qualityIssues} may need recapture for optimal quality.`
                : `Captured ${images.length} high-quality fingerprint images!`;

            Alert.alert('Capture Complete!', `${qualityMessage}`, [
              {
                text: 'View Images',
                onPress: () => handleSendBiometric(),
              },
              { text: 'OK' },
            ]);
          }
        },
        onStatusChanged: (state: any) => {
          console.log('Capture status changed:', state);
          // Enhanced status handling for better image quality feedback
          const statusMap: { [key: string]: string } = {
            NO_DETECTION: 'No fingers detected - place hand on scanner',
            MISSING_FINGERS: 'Missing fingers - place all 4 fingers for complete capture',
            TOO_CLOSE: 'Too close - move hand away for better focus and sharpness',
            TOO_FAR: 'Too far - bring hand closer for high-resolution capture',
            MOTION_DETECTED: 'Hand movement detected - hold steady for sharp images',
            POOR_LIGHTING: 'Poor lighting - ensure adequate lighting for clear images',
            LOW_QUALITY: 'Low quality detected - adjust hand position',
            BLUR_DETECTED: 'Motion blur detected - hold hand completely still',
            FOCUS_ADJUSTING: 'Camera focusing - hold steady for optimal sharpness',
            STABILIZING: 'Stabilizing - preparing for high-quality capture',
            OK: 'Perfect position - capturing high-quality images...',
            PROCESSING: 'Processing high-resolution fingerprints...',
            QUALITY_CHECK: 'Validating image quality...',
            STOPPED: 'Capture stopped',
            MODEL_NOT_FOUND: 'AI model not found - check SDK installation',
            READY: 'Ready for high-quality capture',
          };

          const statusText =
            statusMap[state] || statusMap[state.toString()] || 'Preparing for capture...';
          setCaptureStatus(statusText);

          // Provide additional quality tips based on status
          if (state === 'MOTION_DETECTED' || state === 'BLUR_DETECTED') {
            console.log('💡 Quality tip: Hold hand completely still for 2-3 seconds');
          } else if (state === 'TOO_CLOSE' || state === 'TOO_FAR') {
            console.log('💡 Quality tip: Proper distance is crucial for sharp images');
          } else if (state === 'POOR_LIGHTING') {
            console.log('💡 Quality tip: Move to better lighting for clearer images');
          }
        },
        onFingerDetected: (fingerRects: any[]) => {
          console.log('Fingers detected:', fingerRects.length);
          setFingerRects(fingerRects);
        },
      });
    } catch (error) {
      setCaptureStatus('Capture failed');
      dispatch(
        endScanSession({ status: 'error', error: 'Failed to initialize fingerprint capture' }),
      );
      console.error('Fingerprint capture error:', error);
      Alert.alert(
        'Error',
        'Failed to initialize fingerprint capture. Please ensure the SDK is properly linked.',
      );
    }
  };

  const handleClearImages = () => {
    // Stop any ongoing scanning
    stopScanning();

    dispatch(clearBiometricData());
    setCaptureStatus(sdkLoaded ? 'Bio metric service is live' : 'Service temporarily unavailable');
    setFingerRects([]);
  };

  const stopScanning = () => {
    // Set unmounting flag to stop SDK operations
    setIsUnmounting(true);

    // Clear any ongoing scan sessions
    dispatch(endScanSession({ status: 'cancelled' }));

    // Reset states
    setCaptureStatus('Scanning stopped');
    setFingerRects([]);

    // Reset unmounting flag after a brief delay to allow for cleanup
    setTimeout(() => {
      setIsUnmounting(false);
      setCaptureStatus(
        sdkLoaded ? 'Bio metric service is live' : 'Service temporarily unavailable',
      );
    }, 1000);
  };

  const handleRebuildInstructions = () => {
    Alert.alert(
      'Rebuild Instructions',
      'To properly use the fingerprint service:\n\n1. Close the app completely\n2. Restart the app\n3. Try again',
      [{ text: 'Got it!' }],
    );
  };

  const handleSendBiometric = async () => {
    // console.log('capturedImages', capturedImages.length);
    if (!capturedImages || capturedImages.length < 4) {
      Alert.alert(
        'Missing Fingerprints',
        'Please capture all four fingerprints before authentication.',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      // Map captured images to their respective fingers
      const fingerMap = {
        index_finger: capturedImages[0]?.uri || null,
        middle_finger: capturedImages[1]?.uri || null,
        ring_finger: capturedImages[2]?.uri || null,
        pinky_finger: capturedImages[3]?.uri || null,
      };

      // Get CNIC from user store or use a default for testing
      const userCnic = CNIC;

      const authData = {
        cnic: userCnic,
        ...fingerMap,
      };

      console.log('authData', authData);
      // Start the API call
      setIsRegistering(true);
      const response = await biometricService.authenticate(authData);
      console.log('response', response);
      if (response.user_data) {
        dispatch(
          setLoggedInUserDetail({
            firstName: response.user_data.first_name,
            lastName: response.user_data.last_name,
            cnic: response.user_data.cnic,
            dateOfBirth: response.user_data.date_of_birth,
            is_verified: response.user_data.is_verified,
          }),
        );
      }

      setIsRegistering(false);
      if (response.authenticated) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Biometric verification completed successfully!',
          position: 'top',
          visibilityTime: 3000,
          text1Style: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          text2Style: {
            fontSize: 16,
          },
        });
        Alert.alert(
          'Authentication Successful!',
          `Welcome back, ${response.user_data?.first_name} ${response.user_data?.last_name}!\n\nMatches found: ${response.matches_found}/${response.required_matches}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear the biometric data
                dispatch(clearBiometricData());
                // Navigate to home screen
                navigation.pop(2);
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Authentication Failed',
          `${response.message}\n\nMatches found: ${response.matches_found}/${response.required_matches}\n\nPlease try again with better finger positioning.`,
          [{ text: 'OK', onPress: () => handleClearImages() }            
          ],
        );
      }
    } catch (error: any) {
      setIsRegistering(false);
      console.error('Authentication failed:', error);
      Alert.alert(
        'Authentication Error',
        error.message || 'Failed to authenticate biometric data',
        [{ text: 'OK' }],
      );
    }
  };

  const LoadingOverlay = () => (
    <Modal transparent visible={isRegistering}>
      <View style={styles.overlayContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1E2772" />
          <Text style={styles.loadingText}>Authenticating Fingerprints...</Text>
        </View>
      </View>
    </Modal>
  );


  const checkAndRequestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        // On iOS, permissions are handled automatically by CameraRoll
        return true;
      } else {
        // On Android, we might need to check permissions
        // For now, we'll assume permissions are granted
        // The CameraRoll library should handle permission requests
        return true;
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  const saveBase64ImageToFile = async (base64Data: string, imageIndex: number): Promise<string> => {
    try {
      // Extract base64 data (remove data:image/jpeg;base64, prefix if present)
      const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

      // Create a temporary file path
      const fileName = `fingerprint_${Date.now()}_${imageIndex}.jpg`;
      const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

      // Write base64 data to file
      await RNFS.writeFile(filePath, base64Image, 'base64');

      console.log('Temporary file created:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error creating temporary file:', error);
      throw error;
    }
  };

  const saveImageToGallery = async (imageUri: string, imageIndex: number) => {
    try {
      // Validate the image URI
      if (!imageUri || typeof imageUri !== 'string') {
        throw new Error('Invalid image URI');
      }

      // Check permissions first
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        throw new Error('Photo library permission denied');
      }

      console.log('Starting save process for image:', {
        imageIndex,
        uriStart: imageUri.substring(0, 50) + '...',
      });

      let filePathToSave: string;

      // If it's a base64 data URI, convert to file first
      if (imageUri.startsWith('data:image/')) {
        console.log('Converting base64 to file...');
        filePathToSave = await saveBase64ImageToFile(imageUri, imageIndex);
      } else {
        // If it's already a file path, use it directly
        filePathToSave = imageUri;
      }

      console.log('Saving file to camera roll:', filePathToSave);

      // Save to camera roll
      let result;
      if (Platform.OS === 'ios') {
        result = await CameraRoll.save(filePathToSave, { type: 'photo' });
      } else {
        // Try with album first, fallback to no album
        try {
          result = await CameraRoll.save(filePathToSave, {
            type: 'photo',
            album: 'hyperI Fingerprints',
          });
        } catch (albumError) {
          console.log('Album creation failed, trying without album:', albumError);
          result = await CameraRoll.save(filePathToSave, { type: 'photo' });
        }
      }

      // Clean up temporary file if we created one
      if (
        imageUri.startsWith('data:image/') &&
        filePathToSave.includes(RNFS.TemporaryDirectoryPath)
      ) {
        try {
          await RNFS.unlink(filePathToSave);
          console.log('Temporary file cleaned up');
        } catch (cleanupError) {
          console.log('Failed to cleanup temporary file:', cleanupError);
        }
      }

      Alert.alert(
        'Success!',
        `Fingerprint image ${imageIndex + 1} has been saved to your photo gallery.`,
        [
          {
            text: 'OK',
            onPress: () => console.log('Image saved successfully:', result),
          },
        ],
      );

      console.log('Image saved to gallery:', result);
    } catch (error) {
      console.error('Error saving image to gallery:', error);

      let errorMessage = 'Failed to save image to gallery.';
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('denied')) {
          errorMessage = 'Permission denied. Please allow photo library access in Settings.';
        } else if (error.message.includes('space')) {
          errorMessage = 'Not enough storage space to save the image.';
        } else if (error.message.includes('Invalid')) {
          errorMessage = 'Invalid image format. Please try capturing again.';
        } else {
          errorMessage = `Save failed: ${error.message}`;
        }
      }

      Alert.alert(
        'Save Failed',
        errorMessage + '\n\nPlease check your device settings and try again.',
        [
          {
            text: 'Open Settings Guide',
            onPress: () => {
              Alert.alert(
                'Settings Guide',
                Platform.OS === 'ios'
                  ? 'Go to Settings > Privacy & Security > Photos > hyperI and enable "Add Photos Only" or "Full Access".'
                  : 'Go to Settings > Apps > hyperI > Permissions > Storage and enable it.',
                [{ text: 'Got it' }],
              );
            },
          },
          { text: 'Cancel' },
        ],
      );
    }
  };

  const InstructionsModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showInstructions}
      onRequestClose={() => setShowInstructions(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowInstructions(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.instructionsHeader}>
            <Text style={styles.instructionText}>• Use your left hand</Text>
            <Text style={styles.instructionText}>• Use good lighting conditions</Text>
          </View>
          <Image
            source={require('../../assets/images/hyper-i-instructions-2.png')}
            style={styles.instructionImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={() => setShowInstructions(false)}
          >
            <Text style={styles.dismissButtonText}>TAP TO DISMISS</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
      {InstructionsModal()}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/mainAppLogo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>Secure biometric authentication</Text>
        </View>

        {sdkError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Service Unavailable</Text>
            <Text style={styles.errorText}>
              The fingerprint service is temporarily unavailable. Please follow these steps:
            </Text>
            <Text style={styles.errorStep}>1. Close the app completely</Text>
            <Text style={styles.errorStep}>2. Restart the app</Text>
            <Text style={styles.errorStep}>3. Try again</Text>

            <TouchableOpacity style={styles.helpButton} onPress={handleRebuildInstructions}>
              <Text style={styles.helpButtonText}>Get Help</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, !sdkLoaded && styles.captureButtonDisabled]}
            onPress={handleCaptureFingerprints}
            disabled={!sdkLoaded}>
            <Text style={styles.captureButtonText}>
              {!sdkLoaded ? 'Service Unavailable' : 'Ready to scan ?'}
            </Text>
          </TouchableOpacity>
        </View>
        {capturedImages.length > 0 && (         
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Captured Fingerprints:</Text>
            <Text style={styles.instructionText}>Please verify the following requirements:</Text>
            <Text style={styles.checklistItem}>✓ All four fingers are clearly visible in the image</Text>
            <Text style={styles.checklistItem}>✓ The image is sharp and not blurry</Text>
            <Text style={styles.checklistItem}>✓ Each fingerprint has distinct ridge patterns</Text>
            <Text style={styles.checklistItem}>✓ The lighting is adequate and even</Text>
            <Text style={styles.checklistItem}>✓ The hand position is stable with no motion blur</Text>
            <Text style={styles.checklistItem}>✓ The image quality score is above 75/100</Text>
            <Text style={[styles.instructionText, styles.warningText]}>⚠️ If any of the above requirements are not met, please retake the fingerprint scan</Text>

            <View style={styles.imageGrid}>
              {capturedImages.map((image, index) => (
                <View key={`${image.timestamp}-${index}`} style={styles.imageContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.fingerprintImage}
                    resizeMode='cover'
                  />
                  <Text style={styles.imageLabel}>
                    Finger {image.index + 1}
                  </Text>
                  <Text style={styles.imageTimestamp}>
                    {new Date(image.timestamp).toLocaleTimeString()}
                  </Text>
                  {image.quality && (
                    <Text style={[
                      styles.imageQuality,
                      image.quality === 'high' && styles.qualityHigh,
                      image.quality === 'medium' && styles.qualityMedium,
                      image.quality === 'low' && styles.qualityLow,
                    ]}>
                      Quality: {image.quality.toUpperCase()}
                    </Text>
                  )}
                  {image.qualityScore && (
                    <Text style={styles.qualityScore}>
                      Score: {image.qualityScore}/100
                    </Text>
                  )}
                  {image.fileSize && (
                    <Text style={styles.fileSize}>
                      Size: {Math.round(image.fileSize / 1024)}KB
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.saveImageButton}
                    onPress={() => saveImageToGallery(image.uri, image.index)}
                  >
                    <Text style={styles.saveImageButtonText}>💾 Save</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )} 
      </ScrollView>
      {capturedImages && capturedImages.length > 0 && (
        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSendBiometric}>
            <Text style={styles.buttonText}>Send for verification</Text>
          </TouchableOpacity>
        </View>
      )}
      {isRegistering && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 170,
    height: 170,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: ColorPalettes.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ColorPalettes.brand.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: ColorPalettes.borders.light,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    fontWeight: '300',
  },
  statusContainer: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalettes.text.secondary,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: ColorPalettes.text.primary,
    fontWeight: '500',
  },
  statusActive: {
    color: ColorPalettes.semantic.fingerprint,
  },
  statusError: {
    color: ColorPalettes.interactive.error,
  },
  statusSuccess: {
    color: ColorPalettes.interactive.success,
  },
  fingerCount: {
    fontSize: 14,
    color: ColorPalettes.interactive.success,
    fontWeight: '500',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: ColorPalettes.interactive.error + '0D',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.interactive.error + '40',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalettes.interactive.error,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: ColorPalettes.interactive.error + 'CC',
    marginBottom: 15,
    lineHeight: 20,
  },
  errorStep: {
    fontSize: 14,
    color: ColorPalettes.interactive.error + 'CC',
    marginBottom: 5,
    paddingLeft: 10,
  },
  helpButton: {
    backgroundColor: ColorPalettes.interactive.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  helpButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  captureButton: {
    backgroundColor: '#1E2772',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: 200,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  captureButtonDisabled: {
    backgroundColor: ColorPalettes.text.disabled,
    opacity: 0.6,
  },
  captureButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  saveAllButton: {
    backgroundColor: ColorPalettes.interactive.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  saveAllButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: ColorPalettes.interactive.error,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  stopButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: ColorPalettes.interactive.warning,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  clearButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  fingerprintImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  imageLabel: {
    fontSize: 12,
    color: ColorPalettes.text.secondary,
    marginTop: 5,
    fontWeight: '500',
  },
  imageTimestamp: {
    fontSize: 12,
    color: ColorPalettes.text.secondary,
    marginTop: 2,
    fontWeight: '300',
  },
  imageQuality: {
    fontSize: 12,
    color: ColorPalettes.text.secondary,
    marginTop: 2,
    fontWeight: '300',
  },
  qualityHigh: {
    color: ColorPalettes.quality.high,
    fontWeight: '500',
  },
  qualityMedium: {
    color: ColorPalettes.quality.medium,
    fontWeight: '500',
  },
  qualityLow: {
    color: ColorPalettes.quality.low,
    fontWeight: '500',
  },
  qualityScore: {
    fontSize: 12,
    color: ColorPalettes.text.secondary,
    marginTop: 2,
    fontWeight: '300',
  },
  fileSize: {
    fontSize: 12,
    color: ColorPalettes.text.secondary,
    marginTop: 2,
    fontWeight: '300',
  },
  reduxInfo: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  licenseText: {
    fontSize: 14,
    color: ColorPalettes.semantic.fingerprint,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  reduxStateText: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    marginBottom: 5,
  },
  reduxErrorText: {
    fontSize: 14,
    color: ColorPalettes.interactive.error,
    marginBottom: 15,
  },
  qualityTip: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  saveImageButton: {
    backgroundColor: ColorPalettes.interactive.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  saveImageButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: ColorPalettes.interactive.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  sendButton: {
    backgroundColor: '#1E2772',
    marginBottom: 10,
    marginTop: 18,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    width: '100%',
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 15,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfoLabel: {
    fontSize: 16,
    color: ColorPalettes.text.secondary,
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 16,
    color: ColorPalettes.text.primary,
    fontWeight: '600',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: ColorPalettes.text.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionImage: {
    marginTop: 40,
    width: width,
    height: height * 0.9,
  },
  instructionsHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  instructionText: {
    color: 'black',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    // textShadowColor: 'rgba(0, 0, 0, 0.75)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 3,
  },
  dismissButton: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: '#1E2772',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 48,
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  checklistItem: {
    fontSize: 14,
    color: ColorPalettes.text.dark,
    marginVertical: 4,
    paddingLeft: 10,
  },
  warningText: {
    color: ColorPalettes.interactive.error,
    marginTop: 10,
    fontWeight: '500',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ColorPalettes.backgrounds.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default BiometricLogin;
