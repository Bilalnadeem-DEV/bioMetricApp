/**
 * API endpoints and configurations for the app
 */

// Base URLs for different environments
export const BASE_URLS = {
  DEVELOPMENT: 'https://fpbiometric.swsam.co.uk/',
  STAGING: 'https://fpbiometric.swsam.co.uk/',
  PRODUCTION: 'https://fpbiometric.swsam.co.uk/',

  // DEVELOPMENT: 'http://198.199.81.112:5010/',
  // STAGING: 'http://198.199.81.112:5010/',
  // PRODUCTION: 'http://198.199.81.112:5010/',

  // CNIC Verification API
  CNIC_VERIFICATION: 'https://cnic-scan.swsam.co.uk/api/'
} as const;

// Current environment
export const CURRENT_ENV = __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION';

// Base URL based on environment
export const BASE_URL = BASE_URLS[CURRENT_ENV];

// CNIC Verification base URL
export const CNIC_VERIFICATION_URL = BASE_URLS.CNIC_VERIFICATION;

// API Timeout configurations
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Response status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// API Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error occurred. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
} as const; 