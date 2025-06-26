/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ScanPrepScreen from './src/screens/ScanPrepScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImagePreviewScreen from './src/screens/ImagePreviewScreen';
import SplashScreen from './src/screens/SplashScreen';
import NewScreen from './src/screens/NewScreen';
import LoginScreen from './src/screens/LoginScreen';
import BiometricLogin from './src/screens/BiometricLogin';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Register: undefined;
  ScanPrep: undefined;
  Camera: { imageIndex?: number; onImageCaptured?: (imageUri: string, index: number) => void };
  ImagePreview: { imageUri: string };
  NewScreen: undefined;
  Login: undefined;
  BiometricLogin: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer
        // onStateChange={(state) => {
        //   console.log('Navigation state changed:', state);
        // }}
      >
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false, // Hide header for all screens
          }}
          >
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            listeners={{
              focus: () => console.log('SplashScreen focused'),
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            listeners={{
              focus: () => console.log('HomeScreen focused'),
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            listeners={{
              focus: () => console.log('RegisterScreen focused'),
            }}
          />
          <Stack.Screen 
            name="ScanPrep" 
            component={ScanPrepScreen}
            listeners={{
              focus: () => console.log('ScanPrepScreen focused'),
            }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen}
            listeners={{
              focus: () => console.log('CameraScreen focused'),
            }}
          />
          <Stack.Screen 
            name="ImagePreview" 
            component={ImagePreviewScreen}
            listeners={{
              focus: () => console.log('ImagePreviewScreen focused'),
            }}
          />
          <Stack.Screen 
            name="NewScreen" 
            component={NewScreen}
            listeners={{
              focus: () => console.log('NewScreen focused'),
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            listeners={{
              focus: () => console.log('LoginScreen focused'),
            }}
          />
          <Stack.Screen 
            name="BiometricLogin" 
            component={BiometricLogin}
            listeners={{
              focus: () => console.log('BiometricLogin focused'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
