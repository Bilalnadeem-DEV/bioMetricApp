import { AxiosInstance, AxiosError } from 'axios';
import axios from 'axios';
import { API_CONFIG, BASE_URL } from '../constants/apiEndpoints';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = ''; // TODO: Implement token retrieval
    
    // Add auth header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle token refresh here if needed
    if (error.response?.status === 401 && originalRequest) {
      // TODO: Implement token refresh logic
    }

    return Promise.reject(error);
  }
);

export default api; 