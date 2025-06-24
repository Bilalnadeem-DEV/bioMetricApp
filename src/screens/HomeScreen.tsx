import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLastLogin, setUserName, setUserRegistered } from '../store/slices/userSlice';
import { clearBiometricData } from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { name, isRegistered } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Update last login when user reaches home screen
    dispatch(updateLastLogin());
  }, [dispatch]);

  const handleScanFingers = () => {
    console.log('Navigating to Camera screen');
    if (isRegistered && name) {
      // If user is registered, go directly to ScanPrep
      navigation.navigate('ScanPrep');
    } else {
      // If not registered, go to Camera for quick scan
      navigation.navigate('Camera', {});
    }
  };

  const handleRegister = () => {
    console.log('Navigating to Register screen');
    navigation.navigate('Register');
  };

  const handleNewScreen = () => {
    console.log('Navigating to New screen');
    navigation.navigate('NewScreen');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear user data
            dispatch(setUserName(''));
            dispatch(setUserRegistered(false));
            dispatch(clearBiometricData());
            console.log('User logged out successfully');
          },
        },
      ]
    );
  };

  const getWelcomeMessage = () => {    
    if (isRegistered && name) {
      return `Welcome back, ${name}!`;    
    }
    return 'hyperI';
  };

  const getDescription = () => {
    if (isRegistered && name) {
      return 'Ready for your next biometric scan session.';
    }
    return 'Secure biometric authentication for enhanced security and seamless access control.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={ColorPalettes.backgrounds.primary}
      />
      {/* Logout Button - Top Right */}
      {true && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/mainAppLogo.jpg')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {
              isRegistered && name ? getWelcomeMessage() : <></>
            }       
            <Text style={styles.description}>
              {getDescription()}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.registerButton]} 
              onPress={handleRegister}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>
              Signup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.newScreenButton]} 
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoutContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  logoutButton: {
    backgroundColor: ColorPalettes.interactive.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: ColorPalettes.shadows.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.error,
  },
  logoutButtonText: {
    color: ColorPalettes.text.light,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 24
  },
  topSection: {
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: ColorPalettes.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
   
  },
  button: {
    backgroundColor: ColorPalettes.interactive.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderColor: '#1E2772',
  },
  registerButtonText: {
    color: '#1E2772',
  },
  newScreenButton: {
    backgroundColor: '#1E2772',
    borderColor: '#1E2772',
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen; 