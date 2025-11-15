This document provides the precise implementation specifications for the screen transition animations for 16BitFit, utilizing React Navigation v6+. These specifications are designed to achieve smooth 60fps transitions that blend modern fluidity with the app's retro aesthetics, targeting the specified screen dimensions.

JavaScript  
import { Easing, Animated } from 'react-native';  
// Assumes standard imports from React Navigation libraries  
// (e.g., import { createStackNavigator } from '@react-navigation/stack';)

---

### **1\. Slide Transition (Standard Navigation)**

**1\. Transition Name & Use Case**

* **Name:** `SlideWithParallax`  
* **Use Case:** Default push/pop navigation within the main application stack (e.g., Home Screen to Workout Details).

**4\. Timing Configuration**

JavaScript  
const slideTransitionSpec \= {  
  open: {  
    animation: 'timing',  
    config: {  
      duration: 300,  
      easing: Easing.out(Easing.cubic), // easeOut  
    },  
  },  
  close: {  
    animation: 'timing',  
    config: {  
      duration: 300,  
      easing: Easing.in(Easing.cubic), // easeIn  
    },  
  },  
};

**3\. Animation Properties & 6\. Implementation Code (Interpolator)** We use `Animated.add` to combine the progress of the current and next screens. This creates a unified progress value: 0→1 during the Push/Enter animation, and 1→2 during the Pop/Exit animation (when the screen is underneath).

JavaScript  
const slideCardStyleInterpolator \= ({ current, next, layouts }) \=\> {  
    // Combine progress: 0 (Start Enter) \-\> 1 (Onscreen) \-\> 2 (End Exit/Underneath)  
    const progress \= Animated.add(  
      current.progress.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[0, 1\],  
        extrapolate: 'clamp',  
      }),  
      next  
        ? next.progress.interpolate({  
            inputRange: \[0, 1\],  
            outputRange: \[0, 1\],  
            extrapolate: 'clamp',  
          })  
        : 0  
    );

    const screenWidth \= layouts.screen.width;

    // TranslateX: Enter: 100% → 0%. Exit (Parallax): 0% → \-30%.  
    const translateX \= progress.interpolate({  
      inputRange: \[0, 1, 2\],  
      outputRange: \[  
        screenWidth,             // 0: Start (100%)  
        0,                       // 1: Center (Active)  
        screenWidth \* \-0.3,      // 2: End (-30%)  
      \],  
      extrapolate: 'clamp',  
    });

    // Opacity: Enter: 0.9 → 1\. Exit: 1 → 0.7.  
    const opacity \= progress.interpolate({  
        inputRange: \[0, 0.9, 1, 1.5, 2\],  
        outputRange: \[0.9, 1, 1, 0.85, 0.7\],  
        extrapolate: 'clamp',  
    });

    return {  
        cardStyle: {  
            transform: \[{ translateX }\],  
            opacity  
        },  
    };  
};

**2\. React Navigation Configuration & 5\. Gesture Integration**

JavaScript  
export const SlideWithParallaxOptions \= {  
  transitionSpec: slideTransitionSpec,  
  cardStyleInterpolator: slideCardStyleInterpolator,  
  gestureEnabled: true,  
  gestureDirection: 'horizontal',  
  gestureResponseDistance: { horizontal: 50 }, // Sensitivity near the edge for swipe-back  
  gestureVelocityImpact: 0.3,  
};  
// Usage: \<Stack.Navigator screenOptions={SlideWithParallaxOptions}\>

**7\. Performance Optimization**

* **Native Driver:** Confirmed. `translateX` and `opacity` run on the UI thread.  
* **60fps Validation:** Use the React Native Performance Monitor to ensure the JS thread remains unblocked during the transition.

**8\. Accessibility**

* **Reduced Motion:** React Navigation automatically respects the system's "Reduce Motion" setting, defaulting to a faster fade transition if enabled.

---

### **2\. Fade Transition (Content-Focused)**

**1\. Transition Name & Use Case**

* **Name:** `FadeAndScale`  
* **Use Case:** Modal overlays, settings screens, or transitions where spatial context is less critical.

**4\. Timing Configuration**

JavaScript  
const fadeTransitionSpec \= {  
  open: {  
    animation: 'timing',  
    config: {  
      duration: 250,  
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),  
    },  
  },  
  close: {  
    animation: 'timing',  
    config: {  
      duration: 250,  
      easing: Easing.bezier(0.42, 0, 1, 1),  
    },  
  },  
};

**3\. Animation Properties & 6\. Implementation Code (Interpolator)**

JavaScript  
const fadeCardStyleInterpolator \= ({ current }) \=\> {  
  const { progress } \= current;

  // Opacity: 0 → 1  
  const opacity \= progress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[0, 1\],  
    extrapolate: 'clamp',  
  });

  // Subtle scale: 0.98 → 1 (depth effect)  
  const scale \= progress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[0.98, 1\],  
    extrapolate: 'clamp',  
  });

  return {  
    cardStyle: {  
      opacity,  
      transform: \[{ scale }\],  
    },  
  };  
};

**2\. React Navigation Configuration & 5\. Gesture Integration**

JavaScript  
export const FadeAndScaleOptions \= {  
  transitionSpec: fadeTransitionSpec,  
  cardStyleInterpolator: fadeCardStyleInterpolator,  
  gestureEnabled: false,  
};  
// Usage: \<Stack.Screen name="Settings" options={FadeAndScaleOptions} /\>

**7\. Performance Optimization**

* **Native Driver:** Confirmed. Lightweight transition utilizing `opacity` and `scale`.

**8\. Accessibility**

* Respects reduced motion settings, which will minimize or eliminate the scale effect, making it a pure fade.

---

### **3\. Modal Open/Close (Spring Bounce)**

**1\. Transition Name & Use Case**

* **Name:** `BouncyModal`  
* **Use Case:** Attention-grabbing modals (e.g., Achievements, Alerts).

**4\. Timing Configuration**

JavaScript  
const bouncyModalTransitionSpec \= {  
  open: {  
    animation: 'spring',  
    config: {  
      stiffness: 1000,  
      damping: 50, // Low damping allows the spring to overshoot, creating the bounce (0.9 \-\> 1.1 \-\> 1\)  
      mass: 3,  
      overshootClamping: false,  
    },  
  },  
  close: {  
    animation: 'timing',  
    config: {  
      duration: 300,  
      easing: Easing.in(Easing.cubic), // easeIn for closing  
    },  
  },  
};

**3\. Animation Properties & 6\. Implementation Code (Interpolators)**

JavaScript  
const bouncyModalCardStyleInterpolator \= ({ current }) \=\> {  
  const { progress } \= current;

  // translateY: \+50px → 0 (Simultaneous slide up)  
  const translateY \= progress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[50, 0\],  
    extrapolate: 'clamp',  
  });

  // Scale: 0.9 → 1\.  
  const scale \= progress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[0.9, 1\],  
    // Crucial: 'extend' allows the spring animation to drive the progress value \> 1,  
    // resulting in a scale \> 1 for the visual bounce.  
    extrapolate: 'extend',  
  });

  return {  
    cardStyle: {  
      transform: \[{ translateY }, { scale }\],  
    },  
  };  
};

// Handles the backdrop fade  
const bouncyModalOverlayStyleInterpolator \= ({ current }) \=\> {  
    // Backdrop: Opacity 0 → 0.8  
    const opacity \= current.progress.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[0, 0.8\],  
        extrapolate: 'clamp',  
    });

    return {  
        overlayStyle: {  
            opacity,  
            backgroundColor: '\#000000',  
        },  
    };  
};

**2\. React Navigation Configuration & 5\. Gesture Integration**

JavaScript  
export const BouncyModalOptions \= {  
  presentation: 'transparentModal', // Allows custom backdrop and seeing the screen underneath  
  cardOverlayEnabled: true, // Enables the overlayStyleInterpolator  
  transitionSpec: bouncyModalTransitionSpec,  
  cardStyleInterpolator: bouncyModalCardStyleInterpolator,  
  overlayStyleInterpolator: bouncyModalOverlayStyleInterpolator,  
  gestureEnabled: true,  
  gestureDirection: 'vertical',  
  gestureResponseDistance: { vertical: 150 },  
};  
// Usage: \<Stack.Group screenOptions={BouncyModalOptions}\>\<Stack.Screen ... /\>\</Stack.Group\>

**7\. Performance Optimization**

* **Native Driver:** Confirmed. Spring animations run efficiently on the UI thread. Ensure content inside the modal is optimized (e.g., using `FlatList`) as it renders during the animation.

**8\. Accessibility**

* Set `accessibilityViewIsModal` to `true` on the modal root view. The high-motion bounce animation will be automatically disabled under "Reduce Motion" settings.

---

### **4\. Bottom Sheet Slide Up**

**1\. Transition Name & Use Case**

* **Name:** `BottomSheetSlide`  
* **Use Case:** Contextual options, filters, quick actions.

**4\. Timing Configuration**

JavaScript  
const bottomSheetTransitionSpec \= {  
  open: {  
    animation: 'spring',  
    config: {  
      stiffness: 500,  
      damping: 80,  
      mass: 1,  
      overshootClamping: true, // Prevent bounce when hitting the top  
    },  
  },  
  close: {  
    animation: 'timing',  
    config: {  
      duration: 250,  
      easing: Easing.in(Easing.quad), // Sharp easing for exit  
    },  
  },  
};

**3\. Animation Properties & 6\. Implementation Code (Interpolators)** This implementation uses `transparentModal` and styles the screen container to act as a flexible bottom sheet container anchored to the bottom.

JavaScript  
const bottomSheetCardStyleInterpolator \= ({ current, layouts }) \=\> {  
  const { progress } \= current;  
  const screenHeight \= layouts.screen.height;

  // Enter: translateY 100% → 0%  
  const translateY \= progress.interpolate({  
    inputRange: \[0, 1\],  
    outputRange: \[screenHeight, 0\],  
    extrapolate: 'clamp',  
  });

  return {  
    cardStyle: {  
        // Essential styles to make the transparent screen act as a bottom sheet container  
        flex: 1,  
        justifyContent: 'flex-end',  
        backgroundColor: 'transparent', // The actual sheet content provides the background  
        transform: \[{ translateY }\],  
    },  
  };  
};

const bottomSheetOverlayInterpolator \= ({ current }) \=\> {  
    // Backdrop fade  
    const opacity \= current.progress.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[0, 0.6\], // Slightly lighter backdrop  
        extrapolate: 'clamp',  
    });

    return {  
        overlayStyle: {  
            opacity,  
            backgroundColor: '\#000',  
        },  
    };  
};

**2\. React Navigation Configuration & 5\. Gesture Integration**

JavaScript  
export const BottomSheetSlideOptions \= {  
  presentation: 'transparentModal',  
  transitionSpec: bottomSheetTransitionSpec,  
  cardStyleInterpolator: bottomSheetCardStyleInterpolator,  
  overlayStyleInterpolator: bottomSheetOverlayInterpolator,  
  cardOverlayEnabled: true,  
  gestureEnabled: true,  
  gestureDirection: 'vertical',  
  gestureResponseDistance: { vertical: 500 }, // Allow dragging down from high up  
  detachPreviousScreen: false, // Keep the underlying screen mounted  
};

**7\. Performance Optimization**

* **Native Driver:** Confirmed. Highly optimized vertical translation.

**8\. Accessibility**

* Ensure `accessibilityViewIsModal` is set and that accessible close mechanisms (e.g., a close button) are available in addition to the gesture drag.

---

### **5\. Tab Switch Transition**

**1\. Transition Name & Use Case**

* **Name:** `TabCrossFade`  
* **Use Case:** Switching between main sections in a `BottomTabNavigator`.

**2\. React Navigation Configuration, 3\. Animation Properties, 4\. Timing Configuration** React Navigation v6 `BottomTabNavigator` prioritizes performance and native behavior. Implementing custom directional shifts is complex and often sacrifices performance. We will utilize the built-in optimized cross-fade to meet the requirement for a fast (≈150ms) transition.

**6\. Implementation Code**

JavaScript  
export const TabCrossFadeOptions \= {  
    // Enables a fast cross-fade transition (managed internally, often by react-native-screens).  
    // This aligns with the "snappy retro effects" philosophy for frequent interactions.  
    animation: 'fade',  
};

/\*  
// Usage Example in BottomTab.Navigator:  
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';  
const Tab \= createBottomTabNavigator();

const AppTabs \= () \=\> (  
  \<Tab.Navigator screenOptions={TabCrossFadeOptions}\>  
    \<Tab.Screen name="Home" component={HomeScreen} /\>  
    \<Tab.Screen name="Activity" component={ActivityScreen} /\>  
  \</Tab.Navigator\>  
);  
\*/

**5\. Gesture Integration**

* N/A (Bottom tabs are tap-based).

**7\. Performance Optimization**

* The `fade` transition is extremely lightweight. Use the default `lazy: true` configuration for the navigator to defer rendering of off-screen tabs until they are focused.

**8\. Accessibility**

* Ensure clear `accessibilityLabels` on tab items. Screen readers will announce the new screen context upon switching. This fast transition is generally accessible.

