# Requirements

## Functional

1.  **FR1:** User shall be able to create a basic profile (optionally deferred auth).  
2.  **FR2:** User shall be able to select one of five Fitness Archetypes (Trainer, Runner, Yoga, Bodybuilder, Cyclist) for their Home Avatar.  
3.  **FR3:** User shall be able to upload a headshot photo.  
4.  **FR4:** The system shall integrate the user's uploaded face onto the selected Stage 1 Fitness Archetype body using AI to create a personalized Home Avatar.  
5.  **FR5:** User shall be able to choose between "Sean" or "Mary" as their playable Combat Character.  
6.  **FR6:** The application shall connect to Apple HealthKit (iOS) or Google Fit (via Health Connect API on Android) to request permission and sync step count data.  
7.  **FR7:** The system shall convert synced step counts into an in-game "Energy Bar" resource for use in combat.  
8.  **FR8:** User shall be able to manually log a basic workout type (e.g., Strength, Cardio, Flexibility).  
9.  **FR9:** Synced/logged fitness activity (steps, workouts) shall contribute to the Home Avatar's evolution progress.  
10. **FR10:** The Home Avatar shall visually evolve from Stage 1 to Stage 2 based on accumulated fitness activity progress.  
11. **FR11:** User shall have the option to upload a new headshot photo when their Home Avatar reaches Stage 2.  
12. **FR12:** The Home Avatar shall display basic reactive animations (positive/negative feedback) based on recent activity/inactivity.  
13. **FR13:** Fitness activity progress (linked to Home Avatar evolution stage) shall increase the selected Combat Character's stats (e.g., HP, damage).  
14. **FR14:** User shall be able to initiate a battle against the "Training Dummy" AI opponent.  
15. **FR15:** The selected Combat Character ("Sean" or "Mary") shall be controllable in combat with basic moves: Light/Medium/Heavy Punch, Light/Medium/Heavy Kick, Walk (Forward/Backward), Jump (Vertical/Forward/Backward), Block (Standing/Crouching).  
16. **FR16:** The combat interface shall display Health Bars for both characters, a round timer, and the user's Energy Meter (fueled by steps).  
17. **FR17:** The Home Screen (within the virtual LCD area) shall display: the user's personalized Home Avatar (top-center), **Dual Progress Rings** (Fitness/Skill) below the avatar, a **Momentum/Streak Bar** below the rings, a large **"Quest Cartridge" button** below the rings (primary workout entry), and a **bottom Tab Bar** for primary navigation (Home, Battle, Profile, Settings). Key current fitness stats (Steps, Calories, Workout Duration) shall be displayed **on the shell area** below the virtual screen. Combat Character stats should be accessible via the Profile tab.  
18. **FR18:** The Home Screen shall provide an entry point to start a battle (via Battle Tab).  
19. **FR19:** The application shall include a basic first-time user experience (FTUE) guiding profile/avatar creation, character selection, and a tutorial battle against the Training Dummy.

## Non Functional

1.  **NFR1:** Combat gameplay within the Phaser WebView must achieve an average of 60 frames per second (fps) with 90% consistency on target devices (iPhone 12+, Android 10+ equivalent).  
2.  **NFR2:** Input latency during combat (time from button press to character action) must be less than 50 milliseconds (<50ms).  
3.  **NFR3:** Peak memory usage during combat sessions shall not exceed 150MB.  
4.  **NFR4:** The application load time from launch to a playable state (Home Screen visible) shall be less than 3 seconds (<3s) on target devices.  
5.  **NFR5:** The application crash rate shall be less than 0.1% (<0.1%) across all active users.  
6.  **NFR6:** The React Native shell UI shall implement a **"Modern Retro Fusion"** aesthetic, simulating the physical form factor of a classic Game Boy (using the **Hardware Shell color palette** defined in \`front-end-spec.md\`) while displaying content within a virtual LCD area styled using the strict 4-color **DMG Screen palette**. UI components should follow custom pixel-art designs inspired by retro kits but built with modern practices (NativeWind/StyleSheet, potentially Skia/Reanimated 4), ensuring clarity and usability. Refer to \`16BitFit-Prototype-2.png\` and Figma/MagicPath designs (TBD) as primary visual guides.  
7.  **NFR7:** The combat UI (Health bars, timer, energy meter) shall emulate the style of Street Fighter 2.  
8.  **NFR8:** AI Home Avatar generation (face integration) should complete within a reasonable timeframe (target < 15 seconds) and produce a visually recognizable result consistent with the selected archetype body.  
9.  **NFR9:** Fitness data synchronization (steps) shall occur reliably in the background (when permissions allow) or upon app foregrounding, without excessive battery drain.  
10. **NFR10:** User-uploaded photos for avatar generation must be handled securely and comply with platform privacy policies (Apple/Google) and relevant regulations (e.g., GDPR). Health data access must strictly adhere to HealthKit/Health Connect guidelines.  
11. **NFR11:** The onboarding/FTUE process, including the tutorial battle, must be completable within 60 seconds (initial setup) / \~3-5 minutes (full flow including workout/battle) by 80% of new users.  
12. **NFR12:** The application must function correctly on target platforms: iOS (iPhone 12+) and Android (API Level 29+/Android 10+).  
13. **NFR13:** UI shell animations and transitions (React Native layer) must target 60fps and feel responsive (<100ms interaction feedback time), utilizing Reanimated 4 or similar performant libraries.

---
