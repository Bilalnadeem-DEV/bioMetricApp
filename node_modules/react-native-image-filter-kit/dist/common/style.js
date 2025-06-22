import React from 'react';
import * as ReactIs from 'react-is';
import { processColor } from 'react-native';
import invariant from 'ts-tiny-invariant';
// For some reason RNImageMatrixFilter draw method is not called when component's backgroundColor
// is not set or transparent
export const defaultStyle = {
    backgroundColor: '#fff0'
};
export const hiddenStyle = {
    position: 'absolute',
    opacity: 0,
    zIndex: Number.MIN_SAFE_INTEGER
};
export const checkStyle = (style) => {
    if (style) {
        const { backgroundColor } = defaultStyle;
        invariant(processColor(backgroundColor) !== 0, `ImageFilterKit: Can't use '${backgroundColor}' backgroundColor,` +
            ` consider using '#fff0' instead.`);
    }
};
export const hidden = (item) => {
    if (ReactIs.isFragment(item)) {
        const child = item.props.children;
        return React.cloneElement(item, Object.assign(Object.assign({}, item.props), { children: Object.assign(Object.assign({}, child), { props: Object.assign(Object.assign({}, child.props), { style: child.props.style ? [child.props.style, hiddenStyle] : hiddenStyle }) }) }));
    }
    const it = item;
    return React.cloneElement(it, Object.assign(Object.assign({}, it.props), { style: it.props.style ? [it.props.style, hiddenStyle] : hiddenStyle }));
};
//# sourceMappingURL=style.js.map