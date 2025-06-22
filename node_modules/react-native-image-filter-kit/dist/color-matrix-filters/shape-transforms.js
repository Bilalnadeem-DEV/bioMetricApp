// tslint:disable:max-file-line-count
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
import { Platform } from 'react-native';
import matrices from 'rn-color-matrices';
const asNativeFilterConfig = Platform.select({
    ios: ({ matrix, image, disableCache }) => ({
        name: 'IosCIColorMatrix',
        inputRVector: matrix.slice(0, 4),
        inputGVector: matrix.slice(5, 9),
        inputBVector: matrix.slice(10, 14),
        inputAVector: matrix.slice(15, 19),
        inputBiasVector: [matrix[4], matrix[9], matrix[14], matrix[19]],
        inputImage: image,
        disableCache
    }),
    android: ({ matrix, image, disableCache }) => ({
        name: 'AndroidColorMatrixColorFilter',
        matrix,
        image,
        disableCache
    }),
    default: () => ({})
});
export const shapeTransforms = {
    ColorMatrix: asNativeFilterConfig,
    Normal: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.normal() }, config)),
    RGBA: (_a) => {
        var { red, green, blue, alpha } = _a, config = __rest(_a, ["red", "green", "blue", "alpha"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.rgba(red, green, blue, alpha) }, config));
    },
    Saturate: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.saturate(amount) }, config));
    },
    HueRotate: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.hueRotate(amount) }, config));
    },
    LuminanceToAlpha: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.luminanceToAlpha() }, config)),
    Invert: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.invert() }, config)),
    Grayscale: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.grayscale(amount) }, config));
    },
    Sepia: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.sepia(amount) }, config));
    },
    Nightvision: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.nightvision() }, config)),
    Warm: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.warm() }, config)),
    Cool: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.cool() }, config)),
    Brightness: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.brightness(amount) }, config));
    },
    Contrast: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.contrast(amount) }, config));
    },
    Temperature: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.temperature(amount) }, config));
    },
    Tint: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.tint(amount) }, config));
    },
    Threshold: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.threshold(amount) }, config));
    },
    Technicolor: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.technicolor() }, config)),
    Polaroid: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.polaroid() }, config)),
    ToBGR: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.toBGR() }, config)),
    Kodachrome: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.kodachrome() }, config)),
    Browni: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.browni() }, config)),
    Vintage: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.vintage() }, config)),
    Night: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.night(amount) }, config));
    },
    Predator: (_a) => {
        var { amount } = _a, config = __rest(_a, ["amount"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.predator(amount) }, config));
    },
    Lsd: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.lsd() }, config)),
    ColorTone: (_a) => {
        var { desaturation, toned, lightColor, darkColor } = _a, config = __rest(_a, ["desaturation", "toned", "lightColor", "darkColor"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.colorTone(desaturation, toned, lightColor, darkColor) }, config));
    },
    DuoTone: (_a) => {
        var { firstColor, secondColor } = _a, config = __rest(_a, ["firstColor", "secondColor"]);
        return asNativeFilterConfig(Object.assign({ matrix: matrices.duoTone(firstColor, secondColor) }, config));
    },
    Protanomaly: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.protanomaly() }, config)),
    Deuteranomaly: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.deuteranomaly() }, config)),
    Tritanomaly: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.tritanomaly() }, config)),
    Protanopia: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.protanopia() }, config)),
    Deuteranopia: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.deuteranopia() }, config)),
    Tritanopia: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.tritanopia() }, config)),
    Achromatopsia: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.achromatopsia() }, config)),
    Achromatomaly: (config) => asNativeFilterConfig(Object.assign({ matrix: matrices.achromatomaly() }, config))
};
//# sourceMappingURL=shape-transforms.js.map