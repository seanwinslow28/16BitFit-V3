/**
 * 16BitFit Animation System
 * Game Boy-inspired animation timings and easings
 */

import { Easing } from 'react-native';

/**
 * Animation durations (in milliseconds)
 * Based on psychological research and Apple HIG guidelines
 */
export const durations = {
  instant: 0,       // No animation (accessibility preference)
  fast: 150,        // Button presses, micro-interactions
  normal: 300,      // Standard transitions, hover states
  moderate: 300,    // Alias for normal
  slow: 500,        // Dramatic reveals, onboarding moments
  verySlow: 800,    // Level-up celebrations, major milestones
  epic: 800,        // Alias for verySlow
} as const;

/**
 * Easing functions
 * Controls the acceleration/deceleration of animations
 */
export const easings = {
  linear: Easing.linear,
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),      // Material Design standard
  emphasized: Easing.bezier(0.0, 0.0, 0.2, 1),    // Enter animations
  decelerated: Easing.bezier(0.0, 0.0, 0.2, 1),   // Exit animations
  accelerated: Easing.bezier(0.4, 0.0, 1, 1),     // Accelerate
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),     // Bouncy (success animations)
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
} as const;

/**
 * Common animation configurations
 */
export const animations = {
  // Button press animation
  buttonPress: {
    duration: durations.fast,
    easing: easings.easeOut,
  },
  // Screen transitions
  screenTransition: {
    duration: durations.normal,
    easing: easings.easeInOut,
  },
  // Success/achievement animations
  success: {
    duration: durations.moderate,
    easing: easings.spring,
  },
  // Modal/overlay animations
  modal: {
    duration: durations.slow,
    easing: easings.emphasized,
  },
  // Fade animations
  fade: {
    duration: durations.normal,
    easing: easings.standard,
  },
  // Slide animations
  slide: {
    duration: durations.normal,
    easing: easings.emphasized,
  },
  // Scale animations (e.g., archetype card selection)
  scale: {
    duration: durations.fast,
    easing: easings.spring,
  },
  // Bounce animation (e.g., checkbox)
  bounce: {
    duration: durations.normal,
    easing: easings.spring,
  },
} as const;

/**
 * Animation presets for common use cases
 */
export const presets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: durations.normal,
    easing: easings.standard,
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
    duration: durations.normal,
    easing: easings.standard,
  },
  slideInUp: {
    from: { translateY: 20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    duration: durations.normal,
    easing: easings.emphasized,
  },
  slideInDown: {
    from: { translateY: -20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    duration: durations.normal,
    easing: easings.emphasized,
  },
  scaleIn: {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: durations.fast,
    easing: easings.spring,
  },
  scaleOut: {
    from: { scale: 1, opacity: 1 },
    to: { scale: 0.9, opacity: 0 },
    duration: durations.fast,
    easing: easings.standard,
  },
} as const;

export default {
  durations,
  easings,
  animations,
  presets,
};
