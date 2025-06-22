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
    Color: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidColor' })),
    LinearGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], start = { x: 0, y: '0h' }, end = { x: '100w', y: '0h' }, mixStep = 'CLAMP' } = _a, config = __rest(_a, ["colors", "stops", "start", "end", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: mixStep === 'CLAMP' ? 'AndroidLinearGradient' : 'AndroidSmoothLinearGradient', colors, locations: stops, x0: start.x, y0: `100h - ${start.y}`, x1: end.x, y1: `100h - ${end.y}` }));
    },
    RadialGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, radius = '50min', mixStep = 'CLAMP' } = _a, config = __rest(_a, ["colors", "stops", "center", "radius", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: mixStep === 'CLAMP' ? 'AndroidRadialGradient' : 'AndroidSmoothRadialGradient', colors,
            stops,
            radius, centerX: center.x, centerY: `100h - ${center.y}` }));
    },
    EllipticalGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, radiusX = '50w', radiusY = '50h', mixStep = 'CLAMP' } = _a, config = __rest(_a, ["colors", "stops", "center", "radiusX", "radiusY", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'AndroidEllipticalGradient', mixStep,
            colors,
            stops,
            radiusX,
            radiusY, centerX: center.x, centerY: `100h - ${center.y}` }));
    },
    RectangularGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, halfWidth = '50w', halfHeight = '50h', mixStep = 'CLAMP' } = _a, config = __rest(_a, ["colors", "stops", "center", "halfWidth", "halfHeight", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: 'AndroidRectangularGradient', mixStep,
            colors,
            stops,
            halfWidth,
            halfHeight, centerX: center.x, centerY: `100h - ${center.y}` }));
    },
    SweepGradient: (_a) => {
        var { colors = ['red', 'blue'], stops = [0, 1], center = { x: '50w', y: '50h' }, mixStep = 'CLAMP' } = _a, config = __rest(_a, ["colors", "stops", "center", "mixStep"]);
        return (Object.assign(Object.assign({}, config), { name: mixStep === 'CLAMP' ? 'AndroidSweepGradient' : 'AndroidSmoothSweepGradient', colors: Array.from(colors).reverse(), positions: stops.map((stop) => 1 - stop).reverse(), cx: center.x, cy: `100h - ${center.y}` }));
    },
    QuadGradient: (_a) => {
        var { bottomLeftColor, bottomRightColor, topLeftColor, topRightColor } = _a, config = __rest(_a, ["bottomLeftColor", "bottomRightColor", "topLeftColor", "topRightColor"]);
        return (Object.assign(Object.assign({}, config), { name: 'AndroidQuadGradient', bottomLeftColor: topLeftColor, bottomRightColor: topRightColor, topLeftColor: bottomLeftColor, topRightColor: bottomRightColor }));
    },
    TextImage: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidTextImage' })),
    CircleShape: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidCircleShape' })),
    OvalShape: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidOvalShape' })),
    PathShape: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidPathShape' })),
    RegularPolygonShape: (config) => (Object.assign(Object.assign({}, config), { name: 'AndroidRegularPolygonShape' }))
};
//# sourceMappingURL=shape-transforms.android.js.map