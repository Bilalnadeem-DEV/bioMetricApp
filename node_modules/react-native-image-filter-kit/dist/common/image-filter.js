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
import React from 'react';
import { requireNativeComponent } from 'react-native';
import { defaultStyle, checkStyle, hidden } from './style';
import { finalizeConfig, extractConfigAndImages } from './config';
import pick from 'lodash.pick';
import { id } from './util';
const IFKImageFilter = requireNativeComponent('IFKImageFilter');
const hideEveryTailChild = (child, index) => index === 0 ? child : hidden(child);
export const createImageFilter = (name, shape) => (_a) => {
    var { style, onFilteringError, onFilteringStart, onFilteringFinish, onExtractImage } = _a, props = __rest(_a, ["style", "onFilteringError", "onFilteringStart", "onFilteringFinish", "onExtractImage"]);
    const shapePropKeys = Object.keys(shape);
    const restPropKeys = Object.keys(props).filter((key) => !shapePropKeys.includes(key));
    const { config, images } = extractConfigAndImages(Object.assign({ type: { isImageFilter: true }, name }, (props.config || pick(props, shapePropKeys))));
    checkStyle(style);
    return (<IFKImageFilter style={[defaultStyle, style]} config={JSON.stringify(finalizeConfig(config, images))} onIFKFilteringError={onFilteringError !== null && onFilteringError !== void 0 ? onFilteringError : id} onIFKFilteringStart={onFilteringStart !== null && onFilteringStart !== void 0 ? onFilteringStart : id} onIFKFilteringFinish={onFilteringFinish !== null && onFilteringFinish !== void 0 ? onFilteringFinish : id} onIFKExtractImage={onExtractImage !== null && onExtractImage !== void 0 ? onExtractImage : id} {...pick(props, restPropKeys)}>
      {React.Children.map(images, hideEveryTailChild)}
    </IFKImageFilter>);
};
//# sourceMappingURL=image-filter.js.map