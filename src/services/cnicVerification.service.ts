import { AxiosResponse } from 'axios';
import api from './api';
import { CNIC_VERIFICATION_URL, API_CONFIG } from '../constants/apiEndpoints';
import { Platform } from 'react-native';

// Response interfaces based on the provided API format
interface CNICFrontOCRResponse {
  Name?: string;
  father_name?: string;
  husband_name?: string | null;
  cnic?: string;
  reference_tag?: string;
  dob?: string;
  disu?: string;
  dexp?: string;
  gender?: string;
  cnic_type?: string;
  type?: string;
  code?: string;
  desc?: string;
}

interface UserVerificationResponse {
  average_confidence?: number;
  code?: string;
  desc?: string;
  frame_results?: Array<{
    confidence: number;
    distance: number;
    frame: string;
  }>;
  valid_frames?: number;
}

interface LivenessDetectionResponse {
  code: number;
  message: string;
  real_flag: boolean;
  liveness_score: number;
  face_detected: boolean;
  brightness_passed: boolean;
  background_passed: boolean;
  posture_passed: boolean;
}

interface CNICImageData {
  front_image?: string | null;
  back_image?: string | null;
  selfie_image?: string | null;
}

class CNICVerificationService {
  // Helper function to create cross-platform file object
  private createFileObject(imageUri: string, fieldName: string) {
    // Detect file type from URI or default to JPEG
    let fileType = 'image/jpeg';
    let fileName = `${fieldName}.jpg`;
    
    if (imageUri.includes('data:image/png') || imageUri.toLowerCase().includes('.png')) {
      fileType = 'image/png';
      fileName = `${fieldName}.png`;
    }
    
    // Handle Android file URIs
    let processedUri = imageUri;
    if (Platform.OS === 'android' && imageUri.startsWith('file://')) {
      // Android sometimes needs file:// prefix removed
      processedUri = imageUri;
    }
    
    const file = {
      uri: processedUri,
      type: fileType,
      name: fileName,
    };
    
    console.log(`Created file object for ${fieldName}:`, {
      platform: Platform.OS,
      originalUri: imageUri.substring(0, 50) + '...',
      processedUri: processedUri.substring(0, 50) + '...',
      type: fileType,
      name: fileName
    });
    
    return file;
  }

  async extractCNICFrontOCR(imageUri: string): Promise<CNICFrontOCRResponse> {
    try {
      console.log('CNIC API URL:', `${CNIC_VERIFICATION_URL}cnic_front_ocr`);
      console.log('Platform:', Platform.OS);
      console.log('Image URI:', imageUri.substring(0, 100) + '...');
      
      const formData = new FormData();
      
      // Create cross-platform file object
      const file = this.createFileObject(imageUri, 'cnic_front');
      formData.append('image', file as any);
      
      console.log('FormData created, sending request...');

      const response: AxiosResponse<CNICFrontOCRResponse> = await api.post(
        `${CNIC_VERIFICATION_URL}cnic_front_ocr`,
        formData,
        {
          headers: Platform.select({
            android: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            ios: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            default: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            }
          }),
          timeout: 120000, // Increased to 2 minutes for OCR processing
        }
      );

      console.log('API Response received:', response.status);
      console.log('Response data type:', response.data.type);
      return response.data;
    } catch (error: any) {
      console.error('CNIC Front OCR error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: `${CNIC_VERIFICATION_URL}cnic_front_ocr`,
        platform: Platform.OS
      });
      
      // Handle specific Android errors
      if (Platform.OS === 'android' && error.response?.status === 413) {
        throw new Error('Image file too large for Android. Please use a smaller image or compress it further.');
      }
      
      throw new Error(error.response?.data?.desc || error.message || 'CNIC OCR processing failed');
    }
  }

  async verifyUser(embeddingRef: string, selfieImageUri: string): Promise<UserVerificationResponse> {
    try {
      console.log('User Verification API URL:', `${CNIC_VERIFICATION_URL}verify_user`);
      console.log('Platform:', Platform.OS);
      console.log('Embedding Reference:', embeddingRef);
      console.log('Selfie Image URI:', selfieImageUri.substring(0, 100) + '...');
      
      const formData = new FormData();
      
      // Add embedding reference
      formData.append('embedding_ref', embeddingRef);
      
      // Add frame count (always 1 for single selfie)
      formData.append('frame_count', '1');
      
      // Create cross-platform file object for the selfie
      const file = this.createFileObject(selfieImageUri, 'selfie');
      formData.append('frame0', file as any);
      
      console.log('User verification FormData created, sending request...');

      const response: AxiosResponse<UserVerificationResponse> = await api.post(
        `${CNIC_VERIFICATION_URL}verify_user`,
        formData,
        {
          headers: Platform.select({
            android: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            ios: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            default: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            }
          }),
          timeout: 120000, // 2 minutes timeout for face verification
        }
      );

      console.log('User Verification API Response received:', response.status);
      console.log('User Verification Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('User Verification error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: `${CNIC_VERIFICATION_URL}verify_user`,
        platform: Platform.OS
      });
      
      // Handle specific Android errors
      if (Platform.OS === 'android' && error.response?.status === 413) {
        throw new Error('Selfie image too large for Android. Please use a smaller image or compress it further.');
      }
      
      throw new Error(error.response?.data?.error || error.message || 'User verification failed');
    }
  }

  async detectLiveness(frameUris: string[]): Promise<LivenessDetectionResponse> {
    const livenessApiUrl = CNIC_VERIFICATION_URL + 'liveness_detector';
    try {
      const livenessApiUrl = CNIC_VERIFICATION_URL + 'liveness_detector';
      console.log('Liveness Detection API URL:', livenessApiUrl);
      console.log('Platform:', Platform.OS);
      console.log('Frame count:', frameUris.length);
      
      const formData = new FormData();
      
      // Add frame count
      formData.append('frame_count', frameUris.length.toString());
      
      // Add each frame image
      frameUris.forEach((frameUri, index) => {
        const file = this.createFileObject(frameUri, `frame${index}`);
        formData.append(`frame${index}`, file as any);
        console.log(`Added frame${index} to FormData`);
      });
      
      console.log('Liveness detection FormData created, sending request...');

      const response: AxiosResponse<LivenessDetectionResponse> = await api.post(
        livenessApiUrl,
        formData,
        {
          headers: Platform.select({
            android: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            ios: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            default: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            }
          }),
          timeout: 120000, // 2 minutes timeout for liveness detection
        }
      );

      console.log('Liveness Detection API Response received:', response.status);
      console.log('Liveness Detection Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Liveness Detection error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: livenessApiUrl,
        platform: Platform.OS
      });
      
      // Handle specific Android errors
      if (Platform.OS === 'android' && error.response?.status === 413) {
        throw new Error('Frame images too large for Android. Please use smaller images or compress them further.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Liveness detection failed');
    }
  }
}

export const cnicVerificationService = new CNICVerificationService();
export default cnicVerificationService; 