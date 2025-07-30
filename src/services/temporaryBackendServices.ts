// Temporary Backend Services for testing biometric authentication
// Adapted from Node.js to React Native

import { Platform } from 'react-native';

interface BiometricRequest {
  Name: string;
  index: string; // base64 string
  middle: string; // base64 string
  ring: string; // base64 string
  pinky: string; // base64 string
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user_data?: {
    cnic: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    is_verified: boolean;
    registration_date: string;
    last_updated: string;
  };
}

interface FingerMatchData {
  match: boolean;
  score: number;
  threshold: number;
  confidence: string;
  bestStrategy1: string;
  bestStrategy2: string;
  image1Quality: string;
  image2Quality: string;
  strategiesAttempted: number;
  successfulExtractions1: number;
  successfulExtractions2: number;
  totalMatchAttempts: number;
  processingTime: number;
  allMatches: any;
  debugImages: any;
}

interface AuthenticateResponse {
  authenticated: boolean;
  cnic: string;
  matches_found: number;
  total_attempts: number;
  required_matches: number;
  match_details: {
    index: any;
    middle: any;
    ring: any;
    pinky: any;
  };
  message: string;
  user_data: {
    cnic: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    is_verified: boolean;
    registration_date: string;
    last_updated: string;
  };
  // Individual finger match data
  index?: FingerMatchData;
  middle?: FingerMatchData;
  ring?: FingerMatchData;
  pinky?: FingerMatchData;
}

// Convert base64 string to React Native FormData compatible format
const base64ToFormDataFile = (base64: string, filename: string, mimeType: string = 'image/jpeg') => {
  // Remove data URI prefix if present
  const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Android-specific FormData file structure
  if (Platform.OS === 'android') {
    return {
      uri: `data:${mimeType};base64,${cleanBase64}`,
      type: mimeType,
      name: filename,
      filename: filename, // Android needs both name and filename
    };
  }
  
  // iOS format
  return {
    uri: `data:${mimeType};base64,${cleanBase64}`,
    type: mimeType,
    name: filename,
  };
};

export const temporaryBackendService = {
  register: async (requestData: BiometricRequest): Promise<RegisterResponse> => {
    try {
      const axios = require('axios');
      
      console.log('🔥 TEMP SERVICE: Starting registration request');
      
      const formData = new FormData();
      formData.append('Name', requestData.Name);
      
      // Convert base64 strings to React Native FormData format
      if (requestData.index) {
        const indexFile = base64ToFormDataFile(requestData.index, 'index.jpg');
        formData.append('index', indexFile as any);
      }
      
      if (requestData.middle) {
        const middleFile = base64ToFormDataFile(requestData.middle, 'middle.jpg');
        formData.append('middle', middleFile as any);
      }
      
      if (requestData.ring) {
        const ringFile = base64ToFormDataFile(requestData.ring, 'ring.jpg');
        formData.append('ring', ringFile as any);
      }
      
      if (requestData.pinky) {
        const pinkyFile = base64ToFormDataFile(requestData.pinky, 'pinky.jpg');
        formData.append('pinky', pinkyFile as any);
      }

      console.log('🔥 TEMP SERVICE (REGISTER): FormData prepared with', {
        Name: requestData.Name,
        hasIndex: !!requestData.index,
        hasMiddle: !!requestData.middle,
        hasRing: !!requestData.ring,
        hasPinky: !!requestData.pinky,
        platform: Platform.OS,
      });

      // Android-specific debugging
      if (Platform.OS === 'android') {
        console.log('🤖 ANDROID SPECIFIC FORMDATA DEBUGGING:');
        console.log('- Using explicit Content-Type header');
        console.log('- Extended timeout to 60 seconds');
        console.log('- Added filename property for Android compatibility');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://fpbiometricdemo.swsam.co.uk/register',
        headers: {
          'accept': 'application/json',
          // Android-specific headers
          ...(Platform.OS === 'android' && {
            'Content-Type': 'multipart/form-data',
          }),
        },
        data: formData,
        // Android-specific timeout and transformRequest
        ...(Platform.OS === 'android' && {
          timeout: 60000, // Longer timeout for Android
          transformRequest: [function (data: any) {
            return data; // Let axios handle FormData transformation
          }],
        }),
      };

      const response = await axios.request(config);
      console.log('🔥 TEMP SERVICE (REGISTER):', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('🔥 TEMP SERVICE (REGISTER): Error:', error);
      throw error;
    }
  },

  authenticate: async (requestData: BiometricRequest): Promise<AuthenticateResponse> => {
    try {
      const axios = require('axios');
      
      console.log('🔥 TEMP SERVICE: Starting authentication request');
      
      const formData = new FormData();
      formData.append('Name', requestData.Name);
      
      // Convert base64 strings to React Native FormData format
      if (requestData.index) {
        const indexFile = base64ToFormDataFile(requestData.index, 'index.jpg');
        formData.append('index', indexFile as any);
      }
      
      if (requestData.middle) {
        const middleFile = base64ToFormDataFile(requestData.middle, 'middle.jpg');
        formData.append('middle', middleFile as any);
      }
      
      if (requestData.ring) {
        const ringFile = base64ToFormDataFile(requestData.ring, 'ring.jpg');
        formData.append('ring', ringFile as any);
      }
      
      if (requestData.pinky) {
        const pinkyFile = base64ToFormDataFile(requestData.pinky, 'pinky.jpg');
        formData.append('pinky', pinkyFile as any);
      }

      console.log('🔥 TEMP SERVICE (AUTHENTICATE): FormData prepared with', {
        Name: requestData.Name,
        hasIndex: !!requestData.index,
        hasMiddle: !!requestData.middle,
        hasRing: !!requestData.ring,
        hasPinky: !!requestData.pinky,
        platform: Platform.OS,
      });

      // Android-specific debugging
      if (Platform.OS === 'android') {
        console.log('🤖 ANDROID SPECIFIC AUTHENTICATE DEBUGGING:');
        console.log('- Using explicit Content-Type header');
        console.log('- Extended timeout to 60 seconds');
        console.log('- Added filename property for Android compatibility');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://fpbiometricdemo.swsam.co.uk/authenticate',
        headers: {
          'accept': 'application/json',
          // Android-specific headers
          ...(Platform.OS === 'android' && {
            'Content-Type': 'multipart/form-data',
          }),
        },
        data: formData,
        // Android-specific timeout and transformRequest
        ...(Platform.OS === 'android' && {
          timeout: 60000, // Longer timeout for Android
          transformRequest: [function (data: any) {
            return data; // Let axios handle FormData transformation
          }],
        }),
      };

      const response = await axios.request(config);
      console.log('🔥 TEMP SERVICE (AUTHENTICATE):', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('🔥 TEMP SERVICE (AUTHENTICATE): Error:', error);
      throw error;
    }
  }
};
