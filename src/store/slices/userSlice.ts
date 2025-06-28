import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  CNIC: string;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isRegistered: boolean;
  registrationDate: string | null;
  lastLoginDate: string | null;
  preferences: {
    autoSave: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    enableNotifications: boolean;
  };

  loggedInUserDetail: {
    firstName: string;
    lastName: string;
    cnic: string;
    dateOfBirth: string;
  }
}

const initialState: UserState = {
  CNIC: '',
  name: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  isRegistered: false,
  registrationDate: null,
  lastLoginDate: null,
  preferences: {
    autoSave: true,
    imageQuality: 'high',
    enableNotifications: true,
  },
  loggedInUserDetail: {
    firstName: '',
    lastName: '',
    cnic: '',
    dateOfBirth: '',
  }
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
    },
    setLoggedInUserDetail: (state, action: PayloadAction<{ firstName: string; lastName: string; cnic: string; dateOfBirth: string }>) => {
      state.loggedInUserDetail = action.payload;
      state.isRegistered = true
    },
    setResetLoggedInUserDetail: (state) => {
      state.loggedInUserDetail = {
        firstName: '',
        lastName: '',
        cnic: '',
        dateOfBirth: '',
      };
      state.isRegistered = false
    },
    updateLastLogin: (state) => {
      state.lastLoginDate = new Date().toISOString();
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setUserFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setUserLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setUserDateOfBirth: (state, action: PayloadAction<string>) => {
      state.dateOfBirth = action.payload;
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
  setUserFirstName,
  setUserLastName,
  setUserDateOfBirth,
  setLoggedInUserDetail,
  setResetLoggedInUserDetail
} = userSlice.actions;

export default userSlice.reducer; 