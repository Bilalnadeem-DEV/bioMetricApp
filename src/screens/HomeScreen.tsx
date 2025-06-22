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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLastLogin } from '../store/slices/userSlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { name, isRegistered, lastLoginDate } = useAppSelector((state) => state.user);
  const { totalScansCompleted, lastScanDate, scanHistory } = useAppSelector((state) => state.biometric);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getWelcomeMessage = () => {
    if (isRegistered && name) {
      return `Welcome back, ${name}!`;
    }
    return 'BioSecure';
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
        backgroundColor="#FBF5FE"
      />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}> */}
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
              <Image 
                source={require('../../assets/images/appIcon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>
              {getWelcomeMessage()}
            </Text>
            <Text style={styles.description}>
              {getDescription()}
            </Text>
            
            {isRegistered && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalScansCompleted}</Text>
                  <Text style={styles.statLabel}>Total Scans</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{scanHistory.length}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statDate}>{formatDate(lastScanDate)}</Text>
                  <Text style={styles.statLabel}>Last Scan</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleScanFingers}
            >
              <Text style={styles.buttonText}>
                {isRegistered ? 'Start Scanning' : 'Scan Fingers'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.registerButton]} 
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                {isRegistered ? 'Update Profile' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    width: '100%',
    height: '100%', 
    backgroundColor: '#FBF5FE',
  },
  content: {    
    flex: 1,
    width: '100%',
    height: '100%', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
    minHeight: 600,
  },
  topSection: {    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: -150,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D1A58',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#020817',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: '#4F5866',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#823280',
    marginBottom: 4,
  },
  statDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#823280',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#4F5866',
    textAlign: 'center',
  },
  buttonContainer: {    
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center',    
    gap: 15,    
  },
  button: {
    backgroundColor: '#823280',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',    
    width: '100%',
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  registerButton: { 
    backgroundColor: '#2D1A58',
    borderColor: '#823280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen; 