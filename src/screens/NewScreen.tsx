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

type NewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewScreen'>;

interface NewScreenProps {
  navigation: NewScreenNavigationProp;
}

const NewScreen: React.FC<NewScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  
  // Get data from Redux store
  const userName = useAppSelector((state) => state.user.name);
  const {
    capturedImages,
    isScanning,
    currentSession,
    error: biometricError,
    totalScansCompleted,
  } = useAppSelector((state) => state.biometric);

  // Local state for SDK management
  const [captureStatus, setCaptureStatus] = useState<string>('Bio metric service is live');
  const [fingerRects, setFingerRects] = useState<any[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [fingerprintSDK, setFingerprintSDK] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const {CNIC, name, firstName, lastName, dateOfBirth} = useAppSelector((state) => state.user)

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
  }, [dispatch]);

  const config = {
    licenseKey: '9KM2-DLW6-E8VY-ADFI',
    numberFingersToCapture: 4,
    captureType: 'LEFT_HAND_FINGERS',    
    outputType: 'CAPTURE_AND_SEGMENTATION',
    timeToCapture: 1,
    overlayColor: ColorPalettes.transparent.black30,
    imageQuality: {
      compressionQuality: 90,
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
      buttonPadding: 0,
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
      enabled: false,
      messages: {
        leftHandMessage: 'Place your left hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        rightHandMessage: 'Place your right hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        thumbsMessage: 'Place your thumbs\nuntil the marker is centered.\nHold steady for sharp images.',
      },
      textColor: ColorPalettes.text.light,
      textSize: 16,
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
      sensitivity: 'low',
      tooCloseText: {
        enabled: false,
        content: 'Too close - move hand away for better focus',
        textColor: ColorPalettes.interactive.error,
        textSize: 16,
      },
      tooFarText: {
        enabled: false,
        content: 'Too far - bring hand closer for sharp capture',
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
      sensitivity: 'medium',
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
    navigation.goBack();
  };

  const handleCaptureFingerprints = async () => {
    if (!sdkLoaded || !fingerprintSDK) {
      Alert.alert(
        'Service Unavailable',
        'The fingerprint service is not available right now. Please:\n\n1. Close the app completely\n2. Restart the app\n3. Try again',
        [{ text: 'OK' }]
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
              const estimatedQuality = imageSize > 50000 ? 'high' : imageSize > 20000 ? 'medium' : 'low';
              
              // Store with enhanced metadata
              const processedImage = {
                uri: `data:image/jpeg;base64,${imageBase64}`,
                index,
                quality: estimatedQuality as 'low' | 'medium' | 'high',
                size: { width: 1280, height: 720 },
                fileSize: imageSize,
                processingTimestamp: new Date().toISOString(),
                qualityScore: estimatedQuality === 'high' ? 90 : estimatedQuality === 'medium' ? 70 : 50,
              };
              
              processedImages.push(processedImage);
              
              dispatch(addCapturedImage(processedImage));
            });
            
            setCaptureStatus(`Successfully captured ${images.length} high-quality fingerprint(s)`);
            dispatch(endScanSession({ status: 'completed' }));
            
            // Show quality feedback
            const qualityMessage = qualityIssues > 0 
              ? `Captured ${images.length} images. ${qualityIssues} may need recapture for optimal quality.`
              : `Captured ${images.length} high-quality fingerprint images!`;
            
            Alert.alert(
              'Capture Complete!', 
              `${qualityMessage}\n\nImages saved to Redux store with quality metadata.`,
              [
                { 
                  text: 'View Images', 
                  onPress: () => console.log('High-quality fingerprints stored:', processedImages.map(img => ({
                    index: img.index,
                    quality: img.quality,
                    qualityScore: img.qualityScore,
                    fileSize: img.fileSize
                  })))
                },
                { text: 'OK' }
              ]
            );
          }
        },
        onStatusChanged: (state: any) => {
          console.log('Capture status changed:', state);
          // Enhanced status handling for better image quality feedback
          const statusMap: { [key: string]: string } = {
            'NO_DETECTION': 'No fingers detected - place hand on scanner',
            'MISSING_FINGERS': 'Missing fingers - place all 4 fingers for complete capture',
            'TOO_CLOSE': 'Too close - move hand away for better focus and sharpness',
            'TOO_FAR': 'Too far - bring hand closer for high-resolution capture',
            'MOTION_DETECTED': 'Hand movement detected - hold steady for sharp images',
            'POOR_LIGHTING': 'Poor lighting - ensure adequate lighting for clear images',
            'LOW_QUALITY': 'Low quality detected - adjust hand position',
            'BLUR_DETECTED': 'Motion blur detected - hold hand completely still',
            'FOCUS_ADJUSTING': 'Camera focusing - hold steady for optimal sharpness',
            'STABILIZING': 'Stabilizing - preparing for high-quality capture',
            'OK': 'Perfect position - capturing high-quality images...',
            'PROCESSING': 'Processing high-resolution fingerprints...',
            'QUALITY_CHECK': 'Validating image quality...',
            'STOPPED': 'Capture stopped',
            'MODEL_NOT_FOUND': 'AI model not found - check SDK installation',
            'READY': 'Ready for high-quality capture',
          };
          
          const statusText = statusMap[state] || statusMap[state.toString()] || 'Preparing for capture...';
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
      dispatch(endScanSession({ status: 'error', error: 'Failed to initialize fingerprint capture' }));
      console.error('Fingerprint capture error:', error);
      Alert.alert('Error', 'Failed to initialize fingerprint capture. Please ensure the SDK is properly linked.');
    }
  };

  const handleClearImages = () => {
    dispatch(clearBiometricData());
    setCaptureStatus(sdkLoaded ? 'Bio metric service is live' : 'Service temporarily unavailable');
    setFingerRects([]);
  };

  const handleRebuildInstructions = () => {
    Alert.alert(
      'Rebuild Instructions',
      'To properly use the fingerprint service:\n\n1. Close the app completely\n2. Restart the app\n3. Try again',
      [{ text: 'Got it!' }]
    );
  };

  const prepareImageForSave = (imageUri: string): string => {
    // Log the original URI format
    console.log('Original image URI format:', imageUri.substring(0, 100));
    
    // If it's already a base64 data URI, CameraRoll should handle it
    if (imageUri.startsWith('data:image/')) {
      return imageUri;
    }
    
    // If it's a file:// URI, return as is
    if (imageUri.startsWith('file://')) {
      return imageUri;
    }
    
    // If it's just base64 without the data URI prefix, add it
    if (imageUri.match(/^[A-Za-z0-9+/]+=*$/)) {
      return `data:image/jpeg;base64,${imageUri}`;
    }
    
    return imageUri;
  };

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
        uriStart: imageUri.substring(0, 50) + '...'
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
      if (imageUri.startsWith('data:image/') && filePathToSave.includes(RNFS.TemporaryDirectoryPath)) {
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
        ]
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
                [{ text: 'Got it' }]
              );
            },
          },
          { text: 'Cancel' },
        ]
      );
    }
  };

  const handleSendBiometric = async () => {
    if (!capturedImages || capturedImages.length < 4) {
      Alert.alert(
        'Missing Fingerprints',
        'Please capture all four fingerprints before sending for biometric registration.',
        [{ text: 'OK' }]
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

      const userData = {
        cnic: CNIC,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: '1990-01-01',
        ...fingerMap
      };

      // Start the API call
      setIsRegistering(true);
      const response = await biometricService.register(userData);
      console.log('Registration response:', response);
        
      setIsRegistering(false);
      Alert.alert(
        'Success',
        'Biometric verification completed successfully!',
        [
          { 
            text: 'OK',
            onPress: () => {
              // Clear the biometric data
              dispatch(clearBiometricData());
              // Navigate to home screen
              navigation.pop(2);
            }
          }
        ]
      );
    } catch (error: any) {
      setIsRegistering(false);
      console.error('Registration failed:', error);
      Alert.alert(
        'Registration Error',
        error.response?.data?.message || error.message || 'Failed to send biometric data',
        [{ text: 'OK' }]
      );
    }
  };

  const LoadingOverlay = () => (
    <Modal transparent visible>
      <View style={styles.overlayContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1E2772" />
          <Text style={styles.loadingText}>Processing Fingerprints...</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ColorPalettes.backgrounds.primary}
      />
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

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Service Status:</Text>
          <Text style={[
            styles.statusText, 
            isScanning && styles.statusActive,
            sdkError && styles.statusError,
            sdkLoaded && !sdkError && styles.statusSuccess
          ]}>
            {sdkError || captureStatus}
          </Text>
          {fingerRects.length > 0 && (
            <Text style={styles.fingerCount}>
              Fingers detected: {fingerRects.length}
            </Text>
          )}
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
            
            <TouchableOpacity 
              style={styles.helpButton} 
              onPress={handleRebuildInstructions}
            >
              <Text style={styles.helpButtonText}>Get Help</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.captureButton, 
              (!sdkLoaded) && styles.captureButtonDisabled
            ]} 
            onPress={handleCaptureFingerprints}
            disabled={!sdkLoaded}
          >
            <Text style={styles.captureButtonText}>
              {!sdkLoaded 
                ? 'Service Unavailable'
                : capturedImages.length > 0
                  ? 'Scan fingerprint again'
                  : 'Start Fingerprint Scan'
              }
            </Text>
          </TouchableOpacity>

          {capturedImages.length > 0 && (
            <>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearImages}
              >
                <Text style={styles.clearButtonText}>
                  Clear All Images ({capturedImages.length})
                </Text>
              </TouchableOpacity>
            </>
          )}

          {capturedImages && capturedImages.length > 0 && (
            <TouchableOpacity 
              style={[styles.button, styles.sendButton]} 
              onPress={handleSendBiometric}
            >
              <Text style={styles.buttonText}>Send for bioMetric</Text>
            </TouchableOpacity>
          )}
        </View>

        {capturedImages.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Captured Fingerprints:</Text>
            <Text style={styles.reduxInfo}>
              Session: {currentSession?.status || 'No active session'} | 
              Total Scans: {totalScansCompleted} | 
              Images: {capturedImages.length}
            </Text>
            <View style={styles.imageGrid}>
              {capturedImages.map((image, index) => (
                <View key={`${image.timestamp}-${index}`} style={styles.imageContainer}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.fingerprintImage}
                    resizeMode="contain"
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
                  {/* <TouchableOpacity 
                    style={styles.saveImageButton}
                    onPress={() => saveImageToGallery(image.uri, image.index)}
                  >
                    <Text style={styles.saveImageButtonText}>💾 Save</Text>
                  </TouchableOpacity> */}
                </View>
              ))}
            </View>
          </View>
        )}      
      </ScrollView>
      
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
  },
  captureButton: {
    backgroundColor: '#1E2772',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15, 
    borderWidth: 1,
    borderColor: '#1E2772',
  },
  captureButtonDisabled: {
    backgroundColor: ColorPalettes.text.disabled,
    shadowOpacity: 0.1,
  },
  captureButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
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
  clearButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CF2234',
  },
  clearButtonText: {
    color: '#CF2234',
    fontSize: 16,
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
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  fingerprintImage: {
    width: 120,
    height: 120,
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
});

export default NewScreen; 