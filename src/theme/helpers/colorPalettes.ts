// Color Palettes for hyperI App
// Organized color schemes for consistent theming

export const ColorPalettes = {
  // Primary Brand Colors
  brand: {
    primary: '#823280',      // Main purple
    secondary: '#2D1A58',    // Dark purple
    accent: '#9CA3AF',       // Light gray accent
    light: '#ffffff',        // White background
  },

  // Background Colors
  backgrounds: {
    primary: '#ffffff',      // Main app background - white
    secondary: '#ffffff',    // Secondary background - white
    surface: '#ffffff',      // Card/surface background
    overlay: 'rgba(255, 255, 255, 0.3)',
    overlayDark: 'rgba(45, 26, 88, 0.6)',
    overlayAccent: 'rgba(130, 50, 128, 0.8)',
  },

  // Text Colors
  text: {
    primary: '#020817',      // Main text color
    secondary: '#4F5866',    // Secondary text
    muted: '#9CA3AF',        // Muted text
    disabled: '#6b7280',     // Disabled text
    light: '#ffffff',        // White text
    dark: '#020817',         // Dark text
  },

  // Interactive Colors
  interactive: {
    primary: '#823280',      // Primary buttons
    secondary: '#2D1A58',    // Secondary buttons
    success: '#10b981',      // Success states
    warning: '#f59e0b',      // Warning states
    error: '#ef4444',        // Error states
    info: '#3b82f6',         // Info states
  },

  // Border Colors
  borders: {
    light: '#9CA3AF',        // Light borders
    medium: '#823280',       // Medium borders
    dark: '#2D1A58',         // Dark borders
    error: '#ef4444',        // Error borders
    success: '#10b981',      // Success borders
  },

  // Shadow Colors
  shadows: {
    primary: '#823280',      // Primary shadow
    secondary: '#000000',    // Black shadow
    light: 'rgba(130, 50, 128, 0.1)',
    medium: 'rgba(130, 50, 128, 0.3)',
    dark: 'rgba(130, 50, 128, 0.6)',
  },

  // Status Colors
  status: {
    online: '#10b981',       // Online/active
    offline: '#6b7280',      // Offline/inactive
    pending: '#f59e0b',      // Pending/waiting
    processing: '#3b82f6',   // Processing
    complete: '#10b981',     // Complete
    failed: '#ef4444',       // Failed
  },

  // Gradient Colors
  gradients: {
    primary: ['#823280', '#2D1A58'],
    secondary: ['#ffffff', '#ffffff'],
    accent: ['#9CA3AF', '#6b7280'],
    success: ['#10b981', '#059669'],
    error: ['#ef4444', '#dc2626'],
  },

  // Semantic Colors
  semantic: {
    fingerprint: '#D6A262',  // Fingerprint scanning
    camera: '#3b82f6',       // Camera related
    gallery: '#823280',      // Gallery/photos
    security: '#2D1A58',     // Security features
    biometric: '#10b981',    // Biometric success
  },

  // Quality Indicators
  quality: {
    high: '#10b981',         // High quality
    medium: '#f59e0b',       // Medium quality
    low: '#ef4444',          // Low quality
    excellent: '#059669',    // Excellent quality
    poor: '#dc2626',         // Poor quality
  },

  // Transparent Colors
  transparent: {
    clear: 'transparent',
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    brand10: 'rgba(130, 50, 128, 0.1)',
    brand20: 'rgba(130, 50, 128, 0.2)',
    brand30: 'rgba(130, 50, 128, 0.3)',
  },
} as const;

// Helper function to get color with custom opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// Helper function to get gradient string
export const getGradient = (colors: string[], direction: string = 'to bottom'): string => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

// Export individual palettes for convenience
export const BrandColors = ColorPalettes.brand;
export const BackgroundColors = ColorPalettes.backgrounds;
export const TextColors = ColorPalettes.text;
export const InteractiveColors = ColorPalettes.interactive;
export const BorderColors = ColorPalettes.borders;
export const ShadowColors = ColorPalettes.shadows;
export const StatusColors = ColorPalettes.status;
export const SemanticColors = ColorPalettes.semantic;
export const QualityColors = ColorPalettes.quality;
export const TransparentColors = ColorPalettes.transparent;

export default ColorPalettes; 