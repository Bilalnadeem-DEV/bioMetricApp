import { scalar, scalarVector } from '../common/inputs';
import { Common } from '../common/shapes';
export const shapes = {
    ConvolveMatrix3x3: Object.assign({ matrix: scalarVector }, Common),
    ConvolveMatrix5x5: Object.assign({ matrix: scalarVector }, Common),
    Sharpen: Object.assign({ amount: scalar }, Common),
    EdgeDetection: Common,
    Emboss: Common,
    FuzzyGlass: Common
};
//# sourceMappingURL=shapes.js.map