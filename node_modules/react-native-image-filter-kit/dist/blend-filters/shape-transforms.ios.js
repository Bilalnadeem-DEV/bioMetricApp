var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const asNativeBlendConfig = (name) => (_a) => {
    var { dstImage, srcImage, srcTransform, dstTransform } = _a, config = __rest(_a, ["dstImage", "srcImage", "srcTransform", "dstTransform"]);
    return (Object.assign(Object.assign({ inputImage: srcImage, inputImageTransform: srcTransform, inputBackgroundImage: dstImage, inputBackgroundImageTransform: dstTransform }, config), { name }));
};
const asNativeBlendColorConfig = (name) => (_a) => {
    var { srcColor, dstImage, disableIntermediateCaches = true } = _a, config = __rest(_a, ["srcColor", "dstImage", "disableIntermediateCaches"]);
    return (Object.assign(Object.assign({}, config), { name, inputImage: {
            name: 'IosCIConstantColorGenerator',
            inputColor: srcColor,
            disableCache: disableIntermediateCaches
        }, resizeCanvasTo: 'dstImage', inputBackgroundImage: dstImage }));
};
export const shapeTransforms = {
    PlusBlend: asNativeBlendConfig('IosCIAdditionCompositing'),
    DarkenBlend: asNativeBlendConfig('IosCIDarkenBlendMode'),
    LightenBlend: asNativeBlendConfig('IosCILightenBlendMode'),
    OverlayBlend: asNativeBlendConfig('IosCIOverlayBlendMode'),
    ScreenBlend: asNativeBlendConfig('IosCIScreenBlendMode'),
    ModulateBlend: asNativeBlendConfig('IosCIMultiplyCompositing'),
    MultiplyBlend: asNativeBlendConfig('IosCIMultiplyBlendMode'),
    ColorDodgeBlend: asNativeBlendConfig('IosCIColorDodgeBlendMode'),
    ExclusionBlend: asNativeBlendConfig('IosCIExclusionBlendMode'),
    ColorBurnBlend: asNativeBlendConfig('IosCIColorBurnBlendMode'),
    SoftLightBlend: asNativeBlendConfig('IosCISoftLightBlendMode'),
    HueBlend: asNativeBlendConfig('IosCIHueBlendMode'),
    ColorBlend: asNativeBlendConfig('IosCIColorBlendMode'),
    HardLightBlend: asNativeBlendConfig('IosCIHardLightBlendMode'),
    DifferenceBlend: asNativeBlendConfig('IosCIDifferenceBlendMode'),
    SaturationBlend: asNativeBlendConfig('IosCISaturationBlendMode'),
    LuminosityBlend: asNativeBlendConfig('IosCILuminosityBlendMode'),
    PlusBlendColor: asNativeBlendColorConfig('IosCIAdditionCompositing'),
    DarkenBlendColor: asNativeBlendColorConfig('IosCIDarkenBlendMode'),
    LightenBlendColor: asNativeBlendColorConfig('IosCILightenBlendMode'),
    ModulateBlendColor: asNativeBlendColorConfig('IosCIMultiplyCompositing'),
    MultiplyBlendColor: asNativeBlendColorConfig('IosCIMultiplyBlendMode'),
    OverlayBlendColor: asNativeBlendColorConfig('IosCIOverlayBlendMode'),
    ScreenBlendColor: asNativeBlendColorConfig('IosCIScreenBlendMode'),
    ColorDodgeBlendColor: asNativeBlendColorConfig('IosCIColorDodgeBlendMode'),
    ExclusionBlendColor: asNativeBlendColorConfig('IosCIExclusionBlendMode'),
    ColorBurnBlendColor: asNativeBlendColorConfig('IosCIColorBurnBlendMode'),
    SoftLightBlendColor: asNativeBlendColorConfig('IosCISoftLightBlendMode'),
    HueBlendColor: asNativeBlendColorConfig('IosCIHueBlendMode'),
    ColorBlendColor: asNativeBlendColorConfig('IosCIColorBlendMode'),
    SaturationBlendColor: asNativeBlendColorConfig('IosCISaturationBlendMode'),
    LuminosityBlendColor: asNativeBlendColorConfig('IosCILuminosityBlendMode'),
    DifferenceBlendColor: asNativeBlendColorConfig('IosCIDifferenceBlendMode'),
    HardLightBlendColor: asNativeBlendColorConfig('IosCIHardLightBlendMode')
};
//# sourceMappingURL=shape-transforms.ios.js.map