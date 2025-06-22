// tslint:disable:max-file-line-count
// tslint:disable:max-line-length
import { distance, position, scalar, scalarVector, offset, color, image, config, bool, text, area, ISOLatin1EncodedText, distanceVector, angle, transform, marker } from '../common/inputs';
import { GeneratorIos as Generator, CommonIos as Common, CompositionBaseIos as CompositionBase } from '../common/shapes';
const BackgroundImageComposition = Object.assign(Object.assign({}, CompositionBase), { inputBackgroundImage: image, inputBackgroundImageTransform: transform });
const Tile = Object.assign({ inputAngle: angle, inputCenter: position, inputWidth: distance }, Common);
const Convolution = Object.assign({ inputWeights: scalarVector, inputBias: scalar }, Common);
const ColorPolynomial = Object.assign({ inputRedCoefficients: scalarVector, inputGreenCoefficients: scalarVector, inputBlueCoefficients: scalarVector }, Common);
const Perspective = Object.assign({ inputTopLeft: position, inputTopRight: position, inputBottomLeft: position, inputBottomRight: position }, Common);
const Area = Object.assign({ inputExtent: area }, Common);
export const shapes = {
    ImageFilter: {
        config: config
    },
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBoxBlur
    IosCIBoxBlur: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDiscBlur
    IosCIDiscBlur: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGaussianBlur
    IosCIGaussianBlur: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMaskedVariableBlur
    IosCIMaskedVariableBlur: Object.assign(Object.assign({}, CompositionBase), { inputMask: image, inputMaskTransform: transform, inputRadius: distance }),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMedianFilter
    IosCIMedianFilter: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMotionBlur
    IosCIMotionBlur: Object.assign({ inputRadius: distance, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CINoiseReduction
    IosCINoiseReduction: Object.assign({ inputNoiseLevel: scalar, inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIZoomBlur
    IosCIZoomBlur: Object.assign({ inputCenter: position, inputAmount: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorClamp
    IosCIColorClamp: Object.assign({ inputMinComponents: scalarVector, inputMaxComponents: scalarVector }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorControls
    IosCIColorControls: Object.assign({ inputSaturation: scalar, inputBrightness: scalar, inputContrast: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorMatrix
    IosCIColorMatrix: Object.assign({ inputRVector: scalarVector, inputGVector: scalarVector, inputBVector: scalarVector, inputAVector: scalarVector, inputBiasVector: scalarVector, hasColorManagement: marker }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorPolynomial
    IosCIColorPolynomial: Object.assign({ inputAlphaCoefficients: scalarVector }, ColorPolynomial),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIExposureAdjust
    IosCIExposureAdjust: Object.assign({ inputEV: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGammaAdjust
    IosCIGammaAdjust: Object.assign({ inputPower: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHueAdjust
    IosCIHueAdjust: Object.assign({ inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILinearToSRGBToneCurve
    IosCILinearToSRGBToneCurve: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISRGBToneCurveToLinear
    IosCISRGBToneCurveToLinear: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITemperatureAndTint
    IosCITemperatureAndTint: Object.assign({ inputNeutral: offset, inputTargetNeutral: offset }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIToneCurve
    IosCIToneCurve: Object.assign({ inputPoint0: offset, inputPoint1: offset, inputPoint2: offset, inputPoint3: offset, inputPoint4: offset }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIVibrance
    IosCIVibrance: Object.assign({ inputAmount: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIWhitePointAdjust
    IosCIWhitePointAdjust: Object.assign({ inputColor: color }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorCrossPolynomial,
    IosCIColorCrossPolynomial: ColorPolynomial,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorCube
    IosCIColorCube: Object.assign({ inputCubeDimension: scalar, inputCubeData: text }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorCubeWithColorSpace,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorInvert
    IosCIColorInvert: Object.assign({ hasColorManagement: marker }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorMap
    IosCIColorMap: Object.assign(Object.assign({}, CompositionBase), { inputGradientImage: image, inputGradientImageTransform: transform }),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorMonochrome
    IosCIColorMonochrome: Object.assign({ inputColor: color, inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorPosterize
    IosCIColorPosterize: Object.assign({ inputLevels: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIFalseColor
    IosCIFalseColor: Object.assign({ inputColor0: color, inputColor1: color }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMaskToAlpha
    IosCIMaskToAlpha: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMaximumComponent
    IosCIMaximumComponent: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMinimumComponent
    IosCIMinimumComponent: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectChrome
    IosCIPhotoEffectChrome: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectFade
    IosCIPhotoEffectFade: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectInstant
    IosCIPhotoEffectInstant: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectMono
    IosCIPhotoEffectMono: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectNoir
    IosCIPhotoEffectNoir: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectProcess
    IosCIPhotoEffectProcess: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectTonal
    IosCIPhotoEffectTonal: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPhotoEffectTransfer
    IosCIPhotoEffectTransfer: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISepiaTone
    IosCISepiaTone: Object.assign({ inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIVignette
    IosCIVignette: Object.assign({ inputRadius: distance, inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIVignetteEffect
    IosCIVignetteEffect: Object.assign({ inputCenter: position, inputIntensity: scalar, inputRadius: distance, inputFalloff: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAdditionCompositing
    IosCIAdditionCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorBlendMode
    IosCIColorBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorBurnBlendMode
    IosCIColorBurnBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColorDodgeBlendMode
    IosCIColorDodgeBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDarkenBlendMode
    IosCIDarkenBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDifferenceBlendMode
    IosCIDifferenceBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDivideBlendMode
    IosCIDivideBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIExclusionBlendMode
    IosCIExclusionBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHardLightBlendMode
    IosCIHardLightBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHueBlendMode
    IosCIHueBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILightenBlendMode
    IosCILightenBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILinearBurnBlendMode
    IosCILinearBurnBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILinearDodgeBlendMode
    IosCILinearDodgeBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILuminosityBlendMode
    IosCILuminosityBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMaximumCompositing
    IosCIMaximumCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMinimumCompositing
    IosCIMinimumCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMultiplyBlendMode
    IosCIMultiplyBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMultiplyCompositing
    IosCIMultiplyCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIOverlayBlendMode
    IosCIOverlayBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPinLightBlendMode
    IosCIPinLightBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISaturationBlendMode
    IosCISaturationBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIScreenBlendMode
    IosCIScreenBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISoftLightBlendMode
    IosCISoftLightBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISourceAtopCompositing
    IosCISourceAtopCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISourceInCompositing
    IosCISourceInCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISourceOutCompositing
    IosCISourceOutCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISourceOverCompositing
    IosCISourceOverCompositing: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISubtractBlendMode
    IosCISubtractBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBumpDistortion
    IosCIBumpDistortion: Object.assign({ inputCenter: position, inputRadius: distance, inputScale: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBumpDistortionLinear
    IosCIBumpDistortionLinear: Object.assign({ inputCenter: position, inputRadius: distance, inputScale: scalar, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICircleSplashDistortion
    IosCICircleSplashDistortion: Object.assign({ inputCenter: position, inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICircularWrap
    IosCICircularWrap: Object.assign({ inputCenter: position, inputRadius: distance, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDroste,
    IosCIDroste: Object.assign({ inputInsetPoint0: position, inputInsetPoint1: position, inputStrands: distance, inputPeriodicity: distance, inputRotation: distance, inputZoom: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDisplacementDistortion
    IosCIDisplacementDistortion: Object.assign(Object.assign({}, CompositionBase), { inputDisplacementImage: image, inputDisplacementImageTransform: transform, inputScale: distance }),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGlassDistortion,
    IosCIGlassDistortion: Object.assign(Object.assign({}, CompositionBase), { inputTexture: image, inputTextureTransform: transform, inputScale: distance, inputCenter: position }),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGlassLozenge,
    IosCIGlassLozenge: Object.assign({ inputPoint0: position, inputPoint1: position, inputRadius: distance, inputRefraction: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHoleDistortion
    IosCIHoleDistortion: Object.assign({ inputCenter: position, inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILightTunnel
    IosCILightTunnel: Object.assign({ inputCenter: position, inputRotation: angle, inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPinchDistortion
    IosCIPinchDistortion: Object.assign({ inputCenter: position, inputRadius: distance, inputScale: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIStretchCrop,
    IosCIStretchCrop: Object.assign({ inputSize: distanceVector, inputCropAmount: scalar, inputCenterStretchAmount: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITorusLensDistortion
    IosCITorusLensDistortion: Object.assign({ inputCenter: position, inputRadius: distance, inputWidth: distance, inputRefraction: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITwirlDistortion
    IosCITwirlDistortion: Object.assign({ inputCenter: position, inputRadius: distance, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIVortexDistortion
    IosCIVortexDistortion: Object.assign({ inputCenter: position, inputRadius: distance, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAztecCodeGenerator
    IosCIAztecCodeGenerator: Object.assign({ inputMessage: ISOLatin1EncodedText, inputCorrectionLevel: scalar, inputLayers: scalar, inputCompactStyle: bool }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICheckerboardGenerator
    IosCICheckerboardGenerator: Object.assign({ inputCenter: position, inputColor0: color, inputColor1: color, inputWidth: distance, inputShaprness: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICode128BarcodeGenerator,
    // IosCICode128BarcodeGenerator: {
    //   inputMessage: text,
    //   inputQuietSpace: scalar,
    //   inputBarcodeHeight: distance,
    //   ...Generator
    // },
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConstantColorGenerator
    IosCIConstantColorGenerator: Object.assign({ inputColor: color }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILenticularHaloGenerator,
    IosCILenticularHaloGenerator: Object.assign({ inputCenter: position, inputColor: color, inputHaloRadius: distance, inputHaloWidth: distance, inputHaloOverlap: scalar, inputStriationStrength: scalar, inputStriationContrast: scalar, inputTime: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPDF417BarcodeGenerator,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIQRCodeGenerator
    IosCIQRCodeGenerator: Object.assign({ inputMessage: ISOLatin1EncodedText, inputCorrectionLevel: text }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIRandomGenerator
    IosCIRandomGenerator: Generator,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIStarShineGenerator
    IosCIStarShineGenerator: Object.assign({ inputCenter: position, inputColor: color, inputRadius: distance, inputCrossScale: scalar, inputCrossAngle: angle, inputCrossOpacity: scalar, inputCrossWidth: distance, inputEpsilon: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIStripesGenerator,
    IosCIStripesGenerator: Object.assign({ inputCenter: position, inputColor0: color, inputColor1: color, inputWidth: distance, inputSharpness: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISunbeamsGenerator,
    IosCISunbeamsGenerator: Object.assign({ inputCenter: position, inputColor: color, inputSunRadius: distance, inputMaxStriationRadius: scalar, inputStriationStrength: scalar, inputStriationContrast: scalar, inputTime: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAffineTransform,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICrop
    IosCICrop: Object.assign({ inputRectangle: area }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILanczosScaleTransform
    IosCILanczosScaleTransform: Object.assign({ inputScale: scalar, inputAspectRatio: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPerspectiveCorrection,
    IosCIPerspectiveCorrection: Object.assign({ inputCrop: bool }, Perspective),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPerspectiveTransform,
    IosCIPerspectiveTransform: Perspective,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPerspectiveTransformWithExtent,
    IosCIPerspectiveTransformWithExtent: Object.assign({ inputExtent: area }, Perspective),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIStraightenFilter,
    IosCIStraightenFilter: Object.assign({ inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGaussianGradient
    IosCIGaussianGradient: Object.assign({ inputCenter: position, inputRadius: distance, inputColor0: color, inputColor1: color }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILinearGradient
    IosCILinearGradient: Object.assign({ inputPoint0: position, inputPoint1: position, inputColor0: color, inputColor1: color }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIRadialGradient
    IosCIRadialGradient: Object.assign({ inputCenter: position, inputRadius0: distance, inputRadius1: distance, inputColor0: color, inputColor1: color }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISmoothLinearGradient
    IosCISmoothLinearGradient: Object.assign({ inputPoint0: position, inputPoint1: position, inputColor0: color, inputColor1: color }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICircularScreen
    IosCICircularScreen: Object.assign({ inputCenter: position, inputWidth: distance, inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICMYKHalftone,
    IosCICMYKHalftone: Object.assign({ inputCenter: position, inputWidth: distance, inputAngle: angle, inputSharpness: scalar, inputGCR: scalar, inputUCR: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDotScreen
    IosCIDotScreen: Object.assign({ inputCenter: position, inputAngle: angle, inputWidth: distance, inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHatchedScreen
    IosCIHatchedScreen: Object.assign({ inputCenter: position, inputAngle: angle, inputWidth: distance, inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILineScreen
    IosCILineScreen: Object.assign({ inputCenter: position, inputAngle: angle, inputWidth: distance, inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaAverage,
    IosCIAreaAverage: Area,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaHistogram,
    IosCIAreaHistogram: Object.assign({ inputScale: scalar, inputCount: scalar }, Area),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIRowAverage
    IosCIRowAverage: Object.assign({ inputExtent: area }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIColumnAverage,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHistogramDisplayFilter
    IosCIHistogramDisplayFilter: Object.assign({ inputHeight: scalar, inputHighLimit: scalar, inputLowLimit: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaMaximum,
    IosCIAreaMaximum: Area,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaMinimum,
    IosCIAreaMinimum: Area,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaMaximumAlpha,
    IosCIAreaMaximumAlpha: Area,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAreaMinimumAlpha,
    IosCIAreaMinimumAlpha: Area,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISharpenLuminance
    IosCISharpenLuminance: Object.assign({ inputSharpness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIUnsharpMask
    IosCIUnsharpMask: Object.assign({ inputRadius: distance, inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBlendWithAlphaMask,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBlendWithMask,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBloom
    IosCIBloom: Object.assign({ inputRadius: distance, inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIComicEffect
    IosCIComicEffect: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConvolution3X3
    IosCIConvolution3X3: Object.assign({ hasColorManagement: marker }, Convolution),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConvolution5X5
    IosCIConvolution5X5: Object.assign({ hasColorManagement: marker }, Convolution),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConvolution7X7
    IosCIConvolution7X7: Object.assign({ hasColorManagement: marker }, Convolution),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConvolution9Horizontal,
    IosCIConvolution9Horizontal: Object.assign({ hasColorManagement: marker }, Convolution),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIConvolution9Vertical,
    IosCIConvolution9Vertical: Object.assign({ hasColorManagement: marker }, Convolution),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CICrystallize
    IosCICrystallize: Object.assign({ inputRadius: distance, inputCenter: position }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDepthOfField,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIEdges
    IosCIEdges: Object.assign({ inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIEdgeWork
    IosCIEdgeWork: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGloom
    IosCIGloom: Object.assign({ inputRadius: distance, inputIntensity: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHeightFieldFromMask,
    IosCIHeightFieldFromMask: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHexagonalPixellate
    IosCIHexagonalPixellate: Object.assign({ inputCenter: position, inputScale: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHighlightShadowAdjust
    IosCIHighlightShadowAdjust: Object.assign({ inputHighlightAmount: scalar, inputShadowAmount: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CILineOverlay
    IosCILineOverlay: Object.assign({ inputNRNoiseLevel: scalar, inputNRSharpness: scalar, inputEdgeIntensity: scalar, inputThreshold: scalar, inputContrast: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPixellate
    IosCIPixellate: Object.assign({ inputCenter: position, inputScale: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPointillize
    IosCIPointillize: Object.assign({ inputRadius: distance, inputCenter: position }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIShadedMaterial,
    IosCIShadedMaterial: Object.assign(Object.assign({}, CompositionBase), { inputShadingImage: image, inputShadingImageTransform: transform, inputScale: scalar }),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISpotColor
    IosCISpotColor: Object.assign({ inputCenterColor1: color, inputReplacementColor1: color, inputCloseness1: scalar, inputContrast1: scalar, inputCenterColor2: color, inputReplacementColor2: color, inputCloseness2: scalar, inputContrast2: scalar, inputCenterColor3: color, inputReplacementColor3: color, inputCloseness3: scalar, inputContrast3: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISpotLight
    IosCISpotLight: Object.assign({ inputLightPosition: distanceVector, inputLightPointsAt: distanceVector, inputBrightness: scalar, inputConcentration: scalar, inputColor: color }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAffineClamp,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIAffineTile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIEightfoldReflectedTile,
    IosCIEightfoldReflectedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIFourfoldReflectedTile,
    IosCIFourfoldReflectedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIFourfoldRotatedTile,
    IosCIFourfoldRotatedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIFourfoldTranslatedTile,
    IosCIFourfoldTranslatedTile: Object.assign({ inputAcuteAngle: angle }, Tile),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIGlideReflectedTile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIKaleidoscope
    IosCIKaleidoscope: Object.assign({ inputCount: scalar, inputCenter: position, inputAngle: angle }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIOpTile
    IosCIOpTile: Object.assign({ inputScale: scalar }, Tile),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIParallelogramTile,
    IosCIParallelogramTile: Object.assign({ inputAcuteAngle: angle }, Tile),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIPerspectiveTile,
    IosCIPerspectiveTile: Perspective,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISixfoldReflectedTile,
    IosCISixfoldReflectedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISixfoldRotatedTile,
    IosCISixfoldRotatedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITriangleKaleidoscope,
    IosCITriangleKaleidoscope: Object.assign({ inputPoint: position, inputSize: distance, inputRotation: angle, inputDecay: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITriangleTile,
    IosCITriangleTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITwelvefoldReflectedTile
    IosCITwelvefoldReflectedTile: Tile,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIXRay
    IosCIXRay: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIThermal
    IosCIThermal: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMorphologyGradient
    IosCIMorphologyGradient: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDisparityToDepth
    IosCIDisparityToDepth: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIBokehBlur
    IosCIBokehBlur: Object.assign({ inputRadius: distance, inputRingAmount: scalar, inputRingSize: scalar, inputSoftness: scalar }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISaliencyMapFilter
    IosCISaliencyMapFilter: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CISampleNearest
    IosCISampleNearest: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMix
    IosCIMix: Object.assign({ inputAmount: scalar }, BackgroundImageComposition),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIDepthToDisparity
    IosCIDepthToDisparity: Common,
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CITextImageGenerator
    IosCITextImageGenerator: Object.assign({ inputText: text, inputFontName: text, inputFontSize: distance, inputScaleFactor: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIHueSaturationValueGradient
    IosCIHueSaturationValueGradient: Object.assign({ inputValue: scalar, inputRadius: distance, inputSoftness: scalar, inputDither: scalar }, Generator),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMorphologyMaximum
    IosCIMorphologyMaximum: Object.assign({ inputRadius: distance }, Common),
    // https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html#//apple_ref/doc/filter/ci/CIMorphologyMinimum
    IosCIMorphologyMinimum: Object.assign({ inputRadius: distance }, Common),
    IosCINinePartStretched: Object.assign({ inputBreakpoint0: position, inputBreakpoint1: position, inputGrowAmount: position }, Common),
    IosCIWrapMirror: Common,
    IosCIMirror: Object.assign({ inputPoint: position, inputAngle: angle }, Common),
    IosCIAreaMinMaxRed: Area,
    IosCIAreaMinMax: Area,
    IosCICheatBlur: Object.assign({ inputAmount: distance }, Common),
    IosCICheapMorphology: Object.assign({ inputRadius: distance }, Common),
    IosCIMorphology: Object.assign({ inputRadius: distance }, Common),
    IosCICheapBlur: Object.assign({ inputPasses: scalar, inputSampling: scalar }, Common),
    IosCIDither: Object.assign({ inputIntensity: scalar }, Common),
    IosCIVividLightBlendMode: Object.assign({ hasColorManagement: marker }, BackgroundImageComposition),
    IosCISkyAndGrassAdjust: Object.assign({ inputSkyAmount: scalar, inputGrassAmount: scalar }, Common),
    IosCIRingBlur: Object.assign({ inputRadius: distance, inputPointCount: scalar }, Common),
    IosCIPremultiply: Common,
    IosCIPhotoGrain: Object.assign({ inputAmount: scalar, inputISO: scalar, inputSeed: scalar }, Common),
    IosCIUnpremultiply: Common,
    IosCILocalContrast: Object.assign({ inputStrength: scalar, inputScale: scalar }, Common),
    IosCILinearBlur: Object.assign({ inputRadius: distance }, Common),
    IosCIGaussianBlurXY: Object.assign({ inputSigmaX: distance, inputSigmaY: distance }, Common),
    IosCIDocumentEnhancer: Object.assign({ inputAmount: scalar }, Common),
    IosCIClamp: Object.assign({ inputExtent: area }, Common),
    IosCIASG50Percent: Common,
    IosCIASG60Percent: Common,
    IosCIASG66Percent: Common,
    IosCIASG75Percent: Common,
    IosCIASG80Percent: Common,
    IosCIPaperWash: Object.assign({ inputSaturation: scalar, inputGreyscale: scalar }, Common)
};
//# sourceMappingURL=shapes.ios.js.map