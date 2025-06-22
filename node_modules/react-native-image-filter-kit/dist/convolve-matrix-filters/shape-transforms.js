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
const edgeDetectionMatrix = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
const embossMatrix = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
const fuzzyGlassMatrix = [0, 20, 0, 20, -59, 20, 1, 13, 0].map((w) => w / 7);
const asNative3x3FilterConfig = Platform.select({
    ios: ({ matrix, image, disableCache }) => ({
        name: 'IosCIConvolution3X3',
        inputWeights: matrix,
        inputImage: image,
        disableCache
    }),
    android: ({ matrix, image, disableCache }) => ({
        name: 'AndroidScriptIntrinsicConvolve3x3',
        coefficients: matrix,
        image,
        disableCache
    }),
    default: () => ({})
});
const asNative5x5FilterConfig = Platform.select({
    ios: ({ matrix, image, disableCache }) => ({
        name: 'IosCIConvolution5X5',
        inputWeights: matrix,
        inputImage: image,
        disableCache
    }),
    android: ({ matrix, image, disableCache }) => ({
        name: 'AndroidScriptIntrinsicConvolve5x5',
        coefficients: matrix,
        image,
        disableCache
    })
});
export const shapeTransforms = {
    ConvolveMatrix3x3: asNative3x3FilterConfig,
    ConvolveMatrix5x5: asNative5x5FilterConfig,
    Sharpen: (_a) => {
        var { amount = 1 } = _a, config = __rest(_a, ["amount"]);
        return asNative3x3FilterConfig(Object.assign(Object.assign({}, config), { matrix: [0, -amount, 0, -amount, amount * 4 + 1, -amount, 0, -amount, 0] }));
    },
    EdgeDetection: Platform.select({
        ios: ({ image, disableCache }) => ({
            name: 'IosCIColorInvert',
            inputImage: Object.assign(Object.assign({}, asNative3x3FilterConfig({
                image,
                disableCache,
                matrix: edgeDetectionMatrix
            })), { inputBias: 1 }),
            disableCache
        }),
        android: ({ image, disableCache, disableIntermediateCaches = true }) => ({
            name: 'PlusBlendColor',
            dstImage: asNative3x3FilterConfig({
                image,
                disableCache,
                matrix: edgeDetectionMatrix
            }),
            disableCache,
            disableIntermediateCaches,
            srcColor: 'black'
        })
    }),
    Emboss: (config) => asNative3x3FilterConfig(Object.assign(Object.assign({}, config), { matrix: embossMatrix })),
    FuzzyGlass: (config) => asNative3x3FilterConfig(Object.assign(Object.assign({}, config), { matrix: fuzzyGlassMatrix }))
};
//# sourceMappingURL=shape-transforms.js.map