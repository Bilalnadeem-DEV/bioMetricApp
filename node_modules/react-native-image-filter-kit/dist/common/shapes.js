import { bool, image, color, text, marker, transform } from './inputs';
export const Composition = {
    dstImage: image,
    dstTransform: transform,
    srcImage: image,
    srcTransform: transform,
    resizeCanvasTo: text,
    disableCache: bool,
    swapImages: bool
};
export const Common = {
    image: image,
    disableCache: bool
};
export const BlendColor = {
    dstImage: image,
    srcColor: color,
    disableCache: bool
};
export const Generator = Object.assign(Object.assign({}, Common), { isGenerator: marker });
export const CommonIos = {
    inputImage: image,
    clampToExtent: bool,
    disableCache: bool
};
export const CompositionBaseIos = Object.assign(Object.assign({}, CommonIos), { resizeCanvasTo: text, inputImageTransform: transform, swapImages: bool });
export const GeneratorIos = Object.assign(Object.assign({}, CommonIos), { isGenerator: marker });
//# sourceMappingURL=shapes.js.map