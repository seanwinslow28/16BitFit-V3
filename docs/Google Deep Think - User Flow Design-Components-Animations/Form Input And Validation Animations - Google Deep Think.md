This document provides the complete animation specifications and production-ready React Native code for the 16BitFit user onboarding screens. The implementation utilizes `react-native-reanimated` (v2/v3) for high-performance, UI-thread animations and `react-native-haptic-feedback` for tactile reinforcement, ensuring accessibility and a retro aesthetic.

### **Prerequisites and Global Configuration**

It is assumed that `react-native-reanimated` and `react-native-haptic-feedback` are installed and configured.

JavaScript  
// GlobalConfig.js  
import { AccessibilityInfo } from 'react-native';  
import Haptics from 'react-native-haptic-feedback';

// Color Palette (16-bit feel)  
export const Colors \= {  
  PixelDefault: '\#A0A0A0',  
  PixelFocus: '\#4A90E2', // Bright Blue  
  PixelError: '\#D0021B', // Red  
  PixelSuccess: '\#7ED321', // Green  
  PixelWarning: '\#F5A623', // Yellow  
  Background: '\#121212', // Dark background for retro feel  
  TextPrimary: '\#FFFFFF',  
  TextSecondary: '\#A0A0A0',  
};

export const RetroFont \= 'PressStart2P-Regular'; // Assumed font name

// Accessibility: Reduced Motion Check  
let reduceMotionEnabled \= false;  
// Initialize this check early in the app lifecycle  
const updateReduceMotionStatus \= (isEnabled) \=\> {  
    reduceMotionEnabled \= isEnabled;  
}  
AccessibilityInfo.isReduceMotionEnabled().then(updateReduceMotionStatus);  
AccessibilityInfo.addEventListener('reduceMotionChanged', updateReduceMotionStatus);

export const isReduceMotionEnabled \= () \=\> reduceMotionEnabled;

// Haptics Configuration  
const HapticOptions \= {  
  enableVibrateFallback: true,  
  ignoreAndroidSystemSettings: false,  
};

export const triggerHaptic \= (type) \=\> {  
    Haptics.trigger(type, HapticOptions);  
}

---

### **1, 2 & 3\. Unified Pixel Input: Focus, Error Shake, and Success**

We combine these animations into a single, reusable `PixelInput` component for robust state management and smooth transitions.

**Animation Triggers:**

* **Focus:** `onFocus`/`onBlur`.  
* **Error Shake:** `error` prop becomes truthy.  
* **Success:** `isValid` prop is true and `error` is falsy.

**State Priority:** Error \> Success \> Focus \> Default.

JavaScript  
// PixelInput.js  
import React, { useState, useEffect } from 'react';  
import { View, TextInput, StyleSheet, Text, AccessibilityInfo } from 'react-native';  
import Animated, {  
  useSharedValue,  
  useAnimatedStyle,  
  withTiming,  
  withSpring,  
  withSequence,  
  Easing,  
  interpolateColor,  
  interpolate,  
  cancelAnimation,  
} from 'react-native-reanimated';  
import { Colors, RetroFont, isReduceMotionEnabled, triggerHaptic } from './GlobalConfig';

const PixelInput \= ({ label, error, isValid, value, onChangeText, style, ...props }) \=\> {  
  const \[isFocused, setIsFocused\] \= useState(false);  
    
  // Animation drivers  
  const focusAnim \= useSharedValue(0);  
  const successAnim \= useSharedValue(0);  
  const errorAnim \= useSharedValue(0);  
  const shakeAnim \= useSharedValue(0);

  const DURATION \= 150;

  // \--- 1\. Focus State Management \---  
  const handleFocus \= () \=\> {  
    setIsFocused(true);  
    triggerHaptic('impactLight');  
    const duration \= isReduceMotionEnabled() ? 0 : DURATION;  
    focusAnim.value \= withTiming(1, { duration, easing: Easing.inOut(Easing.ease) });  
  };

  const handleBlur \= () \=\> {  
    setIsFocused(false);  
    const duration \= isReduceMotionEnabled() ? 0 : DURATION;  
    focusAnim.value \= withTiming(0, { duration, easing: Easing.inOut(Easing.ease) });  
  };

  // \--- 2\. Error Shake Management \---  
  useEffect(() \=\> {  
    if (error) {  
      errorAnim.value \= withTiming(1, { duration: DURATION });  
      triggerErrorAnimation();  
      AccessibilityInfo.announceForAccessibility(\`Error: ${error}\`);  
    } else {  
      errorAnim.value \= withTiming(0, { duration: DURATION });  
      cancelAnimation(shakeAnim);  
    }  
  }, \[error\]);

  const triggerErrorAnimation \= () \=\> {  
    triggerHaptic('notificationError');

    if (isReduceMotionEnabled()) return;

    // Shake sequence: \[0, \-10, 10, \-10, 10, \-5, 5, 0\] over \~500ms (71ms per keyframe)  
    shakeAnim.value \= withSequence(  
      withTiming(-10, { duration: 71 }),  
      withTiming(10, { duration: 71 }),  
      withTiming(-10, { duration: 71 }),  
      withTiming(10, { duration: 71 }),  
      withTiming(-5, { duration: 71 }),  
      withTiming(5, { duration: 71 }),  
      withTiming(0, { duration: 71 })  
    );  
  };

  // \--- 3\. Success Checkmark Management \---  
  useEffect(() \=\> {  
    if (isValid && \!error) {  
        if (successAnim.value \!== 1\) {  
            triggerHaptic('notificationSuccess');  
        }  
        if (isReduceMotionEnabled()) {  
            successAnim.value \= withTiming(1, { duration: DURATION });  
        } else {  
            // Gentle Spring (springGentle)  
            successAnim.value \= withSpring(1, { damping: 10, stiffness: 100 });  
        }  
    } else {  
        successAnim.value \= withTiming(0, { duration: DURATION });  
    }  
  }, \[isValid, error\]);

  // \--- Animated Styles \---

  // Input Container (Border, Glow, Shake)  
  const inputContainerStyle \= useAnimatedStyle(() \=\> {  
    // Robust Color Management using nested interpolation for smooth transitions between all states.  
    // Priority: Error \> Success \> Focus \> Default

    // A. Base Color (Default vs Focus)  
    const baseColor \= interpolateColor(  
        focusAnim.value,  
        \[0, 1\],  
        \[Colors.PixelDefault, Colors.PixelFocus\]  
    );

    // B. Validation Color (Base vs Success)  
    const validationColor \= interpolateColor(  
        successAnim.value,  
        \[0, 1\],  
        \[baseColor, Colors.PixelSuccess\]  
    );  
      
    // C. Final Color (Validation vs Error)  
    const borderColor \= interpolateColor(  
        errorAnim.value,  
        \[0, 1\],  
        \[validationColor, Colors.PixelError\]  
    );

    if (isReduceMotionEnabled()) {  
      return {   
        borderColor,   
        borderWidth: 3,  
        transform: \[{ translateX: shakeAnim.value }\],  
      };  
    }

    // Border width: 3px → 4px  
    const borderWidth \= interpolate(focusAnim.value, \[0, 1\], \[3, 4\]);  
    // Subtle glow effect (shadow opacity 0 → 0.3)  
    const shadowOpacity \= interpolate(focusAnim.value, \[0, 1\], \[0, 0.3\]);

    return {  
      borderColor,  
      borderWidth,  
      shadowOpacity,  
      shadowColor: Colors.PixelFocus,  
      transform: \[{ translateX: shakeAnim.value }\],  
    };  
  });

  // Label Style (Scale and Color)  
  const labelStyle \= useAnimatedStyle(() \=\> {  
    const color \= interpolateColor(  
      focusAnim.value,  
      \[0, 1\],  
      \[Colors.TextSecondary, Colors.PixelFocus\]  
    );  
      
    if (isReduceMotionEnabled()) return { color };  
    // Label transform: scale 1 → 1.05  
    const scale \= interpolate(focusAnim.value, \[0, 1\], \[1, 1.05\]);  
    return { color, transform: \[{ scale }\] };  
  });

  // Success Checkmark Style (Slide-in Bounce)  
  const checkmarkStyle \= useAnimatedStyle(() \=\> {  
    const opacity \= successAnim.value;  
      
    if (isReduceMotionEnabled()) return { opacity };

    // Slide-in from right: translateX \+20px → 0  
    const translateX \= interpolate(successAnim.value, \[0, 1\], \[20, 0\]);  
    // Scale bounce: 0.8 → 1 (driven by withSpring)  
    const scale \= interpolate(successAnim.value, \[0, 1\], \[0.8, 1\]);

    return {  
      opacity,  
      transform: \[{ translateX }, { scale }\],  
    };  
  });

  return (  
    \<View style={styles.wrapper}\>  
      \<Animated.Text style={\[styles.label, labelStyle\]}\>  
        {label}  
      \</Animated.Text\>  
        
      \<Animated.View style={\[styles.inputContainer, inputContainerStyle\]}\>  
        \<TextInput  
          style={\[styles.input, style\]}  
          onFocus={handleFocus}  
          onBlur={handleBlur}  
          value={value}  
          onChangeText={onChangeText}  
          placeholderTextColor={Colors.TextSecondary}  
          accessibilityLabel={label}  
          accessibilityState={{ focused: isFocused, invalid: \!\!error }}  
          {...props}  
        /\>  
        {/\* Success Icon \*/}  
        \<Animated.View style={\[styles.iconContainer, checkmarkStyle\]}\>  
            {/\* Replace with Pixel Art SVG if available \*/}  
            \<Text style={styles.checkmark}\>✔️\</Text\>  
        \</Animated.View\>  
      \</Animated.View\>

      {/\* Error Message \*/}  
      \<View aria-live="polite"\>  
        {error && (  
          \<Text style={styles.errorMessage} accessibilityRole="alert"\>  
            {error}  
          \</Text\>  
        )}  
      \</View\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  wrapper: { marginVertical: 10 },  
  label: { fontFamily: RetroFont, marginBottom: 8, fontSize: 12 },  
  inputContainer: {  
    backgroundColor: Colors.Background,  
    borderRadius: 0, // Pixel art style  
    shadowOffset: { width: 0, height: 0 },  
    shadowRadius: 8,  
    elevation: 5,  
    flexDirection: 'row',  
    alignItems: 'center',  
  },  
  input: {   
      flex: 1,  
      fontFamily: RetroFont,   
      height: 50,   
      paddingHorizontal: 10,   
      color: Colors.TextPrimary,   
      fontSize: 14   
    },  
    iconContainer: {  
        position: 'absolute',  
        right: 10,  
    },  
    checkmark: {  
        color: Colors.PixelSuccess,  
        fontSize: 16,  
    },  
    errorMessage: {  
        color: Colors.PixelError,  
        fontFamily: RetroFont,  
        fontSize: 10,  
        marginTop: 5,  
    },  
});

export default PixelInput;

---

### **4\. Input Character Count Animation**

**1\. Trigger:** `onChangeText`. **2\. Sequence:** Color shift based on percentage (80% warning, 100% danger). Pulse animation (Scale 1→1.2→1) on keystroke when approaching the limit.

JavaScript  
// CharacterCountInput.js  
import React from 'react';  
import { View, StyleSheet } from 'react-native';  
import Animated, {  
  useSharedValue,  
  useAnimatedStyle,  
  withTiming,  
  withSequence,  
  interpolateColor,  
} from 'react-native-reanimated';  
import PixelInput from './PixelInput';  
import { Colors, RetroFont, isReduceMotionEnabled } from './GlobalConfig';

const CharacterCountInput \= ({ maxLength, value, onChangeText, ...props }) \=\> {  
  const count \= value ? value.length : 0;  
  const percentage \= Math.min(count / maxLength, 1);

  const colorAnim \= useSharedValue(percentage);  
  const pulseAnim \= useSharedValue(1); // Scale driver

  React.useEffect(() \=\> {  
      // Animate color transition smoothly  
      colorAnim.value \= withTiming(percentage, { duration: 200 });

      // Pulse animation when approaching limit (\>= 80%)  
      if (percentage \>= 0.8) {  
        if (\!isReduceMotionEnabled()) {  
            // Trigger a single pulse on keystroke  
            pulseAnim.value \= withSequence(  
              withTiming(1.2, { duration: 150 }),  
              withTiming(1, { duration: 150 })  
            );  
        }  
      } else {  
          pulseAnim.value \= 1;  
      }  
  }, \[percentage\]);

  const counterStyle \= useAnimatedStyle(() \=\> {  
    // Color shift: Safe (green) → Warning (yellow, 80%) → Danger (red, 100%)  
    const color \= interpolateColor(  
      colorAnim.value,  
      \[0, 0.79, 0.8, 1\],  
      \[Colors.PixelSuccess, Colors.PixelSuccess, Colors.PixelWarning, Colors.PixelError\]  
    );

    return {  
      color,  
      transform: \[{ scale: pulseAnim.value }\],  
    };  
  });

  return (  
    \<View\>  
      \<PixelInput  
        maxLength={maxLength}  
        value={value}  
        onChangeText={onChangeText}  
        {...props}  
        // Accessibility: Enhance label with count  
        accessibilityLabel={\`${props.label}. ${count} out of ${maxLength} characters used.\`}  
      /\>  
      \<Animated.Text style={\[styles.counter, counterStyle\]}\>  
        {count} / {maxLength}  
      \</Animated.Text\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
    counter: {  
        textAlign: 'right',  
        marginTop: 5,  
        fontFamily: RetroFont,  
        fontSize: 12,  
    }  
});

export default CharacterCountInput;

---

### **5\. Password Strength Meter**

**1\. Trigger:** `onChangeText` (debounced for performance). **2\. Sequence:** Segment-by-segment fill effect using staggered delays (50ms). Color gradient (Red → Yellow → Green).

JavaScript  
// PasswordStrengthInput.js  
import React, { useState, useEffect, useCallback } from 'react';  
import { View, Text, StyleSheet } from 'react-native';  
import Animated, {  
  useSharedValue,  
  useAnimatedStyle,  
  withTiming,  
  Easing,  
  interpolate,  
} from 'react-native-reanimated';  
import PixelInput from './PixelInput';  
import { Colors, RetroFont, isReduceMotionEnabled } from './GlobalConfig';  
// Requires installation: npm install lodash.debounce  
import debounce from 'lodash.debounce'; 

const TOTAL\_SEGMENTS \= 4;

// Placeholder calculation (replace with robust logic, e.g., zxcvbn)  
const calculateStrength \= (p) \=\> {  
    let score \= 0;  
    if (p.length \> 6\) score++;  
    if (p.length \> 10\) score++;  
    if (/\[A-Z\]/.test(p) && /\\d/.test(p)) score++;  
    if (/\[^A-Za-z0-9\]/.test(p)) score++;  
    return score;  
};

const getStrengthMeta \= (score) \=\> {  
    if (score \>= 4\) return { label: 'Strong', color: Colors.PixelSuccess };  
    if (score \>= 2\) return { label: 'Fair', color: Colors.PixelWarning };  
    if (score \>= 1\) return { label: 'Weak', color: Colors.PixelError };  
    return { label: '', color: Colors.PixelDefault };  
};

// Individual Segment Component  
const Segment \= ({ isActive, color, delay }) \=\> {  
    const segmentAnim \= useSharedValue(0);

    useEffect(() \=\> {  
        if (isActive) {  
            // Apply delay for staggered effect (skip if reduced motion is enabled)  
            const animationDelay \= isReduceMotionEnabled() ? 0 : delay;  
            // In Reanimated, we use the \`delay\` parameter in withTiming for staggering  
            segmentAnim.value \= withTiming(1, {   
                duration: 300,   
                easing: Easing.out(Easing.ease),   
                delay: animationDelay   
            });  
        } else {  
            segmentAnim.value \= withTiming(0, { duration: 200 });  
        }  
    }, \[isActive\]);

    const segmentStyle \= useAnimatedStyle(() \=\> {  
        // Animate opacity and slightly scale for a "pop-in" effect  
        const scale \= interpolate(segmentAnim.value, \[0, 1\], \[0.9, 1\]);  
        return {  
          opacity: segmentAnim.value,  
          backgroundColor: color,  
          transform: \[{ scale }\],  
        };  
      });

    return \<Animated.View style={\[styles.segment, segmentStyle\]} /\>;  
}

const PasswordStrengthInput \= (props) \=\> {  
  const \[strengthScore, setStrengthScore\] \= useState(0);

  // Performance: Debounce the calculation (300ms) to prevent input lag  
  const updateStrength \= useCallback(  
    debounce((newPassword) \=\> {  
      const score \= calculateStrength(newPassword);  
      setStrengthScore(score);  
    }, 300), \[\]  
  );

  const handleChangeText \= (text) \=\> {  
    updateStrength(text);  
    if (props.onChangeText) props.onChangeText(text);  
  }

  const { label, color } \= getStrengthMeta(strengthScore);

  return (  
    \<View\>  
      \<PixelInput secureTextEntry onChangeText={handleChangeText} {...props} /\>  
      \<View  
        style={styles.meterContainer}  
        // Accessibility: Use progress bar roles  
        accessibilityRole="progressbar"  
        aria-live="polite"  
        aria-valuenow={strengthScore}  
        aria-valuemax={TOTAL\_SEGMENTS}  
        aria-valuetext={\`Password strength: ${label || 'None'}\`}  
      \>  
        \<View style={styles.segmentsWrapper}\>  
            {\[...Array(TOTAL\_SEGMENTS)\].map((\_, index) \=\> (  
                \<Segment   
                    key={index}   
                    isActive={strengthScore \> index}   
                    color={color}   
                    delay={index \* 50} // 50ms stagger  
                /\>  
            ))}  
        \</View\>  
        {/\* Text Morphing: Achieved here by the rapid color/text change, LayoutAnimation could also be used if needed \*/}  
        \<Text style={\[styles.strengthLabel, { color }\]}\>{label}\</Text\>  
      \</View\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  meterContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },  
  segmentsWrapper: {  
    flexDirection: 'row',  
    flex: 1,  
    height: 12,  
    backgroundColor: '\#333333', // Background for empty segments  
    padding: 2,  
    borderWidth: 1,  
    borderColor: Colors.PixelDefault,  
  },  
  segment: {  
    height: '100%',  
    flex: 1,  
    marginRight: 2, // Gap between segments for pixel look  
    borderRadius: 0,  
  },  
  strengthLabel: { fontFamily: RetroFont, fontSize: 12, width: 80, textAlign: 'right' },  
});

export default PasswordStrengthInput;

---

### **6\. Form Submission Loading**

**1\. Trigger:** `onPress` (when `isLoading` prop changes). **2\. Sequence:** Button text fades out, spinner fades in. Pixel-art spinner rotation using `steps(4)` easing over 800ms loop.

JavaScript  
// SubmitButton.js  
import React, { useEffect } from 'react';  
import { Text, StyleSheet, TouchableOpacity } from 'react-native';  
import Animated, {  
  useSharedValue,  
  useAnimatedStyle,  
  withTiming,  
  withRepeat,  
  interpolate,  
  Easing,  
  cancelAnimation,  
} from 'react-native-reanimated';  
import { Colors, RetroFont, isReduceMotionEnabled } from './GlobalConfig';

const SubmitButton \= ({ onPress, isLoading, title }) \=\> {  
  const contentAnim \= useSharedValue(0);  
  const rotationAnim \= useSharedValue(0);

  // Stepped Easing (steps(4)) for retro, low-frame-rate rotation  
  // Easing.steps(4) ensures the animation jumps in 4 discrete steps (0, 90, 180, 270 degrees).  
  const RetroSteppedEasing \= Easing.steps(4, true);

  useEffect(() \=\> {  
    // Fade transition (200ms)  
    contentAnim.value \= withTiming(isLoading ? 1 : 0, { duration: 200 });

    if (isLoading) {  
      // Start looping rotation (800ms loop)  
      if (\!isReduceMotionEnabled()) {  
        rotationAnim.value \= 0;  
        rotationAnim.value \= withRepeat(  
            withTiming(1, { duration: 800, easing: RetroSteppedEasing }),  
            \-1, // Loop indefinitely  
            false  
        );  
      }  
    } else {  
      // Stop rotation  
      cancelAnimation(rotationAnim);  
    }  
  }, \[isLoading\]);

  // Animated Styles  
  const textStyle \= useAnimatedStyle(() \=\> ({  
    opacity: interpolate(contentAnim.value, \[0, 1\], \[1, 0\]),  
  }));

  const spinnerStyle \= useAnimatedStyle(() \=\> {  
    const opacity \= interpolate(contentAnim.value, \[0, 1\], \[0, 1\]);  
    // The rotation value is driven by the stepped easing function  
    const rotation \= interpolate(rotationAnim.value, \[0, 1\], \[0, 360\]);  
      
    return {  
        opacity,  
        transform: \[{ rotate: \`${rotation}deg\` }\],  
    };  
  });

  return (  
    \<TouchableOpacity  
        onPress={onPress}  
        style={styles.button}  
        disabled={isLoading}  
        // Accessibility: Indicate busy state  
        accessibilityRole="button"  
        accessibilityState={{ busy: isLoading }}  
        accessibilityHint={isLoading ? "Processing request, please wait." : "Submits the form."}  
    \>  
      {/\* Button Text \*/}  
      \<Animated.View style={\[styles.content, textStyle\]}\>  
        \<Text style={styles.buttonText}\>{title}\</Text\>  
      \</Animated.View\>

      {/\* Spinner \*/}  
      {isLoading && (  
        \<Animated.View style={\[styles.content, spinnerStyle\]}\>  
            {isReduceMotionEnabled() ? (  
                \<Text style={styles.buttonText}\>Loading...\</Text\>  
            ) : (  
                /\* Replace with actual Pixel Art Spinner Icon/Image \*/  
                \<Text style={styles.spinner}\>⚙️\</Text\>  
            )}  
        \</Animated.View\>  
      )}  
    \</TouchableOpacity\>  
  );  
};

const styles \= StyleSheet.create({  
  button: {  
    height: 60,  
    backgroundColor: Colors.PixelFocus,  
    justifyContent: 'center',  
    alignItems: 'center',  
    borderWidth: 4,  
    borderColor: Colors.TextPrimary,  
    borderRadius: 0,  
    position: 'relative',  
  },  
  content: {  
    // Ensures text and spinner overlay each other  
    position: 'absolute',  
    justifyContent: 'center',  
    alignItems: 'center',  
  },  
  buttonText: {  
    color: '\#FFFFFF',  
    fontFamily: RetroFont,  
    fontSize: 18,  
  },  
  spinner: { fontSize: 24, color: '\#FFFFFF' },  
});

export default SubmitButton;

/\*   
Note on Form Disabling:  
The parent Form component must manage the disabled state of the inputs during submission.

const ParentForm \= () \=\> {  
    const \[isLoading, setIsLoading\] \= useState(false);  
    const formOpacity \= useAnimatedStyle(() \=\> ({  
        // Fade opacity 1 → 0.5  
        opacity: withTiming(isLoading ? 0.5 : 1, { duration: 200 }),  
    }));

    return (  
        \<\>  
            \<Animated.View style={formOpacity}\>  
                \<PixelInput editable={\!isLoading} ... /\>  
            \</Animated.View\>  
            \<SubmitButton isLoading={isLoading} ... /\>  
        \</\>  
    );  
}  
\*/  
