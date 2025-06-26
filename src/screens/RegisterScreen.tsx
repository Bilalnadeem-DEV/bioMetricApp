import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUserCNIC, setUserDateOfBirth, setUserFirstName, setUserLastName, setUserName, setUserRegistered } from '../store/slices/userSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { name: userName, isRegistered } = useAppSelector((state) => state.user);
  
  const [cnic, setCnic] = useState('5454545454545');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [dateOfBirth, setDateOfBirth] = useState('01/01/1990');
  const [cnicError, setCnicError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [dobError, setDobError] = useState('');

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

  const validateFirstName = (inputName: string): boolean => {
    const trimmedName = inputName.trim();
    
    if (!trimmedName) {
      setFirstNameError('First name is required');
      return false;
    }
    
    if (trimmedName.length < 2) {
      setFirstNameError('First name must be at least 2 characters long');
      return false;
    }
    
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      setFirstNameError('First name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    
    setFirstNameError('');
    return true;
  };

  const validateLastName = (inputName: string): boolean => {
    const trimmedName = inputName.trim();
    
    if (!trimmedName) {
      setLastNameError('Last name is required');
      return false;
    }
    
    if (trimmedName.length < 2) {
      setLastNameError('Last name must be at least 2 characters long');
      return false;
    }
    
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      setLastNameError('Last name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    
    setLastNameError('');
    return true;
  };

  const validateDateOfBirth = (inputDate: string): boolean => {
    const trimmedDate = inputDate.trim();
    
    if (!trimmedDate) {
      setDobError('Date of birth is required');
      return false;
    }
    
    // Basic date format validation (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = trimmedDate.match(dateRegex);
    
    if (!match) {
      setDobError('Date must be in DD/MM/YYYY format');
      return false;
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      setDobError('Please enter a valid date');
      return false;
    }
    
    setDobError('');
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

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    if (firstNameError) {
      setFirstNameError('');
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    if (lastNameError) {
      setLastNameError('');
    }
  };

  const handleDateOfBirthChange = (value: string) => {
    // Format date as user types (DD/MM/YYYY)
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
    }
    setDateOfBirth(formatted);
    if (dobError) {
      setDobError('');
    }
  };

  const handleRegister = () => {
    const isCnicValid = validateCnic(cnic);
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isDobValid = validateDateOfBirth(dateOfBirth);
    
    if (!isCnicValid || !isFirstNameValid || !isLastNameValid || !isDobValid) {
      return;
    }

    // Combine first and last name for the full name
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Save user data to Redux store
    dispatch(setUserName(fullName));

    dispatch(setUserCNIC(cnic));
    dispatch(setUserFirstName(firstName));
    dispatch(setUserLastName(lastName));
    dispatch(setUserDateOfBirth(dateOfBirth));

    navigation.navigate('NewScreen');
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>Create your biometric profile</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CNIC</Text>
                <TextInput
                  style={[styles.input, cnicError ? styles.inputError : null]}
                  placeholder="Enter your CNIC (e.g., 12345-1234567-1)"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={cnic}
                  onChangeText={handleCnicChange}
                  onBlur={() => validateCnic(cnic)}
                  keyboardType="numeric"
                  maxLength={15}
                />
                {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[styles.input, firstNameError ? styles.inputError : null]}
                  placeholder="Enter your first name"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  onBlur={() => validateFirstName(firstName)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[styles.input, lastNameError ? styles.inputError : null]}
                  placeholder="Enter your last name"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  onBlur={() => validateLastName(lastName)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={[styles.input, dobError ? styles.inputError : null]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={dateOfBirth}
                  onChangeText={handleDateOfBirthChange}
                  onBlur={() => validateDateOfBirth(dateOfBirth)}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
              </View>           
            </View>
          </View>
        </ScrollView>
        
        {/* Sticky Button Container */}
        {/* <View style={styles.stickyButtonContainer}> */}
          <TouchableOpacity 
            style={[
              styles.registerButton, 
              (!cnic.trim() || !firstName.trim() || !lastName.trim() || !dateOfBirth.trim()) && styles.registerButtonDisabled
            ]} 
            onPress={handleRegister}
            disabled={!cnic.trim() || !firstName.trim() || !lastName.trim() || !dateOfBirth.trim()}
          >
            <Text style={styles.buttonText}>Continue to Biometric Scan</Text>
          </TouchableOpacity>
        {/* </View> */}
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
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
  headerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ColorPalettes.brand.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: ColorPalettes.borders.light,
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
    marginBottom: 30,
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
  inputFocused: {
    borderColor: ColorPalettes.brand.primary,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOpacity: 0.2,
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
  instructionsContainer: {
    backgroundColor: ColorPalettes.backgrounds.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ColorPalettes.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: ColorPalettes.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: ColorPalettes.text.secondary,
    lineHeight: 20,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ColorPalettes.backgrounds.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: ColorPalettes.borders.light,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  registerButton: {        
    backgroundColor: '#1E2772',
    borderColor: '#1E2772',
    paddingVertical: 18,    
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',    
    borderWidth: 1,
  },
  registerButtonDisabled: {
    backgroundColor: ColorPalettes.text.disabled,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterScreen; 