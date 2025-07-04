import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  startScanSession,
  addCapturedImage,
  setCurrentImageIndex,
  clearError,
  setCNICData,
  clearCapturedImages,
} from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';
import { cnicVerificationService } from '../services/cnicVerification.service';

type ScanPrepScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ScanPrep'>;

type ScanPrepScreenRouteProp = RouteProp<RootStackParamList, 'ScanPrep'>;

interface Props {
  navigation: ScanPrepScreenNavigationProp;
  route: ScanPrepScreenRouteProp;
}

const ScanPrepScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { name: userName, loggedInUserDetail } = useAppSelector(state => state.user);
  const { capturedImages, scanningProgress, currentSession, error } = useAppSelector(
    state => state.biometric,
  );

  const pulseAnim = useState(new Animated.Value(1))[0];
  const [isProcessing, setIsProcessing] = useState(false);

  // Create individual animation values for each thumbnail
  const thumbnailAnims = [
    useState(new Animated.Value(1))[0],
    useState(new Animated.Value(1))[0],
    useState(new Animated.Value(1))[0],
  ];

  useEffect(() => {
    // Start scan session when component mounts
    if (!currentSession && userName) {
      dispatch(startScanSession({ userName }));
    }

    // Clear any previous errors
    dispatch(clearError());
  }, [dispatch, userName, currentSession]);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const handleThumbnailPress = (index: number) => {
    dispatch(setCurrentImageIndex(index));
    navigation.navigate('Camera', {
      imageIndex: index,
      onImageCaptured: (imageUri: string, capturedIndex: number) => {
        // Get image dimensions and file size
        Image.getSize(
          imageUri,
          (width, height) => {
            dispatch(
              addCapturedImage({
                uri: imageUri,
                index: capturedIndex,
                quality: 'high',
                size: { width, height },
              }),
            );
          },
          error => {
            console.error('Error getting image size:', error);
            dispatch(
              addCapturedImage({
                uri: imageUri,
                index: capturedIndex,
                quality: 'high',
                size: { width: 0, height: 0 },
              }),
            );
          },
        );
      },
    });
  };

  const handleStartCamera = async () => {
    if (capturedImages.length >= 3) {
      // hit api here to send images for verification
      try {
        // Get the CNIC front image (index 0)
        const cnicFrontImage = capturedImages.find(img => img.index === 0);

        console.log(
          'Available images:',
          capturedImages.map(img => ({ index: img.index, hasUri: !!img.uri })),
        );
        console.log(
          'CNIC Front image found:',
          !!cnicFrontImage,
          'at index:',
          cnicFrontImage?.index,
        );

        if (cnicFrontImage?.uri) {
          console.log('Processing CNIC front image...');

          // Compress image to balance quality and file size for OCR
          const compressedImage = await ImageResizer.createResizedImage(
            cnicFrontImage.uri,
            1000, // Better resolution for OCR text recognition
            750, // Better resolution for OCR text recognition
            'PNG', // PNG format for better quality
            100, // PNG doesn't use quality parameter, but set to 100
            0,
            undefined,
            false,
            { mode: 'contain' },
          );

          console.log('Using compressed image for API call');

          // Show loading overlay
          setIsProcessing(true);

          const result = await cnicVerificationService.extractCNICFrontOCR(compressedImage.uri);

          console.log('CNIC OCR Result:', result);

          if (result.type === 'True') {
            // Save CNIC data to Redux store
            dispatch(
              setCNICData({
                name: result.Name || '',
                cnic: result.cnic || '',
                cnicType: result.cnic_type || '',
                dateOfExpiry: result.dexp || '',
                dateOfIssue: result.disu || '',
                dateOfBirth: result.dob || '',
                fatherName: result.father_name || '',
                gender: result.gender || '',
                husbandName: result.husband_name,
                referenceTag: result.reference_tag || '',
              }),
            );

            if (result.cnic) {
              // Check if we have a selfie image for face verification
              const selfieImage = capturedImages.find(img => img.index === 2);

              if (result.reference_tag && selfieImage?.uri) {
                try {
                  console.log('Starting face verification...');

                  // Compress selfie image for verification
                  const compressedSelfie = await ImageResizer.createResizedImage(
                    selfieImage.uri,
                    1000,
                    750,
                    'PNG',
                    100,
                    0,
                    undefined,
                    false,
                    { mode: 'contain' },
                  );

                  const verificationResult = await cnicVerificationService.verifyUser(
                    result.reference_tag,
                    compressedSelfie.uri,
                  );
                  setIsProcessing(false);

                  // Check if verification was successful (code: '1' means success)
                  const isVerified = verificationResult.code === '1';
                  const confidence = verificationResult.average_confidence || 0;

                  Alert.alert(
                    isVerified ? 'Face Verification Successful' : 'Face Verification Failed',
                    `CNIC Data Extracted Successfully!\n\nName: ${result.Name}\nCNIC: ${
                      result.cnic
                    }\nFather: ${result.father_name}\n\nFace Verification: ${
                      isVerified ? 'PASSED ✓' : 'FAILED ✗'
                    }\nConfidence: ${confidence.toFixed(2)}%\n\n${verificationResult.desc || ''}`,
                    [{ text: 'OK',
                      onPress: () => {
                        isVerified ? (
                        navigation.goBack(),
                        dispatch(clearCapturedImages()),
                        dispatch(setCurrentImageIndex(0)) ):
                        dispatch(clearCapturedImages());
                        dispatch(setCurrentImageIndex(0));
                      }
                    }
                    ]

                  );
                } catch (verificationError: any) {
                  console.error('Face verification error:', verificationError);
                  Alert.alert(
                    'CNIC Verification Success',
                    `Name: ${result.Name}\nCNIC: ${result.cnic}\nFather: ${result.father_name}\n\nNote: Face verification failed - ${verificationError.message}`,
                    [{ text: 'OK' }],
                  );
                }
              } else {
                Alert.alert(
                  'CNIC Verification Success',
                  `Name: ${result.Name}\nCNIC: ${result.cnic}\nFather: ${result.father_name}\n\nData has been saved successfully!\n\nNote: Capture a selfie for face verification.`,
                  [{ text: 'OK' }],
                );
              }
            }
          } else {
            setIsProcessing(false);
            Alert.alert('CNIC Verification Failed', result.desc || 'Could not process CNIC image', [
              { text: 'OK' },             
            ]);
          }
        } else {
          setIsProcessing(false);
          Alert.alert('Error', 'CNIC front image not found');
        }
      } catch (error: any) {
        setIsProcessing(false);
        console.error('CNIC verification error:', error);
        Alert.alert('Error', error.message || 'Failed to verify CNIC');
      } finally {
        // Hide loading overlay
        setIsProcessing(false);
      }

      return;
    }
    const nextIndex = capturedImages.length;
    dispatch(setCurrentImageIndex(nextIndex));
    navigation.navigate('Camera', {
      imageIndex: nextIndex,
      onImageCaptured: (imageUri: string, capturedIndex: number) => {
        // Get image dimensions and file size
        Image.getSize(
          imageUri,
          (width, height) => {
            dispatch(
              addCapturedImage({
                uri: imageUri,
                index: capturedIndex,
                quality: 'high',
                size: { width, height },
              }),
            );
          },
          error => {
            console.error('Error getting image size:', error);
            dispatch(
              addCapturedImage({
                uri: imageUri,
                index: capturedIndex,
                quality: 'high',
              }),
            );
          },
        );
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getImageLabel = (index: number): string => {
    switch (index) {
      case 0:
        return 'CNIC Front';
      case 1:
        return 'CNIC Back';
      case 2:
        return 'Selfie';
      default:
        return `Image ${index + 1}`;
    }
  };

  const getButtonText = () => {
    if (capturedImages.length === 0) {
      return 'Capture CNIC Front';
    } else if (capturedImages.length === 1) {
      return 'Capture CNIC Back';
    } else if (capturedImages.length === 2) {
      return 'Take Selfie';
    } else {
      return 'Send for Verification';
    }
  };

  const handleDownloadImage = async (imageUri: string, index: number) => {
    try {
      // Zoom animation before saving
      Animated.sequence([
        Animated.timing(thumbnailAnims[index], {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(thumbnailAnims[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Get original image dimensions
      const originalImage = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          Image.getSize(
            imageUri,
            (width, height) => {
              resolve({ width, height });
            },
            reject,
          );
        },
      );

      // Resize image to 1.3x larger (zoom effect)
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri,
        Math.round(originalImage.width * 1.3), // 30% larger width
        Math.round(originalImage.height * 1.3), // 30% larger height
        'JPEG',
        90, // Quality
        0, // Rotation
        undefined, // Output path (use default)
        false, // Keep metadata
        { mode: 'stretch' }, // Stretch to exact dimensions
      );

      // Save the resized image to gallery
      await CameraRoll.saveAsset(resizedImage.uri, {
        type: 'photo',
        album: 'hyperI Scans',
      });

      Alert.alert('Success', `Zoomed image ${index + 1} saved to gallery successfully!`, [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error saving zoomed image to gallery:', error);
      Alert.alert('Error', 'Failed to save zoomed image to gallery. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  const renderThumbnail = (index: number) => {
    const imageData = capturedImages.find(img => img.index === index);
    const hasImage = imageData?.uri;

    return (
      <TouchableOpacity
        key={index}
        style={styles.thumbnailContainer}
        onPress={() => handleThumbnailPress(index)}>
        <Animated.View
          style={[styles.thumbnail, { transform: [{ scale: thumbnailAnims[index] }] }]}>
          {hasImage ? (
            <>
              <Image source={{ uri: hasImage }} style={styles.thumbnailImage} resizeMode="cover" />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={e => {
                  e.stopPropagation();
                  handleDownloadImage(hasImage, index);
                }}>
                <Text style={styles.downloadIcon}>↓</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          )}
        </Animated.View>
        <Text style={styles.thumbnailNumber}>{getImageLabel(index)}</Text>
      </TouchableOpacity>
    );
  };

  const LoadingOverlay = () => (
    <Modal transparent visible>
      <View style={styles.overlayContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1E2772" />
          <Text style={styles.loadingText}>Processing CNIC Verification...</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
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
            <Text style={styles.title}>Identity Verification</Text>
          </View>

          <View style={styles.thumbnailSection}>
            <Text style={styles.sectionTitle}>Capture Required Documents</Text>
            <Text style={styles.sectionSubtitle}>
              Please capture clear images of your CNIC and a selfie
            </Text>
            <View style={styles.thumbnailGrid}>{[0, 1, 2].map(renderThumbnail)}</View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Image capturing Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${(capturedImages.length / 3) * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {capturedImages.length} of 3 required images captured
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.captureButton, capturedImages.length >= 3 && styles.completedButton]}
                onPress={handleStartCamera}>
                <Text style={styles.buttonText}>{getButtonText()}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>

      {isProcessing && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
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
    color: ColorPalettes.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E2772',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#1E2772',
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
  thumbnailSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  thumbnailContainer: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 140,
    borderRadius: 12,
    backgroundColor: ColorPalettes.backgrounds.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 10,
  },
  plusIcon: {
    fontSize: 24,
    color: '#1E2772',
    fontWeight: 'bold',
  },
  thumbnailNumber: {
    position: 'absolute',
    bottom: -30,
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    textAlign: 'center',
    width: '100%',
  },
  downloadButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E2772',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E2772',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadIcon: {
    color: ColorPalettes.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 40,
    padding: 20,
    marginTop: 20,
    borderRadius: 16,
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
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E2772',
    borderRadius: 4,
    minWidth: 2,
  },
  progressText: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  captureButton: {
    backgroundColor: '#1E2772',
    borderColor: '#1E2772',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 250,
    borderWidth: 1,
  },
  completedButton: {
    backgroundColor: '#1E2772',
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
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

export default ScanPrepScreen;
