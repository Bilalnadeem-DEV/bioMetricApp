import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  CNIC: string;
  name: string;
  isRegistered: boolean;
  registrationDate: string | null;
  lastLoginDate: string | null;
  preferences: {
    autoSave: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    enableNotifications: boolean;
  };
}

const initialState: UserState = {
  CNIC: '',
  name: '',
  isRegistered: false,
  registrationDate: null,
  lastLoginDate: null,
  preferences: {
    autoSave: true,
    imageQuality: 'high',
    enableNotifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserCNIC: (state, action: PayloadAction<string>) => {
      state.CNIC = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserRegistered: (state, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload;
      if (action.payload && !state.registrationDate) {
        state.registrationDate = new Date().toISOString();
      }
    },
    updateLastLogin: (state) => {
      state.lastLoginDate = new Date().toISOString();
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUserData: (state) => {
      state.CNIC = '';
      state.name = '';
      state.isRegistered = false;
      state.registrationDate = null;
      state.lastLoginDate = null;
      state.preferences = {
        autoSave: true,
        imageQuality: 'high',
        enableNotifications: true,
      };
    },
  },
});

export const {
  setUserCNIC,
  setUserName,
  setUserRegistered,
  updateLastLogin,
  updatePreferences,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer; 