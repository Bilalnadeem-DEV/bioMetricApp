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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  updateLastLogin,
  setUserName,
  setUserRegistered,
  setResetLoggedInUserDetail,
} from '../store/slices/userSlice';
import { clearBiometricData } from '../store/slices/biometricSlice';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { name, isRegistered, loggedInUserDetail } = useAppSelector(state => state.user);

  useEffect(() => {
    // Update last login when user reaches home screen
    dispatch(updateLastLogin());
  }, [dispatch]);

  const handleRegister = () => {
    console.log('Navigating to Register screen');
    navigation.navigate('Register');
  };

  const handleLogout = () => {
    dispatch(setUserName(''));
    dispatch(setUserRegistered(false));
    dispatch(clearBiometricData());
    dispatch(setResetLoggedInUserDetail());
  };

  const getWelcomeMessage = () => {
    if (isRegistered && name) {
      return `Welcome back, ${name}!`;
    }
    return 'hyperI';
  };

  const getDescription = () => {
    if (isRegistered && name) {
      return 'Here are your details';
    }
    return 'Secure biometric authentication for enhanced security and seamless access control.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {isRegistered && (
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/mainAppLogo.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {isRegistered && name && <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>}
            <Text style={styles.description}>{getDescription()}</Text>
            {!isRegistered && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  <Text style={styles.infoHighlight}>Note: </Text>
                  If you haven't registered yet, please click on Signup before attempting to login.
                </Text>
              </View>
            )}
            {isRegistered && (
              <View style={styles.userDetailsContainer}>
                <Text style={styles.userDetailText}>
                  <Text style={styles.labelText}>CNIC: </Text>
                  {loggedInUserDetail.cnic}
                </Text>
                <Text style={styles.userDetailText}>
                  <Text style={styles.labelText}>First Name: </Text>
                  {loggedInUserDetail.firstName}
                </Text>
                <Text style={styles.userDetailText}>
                  <Text style={styles.labelText}>Last Name: </Text>
                  {loggedInUserDetail.lastName}
                </Text>
                <Text style={styles.userDetailText}>
                  <Text style={styles.labelText}>Date of Birth: </Text>
                  {loggedInUserDetail.dateOfBirth}
                </Text>
              </View>
            )}
          </View>

          {/* {!isRegistered && ( */}
          {
            !isRegistered && <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={handleRegister}>
              <Text style={[styles.buttonText, styles.registerButtonText]}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.newScreenButton]}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          }
                    
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
    top: 30,
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
    paddingTop: 24,
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorPalettes.text.primary,
    textAlign: 'center',
    marginTop: 20,
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
  userDetailsContainer: {
    width: '100%',
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  userDetailText: {
    fontSize: 16,
    marginBottom: 16,
    color: ColorPalettes.text.primary,
  },
  labelText: {
    fontWeight: 'bold',
    color: ColorPalettes.text.secondary,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  infoText: {
    fontSize: 18,
    color: ColorPalettes.text.primary,
    lineHeight: 24,
  },
  infoHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorPalettes.text.secondary,
  },
});

export default HomeScreen;
