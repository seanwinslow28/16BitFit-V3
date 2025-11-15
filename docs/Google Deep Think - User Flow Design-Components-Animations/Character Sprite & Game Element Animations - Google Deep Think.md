This document outlines the specifications and React Native implementation details for 8-bit/16-bit Game Boy-style sprite animations and game-like elements for 16BitFit. The implementation focuses on achieving a retro aesthetic (step easing) while maintaining high performance by utilizing the React Native `Animated` API with `useNativeDriver: true`.

### **Core Implementation: `useAnimatedSprite` Hook**

To manage frame timing, interpolation, and accessibility, we will use a reusable custom hook. This hook uses the "transform-based frame positioning" technique (Option C), where a large sprite sheet is shifted within a masked view.

TypeScript  
import { useCallback, useRef, useEffect, useState } from 'react';  
import { Animated, Easing, AccessibilityInfo, StyleSheet } from 'react-native';

interface UseAnimatedSpriteProps {  
  frameCount: number;  
  duration: number; // Total duration of one cycle in ms  
}

const useAnimatedSprite \= ({ frameCount, duration }: UseAnimatedSpriteProps) \=\> {  
  const animationValue \= useRef(new Animated.Value(0)).current;  
  const \[reduceMotion, setReduceMotion\] \= useState(false);

  // Custom easing function to simulate CSS steps(N, end)  
  // This ensures the animation holds on each frame and steps precisely.  
  const stepEasing \= useCallback((t: number) \=\> {  
    // Ensure that the very end (t=1) maps correctly to the last frame segment  
    if (t \>= 1\) return 1;  
    return Math.floor(t \* frameCount) / frameCount;  
  }, \[frameCount\]);

  // Accessibility Check for Reduced Motion  
  useEffect(() \=\> {  
    const checkReduceMotion \= async () \=\> {  
        const enabled \= await AccessibilityInfo.isReduceMotionEnabled();  
        setReduceMotion(enabled);  
    };  
    checkReduceMotion();

    const subscription \= AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) \=\> {  
      setReduceMotion(enabled);  
      if (enabled) {  
        // Stop and reset animation if reduced motion is enabled mid-animation  
        stopAnimation();  
        resetAnimation();  
      }  
    });

    return () \=\> subscription.remove();  
  }, \[\]);

  const createAnimation \= useCallback(() \=\> {  
    return Animated.timing(animationValue, {  
      toValue: 1,  
      duration: duration,  
      easing: stepEasing,  
      useNativeDriver: true, // Essential for performance  
    });  
  }, \[animationValue, duration, stepEasing\]);

  const startLoop \= useCallback(() \=\> {  
    if (reduceMotion) return;  
    // Ensure the animation value is reset before looping  
    animationValue.setValue(0);  
    Animated.loop(createAnimation()).start();  
  }, \[createAnimation, reduceMotion, animationValue\]);

  const startOneShot \= useCallback((onComplete?: () \=\> void) \=\> {  
    if (reduceMotion) {  
        // If reduced motion is enabled, skip animation and call completion handler immediately  
        if (onComplete) onComplete();  
        return;  
    }  
    animationValue.setValue(0);  
    createAnimation().start(({ finished }) \=\> {  
      if (finished && onComplete) {  
        onComplete();  
      }  
    });  
  }, \[animationValue, createAnimation, reduceMotion\]);

  const stopAnimation \= useCallback(() \=\> {  
    animationValue.stopAnimation();  
  }, \[animationValue\]);

  const resetAnimation \= useCallback(() \=\> {  
    animationValue.setValue(0);  
  }, \[animationValue\]);

  // Interpolate the animation value (0-1) to the frame index (0 to frameCount).  
  // The output range goes up to frameCount (exclusive of the final frame boundary)  
  const frameIndex \= animationValue.interpolate({  
    inputRange: \[0, 1\],  
    // The output range maps 0-1 to the start index of each frame (0, 1, 2, ..., frameCount-1)  
    // However, due to how Animated.multiply works with the interpolated value,  
    // we interpolate up to frameCount and rely on the stepEasing to clamp the values.  
    outputRange: \[0, frameCount\],  
    extrapolate: 'clamp',  
  });

  return { frameIndex, startLoop, startOneShot, stopAnimation, resetAnimation, reduceMotion };  
};

// Helper function to generate standardized styles  
const getSpriteStyles \= (frameWidth: number, frameHeight: number, frameCount: number, layout: 'horizontal' | 'vertical' \= 'horizontal') \=\> StyleSheet.create({  
    spriteWrapper: {  
      width: frameWidth,  
      height: frameHeight,  
      overflow: 'hidden', // Masks the rest of the sprite sheet  
    },  
    spriteSheet: {  
      width: layout \=== 'horizontal' ? frameWidth \* frameCount : frameWidth,  
      height: layout \=== 'vertical' ? frameHeight \* frameCount : frameHeight,  
      position: 'absolute',  
    },  
});

---

### **1\. Character Idle Animation**

**1\. Animation Name & Game Context:** `CharacterIdle`. Default state, subtle bobbing/breathing.

**2\. Sprite Sheet Specifications:**

* Frames: 4  
* Dimensions: 32x32 pixels  
* Layout: Horizontal (128x32 total)  
* File: `character_idle.png`

**3\. Frame-by-Frame Breakdown:**

* F1: Neutral. F2: Bob down/Breathe in. F3: Neutral. F4: Slight rise/Breathe out.

**4\. Animation Timing:**

* Duration: 800ms (200ms/frame).  
* Easing: steps(4).  
* Loop: Infinite.

**5\. React Native Implementation Options:**

* **Option C (Recommended):** Transform-based frame positioning using `useAnimatedSprite`.

**6\. Code Example:**

TypeScript  
// import React, { useEffect } from 'react';  
// import { View, Animated } from 'react-native';  
// import useAnimatedSprite, { getSpriteStyles } from './useAnimatedSprite';

const FRAME\_WIDTH \= 32;  
const FRAME\_HEIGHT \= 32;  
const FRAME\_COUNT \= 4;  
const DURATION \= 800;  
// const SPRITE\_SHEET \= require('../assets/character\_idle.png');

const CharacterIdle \= () \=\> {  
  const { frameIndex, startLoop, reduceMotion } \= useAnimatedSprite({ frameCount: FRAME\_COUNT, duration: DURATION });

  useEffect(() \=\> {  
    startLoop();  
  }, \[startLoop\]);

  // Calculate the horizontal shift. Animated.multiply ensures this calculation runs entirely on the native thread.  
  // If reduceMotion is active, the hook stops the animation and frameIndex remains 0\.  
  const translateX \= Animated.multiply(frameIndex, \-FRAME\_WIDTH);

  const styles \= getSpriteStyles(FRAME\_WIDTH, FRAME\_HEIGHT, FRAME\_COUNT);

  return (  
    \<View style={styles.spriteWrapper}\>  
      \<Animated.Image  
        // source={SPRITE\_SHEET}  
        style={\[  
          styles.spriteSheet,  
          // If reduceMotion is true, we ensure translateX is 0 (though the hook should handle this)  
          { transform: \[{ translateX: reduceMotion ? 0 : translateX }\] }  
        \]}  
        resizeMode="contain"  
      /\>  
    \</View\>  
  );  
};

**7-10. Triggering, Effects, Performance, Accessibility:**

* Triggering: Starts automatically on mount.  
* Performance: Excellent; utilizes `useNativeDriver: true`. Sprite sheets should be preloaded.  
* Accessibility: Handled by the hook; animation stops and shows Frame 1 (Neutral) if "Reduce Motion" is enabled.

---

### **2\. Character Walk Cycle**

**1\. Animation Name & Game Context:** `CharacterWalk`. Triggered when the user is actively moving or logging steps.

**2\. Sprite Sheet Specifications:**

* Frames: 4  
* Dimensions: 32x32 pixels  
* Layout: Horizontal (128x32 total)

**3\. Frame-by-Frame Breakdown:**

* F1: Contact (L). F2: Passing. F3: Contact (R). F4: Passing.

**4\. Animation Timing:**

* Duration: 600ms (150ms/frame).  
* Easing: steps(4).  
* Loop: Infinite (while walking).

**6\. Code Example:**

TypeScript  
// ... imports ...

// Constants for CharacterWalk  
const FRAME\_WIDTH\_WALK \= 32;  
const FRAME\_HEIGHT\_WALK \= 32;  
const FRAME\_COUNT\_WALK \= 4;  
const DURATION\_WALK \= 600;  
// const SPRITE\_SHEET\_WALK \= require('../assets/character\_walk.png');

interface CharacterWalkProps {  
  isWalking: boolean;  
  direction: 'left' | 'right';  
}

const CharacterWalk: React.FC\<CharacterWalkProps\> \= ({ isWalking, direction }) \=\> {  
  const { frameIndex, startLoop, stopAnimation, resetAnimation, reduceMotion } \= useAnimatedSprite({ frameCount: FRAME\_COUNT\_WALK, duration: DURATION\_WALK });

  useEffect(() \=\> {  
    if (isWalking) {  
      startLoop();  
    } else {  
      stopAnimation();  
      resetAnimation(); // Reset to Frame 1 (Contact) when stopped  
    }  
  }, \[isWalking, startLoop, stopAnimation, resetAnimation\]);

  const translateX \= Animated.multiply(frameIndex, \-FRAME\_WIDTH\_WALK);  
  // Flip sprite horizontally: \-1 for left, 1 for right  
  const scaleX \= direction \=== 'left' ? \-1 : 1;

  const styles \= getSpriteStyles(FRAME\_WIDTH\_WALK, FRAME\_HEIGHT\_WALK, FRAME\_COUNT\_WALK);

  return (  
    // Apply scaleX to the wrapper for efficient direction flipping  
    \<View style={\[styles.spriteWrapper, { transform: \[{ scaleX }\] }\]}\>  
      \<Animated.Image  
        // source={SPRITE\_SHEET\_WALK}  
        style={\[  
          styles.spriteSheet,  
          { transform: \[{ translateX: reduceMotion ? 0 : translateX }\] }  
        \]}  
        resizeMode="contain"  
      /\>  
    \</View\>  
  );  
};

**7-10. Triggering, Effects, Performance, Accessibility:**

* Triggering: Controlled by the `isWalking` prop.  
* Effects: Audio hooks for footsteps can be added using `addListener` on F1 and F3 if needed.  
* Performance: `scaleX` is used for efficient direction changes without requiring duplicate assets.

---

### **3\. Character Jump/Celebration**

**1\. Animation Name & Game Context:** `CharacterJump`. One-shot animation for achievements or level-up.

**2\. Sprite Sheet Specifications:**

* Frames: 6  
* Dimensions: 32x40 pixels (Taller)  
* Layout: Horizontal (192x40 total)

**3\. Frame-by-Frame Breakdown:**

* F1: Crouch. F2: Launch. F3: Peak (Ascent). F4: Peak (Celebration). F5: Descent. F6: Land.

**4\. Animation Timing:**

* Duration: 900ms (150ms/frame).  
* Easing: steps(6).  
* Loop: One-shot.

**6\. Code Example:**

TypeScript  
// import React, { useCallback, useEffect } from 'react';  
// import { View, Animated } from 'react-native';  
// import Haptics from 'react-native-haptic-feedback'; // Example Haptics library

const FRAME\_WIDTH\_JUMP \= 32;  
const FRAME\_HEIGHT\_JUMP \= 40;  
const FRAME\_COUNT\_JUMP \= 6;  
const DURATION\_JUMP \= 900;  
// const SPRITE\_SHEET\_JUMP \= require('../assets/character\_jump.png');

// Triggered by the parent component via props or context  
const CharacterJump \= ({ trigger, onComplete }: { trigger: boolean, onComplete: () \=\> void }) \=\> {  
  const { frameIndex, startOneShot, reduceMotion } \= useAnimatedSprite({ frameCount: FRAME\_COUNT\_JUMP, duration: DURATION\_JUMP });  
  const effectsTriggered \= useRef({ launch: false, land: false });

  const handleJump \= useCallback(() \=\> {  
      effectsTriggered.current \= { launch: false, land: false }; // Reset effects trigger  
      startOneShot(onComplete);  
  }, \[startOneShot, onComplete\]);

  useEffect(() \=\> {  
      if (trigger) {  
          handleJump();  
      }  
  }, \[trigger, handleJump\]);

  // Synchronize effects using addListener for frame-accurate precision  
  useEffect(() \=\> {  
    if (reduceMotion) return;

    const listenerId \= frameIndex.addListener(({ value }) \=\> {  
        const currentFrameIndex \= Math.floor(value);

        if (currentFrameIndex \=== 1 && \!effectsTriggered.current.launch) { // F2: Launch  
            // Audio hook: "Whoosh"  
            // Haptics.trigger('impactLight');  
            effectsTriggered.current.launch \= true;  
        } else if (currentFrameIndex \=== 5 && \!effectsTriggered.current.land) { // F6: Land  
            // Audio hook: "Thud"  
            // Haptics.trigger('impactMedium');  
            effectsTriggered.current.land \= true;  
        }  
    });  
    return () \=\> frameIndex.removeListener(listenerId);  
  }, \[frameIndex, reduceMotion\]);

  const translateX \= Animated.multiply(frameIndex, \-FRAME\_WIDTH\_JUMP);  
  const styles \= getSpriteStyles(FRAME\_WIDTH\_JUMP, FRAME\_HEIGHT\_JUMP, FRAME\_COUNT\_JUMP);

  return (  
    \<View style={styles.spriteWrapper}\>  
      \<Animated.Image  
          // source={SPRITE\_SHEET\_JUMP}  
          style={\[  
            styles.spriteSheet,  
            { transform: \[{ translateX: reduceMotion ? 0 : translateX }\] }  
          \]}  
          resizeMode="contain"  
        /\>  
    \</View\>  
  );  
};

**7-10. Triggering, Effects, Performance, Accessibility:**

* Triggering: Via the `trigger` prop.  
* Effects: Haptics and SFX synchronized precisely using `Animated.addListener`.  
* Accessibility: Animation is skipped if reduced motion is enabled; `onComplete` is called immediately by the hook.

---

### **4\. Boss Character Appearance**

**1\. Animation Name & Game Context:** `BossEntrance`. Dramatic entrance with simultaneous camera shake.

**2\. Sprite Sheet Specifications:**

* Frames: 8  
* Dimensions: 64x64 pixels  
* Layout: Horizontal (512x64 total)

**3\. Frame-by-Frame Breakdown:**

* F1-3: Shadow/Silhouette forms. F4-6: Partial reveal/Materialization. F7: Full Reveal (Impact). F8: Settle.

**4\. Animation Timing:**

* Duration: 1200ms (150ms/frame).  
* Easing: steps(8).  
* Loop: One-shot.

**6\. Code Example (Sprite \+ Camera Shake):**

TypeScript  
// import React, { useEffect, useRef } from 'react';  
// import { View, Animated, Easing } from 'react-native';

const FRAME\_WIDTH\_BOSS \= 64;  
const FRAME\_HEIGHT\_BOSS \= 64;  
const FRAME\_COUNT\_BOSS \= 8;  
const DURATION\_BOSS \= 1200;  
// const SPRITE\_SHEET\_BOSS \= require('../assets/boss\_entrance.png');

const BossAppearance \= ({ trigger, onComplete }: { trigger: boolean, onComplete: () \=\> void }) \=\> {  
  const { frameIndex, startOneShot, reduceMotion } \= useAnimatedSprite({ frameCount: FRAME\_COUNT\_BOSS, duration: DURATION\_BOSS });  
  const cameraShakeValue \= useRef(new Animated.Value(0)).current;

  useEffect(() \=\> {  
    if (trigger) {  
        startOneShot(onComplete);  
        if (\!reduceMotion) {  
            startShake();  
        }  
    }  
  }, \[trigger, startOneShot, onComplete, reduceMotion\]);

  const startShake \= () \=\> {  
    // Trigger heavy haptic rumble here  
    cameraShakeValue.setValue(0);  
    Animated.timing(cameraShakeValue, {  
        toValue: 1,  
        duration: 1200,  
        easing: Easing.linear,  
        useNativeDriver: true,  
    }).start();  
  }

  const translateX \= Animated.multiply(frameIndex, \-FRAME\_WIDTH\_BOSS);

  // Camera shake interpolation (Jitter effect)  
  // This creates a high-frequency, randomized shake by defining many steps, decreasing in intensity.  
  const cameraTranslateX \= cameraShakeValue.interpolate({  
    inputRange: \[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1\],  
    outputRange: \[0, \-6, 6, \-5, 5, \-4, 4, \-3, 3, \-1, 0\],  
  });  
  const cameraTranslateY \= cameraShakeValue.interpolate({  
    inputRange: \[0, 0.15, 0.35, 0.55, 0.75, 1\],  
    outputRange: \[0, 3, \-3, 2, \-2, 0\],  
  });

  const styles \= getSpriteStyles(FRAME\_WIDTH\_BOSS, FRAME\_HEIGHT\_BOSS, FRAME\_COUNT\_BOSS);

  return (  
    // The Animated.View acts as the "camera" container  
    \<Animated.View style={{ transform: \[{ translateX: cameraTranslateX }, { translateY: cameraTranslateY }\] }}\>  
      \<View style={styles.spriteWrapper}\>  
        \<Animated.Image  
          // source={SPRITE\_SHEET\_BOSS}  
          style={\[  
            styles.spriteSheet,  
            { transform: \[{ translateX: reduceMotion ? 0 : translateX }\] }  
          \]}  
          resizeMode="contain"  
        /\>  
      \</View\>  
    \</Animated.View\>  
  );  
};

**7-10. Triggering, Effects, Performance, Accessibility:**

* Effects: Camera shake, heavy haptics, dramatic audio sting.  
* Performance: Both sprite and camera shake use the native driver for smooth parallel execution.  
* Accessibility: Camera shake is explicitly disabled if `reduceMotion` is true.

---

### **5\. Battle Attack Animation**

**1\. Animation Name & Game Context:** `AttackStrike`. Includes synchronized impact effects (flash, haptics, damage numbers).

**2\. Sprite Sheet Specifications:**

* Frames: 5  
* Dimensions: 48x32 pixels  
* Layout: Horizontal (240x32 total)

**3\. Frame-by-Frame Breakdown:**

* F1: Wind-up. F2: Strike. **F3: Impact (Key Frame).** F4: Recoil. F5: Return.

**4\. Animation Timing:**

* Duration: 750ms (150ms/frame).  
* Easing: steps(5).  
* Loop: One-shot.

**6\. Code Example (Synchronization via Listener):**

TypeScript  
// import React, { useEffect, useRef } from 'react';  
// import { View, Animated, StyleSheet, Text } from 'react-native';

const FRAME\_WIDTH\_ATTACK \= 48;  
const FRAME\_HEIGHT\_ATTACK \= 32;  
const FRAME\_COUNT\_ATTACK \= 5;  
const DURATION\_ATTACK \= 750;  
const IMPACT\_FRAME\_INDEX \= 2; // Frame 3  
// const SPRITE\_SHEET\_ATTACK \= require('../assets/attack\_strike.png');

const BattleAttack \= ({ trigger, damageAmount, onComplete }: { trigger: boolean, damageAmount: number, onComplete: () \=\> void }) \=\> {  
  const { frameIndex, startOneShot, reduceMotion } \= useAnimatedSprite({ frameCount: FRAME\_COUNT\_ATTACK, duration: DURATION\_ATTACK });  
  const flashOpacity \= useRef(new Animated.Value(0)).current;  
  const damageAnim \= useRef(new Animated.Value(0)).current;  
  const impactTriggered \= useRef(false);

  useEffect(() \=\> {  
      if (trigger) {  
          impactTriggered.current \= false; // Reset trigger flag  
          startOneShot(onComplete);  
      }  
  }, \[trigger, startOneShot, onComplete\]);

  // Monitor the frame index value using addListener for precise synchronization  
  useEffect(() \=\> {  
    if (reduceMotion) return;

    const listenerId \= frameIndex.addListener(({ value }) \=\> {  
      // Check if the current displayed frame index matches the impact frame  
      if (Math.floor(value) \=== IMPACT\_FRAME\_INDEX && \!impactTriggered.current) {  
        triggerImpactEffects();  
        impactTriggered.current \= true;  
      }  
    });  
    return () \=\> frameIndex.removeListener(listenerId);  
  }, \[frameIndex, reduceMotion\]);

  const triggerImpactEffects \= () \=\> {  
    // 1\. Haptics  
    // Haptics.trigger('impactHeavy');

    // 2\. Screen Flash (Disabled if reduceMotion is active, checked in useEffect)  
    Animated.sequence(\[  
        Animated.timing(flashOpacity, { toValue: 0.8, duration: 50, useNativeDriver: true }),  
        Animated.timing(flashOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),  
    \]).start();

    // 3\. Damage Number Pop-up  
    damageAnim.setValue(0);  
    Animated.timing(damageAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();  
  };

  const translateX \= Animated.multiply(frameIndex, \-FRAME\_WIDTH\_ATTACK);

  // Damage number animation (float up and fade out)  
  const damageTranslateY \= damageAnim.interpolate({ inputRange: \[0, 1\], outputRange: \[0, \-40\] });  
  const damageOpacity \= damageAnim.interpolate({ inputRange: \[0, 0.1, 0.8, 1\], outputRange: \[0, 1, 1, 0\] });

  const styles \= getSpriteStyles(FRAME\_WIDTH\_ATTACK, FRAME\_HEIGHT\_ATTACK, FRAME\_COUNT\_ATTACK);

  return (  
    \<View style={{ position: 'relative' }}\>  
      {/\* Screen Flash Overlay \*/}  
      \<Animated.View style={\[StyleSheet.absoluteFill, { backgroundColor: 'white', opacity: flashOpacity, zIndex: 100 }\]} pointerEvents="none" /\>

      {/\* Character Sprite \*/}  
       \<View style={styles.spriteWrapper}\>  
        \<Animated.Image  
            // source={SPRITE\_SHEET\_ATTACK}  
            style={\[  
            styles.spriteSheet,  
            { transform: \[{ translateX: reduceMotion ? 0 : translateX }\] }  
            \]}  
            resizeMode="contain"  
        /\>  
      \</View\>

       {/\* Damage Number (Positioning relative to the scene layout) \*/}  
       \<Animated.View style={\[{ position: 'absolute', top: 0, left: 20, zIndex: 50 }, { opacity: damageOpacity, transform: \[{ translateY: damageTranslateY }\] }\]}\>  
         \<Text style={{ color: 'red', fontWeight: 'bold' /\* Use Pixel Font \*/ }}\>{damageAmount}\</Text\>  
       \</Animated.View\>  
    \</View\>  
  );  
};

**7-10. Triggering, Effects, Performance, Accessibility:**

* Synchronization: `addListener` ensures effects trigger precisely on the impact frame, even with the native driver.  
* Performance: All parallel animations (sprite, flash, damage number) use the native driver.  
* Accessibility: Screen flash and animation are disabled if reduced motion is active.

---

### **6\. Health Bar Deplete (UI Animation)**

**1\. Animation Name & Game Context:** `HealthBar`. UI element visualizing health changes and damage taken.

**4\. Animation Timing:** Width: 300ms (easeOut). Shake: 250ms.

**5\. Implementation:** Using the `Animated` API for width, color, and transform (shake).

**6\. Code Example:**

TypeScript  
// import React, { useEffect, useRef } from 'react';  
// import { View, Animated, StyleSheet, Easing } from 'react-native';

interface HealthBarProps {  
  currentHealth: number;  
  maxHealth: number;  
}

const HealthBar: React.FC\<HealthBarProps\> \= ({ currentHealth, maxHealth }) \=\> {  
  const healthPercentage \= Math.max(0, currentHealth / maxHealth);  
  const animatedWidth \= useRef(new Animated.Value(healthPercentage)).current;  
  const shakeValue \= useRef(new Animated.Value(0)).current;  
  const previousHealth \= useRef(currentHealth);  
  const \[reduceMotion, setReduceMotion\] \= useState(false);

  useEffect(() \=\> {  
    // Simplified accessibility check for non-sprite components  
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);  
  }, \[\]);

  useEffect(() \=\> {  
    // Animate width change  
    Animated.timing(animatedWidth, {  
      toValue: healthPercentage,  
      duration: 300,  
      easing: Easing.out(Easing.quad),  
      useNativeDriver: false, // Width animation requires false  
    }).start();

    // Trigger shake if damage was taken (current \< previous)  
    if (currentHealth \< previousHealth.current) {  
      triggerShake();  
      // Optional: Trigger "Damage Chunks" particle effect here  
    }  
    previousHealth.current \= currentHealth;

  }, \[healthPercentage, currentHealth, animatedWidth\]);

  const triggerShake \= () \=\> {  
    if (reduceMotion) return;

    shakeValue.setValue(0);  
    Animated.timing(shakeValue, {  
        toValue: 1,  
        duration: 250,  
        useNativeDriver: true, // Shake (transform) can use native driver  
    }).start();  
  };

  // Interpolate color: Green (1) \-\> Yellow (0.5) \-\> Red (0)  
  const barColor \= animatedWidth.interpolate({  
    inputRange: \[0, 0.3, 0.7, 1\],  
    outputRange: \['rgb(255, 0, 0)', 'rgb(255, 150, 0)', 'rgb(255, 220, 0)', 'rgb(0, 200, 0)'\],  
  });

  // Shake interpolation (Jitter)  
  const shakeX \= shakeValue.interpolate({  
    inputRange: \[0, 0.2, 0.4, 0.6, 0.8, 1\],  
    outputRange: \[0, \-5, 5, \-3, 3, 0\],  
  });

  return (  
    \<Animated.View style={\[stylesHealth.container, { transform: \[{ translateX: shakeX }\] }\]}\>  
      \<Animated.View  
        style={\[  
          stylesHealth.barFill,  
          {  
            width: animatedWidth.interpolate({  
                inputRange: \[0, 1\],  
                outputRange: \['0%', '100%'\]  
            }),  
            backgroundColor: barColor,  
          },  
        \]}  
      /\>  
    \</Animated.View\>  
  );  
};

const stylesHealth \= StyleSheet.create({  
  container: {  
    width: '100%',  
    height: 16,  
    borderColor: '\#FFF',  
    borderWidth: 2,  
    backgroundColor: '\#333', // Background color when empty  
  },  
  barFill: {  
    height: '100%',  
  },  
});

**7-10. Triggering, Effects, Performance, Accessibility:**

* Triggering: Reactive to `currentHealth` changes.  
* Performance: Shake uses the native driver; width/color must use the JS thread.  
* Accessibility: Shake effect is disabled if reduced motion is enabled.

---

### **7\. XP Bar Fill (Incremental)**

**1\. Animation Name & Game Context:** `XPBar`. Handles XP gain and the complex level-up overflow sequence (fill, flash, reset).

**4\. Animation Timing:** 500ms (easeOut) per fill segment.

**5\. Implementation:** `Animated.sequence` and state tracking to manage the overflow transition.

**6\. Code Example:**

TypeScript  
// ... imports ...

interface XPBarProps {  
  currentXP: number;  
  xpToNextLevel: number;  
  level: number;  
}

const XPBar: React.FC\<XPBarProps\> \= ({ currentXP, xpToNextLevel, level }) \=\> {  
  // Calculate the percentage based on the current level's requirements  
  const xpPercentage \= Math.min(1, currentXP / xpToNextLevel);  
  const animatedWidth \= useRef(new Animated.Value(xpPercentage)).current;  
  const flashOpacity \= useRef(new Animated.Value(0)).current;  
  const previousLevel \= useRef(level);

  useEffect(() \=\> {  
    if (level \> previousLevel.current) {  
      // Level up detected  
      animateLevelUp();  
    } else if (level \=== previousLevel.current) {  
      // Standard fill (XP increased but level did not change)  
      animateFill(xpPercentage).start();  
    }  
    previousLevel.current \= level;  
  }, \[level, currentXP, xpToNextLevel\]);

  const animateFill \= (toValue: number, duration \= 500\) \=\> {  
    return Animated.timing(animatedWidth, {  
      toValue: toValue,  
      duration: duration,  
      easing: Easing.out(Easing.quad),  
      useNativeDriver: false,  
    });  
  };

  const animateLevelUp \= () \=\> {  
    // 1\. Ensure bar fills to 100% (handles cases where the previous animation wasn't complete)  
    animateFill(1, 300).start(() \=\> {  
      // 2\. Trigger Flash and Particles  
      triggerLevelUpEffects();

      // Calculate the remainder XP percentage based on the \*new\* props (already updated by parent)  
      const remainderPercentage \= Math.min(1, currentXP / xpToNextLevel);

      // 3\. Sequence: Flash delay, Reset to 0%, Fill to remainder  
      Animated.sequence(\[  
        Animated.delay(300), // Hold while flashing  
        Animated.timing(animatedWidth, { toValue: 0, duration: 0, useNativeDriver: false }), // Reset instantly  
        animateFill(remainderPercentage, 500\) // Fill to new amount  
      \]).start();  
    });  
  };

  const triggerLevelUpEffects \= () \=\> {  
    // Flash animation (White overlay)  
    Animated.sequence(\[  
        Animated.timing(flashOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),  
        Animated.timing(flashOpacity, { toValue: 0, duration: 300, useNativeDriver: true })  
    \]).start();  
    // Audio Hook: Level Up Jingle / Particle Trigger  
  };

  return (  
    \<View style={stylesXP.container}\>  
      \<Animated.View  
        style={\[  
          stylesXP.barFill,  
          {  
            width: animatedWidth.interpolate({  
                inputRange: \[0, 1\],  
                outputRange: \['0%', '100%'\]  
            }),  
          },  
        \]}  
      /\>  
      {/\* Flash Overlay \*/}  
      \<Animated.View style={\[stylesXP.flashOverlay, { opacity: flashOpacity }\]} pointerEvents="none" /\>  
    \</View\>  
  );  
};

const stylesXP \= StyleSheet.create({  
  container: {  
    height: 12,  
    backgroundColor: '\#222',  
    width: '100%',  
    borderColor: '\#FFF',  
    borderWidth: 1,  
  },  
  barFill: {  
    height: '100%',  
    backgroundColor: 'cyan', // Constant color  
  },  
  flashOverlay: {  
      ...StyleSheet.absoluteFillObject,  
      backgroundColor: 'white',  
  }  
});

**7-10. Triggering, Effects, Performance, Accessibility:**

* Control: Relies on detecting changes in the `level` prop to initiate the complex sequence.  
* Effects: Flash, particles, audio jingle.  
* Accessibility: Subdue or disable the rapid flash for reduced motion (requires conditional logic in `triggerLevelUpEffects`).

---

### **8\. Power-Up Icon Glow**

**1\. Animation Name & Game Context:** `PowerUpGlow`. Idle animation for collectibles or active buffs.

**4\. Animation Timing:** Pulse: 1000ms (easeInOut). Color Cycle: 3000ms (Linear). Infinite loops.

**5\. Implementation:** Parallel `Animated.loop`. Using a background view for the glow is more performant and customizable than React Native shadows.

**6\. Code Example:**

TypeScript  
// import React, { useEffect, useRef } from 'react';  
// import { View, Animated, StyleSheet, Easing, Image } from 'react-native';

// const ICON \= require('../assets/powerup\_icon.png');

const PowerUpGlow: React.FC \= () \=\> {  
  const pulseAnim \= useRef(new Animated.Value(0)).current;  
  const colorAnim \= useRef(new Animated.Value(0)).current;  
  const \[reduceMotion, setReduceMotion\] \= useState(false);

  useEffect(() \=\> {  
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);  
  }, \[\]);

  useEffect(() \=\> {  
    if (reduceMotion) return;

    // Pulse Animation (Scale and Opacity) \- Uses Native Driver  
    const pulseLoop \= Animated.loop(  
        Animated.sequence(\[  
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),  
            Animated.timing(pulseAnim, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),  
        \])  
    );  
    pulseLoop.start();

    // Color Cycle Animation \- Does NOT use Native Driver (for backgroundColor)  
    const colorLoop \= Animated.loop(  
        Animated.timing(colorAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: false })  
    );  
    colorLoop.start();

    return () \=\> {  
        pulseLoop.stop();  
        colorLoop.stop();  
    }  
  }, \[pulseAnim, colorAnim, reduceMotion\]);

  // Interpolations  
  const scale \= pulseAnim.interpolate({ inputRange: \[0, 1\], outputRange: \[1, 1.1\] });  
  const glowOpacity \= pulseAnim.interpolate({ inputRange: \[0, 0.5, 1\], outputRange: \[0.5, 1, 0.5\] });

  // Simulating Hue rotation by cycling colors (Retro palette)  
  const glowColor \= colorAnim.interpolate({  
    inputRange: \[0, 0.25, 0.5, 0.75, 1\],  
    outputRange: \['rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(255, 255, 0)'\],  
  });

  return (  
    \<View style={stylesGlow.container}\>  
        {/\* Glow Layer (behind the icon) \*/}  
        {\!reduceMotion && (  
            \<Animated.View style={\[  
                stylesGlow.glow,  
                {  
                    opacity: glowOpacity,  
                    backgroundColor: glowColor,  
                    transform: \[{ scale }\]  
                }  
            \]} /\>  
        )}

        {/\* Icon Layer \*/}  
      \<Animated.Image  
        // source={ICON}  
        style={\[  
          stylesGlow.icon,  
          { transform: \[{ scale: reduceMotion ? 1 : scale }\] }  
        \]}  
      /\>  
    \</View\>  
  );  
};

const stylesGlow \= StyleSheet.create({  
  container: {  
    justifyContent: 'center',  
    alignItems: 'center',  
    width: 40,  
    height: 40,  
  },  
  icon: {  
    width: 32,  
    height: 32,  
    zIndex: 10,  
  },  
  glow: {  
      position: 'absolute',  
      width: 36,  
      height: 36,  
      borderRadius: 18, // Circular glow  
  }  
});

**7-10. Triggering, Effects, Performance, Accessibility:**

* Performance: Scale/opacity use the native driver. Background color animation uses the JS thread.  
* Accessibility: Animations (loops, glow layer, scale transform) are disabled if reduced motion is enabled.

