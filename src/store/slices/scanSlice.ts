import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageQuality {
  compressionQuality: number;
  imageFormat: string;
  enableHighResolution: boolean;
  antiAliasing: boolean;
}

interface CameraSettings {
  focusMode: string;
  exposureMode: string;
  whiteBalanceMode: string;
  stabilization: boolean;
  highQualityMode: boolean;
}

interface ProcessingSettings {
  enableNoiseReduction: boolean;
  enableSharpening: boolean;
  contrastEnhancement: boolean;
  brightnessAdjustment: string;
  qualityThreshold: number;
}

interface CaptureCountdown {
  enabled: boolean;
  backgroundColor: string;
  progressColor: string;
  textColor: string;
  countdownDuration: number;
}

interface IconOptions {
  enabled: boolean;
  iconFile: string;
  iconColor: string;
  iconSize: { width: number; height: number };
}

interface LabelOptions {
  enabled: boolean;
  content: string;
  textColor: string;
  textSize: number;
}

interface BackButton {
  enabled: boolean;
  backgroundColor: string;
  buttonPadding: number;
  buttonSize: { width: number; height: number };
  iconOptions: IconOptions;
  labelOptions: LabelOptions;
}

interface HelpTextMessages {
  leftHandMessage: string;
  rightHandMessage: string;
  thumbsMessage: string;
}

interface HelpText {
  enabled: boolean;
  messages: HelpTextMessages;
  textColor: string;
  textSize: number;
}

interface FingerEllipse {
  enabled: boolean;
  thickness: number;
}

interface DistanceText {
  enabled: boolean;
  content: string;
  textColor: string;
  textSize: number;
}

interface DistanceIndicator {
  enabled: boolean;
  selectedBarColor: string;
  unselectedBarColor: string;
  arrowColor: string;
  sensitivity: string;
  tooCloseText: DistanceText;
  tooFarText: DistanceText;
  perfectDistanceText: DistanceText;
}

interface MotionDetection {
  enabled: boolean;
  sensitivity: string;
  stabilizationTime: number;
  motionThreshold: number;
}

interface QualityValidation {
  enabled: boolean;
  minimumQualityScore: number;
  rejectBlurryImages: boolean;
  rejectLowContrastImages: boolean;
  enableQualityFeedback: boolean;
}

interface ScanState {
  licenseKey: string;
  numberFingersToCapture: number;
  captureType: string;
  outputType: string;
  timeToCapture: number;
  overlayColor: string;
  imageQuality: ImageQuality;
  cameraSettings: CameraSettings;
  processingSettings: ProcessingSettings;
  captureCountdown: CaptureCountdown;
  backButton: BackButton;
  helpText: HelpText;
  fingerEllipse: FingerEllipse;
  distanceIndicator: DistanceIndicator;
  motionDetection: MotionDetection;
  qualityValidation: QualityValidation;
}

const initialState: ScanState = {
  licenseKey: '9KM2-DLW6-E8VY-ADFI',
  numberFingersToCapture: 4,
  captureType: 'LEFT_HAND_FINGERS',
  outputType: 'CAPTURE_AND_SEGMENTATION',
  timeToCapture: 1,
  overlayColor: '',
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
    backgroundColor: '',
    progressColor: '',
    textColor: '',
    countdownDuration: 2,
  },
  backButton: {
    enabled: true,
    backgroundColor: '',
    buttonPadding: 20,
    buttonSize: { width: 56, height: 56 },
    iconOptions: {
      enabled: true,
      iconFile: 'fingerprintsdk_ic_close',
      iconColor: '',
      iconSize: { width: 32, height: 32 },
    },
    labelOptions: {
      enabled: false,
      content: 'Back',
      textColor: '',
      textSize: 14,
    },
  },
  helpText: {
    enabled: true,
    messages: {
      leftHandMessage: 'Place your left hand (without thumb)\nuntil the marker is centered.',
      rightHandMessage: 'Place your right hand (without thumb)\nuntil the marker is centered.\nHold steady for sharp images.',
      thumbsMessage: 'Place your thumbs\nuntil the marker is centered.\nHold steady for sharp images.',
    },
    textColor: '',
    textSize: 20,
  },
  fingerEllipse: {
    enabled: true,
    thickness: 3,
  },
  distanceIndicator: {
    enabled: true,
    selectedBarColor: '',
    unselectedBarColor: '',
    arrowColor: '',
    sensitivity: 'medium',
    tooCloseText: {
      enabled: true,
      content: 'Too close',
      textColor: '',
      textSize: 16,
    },
    tooFarText: {
      enabled: true,
      content: 'Too far',
      textColor: '',
      textSize: 16,
    },
    perfectDistanceText: {
      enabled: true,
      content: 'Perfect distance - hold steady!',
      textColor: '',
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

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {   
    setCaptureType: (state, action: PayloadAction<string>) => {
      state.captureType = action.payload;
    },
    setOutputType: (state, action: PayloadAction<string>) => {
      state.outputType = action.payload;
    },
    setTimeToCapture: (state, action: PayloadAction<number>) => {
      state.timeToCapture = action.payload;
    },
    setOverlayColor: (state, action: PayloadAction<string>) => {
      state.overlayColor = action.payload;
    },
    setImageQuality: (state, action: PayloadAction<ImageQuality>) => {
      state.imageQuality = action.payload;
    },
    setImageQualityCompressionQuality: (state, action: PayloadAction<number>) => {
      state.imageQuality.compressionQuality = action.payload;
    },
    setImageQualityFormat: (state, action: PayloadAction<string>) => {
      state.imageQuality.imageFormat = action.payload;
    },
    setImageQualityHighResolution: (state, action: PayloadAction<boolean>) => {
      state.imageQuality.enableHighResolution = action.payload;
    },
    setImageQualityAntiAliasing: (state, action: PayloadAction<boolean>) => {
      state.imageQuality.antiAliasing = action.payload;
    },
    setCameraSettings: (state, action: PayloadAction<CameraSettings>) => {
      state.cameraSettings = action.payload;
    },
    setCameraFocusMode: (state, action: PayloadAction<string>) => {
      state.cameraSettings.focusMode = action.payload;
    },
    setCameraExposureMode: (state, action: PayloadAction<string>) => {
      state.cameraSettings.exposureMode = action.payload;
    },
    setCameraWhiteBalanceMode: (state, action: PayloadAction<string>) => {
      state.cameraSettings.whiteBalanceMode = action.payload;
    },
    setCameraStabilization: (state, action: PayloadAction<boolean>) => {
      state.cameraSettings.stabilization = action.payload;
    },
    setCameraHighQualityMode: (state, action: PayloadAction<boolean>) => {
      state.cameraSettings.highQualityMode = action.payload;
    },
    setProcessingSettings: (state, action: PayloadAction<ProcessingSettings>) => {
      state.processingSettings = action.payload;
    },
    setProcessingNoiseReduction: (state, action: PayloadAction<boolean>) => {
      state.processingSettings.enableNoiseReduction = action.payload;
    },
    setProcessingSharpening: (state, action: PayloadAction<boolean>) => {
      state.processingSettings.enableSharpening = action.payload;
    },
    setProcessingContrastEnhancement: (state, action: PayloadAction<boolean>) => {
      state.processingSettings.contrastEnhancement = action.payload;
    },
    setProcessingBrightnessAdjustment: (state, action: PayloadAction<string>) => {
      state.processingSettings.brightnessAdjustment = action.payload;
    },
    setProcessingQualityThreshold: (state, action: PayloadAction<number>) => {
      state.processingSettings.qualityThreshold = action.payload;
    },
    setCaptureCountdown: (state, action: PayloadAction<CaptureCountdown>) => {
      state.captureCountdown = action.payload;
    },
    setCaptureCountdownEnabled: (state, action: PayloadAction<boolean>) => {
      state.captureCountdown.enabled = action.payload;
    },
    setCaptureCountdownBackgroundColor: (state, action: PayloadAction<string>) => {
      state.captureCountdown.backgroundColor = action.payload;
    },
    setCaptureCountdownProgressColor: (state, action: PayloadAction<string>) => {
      state.captureCountdown.progressColor = action.payload;
    },
    setCaptureCountdownTextColor: (state, action: PayloadAction<string>) => {
      state.captureCountdown.textColor = action.payload;
    },
    setCaptureCountdownDuration: (state, action: PayloadAction<number>) => {
      state.captureCountdown.countdownDuration = action.payload;
    },
    setBackButton: (state, action: PayloadAction<BackButton>) => {
      state.backButton = action.payload;
    },
    setBackButtonEnabled: (state, action: PayloadAction<boolean>) => {
      state.backButton.enabled = action.payload;
    },
    setBackButtonBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backButton.backgroundColor = action.payload;
    },
    setBackButtonPadding: (state, action: PayloadAction<number>) => {
      state.backButton.buttonPadding = action.payload;
    },
    setBackButtonSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.backButton.buttonSize = action.payload;
    },
    setBackButtonIconOptions: (state, action: PayloadAction<IconOptions>) => {
      state.backButton.iconOptions = action.payload;
    },
    setBackButtonLabelOptions: (state, action: PayloadAction<LabelOptions>) => {
      state.backButton.labelOptions = action.payload;
    },
    setHelpText: (state, action: PayloadAction<HelpText>) => {
      state.helpText = action.payload;
    },
    setHelpTextEnabled: (state, action: PayloadAction<boolean>) => {
      state.helpText.enabled = action.payload;
    },
    setHelpTextMessages: (state, action: PayloadAction<HelpTextMessages>) => {
      state.helpText.messages = action.payload;
    },
    setHelpTextColor: (state, action: PayloadAction<string>) => {
      state.helpText.textColor = action.payload;
    },
    setHelpTextSize: (state, action: PayloadAction<number>) => {
      state.helpText.textSize = action.payload;
    },
    setFingerEllipse: (state, action: PayloadAction<FingerEllipse>) => {
      state.fingerEllipse = action.payload;
    },
    setFingerEllipseEnabled: (state, action: PayloadAction<boolean>) => {
      state.fingerEllipse.enabled = action.payload;
    },
    setFingerEllipseThickness: (state, action: PayloadAction<number>) => {
      state.fingerEllipse.thickness = action.payload;
    },
    setDistanceIndicator: (state, action: PayloadAction<DistanceIndicator>) => {
      state.distanceIndicator = action.payload;
    },
    setDistanceIndicatorEnabled: (state, action: PayloadAction<boolean>) => {
      state.distanceIndicator.enabled = action.payload;
    },
    setDistanceIndicatorSelectedBarColor: (state, action: PayloadAction<string>) => {
      state.distanceIndicator.selectedBarColor = action.payload;
    },
    setDistanceIndicatorUnselectedBarColor: (state, action: PayloadAction<string>) => {
      state.distanceIndicator.unselectedBarColor = action.payload;
    },
    setDistanceIndicatorArrowColor: (state, action: PayloadAction<string>) => {
      state.distanceIndicator.arrowColor = action.payload;
    },
    setDistanceIndicatorSensitivity: (state, action: PayloadAction<string>) => {
      state.distanceIndicator.sensitivity = action.payload;
    },
    setDistanceIndicatorTooCloseText: (state, action: PayloadAction<DistanceText>) => {
      state.distanceIndicator.tooCloseText = action.payload;
    },
    setDistanceIndicatorTooFarText: (state, action: PayloadAction<DistanceText>) => {
      state.distanceIndicator.tooFarText = action.payload;
    },
    setDistanceIndicatorPerfectDistanceText: (state, action: PayloadAction<DistanceText>) => {
      state.distanceIndicator.perfectDistanceText = action.payload;
    },
    setMotionDetection: (state, action: PayloadAction<MotionDetection>) => {
      state.motionDetection = action.payload;
    },
    setMotionDetectionEnabled: (state, action: PayloadAction<boolean>) => {
      state.motionDetection.enabled = action.payload;
    },
    setMotionDetectionSensitivity: (state, action: PayloadAction<string>) => {
      state.motionDetection.sensitivity = action.payload;
    },
    setMotionDetectionStabilizationTime: (state, action: PayloadAction<number>) => {
      state.motionDetection.stabilizationTime = action.payload;
    },
    setMotionDetectionThreshold: (state, action: PayloadAction<number>) => {
      state.motionDetection.motionThreshold = action.payload;
    },
    setQualityValidation: (state, action: PayloadAction<QualityValidation>) => {
      state.qualityValidation = action.payload;
    },
    setQualityValidationEnabled: (state, action: PayloadAction<boolean>) => {
      state.qualityValidation.enabled = action.payload;
    },
    setQualityValidationMinimumScore: (state, action: PayloadAction<number>) => {
      state.qualityValidation.minimumQualityScore = action.payload;
    },
    setQualityValidationRejectBlurry: (state, action: PayloadAction<boolean>) => {
      state.qualityValidation.rejectBlurryImages = action.payload;
    },
    setQualityValidationRejectLowContrast: (state, action: PayloadAction<boolean>) => {
      state.qualityValidation.rejectLowContrastImages = action.payload;
    },
    setQualityValidationFeedback: (state, action: PayloadAction<boolean>) => {
      state.qualityValidation.enableQualityFeedback = action.payload;
    },
    resetScanState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCaptureType,
  setOutputType,
  setTimeToCapture,
  setOverlayColor,
  setImageQuality,
  setImageQualityCompressionQuality,
  setImageQualityFormat,
  setImageQualityHighResolution,
  setImageQualityAntiAliasing,
  setCameraSettings,
  setCameraFocusMode,
  setCameraExposureMode,
  setCameraWhiteBalanceMode,
  setCameraStabilization,
  setCameraHighQualityMode,
  setProcessingSettings,
  setProcessingNoiseReduction,
  setProcessingSharpening,
  setProcessingContrastEnhancement,
  setProcessingBrightnessAdjustment,
  setProcessingQualityThreshold,
  setCaptureCountdown,
  setCaptureCountdownEnabled,
  setCaptureCountdownBackgroundColor,
  setCaptureCountdownProgressColor,
  setCaptureCountdownTextColor,
  setCaptureCountdownDuration,
  setBackButton,
  setBackButtonEnabled,
  setBackButtonBackgroundColor,
  setBackButtonPadding,
  setBackButtonSize,
  setBackButtonIconOptions,
  setBackButtonLabelOptions,
  setHelpText,
  setHelpTextEnabled,
  setHelpTextMessages,
  setHelpTextColor,
  setHelpTextSize,
  setFingerEllipse,
  setFingerEllipseEnabled,
  setFingerEllipseThickness,
  setDistanceIndicator,
  setDistanceIndicatorEnabled,
  setDistanceIndicatorSelectedBarColor,
  setDistanceIndicatorUnselectedBarColor,
  setDistanceIndicatorArrowColor,
  setDistanceIndicatorSensitivity,
  setDistanceIndicatorTooCloseText,
  setDistanceIndicatorTooFarText,
  setDistanceIndicatorPerfectDistanceText,
  setMotionDetection,
  setMotionDetectionEnabled,
  setMotionDetectionSensitivity,
  setMotionDetectionStabilizationTime,
  setMotionDetectionThreshold,
  setQualityValidation,
  setQualityValidationEnabled,
  setQualityValidationMinimumScore,
  setQualityValidationRejectBlurry,
  setQualityValidationRejectLowContrast,
  setQualityValidationFeedback,
  resetScanState,
} = scanSlice.actions;

export default scanSlice.reducer; 