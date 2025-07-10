import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import biometricSlice from './slices/biometricSlice';
import appSlice from './slices/appSlice';
import scanSlice from './slices/scanSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const scanPersistConfig = {
  key: 'scan',
  storage: AsyncStorage,
  whitelist: ['scan'], // only scan will be persisted
};

const persistedScanReducer = persistReducer(scanPersistConfig, scanSlice);

export const store = configureStore({
  reducer: {
    app: appSlice,
    user: userSlice,
    biometric: biometricSlice,
    scan: persistedScanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 