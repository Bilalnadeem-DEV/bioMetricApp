import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type SignupInstructionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignupInstruction'>;

interface SignupInstructionScreenProps {
  navigation: SignupInstructionScreenNavigationProp;
}

const SignupInstructionScreen: React.FC<SignupInstructionScreenProps> = ({ navigation }) => {

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ColorPalettes.backgrounds.primary} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} bounces={false}>
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
            <Text style={styles.title}>Two step signup process</Text>
            <Text style={styles.subtitle}>Follow these steps to complete your signup</Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepBox}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>Step 1</Text>
                <Text style={styles.stepTitle}>Identity Verification</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepDescription}>• Scan your CNIC card</Text>
                <Text style={styles.stepDescription}>• Take a selfie for facial verification</Text>
                <Text style={styles.stepDescription}>• System will perform facial matching</Text>
              </View>
            </View>

            <View style={[styles.stepBox, styles.lastStepBox]}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>Step 2</Text>
                <Text style={styles.stepTitle}>Biometric Registration</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepDescription}>• Scan your fingerprints</Text>
                <Text style={styles.stepDescription}>• Complete biometric verification</Text>
                <Text style={styles.stepDescription}>• Account creation will be completed</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.replace('ScanPrep')}            
        >
          <Text style={styles.buttonText}>Start Verification</Text>
        </TouchableOpacity>        
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 24,
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  logo: {
    width: 170,
    height: 170,
  },
  stepsContainer: {
    marginTop: 20,
  },
  stepBox: {
    backgroundColor: ColorPalettes.backgrounds.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalettes.borders.light,
  },
  lastStepBox: {
    marginBottom: 0,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E2772',
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorPalettes.text.primary,
  },
  stepContent: {
    paddingLeft: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: ColorPalettes.text.secondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  buttonText: {
    color: ColorPalettes.text.light,
    fontSize: 18,
    fontWeight: '600',
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
});

export default SignupInstructionScreen; 