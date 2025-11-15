import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { PixelButton, PixelText, PixelSprite } from '@/components/atoms';
import { tokens, durations, easings } from '@/design-system';
import ProgressIndicator from './components/ProgressIndicator';
import { OnboardingStackParamList } from './navigation/OnboardingNavigator';
import { useOnboarding } from './context/OnboardingContext';

const logoSource = require('../../../assets/images/logo/logo-96.png');

type WelcomeScreenNavigationProp = StackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { setCurrentStep } = useOnboarding();

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Ensure context step is correct when screen mounts
    setCurrentStep(1);

    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: durations.slow, // 500ms
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: durations.moderate, // 300ms
        easing: easings.snappy,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, setCurrentStep]);

  const handleGetStarted = useCallback(() => {
    navigation.navigate('ProfileSetup');
  }, [navigation]);

  const handleLogin = useCallback(() => {
    // Placeholder for navigation to the actual Login screen
    console.log('Navigate to LoginScreen (Placeholder)');
    // navigation.navigate('AuthStack', { screen: 'Login' });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Assuming background.primary is light green, barStyle should be dark-content */}
      <StatusBar barStyle="dark-content" backgroundColor={tokens.colors.background.primary} />
      <ProgressIndicator currentStep={1} totalSteps={3} />

      <View style={styles.container}>
        {/* Main Content Area */}
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Explicit Spacer: 80pt (tokens.spacing[9]) as required by layout spec */}
          <View style={{ height: tokens.spacing[9] }} />

          <View style={styles.hero}>
            <PixelSprite
              source={logoSource}
              size={96}
              alt="16BitFit Logo - a pixelated dumbbell icon"
            />
            <View style={styles.titleContainer}>
              <PixelText variant="h1" align="center" colorKey="primary">
                16BITFIT
              </PixelText>
            </View>
            <PixelText variant="body" align="center" colorKey="secondary">
              Your fitness journey starts here. Level up your health, one step at a time.
            </PixelText>
          </View>
        </Animated.View>

        {/* Call to Action Area (Bottom aligned) */}
        <View style={styles.ctaContainer}>
          <PixelButton
            variant="primary"
            onPress={handleGetStarted}
            accessibilityLabel="Get Started"
            accessibilityHint="Navigates to the profile creation screen"
          >
            GET STARTED
          </PixelButton>
          <View style={styles.secondaryCta}>
            <PixelButton
              variant="tertiary"
              onPress={handleLogin}
              accessibilityLabel="Log In"
              accessibilityHint="Navigates to the login screen for existing users"
            >
              I already have an account
            </PixelButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // Assuming background.primary is the light green (#9BBC0F)
    backgroundColor: tokens.colors.background.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: tokens.component.screenPaddingX, // 24pt
    justifyContent: 'space-between', // Pushes content to top and CTA to bottom
  },
  content: {
    // Content starts after the initial spacer
  },
  hero: {
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: tokens.spacing[4], // 24pt gap
    marginBottom: tokens.spacing[3], // 16pt gap
  },
  ctaContainer: {
    paddingBottom: tokens.spacing[6], // 40pt bottom padding
  },
  secondaryCta: {
    marginTop: tokens.spacing[3], // 16pt gap
  },
});

export default WelcomeScreen;
