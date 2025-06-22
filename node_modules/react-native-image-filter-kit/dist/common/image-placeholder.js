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
import { Image, ImageBackground } from 'react-native';
export const imagePlaceholderSource = {
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAM' +
        'AAWgmWQ0AAAAASUVORK5CYII='
};
export const transparentPlaceholderSource = {
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAY' +
        'AAjCB0C8AAAAASUVORK5CYII='
};
const defaultStyle = {
    width: '100%',
    height: '100%'
};
export const ImagePlaceholder = (_a) => {
    var { style } = _a, props = __rest(_a, ["style"]);
    return (<Image {...props} source={imagePlaceholderSource} style={[defaultStyle, style]}/>);
};
export const ImageBackgroundPlaceholder = (_a) => {
    var { style } = _a, props = __rest(_a, ["style"]);
    return (<ImageBackground {...props} source={imagePlaceholderSource} style={[defaultStyle, style]}/>);
};
export const ImageTransparentPlaceholder = (_a) => {
    var { style } = _a, props = __rest(_a, ["style"]);
    return (<Image {...props} source={transparentPlaceholderSource} style={[defaultStyle, style]}/>);
};
//# sourceMappingURL=image-placeholder.js.map