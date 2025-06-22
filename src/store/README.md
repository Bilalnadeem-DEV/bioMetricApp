# Redux Setup for BioSecure App

## Overview
Redux Toolkit has been successfully integrated into the BioSecure React Native app. The store is configured with two main slices:

1. **User Slice** - Manages user registration and profile data
2. **Biometric Slice** - Manages biometric scan data and capture states

## Usage Examples

### 1. Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { setUserRegistration, clearUserData } from '../src/store/slices/userSlice';
import { addCapturedImage, resetScanSession } from '../src/store/slices/biometricSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const biometric = useAppSelector((state) => state.biometric);

  // Register a user
  const handleRegister = (userName: string) => {
    dispatch(setUserRegistration({
      userName,
      email: 'user@example.com', // optional
      phone: '+1234567890', // optional
      employeeId: 'EMP001' // optional
    }));
  };

  // Add a captured biometric image
  const handleImageCapture = (imageUri: string, index: number) => {
    dispatch(addCapturedImage({ uri: imageUri, index }));
  };

  // Clear all user data
  const handleLogout = () => {
    dispatch(clearUserData());
    dispatch(resetScanSession());
  };

  return (
    <View>
      <Text>Welcome, {user.userName}!</Text>
      <Text>Images captured: {biometric.capturedImages.length}/3</Text>
    </View>
  );
};
```

### 2. User Slice Actions

- `setUserName(name: string)` - Set user's name
- `setUserEmail(email: string)` - Set user's email
- `setUserPhone(phone: string)` - Set user's phone
- `setEmployeeId(id: string)` - Set employee ID
- `setUserRegistration(userData)` - Complete user registration
- `clearUserData()` - Clear all user data

### 3. Biometric Slice Actions

- `addCapturedImage({ uri, index })` - Add a captured biometric image
- `removeCapturedImage(index)` - Remove an image by index
- `setCurrentImageIndex(index)` - Set current image being captured
- `setIsScanning(boolean)` - Set scanning state
- `setScanningProgress(number)` - Set scanning progress (0-100)
- `completeScanSession()` - Mark scan session as complete
- `clearBiometricData()` - Clear all biometric data
- `resetScanSession()` - Reset current scan session

### 4. State Structure

#### User State
```typescript
{
  userName: string;
  email: string;
  phone: string;
  employeeId: string;
  isRegistered: boolean;
  registrationDate: string | null;
}
```

#### Biometric State
```typescript
{
  capturedImages: BiometricImage[];
  currentImageIndex: number;
  isScanning: boolean;
  scanningProgress: number;
  lastScanDate: string | null;
  totalScansCompleted: number;
}
```

## Integration Status

✅ Redux Toolkit installed and configured
✅ Store created with user and biometric slices
✅ Typed hooks created for TypeScript support
✅ Provider wrapped around App component
✅ Ready to use in any component

## Next Steps

To use Redux in your screens:

1. Import the typed hooks: `import { useAppDispatch, useAppSelector } from '../src/store/hooks';`
2. Import the actions you need from the slices
3. Use `useAppSelector` to read state
4. Use `useAppDispatch` to dispatch actions

The Redux store is now ready to manage your app's global state! 