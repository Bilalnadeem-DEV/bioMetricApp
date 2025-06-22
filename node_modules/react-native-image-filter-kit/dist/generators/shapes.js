import { color, colorVector, scalarVector, position, distance, text, distanceVector, path, mixStep } from '../common/inputs';
import { Generator } from '../common/shapes';
const Gradient = Object.assign({ colors: colorVector, stops: scalarVector, mixStep: mixStep }, Generator);
export const shapes = {
    Color: Object.assign({ color: color }, Generator),
    LinearGradient: Object.assign({ start: position, end: position }, Gradient),
    RadialGradient: Object.assign({ center: position, radius: distance }, Gradient),
    SweepGradient: Object.assign({ center: position }, Gradient),
    QuadGradient: Object.assign({ bottomLeftColor: color, bottomRightColor: color, topLeftColor: color, topRightColor: color }, Generator),
    EllipticalGradient: Object.assign({ center: position, radiusX: distance, radiusY: distance }, Gradient),
    RectangularGradient: Object.assign({ center: position, halfWidth: distance, halfHeight: distance }, Gradient),
    TextImage: Object.assign({ text: text, fontName: text, fontSize: distance, color: color }, Generator),
    CircleShape: Object.assign({ radius: distance, color: color }, Generator),
    OvalShape: Object.assign({ radiusX: distance, radiusY: distance, color: color }, Generator),
    PathShape: Object.assign({ path: path, color: color }, Generator),
    RegularPolygonShape: Object.assign({ circumradius: distance, borderRadiuses: distanceVector, color: color }, Generator)
};
//# sourceMappingURL=shapes.js.map