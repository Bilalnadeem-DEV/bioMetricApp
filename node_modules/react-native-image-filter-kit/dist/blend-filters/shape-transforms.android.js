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
import { id } from '../common/util';
const asNativeBlendConfig = (mode) => (config) => (Object.assign(Object.assign({}, config), { mode, name: 'AndroidPorterDuffXfermode' }));
const asNativeBlendColorConfig = (mode) => ({ disableCache, dstImage, srcColor }) => ({
    name: 'AndroidPorterDuffColorFilter',
    image: dstImage,
    color: srcColor,
    disableCache,
    mode
});
const asRenderscriptBlendColorConfig = (name) => (_a) => {
    var { srcColor, disableIntermediateCaches = true } = _a, config = __rest(_a, ["srcColor", "disableIntermediateCaches"]);
    return (Object.assign(Object.assign({}, config), { name, resizeCanvasTo: 'dstImage', srcImage: {
            name: 'AndroidColor',
            color: srcColor,
            disableCache: disableIntermediateCaches
        } }));
};
export const shapeTransforms = {
    PlusBlend: asNativeBlendConfig('ADD'),
    DarkenBlend: asNativeBlendConfig('DARKEN'),
    LightenBlend: asNativeBlendConfig('LIGHTEN'),
    ModulateBlend: asNativeBlendConfig('MULTIPLY'),
    OverlayBlend: asNativeBlendConfig('OVERLAY'),
    ScreenBlend: asNativeBlendConfig('SCREEN'),
    PlusBlendColor: asNativeBlendColorConfig('ADD'),
    DarkenBlendColor: asNativeBlendColorConfig('DARKEN'),
    LightenBlendColor: asNativeBlendColorConfig('LIGHTEN'),
    ModulateBlendColor: asNativeBlendColorConfig('MULTIPLY'),
    MultiplyBlend: id,
    ColorDodgeBlend: id,
    ExclusionBlend: id,
    ColorBurnBlend: id,
    SoftLightBlend: id,
    HueBlend: id,
    DifferenceBlend: id,
    SaturationBlend: id,
    LuminosityBlend: id,
    ColorBlend: id,
    HardLightBlend: id,
    OverlayBlendColor: asNativeBlendColorConfig('OVERLAY'),
    ScreenBlendColor: asNativeBlendColorConfig('SCREEN'),
    ColorDodgeBlendColor: asRenderscriptBlendColorConfig('ColorDodgeBlend'),
    ExclusionBlendColor: asRenderscriptBlendColorConfig('ExclusionBlend'),
    ColorBurnBlendColor: asRenderscriptBlendColorConfig('ColorBurnBlend'),
    SoftLightBlendColor: asRenderscriptBlendColorConfig('SoftLightBlend'),
    HueBlendColor: asRenderscriptBlendColorConfig('HueBlend'),
    ColorBlendColor: asRenderscriptBlendColorConfig('ColorBlend'),
    SaturationBlendColor: asRenderscriptBlendColorConfig('SaturationBlend'),
    LuminosityBlendColor: asRenderscriptBlendColorConfig('LuminosityBlend'),
    DifferenceBlendColor: asRenderscriptBlendColorConfig('DifferenceBlend'),
    HardLightBlendColor: asRenderscriptBlendColorConfig('HardLightBlend'),
    MultiplyBlendColor: asRenderscriptBlendColorConfig('MultiplyBlend')
};
//# sourceMappingURL=shape-transforms.android.js.map