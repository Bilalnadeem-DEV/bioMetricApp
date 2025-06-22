import { Composition, Generator } from '../common/shapes';
import { distance, color, path, distanceVector, colorVector, scalarVector, mixStep } from '../common/inputs';
const Gradient = Object.assign({ mixStep: mixStep, colors: colorVector, stops: scalarVector }, Generator);
export const shapes = {
    AndroidDestinationATopCompositing: Composition,
    AndroidSourceOutCompositing: Composition,
    AndroidDestinationInCompositing: Composition,
    AndroidSourceInCompositing: Composition,
    AndroidCircleShape: Object.assign({ radius: distance, color: color }, Generator),
    AndroidOvalShape: Object.assign({ radiusX: distance, radiusY: distance, color: color }, Generator),
    AndroidPathShape: Object.assign({ path: path, color: color }, Generator),
    AndroidRegularPolygonShape: Object.assign({ circumradius: distance, borderRadiuses: distanceVector, color: color }, Generator),
    AndroidQuadGradient: Object.assign({ bottomLeftColor: color, bottomRightColor: color, topLeftColor: color, topRightColor: color }, Generator),
    AndroidSmoothLinearGradient: Object.assign({ x0: distance, y0: distance, x1: distance, y1: distance, colors: colorVector, locations: scalarVector }, Generator),
    AndroidSmoothRadialGradient: Object.assign({ centerX: distance, centerY: distance, radius: distance, colors: colorVector, stops: scalarVector }, Generator),
    AndroidSmoothSweepGradient: Object.assign({ cx: distance, cy: distance, colors: colorVector, positions: scalarVector }, Generator),
    AndroidEllipticalGradient: Object.assign({ centerX: distance, centerY: distance, radiusX: distance, radiusY: distance }, Gradient),
    AndroidRectangularGradient: Object.assign({ centerX: distance, centerY: distance, halfWidth: distance, halfHeight: distance }, Gradient)
};
//# sourceMappingURL=shapes.android.js.map