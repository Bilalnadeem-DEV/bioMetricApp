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
const asNativeCompositionConfig = (name) => (_a) => {
    var { dstImage, srcImage, dstTransform, srcTransform } = _a, config = __rest(_a, ["dstImage", "srcImage", "dstTransform", "srcTransform"]);
    return (Object.assign(Object.assign({ inputImage: srcImage, inputImageTransform: srcTransform, inputBackgroundImage: dstImage, inputBackgroundImageTransform: dstTransform }, config), { name }));
};
const asInvertedNativeCompositionConfig = (name) => (config) => (Object.assign(Object.assign({}, asNativeCompositionConfig(name)(config)), { swapImages: !config.swapImages }));
export const shapeTransforms = {
    SrcATopComposition: asNativeCompositionConfig('IosCISourceAtopCompositing'),
    DstATopComposition: asInvertedNativeCompositionConfig('IosCISourceAtopCompositing'),
    DstInComposition: asInvertedNativeCompositionConfig('IosCISourceInCompositing'),
    DstOutComposition: asInvertedNativeCompositionConfig('IosCISourceOutCompositing'),
    DstOverComposition: asInvertedNativeCompositionConfig('IosCISourceOverCompositing'),
    SrcInComposition: asNativeCompositionConfig('IosCISourceInCompositing'),
    SrcOutComposition: asNativeCompositionConfig('IosCISourceOutCompositing'),
    SrcOverComposition: asNativeCompositionConfig('IosCISourceOverCompositing'),
    XorComposition: asNativeCompositionConfig('IosIFKXorCompositing')
};
//# sourceMappingURL=shape-transforms.ios.js.map