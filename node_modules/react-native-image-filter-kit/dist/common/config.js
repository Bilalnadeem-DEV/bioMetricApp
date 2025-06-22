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
import React from 'react';
import { processColor, Platform } from 'react-native';
import { distance, scalar, color, colorVector, image, position, distanceVector, area, marker, angle } from './inputs';
import { ShapeRegistry } from './shape-registry';
import { id } from './util';
import { swapComposition } from './swap-composition';
import { ImagePlaceholder } from './image-placeholder';
import { convertImageName } from './convert-image-name';
const anyToString = (n) => `${n}`;
const convertDistances = (distances) => distances.map(anyToString);
const convertPosition = ({ x, y }) => ({ x: `${x}`, y: `${y}` });
const convertColor = processColor;
const convertColors = (cs) => cs.map(convertColor);
const convertArea = (rect) => ({
    x: `${rect.x}`,
    y: `${rect.y}`,
    width: `${rect.width}`,
    height: `${rect.height}`
});
const paramConvertMap = {
    [position]: convertPosition,
    [distance]: anyToString,
    [distanceVector]: convertDistances,
    [scalar]: anyToString,
    [angle]: anyToString,
    [color]: convertColor,
    [colorVector]: convertColors,
    [area]: convertArea
};
const srcTransform = 'srcTransform';
const dstTransform = 'dstTransform';
const iosKeyConvertMap = {
    inputImageTransform: srcTransform,
    inputBackgroundImageTransform: dstTransform,
    inputMaskTransform: dstTransform,
    inputGradientImageTransform: dstTransform,
    inputTargetImageTransform: dstTransform,
    inputDisplacementImageTransform: dstTransform,
    inputTextureTransform: dstTransform,
    inputShadingImageTransform: dstTransform
};
const srcImage = 'srcImage';
const dstImage = 'dstImage';
const iosMatchMap = {
    inputImage: srcImage,
    inputGradientImage: dstImage,
    inputBackgroundImage: dstImage,
    inputMask: dstImage,
    inputTargetImage: dstImage,
    inputDisplacementImage: dstImage,
    inputTexture: dstImage,
    inputShadingImage: dstImage
};
const convertKey = Platform.select({
    android: id,
    ios: (key) => iosKeyConvertMap[key] || key,
    default: id
});
const convertValue = Platform.select({
    android: id,
    ios: (value) => typeof value.match === 'string' ? { match: iosMatchMap[value.match] || value.match } : value,
    default: id
});
const removePlatformPrefixes = (name) => name.replace(/^(?:Android|Ios)/, '');
export const finalizeConfig = (_a, 
// tslint:disable-next-line: no-any
images = []) => {
    var { name } = _a, values = __rest(_a, ["name"]);
    const shape = ShapeRegistry.shape(name);
    return Object.assign(Object.assign({ key: images.reduce((acc, { props }) => props !== undefined && props.source !== undefined ? `${acc}:${props.source}` : acc, '') }, Object.keys(shape).reduce((acc, key) => {
        const inputType = shape[key];
        const inputValue = values[key];
        if (inputValue !== undefined) {
            const convert = paramConvertMap[inputType] ||
                (inputType === image && typeof inputValue !== 'number' ? finalizeConfig : id);
            acc[convertKey(key)] = { [inputType]: convertValue(convert(values[key])) };
        }
        return acc;
    }, {})), { name: removePlatformPrefixes(name) });
};
const patchComposition = (config) => {
    const cfg = Object.assign(Object.assign({}, config), { resizeCanvasTo: convertImageName(config.name, config['resizeCanvasTo']) });
    return Platform.select({
        ios: cfg['resizeCanvasTo'] === 'dstImage' ? swapComposition(cfg, 'srcImage') : cfg,
        android: cfg['resizeCanvasTo'] === 'srcImage' ? swapComposition(cfg, 'dstImage') : cfg
    });
};
export const extractConfigAndImages = (filterProps) => {
    const images = [];
    const parseFilter = (filter) => {
        if (filter.type && !filter.type.isImageFilter) {
            const idx = images.length;
            const elem = filter;
            images.push(elem);
            return idx;
        }
        const _a = filter.props
            ? filter.props.config || filter.props
            : filter, { name: n = filter.type && filter.type.displayName } = _a, values = __rest(_a, ["name"]);
        let prevConfig;
        let nextConfig = Object.assign({ name: n }, values);
        do {
            prevConfig = nextConfig;
            nextConfig = ShapeRegistry.transform(prevConfig.name)(patchComposition(prevConfig));
        } while (nextConfig.name !== prevConfig.name);
        const { name } = nextConfig, rest = __rest(nextConfig, ["name"]);
        const shape = ShapeRegistry.shape(name);
        return Object.assign({ name }, Object.keys(shape).reduce((acc, key) => {
            const inputType = shape[key];
            const inputValue = rest[key];
            if (inputType === image) {
                acc[key] = parseFilter(inputValue || <ImagePlaceholder key={`ifk_placeholder_${images.length}`}/>);
            }
            else if (inputType === marker) {
                acc[key] = true;
            }
            else if (inputValue !== undefined) {
                acc[key] = inputValue;
            }
            return acc;
        }, {}));
    };
    const config = parseFilter(filterProps);
    return { config, images };
};
//# sourceMappingURL=config.js.map