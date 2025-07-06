import { Keyboard, Platform } from 'react-native';

/**
 * Utility functions to handle keyboard management and prevent RTIInputSystemClient errors
 */

/**
 * Safely dismiss keyboard with iOS-specific handling
 */
export const safeKeyboardDismiss = () => {
  try {
    Keyboard.dismiss();
  } catch (error) {
    // Silently handle any keyboard dismissal errors
    console.warn('Keyboard dismissal warning:', error);
  }
};

/**
 * Add delay for iOS to prevent rapid keyboard state changes
 */
export const dismissKeyboardWithDelay = (delay: number = 100) => {
  if (Platform.OS === 'ios') {
    setTimeout(() => {
      safeKeyboardDismiss();
    }, delay);
  } else {
    safeKeyboardDismiss();
  }
};

/**
 * Blur TextInput with proper error handling
 */
export const safeBlurTextInput = (inputRef: React.RefObject<any>) => {
  try {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  } catch (error) {
    // Silently handle any blur errors
    console.warn('TextInput blur warning:', error);
  }
};

/**
 * Combined safe keyboard and input management
 */
export const safeKeyboardAndInputDismiss = (inputRefs: React.RefObject<any>[] = []) => {
  // First blur all inputs
  inputRefs.forEach(ref => safeBlurTextInput(ref));
  
  // Then dismiss keyboard with delay on iOS
  dismissKeyboardWithDelay();
}; 