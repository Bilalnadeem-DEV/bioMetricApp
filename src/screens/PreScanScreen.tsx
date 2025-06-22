import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLastLogin } from '../store/slices/userSlice';
import { clearBiometricData } from '../store/slices/biometricSlice';

type PreScanScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PreScan'
>;

type PreScanScreenRouteProp = RouteProp<RootStackParamList, 'PreScan'>;

interface Props {
  navigation: PreScanScreenNavigationProp;
  route: PreScanScreenRouteProp;
}

const PreScanScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userName } = route.params;
  const dispatch = useAppDispatch();
  const { name: storedUserName, isRegistered } = useAppSelector((state) => state.user);
  const { totalScansCompleted } = useAppSelector((state) => state.biometric);

  useEffect(() => {
    // Update last login when user reaches this screen
    dispatch(updateLastLogin());
    
    // Clear any previous biometric data to start fresh
    dispatch(clearBiometricData());
  }, [dispatch]);

  const handleStartScan = () => {
    navigation.navigate('ScanPrep', { userName });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Use stored name if available, otherwise use route param
  const displayName = storedUserName || userName;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FBF5FE"
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Image 
                source={require('../../assets/images/appIcon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Ready to Scan</Text>
            <Text style={styles.subtitle}>Hello {displayName}!</Text>
            {isRegistered && totalScansCompleted > 0 && (
              <Text style={styles.statsText}>
                Total scans completed: {totalScansCompleted}
              </Text>
            )}
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Biometric Scan Instructions</Text>
            
            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Position Your Hand</Text>
                <Text style={styles.stepDescription}>
                  Place your 4 fingers (index, middle, ring, pinky) vertically from the side against the scanning area
                </Text>
              </View>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Hold Steady</Text>
                <Text style={styles.stepDescription}>
                  Keep your fingers straight and press gently. The system will automatically capture 3 images
                </Text>
              </View>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Wait for Completion</Text>
                <Text style={styles.stepDescription}>
                  Don't move during the capture sequence. You'll see thumbnails of each captured image
                </Text>
              </View>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Tips for Best Results</Text>
              <Text style={styles.tipText}>• Ensure good lighting</Text>
              <Text style={styles.tipText}>• Clean your fingers before scanning</Text>
              <Text style={styles.tipText}>• Keep fingers flat and straight</Text>
              <Text style={styles.tipText}>• Don't press too hard</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleStartScan}
            >
              <Text style={styles.buttonText}>Start Biometric Scan</Text>
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
    backgroundColor: '#FBF5FE',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    color: '#020817',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D1A58',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    shadowColor: '#823280',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#020817',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4F5866',
    textAlign: 'center',
    fontWeight: '300',
  },
  statsText: {
    fontSize: 14,
    color: '#823280',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#020817',
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
    backgroundColor: '#823280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020817',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#4F5866',
    lineHeight: 20,
  },
  tipsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020817',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#4F5866',
    marginBottom: 6,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#823280',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreScanScreen; 