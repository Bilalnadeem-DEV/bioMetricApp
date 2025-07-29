import { AxiosResponse } from 'axios';
import api from './api';
import axios from 'axios';
import { Platform } from 'react-native';

interface BiometricRegistrationData {
  cnic: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  index_finger: string | null;
  middle_finger: string | null;
  ring_finger: string | null;
  pinky_finger: string | null;
}

// Add new interface for user details response
interface UserDetails {
  cnic: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  registration_date: string;
  last_updated: string;
  registered_fingers: number;
  fingers: string[];
}

// Add authentication interfaces
interface AuthenticationData {
  cnic: string;
  index_finger?: string | null;
  middle_finger?: string | null;
  ring_finger?: string | null;
  pinky_finger?: string | null;
}

interface MatchDetail {
  status: 'match' | 'no_match';
  score: number;
  match: boolean;
  required_score: number;
}

interface AuthenticationResponse {
  authenticated: boolean;
  message: string;
  cnic: string;
  user_data?: {
    cnic: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    registration_date: string;
    last_updated: string;
    is_verified: boolean;
  };
  matches_found: number;
  total_attempts: number;
  required_matches: number;
  match_details: {
    [key: string]: MatchDetail;
  };
}

// Add interface for user verification response
interface UserVerificationResponse {
  success: boolean;
  message: string;
  cnic: string;
  is_verified: boolean;
  updated_at: string;
}

const register = async (data: BiometricRegistrationData): Promise<any> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('cnic', data.cnic);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('date_of_birth', data.date_of_birth);
    
    // Helper function to create file object from URI
    const createFileFromUri = (uri: string, fingerName: string) => {
      // Extract just the base64 data if it's a data URI
      const base64Data = uri.startsWith('data:') 
        ? uri.split(',')[1] 
        : uri;

      return {
        uri: uri,
        type: 'image/jpeg',
        name: `${fingerName}.jpg`,
      };
    };

    // Add finger scans if available
    if (data.index_finger) {
      formData.append('index_finger', createFileFromUri(data.index_finger, 'index_finger'));
    }
    if (data.middle_finger) {
      formData.append('middle_finger', createFileFromUri(data.middle_finger, 'middle_finger'));
    }
    if (data.ring_finger) {
      formData.append('ring_finger', createFileFromUri(data.ring_finger, 'ring_finger'));
    }
    if (data.pinky_finger) {
      formData.append('pinky_finger', createFileFromUri(data.pinky_finger, 'pinky_finger'));
    }

    // Log the FormData contents (for debugging)
    console.log('FormData contents:', {
      cnic: data.cnic,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      hasIndexFinger: !!data.index_finger,
      hasMiddleFinger: !!data.middle_finger,
      hasRingFinger: !!data.ring_finger,
      hasPinkyFinger: !!data.pinky_finger
    });

    const response: AxiosResponse = await api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      timeout: 60000, // 60 seconds timeout for large files
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

const getUserDetails = async (cnic: string): Promise<UserDetails> => {
  try {
    console.log('Fetching user details for CNIC:', cnic);

    const response: AxiosResponse<UserDetails> = await api.get(`/user/${cnic}`, {
      headers: {
        Accept: 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    console.log('User details retrieved:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error('Invalid CNIC format. CNIC must be 13 digits.');
    } else if (error.response?.status === 404) {
      throw new Error(`User with CNIC ${cnic} not found`);
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
};

const authenticate = async (data: AuthenticationData): Promise<AuthenticationResponse> => {
  try {
    console.log('Authenticating user with CNIC:', data.cnic);

    const formData = new FormData();
    
    // Add CNIC
    formData.append('cnic', data.cnic);
    
    // Helper function to create file object from URI
    const createFileFromUri = (uri: string, fingerName: string) => {
      // Extract just the base64 data if it's a data URI
      const base64Data = uri.startsWith('data:') 
        ? uri.split(',')[1] 
        : uri;

      return {
        uri: uri,
        type: 'image/png',
        name: `${fingerName}.png`,
      };
    };

    // Add finger scans if available
    if (data.index_finger) {
      formData.append('index_finger', createFileFromUri(data.index_finger, 'index_finger'));
    }
    if (data.middle_finger) {
      formData.append('middle_finger', createFileFromUri(data.middle_finger, 'middle_finger'));
    }
    if (data.ring_finger) {
      formData.append('ring_finger', createFileFromUri(data.ring_finger, 'ring_finger'));
    }
    if (data.pinky_finger) {
      formData.append('pinky_finger', createFileFromUri(data.pinky_finger, 'pinky_finger'));
    }

    // Log the FormData contents (for debugging)
    console.log('Authentication FormData contents:', {
      cnic: data.cnic,
      hasIndexFinger: !!data.index_finger,
      hasMiddleFinger: !!data.middle_finger,
      hasRingFinger: !!data.ring_finger,
      hasPinkyFinger: !!data.pinky_finger
    });

    const response: AxiosResponse<AuthenticationResponse> = await api.post('/authenticate/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      timeout: 60000, // 60 seconds timeout for large files
    });

    console.log('Authentication response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Authentication error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error('Invalid CNIC format. CNIC must be 13 digits.');
    } else if (error.response?.status === 404) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage?.includes('not found in registration database')) {
        throw new Error(`User with CNIC ${data.cnic} not found in registration database`);
      } else if (errorMessage?.includes('No fingerprint embeddings found')) {
        throw new Error(`No fingerprint embeddings found for CNIC ${data.cnic}`);
      } else {
        throw new Error(errorMessage || `User with CNIC ${data.cnic} not found`);
      }
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.response?.data?.message || 'Authentication failed');
    }
  }
};

/**
 * Register user with biometric data following Postman implementation
 */
const registerBiometric = async (data: BiometricRegistrationData): Promise<any> => {
  try {
    console.log('Starting biometric registration with data:', {
      hasCnic: !!data.cnic,
      hasIndexFinger: !!data.index_finger,
      platform: Platform.OS
    });

    // Create FormData instance
    const formData = new FormData();

    // Add text fields exactly as in Postman (without quotes)
    formData.append('cnic', data.cnic);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('date_of_birth', data.date_of_birth);

    // Helper function to create file object for React Native
    const createFileObject = (uri: string, fieldName: string) => {
      // Extract filename from URI or use default
      const fileName = uri.split('/').pop() || `${fieldName}.jpg`;
      
      // Handle Android file paths
      const fileUri = Platform.OS === 'android' 
        ? uri.replace('file://', '') // Remove file:// for Android
        : uri;

      const file = {
        uri: fileUri,
        type: 'image/jpeg',
        name: fileName
      };

      console.log(`Created file object for ${fieldName}:`, {
        originalUri: uri,
        processedUri: fileUri,
        fileName,
        platform: Platform.OS
      });

      return file;
    };

    // Add fingerprint images if available
    if (data.index_finger) {
      const file = createFileObject(data.index_finger, 'index_finger');
      formData.append('index_finger', file);
    }
    if (data.middle_finger) {
      const file = createFileObject(data.middle_finger, 'middle_finger');
      formData.append('middle_finger', file);
    }
    if (data.ring_finger) {
      const file = createFileObject(data.ring_finger, 'ring_finger');
      formData.append('ring_finger', file);
    }
    if (data.pinky_finger) {
      const file = createFileObject(data.pinky_finger, 'pinky_finger');
      formData.append('pinky_finger', file);
    }

    // Create config object
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://fpbiometric.swsam.co.uk/register/',
      timeout: 60000,
      headers: Platform.select({
        android: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        ios: {
          Accept: 'application/json',
        },
      }),
      transformRequest: Platform.OS === 'android' ? [(data: any): any => {
        return data;
      }] : undefined,
      data: formData
    };

    console.log('Request configuration:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      isFormData: formData instanceof FormData,
      platform: Platform.OS
    });

    // Make the request
    const response = await axios.request(config);
    
    console.log('Registration Success:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    return response.data;
  } catch (error: any) {
    console.error('Registration Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
      platform: Platform.OS
    });

    if (!error.response) {
      throw new Error(`Network error (${Platform.OS}). Please check your internet connection and try again.`);
    }

    switch (error.response.status) {
      case 400:
        throw new Error(error.response.data?.message || 'Invalid input data');
      case 405:
        throw new Error('Method not allowed. Please check the API endpoint.');
      case 413:
        throw new Error('Image file size too large. Please use smaller images.');
      case 415:
        throw new Error('Invalid image format. Please use JPEG images.');
      default:
        throw new Error(error.response.data?.message || 'Registration failed. Please try again.');
    }
  }
};

/**
 * Update user verification status
 */
const updateUserVerification = async (cnic: string, isVerified: boolean): Promise<UserVerificationResponse> => {
  try {
    console.log('Updating user verification status:', { cnic, isVerified });

    // Create FormData instance
    const formData = new FormData();
    formData.append('is_verified', isVerified.toString());

    const response: AxiosResponse<UserVerificationResponse> = await api.put(`/user/${cnic}/verify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    console.log('User verification update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user verification:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error('Invalid request data. Please check the CNIC format.');
    } else if (error.response?.status === 404) {
      throw new Error(`User with CNIC ${cnic} not found`);
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to update user verification status');
    }
  }
};

// Export both functions
export const biometricService = {
  register,
  registerBiometric,
  getUserDetails,
  authenticate,
  updateUserVerification
};

export default biometricService; 