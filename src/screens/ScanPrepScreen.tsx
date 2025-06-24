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
  clearError 
} from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type ScanPrepScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ScanPrep'
>;

type ScanPrepScreenRouteProp = RouteProp<RootStackParamList, 'ScanPrep'>;

interface Props {
  navigation: ScanPrepScreenNavigationProp;
  route: ScanPrepScreenRouteProp;
}

const ScanPrepScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { name: userName } = useAppSelector((state) => state.user);
  const { 
    capturedImages, 
    scanningProgress, 
    currentSession, 
    error 
  } = useAppSelector((state) => state.biometric);
  
  const pulseAnim = useState(new Animated.Value(1))[0];
  
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
      ])
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
        Image.getSize(imageUri, (width, height) => {
          dispatch(addCapturedImage({
            uri: imageUri,
            index: capturedIndex,
            quality: 'high',
            size: { width, height },
          }));
        }, (error) => {
          console.error('Error getting image size:', error);
          dispatch(addCapturedImage({
            uri: imageUri,
            index: capturedIndex,
            quality: 'high',
          }));
        });
      }
    });
  };

  const handleStartCamera = () => {
    const nextIndex = capturedImages.length;
    dispatch(setCurrentImageIndex(nextIndex));
    navigation.navigate('Camera', {
      imageIndex: nextIndex,
      onImageCaptured: (imageUri: string, capturedIndex: number) => {
        // Get image dimensions and file size
        Image.getSize(imageUri, (width, height) => {
          dispatch(addCapturedImage({
            uri: imageUri,
            index: capturedIndex,
            quality: 'high',
            size: { width, height },
          }));
        }, (error) => {
          console.error('Error getting image size:', error);
          dispatch(addCapturedImage({
            uri: imageUri,
            index: capturedIndex,
            quality: 'high',
          }));
        });
      }
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const getButtonText = () => {
    if (capturedImages.length === 0) {
      return 'Capture 1/3 Images';
    } else if (capturedImages.length < 3) {
      return `Capture ${capturedImages.length + 1}/3 Images`;
    } else {
      return 'All Images Captured - Proceed';
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
      const originalImage = await new Promise<{width: number, height: number}>((resolve, reject) => {
        Image.getSize(imageUri, (width, height) => {
          resolve({ width, height });
        }, reject);
      });

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
        { mode: 'stretch' } // Stretch to exact dimensions
      );

      // Save the resized image to gallery
      await CameraRoll.saveAsset(resizedImage.uri, {
        type: 'photo',
        album: 'hyperI Scans'
      });
      
      Alert.alert(
        'Success',
        `Zoomed image ${index + 1} saved to gallery successfully!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving zoomed image to gallery:', error);
      Alert.alert(
        'Error',
        'Failed to save zoomed image to gallery. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderThumbnail = (index: number) => {
    const imageData = capturedImages.find(img => img.index === index);
    const hasImage = imageData?.uri;
    
    return (
      <TouchableOpacity
        key={index}
        style={styles.thumbnailContainer}
        onPress={() => handleThumbnailPress(index)}
      >
        <Animated.View style={[
          styles.thumbnail,
          { transform: [{ scale: thumbnailAnims[index] }] }
        ]}>
          {hasImage ? (
            <>
              <Image 
                source={{ uri: hasImage }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDownloadImage(hasImage, index);
                }}
              >
                <Text style={styles.downloadIcon}>↓</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          )}
          <Text style={styles.thumbnailNumber}>{index + 1}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ColorPalettes.backgrounds.primary}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
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
            <Text style={styles.title}>Scan Preparation</Text>
            <Text style={styles.subtitle}>Hello {userName || 'User'}!</Text>
          </View>

          <View style={styles.thumbnailSection}>
            <Text style={styles.sectionTitle}>Captured Images</Text>
            <View style={styles.thumbnailGrid}>
              {[0, 1, 2].map(renderThumbnail)}
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(capturedImages.length / 3) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {capturedImages.length} of 3 images captured
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[
                  styles.captureButton,
                  capturedImages.length >= 3 && styles.completedButton
                ]} 
                onPress={handleStartCamera}
              >
                <Text style={styles.buttonText}>{getButtonText()}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
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
  logo: {
    width: 60,
    height: 60,
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
  thumbnailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  thumbnailContainer: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 120,
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
    color: ColorPalettes.brand.primary,
    fontWeight: 'bold',
  },
  thumbnailNumber: {
    position: 'absolute',
    bottom: -25,
    fontSize: 14,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
  },
  downloadButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ColorPalettes.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ColorPalettes.shadows.primary,
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
    backgroundColor: ColorPalettes.brand.primary,
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
    backgroundColor: ColorPalettes.interactive.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 250,
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
  completedButton: {
    backgroundColor: ColorPalettes.interactive.secondary,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScanPrepScreen; 