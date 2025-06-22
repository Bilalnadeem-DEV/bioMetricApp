import { scalar } from '../common/inputs';
import { Common } from '../common/shapes';
export const shapes = {
    BoxBlur: Object.assign({ radius: scalar }, Common),
    GaussianBlur: Object.assign({ radius: scalar }, Common)
};
//# sourceMappingURL=shapes.js.map