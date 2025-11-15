This document provides implementation-ready animation specifications for the 16BitFit React Native application. The specifications adhere strictly to the design constraints, ensuring 60fps performance by utilizing the React Native Animated API with the native driver (transforms and opacity only), and include accessibility considerations for reduced motion.

### **Global Configuration: Easing, Durations, and Haptics**

The following configuration defines the design system's constraints.

JavaScript  
import { Animated, Easing, Vibration, Platform } from 'react-native';

// Duration System  
export const Duration \= {  
  micro: 50,  
  fast: 100,  
  normal: 200,  
  moderate: 300,  
  slow: 500,  
  epic: 800,  
};

// Easing Functions  
export const Ease \= {  
  // Element enters  
  easeOut: Easing.out(Easing.cubic),  
  // Retro snap  
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1.0),  
  // Quick response (slight overshoot)  
  snappy: Easing.bezier(0.175, 0.885, 0.320, 1.275),  
  // Spring configurations (used with Animated.spring)  
  spring: { friction: 5, tension: 60 }, // Bouncy overshoot  
  springGentle: { friction: 7, tension: 50 }, // Subtle bounce  
};

// Simplified Haptic Feedback  
// Note: For production, use a dedicated library (e.g., react-native-haptic-feedback)  
// for better control over iOS Taptic Engine (UIImpactFeedbackGenerator)  
// and Android VibrationEffect APIs.  
export const Haptics \= {  
  light: () \=\> Vibration.vibrate(10),  
  medium: () \=\> Vibration.vibrate(20),  
  heavy: () \=\> Vibration.vibrate(30),  
  // ... success, error  
};

---

### **1\. Primary Button Press (Pixel Art Style)**

This animation simulates a 3D pixel button press by moving the button face down and slightly scaling it, making the fixed pixel shadow appear to shrink from 4x4 to 2x2.

1. **Target Component**: `PrimaryButton` on `onPressIn` and `onPressOut`.  
2. **Initial State**: Button Face TranslateY: 0; Scale: 1\.  
3. **Final State (Pressed)**: Button Face TranslateY: 2; Scale: 0.98.  
4. **Timeline**:  
   * **Press In**: Duration: `fast` (100ms); Easing: `sharp`.  
   * **Press Out**: Type: Spring; Easing: `springGentle`.  
5. **Implementation Code**:

JavaScript  
import React, { useRef, useCallback } from 'react';  
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';  
// Import Duration, Ease, Haptics from config

const PrimaryButton \= ({ title, onPress, reduceMotion \= false }) \=\> {  
  const animValue \= useRef(new Animated.Value(0)).current;

  const handlePressIn \= useCallback(() \=\> {  
    Haptics.medium();  
    if (reduceMotion) return;

    Animated.timing(animValue, {  
      toValue: 1,  
      duration: Duration.fast,  
      easing: Ease.sharp,  
      useNativeDriver: true,  
    }).start();  
  }, \[animValue, reduceMotion\]);

  const handlePressOut \= useCallback(() \=\> {  
    if (reduceMotion) {  
        animValue.setValue(0);  
        return;  
    }

    Animated.spring(animValue, {  
      toValue: 0,  
      ...Ease.springGentle,  
      useNativeDriver: true,  
    }).start();  
  }, \[animValue, reduceMotion\]);

  // Interpolations  
  const translateY \= animValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[0, 2\], // Moves down 2px  
  });  
  const scale \= animValue.interpolate({  
      inputRange: \[0, 1\],  
      outputRange: \[1, 0.98\],  
  });

  return (  
    \<View style={styles.container}\>  
      {/\* Fixed Pixel Shadow (4px offset) \*/}  
      \<View style={styles.shadow} /\>

      {/\* Moving Button Face \*/}  
      \<Pressable  
        onPressIn={handlePressIn}  
        onPressOut={handlePressOut}  
        onPress={onPress}  
      \>  
        \<Animated.View  
          style={\[  
            styles.buttonFace,  
            { transform: \[{ translateY }, { scale }\] },  
          \]}  
        \>  
          \<Text style={styles.text}\>{title}\</Text\>  
        \</Animated.View\>  
      \</Pressable\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    position: 'relative',  
    paddingBottom: 4, // Reserve space for the shadow  
    paddingRight: 4,  
  },  
  shadow: {  
    position: 'absolute',  
    top: 4,  
    left: 4,  
    right: 0,  
    bottom: 0,  
    backgroundColor: '\#000000', // Hard shadow color  
  },  
  buttonFace: {  
    backgroundColor: '\#4CAF50', // Primary color  
    padding: 12,  
    borderWidth: 2,  
    borderColor: '\#000000',  
  },  
  text: { color: '\#FFFFFF', fontWeight: 'bold' },  
});

6. **Haptic Integration**:  
   * Timing: Immediately on `onPressIn`.  
   * Type: `medium`.  
7. **Accessibility Variant**:  
   * If `reduceMotion` is true, animations are bypassed. The button provides instant feedback without motion.  
8. **Performance Notes**:  
   * Native driver compatibility: Yes. Only `transform` properties are used.  
   * GPU acceleration: Confirmed. The structure avoids layout recalculations.

---

### **2\. Secondary Button Hover (Adapted for Press)**

A subtle scale-up and background color change simulation. Since `backgroundColor` cannot be animated natively, an opacity overlay is used.

1. **Target Component**: `SecondaryButton` on `onPressIn` and `onPressOut`.  
2. **Initial State**: Scale: 1; Overlay Opacity: 0\.  
3. **Final State (Pressed)**: Scale: 1.05; Overlay Opacity: 1\.  
4. **Timeline**:  
   * **Press In**: Type: Spring; Easing: `springGentle` (Subtle bounce).  
   * **Press Out**: Duration: `normal` (200ms); Easing: `easeOut`.  
5. **Implementation Code**:

JavaScript  
import React, { useRef, useCallback } from 'react';  
import { Animated, Pressable, Text, StyleSheet, View } from 'react-native';  
// Import Duration, Ease from config

const SecondaryButton \= ({ title, onPress, reduceMotion \= false }) \=\> {  
  const animValue \= useRef(new Animated.Value(0)).current;

  const handlePressIn \= useCallback(() \=\> {  
    if (reduceMotion) {  
        animValue.setValue(1); // Instant color change feedback  
        return;  
    }

    Animated.spring(animValue, {  
      toValue: 1,  
      ...Ease.springGentle,  
      useNativeDriver: true,  
    }).start();  
  }, \[animValue, reduceMotion\]);

  const handlePressOut \= useCallback(() \=\> {  
    if (reduceMotion) {  
        animValue.setValue(0); // Instant color reset  
        return;  
    }

    Animated.timing(animValue, {  
      toValue: 0,  
      duration: Duration.normal,  
      easing: Ease.easeOut,  
      useNativeDriver: true,  
    }).start();  
  }, \[animValue, reduceMotion\]);

  const scale \= animValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[1, 1.05\],  
  });

  const overlayOpacity \= animValue;

  return (  
    \<Pressable  
      onPressIn={handlePressIn}  
      onPressOut={handlePressOut}  
      onPress={onPress}  
    \>  
      \<Animated.View  
        style={\[  
          styles.button,  
          // Only apply scale transform if motion is allowed  
          \!reduceMotion && { transform: \[{ scale }\] },  
        \]}  
      \>  
        {/\* Base Background \*/}  
        \<View style={styles.backgroundBase} /\>

        {/\* Highlight Overlay (Animated Opacity) \*/}  
        \<Animated.View  
            style={\[styles.backgroundHighlight, { opacity: overlayOpacity }\]}  
        /\>  
        \<Text style={styles.text}\>{title}\</Text\>  
      \</Animated.View\>  
    \</Pressable\>  
  );  
};

const styles \= StyleSheet.create({  
  button: {  
    padding: 10,  
    borderWidth: 2,  
    borderColor: '\#000000',  
    position: 'relative',  
  },  
  backgroundBase: {  
      ...StyleSheet.absoluteFillObject,  
      backgroundColor: '\#FFFFFF', // Default color  
  },  
  backgroundHighlight: {  
      ...StyleSheet.absoluteFillObject,  
      backgroundColor: '\#E0E0E0', // Active color  
  },  
  text: { color: '\#000000', textAlign: 'center', zIndex: 1 },  
});

6. **Haptic Integration**:  
   * Timing: Optional light haptic on `onPressIn`.  
   * Type: `light`.  
7. **Accessibility Variant**:  
   * If `reduceMotion` is true, the `scale` animation is disabled. The `opacity` change (color transition) occurs instantly to provide necessary visual feedback without motion.  
8. **Performance Notes**:  
   * Native driver compatibility: Yes (`scale` and `opacity`).  
   * GPU acceleration: Confirmed. The overlay technique is the standard performant workaround for native color animation limits.

---

### **3\. Icon Button Tap**

A quick scale pulse (1 → 0.9 → 1.1 → 1\) achieved using a sequence of timing and spring animations, combined with an optional rotation.

1. **Target Component**: `IconButton` on `onPress`.  
2. **Initial State**: Scale: 1; Rotation: 0deg.  
3. **Final State**: Scale: 1 (after pulse); Rotation: 360deg (if enabled).  
4. **Timeline**:  
   * **Scale Pulse**: Timing down (50ms, `sharp`), Spring up (overshoot handled by spring configuration).  
   * **Rotation**: Duration: `moderate` (300ms); Easing: `snappy`.  
5. **Implementation Code**:

JavaScript  
import React, { useRef, useCallback } from 'react';  
import { Animated, Pressable, StyleSheet } from 'react-native';  
// Import Duration, Ease, Haptics from config

const IconButton \= ({ icon, onPress, enableRotation \= false, reduceMotion \= false }) \=\> {  
  const scaleValue \= useRef(new Animated.Value(1)).current;  
  const rotateValue \= useRef(new Animated.Value(0)).current;

  const handlePress \= useCallback(() \=\> {  
    Haptics.light();

    if (reduceMotion) {  
        onPress();  
        return;  
    }

    const animations \= \[\];

    // 1\. Scale Pulse Sequence (Timing down, Spring up)  
    animations.push(  
        Animated.sequence(\[  
            Animated.timing(scaleValue, {  
                toValue: 0.9,  
                duration: Duration.micro,  
                easing: Ease.sharp,  
                useNativeDriver: true,  
            }),  
            // Spring back with overshoot (low friction \= more bounce)  
            Animated.spring(scaleValue, {  
                toValue: 1,  
                friction: 3, // Low friction creates the 1.1 overshoot  
                tension: 80,  
                useNativeDriver: true,  
            })  
        \])  
    );

    // 2\. Rotation (Optional)  
    if (enableRotation) {  
        rotateValue.setValue(0); // Reset rotation  
        animations.push(  
            Animated.timing(rotateValue, {  
                toValue: 1,  
                duration: Duration.moderate,  
                easing: Ease.snappy,  
                useNativeDriver: true,  
            })  
        );  
    }

    Animated.parallel(animations).start(() \=\> {  
        onPress();  
    });

  }, \[scaleValue, rotateValue, enableRotation, reduceMotion, onPress\]);

  const rotation \= rotateValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \['0deg', '360deg'\],  
  });

  const transformStyle \= {  
    transform: \[  
        { scale: scaleValue },  
        { rotate: enableRotation ? rotation : '0deg'}  
    \],  
  };

  return (  
    \<Pressable onPress={handlePress} style={styles.container}\>  
      \<Animated.View style={transformStyle}\>  
        {/\* Icon Component (e.g., Image or Vector Icon) \*/}  
        {icon}  
      \</Animated.View\>  
    \</Pressable\>  
  );  
};

const styles \= StyleSheet.create({  
    container: { padding: 10 },  
});

6. **Haptic Integration**:  
   * Timing: Immediately on `onPress`.  
   * Type: `light`.  
7. **Accessibility Variant**:  
   * Animations are skipped, and `onPress` is executed immediately.  
8. **Performance Notes**:  
   * Native driver compatibility: Yes (`scale`, `rotate`).  
   * GPU acceleration: Confirmed. Combining `sequence` and `spring` provides a natural, snappy feel efficiently.

---

### **4\. Toggle Switch Animation**

A sliding thumb transition with a background color change simulated by cross-fading two background layers.

1. **Target Component**: `ToggleSwitch` on state change (`isOn` prop).  
2. **Initial State (Off)**: Thumb TranslateX: 0; Active Background Opacity: 0\.  
3. **Final State (On)**: Thumb TranslateX: \[Calculated Distance\]; Active Background Opacity: 1\.  
4. **Timeline**:  
   * Duration: `normal` (200ms).  
   * Easing: `snappy`.  
5. **Implementation Code**:

JavaScript  
import React, { useRef, useEffect } from 'react';  
import { Animated, Pressable, StyleSheet, View } from 'react-native';  
// Import Duration, Ease, Haptics from config

// Constants based on design  
const SWITCH\_WIDTH \= 50;  
const THUMB\_SIZE \= 26;  
const PADDING \= 2;  
const TRANSLATE\_X\_DISTANCE \= SWITCH\_WIDTH \- THUMB\_SIZE \- (PADDING \* 2);

const ToggleSwitch \= ({ isOn, onToggle, reduceMotion \= false }) \=\> {  
  // Initialize value based on current state  
  const animValue \= useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() \=\> {  
    const duration \= reduceMotion ? 0 : Duration.normal;  
    const toValue \= isOn ? 1 : 0;

    Animated.timing(animValue, {  
      toValue: toValue,  
      duration: duration,  
      easing: Ease.snappy,  
      useNativeDriver: true,  
    }).start(() \=\> {  
        // Trigger haptic on completion of the slide  
        Haptics.light();  
    });  
  }, \[isOn, animValue, reduceMotion\]);

  const thumbTranslateX \= animValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[0, TRANSLATE\_X\_DISTANCE\],  
  });

  const activeOpacity \= animValue;

  return (  
    \<Pressable onPress={onToggle} style={styles.container}\>  
        {/\* Base (Off) Color Background \*/}  
        \<View style={styles.backgroundOff} /\>

        {/\* Active (On) Color Background \- Animated Opacity \*/}  
         \<Animated.View  
            style={\[styles.backgroundOn, { opacity: activeOpacity }\]}  
        /\>

      {/\* Thumb \- Animated Translation \*/}  
      \<Animated.View  
        style={\[  
          styles.thumb,  
          { transform: \[{ translateX: thumbTranslateX }\] },  
        \]}  
      /\>  
    \</Pressable\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    width: SWITCH\_WIDTH,  
    height: THUMB\_SIZE \+ (PADDING \* 2),  
    padding: PADDING,  
    borderRadius: 30,  
    justifyContent: 'center',  
  },  
  backgroundOff: {  
    ...StyleSheet.absoluteFillObject,  
    borderRadius: 30,  
    backgroundColor: '\#9E9E9E', // Off color  
  },  
  backgroundOn: {  
    ...StyleSheet.absoluteFillObject,  
    borderRadius: 30,  
    backgroundColor: '\#4CAF50', // On color  
  },  
  thumb: {  
    width: THUMB\_SIZE,  
    height: THUMB\_SIZE,  
    backgroundColor: '\#FFFFFF',  
    borderRadius: THUMB\_SIZE / 2,  
  },  
});

6. **Haptic Integration**:  
   * Timing: At animation completion (in the `start()` callback).  
   * Type: `light`.  
7. **Accessibility Variant**:  
   * If `reduceMotion` is true, duration is set to `0` for an instant transition.  
8. **Performance Notes**:  
   * Native driver compatibility: Yes (`translateX`, `opacity`).  
   * GPU acceleration: Confirmed. This approach avoids animating `backgroundColor` or layout properties.

---

### **5\. Checkbox/Radio Check Animation**

This involves a scale bounce on the container \[1, 0.8, 1.2, 1\] and a simultaneous checkmark reveal using rotation (-45° to 0°), scale, and opacity. This avoids non-native SVG path animations while providing a dynamic effect.

1. **Target Component**: `Checkbox` on state change (`isChecked` prop).  
2. **Initial State (Unchecked)**: Box Scale: 1; Checkmark Opacity: 0, Scale: 0.5, Rotation: \-45deg.  
3. **Final State (Checked)**: Box Scale: 1 (after bounce); Checkmark Opacity: 1, Scale: 1, Rotation: 0deg.  
4. **Timeline**:  
   * **Box Bounce**: Sequence using Timing and Spring.  
   * **Checkmark Reveal**: Duration: `moderate` (300ms); Easing: `snappy`.  
5. **Implementation Code**:

JavaScript  
import React, { useRef, useEffect } from 'react';  
import { Animated, Pressable, StyleSheet, Text } from 'react-native';  
// Import Duration, Ease, Haptics from config

const Checkbox \= ({ isChecked, onToggle, reduceMotion \= false }) \=\> {  
  // Value for the checkmark appearance (0 to 1\)  
  const checkAnim \= useRef(new Animated.Value(isChecked ? 1 : 0)).current;  
  // Value for the container bounce (starts at 1\)  
  const bounceAnim \= useRef(new Animated.Value(1)).current;

  useEffect(() \=\> {  
    const toValue \= isChecked ? 1 : 0;

    if (reduceMotion) {  
        checkAnim.setValue(toValue);  
        bounceAnim.setValue(1);  
        return;  
    }

    const animations \= \[\];

    // 1\. Checkmark Appearance/Disappearance  
    animations.push(  
        Animated.timing(checkAnim, {  
            toValue: toValue,  
            // Snappy reveal when checking, faster hide when unchecking  
            duration: isChecked ? Duration.moderate : Duration.fast,  
            easing: isChecked ? Ease.snappy : Ease.sharp,  
            useNativeDriver: true,  
        })  
    );

    // 2\. Box Bounce (Only when checking ON)  
    if (isChecked) {  
        bounceAnim.setValue(1);  
        animations.push(  
            Animated.sequence(\[  
                // Scale down quickly  
                Animated.timing(bounceAnim, {  
                    toValue: 0.8,  
                    duration: Duration.micro,  
                    easing: Ease.sharp,  
                    useNativeDriver: true  
                }),  
                // Spring back with overshoot (low friction)  
                Animated.spring(bounceAnim, {  
                    toValue: 1,  
                    friction: 4, // Creates the bounce past 1.0 (e.g., 1.2)  
                    tension: 60,  
                    useNativeDriver: true,  
                })  
            \])  
        );  
    }

    Animated.parallel(animations).start();

  }, \[isChecked, checkAnim, bounceAnim, reduceMotion\]);

  // Checkmark Interpolations  
  const checkOpacity \= checkAnim;  
  const checkScale \= checkAnim.interpolate({  
      inputRange: \[0, 1\],  
      outputRange: \[0.5, 1\],  
  });  
  const checkRotation \= checkAnim.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \['-45deg', '0deg'\],  
  });

  return (  
    \<Pressable onPress={onToggle} style={styles.container}\>  
      \<Animated.View style={\[styles.box, { transform: \[{ scale: bounceAnim }\] }\]}\>  
        \<Animated.View  
          style={{  
            opacity: checkOpacity,  
            transform: \[  
              { scale: checkScale },  
              { rotate: checkRotation },  
            \],  
          }}  
        \>  
          {/\* Replace with actual Icon component if preferred \*/}  
          \<Text style={styles.checkmark}\>✓\</Text\>  
        \</Animated.View\>  
      \</Animated.View\>  
    \</Pressable\>  
  );  
};

const styles \= StyleSheet.create({  
  container: { padding: 5 },  
  box: {  
    width: 24, height: 24,  
    borderWidth: 2, borderColor: '\#000000',  
    backgroundColor: '\#FFFFFF',  
    justifyContent: 'center', alignItems: 'center',  
  },  
  checkmark: { fontSize: 18, color: '\#000000', fontWeight: 'bold' }  
});

6. **Haptic Integration**:  
   * Timing: Optional light haptic when the check action occurs.  
   * Type: `light`.  
7. **Accessibility Variant**:  
   * If `reduceMotion` is true, all animations (bounce, rotation, scale transitions) are skipped. The state updates instantly using `setValue()`.  
8. **Performance Notes**:  
   * Native driver compatibility: Yes. We successfully simulate the desired dynamic effect using only `opacity` and `transform`.  
   * GPU acceleration: Confirmed. The parallel execution of the sequence and the timing animation is efficient.

