import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ColorPalettes } from '../theme/helpers/colorPalettes';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Use useRef to prevent recreating animations on every render
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    const animationSequence = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();

    // Navigate to Home screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timer);
      animationSequence.stop();
    };
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/mainAppLogo.jpg')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>        
        <Text style={styles.subtitle}>Secure Authentication</Text>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalettes.backgrounds.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,    
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,    
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
    marginBottom: 50,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ColorPalettes.brand.primary,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  loadingDotDelay1: {
    backgroundColor: ColorPalettes.borders.light,
    opacity: 0.7,
  },
  loadingDotDelay2: {
    backgroundColor: ColorPalettes.brand.secondary,
    opacity: 1,
  },
});

export default SplashScreen; 