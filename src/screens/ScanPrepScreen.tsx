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
  Platform,
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
  removeLastCapturedImage,
} from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';
import { cnicVerificationService } from '../services/cnicVerification.service';
import { setLoggedInUserDetail } from '../store/slices/userSlice';
import biometricService from '../services/biometric.service';

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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showLivenessModal, setShowLivenessModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    name: string;
    cnic: string;
    fatherName: string;
    confidence: number;
    description: string;
    cnicType: string;
    dateOfExpiry: string;
    dateOfIssue: string;
    dateOfBirth: string;
    gender: string;
    husbandName: string;
    referenceTag: string;
  } | null>(null);

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

    navigation.navigate(Platform.OS === 'android' ? 'CameraAndroid' : 'Camera', {
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

        if (cnicFrontImage?.uri) {
          console.log('Processing CNIC front image...');

          // check for liven essconst cnicFrontImage1 = capturedImages.find(img => img.index === 2);
          const cnicFrontImage1 = capturedImages.find(img => img.index === 2);
          const compressedImage1 = await ImageResizer.createResizedImage(
            cnicFrontImage1?.uri || '',
            1024, // Better resolution for OCR text recognition
            1024, // Better resolution for OCR text recognition
            'JPEG', // PNG format for better quality
            100, // PNG doesn't use quality parameter, but set to 100
            0,
            undefined,
            false,
            { mode: 'contain' },
          );

          setIsProcessing(true);

          // detectLiveness check for liveness here
          const selfieImage = capturedImages.find(img => img.index === 2);
          if (selfieImage?.uri) {
            const livenessResult = await cnicVerificationService.detectLiveness([
              compressedImage1?.uri || '',
            ]);
            console.log('Liveness Result:', livenessResult);

            if (livenessResult.code != 0) {
              // Real person detected, clear selfie and ask to retake
              console.log('Liveness check failed - detected real person');
              setIsProcessing(false);

              // Remove all captured images
              dispatch(removeLastCapturedImage());
              dispatch(setCurrentImageIndex(2));

              setIsProcessing(false);

              // Show alert to user
              setShowLivenessModal(true);
              setIsProcessing(false);
              return;
            }
          }

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
            // check if the cnic match with the entered cnic

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

                  setVerificationResult({
                    isVerified,
                    name: result.Name || '',
                    cnic: result.cnic || '',
                    fatherName: result.father_name || '',
                    confidence,
                    description: verificationResult.desc || '',
                    cnicType: result.cnic_type || '',
                    dateOfExpiry: result.dexp || '',
                    dateOfIssue: result.disu || '',
                    dateOfBirth: result.dob || '',
                    gender: result.gender || '',
                    husbandName: result.husband_name || '',
                    referenceTag: result.reference_tag || '',
                  });
                  setShowVerificationModal(true);
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
    navigation.navigate(Platform.OS === 'android' ? 'CameraAndroid' : 'Camera', {
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

  const LivenessErrorModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showLivenessModal}
      onRequestClose={() => setShowLivenessModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxWidth: 380 }]}>
          <View style={styles.errorIconContainer}>
            <Text style={styles.errorIcon}>👤</Text>
          </View>
          <Text style={[styles.modalTitle, { color: '#F44336', marginBottom: 16 }]}>
            Liveness Check Failed
          </Text>
          <View style={[styles.modalDescriptionContainer, { 
            backgroundColor: '#FFEBEE', 
            borderColor: '#F44336',
            marginTop: 0,
            padding: 16
          }]}>
            <Text style={[styles.modalDescription, { 
              color: '#C62828',
              fontSize: 15,
              lineHeight: 22
            }]}>
              Please ensure the following before taking a selfie:
            </Text>
            <View style={styles.bulletPoints}>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Use a plain, uncluttered background</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Take a clear, focused picture</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Keep your entire face within the frame</Text>
              </View>
              <View style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Find good, even lighting</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.modalButton, { 
              marginTop: 24,
              backgroundColor: '#F44336',
              paddingVertical: 14,
              minWidth: 120
            }]} 
            onPress={() => setShowLivenessModal(false)}>
            <Text style={[styles.modalButtonText, { fontSize: 16 }]}>Try Again</Text>
          </TouchableOpacity>
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
      <LivenessErrorModal />
      {/* Verification Result Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.modalTitle,
                { color: verificationResult?.isVerified ? '#4CAF50' : '#F44336' },
              ]}>
              {verificationResult?.isVerified
                ? 'Face Verification Successful'
                : 'Face Verification Failed'}
            </Text>

            <View style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>CNIC Data Extracted Successfully!</Text>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Name:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.name}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>CNIC:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.cnic}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Father:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.fatherName}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Date of Birth:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.dateOfBirth}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Gender:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.gender}</Text>
              </View>

              {verificationResult?.husbandName && (
                <View style={styles.modalDataRow}>
                  <Text style={styles.modalDataLabel}>Husband:</Text>
                  <Text style={styles.modalDataValue}>{verificationResult?.husbandName}</Text>
                </View>
              )}

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>CNIC Type:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.cnicType}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Date of Issue:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.dateOfIssue}</Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Date of Expiry:</Text>
                <Text style={styles.modalDataValue}>{verificationResult?.dateOfExpiry}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Liveness Check:</Text>
                <Text style={[styles.modalDataValue, { color: '#4CAF50' }]}>{'PASSED ✓'}</Text>
              </View>
              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Face Verification:</Text>
                <Text
                  style={[
                    styles.modalDataValue,
                    { color: verificationResult?.isVerified ? '#4CAF50' : '#F44336' },
                  ]}>
                  {verificationResult?.isVerified ? 'PASSED ✓' : 'FAILED ✗'}
                </Text>
              </View>

              <View style={styles.modalDataRow}>
                <Text style={styles.modalDataLabel}>Confidence:</Text>
                <Text
                  style={[
                    styles.modalDataValue,
                    { color: verificationResult?.isVerified ? '#4CAF50' : '#F44336' },
                  ]}>
                  {verificationResult?.confidence.toFixed(2)}%
                </Text>
              </View>

              {/* Conditional content based on verification status */}
              {verificationResult?.isVerified ? (
                <View
                  style={[
                    styles.modalDescriptionContainer,
                    { backgroundColor: '#E8F5E8', borderColor: '#4CAF50' },
                  ]}>
                  <Text style={[styles.modalDescription, { color: '#2E7D32' }]}>
                    ✓ Verification successful! Your identity has been confirmed.
                    {verificationResult?.description && `\n\n${verificationResult.description}`}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.modalDescriptionContainer,
                    { backgroundColor: '#FFEBEE', borderColor: '#F44336' },
                  ]}>
                  <Text style={[styles.modalDescription, { color: '#C62828' }]}>
                    ✗ Verification failed. Please try again with a clearer image.
                    {verificationResult?.description && `\n\n${verificationResult.description}`}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                // setShowVerificationModal(false),
                // navigation.navigate('NewScreen')
                setShowVerificationModal(false);
                verificationResult?.isVerified
                  ? (navigation.replace('NewScreen'),
                    dispatch(clearCapturedImages()),
                    dispatch(setCurrentImageIndex(0)))
                  : dispatch(clearCapturedImages());
                dispatch(setCurrentImageIndex(0));
              }}>
              <Text style={styles.modalButtonText}>Move to next step of verification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: ColorPalettes.backgrounds.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '90%',
    minWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalBody: {
    width: '100%',
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalDataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalettes.text.secondary,
    flex: 1,
  },
  modalDataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: ColorPalettes.text.primary,
    flex: 2,
    textAlign: 'right',
  },
  modalDescriptionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  modalDescription: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#1E2772',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    marginTop: 24,
  },
  modalButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  errorIcon: {
    fontSize: 30,
  },
  bulletPoints: {
    marginTop: 12,
    paddingLeft: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    color: '#C62828',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    color: '#C62828',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default ScanPrepScreen;

// function updateUserVerification(cnic: string, arg1: boolean): any {
//   throw new Error('Function not implemented.');
// }
