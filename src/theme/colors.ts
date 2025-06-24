// Custom Color Palette for hyperI App
// Based on user-provided color scheme
import { ColorPalettes } from './helpers/colorPalettes';

export const Colors = {
  // Primary Backgrounds
  primary: ColorPalettes.backgrounds.primary,        // Main background - white
  secondary: ColorPalettes.brand.secondary,          // Secondary background - dark purple
  surface: ColorPalettes.backgrounds.surface,        // Surface backgrounds for cards/containers
  light: ColorPalettes.brand.light,                  // Light background variant - white
  lightSecondary: ColorPalettes.backgrounds.secondary, // Light secondary background - white
  
  // Accent Colors
  accent: ColorPalettes.brand.primary,               // Primary purple accent
  accentDark: ColorPalettes.brand.secondary,         // Darker purple variant
  accentLight: ColorPalettes.brand.accent,           // Light gray accent
  
  // Text Colors
  textPrimary: ColorPalettes.text.primary,           // Primary text - very dark blue
  textSecondary: ColorPalettes.text.secondary,       // Secondary text - dark gray
  textMuted: ColorPalettes.text.muted,               // Muted text - gray
  textDisabled: ColorPalettes.text.disabled,         // Disabled text - darker gray
  textDark: ColorPalettes.text.dark,                 // Dark text for light backgrounds
  textLight: ColorPalettes.text.light,               // White text for dark backgrounds
  
  // Border Colors
  border: ColorPalettes.borders.light,               // Primary border color
  borderLight: ColorPalettes.borders.medium,         // Purple border variant
  borderDark: ColorPalettes.borders.dark,            // Dark purple border
  
  // Status Colors
  success: ColorPalettes.interactive.success,        // Success green
  error: ColorPalettes.interactive.error,            // Error red
  warning: ColorPalettes.interactive.warning,        // Warning amber
  info: ColorPalettes.interactive.info,              // Info blue
  
  // Shadow Colors
  shadow: ColorPalettes.shadows.primary,             // Purple shadow for accent elements
  shadowDark: ColorPalettes.shadows.secondary,       // Black shadow for general use
  
  // Overlay Colors
  overlay: ColorPalettes.backgrounds.overlay,                    // General overlay
  overlayDark: ColorPalettes.backgrounds.overlayDark,           // Darker overlay
  overlayAccent: ColorPalettes.backgrounds.overlayAccent,       // Purple accent overlay
  overlayAccentLight: ColorPalettes.shadows.light,             // Light purple overlay
  overlayCard: ColorPalettes.backgrounds.overlayDark,          // Card overlay
  
  // Placeholder Colors
  placeholder: ColorPalettes.text.muted,             // Input placeholder text
  
  // Button States
  buttonDisabled: ColorPalettes.text.disabled,       // Disabled button background
  
  // Transparent variations
  transparent: ColorPalettes.transparent.clear,
} as const;

export type ColorKey = keyof typeof Colors;

// Helper function to get color with opacity (re-export from palettes)
export { getColorWithOpacity } from './helpers/colorPalettes';

export default Colors; 