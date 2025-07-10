import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCaptureType,
  setOutputType,
  setTimeToCapture,
  setOverlayColor,
  setImageQualityCompressionQuality,
  setImageQualityFormat,
  setImageQualityHighResolution,
  setImageQualityAntiAliasing,
  setCameraFocusMode,
  setCameraExposureMode,
  setCameraWhiteBalanceMode,
  setCameraStabilization,
  setCameraHighQualityMode,
  setProcessingNoiseReduction,
  setProcessingSharpening,
  setProcessingContrastEnhancement,
  setProcessingBrightnessAdjustment,
  setProcessingQualityThreshold,
  setCaptureCountdownEnabled,
  setCaptureCountdownBackgroundColor,
  setCaptureCountdownProgressColor,
  setCaptureCountdownTextColor,
  setCaptureCountdownDuration,
  setBackButtonEnabled,
  setBackButtonBackgroundColor,
  setBackButtonPadding,
  setHelpTextEnabled,
  setHelpTextColor,
  setHelpTextSize,
  setFingerEllipseEnabled,
  setFingerEllipseThickness,
  setDistanceIndicatorEnabled,
  setDistanceIndicatorSelectedBarColor,
  setDistanceIndicatorUnselectedBarColor,
  setDistanceIndicatorArrowColor,
  setDistanceIndicatorSensitivity,
  setMotionDetectionEnabled,
  setMotionDetectionSensitivity,
  setMotionDetectionStabilizationTime,
  setMotionDetectionThreshold,
  setQualityValidationEnabled,
  setQualityValidationMinimumScore,
  setQualityValidationRejectBlurry,
  setQualityValidationRejectLowContrast,
  setQualityValidationFeedback,
  resetScanState,
} from '../store/slices/scanSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type TunerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface TunerScreenProps {
  navigation: TunerScreenNavigationProp;
}

const TunerScreen: React.FC<TunerScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const scanConfig = useAppSelector(state => state.scan);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Configuration',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => dispatch(resetScanState()) },
      ]
    );
  };

  const renderSectionHeader = (title: string, key: string) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(key)}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionIcon}>
        {expandedSections.has(key) ? '−' : '+'}
      </Text>
    </TouchableOpacity>
  );

  const renderSwitchRow = (label: string, value: boolean, onValueChange: (value: boolean) => void) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: ColorPalettes.text.light, true: ColorPalettes.semantic.fingerprint }}
          thumbColor={value ? ColorPalettes.text.dark : ColorPalettes.text.light}
        />
      </View>
    </View>
  );

  const renderTextInput = (label: string, value: string, onChangeText: (text: string) => void, placeholder?: string) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={ColorPalettes.text.light}
        />
      </View>
    </View>
  );

  const renderNumberInput = (label: string, value: number, onChangeText: (text: string) => void) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <TextInput
          style={styles.textInput}
          value={value.toString()}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholderTextColor={ColorPalettes.text.light}
        />
      </View>
    </View>
  );

  const renderPickerRow = (label: string, value: string, options: string[], onValueChange: (value: string) => void) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.valueContainer, styles.pickerOuterContainer]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickerContainer}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.pickerOption, value === option && styles.pickerOptionSelected]}
              onPress={() => onValueChange(option)}
            >
              <Text style={[styles.pickerOptionText, value === option && styles.pickerOptionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Configuration Tuner</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Basic Settings */}
        {renderSectionHeader('Basic Settings', 'basic')}
        {expandedSections.has('basic') && (
          <View style={styles.section}>
            {renderPickerRow('Output Type', scanConfig.outputType, 
              ['CAPTURE_ONLY', 'CAPTURE_AND_SEGMENTATION'], 
              (value) => dispatch(setOutputType(value)))}
            {renderNumberInput('Time to Capture', scanConfig.timeToCapture, 
              (value) => dispatch(setTimeToCapture(parseInt(value) || 1)))}
            {renderTextInput('Overlay Color', scanConfig.overlayColor, 
              (value) => dispatch(setOverlayColor(value)), 'Color code')}
          </View>
        )}

        {/* Image Quality */}
        {renderSectionHeader('Image Quality', 'imageQuality')}
        {expandedSections.has('imageQuality') && (
          <View style={styles.section}>
            {renderNumberInput('Compression Quality', scanConfig.imageQuality.compressionQuality, 
              (value) => dispatch(setImageQualityCompressionQuality(parseInt(value) || 100)))}
            {renderPickerRow('Image Format', scanConfig.imageQuality.imageFormat, 
              ['PNG', 'JPEG', 'WEBP'], 
              (value) => dispatch(setImageQualityFormat(value)))}
            {renderSwitchRow('High Resolution', scanConfig.imageQuality.enableHighResolution, 
              (value) => dispatch(setImageQualityHighResolution(value)))}
            {renderSwitchRow('Anti-Aliasing', scanConfig.imageQuality.antiAliasing, 
              (value) => dispatch(setImageQualityAntiAliasing(value)))}
          </View>
        )}

        {/* Camera Settings */}
        {renderSectionHeader('Camera Settings', 'camera')}
        {expandedSections.has('camera') && (
          <View style={styles.section}>
            {renderPickerRow('Focus Mode', scanConfig.cameraSettings.focusMode, 
              ['auto', 'manual', 'continuous'], 
              (value) => dispatch(setCameraFocusMode(value)))}
            {renderPickerRow('Exposure Mode', scanConfig.cameraSettings.exposureMode, 
              ['auto', 'manual', 'locked'], 
              (value) => dispatch(setCameraExposureMode(value)))}
            {renderPickerRow('White Balance', scanConfig.cameraSettings.whiteBalanceMode, 
              ['auto', 'daylight', 'cloudy', 'fluorescent'], 
              (value) => dispatch(setCameraWhiteBalanceMode(value)))}
            {renderSwitchRow('Stabilization', scanConfig.cameraSettings.stabilization, 
              (value) => dispatch(setCameraStabilization(value)))}
            {renderSwitchRow('High Quality Mode', scanConfig.cameraSettings.highQualityMode, 
              (value) => dispatch(setCameraHighQualityMode(value)))}
          </View>
        )}

        {/* Processing Settings */}
        {renderSectionHeader('Processing Settings', 'processing')}
        {expandedSections.has('processing') && (
          <View style={styles.section}>
            {renderSwitchRow('Noise Reduction', scanConfig.processingSettings.enableNoiseReduction, 
              (value) => dispatch(setProcessingNoiseReduction(value)))}
            {renderSwitchRow('Sharpening', scanConfig.processingSettings.enableSharpening, 
              (value) => dispatch(setProcessingSharpening(value)))}
            {renderSwitchRow('Contrast Enhancement', scanConfig.processingSettings.contrastEnhancement, 
              (value) => dispatch(setProcessingContrastEnhancement(value)))}
            {renderPickerRow('Brightness Adjustment', scanConfig.processingSettings.brightnessAdjustment, 
              ['auto', 'manual', 'none'], 
              (value) => dispatch(setProcessingBrightnessAdjustment(value)))}
            {renderNumberInput('Quality Threshold', scanConfig.processingSettings.qualityThreshold, 
              (value) => dispatch(setProcessingQualityThreshold(parseInt(value) || 80)))}
          </View>
        )}

        {/* Capture Countdown */}
        {renderSectionHeader('Capture Countdown', 'countdown')}
        {expandedSections.has('countdown') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.captureCountdown.enabled, 
              (value) => dispatch(setCaptureCountdownEnabled(value)))}
            {renderTextInput('Background Color', scanConfig.captureCountdown.backgroundColor, 
              (value) => dispatch(setCaptureCountdownBackgroundColor(value)))}
            {renderTextInput('Progress Color', scanConfig.captureCountdown.progressColor, 
              (value) => dispatch(setCaptureCountdownProgressColor(value)))}
            {renderTextInput('Text Color', scanConfig.captureCountdown.textColor, 
              (value) => dispatch(setCaptureCountdownTextColor(value)))}
            {renderNumberInput('Duration', scanConfig.captureCountdown.countdownDuration, 
              (value) => dispatch(setCaptureCountdownDuration(parseInt(value) || 2)))}
          </View>
        )}

        {/* Back Button */}
        {renderSectionHeader('Back Button', 'backButton')}
        {expandedSections.has('backButton') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.backButton.enabled, 
              (value) => dispatch(setBackButtonEnabled(value)))}
            {renderTextInput('Background Color', scanConfig.backButton.backgroundColor, 
              (value) => dispatch(setBackButtonBackgroundColor(value)))}
            {renderNumberInput('Padding', scanConfig.backButton.buttonPadding, 
              (value) => dispatch(setBackButtonPadding(parseInt(value) || 20)))}
          </View>
        )}

        {/* Help Text */}
        {renderSectionHeader('Help Text', 'helpText')}
        {expandedSections.has('helpText') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.helpText.enabled, 
              (value) => dispatch(setHelpTextEnabled(value)))}
            {renderTextInput('Text Color', scanConfig.helpText.textColor, 
              (value) => dispatch(setHelpTextColor(value)))}
            {renderNumberInput('Text Size', scanConfig.helpText.textSize, 
              (value) => dispatch(setHelpTextSize(parseInt(value) || 20)))}
          </View>
        )}

        {/* Finger Ellipse */}
        {renderSectionHeader('Finger Ellipse', 'fingerEllipse')}
        {expandedSections.has('fingerEllipse') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.fingerEllipse.enabled, 
              (value) => dispatch(setFingerEllipseEnabled(value)))}
            {renderNumberInput('Thickness', scanConfig.fingerEllipse.thickness, 
              (value) => dispatch(setFingerEllipseThickness(parseInt(value) || 3)))}
          </View>
        )}

        {/* Distance Indicator */}
        {renderSectionHeader('Distance Indicator', 'distanceIndicator')}
        {expandedSections.has('distanceIndicator') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.distanceIndicator.enabled, 
              (value) => dispatch(setDistanceIndicatorEnabled(value)))}
            {renderTextInput('Selected Bar Color', scanConfig.distanceIndicator.selectedBarColor, 
              (value) => dispatch(setDistanceIndicatorSelectedBarColor(value)))}
            {renderTextInput('Unselected Bar Color', scanConfig.distanceIndicator.unselectedBarColor, 
              (value) => dispatch(setDistanceIndicatorUnselectedBarColor(value)))}
            {renderTextInput('Arrow Color', scanConfig.distanceIndicator.arrowColor, 
              (value) => dispatch(setDistanceIndicatorArrowColor(value)))}
            {renderPickerRow('Sensitivity', scanConfig.distanceIndicator.sensitivity, 
              ['low', 'medium', 'high'], 
              (value) => dispatch(setDistanceIndicatorSensitivity(value)))}
          </View>
        )}

        {/* Motion Detection */}
        {renderSectionHeader('Motion Detection', 'motionDetection')}
        {expandedSections.has('motionDetection') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.motionDetection.enabled, 
              (value) => dispatch(setMotionDetectionEnabled(value)))}
            {renderPickerRow('Sensitivity', scanConfig.motionDetection.sensitivity, 
              ['low', 'medium', 'high'], 
              (value) => dispatch(setMotionDetectionSensitivity(value)))}
            {renderNumberInput('Stabilization Time', scanConfig.motionDetection.stabilizationTime, 
              (value) => dispatch(setMotionDetectionStabilizationTime(parseInt(value) || 1)))}
            {renderNumberInput('Motion Threshold', scanConfig.motionDetection.motionThreshold, 
              (value) => dispatch(setMotionDetectionThreshold(parseFloat(value) || 1.0)))}
          </View>
        )}

        {/* Quality Validation */}
        {renderSectionHeader('Quality Validation', 'qualityValidation')}
        {expandedSections.has('qualityValidation') && (
          <View style={styles.section}>
            {renderSwitchRow('Enabled', scanConfig.qualityValidation.enabled, 
              (value) => dispatch(setQualityValidationEnabled(value)))}
            {renderNumberInput('Minimum Score', scanConfig.qualityValidation.minimumQualityScore, 
              (value) => dispatch(setQualityValidationMinimumScore(parseInt(value) || 75)))}
            {renderSwitchRow('Reject Blurry Images', scanConfig.qualityValidation.rejectBlurryImages, 
              (value) => dispatch(setQualityValidationRejectBlurry(value)))}
            {renderSwitchRow('Reject Low Contrast', scanConfig.qualityValidation.rejectLowContrastImages, 
              (value) => dispatch(setQualityValidationRejectLowContrast(value)))}
            {renderSwitchRow('Enable Quality Feedback', scanConfig.qualityValidation.enableQualityFeedback, 
              (value) => dispatch(setQualityValidationFeedback(value)))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalettes.text.light,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: ColorPalettes.semantic.fingerprint,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ColorPalettes.text.dark,
  },
  resetButton: {
    backgroundColor: ColorPalettes.interactive.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  resetButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalettes.text.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.dark,
  },
  sectionIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorPalettes.semantic.fingerprint,
  },
  section: {
    backgroundColor: ColorPalettes.backgrounds.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalettes.text.light + '50',
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: ColorPalettes.text.dark,
    width: '40%',
    fontWeight: '500',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: ColorPalettes.text.light + '30',
  },
  valueContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  textInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: ColorPalettes.text.light,
    borderRadius: 5,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    color: ColorPalettes.text.dark,
    fontSize: 14,
  },
  pickerOuterContainer: {
    paddingLeft: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderWidth: 1,
    borderColor: ColorPalettes.text.light,
    marginRight: 4,
  },
  pickerOptionSelected: {
    backgroundColor: ColorPalettes.semantic.fingerprint,
    borderColor: ColorPalettes.semantic.fingerprint,
  },
  pickerOptionText: {
    fontSize: 12,
    color: ColorPalettes.text.dark,
    textAlign: 'center',
  },
  pickerOptionTextSelected: {
    color: ColorPalettes.text.light,
    fontWeight: '600',
  },
});

export default TunerScreen; 