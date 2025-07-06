import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch } from '../store/hooks';
import { setUserName, setUserRegistered, setUserCNIC } from '../store/slices/userSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';
import biometricService from '../services/biometric.service';
import { safeKeyboardAndInputDismiss, safeKeyboardDismiss } from '../utils/keyboardUtils';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  
  const [cnic, setCnic] = useState('');
  const [cnicError, setCnicError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Add ref for TextInput to manage focus properly
  const cnicInputRef = useRef<TextInput>(null);

  // Add useEffect to handle navigation cleanup
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Use safe keyboard dismissal
      safeKeyboardAndInputDismiss([cnicInputRef]);
    });

    return unsubscribe;
  }, [navigation]);

  const validateCnic = (inputCnic: string): boolean => {
    const trimmedCnic = inputCnic.trim();
    
    if (!trimmedCnic) {
      setCnicError('CNIC is required');
      return false;
    }
    
    // Remove any non-numeric characters for validation
    const numericCnic = trimmedCnic.replace(/\D/g, '');
    
    if (numericCnic.length !== 13) {
      setCnicError('CNIC must be 13 digits');
      return false;
    }
    
    setCnicError('');
    return true;
  };

  const handleCnicChange = (value: string) => {
    // Format CNIC as user types (12345-1234567-1)
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 5) {
      formatted = formatted.substring(0, 5) + '-' + formatted.substring(5);
    }
    if (formatted.length > 13) {
      formatted = formatted.substring(0, 13) + '-' + formatted.substring(13, 14);
    }
    setCnic(formatted);
    if (cnicError) {
      setCnicError('');
    }
  };

  const handleLogin = async () => {
    // Use safe keyboard dismissal before processing
    safeKeyboardAndInputDismiss([cnicInputRef]);    
    
    // Add small delay to ensure keyboard is fully dismissed
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const isCnicValid = validateCnic(cnic);
    
    if (!isCnicValid) {
      return;
    }

    // Prevent multiple simultaneous login attempts
    if (isRegistering) {
      return;
    }

    dispatch(setUserName('User'));
    dispatch(setUserRegistered(false));

    // Get user details from API with timeout protection
    try {
      setIsRegistering(true);
      
      // Add timeout protection for API call
      const userDetails = await Promise.race([
        biometricService.getUserDetails(cnic.replace(/\D/g, '')),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout. Please check your connection and try again.')), 30000)
        )
      ]);
      
      console.log('User details retrieved:', userDetails);
      
      // Check if user details are valid and complete
      if (!userDetails.cnic || !userDetails.first_name || !userDetails.last_name) {
        throw new Error('Invalid or incomplete user data received');
      }

      // Log successful user retrieval
      console.log('User found successfully:', {
        name: `${userDetails.first_name} ${userDetails.last_name}`,
        cnic: userDetails.cnic,
        registeredFingers: userDetails.registered_fingers,
        registeredFingerTypes: userDetails.fingers
      });

      
      // Update user info in store
      dispatch(setUserName(`${userDetails.first_name} ${userDetails.last_name}`));
      dispatch(setUserRegistered(false));
      
      setIsRegistering(false);
      
    } catch (error: any) {
      console.error('Login error:', error);
      setIsRegistering(false);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to retrieve user details';
      if (error.message?.includes('timeout')) {
        errorMessage = 'Connection timeout. Please check your internet connection and try again.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        'Login Failed',
        errorMessage, 
        [{ text: 'OK' }]
      );
      return;
    }

    dispatch(setUserCNIC(cnic.replace(/\D/g, '')));
    // Navigate to BiometricLogin after successful login
    navigation.navigate('BiometricLogin');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleBack = () => {
    // Use safe keyboard dismissal before navigation
    safeKeyboardAndInputDismiss([cnicInputRef]);
    
    // Add small delay before navigation
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const LoadingOverlay = () => (
    <Modal transparent visible>
      <View style={styles.overlayContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1E2772" />
          <Text style={styles.loadingText}>Processing Fingerprints...</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ColorPalettes.backgrounds.primary}
      />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/images/mainAppLogo.jpg')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login with your CNIC</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CNIC</Text>
                <TextInput
                  ref={cnicInputRef}
                  style={[styles.input, cnicError ? styles.inputError : null]}
                  placeholder="Enter your CNIC (e.g., 12345-1234567-1)"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={cnic}
                  onChangeText={handleCnicChange}
                  onBlur={() => validateCnic(cnic)}
                  keyboardType="numeric"
                  maxLength={15}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    safeKeyboardDismiss();
                  }}
                  blurOnSubmit={true}
                />
                {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}
              </View>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              !cnic.trim() && styles.loginButtonDisabled
            ]} 
            onPress={handleLogin}
            disabled={!cnic.trim()}
          >
            <Text style={styles.buttonText}>Verify with biometric</Text>
          </TouchableOpacity>

          {/* <View style={styles.registerPrompt}>
            <Text style={styles.registerPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Sign up</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </KeyboardAvoidingView>
      {isRegistering && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: ColorPalettes.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 170,
    height: 170,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: ColorPalettes.text.primary,
    shadowColor: ColorPalettes.shadows.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: ColorPalettes.interactive.error,
  },
  errorText: {
    color: ColorPalettes.interactive.error,
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loginButton: {
    backgroundColor: '#1E2772',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2772',
  },
  loginButtonDisabled: {
    backgroundColor: ColorPalettes.text.disabled,
    borderColor: ColorPalettes.text.disabled,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerPromptText: {
    color: ColorPalettes.text.secondary,
    fontSize: 14,
  },
  registerLink: {
    color: ColorPalettes.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: ColorPalettes.text.primary,
    fontWeight: '500',
  },
});

export default LoginScreen; 