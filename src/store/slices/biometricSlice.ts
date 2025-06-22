import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BiometricImage {
  uri: string;
  timestamp: string;
  index: number;
  quality?: 'low' | 'medium' | 'high';
  size?: { width: number; height: number };
  fileSize?: number;
}

interface ScanSession {
  id: string;
  userName: string;
  startTime: string;
  endTime?: string;
  images: BiometricImage[];
  status: 'in_progress' | 'completed' | 'cancelled' | 'error';
}

interface BiometricState {
  capturedImages: BiometricImage[];
  currentImageIndex: number;
  isScanning: boolean;
  scanningProgress: number;
  lastScanDate: string | null;
  totalScansCompleted: number;
  currentSession: ScanSession | null;
  scanHistory: ScanSession[];
  error: string | null;
  cameraPermission: 'granted' | 'denied' | 'not_requested';
  storagePermission: 'granted' | 'denied' | 'not_requested';
}

const initialState: BiometricState = {
  capturedImages: [],
  currentImageIndex: 0,
  isScanning: false,
  scanningProgress: 0,
  lastScanDate: null,
  totalScansCompleted: 0,
  currentSession: null,
  scanHistory: [],
  error: null,
  cameraPermission: 'not_requested',
  storagePermission: 'not_requested',
};

const biometricSlice = createSlice({
  name: 'biometric',
  initialState,
  reducers: {
    startScanSession: (state, action: PayloadAction<{ userName: string }>) => {
      const sessionId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      state.currentSession = {
        id: sessionId,
        userName: action.payload.userName,
        startTime: new Date().toISOString(),
        images: [],
        status: 'in_progress',
      };
      state.capturedImages = [];
      state.currentImageIndex = 0;
      state.isScanning = true;
      state.scanningProgress = 0;
      state.error = null;
    },
    endScanSession: (state, action: PayloadAction<{ status: 'completed' | 'cancelled' | 'error'; error?: string }>) => {
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
        state.currentSession.status = action.payload.status;
        state.currentSession.images = [...state.capturedImages];
        
        // Add to history
        state.scanHistory.unshift(state.currentSession);
        
        // Keep only last 10 sessions
        if (state.scanHistory.length > 10) {
          state.scanHistory = state.scanHistory.slice(0, 10);
        }
        
        if (action.payload.status === 'completed') {
          state.totalScansCompleted += 1;
          state.lastScanDate = new Date().toISOString();
        }
        
        if (action.payload.error) {
          state.error = action.payload.error;
        }
        
        state.currentSession = null;
      }
      state.isScanning = false;
    },
    addCapturedImage: (state, action: PayloadAction<{ 
      uri: string; 
      index: number; 
      quality?: 'low' | 'medium' | 'high';
      size?: { width: number; height: number };
      fileSize?: number;
    }>) => {
      const newImage: BiometricImage = {
        uri: action.payload.uri,
        timestamp: new Date().toISOString(),
        index: action.payload.index,
        quality: action.payload.quality || 'high',
        size: action.payload.size,
        fileSize: action.payload.fileSize,
      };
      
      // Replace existing image at the same index or add new one
      const existingIndex = state.capturedImages.findIndex(img => img.index === action.payload.index);
      if (existingIndex !== -1) {
        state.capturedImages[existingIndex] = newImage;
      } else {
        state.capturedImages.push(newImage);
      }
      
      // Sort by index to maintain order
      state.capturedImages.sort((a, b) => a.index - b.index);
      
      // Update progress
      state.scanningProgress = (state.capturedImages.length / 3) * 100;
      
      // Update current session if active
      if (state.currentSession) {
        state.currentSession.images = [...state.capturedImages];
      }
    },
    removeCapturedImage: (state, action: PayloadAction<number>) => {
      state.capturedImages = state.capturedImages.filter(img => img.index !== action.payload);
      state.scanningProgress = (state.capturedImages.length / 3) * 100;
      
      // Update current session if active
      if (state.currentSession) {
        state.currentSession.images = [...state.capturedImages];
      }
    },
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    setIsScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setScanningProgress: (state, action: PayloadAction<number>) => {
      state.scanningProgress = Math.max(0, Math.min(100, action.payload));
    },
    setCameraPermission: (state, action: PayloadAction<'granted' | 'denied' | 'not_requested'>) => {
      state.cameraPermission = action.payload;
    },
    setStoragePermission: (state, action: PayloadAction<'granted' | 'denied' | 'not_requested'>) => {
      state.storagePermission = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeScanSession: (state) => {
      state.lastScanDate = new Date().toISOString();
      state.totalScansCompleted += 1;
      state.isScanning = false;
      state.scanningProgress = 100;
      
      if (state.currentSession) {
        state.currentSession.endTime = new Date().toISOString();
        state.currentSession.status = 'completed';
        state.currentSession.images = [...state.capturedImages];
        state.scanHistory.unshift(state.currentSession);
        state.currentSession = null;
      }
    },
    clearBiometricData: (state) => {
      state.capturedImages = [];
      state.currentImageIndex = 0;
      state.isScanning = false;
      state.scanningProgress = 0;
      state.currentSession = null;
      state.error = null;
    },
    resetScanSession: (state) => {
      state.capturedImages = [];
      state.currentImageIndex = 0;
      state.isScanning = false;
      state.scanningProgress = 0;
      state.error = null;
      
      if (state.currentSession) {
        state.currentSession.status = 'cancelled';
        state.currentSession.endTime = new Date().toISOString();
        state.scanHistory.unshift(state.currentSession);
        state.currentSession = null;
      }
    },
    clearScanHistory: (state) => {
      state.scanHistory = [];
    },
  },
});

export const {
  startScanSession,
  endScanSession,
  addCapturedImage,
  removeCapturedImage,
  setCurrentImageIndex,
  setIsScanning,
  setScanningProgress,
  setCameraPermission,
  setStoragePermission,
  setError,
  clearError,
  completeScanSession,
  clearBiometricData,
  resetScanSession,
  clearScanHistory,
} = biometricSlice.actions;

export default biometricSlice.reducer; 