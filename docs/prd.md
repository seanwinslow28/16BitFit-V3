# 16BitFit-V3 Product Requirements Document (PRD)

## Goals and Background Context

### Goals

* Achieve **8,000 downloads** within the first month post-launch.  
* Establish an initial daily revenue stream of **$30/day** within the first month post-launch.  
* Validate the **SBFG category concept** by achieving a **Day-30 retention rate of 25%**.  
* Secure an average **4.5+ star rating** on app stores within 3 months post-launch.  
* Successfully demonstrate the core SBFG loop: Fitness Activity -> Data Sync -> Avatar Evolution + Stat Increase -> Skill-Based Combat -> Feedback.  
* Meet technical performance targets: **60fps combat** (90% consistency), **<50ms input latency**, **<150MB peak memory**.

### Background Context

16BitFit-V3 pioneers the **SBFG (Strength-Based Fighting Game)** category, addressing a gap where existing fitness apps lack deep, skill-based engagement and mobile fighting games lack real-world health integration. It targets the "Skill-Focused Fitness Gamer" by transforming validated fitness data (steps, workouts via HealthKit/Health Connect) into core power mechanics for an authentic, retro (Street Fighter 2 inspired) mobile fighting game. The core problem is the high churn in fitness apps (>70% in 3 months) due to superficial gamification and the sedentary nature of engaging mobile games.

16BitFit-V3 proposes a unique solution: a hybrid React Native (shell) + Phaser 3 (WebView combat engine) architecture using the high-performance "Hybrid Velocity Bridge". Key differentiators include the dual progression system (fitness-driven visual avatar evolution + skill-based combat rank), authentic 60fps fighting mechanics powered by real fitness, AI-driven personalization (avatar face integration), and a distinct retro aesthetic. The MVP focuses on establishing this core loop with 2 playable characters vs. 1 AI boss, basic fitness sync, and avatar evolution (Stages 1-2).

### Change Log

| Date       | Version | Description                                | Author    |  
| :--------- | :------ | :----------------------------------------- | :-------- |  
| 2025-10-23 | 0.1     | Initial PRD draft started                  | John (PM) |  
| 2025-10-23 | 0.2     | Updated FR/NFR based on UI Prototypes      | John (PM) |  
| 2025-10-23 | 0.3     | Aligned PRD with front-end-spec.md details | John (PM) |

---

## Requirements

### Functional

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

### Non Functional

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

## User Interface Design Goals

**(Note: This section provides a high-level summary. Refer to \`docs/front-end-spec.md\` for complete UI/UX details, including specific palettes, components, flows, and interaction patterns.)**

### Overall UX Vision

To create an intuitive, engaging, and nostalgically authentic **"Modern Retro Fusion"** UI, blending Game Boy hardware aesthetics (shell) with a DMG-palette virtual screen, guided by modern UX principles like clarity and simplicity. The focus is on clear feedback for the dual progression (fitness/skill) and reinforcing the core SBFG loop.

### Key Interaction Paradigms

* **Retro Simulation:** Main shell app simulates Game Boy hardware interaction with modern touch input.  
* **Bottom Tab Bar Navigation:** Primary navigation within the virtual screen.  
* **"Cartridge Load" Transition:** Thematic transition animation when entering/exiting the Phaser WebView battle screen.  
* **Purposeful Juice:** Use of micro-animations, haptics, and sound to enhance feedback.

### Core Screens and Views (MVP)

Refer to \`front-end-spec.md\` for the detailed Site Map and User Flows. Key MVP screens include Onboarding, Home Dashboard, Workout Tracker, Battle Screen (WebView), Profile/Avatar, and basic Settings.

### Accessibility

Target WCAG AA compliance where feasible, with specific considerations outlined in \`front-end-spec.md\`.

### Branding

Strict adherence to the **Dual Palette System** (Hardware Shell vs. DMG Screen) and use of specified **Pixel Fonts** ("Press Start 2P", potentially "Inter"/"Montserrat") as defined in \`front-end-spec.md\`.

### Target Device and Platforms

Mobile Portrait (Shell), Mobile Landscape (Battle Screen) on iOS (12+) / Android (10+).

---

## Technical Assumptions

* **Repository Structure:** Monorepo likely favored based on V2 experience, potentially using Nx or Turborepo (Decision to be finalized by Architect).  
* **Service Architecture:** Hybrid - React Native shell + Phaser 3 WebView + Supabase BaaS. Potential for serverless functions (Supabase Edge Functions) for specific backend logic.  
* **Frontend (Shell):** React Native (latest stable version compatible with dependencies, e.g., 0.71.8+). Styling via NativeWind/StyleSheet. Will utilize **Reanimated 4** for animations and potentially **react-native-skia** for custom pixel rendering/effects. Requires specific pixel fonts ("Press Start 2P", etc.).  
* **Game Engine (WebView):** Phaser 3 (latest stable compatible version, e.g., 3.70.0+) running within a dedicated WebView.  
* **Backend:** Supabase (PostgreSQL + Real-time + Edge Functions).  
* **Asset Generation (AI):** DALL-E 3 for Home Avatar face integration; Gemini API (Image Gen/Edit) + potentially Veo/Midjourney keyframes for Combat/Boss sprites.  
* **Platform Targets:** iOS (iPhone 12+) and Android (10+).  
* **Core Integration:** High-performance "Hybrid Velocity Bridge" (binary protocol, <50ms latency target) between React Native and Phaser WebView is a critical requirement and assumed feasible based on V2.  
* **Fitness Data Integration:** Apple HealthKit and Google Fit (via Health Connect API) are the required sources for fitness data.  
* **Testing Requirements:** Standard mobile app testing practices. Specific focus on performance testing (FPS, latency, memory) for combat and integration testing for the RN-WebView bridge and fitness data sync. Automated testing frameworks appropriate for React Native (using specified testing libraries) and potentially Phaser to be determined by Architect.

---

## Epic List

1.  **Epic 1: Foundation & Core Loop Setup:** Establish the core application shell, basic fitness sync (HealthKit/Connect), AI avatar generation flow, character selection, home screen, and validate the fundamental 60fps combat loop against the Training Dummy.  
2.  **Epic 2: Fitness Progression Integration:** Implement the visual Home Avatar evolution (Stage 1 -> Stage 2), link fitness activity to Combat Character stat scaling, and add reactive feedback to the Home Avatar.

---

## Epic 1: Foundation & Core Loop Setup

**Epic Goal:** Establish the core application shell (React Native), integrate foundational backend services (Supabase), set up basic fitness data synchronization (HealthKit/Connect), implement the AI Home Avatar generation flow, allow Combat Character selection, display the basic Home Screen, and validate the core 60fps combat loop within the Phaser WebView against the Training Dummy AI opponent. This epic delivers the minimum testable SBFG experience.

**Integration Requirements:** Requires setting up connections to Supabase, platform-specific Health APIs (HealthKit/Connect), and the chosen AI API for avatar generation (DALL-E 3). Establishes the critical React Native <-> Phaser WebView bridge.

### Story 1.1: Project Initialization & Core Dependencies  
**As a** Developer,  
**I want** to initialize the React Native project structure (Monorepo setup TBD by Architect) and install core dependencies (React Native, Phaser, Supabase client, Navigation, Reanimated, Skia),  
**so that** the foundational codebase is established for subsequent features.

#### Acceptance Criteria  
1.  React Native project is initialized using the specified version (e.g., 0.71.8+).  
2.  Core dependencies (Phaser 3.70.0+, Supabase client, React Navigation, Reanimated 4, react-native-skia) are installed and configured.  
3.  Basic project structure (potentially within a Monorepo) is created following architectural guidance.  
4.  The application builds and runs successfully on both iOS simulator and Android emulator, displaying a placeholder screen.  
5.  Basic linting and formatting rules are configured.

### Story 1.2: Supabase Backend Setup & Basic Auth  
**As a** Developer,  
**I want** to configure the Supabase client, set up basic authentication (deferred auth option), and establish a basic user profile table,  
**so that** user data can be stored and managed securely.

#### Acceptance Criteria  
1.  Supabase client is initialized with project URL and anon key.  
2.  A basic \`profiles\` table is created in Supabase with necessary fields (user\_id, archetype, avatar\_url, evolution\_stage, etc.).  
3.  Basic email/password or social login (TBD) is configured, allowing users to sign up/in.  
4.  An option for deferred authentication (allowing initial use without login) is implemented.  
5.  User sessions are managed correctly.

### Story 1.3: HealthKit/Connect Integration & Step Sync  
**As a** Developer,  
**I want** to integrate platform-specific health APIs (Apple HealthKit, Google Fit via Health Connect) to request permissions and sync daily step count data,  
**so that** real-world fitness activity can be brought into the application.

#### Acceptance Criteria  
1.  Necessary libraries/modules for HealthKit (iOS) and Health Connect API (Android) are integrated.  
2.  The application correctly requests user permission to read step count data upon first relevant interaction.  
3.  Step count data for the current day is successfully fetched upon app launch/foregrounding (if permission granted).  
4.  Fetched step count is stored or updated in the user's profile/state.  
5.  Basic error handling is implemented for permission denial or sync failures.

### Story 1.4: Onboarding Flow - Profile & Archetype Selection  
**As a** New User,  
**I want** to be guided through creating a basic profile (optional login) and selecting my desired Fitness Archetype (Trainer, Runner, Yoga, Bodybuilder, Cyclist),  
**so that** I can begin personalizing my experience.

#### Acceptance Criteria  
1.  A multi-step onboarding UI flow is presented on first launch, following the retro aesthetic (NFR6).  
2.  User can create a profile (or choose to defer login).  
3.  User is presented with the five Fitness Archetype options.  
4.  User selection of an archetype is recorded and associated with their profile.  
5.  The onboarding flow transitions smoothly between steps.

### Story 1.5: Onboarding Flow - Photo Upload & AI Avatar Generation  
**As a** New User,  
**I want** to upload a headshot photo and have the system generate my personalized Home Avatar by merging my face with the chosen archetype body,  
**so that** I have a unique visual representation in the app.

#### Acceptance Criteria  
1.  User is prompted to upload a headshot photo during onboarding.  
2.  Photo upload functionality (camera/gallery access) is implemented.  
3.  The uploaded photo and selected archetype are sent to the AI service (DALL-E 3\) via a secure backend function (e.g., Supabase Edge Function).  
4.  The AI service successfully integrates the user's face onto the Stage 1 archetype body image.  
5.  The generated avatar image URL is received and stored in the user's profile.  
6.  A loading indicator is shown during generation (target < 15s).  
7.  Basic error handling for failed generation is implemented.

### Story 1.6: Combat Character Selection & Home Screen Display  
**As a** User,  
**I want** to select either "Sean" or "Mary" as my Combat Character and see my generated Home Avatar, progress rings, quest cartridge, tab bar, and fitness stats on the Home Screen,  
**so that** the main application hub is functional and personalized according to the UI spec.

#### Acceptance Criteria  
1.  User is prompted to select either "Sean" or "Mary" after avatar generation.  
2.  The selection is saved to the user's profile/state.  
3.  The Home Screen UI is implemented following the Game Boy aesthetic (NFR6), displaying content within the virtual LCD area using the DMG palette, and stats on the shell area using the Hardware palette.  
4.  The user's generated Home Avatar is displayed prominently (top-center) within the virtual screen.  
5.  **Dual Progress Rings**, a **Momentum/Streak Bar**, and the **"Quest Cartridge" button** are displayed below the avatar.  
6.  The **bottom Tab Bar** (Home, Battle, Profile, Settings) is displayed and functional (navigates to placeholder screens).  
7.  Key fitness stats (Steps, Calories, Workout Duration) are displayed on the **shell area** below the virtual screen.  
8.  Combat Character stats are accessible via the Profile tab.

### Story 1.7: WebView Bridge & Basic Combat Scene Setup  
**As a** Developer,  
**I want** to set up the React Native WebView component, implement the core "Hybrid Velocity Bridge" protocol, and load a basic Phaser 3 scene within the WebView,  
**so that** the foundation for high-performance communication and gameplay is established.

#### Acceptance Criteria  
1.  A dedicated WebView component is integrated into the React Native application.  
2.  The core binary message protocol for the Hybrid Velocity Bridge is implemented on both the React Native and Phaser sides.  
3.  Basic communication (e.g., sending a 'start game' event from RN to Phaser) is functional with low latency (<50ms target).  
4.  A basic Phaser 3 scene (e.g., PreloadScene, empty BattleScene) loads successfully within the WebView when navigating to the Battle screen. Navigation includes the "Cartridge Load" transition.  
5.  Performance baseline (FPS, memory) is established for the empty scene.

### Story 1.8: Implement Core Combat Mechanics & Training Dummy  
**As a** Player,  
**I want** my selected Combat Character (Sean/Mary) to respond to basic combat inputs (6 attacks, movement, jump, block) within the Phaser scene, and face a simple Training Dummy AI,  
**so that** the fundamental fighting gameplay is functional.

#### Acceptance Criteria  
1.  Selected Combat Character (Sean or Mary) sprite/animations are loaded into the Phaser BattleScene.  
2.  Virtual controls (D-pad, 6 buttons) are implemented in the UI layer (React Native or Phaser overlay, matching retro style) and correctly send input commands via the bridge to Phaser.  
3.  The Combat Character executes the corresponding basic actions (LP, MP, HP, LK, MK, HK, Walk, Jump, Block) in Phaser based on bridge commands.  
4.  A non-attacking "Training Dummy" AI opponent is implemented in the BattleScene.  
5.  Basic physics (gravity, collision detection between characters) are functional.  
6.  Combat actions feel responsive (validating <50ms latency target).

### Story 1.9: Integrate Combat UI & Step-Energy Mechanic  
**As a** Player,  
**I want** to see Health Bars, a timer, and my Energy Meter (fueled by synced steps) in the combat UI, and have the Energy Meter deplete/recharge appropriately,  
**so that** core combat resources and status are visible and functional.

#### Acceptance Criteria  
1.  Combat UI elements (Health Bars, Timer, Energy Meter) are implemented in the Phaser scene following SF2 style (NFR7).  
2.  Initial Health values are set for both characters.  
3.  A round timer starts and counts down.  
4.  The user's current step count (synced in Story 1.3) is used to determine the initial/max value of the Energy Meter.  
5.  A basic mechanic for using/depleting energy (placeholder action) and potentially recharging it is implemented.  
6.  The UI elements update correctly during gameplay (placeholder for damage/energy use).

### Story 1.10: Basic FTUE & Tutorial Battle Integration  
**As a** New User,  
**I want** the onboarding flow (including workout) to conclude with a brief tutorial battle against the Training Dummy, followed by a victory ceremony and landing on the Home Dashboard,  
**so that** I understand the core loop and controls.

#### Acceptance Criteria  
1.  The onboarding flow (incorporating Welcome, Intent, Avatar Creation \[Story 1.5\], Health Connect \[Story 1.3\], Daily Quest Assignment, Intro Workout, Workout Complete Ceremony) transitions smoothly into the tutorial segment.  
2.  The tutorial briefly explains basic movement and attack controls.  
3.  The tutorial initiates the first battle against the Training Dummy via the "Cartridge Load" animation.  
4.  Completion of the tutorial battle includes a Victory Ceremony and transitions the user back to the Home Dashboard, displaying initial rewards.  
5.  The entire FTUE (including tutorial battle) aims to be completable within \~3-5 minutes, with the initial setup (pre-workout) targeting <60 seconds (NFR11).

### Story 1.11: Achieve 60fps Performance Target  
**As a** Player,  
**I want** the combat gameplay against the Training Dummy to consistently run at 60fps on target devices,  
**so that** the fighting experience feels smooth and responsive.

#### Acceptance Criteria  
1.  Performance profiling is conducted during combat scenarios (Story 1.8, 1.9) on target devices (iPhone 12+, Android 10+ equivalent).  
2.  Optimizations (object pooling, texture atlasing, bridge communication frequency, etc.) are implemented as needed.  
3.  Combat achieves an average of 60fps with 90% consistency (NFR1).  
4.  Memory usage remains below 150MB peak (NFR3).  
5.  Input latency remains below 50ms (NFR2).

---

## Epic 2: Fitness Progression Integration

**Epic Goal:** Implement the visual evolution of the user's personalized Home Avatar from Stage 1 to Stage 2 based on accumulated fitness activity (steps, manual workouts). Link this fitness progression to tangible increases in the selected Combat Character's statistics (HP, damage). Display updated fitness and character stats on the Home Screen and add basic reactive animations to the Home Avatar.

**Integration Requirements:** Requires reading synced fitness data (steps) from user state/profile, accessing workout logs, updating user profile with evolution stage and character stats, and potentially calling the AI service again if the user opts for a new photo at Stage 2. Builds directly on the Home Screen and Combat Character systems established in Epic 1.

### Story 2.1: Implement Fitness-to-Evolution Progress Calculation  
**As a** Developer,  
**I want** to implement the logic that converts synced steps and manually logged workouts into a quantifiable "Evolution Progress" metric for the Home Avatar,  
**so that** fitness activity directly drives character progression.

#### Acceptance Criteria  
1.  A defined algorithm converts daily steps (from Story 1.3) into evolution progress points.  
2.  A defined algorithm converts manually logged workouts (from FR8) into evolution progress points (potentially weighted by type/duration).  
3.  Evolution progress points accumulate over time and are stored persistently (e.g., in Supabase profile).  
4.  A specific progress point threshold is defined for triggering the evolution from Stage 1 to Stage 2.  
5.  The calculation handles historical data correctly (e.g., progress accumulates even if the app isn't opened daily).

### Story 2.2: Implement Home Avatar Visual Evolution (Stage 1 to 2\)  
**As a** User,  
**I want** my personalized Home Avatar's appearance to automatically change from the Stage 1 body to the Stage 2 body when I reach the required fitness progress threshold, with an option to update my photo,  
**so that** I can visually see my fitness achievements reflected in my character.

#### Acceptance Criteria  
1.  When the user's Evolution Progress (from Story 2.1) crosses the Stage 2 threshold, the system flags the user for evolution.  
2.  Upon next app launch or relevant event, the user is presented with an option to evolve to Stage 2 (potentially via a celebratory 'Evolution Ceremony').  
3.  User is given the option to upload a new headshot photo for Stage 2 integration (FR11). If chosen, the AI generation process (from Story 1.5) is triggered using the Stage 2 archetype body image.  
4.  If the user declines a new photo or if generation fails, the existing face is merged with the Stage 2 archetype body image.  
5.  The user's profile is updated with the new Stage 2 avatar image URL and evolution stage status.  
6.  The Home Screen subsequently displays the new Stage 2 Home Avatar.

### Story 2.3: Implement Stat Scaling for Combat Characters  
**As a** Developer,  
**I want** to implement logic that increases the base stats (e.g., HP, base damage) of the selected Combat Character (Sean or Mary) based on the user's Home Avatar evolution stage (Stage 1 vs. Stage 2),  
**so that** fitness progression provides a tangible benefit in combat.

#### Acceptance Criteria  
1.  Base stats (HP, damage multipliers, etc.) are defined for Combat Characters at Stage 1.  
2.  Increased base stats or stat modifiers are defined for Combat Characters upon reaching Stage 2 evolution.  
3.  The system correctly calculates the Combat Character's current effective stats based on the user's current Home Avatar evolution stage.  
4.  These calculated stats are stored persistently or derived dynamically when needed for combat.  
5.  The stat scaling provides a noticeable but balanced advantage in combat (balancing TBD).

### Story 2.4: Update Home Screen with Live Stats  
**As a** User,  
**I want** the Home Screen shell area to display my actual current fitness stats (Steps, Calories - **if calculated**, Workout Duration - **if tracked**) and the Profile Tab to show my selected Combat Character's current, scaled stats,  
**so that** I have an up-to-date overview of my progress.

#### Acceptance Criteria  
1.  The Home Screen shell area correctly fetches and displays the user's current daily step count synced from HealthKit/Connect (Story 1.3).  
2.  The Home Screen shell area displays workout duration (based on manual logs from FR8 or potentially synced data if available).  
3.  **(Optional/Stretch for MVP - Requires Calculation Logic)** The Home Screen shell area displays an estimated calorie burn based on synced/logged activity.  
4.  The Profile Tab displays the selected Combat Character's stats (HP, etc.) reflecting the current scaling based on evolution stage (Story 2.3).  
5.  The displayed stats update appropriately when new fitness data is synced or when evolution occurs.

### Story 2.5: Implement Reactive Home Avatar Animations  
**As a** User,  
**I want** my Home Avatar on the Home Screen to show simple positive animations when I've been active recently and negative animations if I've been inactive,  
**so that** I get immediate, ambient feedback on my fitness consistency.

#### Acceptance Criteria  
1.  Criteria for "recently active" (e.g., met step goal yesterday, logged workout today) and "inactive" (e.g., missed step goal for X days) are defined.  
2.  Simple, distinct positive animation(s) (e.g., subtle smile, sparkle effect, idle blink variation) are created for the Home Avatar.  
3.  Simple, distinct negative animation(s) (e.g., subtle frown, sigh effect, idle blink variation) are created for the Home Avatar.  
4.  The Home Screen logic checks the user's recent activity status against the defined criteria.  
5.  The corresponding positive or negative animation plays periodically or on app load based on the user's status.  
6.  A neutral/default state animation (e.g., idle blink) exists.

---

## Checklist Results Report

### Executive Summary

* **Overall PRD Completeness:** \~90% (Very Good)  
* **MVP Scope Appropriateness:** Just Right (Clearly defined based on brief)  
* **Readiness for Architecture Phase:** Ready  
* **Most Critical Gaps or Concerns:** Minor clarifications needed, particularly around specific algorithms and potential UI/UX trade-offs with the retro aesthetic. Architect validation needed for performance NFRs.

### Category Analysis Table

| Category                         | Status    | Critical Issues                                      |  
| :------------------------------- | :-------- | :--------------------------------------------------- |  
| 1. Problem Definition & Context  | ✅ PASS   | None                                                 |  
| 2. MVP Scope Definition          | ✅ PASS   | None (Well-defined based on brief)     |  
| 3. User Experience Requirements  | ✅ PASS   | Minor: Orientation TBD, potential accessibility conflict |  
| 4. Functional Requirements       | ✅ PASS   | None (Clear mapping to MVP)          |  
| 5. Non-Functional Requirements   | ✅ PASS   | Minor: Need Architect validation on performance targets feasibility |  
| 6. Epic & Story Structure        | ✅ PASS   | None (Logical sequence, good MVP split) |  
| 7. Technical Guidance            | ✅ PASS   | None (Assumptions clearly stated)     |  
| 8. Cross-Functional Requirements | ✅ PASS   | None (Data/Integration clear for MVP)              |  
| 9. Clarity & Communication       | ✅ PASS   | None                                                 |

### Top Issues by Priority

* **BLOCKERS:** None identified.  
* **HIGH:**  
*    ** **Performance Feasibility (NFR1-3):** Architect needs to confirm 60fps/ <50ms latency / <150MB memory is realistically achievable with the WebView bridge based on V2 learnings. (Covered in Technical Assumptions, but needs explicit Architect validation).  
*    ** **Screen Orientation (UI Goals):** Decision needed (Portrait Shell vs. Landscape Combat) before detailed Architecture.  
* **MEDIUM:**  
*    ** **Accessibility vs. Aesthetic (UI Goals):** Potential conflict between WCAG AA target and Game Boy aesthetic needs careful consideration by Architect.  
*    ** **Algorithm Specifics (Story 2.1, 2.3):** Precise formulas for \`Fitness-to-Evolution\` and \`Stat Scaling\` are needed, likely defined during Architecture/Implementation. Note this for Architect/Dev.  
* **LOW:**  
*    ** **Calorie Calculation (Story 2.4):** Marked as optional/stretch; confirm if truly needed for MVP or defer.

### MVP Scope Assessment

* The defined MVP scope (Epics 1 & 2\) aligns perfectly with the Project Brief's requirements.  
* No features seem extraneous; the focus is clearly on validating the core SBFG loop.  
* No essential features appear missing for the stated MVP goals.  
* Complexity seems manageable, though performance targets (NFR1-3, 1.11) remain the highest technical risk.  
* Timeline realism depends heavily on achieving performance targets efficiently.

### Technical Readiness

* Technical assumptions are clearly stated, providing a solid foundation for the Architect.  
* Key technical risks (Bridge Performance, AI Generation) are acknowledged.  
* The Architect has clear direction on the required stack (RN, Phaser, Supabase, Reanimated, Skia) and critical integrations (HealthKit/Connect, AI).  
* Areas needing Architect definition (e.g., specific algorithms, Monorepo structure) are implicitly identified.

### Recommendations

1.  **Proceed to Architecture:** The PRD is sufficiently detailed and validated.  
2.  **Architect Validation:** Task the Architect with specifically validating the performance NFRs (NFR1-3) based on V2 learnings and the proposed V3 architecture.  
3.  **Orientation Decision:** Architect to finalize Combat Screen Orientation (Landscape recommended by UI Spec) and detail implementation.  
4.  **Algorithm Definition:** Note that specific algorithms (Evolution, Stat Scaling) need definition during Architecture/Implementation.  
5.  **Calorie Decision:** Confirm if calorie display (Story 2.4) is essential for MVP launch.

### Final Decision

* **READY FOR ARCHITECT**: The PRD is comprehensive, validated against the brief and market/competitive context, logically structured, aligned with the UI/UX Spec, and ready for the Architecture phase. Minor points noted require attention from the Architect.  
