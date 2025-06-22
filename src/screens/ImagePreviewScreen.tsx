import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type ImagePreviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImagePreview'>;
type ImagePreviewScreenRouteProp = RouteProp<RootStackParamList, 'ImagePreview'>;

interface ImagePreviewScreenProps {
  navigation: ImagePreviewScreenNavigationProp;
  route: ImagePreviewScreenRouteProp;
}

const ImagePreviewScreen: React.FC<ImagePreviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { imageUri } = route.params;
  const [showControls, setShowControls] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [sharpness, setSharpness] = useState(0);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  
  console.log('ImagePreviewScreen rendered with URI:', imageUri);
  console.log('Current enhancement values:', { brightness, contrast, sharpness, isGrayscale, isInverted });
  
  const handleBackToHome = () => {
    console.log('Navigating back to Home');
    navigation.navigate('Home');
  };

  const handleTakeAnother = () => {
    console.log('Navigating back to Camera');
    navigation.navigate('Camera', {});
  };

  const handleClose = () => {
    console.log('Closing preview screen');
    navigation.goBack();
  };

  const resetEnhancements = () => {
    console.log('Resetting enhancements');
    setBrightness(0);
    setContrast(1);
    setSharpness(0);
    setIsGrayscale(false);
    setIsInverted(false);
    Alert.alert('Reset', 'All enhancements have been reset to default values.');
  };

  const applyFingerprintEnhancement = () => {
    console.log('Applying fingerprint enhancement preset');
    // Optimal settings for fingerprint visibility
    setBrightness(0.3);
    setContrast(1.8);
    setSharpness(0.8);
    setIsGrayscale(true);
    setIsInverted(false);
    Alert.alert('Enhanced', 'Fingerprint enhancement preset applied!');
  };

  // Simple slider component using buttons
  const SimpleSlider = ({ 
    label, 
    value, 
    min, 
    max, 
    step, 
    onChange 
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
  }) => {
    const decrease = () => {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    };

    const increase = () => {
      const newValue = Math.min(max, value + step);
      onChange(newValue);
    };

    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.controlLabel}>{label}: {value.toFixed(2)}</Text>
        <View style={styles.sliderControls}>
          <TouchableOpacity style={styles.sliderButton} onPress={decrease}>
            <Text style={styles.sliderButtonText}>-</Text>
          </TouchableOpacity>
          <View style={styles.sliderValue}>
            <Text style={styles.sliderValueText}>{value.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.sliderButton} onPress={increase}>
            <Text style={styles.sliderButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Apply filters using React Native's built-in properties
  const getImageStyle = () => {
    let opacity = 1 + brightness * 0.5; // Brightness effect
    opacity = Math.max(0.1, Math.min(1.5, opacity));
    
    const style: any = {
      ...styles.fullScreenImage,
      opacity: opacity,
      transform: [{ scale: 1.5 }], // Default zoom effect
    };

    // Apply grayscale effect using tintColor
    if (isGrayscale) {
      style.tintColor = '#888888';
    }

    return style;
  };

  const renderEnhancedImage = () => {
    return (
      <View style={styles.imageWrapper}>
        <View style={styles.zoomContainer}>
          <Image
            source={{ uri: imageUri }}
            style={getImageStyle()}
            resizeMode="cover"
            onLoad={() => console.log('Image loaded successfully')}
            onError={(error) => console.log('Image load error:', error)}
          />
        </View>
        
        {/* Contrast overlay */}
        {contrast !== 1 && (
          <View 
            style={[
              styles.contrastOverlay,
              { 
                backgroundColor: contrast > 1 ? 'transparent' : 'rgba(128,128,128,0.3)',
                opacity: Math.abs(contrast - 1) * 0.5
              }
            ]} 
          />
        )}
        
        {/* Invert overlay */}
        {isInverted && (
          <View style={styles.invertOverlay} />
        )}
        
        {/* Enhancement Info Overlay */}
        {(brightness !== 0 || contrast !== 1 || sharpness !== 0 || isGrayscale || isInverted) && (
          <View style={styles.enhancementInfo}>
            <Text style={styles.enhancementText}>
              Enhancements Applied:
            </Text>
            {brightness !== 0 && (
              <Text style={styles.enhancementDetail}>
                Brightness: {brightness > 0 ? '+' : ''}{brightness.toFixed(2)}
              </Text>
            )}
            {contrast !== 1 && (
              <Text style={styles.enhancementDetail}>
                Contrast: {contrast.toFixed(2)}x
              </Text>
            )}
            {sharpness !== 0 && (
              <Text style={styles.enhancementDetail}>
                Sharpness: +{sharpness.toFixed(2)}
              </Text>
            )}
            {isGrayscale && (
              <Text style={styles.enhancementDetail}>
                Grayscale: ON
              </Text>
            )}
            {isInverted && (
              <Text style={styles.enhancementDetail}>
                Inverted: ON
              </Text>
            )}
            <Text style={styles.enhancementDetail}>
              Zoom: {2.0}x
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      
      {/* Enhanced Image Display */}
      <View style={styles.imageContainer}>
        {renderEnhancedImage()}
      </View>

      {/* Controls Panel */}
      {showControls && (
        <View style={styles.controlsPanel}>
          <ScrollView style={styles.controlsScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.controlsTitle}>Image Enhancement Controls</Text>
            
            {/* Brightness Control */}
            <SimpleSlider
              label="Brightness"
              value={brightness}
              min={-1}
              max={1}
              step={0.1}
              onChange={setBrightness}
            />

            {/* Contrast Control */}
            <SimpleSlider
              label="Contrast"
              value={contrast}
              min={0.5}
              max={3}
              step={0.1}
              onChange={setContrast}
            />

            {/* Sharpness Control */}
            <SimpleSlider
              label="Sharpness"
              value={sharpness}
              min={0}
              max={2}
              step={0.1}
              onChange={setSharpness}
            />

            {/* Filter Toggles */}
            <View style={styles.filterGroup}>
              <TouchableOpacity 
                style={[styles.filterButton, isGrayscale && styles.filterButtonActive]}
                onPress={() => setIsGrayscale(!isGrayscale)}
              >
                <Text style={[styles.filterButtonText, isGrayscale && styles.filterButtonTextActive]}>
                  Grayscale {isGrayscale ? '✓' : ''}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterButton, isInverted && styles.filterButtonActive]}
                onPress={() => setIsInverted(!isInverted)}
              >
                <Text style={[styles.filterButtonText, isInverted && styles.filterButtonTextActive]}>
                  Invert {isInverted ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Preset Buttons */}
            <View style={styles.presetGroup}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={applyFingerprintEnhancement}
              >
                <Text style={styles.presetButtonText}>📈 Enhance Fingerprint</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetEnhancements}
              >
                <Text style={styles.resetButtonText}>🔄 Reset All</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Main Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.enhanceToggleButton}
          onPress={() => {
            console.log('Toggle controls pressed, current state:', showControls);
            setShowControls(!showControls);
          }}
        >
          <Text style={styles.enhanceToggleText}>
            {showControls ? '🎨 Hide Controls' : '🎨 Show Enhancement Controls'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackToHome}
        >
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.retakeButton} 
          onPress={handleTakeAnother}
        >
          <Text style={styles.retakeButtonText}>📸 Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B0D', // SWSAM dark background
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  controlsPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 11, 13, 0.95)', // SWSAM dark with transparency
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  controlsScroll: {
    width: '100%',
    paddingHorizontal: 20,
  },
  controlsTitle: {
    color: '#194785', // Primary font color
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  controlGroup: {
    marginBottom: 25,
  },
  controlLabel: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 25,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButton: {
    backgroundColor: '#1E40AF', // SWSAM blue
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 50,
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#194785', // Primary font color
    fontSize: 18,
    fontWeight: '700',
  },
  sliderValue: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)', // Light SWSAM blue background
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E40AF',
  },
  sliderValueText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '600',
  },
  filterGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 25,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(55, 65, 81, 0.9)', // SWSAM gray
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  filterButtonText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '600',
  },
  filterButtonActive: {
    backgroundColor: '#1E40AF', // SWSAM blue
    borderColor: '#1E40AF',
  },
  filterButtonTextActive: {
    color: '#194785', // Primary font color
    fontWeight: '700',
  },
  presetGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#1E40AF', // SWSAM blue
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  presetButtonText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(55, 65, 81, 0.9)', // SWSAM gray
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  resetButtonText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  enhanceToggleButton: {
    backgroundColor: '#1E40AF', // SWSAM blue
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  enhanceToggleText: {
    color: '#194785', // Primary font color
    fontSize: 18,
    fontWeight: '700',
  },
  navigationButtons: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(55, 65, 81, 0.9)', // SWSAM gray
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  backButtonText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButton: {
    backgroundColor: '#DC2626', // Professional red
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retakeButtonText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '700',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  enhancementInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(10, 11, 13, 0.9)', // SWSAM dark background
    padding: 15,
    borderRadius: 15,
    maxWidth: 250,
    borderWidth: 1,
    borderColor: '#1E40AF', // SWSAM blue border
  },
  enhancementText: {
    color: '#194785', // Primary font color
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  enhancementDetail: {
    color: '#194785', // Primary font color
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.9)', // SWSAM gray
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#374151',
  },
  closeButtonText: {
    color: '#194785', // Primary font color
    fontSize: 18,
    fontWeight: '700',
  },
  contrastOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  invertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 11, 13, 0.6)', // SWSAM dark overlay
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImagePreviewScreen; 