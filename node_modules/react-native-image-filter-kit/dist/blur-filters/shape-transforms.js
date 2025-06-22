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
export const shapeTransforms = {
    BoxBlur: Platform.select({
        ios: ({ radius = 5, image, disableCache }) => ({
            name: 'IosCIBoxBlur',
            disableCache,
            inputRadius: radius * 2,
            clampToExtent: true,
            inputImage: {
                name: 'IosCIBoxBlur',
                disableCache,
                inputRadius: radius * 2,
                clampToExtent: true,
                inputImage: {
                    name: 'IosCIBoxBlur',
                    disableCache,
                    inputRadius: radius * 2,
                    clampToExtent: true,
                    inputImage: image
                }
            }
        }),
        android: (_a) => {
            var { radius = 5 } = _a, config = __rest(_a, ["radius"]);
            return (Object.assign(Object.assign({}, config), { name: 'AndroidIterativeBoxBlur', blurRadius: radius }));
        }
    }),
    GaussianBlur: Platform.select({
        ios: ({ radius = 5, image, disableCache }) => ({
            name: 'IosCIGaussianBlur',
            disableCache,
            inputRadius: radius,
            inputImage: image,
            clampToExtent: true
        }),
        android: (_a) => {
            var { radius = 5 } = _a, config = __rest(_a, ["radius"]);
            return (Object.assign(Object.assign({}, config), { name: 'AndroidScriptIntrinsicBlur', radius: radius * 2 }));
        }
    })
};
//# sourceMappingURL=shape-transforms.js.map