import { Platform } from 'react-native';
import invariant from 'ts-tiny-invariant';
import { id } from './util';
export class ShapeRegistry {
}
ShapeRegistry.shapes = {};
ShapeRegistry.transforms = {};
ShapeRegistry.addShapes = (shapes) => {
    const keys = Object.keys(ShapeRegistry.shapes);
    const intersection = Object.keys(shapes).filter((k) => keys.includes(k));
    invariant(intersection.length === 0, `ImageFilterKit: Attempt to add already registered filter(s) - ${intersection.join()}.`);
    ShapeRegistry.shapes = Object.assign(Object.assign({}, ShapeRegistry.shapes), shapes);
};
ShapeRegistry.addTransforms = (transforms) => {
    const keys = Object.keys(ShapeRegistry.transforms);
    const intersection = Object.keys(transforms).filter((k) => keys.includes(k));
    invariant(intersection.length === 0, `ImageFilterKit: Attempt to add already registered transform(s) - ${intersection.join()}.`);
    ShapeRegistry.transforms = Object.assign(Object.assign({}, ShapeRegistry.transforms), transforms);
};
ShapeRegistry.shape = (name) => {
    const shape = ShapeRegistry.shapes[name];
    invariant(!!shape, `ImageFilterKit: '${name}' filter doesn't exist on ${Platform.OS}.`);
    return shape;
};
ShapeRegistry.transform = (name) => ShapeRegistry.transforms[name] || id;
//# sourceMappingURL=shape-registry.js.map