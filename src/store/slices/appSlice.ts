import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: {
    enabled: boolean;
    scanReminders: boolean;
    securityAlerts: boolean;
  };
  appVersion: string;
  lastUpdated: string | null;
  debugMode: boolean;
}

const initialState: AppState = {
  isLoading: false,
  theme: 'light',
  language: 'en',
  notifications: {
    enabled: true,
    scanReminders: true,
    securityAlerts: true,
  },
  appVersion: '1.0.0',
  lastUpdated: null,
  debugMode: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'es' | 'fr'>) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<AppState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setAppVersion: (state, action: PayloadAction<string>) => {
      state.appVersion = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    toggleDebugMode: (state) => {
      state.debugMode = !state.debugMode;
    },
    resetAppSettings: (state) => {
      state.theme = 'light';
      state.language = 'en';
      state.notifications = {
        enabled: true,
        scanReminders: true,
        securityAlerts: true,
      };
      state.debugMode = false;
    },
  },
});

export const {
  setLoading,
  setTheme,
  setLanguage,
  updateNotificationSettings,
  setAppVersion,
  toggleDebugMode,
  resetAppSettings,
} = appSlice.actions;

export default appSlice.reducer; 