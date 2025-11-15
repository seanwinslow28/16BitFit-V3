This document outlines the comprehensive specifications and React Native implementation guidance for the six requested 16BitFit celebration animations. These animations are designed to maximize user delight, reinforce positive behavior, and maintain a high "wow factor" while prioritizing 60fps performance.

### **Implementation Strategy**

To achieve the required performance and complexity, the implementation strategy relies heavily on `react-native-reanimated` (V2/V3+). This library executes animations on the UI thread, bypassing the JavaScript bridge, which is crucial for complex sequences, particle systems, and smooth interactions. We will also utilize `react-native-svg` for path animations and recommend `react-native-redash` for utility functions like `ReText`.

---

### **1\. Achievement Unlock (Epic Moment)**

**1\. Animation Name & Trigger Context:**

* **Name:** EpicAchievementUnlock  
* **Trigger:** Earning a significant badge or completing a major challenge.

**2\. Visual Breakdown:**

* **Elements:** Achievement Badge Icon, Particle Emitters, Background Flash Overlay.  
* **Z-Index:** 1\. Background Flash, 2\. Particles, 3\. Badge Icon.  
* **Palette:** Gold (`#FFD700`), Vibrant Accent (e.g., Teal `#00CED1`), White (`#FFFFFF`).

**3\. Multi-Stage Timeline (Total: 1000ms):**

* **Stage 1 (0-300ms):** Badge Scale-In (0 → 1.1 overshoot).  
* **Stage 2 (300-500ms):** Badge Settle (1.1 → 1.0).  
* **Stage 3 (Starts 300ms):** Impact Event: Particle burst, Background flash (0→0.5→0 opacity), Haptics, SFX.

**4\. Particle System Specifications:**

* **Count:** 12-16 sprites (16x16px).  
* **Velocity:** 200-400px/s, 60°-120° upward cone.  
* **Physics:** Gravity 980px/s².  
* **Lifetime:** \~700ms. Opacity 1→0, Scale 0.5→2.0.

**5\. React Native Implementation:**

* Use `Animated.sequence` (or `withSequence` in Reanimated) for the badge scaling.  
* Use `withDelay` and `runOnJS` to trigger impact effects precisely at 300ms.

**6\. Easing & Physics:**

* **Stage 1:** `Easing.out(Easing.back(1.5))` for high impact.  
* **Stage 2:** `Easing.bounce` or stiff spring.  
* **Particles:** Simulate gravity by applying `Easing.in(Easing.quad)` to the Y-axis translation timing.

**7\. Haptic Choreography:**

* **Timing:** 300ms (Impact point).  
* **Pattern:** Heavy Impact.

**8\. Audio Integration Hooks:**

* **Timing:** 0ms (start of sequence).  
* **SFX:** Triumphant "Achievement Unlock" jingle (High Priority).

**9\. Performance Considerations:**

* For 12-16 particles, animated views are sufficient. For higher complexity, `react-native-skia` is recommended for GPU acceleration.

**10\. Accessibility:**

* **Reduced Motion:** Fade in the badge (200ms) without scaling, bouncing, or particles.

---

### **2\. Level Up Animation**

**1\. Animation Name & Trigger Context:**

* **Name:** LevelUpBurst  
* **Trigger:** User advances to the next level.

**2\. Visual Breakdown:**

* **Elements:** Level Number, Glow Layer, Confetti System, Concentric Rings.  
* **Z-Index:** 1\. Glow, 2\. Rings, 3\. Level Number, 4\. Confetti.  
* **Palette:** Electric Blue (`#00BFFF`) or Neon Green (`#39FF14`).

**3\. Multi-Stage Timeline (Total: 1200ms):**

* **Stage 1 (0-600ms):** Number Scale Burst (0 → 1.5 → 1.0, spring bounce).  
* **Stage 2 (0-800ms):** Glow Pulse (Opacity 0 → 1 → 0.5).  
* **Stage 3 (Starts 200ms):** Ring 1 Expansion. Haptic 1\.  
* **Stage 4 (Starts 400ms):** Ring 2 Expansion. Confetti Burst. Haptic 2\.

**4\. Particle System Specifications (Confetti):**

* **Count:** 12-15 pieces (pixelated rectangles).  
* **Physics:** Gravity, rotation/spin, air resistance.  
* **Recommendation:** Use `react-native-confetti-cannon`.

**5\. React Native Implementation:**

* Use `withSpring` for the number burst.  
* Use `withDelay` to stagger the ring pulses, interpolating scale (1→3) and opacity (1→0) from a single progress value.

**6\. Easing & Physics:**

* **Number Burst (Spring):** `damping: 10`, `stiffness: 100`, `mass: 1.2` (for a weighty feel).  
* **Rings:** `Easing.out(Easing.cubic)` for rapid expansion that decelerates.

**7\. Haptic Choreography:**

* **Pattern:** Double-pulse. Success notification at 200ms, medium impact at 400ms.

**8\. Audio Integration Hooks:**

* **SFX:** Ascending "power-up" sound (0ms), culminating in a chime (400ms).

**9\. Performance Considerations:**

* Ring animations are simple transforms (opacity/scale) and run efficiently on the UI thread.

**10\. Accessibility:**

* **Reduced Motion:** Display the level number instantly. Omit rings and confetti.

---

### **3\. Success Checkmark Draw**

**1\. Animation Name & Trigger Context:**

* **Name:** SuccessCheckDraw  
* **Trigger:** Completing a daily task or logging an activity.

**2\. Visual Breakdown:**

* **Elements:** Circle Container, SVG Checkmark Path, Green Flash, Light Rays.  
* **Z-Index:** 1\. Light Rays, 2\. Green Flash, 3\. Circle, 4\. Checkmark.  
* **Palette:** Success Green (`#4CAF50`), White (`#FFFFFF`).

**3\. Multi-Stage Timeline (Total: \~800ms):**

* **Stage 1 (0-400ms):** Circle Scale-In (0 → 1, spring bounce).  
* **Stage 2 (150ms-450ms):** Checkmark Draw (SVG `strokeDashoffset` 100% → 0%).  
* **Stage 3 (450ms):** Impact Event: Green Flash, Haptic trigger.  
* **Stage 4 (450ms-800ms):** Light Rays emanate (Rotate 0°→30° and fade).

**4\. Particle System Specifications (Light Rays):**

* Implemented as 6-8 animated lines rotated simultaneously, rather than a particle system.

**5\. React Native Implementation:**

* Requires `react-native-svg`.  
* Crucial: Use Reanimated's `useAnimatedProps` to drive the `strokeDashoffset` property on the UI thread. The path length must be pre-calculated.

**6\. Easing & Physics:**

* **Circle Pop (Spring):** `damping: 12`, `stiffness: 200` (quick and precise).  
* **Checkmark Draw:** `Easing.inOut(Easing.quad)`.

**7\. Haptic Choreography:**

* **Timing:** 450ms (Completion).  
* **Pattern:** Light, crisp success notification or "tick".

**8\. Audio Integration Hooks:**

* **SFX:** "Swoosh" synchronized with the draw (150ms), ending in a "ding" (450ms).

**9\. Performance Considerations:**

* `useAnimatedProps` ensures 60fps for SVG animations.

**10\. Accessibility:**

* **Reduced Motion:** Show the completed checkmark and circle instantly.

---

### **4\. Streak Milestone Celebration**

**1\. Animation Name & Trigger Context:**

* **Name:** StreakFlameBurst  
* **Trigger:** Hitting a significant streak milestone (e.g., 7, 30 days).

**2\. Visual Breakdown:**

* **Elements:** Flame Icon, Number Counter, Glow/Color Shift, Ember Particles.  
* **Z-Index:** 1\. Glow, 2\. Embers, 3\. Flame, 4\. Counter.  
* **Palette:** Orange (`#FFA500`), Red (`#FF4500`), White (`#FFFFFF`).

**3\. Multi-Stage Timeline (Total: \~1500ms):**

* **Stage 1 (0-500ms):** Flame Pulse (1→1.2→1) and Rise (TranslateY 20→0).  
* **Stage 2 (300-1200ms):** Number Counter Tick-Up (1 → Target, with overshoot and settle).  
* **Stage 3 (300-1200ms):** Color Shift (Orange → White (Peak) → Orange/Red).  
* **Stage 4 (Continuous):** Embers floating upward.

**4\. Particle System Specifications (Embers):**

* **Count:** 15-20 active simultaneously.  
* **Velocity:** Slow upward drift (50-100px/s).  
* **Physics:** Slight horizontal sway (sine wave modulation).

**5\. React Native Implementation:**

* Use `interpolateColor` for the smooth color shift.  
* **Counter:** CRITICAL. Must run on the UI thread. Use `ReText` (from `react-native-redash`) driven by a shared value, or animate `TextInput` props via `useAnimatedProps`.

**6\. Easing & Physics:**

* **Flame Rise:** `Easing.out(Easing.back(1))`.  
* **Counter (Main):** `Easing.out(Easing.quad)` to slow down near the target.  
* **Counter (Settle):** `Easing.bounce` for the overshoot settle.

**7\. Haptic Choreography:**

* **Timing:** 500ms (flame peak).  
* **Pattern:** Medium intensity pulse.

**8\. Audio Integration Hooks:**

* **SFX 1 (0ms):** "Fire Ignition Whoosh".  
* **SFX 2 (300ms):** Rapid "ticking" sound synchronized with the counter.

**9\. Performance Considerations:**

* Do not update React state rapidly for the counter. Keep updates on the UI thread to avoid massive frame drops.

**10\. Accessibility:**

* **Reduced Motion:** Show the final streak count and flame instantly. Skip embers and movement.

---

### **5\. Goal Completion Progress Bar**

**1\. Animation Name & Trigger Context:**

* **Name:** ProgressBarCompletion  
* **Trigger:** Progress bar reaches 100%.

**2\. Visual Breakdown:**

* **Elements:** Progress Bar Track/Fill, Overflow Sparkles, Checkmark Icon.  
* **Z-Index:** 1\. Track, 2\. Fill, 3\. Sparkles, 4\. Checkmark.  
* **Palette:** Yellow (`#FFEB3B`) → Green (`#4CAF50`).

**3\. Multi-Stage Timeline (Total: \~700ms):**

* **Stage 1 (0-500ms):** Final Fill (\[current%\] → 100%). `easeOutExp`.  
* **Stage 2 (0-500ms):** Color Morph (Yellow → Green).  
* **Stage 3 (500ms):** Impact Event: Overflow Sparkle Burst, Haptic trigger.  
* **Stage 4 (500-700ms):** Checkmark Pop-in (Scale 0→1 bounce).

**4\. Particle System Specifications (Sparkles):**

* **Count:** 8-12 small sparkles.  
* **Spawn:** 100% mark endpoint.  
* **Velocity:** Fast burst (300-500px/s).

**5\. React Native Implementation:**

* **Optimization:** Animate `transform: scaleX` instead of `width`. Animating `width` triggers layout recalculations, whereas `transform` runs on the GPU/compositor thread.  
* Use `interpolateColor`.

**6\. Easing & Physics:**

* **Fill:** `Easing.out(Easing.exp)` for dramatic deceleration at the end.  
* **Checkmark Pop (Spring):** `damping: 10`, `stiffness: 150`.

**7\. Haptic Choreography:**

* **Timing:** 500ms (at 100%).  
* **Pattern:** Standard "Success" notification.

**8\. Audio Integration Hooks:**

* **SFX 1 (0ms):** Rising tone during the fill.  
* **SFX 2 (500ms):** Bright "ding" at completion.

**9\. Performance Considerations:**

* Crucial to use `scaleX` (ensuring the transform origin is left) and `interpolateColor` on the UI thread.

**10\. Accessibility:**

* **Reduced Motion:** Instantly update the bar to 100% green and show the checkmark.

---

### **6\. Multi-Stage Reward Reveal**

**1\. Animation Name & Trigger Context:**

* **Name:** EpicRewardReveal  
* **Trigger:** Opening a reward chest or claiming a major milestone reward.

**2\. Visual Breakdown:**

* **Elements:** Curtain/Overlay, 3D Reward Card (Front/Back), Badge/Prize, Shine Effect, Point Counter.  
* **Z-Index:** 1\. Card Container, 2\. Shine Effect, 3\. Curtain Overlay.  
* **Palette:** Deep Purple (`#6A0DAD`), Gold (`#FFD700`).

**3\. Multi-Stage Timeline (Total: 2000ms Sequential):**

* **Stage 1 (0-400ms):** Curtain Reveal (Fade).  
* **Stage 2 (400-1000ms):** 3D Card Flip (`rotateY` 0°→180°).  
* **Stage 3 (1000-1800ms):** Badge Shine Effect (Sweeping gradient `translateX`).  
* **Stage 4 (1800-2000ms):** Point Counter Increment.

**4\. Particle System Specifications:**

* N/A (Shine is a gradient animation).

**5\. React Native Implementation:**

* **Sequencing:** Use Reanimated callbacks (the `finished` parameter in `withTiming`) to manage the strict sequential order.  
* **3D Flip:** Requires `transform: [{ perspective: 1000 }, { rotateY: ... }]` and `backfaceVisibility: 'hidden'` on both front and back views.

**6\. Easing & Physics:**

* **Card Flip:** `Easing.inOut(Easing.cubic)` for a smooth, weighty rotation.  
* **Shine Effect:** Linear or `EaseOutCubic`.

**7\. Haptic Choreography:**

* **400ms:** Light impact (flip starts).  
* **1000ms:** Heavy impact (flip completes/reward revealed).  
* **1800ms:** Success notification (points awarded).

**8\. Audio Integration Hooks:**

* **400ms:** "Card Flip Whoosh" SFX.  
* **1000ms:** Shimmering/Sparkle sound synchronized with the shine.  
* **1800ms:** "Points awarded" chime.

**9\. Performance Considerations:**

* 3D transforms are GPU accelerated. Ensure `backfaceVisibility` is correctly implemented.

**10\. Accessibility:**

* **Reduced Motion:** Fade the curtain and immediately show the front-facing reward card and final points.

---

### **React Native Implementation Code (using `react-native-reanimated`)**

The following code provides functional components demonstrating the structure, timing, and effects described above using `react-native-reanimated`.

*Note: This code assumes `react-native-reanimated` and `react-native-svg` are installed. Placeholders are used for Haptics, Audio, Particles, and complex counters (like `ReText`).*

JavaScript  
import React, { useEffect, useState } from 'react';  
import { View, Text, StyleSheet, Dimensions } from 'react-native';  
import Animated, {  
  useSharedValue,  
  useAnimatedStyle,  
  withTiming,  
  withSpring,  
  withSequence,  
  withDelay,  
  Easing,  
  interpolate,  
  interpolateColor,  
  useAnimatedProps,  
  runOnJS,  
  useDerivedValue,  
} from 'react-native-reanimated';  
import Svg, { Path, Circle } from 'react-native-svg';

// Mock dependencies  
const Haptics \= {  
  impactHeavy: () \=\> console.log('HAPTIC: Heavy Impact'),  
  notificationSuccess: () \=\> console.log('HAPTIC: Success'),  
  impactMedium: () \=\> console.log('HAPTIC: Medium Impact'),  
  impactLight: () \=\> console.log('HAPTIC: Light Impact'),  
};  
const AudioPlayer \= {  
  play: (s) \=\> console.log(\`AUDIO: Playing ${s}\`),  
};

// \=================================================================  
// 1\. Achievement Unlock (Epic Moment)  
// \=================================================================

const AchievementUnlock \= () \=\> {  
  const badgeScale \= useSharedValue(0);  
  const backgroundOpacity \= useSharedValue(0);

  // Function to run on the JS thread for side effects  
  const triggerImpact \= () \=\> {  
    // Trigger particle system (e.g., using react-native-skia or Animated.View based particles)  
    console.log("Trigger Particles");  
    Haptics.impactHeavy();  
  };

  useEffect(() \=\> {  
    AudioPlayer.play('achievement\_unlock.mp3');

    // Stage 1 & 2: Scale-in with overshoot and settle  
    badgeScale.value \= withSequence(  
      // 0ms \- 300ms: Scale to 1.1 (Dramatic entrance)  
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),  
      // 300ms \- 500ms: Settle to 1.0  
      withTiming(1.0, { duration: 200, easing: Easing.ease })  
    );

    // Stage 3: Background Flash (Starts at 300ms)  
    backgroundOpacity.value \= withDelay(300,  
      withSequence(  
        withTiming(0.5, { duration: 100 }),  
        withTiming(0, { duration: 200 })  
      )  
    );

    // Trigger side effects precisely at 300ms using a UI thread callback  
    // We use a 0-duration timing wrapped in withDelay to execute the worklet  
    withDelay(300, withTiming(0, { duration: 0 }, () \=\> {  
        'worklet';  
        runOnJS(triggerImpact)();  
    }));

  }, \[\]);

  const badgeStyle \= useAnimatedStyle(() \=\> ({  
    transform: \[{ scale: badgeScale.value }\],  
  }));

  const backgroundStyle \= useAnimatedStyle(() \=\> ({  
    opacity: backgroundOpacity.value,  
  }));

  return (  
    \<View style={styles.container}\>  
      \<Animated.View style={\[styles.backgroundFlash, backgroundStyle\]} /\>  
      {/\* Particle System Component would go here \*/}  
      \<Animated.View style={\[styles.badge, badgeStyle\]}\>  
        \<Text style={{fontSize: 60}}\>🏅\</Text\>  
      \</Animated.View\>  
    \</View\>  
  );  
};

// \=================================================================  
// 2\. Level Up Animation  
// \=================================================================

const LevelUp \= ({ level \= 5 }) \=\> {  
    const numberScale \= useSharedValue(0);  
    const ring1Progress \= useSharedValue(0);  
    const ring2Progress \= useSharedValue(0);

    useEffect(() \=\> {  
        AudioPlayer.play('level\_up.mp3');

        // Stage 1: Number Burst (Spring physics)  
        numberScale.value \= withSpring(1, {  
            damping: 10,  
            stiffness: 100,  
            mass: 1.2,  
        });

        // Stage 3: Ring Pulses (Staggered)  
        const ringConfig \= { duration: 600, easing: Easing.out(Easing.cubic) };  
        // Ring 1 starts at 200ms  
        ring1Progress.value \= withDelay(200, withTiming(1, ringConfig));  
        // Ring 2 starts at 400ms  
        ring2Progress.value \= withDelay(400, withTiming(1, ringConfig));

        // Stage 4: Confetti (Placeholder)  
        setTimeout(() \=\> console.log("Trigger Confetti Cannon (e.g., react-native-confetti-cannon)"), 400);

        // Haptics: Double Pulse  
        setTimeout(() \=\> Haptics.notificationSuccess(), 200);  
        setTimeout(() \=\> Haptics.impactMedium(), 400);  
    }, \[\]);

    const numberStyle \= useAnimatedStyle(() \=\> ({  
        transform: \[{ scale: numberScale.value }\],  
    }));

    // Helper to generate ring styles based on a progress value (0-\>1)  
    const renderRingStyle \= (progress) \=\> useAnimatedStyle(() \=\> {  
        // scale 1 → 3  
        const scale \= interpolate(progress.value, \[0, 1\], \[1, 3\]);  
        // opacity 1 → 0 (fades faster towards the end)  
        const opacity \= interpolate(progress.value, \[0, 0.5, 1\], \[1, 0.8, 0\]);  
        return {  
            transform: \[{ scale }\],  
            opacity,  
        };  
    });

    return (  
        \<View style={styles.container}\>  
            {/\* Glow Effect (Stage 2\) can be implemented similarly \*/}  
            \<Animated.View style={\[styles.ring, renderRingStyle(ring1Progress)\]} /\>  
            \<Animated.View style={\[styles.ring, renderRingStyle(ring2Progress)\]} /\>  
            \<Animated.Text style={\[styles.levelNumber, numberStyle\]}\>  
                Level {level}  
            \</Animated.Text\>  
        \</View\>  
    );  
};

// \=================================================================  
// 3\. Success Checkmark Draw (SVG Animation)  
// \=================================================================

const AnimatedPath \= Animated.createAnimatedComponent(Path);  
// Must match the SVG path length (d="M25 50 L45 70 L75 30"). Use a tool to calculate this.  
const CHECKMARK\_LENGTH \= 50;

const SuccessCheckmark \= () \=\> {  
    const circleScale \= useSharedValue(0);  
    const progress \= useSharedValue(0); // 0 \= not drawn, 1 \= fully drawn  
    const raysAnim \= useSharedValue(0);

    useEffect(() \=\> {  
        // Stage 1: Circle Pop (0ms \- 400ms)  
        circleScale.value \= withSpring(1, { damping: 12, stiffness: 200 });

        // Stage 2: Checkmark Draw (150ms \- 450ms)  
        progress.value \= withDelay(150, withTiming(1, { duration: 300, easing: Easing.inOut(Easing.quad) }));

        // Stage 4: Rays (450ms \- 800ms)  
        raysAnim.value \= withDelay(450, withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }));

        // Haptics and Audio  
        setTimeout(() \=\> AudioPlayer.play('swoosh.mp3'), 150);  
        setTimeout(() \=\> {  
            Haptics.notificationSuccess();  
            AudioPlayer.play('ding.mp3');  
            // Stage 3: Green Flash (can be implemented similar to Achievement background flash)  
        }, 450);

    }, \[\]);

    // Animate SVG strokeDashoffset using useAnimatedProps (Performant)  
    const animatedPathProps \= useAnimatedProps(() \=\> {  
        // Calculate the offset based on progress  
        const strokeDashoffset \= CHECKMARK\_LENGTH \* (1 \- progress.value);  
        return { strokeDashoffset };  
    });

    const circleStyle \= useAnimatedStyle(() \=\> ({  
        transform: \[{ scale: circleScale.value }\],  
    }));

    const raysStyle \= useAnimatedStyle(() \=\> {  
        // Rotate 0 \-\> 30 deg  
        const rotation \= interpolate(raysAnim.value, \[0, 1\], \[0, 30\]);  
        // Scale up slightly  
        const scale \= interpolate(raysAnim.value, \[0, 1\], \[1, 1.5\]);  
        // Fade out  
        const opacity \= interpolate(raysAnim.value, \[0, 0.5, 1\], \[1, 1, 0\]);  
        return {  
            transform: \[{ rotate: \`${rotation}deg\` }, { scale }\],  
            opacity,  
        };  
    });

    return (  
        \<View style={styles.container}\>  
            {/\* Rays Placeholder (A container with radial lines or a texture) \*/}  
            \<Animated.View style={\[styles.raysContainer, raysStyle\]}\>  
                \<Text style={{fontSize: 80}}\>✴️\</Text\>  
            \</Animated.View\>

            \<Animated.View style={circleStyle}\>  
                \<Svg width={100} height={100} viewBox="0 0 100 100"\>  
                    \<Circle cx="50" cy="50" r="45" fill="\#4CAF50" /\>  
                    \<AnimatedPath  
                        d="M25 50 L45 70 L75 30"  
                        stroke="\#FFFFFF"  
                        strokeWidth="8"  
                        fill="none"  
                        strokeLinecap="round"  
                        strokeDasharray={CHECKMARK\_LENGTH}  
                        animatedProps={animatedPathProps}  
                    /\>  
                \</Svg\>  
            \</Animated.View\>  
        \</View\>  
    );  
};

// \=================================================================  
// 4\. Streak Milestone Celebration (Counter Overshoot)  
// \=================================================================

const StreakMilestone \= ({ targetStreak \= 7 }) \=\> {  
    const flameTranslateY \= useSharedValue(20);  
    const flameScale \= useSharedValue(1);  
    const colorProgress \= useSharedValue(0);  
    const count \= useSharedValue(1);

    // Derived value to format the count for display  
    // This would typically drive a ReText component (from react-native-redash) for performance  
    const countText \= useDerivedValue(() \=\> {  
        return \`${Math.round(count.value)} Day Streak\!\`;  
    });

    useEffect(() \=\> {  
        AudioPlayer.play('fire\_whoosh.mp3');

        // Stage 1: Flame Rise and Pulse (0ms \- 500ms)  
        flameTranslateY.value \= withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1)) });  
        flameScale.value \= withSequence(  
            withTiming(1.2, { duration: 250, delay: 250 }),  
            withTiming(1.0, { duration: 250 })  
        );

        // Stage 2: Number Counter Tick-Up with Overshoot (300ms \- 1200ms)  
        setTimeout(() \=\> AudioPlayer.play('ticking.mp3'), 300);  
        count.value \= withSequence(  
            // Rapid tick up with slight overshoot (e.g., \+3)  
            withTiming(targetStreak \+ 3, { duration: 700, delay: 300, easing: Easing.out(Easing.quad) }),  
            // Settle back to target  
            withTiming(targetStreak, { duration: 200, easing: Easing.bounce })  
        );

        // Stage 3: Color Shift (300ms \- 1200ms)  
        colorProgress.value \= withSequence(  
            withTiming(0.5, { duration: 500, delay: 300 }), // To White (Peak)  
            withTiming(1.0, { duration: 400 }) // To Red/Orange  
        );

         // Haptics  
         setTimeout(() \=\> Haptics.impactMedium(), 500);

    }, \[\]);

    const flameStyle \= useAnimatedStyle(() \=\> {  
        // Interpolate: Orange \-\> White \-\> Red  
        const color \= interpolateColor(  
            colorProgress.value,  
            \[0, 0.5, 1\],  
            \['\#FFA500', '\#FFFFFF', '\#FF4500'\]  
          );  
        return {  
            transform: \[  
                { translateY: flameTranslateY.value },  
                { scale: flameScale.value },  
            \],  
            // Applying glow effect driven by the color interpolation  
            shadowColor: color,  
            shadowRadius: 20,  
            shadowOpacity: 1,  
        };  
    });

    return (  
        \<View style={styles.container}\>  
          {/\* Stage 4: Embers (Continuous Particle system needed) \*/}  
          \<Animated.View style={flameStyle}\>  
            \<Text style={{fontSize: 64}}\>🔥\</Text\>  
          \</Animated.View\>  
          {/\* Use ReText here for performance: \<ReText style={styles.streakCount} text={countText} /\> \*/}  
          \<Text style={styles.streakCount}\>{targetStreak} Day Streak\!\</Text\>  
        \</View\>  
      );  
};

// \=================================================================  
// 5\. Goal Completion Progress Bar (ScaleX Optimization)  
// \=================================================================

const GoalCompletionBar \= ({ startPercentage \= 0.8 }) \=\> {  
    const scaleX \= useSharedValue(startPercentage);  
    const checkmarkScale \= useSharedValue(0);

    const triggerImpact \= () \=\> {  
        // Stage 3: Trigger Sparkles  
        console.log("Trigger Sparkles at 100%");  
        Haptics.notificationSuccess();  
        AudioPlayer.play('chime.mp3');  
    }

    useEffect(() \=\> {  
        AudioPlayer.play('rising\_tone.mp3');

        // Stage 1 & 2: Fill and Color Morph (0ms \- 500ms)  
        // Use the callback function to trigger subsequent stages precisely upon completion  
        scaleX.value \= withTiming(1.0, { duration: 500, easing: Easing.out(Easing.exp) }, (finished) \=\> {  
            'worklet';  
            if (finished) {  
                // Stage 4: Checkmark pop-in  
                checkmarkScale.value \= withSpring(1, { damping: 10, stiffness: 150 });  
                // Stage 3: Haptics/Audio/Particles  
                runOnJS(triggerImpact)();  
            }  
        });

    }, \[\]);

    const fillStyle \= useAnimatedStyle(() \=\> {  
        // Color Morph: Yellow \-\> Green  
        const backgroundColor \= interpolateColor(  
            scaleX.value,  
            \[startPercentage, 1.0\],  
            \['\#FFEB3B', '\#4CAF50'\]  
        );  
        return {  
            // Using scaleX for optimal performance  
            transform: \[{ scaleX: scaleX.value }\],  
            backgroundColor,  
        };  
    });

    const checkmarkStyle \= useAnimatedStyle(() \=\> ({  
        transform: \[{ scale: checkmarkScale.value }\],  
    }));

    return (  
        \<View style={styles.barWrapper}\>  
            {/\* The container (track) must align items to the start for scaleX to work correctly \*/}  
          \<View style={styles.barContainer}\>  
            {/\* The fill width is 100%; scaleX controls the visible portion \*/}  
            \<Animated.View style={\[styles.barFill, fillStyle\]} /\>  
          \</View\>  
          \<Animated.View style={checkmarkStyle}\>  
            \<Text style={{fontSize: 32}}\>✅\</Text\>  
          \</Animated.View\>  
        \</View\>  
    );  
};

// \=================================================================  
// 6\. Multi-Stage Reward Reveal (3D Card Flip & Sequencing)  
// \=================================================================

const RewardReveal \= () \=\> {  
    const curtainOpacity \= useSharedValue(1);  
    const cardRotationY \= useSharedValue(0); // 0 to 180 degrees  
    const shineTranslateX \= useSharedValue(-250); // Start off-screen left

    const triggerFlipStart \= () \=\> {  
        Haptics.impactLight();  
        AudioPlayer.play('card\_flip.mp3');  
    };

    const triggerReveal \= () \=\> {  
        Haptics.impactHeavy();  
        AudioPlayer.play('shimmer.mp3');  
    };

    const triggerPoints \= () \=\> {  
        console.log("Trigger Point Counter Update");  
        Haptics.notificationSuccess();  
    };

    useEffect(() \=\> {  
        // Stage 1: Curtain Reveal (0ms \- 400ms)  
        // Use callbacks to chain the sequence robustly  
        curtainOpacity.value \= withTiming(0, { duration: 400, easing: Easing.ease }, (finishedStage1) \=\> {  
            'worklet';  
            if (finishedStage1) {  
                // Stage 2: Reward Card Flip (400ms \- 1000ms)  
                runOnJS(triggerFlipStart)();  
                cardRotationY.value \= withTiming(180, { duration: 600, easing: Easing.inOut(Easing.cubic) }, (finishedStage2) \=\> {  
                    'worklet';  
                    if (finishedStage2) {  
                        // Stage 3: Badge Shine Effect (1000ms \- 1800ms)  
                        runOnJS(triggerReveal)();  
                        shineTranslateX.value \= withTiming(250, { duration: 800, easing: Easing.ease }, (finishedStage3) \=\> {  
                            'worklet';  
                            if (finishedStage3) {  
                                // Stage 4: Point counter increment (1800ms)  
                                runOnJS(triggerPoints)();  
                            }  
                        });  
                    }  
                });  
            }  
        });  
    }, \[\]);

    const curtainStyle \= useAnimatedStyle(() \=\> ({  
        opacity: curtainOpacity.value,  
        // Prevent interaction when curtain is gone  
        pointerEvents: curtainOpacity.value \> 0.1 ? 'auto' : 'none',  
    }));

    // 3D flip implementation  
    // Front side (Cover): Rotates 0 \-\> 180  
    const cardFrontStyle \= useAnimatedStyle(() \=\> {  
        const rotateY \= interpolate(cardRotationY.value, \[0, 180\], \[0, 180\]);  
        return {  
            transform: \[{ perspective: 1000 }, { rotateY: \`${rotateY}deg\` }\],  
        };  
    });

    // Back side (Reward): Rotates 180 (hidden) \-\> 360 (visible)  
    const cardBackStyle \= useAnimatedStyle(() \=\> {  
        const rotateY \= interpolate(cardRotationY.value, \[0, 180\], \[180, 360\]);  
        return {  
            transform: \[{ perspective: 1000 }, { rotateY: \`${rotateY}deg\` }\],  
        };  
    });

    const shineStyle \= useAnimatedStyle(() \=\> ({  
        // Translate across the card and skew for dynamic look  
        transform: \[{ translateX: shineTranslateX.value }, { skewX: '-20deg' }\],  
    }));

    return (  
        \<View style={styles.container}\>  
          \<View style={styles.cardWrapper}\>  
            {/\* Card Front (The Cover \- Starts visible) \*/}  
            \<Animated.View style={\[styles.card, styles.cardCover, cardFrontStyle\]}\>  
              \<Text style={styles.cardTextCover}\>16BitFit\</Text\>  
            \</Animated.View\>

            {/\* Card Back (The Reward \- Revealed content) \*/}  
            \<Animated.View style={\[styles.card, styles.cardReward, cardBackStyle\]}\>  
              \<Text style={styles.cardTextReward}\>Epic Reward\! 🌟\</Text\>  
              {/\* Shine Effect (Masked by card overflow: hidden) \*/}  
              \<Animated.View style={\[styles.shine, shineStyle\]} /\>  
            \</Animated.View\>  
          \</View\>

          {/\* Stage 1: Curtain Overlay \*/}  
          \<Animated.View style={\[styles.curtain, curtainStyle\]} /\>  
        \</View\>  
    );  
};

// \=================================================================  
// Styles  
// \=================================================================

const styles \= StyleSheet.create({  
    container: {  
        flex: 1,  
        justifyContent: 'center',  
        alignItems: 'center',  
        width: '100%',  
        backgroundColor: '\#f0f0f0',  
    },  
    // 1\. Achievement Unlock  
    badge: {  
        width: 150,  
        height: 150,  
        justifyContent: 'center',  
        alignItems: 'center',  
        backgroundColor: '\#FFD700',  
        borderRadius: 75,  
        zIndex: 3,  
    },  
    backgroundFlash: {  
        position: 'absolute',  
        top: 0,  
        left: 0,  
        right: 0,  
        bottom: 0,  
        backgroundColor: '\#FFFFFF',  
        zIndex: 1,  
    },  
    // 2\. Level Up  
    levelNumber: {  
        fontSize: 48,  
        fontWeight: 'bold',  
        color: '\#00BFFF',  
        zIndex: 3,  
    },  
    ring: {  
        position: 'absolute',  
        width: 80,  
        height: 80,  
        borderRadius: 40,  
        borderWidth: 5,  
        borderColor: '\#00BFFF',  
        zIndex: 2,  
    },  
    // 3\. Success Checkmark  
    raysContainer: {  
        position: 'absolute',  
        opacity: 0.5,  
        zIndex: 1,  
    },  
    // 4\. Streak Milestone  
    streakCount: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        color: '\#FF4500',  
        marginTop: 10,  
    },  
    // 5\. Goal Completion Bar  
    barWrapper: {  
        flexDirection: 'row',  
        alignItems: 'center',  
    },  
    barContainer: {  
        width: 250,  
        height: 20,  
        borderRadius: 10,  
        backgroundColor: '\#E0E0E0',  
        overflow: 'hidden',  
        // Crucial: Align the fill bar to the left for correct scaleX behavior  
        alignItems: 'flex-start',  
    },  
    barFill: {  
        height: '100%',  
        // Crucial: Set width to 100% of the track; scaleX controls the visible portion  
        width: 250,  
        borderRadius: 10,  
    },  
    // 6\. Reward Reveal  
    cardWrapper: {  
        width: 200,  
        height: 300,  
    },  
    card: {  
        width: 200,  
        height: 300,  
        borderRadius: 15,  
        justifyContent: 'center',  
        alignItems: 'center',  
        position: 'absolute',  
        backfaceVisibility: 'hidden', // Crucial for 3D flips  
        overflow: 'hidden', // To mask the shine effect  
    },  
    cardCover: {  
        backgroundColor: '\#6A0DAD', // Deep Purple  
    },  
    cardReward: {  
        backgroundColor: '\#FFD700', // Gold  
    },  
    cardTextCover: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        color: '\#FFF',  
    },  
    cardTextReward: {  
        fontSize: 20,  
        fontWeight: 'bold',  
        color: '\#333',  
    },  
    curtain: {  
        position: 'absolute',  
        top: 0, left: 0, right: 0, bottom: 0,  
        backgroundColor: '\#333',  
        zIndex: 10,  
    },  
    shine: {  
        position: 'absolute',  
        width: 80,  
        height: 350, // Taller than the card to cover corners when skewed  
        backgroundColor: 'rgba(255, 255, 255, 0.5)',  
    }  
});  
