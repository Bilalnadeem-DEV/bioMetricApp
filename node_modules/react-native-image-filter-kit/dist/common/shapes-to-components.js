import { createImageFilter } from './image-filter';
export default (shapes) => Object.keys(shapes).reduce((acc, name) => {
    const component = createImageFilter(name, shapes[name]);
    component.displayName = name;
    component.isImageFilter = true;
    acc[name] = component;
    return acc;
}, {});
//# sourceMappingURL=shapes-to-components.js.map