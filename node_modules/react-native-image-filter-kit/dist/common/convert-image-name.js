import { Platform } from 'react-native';
const srcImage = 'srcImage';
const dstImage = 'dstImage';
const toBackground = {
    inputImage: srcImage,
    inputBackgroundImage: dstImage
};
const convertMap = Platform.select({
    android: {},
    ios: {
        IosCIMaskedVariableBlur: {
            inputImage: srcImage,
            inputMask: dstImage
        },
        IosCIDisplacementDistortion: {
            inputImage: srcImage,
            inputDisplacementImage: dstImage
        },
        IosCIColorMap: {
            inputImage: srcImage,
            inputGradientImage: dstImage
        },
        IosCIGlassDistortion: {
            inputImage: srcImage,
            inputTexture: dstImage
        },
        IosCIShadedMaterial: {
            inputImage: srcImage,
            inputShadingImage: dstImage
        },
        IosCIMix: toBackground,
        IosCIAdditionCompositing: toBackground,
        IosCIColorBlendMode: toBackground,
        IosCIColorBurnBlendMode: toBackground,
        IosCIColorDodgeBlendMode: toBackground,
        IosCIDarkenBlendMode: toBackground,
        IosCIDifferenceBlendMode: toBackground,
        IosCIDivideBlendMode: toBackground,
        IosCIExclusionBlendMode: toBackground,
        IosCIHardLightBlendMode: toBackground,
        IosCIHueBlendMode: toBackground,
        IosCILightenBlendMode: toBackground,
        IosCILinearBurnBlendMode: toBackground,
        IosCILinearDodgeBlendMode: toBackground,
        IosCILuminosityBlendMode: toBackground,
        IosCIMaximumCompositing: toBackground,
        IosCIMinimumCompositing: toBackground,
        IosCIMultiplyBlendMode: toBackground,
        IosCIMultiplyCompositing: toBackground,
        IosCIOverlayBlendMode: toBackground,
        IosCIPinLightBlendMode: toBackground,
        IosCISaturationBlendMode: toBackground,
        IosCIScreenBlendMode: toBackground,
        IosCISoftLightBlendMode: toBackground,
        IosCISourceAtopCompositing: toBackground,
        IosCISourceInCompositing: toBackground,
        IosCISourceOutCompositing: toBackground,
        IosCISourceOverCompositing: toBackground,
        IosCISubtractBlendMode: toBackground
    },
    default: {}
});
export const convertImageName = (filterName, normalImageName) => { var _a, _b; return (_b = (_a = convertMap[filterName]) === null || _a === void 0 ? void 0 : _a[normalImageName]) !== null && _b !== void 0 ? _b : normalImageName; };
//# sourceMappingURL=convert-image-name.js.map