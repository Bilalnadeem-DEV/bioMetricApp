import { bool } from './inputs';
import { ShapeRegistry } from './shape-registry';
import shapesToComponents from './shapes-to-components';
export default (name, shape, transform) => {
    const shapes = {
        [name]: Object.assign({ disableCache: bool }, shape)
    };
    ShapeRegistry.addShapes(shapes);
    if (transform !== undefined) {
        ShapeRegistry.addTransforms({ [name]: transform });
    }
    return shapesToComponents(shapes)[name];
};
//# sourceMappingURL=register-filter.js.map