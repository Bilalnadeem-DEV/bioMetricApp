// tslint:disable:max-line-length
// https://developer.android.com/reference/android/graphics/Path#moveTo(float,%20float)
export const moveTo = (x, y) => ({
    moveTo: [`${x}`, `${y}`]
});
// https://developer.android.com/reference/android/graphics/Path#lineTo(float,%20float)
export const lineTo = (x, y) => ({
    lineTo: [`${x}`, `${y}`]
});
// https://developer.android.com/reference/android/graphics/Path#quadTo(float,%20float,%20float,%20float)
export const quadTo = (x1, y1, x2, y2) => ({
    quadTo: [`${x1}`, `${y1}`, `${x2}`, `${y2}`]
});
// https://developer.android.com/reference/android/graphics/Path#cubicTo(float,%20float,%20float,%20float,%20float,%20float)
export const cubicTo = (x1, y1, x2, y2, x3, y3) => ({
    cubicTo: [`${x1}`, `${y1}`, `${x2}`, `${y2}`, `${x3}`, `${y3}`]
});
// https://developer.android.com/reference/android/graphics/Path#close()
export const closePath = () => ({
    closePath: []
});
//# sourceMappingURL=path.js.map