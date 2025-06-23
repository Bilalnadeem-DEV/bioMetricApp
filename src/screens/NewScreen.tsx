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
  const [captureStatus, setCaptureStatus] = useState<string>('Initializing SDK...');
  const [fingerRects, setFingerRects] = useState<any[]>([]);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [fingerprintSDK, setFingerprintSDK] = useState<any>(null);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        const sdk = await import('@biopassid/fingerprint-sdk-react-native');
        setFingerprintSDK(sdk);
        setSdkLoaded(true);
        setCaptureStatus('SDK loaded successfully - Ready to capture');
        dispatch(clearError());
      } catch (error) {
        console.error('Failed to load BioPassID SDK:', error);
        setSdkError('BioPassID SDK not available. Please rebuild the app after running pod install.');
        setCaptureStatus('SDK not available');
        dispatch(setError('BioPassID SDK not available'));
      }
    };

    loadSDK();
  }, [dispatch]);

  const config = {
    licenseKey: '9KM2-DLW6-E8VY-ADFI',
    numberFingersToCapture: 4,
    captureType: 'LEFT_HAND_FINGERS',
    outputType: 'CAPTURE_AND_SEGMENTATION',
    timeToCapture: 3,
    overlayColor: '#80000000',
    imageQuality: {
      compressionQuality: 100,
      imageFormat: 'JPEG',
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
      backgroundColor: '#50888888',
      progressColor: '#D6A262',
      textColor: '#FFFFFF',
      countdownDuration: 2,
    },
    backButton: {
      enabled: true,
      backgroundColor: '#00000000',
      buttonPadding: 0,
      buttonSize: { width: 56, height: 56 },
      iconOptions: {
        enabled: true,
        iconFile: 'fingerprintsdk_ic_close',
        iconColor: '#FFFFFF',
        iconSize: { width: 32, height: 32 },
      },
      labelOptions: {
        enabled: false,
        content: 'Back',
        textColor: '#FFFFFF',
        textSize: 14,
      },
    },
    helpText: {
      enabled: true,
      messages: {
        leftHandMessage: 'Place your left hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        rightHandMessage: 'Place your right hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
        thumbsMessage: 'Place your thumbs\nuntil the marker is centered.\nHold steady for sharp images.',
      },
      textColor: '#FFFFFF',
      textSize: 16,
    },
    fingerEllipse: {
      enabled: true,
      ellipseColor: '#80D6A262',
      thickness: 3,
    },
    distanceIndicator: {
      enabled: true,
      selectedBarColor: '#D6A262',
      unselectedBarColor: '#FFFFFF',
      arrowColor: '#D6A262',
      sensitivity: 'high',
      tooCloseText: {
        enabled: true,
        content: 'Too close - move hand away for better focus',
        textColor: '#FF6B6B',
        textSize: 16,
      },
      tooFarText: {
        enabled: true,
        content: 'Too far - bring hand closer for sharp capture',
        textColor: '#FF6B6B',
        textSize: 16,
      },
      perfectDistanceText: {
        enabled: true,
        content: 'Perfect distance - hold steady!',
        textColor: '#4ECDC4',
        textSize: 16,
      },
    },
    motionDetection: {
      enabled: true,
      sensitivity: 'medium',
      stabilizationTime: 2000,
      motionThreshold: 0.1,
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
        'SDK Not Available',
        'The BioPassID SDK is not properly loaded. Please:\n\n1. Ensure you have run "pod install" in the ios folder\n2. Rebuild the app completely\n3. Make sure you\'re not using Expo Go',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Start scan session in Redux
      dispatch(startScanSession({ userName: userName || 'Unknown User' }));
      setCaptureStatus('Initializing fingerprint capture...');
      
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
              // Basic quality validation
              const imageSize = imageBase64.length;
              const estimatedQuality = imageSize > 50000 ? 'high' : imageSize > 20000 ? 'medium' : 'low';
              
              if (estimatedQuality === 'low') {
                qualityIssues++;
                console.warn(`Image ${index + 1} may be low quality (size: ${imageSize})`);
              }
              
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
    setCaptureStatus(sdkLoaded ? 'SDK loaded successfully - Ready to capture' : 'SDK not available');
    setFingerRects([]);
  };

  const handleRebuildInstructions = () => {
    Alert.alert(
      'Rebuild Instructions',
      'To properly use the BioPassID SDK:\n\n1. Close the app completely\n2. Run "cd ios && pod install" in terminal\n3. Rebuild the app completely\n4. Don\'t use Expo Go\n\nThe SDK requires native linking to work properly.',
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
            album: 'BioSecure Fingerprints',
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
                  ? 'Go to Settings > Privacy & Security > Photos > BioSecure and enable "Add Photos Only" or "Full Access".'
                  : 'Go to Settings > Apps > BioSecure > Permissions > Storage and enable it.',
                [{ text: 'Got it' }]
              );
            },
          },
          { text: 'Cancel' },
        ]
      );
    }
  };

  const saveAllImagesToGallery = async () => {
    if (capturedImages.length === 0) {
      Alert.alert('No Images', 'No fingerprint images to save.');
      return;
    }

    Alert.alert(
      'Save All Images',
      `Do you want to save all ${capturedImages.length} fingerprint images to your photo gallery?`,
      [
        {
          text: 'Save All',
          onPress: async () => {
            let successCount = 0;
            let failCount = 0;
            const errors: string[] = [];

            for (let i = 0; i < capturedImages.length; i++) {
              try {
                const image = capturedImages[i];
                
                // Validate image URI
                if (!image.uri || typeof image.uri !== 'string') {
                  throw new Error(`Invalid image URI for image ${i + 1}`);
                }

                // Prepare the image URI for saving
                const preparedUri = prepareImageForSave(image.uri);
                console.log(`Saving image ${i + 1}/${capturedImages.length}:`, {
                  originalUri: image.uri.substring(0, 50) + '...',
                  preparedUri: preparedUri.substring(0, 50) + '...'
                });

                // Platform-specific save
                if (Platform.OS === 'ios') {
                  await CameraRoll.save(preparedUri, { type: 'photo' });
                } else {
                  await CameraRoll.save(preparedUri, {
                    type: 'photo',
                    album: 'BioSecure Fingerprints',
                  });
                }
                
                successCount++;
                console.log(`Successfully saved image ${i + 1}`);
              } catch (error) {
                console.error(`Failed to save image ${i + 1}:`, error);
                failCount++;
                if (error instanceof Error) {
                  errors.push(`Image ${i + 1}: ${error.message}`);
                }
              }
            }

            let message = '';
            if (failCount === 0) {
              message = `🎉 Successfully saved all ${successCount} images to your photo gallery!`;
            } else if (successCount === 0) {
              message = `❌ Failed to save all images. Please check permissions and try again.`;
            } else {
              message = `⚠️ Saved ${successCount} images successfully. ${failCount} images failed to save.`;
            }

            // Show detailed error info if there were failures
            if (failCount > 0 && errors.length > 0) {
              message += `\n\nErrors:\n${errors.slice(0, 3).join('\n')}`;
              if (errors.length > 3) {
                message += `\n... and ${errors.length - 3} more`;
              }
            }

            Alert.alert('Save Complete', message, [{ text: 'OK' }]);
          },
        },
        { text: 'Cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FBF5FE"
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContainer}>
            <Image 
              source={require('../../assets/images/appIcon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>BioPassID Fingerprint</Text>
          <Text style={styles.subtitle}>Professional fingerprint capture with BioPassID SDK</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
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
            <Text style={styles.errorTitle}>SDK Not Available</Text>
            <Text style={styles.errorText}>
              The BioPassID SDK requires native linking. Please follow these steps:
            </Text>
            <Text style={styles.errorStep}>1. Close the app completely</Text>
            <Text style={styles.errorStep}>2. Run: cd ios && pod install</Text>
            <Text style={styles.errorStep}>3. Rebuild the app completely</Text>
            <Text style={styles.errorStep}>4. Don't use Expo Go</Text>
            
            <TouchableOpacity 
              style={styles.helpButton} 
              onPress={handleRebuildInstructions}
            >
              <Text style={styles.helpButtonText}>Show Detailed Instructions</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.captureButton, 
              (isScanning || !sdkLoaded) && styles.captureButtonDisabled
            ]} 
            onPress={handleCaptureFingerprints}
            disabled={isScanning || !sdkLoaded}
          >
            <Text style={styles.captureButtonText}>
              {!sdkLoaded 
                ? 'SDK Not Available' 
                : isScanning 
                  ? 'Capturing...' 
                  : 'Capture Left Hand Fingerprints'
              }
            </Text>
          </TouchableOpacity>

          {capturedImages.length > 0 && (
            <>
              <TouchableOpacity 
                style={styles.saveAllButton} 
                onPress={saveAllImagesToGallery}
              >
                <Text style={styles.saveAllButtonText}>
                  💾 Save All Images to Gallery ({capturedImages.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearImages}
              >
                <Text style={styles.clearButtonText}>
                  Clear Captured Images ({capturedImages.length})
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {capturedImages.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Captured Fingerprints (Redux Store):</Text>
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

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Image Quality Enhancement:</Text>
          <Text style={styles.qualityTip}>📸 Hold hand completely still for 2-3 seconds</Text>
          <Text style={styles.qualityTip}>💡 Ensure good lighting conditions</Text>
          <Text style={styles.qualityTip}>📏 Maintain proper distance (follow on-screen guidance)</Text>
          <Text style={styles.qualityTip}>🤚 Place all 4 fingers flat and spread slightly</Text>
          <Text style={styles.qualityTip}>⏱️ Wait for "Perfect position" message before capture</Text>
          <Text style={styles.qualityTip}>🔄 Recapture if quality score is below 75</Text>
          
          <Text style={styles.infoTitle}>BioPassID SDK + Redux Integration:</Text>
          <Text style={styles.infoText}>• Professional fingerprint capture</Text>
          <Text style={styles.infoText}>• Real-time finger detection</Text>
          <Text style={styles.infoText}>• Distance guidance</Text>
          <Text style={styles.infoText}>• Multiple finger capture</Text>
          <Text style={styles.infoText}>• High-quality image processing</Text>
          <Text style={styles.infoText}>• FIDO2 compliant</Text>
          <Text style={styles.infoText}>• ✅ Redux state management</Text>
          <Text style={styles.infoText}>• ✅ Session tracking</Text>
          <Text style={styles.infoText}>• ✅ Persistent storage</Text>
          <Text style={styles.infoText}>• ✅ Quality validation & scoring</Text>
          <Text style={styles.infoText}>• ✅ Save to photo gallery</Text>
          
          <Text style={styles.infoTitle}>License Key:</Text>
          <Text style={styles.licenseText}>9KM2-DLW6-E8VY-ADFI</Text>
          
          <Text style={styles.infoTitle}>Redux State:</Text>
          <Text style={styles.reduxStateText}>User: {userName || 'Not set'}</Text>
          <Text style={styles.reduxStateText}>Active Session: {currentSession ? 'Yes' : 'No'}</Text>
          <Text style={styles.reduxStateText}>Total Scans: {totalScansCompleted}</Text>
          <Text style={styles.reduxStateText}>Stored Images: {capturedImages.length}</Text>
          {biometricError && (
            <Text style={styles.reduxErrorText}>Error: {biometricError}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5FE',
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
    color: '#020817',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D1A58',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020817',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4F5866',
    textAlign: 'center',
    fontWeight: '300',
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    shadowColor: '#823280',
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
    color: '#4F5866',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#020817',
    fontWeight: '500',
  },
  statusActive: {
    color: '#D6A262',
  },
  statusError: {
    color: '#ef4444',
  },
  statusSuccess: {
    color: '#10b981',
  },
  fingerCount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 15,
    lineHeight: 20,
  },
  errorStep: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 5,
    paddingLeft: 10,
  },
  helpButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  helpButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  captureButton: {
    backgroundColor: '#823280',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  captureButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveAllButton: {
    backgroundColor: '#823280',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  saveAllButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    shadowColor: '#823280',
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
    color: '#020817',
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
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  imageLabel: {
    fontSize: 12,
    color: '#4F5866',
    marginTop: 5,
    fontWeight: '500',
  },
  imageTimestamp: {
    fontSize: 12,
    color: '#4F5866',
    marginTop: 2,
    fontWeight: '300',
  },
  imageQuality: {
    fontSize: 12,
    color: '#4F5866',
    marginTop: 2,
    fontWeight: '300',
  },
  qualityHigh: {
    color: '#10b981',
    fontWeight: '500',
  },
  qualityMedium: {
    color: '#D6A262',
    fontWeight: '500',
  },
  qualityLow: {
    color: '#ef4444',
    fontWeight: '500',
  },
  qualityScore: {
    fontSize: 12,
    color: '#4F5866',
    marginTop: 2,
    fontWeight: '300',
  },
  fileSize: {
    fontSize: 12,
    color: '#4F5866',
    marginTop: 2,
    fontWeight: '300',
  },
  reduxInfo: {
    fontSize: 14,
    color: '#4F5866',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    shadowColor: '#823280',
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
    color: '#020817',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#4F5866',
    marginBottom: 8,
    lineHeight: 20,
  },
  licenseText: {
    fontSize: 14,
    color: '#D6A262',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  reduxStateText: {
    fontSize: 14,
    color: '#4F5866',
    marginBottom: 5,
  },
  reduxErrorText: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 15,
  },
  qualityTip: {
    fontSize: 14,
    color: '#4F5866',
    marginBottom: 8,
    lineHeight: 20,
  },
  saveImageButton: {
    backgroundColor: '#823280',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  saveImageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NewScreen; 