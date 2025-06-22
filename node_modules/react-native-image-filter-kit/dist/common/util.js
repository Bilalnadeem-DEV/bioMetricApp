export const id = (x) => x;
const unitPattern = () => /(\d+)(h|w|min|max)/;
export const isUnit = (unit) => unitPattern().test(`${unit}`);
export const degToRad = (deg) => (Math.PI * deg) / 180;
//# sourceMappingURL=util.js.map