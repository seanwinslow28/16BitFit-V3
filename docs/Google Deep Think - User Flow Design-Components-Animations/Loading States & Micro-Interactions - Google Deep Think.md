This document provides the precise specifications and production-ready React Native implementation details for the loading states and micro-interactions of the 16BitFit application. The goal is to blend retro pixel-art aesthetics with modern, smooth animation curves, prioritizing performance and accessibility.

### **Prerequisites and Utilities**

#### **Color Palette (16BitFit Theme)**

JavaScript  
const Colors \= {  
  PrimaryGreen: '\#8BAC0F',  
  DarkGreen: '\#306230',  
  Yellow: '\#EED02E',  
  Red: '\#D04648',  
  BrightRed: '\#F06668',  
  Gray: '\#555555',  
  DarkBG: '\#0F380F',  
};

#### **Accessibility Hook (`usePrefersReducedMotion`)**

To ensure robust accessibility compliance across different React Native versions, we use a hook based on `AccessibilityInfo` to detect the user's "Reduced Motion" preference.

JavaScript  
import { useState, useEffect } from 'react';  
import { AccessibilityInfo } from 'react-native';

const usePrefersReducedMotion \= () \=\> {  
  const \[prefersReducedMotion, setPrefersReducedMotion\] \= useState(false);

  useEffect(() \=\> {  
    const checkReducedMotion \= async () \=\> {  
        const isEnabled \= await AccessibilityInfo.isReduceMotionEnabled();  
        setPrefersReducedMotion(isEnabled);  
    };

    const subscription \= AccessibilityInfo.addEventListener(  
      'reduceMotionChanged',  
      (isReduceMotionEnabled) \=\> {  
        setPrefersReducedMotion(isReduceMotionEnabled);  
      }  
    );

    checkReducedMotion();

    return () \=\> {  
      if (subscription) {  
          // Use subscription.remove() for newer RN versions, or AccessibilityInfo.removeEventListener for older ones  
          if (typeof subscription.remove \=== 'function') {  
              subscription.remove();  
          }  
      }  
    };  
  }, \[\]);

  return prefersReducedMotion;  
};

---

### **1\. Pixel Spinner (Retro Loading)**

**1\. Context:** Indeterminate loading (data fetching, saving). **2\. Visual Description:** A 32x32px pixelated element rotating in distinct 90-degree jumps (4 frames). **3\. Animation Properties:** Rotation: 0° → 360°. **4\. Timing Configuration:** Duration: 800ms. Easing: `steps(4, end)` simulation. Iterations: Infinity.

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { Animated, Easing, View, StyleSheet } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const PixelSpinner \= ({ isLoading \= true }) \=\> {  
  const spinValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  useEffect(() \=\> {  
    if (prefersReducedMotion || \!isLoading) return;

    const animation \= Animated.loop(  
      Animated.timing(spinValue, {  
        toValue: 1,  
        duration: 800,  
        easing: Easing.linear,  
        useNativeDriver: true, // Performance: GPU accelerated  
      })  
    );

    animation.start();

    // Cleanup on unmount or state change  
    return () \=\> animation.stop();  
  }, \[spinValue, prefersReducedMotion, isLoading\]);

  // 7\. Interpolation: Simulate steps(4, end) using sharp transitions.  
  const spin \= spinValue.interpolate({  
    inputRange:  \[0, 0.2499, 0.25, 0.4999, 0.5, 0.7499, 0.75, 1\],  
    outputRange: \['0deg', '0deg', '90deg', '90deg', '180deg', '180deg', '270deg', '270deg'\],  
  });

  return (  
    \<View  
      accessibilityRole="progressbar"  
      aria-label="Loading"  
      aria-busy={isLoading}  
    \>  
      \<Animated.View  
        style={\[  
          styles.spinner,  
          \!prefersReducedMotion && isLoading && { transform: \[{ rotate: spin }\] },  
        \]}  
      /\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  spinner: {  
    width: 32,  
    height: 32,  
    backgroundColor: Colors.PrimaryGreen,  
    // Example pixelated look  
    borderWidth: 4,  
    borderColor: Colors.DarkGreen,  
  },  
});

---

### **2\. Progress Bar Fill**

**1\. Context:** Determinate loading (uploads, task completion). **2\. Visual Description:** Fill bar transitions color from Yellow (0-50%) to Green (50-100%). Includes a percentage counter. **3\. Animation Properties:** Width: 0% → \[X\]%. Background Color transition. **4\. Timing Configuration:** Duration: 500ms (per update). Easing: `easeOut`.

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';

const ProgressBar \= ({ progress }) \=\> { // progress is 0 to 1  
  const animatedProgress \= useRef(new Animated.Value(0)).current;  
  const clampedProgress \= Math.min(1, Math.max(0, progress));

  useEffect(() \=\> {  
    Animated.timing(animatedProgress, {  
      toValue: clampedProgress,  
      duration: 500,  
      easing: Easing.out(Easing.cubic),  
      useNativeDriver: false, // Performance: Width and backgroundColor require the JS thread  
    }).start();  
  }, \[clampedProgress, animatedProgress\]);

  // 7\. Interpolation: Width  
  const width \= animatedProgress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \['0%', '100%'\],  
  });

  // 7\. Interpolation: Color shift  
  const backgroundColor \= animatedProgress.interpolate({  
    inputRange: \[0, 0.5, 1\],  
    outputRange: \[Colors.Yellow, Colors.Yellow, Colors.PrimaryGreen\],  
  });

  return (  
    \<View  
      style={styles.container}  
      accessibilityRole="progressbar"  
      aria-valuemin={0}  
      aria-valuemax={100}  
      aria-valuenow={Math.round(clampedProgress \* 100)}  
    \>  
      \<Animated.View style={\[styles.fill, { width, backgroundColor }\]} /\>  
      {/\* Percentage counter \*/}  
      \<Text style={styles.text}\>{Math.round(clampedProgress \* 100)}%\</Text\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    width: 250,  
    height: 24,  
    borderColor: Colors.DarkGreen,  
    borderWidth: 3,  
    backgroundColor: Colors.DarkBG,  
    justifyContent: 'center',  
  },  
  fill: {  
    height: '100%',  
    position: 'absolute',  
    left: 0,  
    top: 0,  
  },  
  text: {  
      position: 'absolute',  
      width: '100%',  
      textAlign: 'center',  
      color: 'white',  
      fontSize: 12,  
      // Ensure readability  
      textShadowColor: 'rgba(0, 0, 0, 1)',  
      textShadowOffset: {width: 1, height: 1},  
      textShadowRadius: 1  
  }  
});

---

### **3\. Skeleton Loading Shimmer**

**1\. Context:** Placeholders for loading content. **2\. Visual Description:** Blocks with a gradient shimmer (Dark → Light → Dark: \#306230 → \#8BAC0F → \#306230) moving left-to-right, and an opacity pulse. **3\. Animation Properties:** Gradient `translateX`: \-100% → 100%. Opacity pulse: \[0.5, 1, 0.5\]. **4\. Timing Configuration:** Duration: 1500ms. Easing: Linear (Shimmer), easeInOut (Pulse).

**5\. React Native Implementation:** *Requires `react-native-linear-gradient` or `expo-linear-gradient`.*

JavaScript  
import React, { useEffect, useRef, useState } from 'react';  
import { View, StyleSheet, Animated, Easing } from 'react-native';  
// import LinearGradient from 'react-native-linear-gradient';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

// Mock LinearGradient if the library is not available  
const LinearGradient \= (props) \=\> \<View {...props} style={\[props.style, { backgroundColor: Colors.PrimaryGreen }\]}/\>;

const SkeletonShimmer \= ({ width \= '100%', height \= 20 }) \=\> {  
  const animValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();  
  // State Management: Track actual width for accurate translation  
  const \[layoutWidth, setLayoutWidth\] \= useState(0);

  useEffect(() \=\> {  
    if (prefersReducedMotion || layoutWidth \=== 0\) return;

    const animation \= Animated.loop(  
      Animated.timing(animValue, {  
        toValue: 1,  
        duration: 1500,  
        easing: Easing.linear,  
        useNativeDriver: true, // Performance: GPU accelerated  
      })  
    );  
    animation.start();  
    return () \=\> animation.stop();  
  }, \[animValue, prefersReducedMotion, layoutWidth\]);

  // Handle dynamic widths (e.g., percentages)  
  const handleLayout \= (event) \=\> {  
    setLayoutWidth(event.nativeEvent.layout.width);  
  };

  // 7\. Interpolation: TranslateX for the gradient overlay  
  const translateX \= animValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[-layoutWidth, layoutWidth\],  
  });

  // 7\. Interpolation: Opacity pulse: \[0.5, 1, 0.5\]  
  const opacity \= animValue.interpolate({  
    inputRange: \[0, 0.5, 1\],  
    outputRange: \[0.5, 1, 0.5\],  
    easing: Easing.inOut(Easing.quad),  
  });

  return (  
    \<View  
      onLayout={handleLayout}  
      style={\[styles.container, { width, height }\]}  
      aria-busy={true}  
      aria-label="Loading content"  
    \>  
      {(\!prefersReducedMotion && layoutWidth \> 0\) && (  
        \<Animated.View style={\[StyleSheet.absoluteFill, { opacity }\]}\>  
             \<Animated.View style={\[StyleSheet.absoluteFill, { transform: \[{ translateX }\] }\]}\>  
                \<LinearGradient  
                    colors={\[Colors.DarkGreen, Colors.PrimaryGreen, Colors.DarkGreen\]}  
                    start={{ x: 0, y: 0.5 }}  
                    end={{ x: 1, y: 0.5 }}  
                    style={StyleSheet.absoluteFill}  
                /\>  
            \</Animated.View\>  
        \</Animated.View\>  
      )}  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    backgroundColor: Colors.DarkGreen, // Base color  
    overflow: 'hidden',  
  },  
});

---

### **4\. Pull-to-Refresh Indicator**

**1\. Context:** Reacts to user pulling a list down. **2\. Visual Description:** Icon rotates based on pull distance, bursts at the threshold, and transitions to the Pixel Spinner. **3\. Animation Properties:** Rotation (linear interpolation of distance), Scale (burst).

**5\. React Native Implementation (Conceptual):** *This implementation focuses on the visualization, assuming inputs from a parent `ScrollView` handler.*

JavaScript  
import React from 'react';  
import { StyleSheet, Animated, View, Text } from 'react-native';  
// import PixelSpinner from './PixelSpinner';

const REFRESH\_THRESHOLD \= 100;

// scrollY: Animated.Value linked to ScrollView (e.g., negative values when pulling down)  
// refreshState: 'PULLING', 'THRESHOLD', 'LOADING'  
const PullToRefreshIndicator \= ({ scrollY, refreshState }) \=\> {

  // 7\. Interpolation: Rotation mapped linearly to pull distance  
  const rotation \= scrollY.interpolate({  
    inputRange: \[-REFRESH\_THRESHOLD, 0\],  
    outputRange: \['180deg', '0deg'\],  
    extrapolate: 'clamp', // Prevent over-rotation  
  });

  // 7\. Interpolation: Scale burst near threshold  
  const scale \= scrollY.interpolate({  
      inputRange: \[-REFRESH\_THRESHOLD \- 10, \-REFRESH\_THRESHOLD, \-REFRESH\_THRESHOLD \+ 20, 0\],  
      outputRange: \[1.2, 1.1, 1, 1\],  
      extrapolate: 'clamp',  
  });

  // Haptics should be triggered in the parent component when state changes to 'THRESHOLD'.

  return (  
    \<View style={styles.container}\>  
      \<View style={styles.iconContainer}\>  
        {refreshState \=== 'LOADING' ? (  
            // \<PixelSpinner isLoading={true} /\>  
            \<Text style={styles.icon}\>⏳\</Text\>  
        ) : (  
            \<Animated.View style={{ transform: \[{ rotate: rotation }, { scale: scale }\] }}\>  
                \<Text style={styles.icon}\>⬇️\</Text\>  
            \</Animated.View\>  
        )}  
      \</View\>  
      \<Text style={styles.text}\>  
        {refreshState \=== 'LOADING' ? 'Refreshing...' :  
         refreshState \=== 'THRESHOLD' ? 'Release to Refresh' : 'Pull down'}  
      \</Text\>  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    height: 60,  
    justifyContent: 'center',  
    alignItems: 'center',  
  },  
  iconContainer: {  
      height: 32,  
      width: 32,  
      justifyContent: 'center',  
      alignItems: 'center',  
  },  
  icon: {  
      fontSize: 24,  
  },  
  text: {  
      color: Colors.PrimaryGreen,  
      marginTop: 4,  
      fontSize: 12,  
  }  
});

---

### **5\. Icon Bounce (Attention Grabber)**

**1\. Context:** New notification badge, feature callout. **2\. Visual Description:** Vertical bounce with a slight scale pulse. **3\. Animation Properties:** TranslateY: \[0, \-8, 0, \-4, 0\]. Scale: \[1, 1.1, 1\]. **4\. Timing Configuration:** Duration: 500ms.

**5\. React Native Implementation:**

JavaScript  
import React, { useRef, useCallback } from 'react';  
import { Animated, TouchableOpacity, Easing } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const IconBounce \= ({ children, onPress }) \=\> {  
  const animValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  const triggerBounce \= useCallback(() \=\> {  
    if (onPress) onPress();

    if (prefersReducedMotion) return;

    animValue.setValue(0);  
    Animated.timing(animValue, {  
      toValue: 1,  
      duration: 500,  
      easing: Easing.linear, // Easing is handled by the keyframes in interpolation  
      useNativeDriver: true, // Performance: GPU accelerated  
    }).start();  
  }, \[animValue, prefersReducedMotion, onPress\]);

  // 7\. Interpolation: TranslateY path: \[0, \-8, 0, \-4, 0\]  
  const translateY \= animValue.interpolate({  
    inputRange: \[0, 0.25, 0.5, 0.75, 1\], // Keyframe timings  
    outputRange: \[0, \-8, 0, \-4, 0\],    // Keyframe positions  
  });

  // 7\. Interpolation: Scale path: \[1, 1.1, 1\]  
  const scale \= animValue.interpolate({  
      inputRange: \[0, 0.3, 1\],  
      outputRange: \[1, 1.1, 1\],  
  });

  return (  
    \<TouchableOpacity onPress={triggerBounce} activeOpacity={0.8}\>  
        \<Animated.View style={{ transform: \[{ translateY }, { scale }\] }}\>  
            {children}  
        \</Animated.View\>  
    \</TouchableOpacity\>  
  );  
};

---

### **6\. Notification Badge Pulse**

**1\. Context:** Persistent indicator for unread items. **2\. Visual Description:** Badge scales up and flashes brighter, repeating after a delay. **3\. Animation Properties:** Scale: \[1, 1.2, 1\]. Color: Red → Brighter Red → Red. **4\. Timing Configuration:** Duration: 1000ms (Pulse). Delay: 2000ms (Pause). Easing: `easeInOut`. Iterations: Infinite.

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { StyleSheet, Animated, Easing } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const NotificationBadgePulse \= () \=\> {  
  const pulseValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  useEffect(() \=\> {  
    if (prefersReducedMotion) return;

    // Loop( Sequence( Pulse \-\> Delay \-\> Reset ) )  
    const animation \= Animated.loop(  
      Animated.sequence(\[  
        // Pulse Animation (1000ms)  
        Animated.timing(pulseValue, {  
          toValue: 1,  
          duration: 1000,  
          easing: Easing.inOut(Easing.quad),  
          useNativeDriver: false, // Performance: Needs false for background color animation  
        }),  
        // Delay (2000ms)  
        Animated.delay(2000),  
        // Reset value instantly  
        Animated.timing(pulseValue, {  
            toValue: 0,  
            duration: 0,  
            useNativeDriver: false,  
        }),  
      \])  
    );

    animation.start();  
    return () \=\> animation.stop();  
  }, \[pulseValue, prefersReducedMotion\]);

  // 7\. Interpolation: Scale: \[1, 1.2, 1\]  
  const scale \= pulseValue.interpolate({  
    inputRange: \[0, 0.5, 1\],  
    outputRange: \[1, 1.2, 1\],  
  });

  // 7\. Interpolation: Color: Red \-\> Brighter Red \-\> Red  
  const backgroundColor \= pulseValue.interpolate({  
    inputRange: \[0, 0.5, 1\],  
    outputRange: \[Colors.Red, Colors.BrightRed, Colors.Red\],  
  });

  const animatedStyle \= prefersReducedMotion  
    ? { backgroundColor: Colors.Red }  
    : { transform: \[{ scale }\], backgroundColor };

  return (  
    \<Animated.View  
      style={\[styles.badge, animatedStyle\]}  
      aria-label="New notifications"  
    /\>  
  );  
};

const styles \= StyleSheet.create({  
  badge: {  
    width: 14,  
    height: 14,  
    borderRadius: 7,  
  },  
});

---

### **7\. Like/Heart Animation**

**1\. Context:** Immediate feedback for a "like" action. **2\. Visual Description:** Heart icon bursts in scale (springy) and changes color from gray to red. **3\. Animation Properties:** Scale burst (spring). Color change: Gray → Red. **4\. Timing Configuration:** Duration: \~300ms (Spring).

**5\. React Native Implementation:**

JavaScript  
import React, { useState, useRef } from 'react';  
import { StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const LikeHeartAnimation \= () \=\> {  
  const \[isLiked, setIsLiked\] \= useState(false);  
  const scaleValue \= useRef(new Animated.Value(1)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  const handlePress \= () \=\> {  
    const newLikedState \= \!isLiked;  
    setIsLiked(newLikedState);

    if (newLikedState && \!prefersReducedMotion) {  
      // Start small (0.1) and spring to 1 for a dramatic burst effect  
      scaleValue.setValue(0.1);  
      Animated.spring(scaleValue, {  
        toValue: 1,  
        friction: 3, // Controls the bounciness (low friction causes overshoot, achieving the 1.3/1.1 burst)  
        tension: 100, // Controls the speed  
        useNativeDriver: true, // Performance: GPU accelerated (scale only)  
      }).start();  
    }  
  };

  // Optimization: Color change is instant based on state, allowing scale animation to use native driver  
  const color \= isLiked ? Colors.Red : Colors.Gray;

  return (  
    \<TouchableOpacity  
        onPress={handlePress}  
        activeOpacity={0.7}  
        aria-pressed={isLiked}  
        accessibilityRole="button"  
        accessibilityLabel={isLiked ? "Unlike" : "Like"}  
    \>  
      \<Animated.Text style={\[styles.heart, { color, transform: \[{ scale: scaleValue }\] }\]}\>  
        {/\* Use a suitable icon font or SVG here \*/}  
        ❤️  
      \</Animated.Text\>  
    \</TouchableOpacity\>  
  );  
};

const styles \= StyleSheet.create({  
  heart: {  
    fontSize: 32,  
  },  
});

---

### **8\. Toast Notification Slide-In**

**1\. Context:** Auto-hiding system messages. **2\. Visual Description:** Slides down from the top with a bounce, stays, then slides back up. **3\. Animation Properties:** Enter: `translateY` \-100px → 0, Opacity 0 → 1\. Exit: `translateY` 0 → \-100px. **4\. Timing Configuration:** Enter: Spring. Visible: 3000ms. Exit: 200ms (easeIn).

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { StyleSheet, Animated, Text, Easing, SafeAreaView } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const ToastNotification \= ({ message, isVisible, onHide }) \=\> {  
  const animValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  useEffect(() \=\> {  
    if (\!isVisible) return;

    if (prefersReducedMotion) {  
        // Accessibility: Instant appearance for reduced motion  
        animValue.setValue(1);  
        const timer \= setTimeout(onHide, 3000);  
        return () \=\> clearTimeout(timer);  
    }

    // State Management: Sequence: Enter \-\> Delay \-\> Exit  
    const sequence \= Animated.sequence(\[  
        // Enter (Spring bounce)  
        Animated.spring(animValue, {  
            toValue: 1,  
            friction: 6,  
            tension: 50,  
            useNativeDriver: true,  
        }),  
        // Delay (3000ms)  
        Animated.delay(3000),  
        // Exit (EaseIn)  
        Animated.timing(animValue, {  
            toValue: 0,  
            duration: 200,  
            easing: Easing.in(Easing.cubic),  
            useNativeDriver: true,  
        })  
    \]);

    sequence.start(() \=\> {  
        // Callback after the entire sequence finishes  
        if (onHide) onHide();  
    });

    // Cleanup if component unmounts mid-sequence  
    return () \=\> sequence.stop();

  }, \[animValue, isVisible, onHide, prefersReducedMotion\]);

  // 7\. Interpolation: Slide down from the top  
  const translateY \= animValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[-100, 0\],  
  });

  const opacity \= animValue;

  return (  
    // Use SafeAreaView to respect status bars/notches when positioned absolutely  
    \<SafeAreaView style={styles.wrapper}\>  
        \<Animated.View  
            style={\[styles.toast, { transform: \[{ translateY }\], opacity }\]}  
            aria-live="assertive"  
        \>  
        \<Text style={styles.text}\>{message}\</Text\>  
        \</Animated.View\>  
    \</SafeAreaView\>  
  );  
};

const styles \= StyleSheet.create({  
  wrapper: {  
    position: 'absolute',  
    top: 0,  
    left: 0,  
    right: 0,  
    zIndex: 1000,  
  },  
  toast: {  
    margin: 10,  
    padding: 15,  
    backgroundColor: Colors.DarkGreen,  
    borderColor: Colors.PrimaryGreen,  
    borderWidth: 3,  
    alignItems: 'center',  
  },  
  text: {  
    color: Colors.PrimaryGreen,  
    fontSize: 14,  
  },  
});

---

### **9\. Typing Indicator (Chat/AI Response)**

**1\. Context:** Shows activity in chat interfaces. **2\. Visual Description:** Three dots bouncing vertically in a staggered sequence. **3\. Animation Properties:** `translateY`: \[0, \-4, 0\] per dot. **4\. Timing Configuration:** Stagger: 150ms. Iterations: Infinite.

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { StyleSheet, Animated, View, Easing, Text } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const TypingIndicator \= () \=\> {  
  // Initialize animated values for the three dots  
  const dots \= useRef(\[new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)\]).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  useEffect(() \=\> {  
    if (prefersReducedMotion) return;

    // Define the up/down animation for a single dot  
    const createAnimation \= (value) \=\> Animated.sequence(\[  
        // Bounce Up  
        Animated.timing(value, {  
            toValue: 1,  
            duration: 300,  
            easing: Easing.out(Easing.cubic),  
            useNativeDriver: true,  
        }),  
        // Bounce Down  
        Animated.timing(value, {  
            toValue: 0,  
            duration: 300,  
            easing: Easing.in(Easing.cubic),  
            useNativeDriver: true,  
        }),  
    \]);

    // State Management: Loop( Stagger( Animations ) )  
    const animation \= Animated.loop(  
      Animated.stagger(150, dots.map(createAnimation))  
    );

    animation.start();  
    return () \=\> animation.stop();  
  }, \[dots, prefersReducedMotion\]);

  // 9\. Accessibility: Static text if reduced motion is active  
  if (prefersReducedMotion) {  
      return \<Text style={styles.staticText}\>Typing...\</Text\>  
  }

  return (  
    \<View style={styles.container} aria-label="User is typing" aria-live="polite"\>  
        {dots.map((dot, index) \=\> {  
            // 7\. Interpolation: Vertical movement  
            const translateY \= dot.interpolate({  
                inputRange: \[0, 1\],  
                outputRange: \[0, \-4\],  
            });  
            return (  
                \<Animated.View  
                    key={index}  
                    style={\[styles.dot, { transform: \[{ translateY }\] }\]}  
                /\>  
            );  
        })}  
    \</View\>  
  );  
};

const styles \= StyleSheet.create({  
  container: {  
    flexDirection: 'row',  
    alignItems: 'center',  
    height: 20,  
    paddingLeft: 10,  
  },  
  dot: {  
    width: 8,  
    height: 8,  
    borderRadius: 4,  
    backgroundColor: Colors.PrimaryGreen,  
    marginHorizontal: 3,  
  },  
  staticText: {  
      color: Colors.Gray,  
      fontStyle: 'italic',  
      paddingLeft: 10,  
  }  
});

---

### **10\. Data Sync Spinner (Background Process)**

**1\. Context:** Indicates ongoing background synchronization. **2\. Visual Description:** Sync icon rotating smoothly with a simultaneous opacity pulse. Switches to checkmark on completion. **3\. Animation Properties:** Rotation (0° → 360°). Opacity pulse (\[0.5, 1\]). **4\. Timing Configuration:** Rotation: 1200ms (easeInOut). Opacity: 800ms. Iterations: Infinite.

**5\. React Native Implementation:**

JavaScript  
import React, { useEffect, useRef } from 'react';  
import { StyleSheet, Animated, Easing, Text, View } from 'react-native';  
// import usePrefersReducedMotion from './usePrefersReducedMotion';

const DataSyncSpinner \= ({ isSyncing \= true }) \=\> {  
  const rotationValue \= useRef(new Animated.Value(0)).current;  
  const opacityValue \= useRef(new Animated.Value(0)).current;  
  const prefersReducedMotion \= usePrefersReducedMotion();

  useEffect(() \=\> {  
    if (prefersReducedMotion || \!isSyncing) {  
        // Stop and reset if syncing stops or motion is reduced  
        rotationValue.stopAnimation();  
        opacityValue.stopAnimation();  
        return;  
    }

    // Rotation Loop (1200ms easeInOut)  
    const rotationAnim \= Animated.loop(  
      Animated.timing(rotationValue, {  
        toValue: 1,  
        duration: 1200,  
        easing: Easing.inOut(Easing.quad),  
        useNativeDriver: true,  
      })  
    );

    // Opacity Loop (800ms)  
    const opacityAnim \= Animated.loop(  
        Animated.timing(opacityValue, {  
            toValue: 1,  
            duration: 800,  
            easing: Easing.linear,  
            useNativeDriver: true,  
        })  
    );

    // Run parallel animations  
    rotationAnim.start();  
    opacityAnim.start();

    return () \=\> {  
      rotationAnim.stop();  
      opacityAnim.stop();  
    };  
  }, \[rotationValue, opacityValue, prefersReducedMotion, isSyncing\]);

  // 7\. Interpolation: Rotation  
  const rotate \= rotationValue.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \['0deg', '360deg'\],  
  });

  // 7\. Interpolation: Opacity \[0.5 \-\> 1 \-\> 0.5\]  
  const opacity \= opacityValue.interpolate({  
      inputRange: \[0, 0.5, 1\],  
      outputRange: \[0.5, 1, 0.5\],  
  });

  const animatedStyle \= (prefersReducedMotion || \!isSyncing) ? { opacity: 1 } : { opacity, transform: \[{ rotate }\] };

  // Optional: Checkmark morph when sync completes  
  const icon \= isSyncing ? '🔄' : '✅';  
  const label \= isSyncing ? "Syncing data" : "Sync complete";

  return (  
    \<Animated.View  
        style={animatedStyle}  
        aria-label={label}  
        aria-busy={isSyncing}  
    \>  
        \<Text style={styles.icon}\>{icon}\</Text\>  
    \</Animated.View\>  
  );  
};

const styles \= StyleSheet.create({  
    icon: {  
        fontSize: 24,  
        color: Colors.PrimaryGreen,  
    }  
});  
