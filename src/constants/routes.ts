/**
 * Navigation route names for the app
 */
export const ROUTES = {
  SPLASH: 'Splash',
  HOME: 'Home',
  LOGIN: 'Login',
  REGISTER: 'Register',
  SCAN_PREP: 'ScanPrep',
  CAMERA: 'Camera',
  IMAGE_PREVIEW: 'ImagePreview',
  NEW_SCREEN: 'NewScreen',
} as const;

export type RouteNames = typeof ROUTES[keyof typeof ROUTES]; 