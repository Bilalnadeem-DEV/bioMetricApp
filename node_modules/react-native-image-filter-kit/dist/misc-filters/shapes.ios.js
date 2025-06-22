import { scalar, color, position, distance, colorVector, scalarVector, text, image, path, distanceVector, transform, mixStep, marker } from '../common/inputs';
import { GeneratorIos as Generator, CompositionBaseIos as CompositionBase } from '../common/shapes';
const Gradient = Object.assign({ inputColors: colorVector, inputStops: scalarVector, inputMixStep: mixStep, hasColorManagement: marker }, Generator);
export const shapes = {
    IosIFKLinearGradient: Object.assign({ inputStart: position, inputEnd: position }, Gradient),
    IosIFKRadialGradient: Object.assign({ inputCenter: position, inputRadius: distance }, Gradient),
    IosIFKEllipticalGradient: Object.assign({ inputCenter: position, inputRadiusX: distance, inputRadiusY: distance }, Gradient),
    IosIFKRectangularGradient: Object.assign({ inputCenter: position, inputHalfWidth: distance, inputHalfHeight: distance }, Gradient),
    IosIFKSweepGradient: Object.assign({ inputCenter: position }, Gradient),
    IosIFKQuadGradient: Object.assign({ inputBottomLeftColor: color, inputBottomRightColor: color, inputTopLeftColor: color, inputTopRightColor: color, hasColorManagement: marker }, Generator),
    IosIFKXorCompositing: Object.assign(Object.assign({}, CompositionBase), { inputBackgroundImage: image, inputBackgroundImageTransform: transform }),
    IosIFKTextImage: Object.assign({ inputText: text, inputLineWidth: scalar, inputFontName: text, inputFontSize: distance, inputColor: color }, Generator),
    IosIFKCircleShape: Object.assign({ inputRadius: distance, inputColor: color }, Generator),
    IosIFKOvalShape: Object.assign({ inputRadiusX: distance, inputRadiusY: distance, inputColor: color }, Generator),
    IosIFKPathShape: Object.assign({ inputPath: path, inputColor: color }, Generator),
    IosIFKRegularPolygonShape: Object.assign({ inputCircumradius: distance, inputBorderRadiuses: distanceVector, inputColor: color }, Generator)
};
//# sourceMappingURL=shapes.ios.js.map