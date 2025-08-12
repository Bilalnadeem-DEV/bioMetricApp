import React, { useState, useRef, useEffect } from 'react';
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
  Keyboard,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUserCNIC, setUserDateOfBirth, setUserFirstName, setUserLastName, setUserName } from '../store/slices/userSlice';
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

  const [cnic, setCnic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
  const [cnicError, setCnicError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [dobError, setDobError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Add refs for TextInputs to manage focus properly
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);
  const cnicInputRef = useRef<TextInput>(null);

  // Add useEffect to handle navigation cleanup
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Dismiss keyboard and blur all inputs when leaving screen
      Keyboard.dismiss();
      firstNameInputRef.current?.blur();
      lastNameInputRef.current?.blur();
      cnicInputRef.current?.blur();
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

  const validateLastName = (inputLastName: string): boolean => {
    const trimmedLastName = inputLastName.trim();
    
    if (!trimmedLastName) {
      setLastNameError('Last name is required');
      return false;
    }
    
    if (trimmedLastName.length < 2) {
      setLastNameError('Last name must be at least 2 characters');
      return false;
    }
    
    setLastNameError('');
    return true;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = formatDate(date);
      setDateOfBirth(formattedDate);
      setDobError('');
    }
  };

  const showDatePickerModal = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

  const handleCnicChange = (value: string) => {    
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

  const validateDateOfBirth = (inputDate: string): boolean => {
    if (!inputDate) {
      setDobError('Date of birth is required');
      return false;
    }

    const date = new Date(selectedDate);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }

    if (age < 18) {
      setDobError('Must be at least 18 years old');
      return false;
    }

    if (age > 150) {
      setDobError('Invalid age');
      return false;
    }

    setDobError('');
    return true;
  };

  const handleRegister = async () => {    
    // Dismiss keyboard before processing
    Keyboard.dismiss();
    firstNameInputRef.current?.blur();
    lastNameInputRef.current?.blur();
    cnicInputRef.current?.blur();

    const isCnicValid = validateCnic(cnic);
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);

    if (!isCnicValid || !isFirstNameValid || !isLastNameValid) {
      return;
    }

    dispatch(setUserName(`${firstName} ${lastName}`));
    dispatch(setUserCNIC(cnic.replace(/\D/g, '')));
    dispatch(setUserFirstName(firstName))
    dispatch(setUserLastName(lastName))
    dispatch(setUserDateOfBirth(dateOfBirth))
    
    // Navigate to BiometricLogin after successful registration
    navigation.navigate('NewScreen');
  };

  const handleBack = () => {
    // Properly dismiss keyboard and blur inputs before navigation
    Keyboard.dismiss();
    firstNameInputRef.current?.blur();
    lastNameInputRef.current?.blur();
    cnicInputRef.current?.blur();
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
                  ref={cnicInputRef}
                  style={[styles.input, cnicError ? styles.inputError : null]}
                  placeholder="Enter your CNIC (e.g., 12345-1234567-1)"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={cnic}
                  onChangeText={handleCnicChange}
                  onBlur={() => validateCnic(cnic)}
                  keyboardType="numeric"
                  maxLength={15}
                  returnKeyType="next"
                  onSubmitEditing={() => firstNameInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  ref={firstNameInputRef}
                  style={[styles.input, firstNameError ? styles.inputError : null]}
                  placeholder="Enter your first name"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  onBlur={() => validateFirstName(firstName)}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  ref={lastNameInputRef}
                  style={[styles.input, lastNameError ? styles.inputError : null]}
                  placeholder="Enter your last name"
                  placeholderTextColor={ColorPalettes.text.muted}
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  onBlur={() => validateLastName(lastName)}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    lastNameInputRef.current?.blur();
                  }}
                  blurOnSubmit={true}
                />
                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity 
                  style={[styles.input, dobError ? styles.inputError : null]}
                  onPress={showDatePickerModal}
                >
                  <Text style={[
                    styles.dateText,
                    !dateOfBirth && styles.placeholderText
                  ]}>
                    {dateOfBirth || 'Date of Birth (DD/MM/YYYY)'}
                  </Text>
                </TouchableOpacity>
                {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
              </View>           

              {/* Date Picker for iOS */}
              {Platform.OS === 'ios' && showDatePicker && (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={showDatePicker}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.pickerContainer}>
                      <View style={[{width: '100%', height: 18, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center', borderTopStartRadius : 100, borderTopEndRadius : 100}]}>
                        <View style={[{width: 40, height: 8, backgroundColor: 'white', borderRadius: 100}]}></View>
                      </View>
                      <View style={styles.pickerHeader}>
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(false)}
                          style={styles.pickerButton}
                        >
                          <Text style={styles.pickerButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            handleDateChange(null, selectedDate);
                            setShowDatePicker(false);
                          }}
                          style={styles.pickerButton}
                        >
                          <Text style={[styles.pickerButtonText, styles.doneButton]}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                      />
                    </View>
                  </View>
                </Modal>
              )}

              {/* Date Picker for Android */}
              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
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
  inputError: {
    borderColor: ColorPalettes.interactive.error,
  },
  errorText: {
    color: ColorPalettes.interactive.error,
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
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
  dateText: {
    fontSize: 16,
    color: ColorPalettes.text.primary,
    padding: 12,
  },
  placeholderText: {
    color: ColorPalettes.text.muted,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  pickerHeader: {    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalettes.borders.light,
  },
  pickerButton: {
    padding: 8,
  },
  pickerButtonText: {
    fontSize: 20,
    color: 'red',
  },
  doneButton: {
    fontWeight: '600',
    fontSize: 20,
    color: '#1E2772',
  },
});

export default RegisterScreen; 