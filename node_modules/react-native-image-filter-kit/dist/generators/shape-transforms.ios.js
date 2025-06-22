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
export const shapeTransforms = {
    Color: (_a) => {
        var { color, image } = _a, config = __rest(_a, ["color", "image"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosCIConstantColorGenerator', inputImage: image, inputColor: color }));
    },
    LinearGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], start = { x: 0, y: '0h' }, end = { x: '100w', y: '0h' }, image, mixStep } = _a, config = __rest(_a, ["colors", "stops", "start", "end", "image", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKLinearGradient', inputMixStep: mixStep, inputImage: image, inputColors: colors, inputStops: stops, inputStart: start, inputEnd: end }));
    },
    RadialGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, radius = '50min', image, mixStep } = _a, config = __rest(_a, ["colors", "stops", "center", "radius", "image", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKRadialGradient', inputMixStep: mixStep, inputImage: image, inputColors: colors, inputStops: stops, inputCenter: center, inputRadius: radius }));
    },
    EllipticalGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, radiusX = '50w', radiusY = '50h', image, mixStep } = _a, config = __rest(_a, ["colors", "stops", "center", "radiusX", "radiusY", "image", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKEllipticalGradient', inputMixStep: mixStep, inputImage: image, inputColors: colors, inputStops: stops, inputCenter: center, inputRadiusX: radiusX, inputRadiusY: radiusY }));
    },
    RectangularGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, halfWidth = '50w', halfHeight = '50h', image, mixStep } = _a, config = __rest(_a, ["colors", "stops", "center", "halfWidth", "halfHeight", "image", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKRectangularGradient', inputMixStep: mixStep, inputImage: image, inputColors: colors, inputStops: stops, inputCenter: center, inputHalfWidth: halfWidth, inputHalfHeight: halfHeight }));
    },
    SweepGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, image, mixStep } = _a, config = __rest(_a, ["colors", "stops", "center", "image", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKSweepGradient', inputMixStep: mixStep, inputImage: image, inputColors: colors, inputStops: stops, inputCenter: center }));
    },
    QuadGradient: (_a) => {
        var { bottomLeftColor, bottomRightColor, topLeftColor, topRightColor, image } = _a, config = __rest(_a, ["bottomLeftColor", "bottomRightColor", "topLeftColor", "topRightColor", "image"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKQuadGradient', inputImage: image, inputBottomLeftColor: bottomLeftColor, inputBottomRightColor: bottomRightColor, inputTopLeftColor: topLeftColor, inputTopRightColor: topRightColor }));
    },
    TextImage: (_a) => {
        var { color, text, fontSize, fontName, image } = _a, config = __rest(_a, ["color", "text", "fontSize", "fontName", "image"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKTextImage', inputImage: image, inputText: text, inputFontName: fontName, inputFontSize: fontSize, inputColor: color }));
    },
    CircleShape: (_a) => {
        var { radius = '50min', color = 'black', image } = _a, config = __rest(_a, ["radius", "color", "image"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKCircleShape', inputRadius: radius, inputColor: color, inputImage: image }));
    },
    OvalShape: (_a) => {
        var { radiusX = '50w', radiusY = '25h', color = 'black', image } = _a, config = __rest(_a, ["radiusX", "radiusY", "color", "image"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKOvalShape', inputRadiusX: radiusX, inputRadiusY: radiusY, inputColor: color, inputImage: image }));
    },
    PathShape: (_a) => {
        var { color = 'black', image, path } = _a, config = __rest(_a, ["color", "image", "path"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKPathShape', inputColor: color, inputImage: image, inputPath: path }));
    },
    RegularPolygonShape: (_a) => {
        var { color = 'black', image, circumradius = '50min', borderRadiuses = [0, 0, 0] } = _a, config = __rest(_a, ["color", "image", "circumradius", "borderRadiuses"]);
        return (Object.assign(Object.assign({}, config), { name: 'IosIFKRegularPolygonShape', inputColor: color, inputImage: image, inputCircumradius: circumradius, inputBorderRadiuses: borderRadiuses }));
    }
};
//# sourceMappingURL=shape-transforms.ios.js.map