// Custom Color Palette for BioSecure App
// Based on user-provided color scheme

export const Colors = {
  // Primary Backgrounds
  primary: '#FBF5FE',        // Main background - light purple
  secondary: '#2D1A58',      // Secondary background - dark purple
  surface: '#1a1a2e',        // Surface backgrounds for cards/containers
  light: '#FBF4FD',          // Light background variant
  lightSecondary: '#F9FAFB', // Light secondary background
  
  // Accent Colors
  accent: '#823280',         // Primary purple accent
  accentDark: '#2D1A58',     // Darker purple variant
  accentLight: '#9CA3AF',    // Light gray accent
  
  // Text Colors
  textPrimary: '#020817',    // Primary text - very dark blue
  textSecondary: '#4F5866',  // Secondary text - dark gray
  textMuted: '#9CA3AF',      // Muted text - gray
  textDisabled: '#6b7280',   // Disabled text - darker gray
  textDark: '#020817',       // Dark text for light backgrounds
  textLight: '#ffffff',      // White text for dark backgrounds
  
  // Border Colors
  border: '#9CA3AF',         // Primary border color
  borderLight: '#823280',    // Purple border variant
  borderDark: '#2D1A58',     // Dark purple border
  
  // Status Colors
  success: '#10b981',        // Success green
  error: '#ef4444',          // Error red
  warning: '#f59e0b',        // Warning amber
  
  // Shadow Colors
  shadow: '#823280',         // Purple shadow for accent elements
  shadowDark: '#000000',     // Black shadow for general use
  
  // Overlay Colors
  overlay: 'rgba(251, 245, 254, 0.3)',      // General overlay
  overlayDark: 'rgba(45, 26, 88, 0.6)',     // Darker overlay
  overlayAccent: 'rgba(130, 50, 128, 0.8)', // Purple accent overlay
  overlayAccentLight: 'rgba(130, 50, 128, 0.1)', // Light purple overlay
  overlayCard: 'rgba(45, 26, 88, 0.8)', // Card overlay
  
  // Placeholder Colors
  placeholder: '#9CA3AF',    // Input placeholder text
  
  // Button States
  buttonDisabled: '#6b7280', // Disabled button background
  
  // Transparent variations
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba if needed
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export default Colors; 