const asNativeCompositionConfig = (mode) => (config) => (Object.assign(Object.assign({}, config), { mode, name: 'AndroidPorterDuffXfermode' }));
const asRenderscriptCompositingConfig = (name) => (config) => (Object.assign(Object.assign({}, config), { name }));
export const shapeTransforms = {
    DstATopComposition: asRenderscriptCompositingConfig('AndroidDestinationATopCompositing'),
    DstInComposition: asRenderscriptCompositingConfig('AndroidDestinationInCompositing'),
    DstOutComposition: asNativeCompositionConfig('DST_OUT'),
    DstOverComposition: asNativeCompositionConfig('DST_OVER'),
    SrcATopComposition: asNativeCompositionConfig('SRC_ATOP'),
    SrcInComposition: asRenderscriptCompositingConfig('AndroidSourceInCompositing'),
    SrcOutComposition: asRenderscriptCompositingConfig('AndroidSourceOutCompositing'),
    SrcOverComposition: asNativeCompositionConfig('SRC_OVER'),
    XorComposition: asNativeCompositionConfig('XOR')
};
//# sourceMappingURL=shape-transforms.android.js.map