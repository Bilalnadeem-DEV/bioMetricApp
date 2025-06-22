// tslint:disable:max-line-length
import { scalar, scalarVector, color, colorVector, distance, tileMode, porterDuffMode, config, text } from '../common/inputs';
import { Common, Composition, Generator } from '../common/shapes';
export const shapes = {
    ImageFilter: {
        config: config
    },
    // https://developer.android.com/reference/android/graphics/ColorMatrixColorFilter
    AndroidColorMatrixColorFilter: Object.assign({ matrix: scalarVector }, Common),
    // https://frescolib.org/javadoc/reference/com/facebook/imagepipeline/postprocessors/IterativeBoxBlurPostProcessor.html
    AndroidIterativeBoxBlur: Object.assign({ blurRadius: scalar, iterations: scalar }, Common),
    // https://developer.android.com/reference/android/graphics/LightingColorFilter
    AndroidLightingColorFilter: Object.assign({ mul: color, add: color }, Common),
    // https://frescolib.org/javadoc/reference/com/facebook/imagepipeline/postprocessors/RoundAsCirclePostprocessor.html
    AndroidRoundAsCircle: Common,
    // https://developer.android.com/reference/android/graphics/Color
    AndroidColor: Object.assign({ color: color }, Generator),
    // https://developer.android.com/reference/android/graphics/LinearGradient
    AndroidLinearGradient: Object.assign({ x0: distance, y0: distance, x1: distance, y1: distance, colors: colorVector, locations: scalarVector, tile: tileMode }, Generator),
    // https://developer.android.com/reference/android/graphics/RadialGradient
    AndroidRadialGradient: Object.assign({ centerX: distance, centerY: distance, radius: distance, colors: colorVector, stops: scalarVector, tileMode: tileMode }, Generator),
    // https://developer.android.com/reference/android/graphics/SweepGradient
    AndroidSweepGradient: Object.assign({ cx: distance, cy: distance, colors: colorVector, positions: scalarVector }, Generator),
    // https://developer.android.com/reference/android/graphics/PorterDuffColorFilter
    AndroidPorterDuffColorFilter: Object.assign({ color: color, mode: porterDuffMode }, Common),
    // https://developer.android.com/reference/android/graphics/PorterDuffXfermode
    AndroidPorterDuffXfermode: Object.assign({ mode: porterDuffMode }, Composition),
    // https://developer.android.com/reference/android/renderscript/ScriptIntrinsicBlur
    AndroidScriptIntrinsicBlur: Object.assign({ radius: scalar }, Common),
    // https://developer.android.com/reference/android/renderscript/ScriptIntrinsicConvolve3x3
    AndroidScriptIntrinsicConvolve3x3: Object.assign({ coefficients: scalarVector }, Common),
    // https://developer.android.com/reference/android/renderscript/ScriptIntrinsicConvolve5x5
    AndroidScriptIntrinsicConvolve5x5: Object.assign({ coefficients: scalarVector }, Common),
    AndroidTextImage: Object.assign({ text: text, fontName: text, fontSize: distance, color: color }, Generator)
};
//# sourceMappingURL=shapes.android.js.map