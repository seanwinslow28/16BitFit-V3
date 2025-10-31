# Epic 1: Foundation & Core Loop Setup

**Epic Goal:** Establish the core application shell (React Native), integrate foundational backend services (Supabase), set up basic fitness data synchronization (HealthKit/Connect), implement the AI Home Avatar generation flow, allow Combat Character selection, display the basic Home Screen, and validate the core 60fps combat loop within the Phaser WebView against the Training Dummy AI opponent. This epic delivers the minimum testable SBFG experience.

**Integration Requirements:** Requires setting up connections to Supabase, platform-specific Health APIs (HealthKit/Connect), and the chosen AI API for avatar generation (DALL-E 3). Establishes the critical React Native <-> Phaser WebView bridge.

## Story 1.1: Project Initialization & Core Dependencies  
**As a** Developer,  
**I want** to initialize the React Native project structure (Monorepo setup TBD by Architect) and install core dependencies (React Native, Phaser, Supabase client, Navigation, Reanimated, Skia),  
**so that** the foundational codebase is established for subsequent features.

### Acceptance Criteria  
1.  React Native project is initialized using the specified version (e.g., 0.71.8+).  
2.  Core dependencies (Phaser 3.70.0+, Supabase client, React Navigation, Reanimated 4, react-native-skia) are installed and configured.  
3.  Basic project structure (potentially within a Monorepo) is created following architectural guidance.  
4.  The application builds and runs successfully on both iOS simulator and Android emulator, displaying a placeholder screen.  
5.  Basic linting and formatting rules are configured.

## Story 1.2: Supabase Backend Setup & Basic Auth  
**As a** Developer,  
**I want** to configure the Supabase client, set up basic authentication (deferred auth option), and establish a basic user profile table,  
**so that** user data can be stored and managed securely.

### Acceptance Criteria  
1.  Supabase client is initialized with project URL and anon key.  
2.  A basic \`profiles\` table is created in Supabase with necessary fields (user\_id, archetype, avatar\_url, evolution\_stage, etc.).  
3.  Basic email/password or social login (TBD) is configured, allowing users to sign up/in.  
4.  An option for deferred authentication (allowing initial use without login) is implemented.  
5.  User sessions are managed correctly.

## Story 1.3: HealthKit/Connect Integration & Step Sync  
**As a** Developer,  
**I want** to integrate platform-specific health APIs (Apple HealthKit, Google Fit via Health Connect) to request permissions and sync daily step count data,  
**so that** real-world fitness activity can be brought into the application.

### Acceptance Criteria  
1.  Necessary libraries/modules for HealthKit (iOS) and Health Connect API (Android) are integrated.  
2.  The application correctly requests user permission to read step count data upon first relevant interaction.  
3.  Step count data for the current day is successfully fetched upon app launch/foregrounding (if permission granted).  
4.  Fetched step count is stored or updated in the user's profile/state.  
5.  Basic error handling is implemented for permission denial or sync failures.

## Story 1.4: Onboarding Flow - Profile & Archetype Selection  
**As a** New User,  
**I want** to be guided through creating a basic profile (optional login) and selecting my desired Fitness Archetype (Trainer, Runner, Yoga, Bodybuilder, Cyclist),  
**so that** I can begin personalizing my experience.

### Acceptance Criteria  
1.  A multi-step onboarding UI flow is presented on first launch, following the retro aesthetic (NFR6).  
2.  User can create a profile (or choose to defer login).  
3.  User is presented with the five Fitness Archetype options.  
4.  User selection of an archetype is recorded and associated with their profile.  
5.  The onboarding flow transitions smoothly between steps.

## Story 1.5: Onboarding Flow - Photo Upload & AI Avatar Generation  
**As a** New User,  
**I want** to upload a headshot photo and have the system generate my personalized Home Avatar by merging my face with the chosen archetype body,  
**so that** I have a unique visual representation in the app.

### Acceptance Criteria  
1.  User is prompted to upload a headshot photo during onboarding.  
2.  Photo upload functionality (camera/gallery access) is implemented.  
3.  The uploaded photo and selected archetype are sent to the AI service (DALL-E 3\) via a secure backend function (e.g., Supabase Edge Function).  
4.  The AI service successfully integrates the user's face onto the Stage 1 archetype body image.  
5.  The generated avatar image URL is received and stored in the user's profile.  
6.  A loading indicator is shown during generation (target < 15s).  
7.  Basic error handling for failed generation is implemented.

## Story 1.6: Combat Character Selection & Home Screen Display  
**As a** User,  
**I want** to select either "Sean" or "Mary" as my Combat Character and see my generated Home Avatar, progress rings, quest cartridge, tab bar, and fitness stats on the Home Screen,  
**so that** the main application hub is functional and personalized according to the UI spec.

### Acceptance Criteria  
1.  User is prompted to select either "Sean" or "Mary" after avatar generation.  
2.  The selection is saved to the user's profile/state.  
3.  The Home Screen UI is implemented following the Game Boy aesthetic (NFR6), displaying content within the virtual LCD area using the DMG palette, and stats on the shell area using the Hardware palette.  
4.  The user's generated Home Avatar is displayed prominently (top-center) within the virtual screen.  
5.  **Dual Progress Rings**, a **Momentum/Streak Bar**, and the **"Quest Cartridge" button** are displayed below the avatar.  
6.  The **bottom Tab Bar** (Home, Battle, Profile, Settings) is displayed and functional (navigates to placeholder screens).  
7.  Key fitness stats (Steps, Calories, Workout Duration) are displayed on the **shell area** below the virtual screen.  
8.  Combat Character stats are accessible via the Profile tab.

## Story 1.7: WebView Bridge & Basic Combat Scene Setup  
**As a** Developer,  
**I want** to set up the React Native WebView component, implement the core "Hybrid Velocity Bridge" protocol, and load a basic Phaser 3 scene within the WebView,  
**so that** the foundation for high-performance communication and gameplay is established.

### Acceptance Criteria  
1.  A dedicated WebView component is integrated into the React Native application.  
2.  The core binary message protocol for the Hybrid Velocity Bridge is implemented on both the React Native and Phaser sides.  
3.  Basic communication (e.g., sending a 'start game' event from RN to Phaser) is functional with low latency (<50ms target).  
4.  A basic Phaser 3 scene (e.g., PreloadScene, empty BattleScene) loads successfully within the WebView when navigating to the Battle screen. Navigation includes the "Cartridge Load" transition.  
5.  Performance baseline (FPS, memory) is established for the empty scene.

## Story 1.8: Implement Core Combat Mechanics & Training Dummy  
**As a** Player,  
**I want** my selected Combat Character (Sean/Mary) to respond to basic combat inputs (6 attacks, movement, jump, block) within the Phaser scene, and face a simple Training Dummy AI,  
**so that** the fundamental fighting gameplay is functional.

### Acceptance Criteria  
1.  Selected Combat Character (Sean or Mary) sprite/animations are loaded into the Phaser BattleScene.  
2.  Virtual controls (D-pad, 6 buttons) are implemented in the UI layer (React Native or Phaser overlay, matching retro style) and correctly send input commands via the bridge to Phaser.  
3.  The Combat Character executes the corresponding basic actions (LP, MP, HP, LK, MK, HK, Walk, Jump, Block) in Phaser based on bridge commands.  
4.  A non-attacking "Training Dummy" AI opponent is implemented in the BattleScene.  
5.  Basic physics (gravity, collision detection between characters) are functional.  
6.  Combat actions feel responsive (validating <50ms latency target).

## Story 1.9: Integrate Combat UI & Step-Energy Mechanic  
**As a** Player,  
**I want** to see Health Bars, a timer, and my Energy Meter (fueled by synced steps) in the combat UI, and have the Energy Meter deplete/recharge appropriately,  
**so that** core combat resources and status are visible and functional.

### Acceptance Criteria  
1.  Combat UI elements (Health Bars, Timer, Energy Meter) are implemented in the Phaser scene following SF2 style (NFR7).  
2.  Initial Health values are set for both characters.  
3.  A round timer starts and counts down.  
4.  The user's current step count (synced in Story 1.3) is used to determine the initial/max value of the Energy Meter.  
5.  A basic mechanic for using/depleting energy (placeholder action) and potentially recharging it is implemented.  
6.  The UI elements update correctly during gameplay (placeholder for damage/energy use).

## Story 1.10: Basic FTUE & Tutorial Battle Integration  
**As a** New User,  
**I want** the onboarding flow (including workout) to conclude with a brief tutorial battle against the Training Dummy, followed by a victory ceremony and landing on the Home Dashboard,  
**so that** I understand the core loop and controls.

### Acceptance Criteria  
1.  The onboarding flow (incorporating Welcome, Intent, Avatar Creation \[Story 1.5\], Health Connect \[Story 1.3\], Daily Quest Assignment, Intro Workout, Workout Complete Ceremony) transitions smoothly into the tutorial segment.  
2.  The tutorial briefly explains basic movement and attack controls.  
3.  The tutorial initiates the first battle against the Training Dummy via the "Cartridge Load" animation.  
4.  Completion of the tutorial battle includes a Victory Ceremony and transitions the user back to the Home Dashboard, displaying initial rewards.  
5.  The entire FTUE (including tutorial battle) aims to be completable within \~3-5 minutes, with the initial setup (pre-workout) targeting <60 seconds (NFR11).

## Story 1.11: Achieve 60fps Performance Target  
**As a** Player,  
**I want** the combat gameplay against the Training Dummy to consistently run at 60fps on target devices,  
**so that** the fighting experience feels smooth and responsive.

### Acceptance Criteria  
1.  Performance profiling is conducted during combat scenarios (Story 1.8, 1.9) on target devices (iPhone 12+, Android 10+ equivalent).  
2.  Optimizations (object pooling, texture atlasing, bridge communication frequency, etc.) are implemented as needed.  
3.  Combat achieves an average of 60fps with 90% consistency (NFR1).  
4.  Memory usage remains below 150MB peak (NFR3).  
5.  Input latency remains below 50ms (NFR2).

---
