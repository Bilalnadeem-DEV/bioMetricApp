import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import biometricSlice from './slices/biometricSlice';
import appSlice from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: appSlice,
    user: userSlice,
    biometric: biometricSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 