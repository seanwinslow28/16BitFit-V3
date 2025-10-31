\# 16BitFit-V3 UI/UX Specification

\#\# Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for 16BitFit-V3's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

\#\#\# Overall UX Goals & Principles

\#\#\#\# Target User Personas

\* \*\*Primary: Skill-Focused Fitness Gamer (Ryan):\*\* Ages 18-40, tech-savvy, enjoys competitive fighting games, motivated by mastery/skill improvement and tangible fitness results reflected in-game. Seeks authentic retro feel and high performance (60fps).  
\* \*\*Secondary: Gamification-Seeking Fitness Enthusiast (Gina):\*\* Ages 25-55, health-conscious, uses fitness trackers but finds them boring. Seeks engaging feedback, novelty, and motivation to combat fitness monotony. Values simplicity, clarity, and visual progress tracking (avatar evolution).  
\* \*\*Tertiary: Retro Gamer:\*\* Broad age range (20-50+), strong nostalgia for Game Boy/SF2 aesthetics and gameplay. Values authenticity. May be passively interested in fitness through a familiar gaming lens.

\#\#\#\# Usability Goals

\* \*\*Intuitive & Effortless:\*\* Users should understand core functionality immediately, aligning with Steve Jobs' philosophy of simplicity. Navigation should feel natural, requiring minimal cognitive load. Target onboarding completion \<60s.  
\* \*\*Engaging & Motivating:\*\* Leverage gaming psychology (rewards, progression, 'juice') to combat fitness app churn and foster long-term habit formation. The experience should feel fun and rewarding.  
\* \*\*Clear Feedback:\*\* Provide immediate, multi-sensory feedback (visual, haptic, audio) for user actions, fitness progress, and game events. Progress visualization (dual track rings) must be clear.  
\* \*\*Performant & Responsive:\*\* Achieve and maintain 60fps combat performance and \<50ms input latency. The UI shell must feel fluid and responsive, leveraging Reanimated.  
\* \*\*Authentic Aesthetic:\*\* Faithfully recreate the Game Boy visual style (DMG palette for shell, revised to Hardware palette for shell) while ensuring modern readability and usability standards are met. Combat adopts a separate SF2-inspired look.  
\* \*\*Accessible:\*\* Adhere to accessibility standards (WCAG AA minimum for contrast within palette limits, scalable text, support for reduced motion/haptics).

\#\#\#\# Design Principles

1\.  \*\*Modern Retro Fusion:\*\* Blend authentic Game Boy hardware aesthetics (shell colors) with modern UX principles (simplicity, clarity, minimalism inspired by shadcn) and the DMG green palette for screen content. "Steve Jobs at Nintendo."  
2\.  \*\*User Control & Respect:\*\* Provide granular control over notifications, gamification elements, and haptics. Avoid manipulative or high-pressure tactics.  
3\.  \*\*Juice with Purpose:\*\* Enhance interactions with satisfying micro-animations, sounds, and haptics, but ensure they add value and reinforce feedback, rather than just being decorative.  
4\.  \*\*Performance is Paramount:\*\* Every design decision must consider its impact on performance, especially the 60fps combat target.  
5\.  \*\*Clarity Above All:\*\* Ensure all UI elements, text, and flows are immediately understandable, minimizing cognitive load, even within the retro visual constraints.

\---

\#\# Information Architecture (IA)

\#\#\#\# Site Map / Screen Inventory

\`\`\`mermaid  
graph TD  
    A\[App Launch\] \--\> B(Onboarding);  
    B \--\> C{Home Dashboard};  
    C \--\> D\[Workout Tracker\];  
    C \--\> E\[Battle Screen (WebView)\];  
    C \--\> F\[Avatar Profile/Inspect\];  
    C \--\> G\[Settings\];  
    C \--\> H\[Guilds (Post-MVP)\];  
    C \--\> I\[Collections (Post-MVP)\];  
    D \--\> C;  
    E \--\> C;  
    F \--\> C;  
    G \--\> C;  
    H \--\> C;  
    I \--\> C;

#### **Navigation Structure**

* **Primary Navigation:** A bottom tab bar inspired by retro game menus, featuring pixelated icons and labels for key sections:  
  * **Home:** Displays the Home Avatar, Dual Rings, and Daily Quest access.  
  * **Battle:** Entry point to the Phaser combat scene (via "Cartridge Load"). Initially focuses on Boss Battles, later PvP.  
  * **Profile/Avatar:** Access to detailed stats, evolution progress, and cosmetic customization (Collections).  
  * **Settings:** App preferences, notification controls, account management, HealthKit/Fit connection status.  
* **Secondary Navigation:** Implemented within sections as needed (e.g., sub-menus within Settings, filters in Collections) using retro-styled buttons or lists.  
* **Breadcrumb Strategy:** Not applicable for this relatively flat mobile structure. Focus on clear back navigation (e.g., a pixelated back arrow in headers).

---

## **User Flows**

#### **Flow 1: First-Time Onboarding & Initial Loop**

* **User Goal:** Get set up, understand the core concept, and experience the basic fitness-to-battle loop for the first time.  
* **Entry Points:** App Launch after installation.  
* **Success Criteria:** User successfully creates their Home Avatar, connects health data, completes the short introductory workout, wins the tutorial battle, and lands on the Home Dashboard with their first rewards. Target completion time: \~3-5 minutes.

**Flow Diagram:**  
Code snippet  
graph TD  
    A\[App Launch\] \--\> B(Welcome Screen: Brief Pitch);  
    B \--\> C{Choose Intent: Fitter / Fun?};  
    C \--\> D\[Avatar Creation: Select Preset / Upload Photo\];  
    D \--\> E\[Health Data Connection: Grant Permissions\];  
    E \--\> F(Daily Quest Assigned: Intro Workout);  
    F \-- Tap Start \--\> G\[Workout Tracker: Guided 5-Min Session\];  
    G \--\> H{Workout Complete Ceremony: \+XP / \+Ticket};  
    H \-- Tap Continue \--\> I\["Cartridge Load" Animation\];  
    I \--\> J\[Battle Screen: Tutorial vs Training Dummy\];  
    J \--\> K{Battle Victory Ceremony: \+Skill / \+Loot};  
    K \-- Tap Continue \--\> L(Home Dashboard: First Rewards Shown);  
    L \--\> M\[End Onboarding Flow\];

*   
* **Edge Cases & Error Handling:**  
  * Health data permission denied: Offer manual entry option or explain value and re-prompt later.  
  * Avatar AI generation failure: Offer preset selection or retry option.  
  * Workout interruption: Allow pausing and resuming.  
  * Tutorial battle loss (should be impossible by design): Offer retry with hints.  
* **Notes:** This flow is critical for retention. It must be seamless, rewarding, and clearly communicate the SBFG concept through action. Use the "Irresistible Entry" and "Quick-Win" principles.

#### **Flow 2: Daily Engagement Loop (Workout \-\> Battle)**

* **User Goal:** Complete the daily fitness quest, use the earned Battle Ticket, and see progress reflected.  
* **Entry Points:** Opening the app on subsequent days (lands on Home Dashboard).  
* **Success Criteria:** User successfully starts and completes their selected workout, enters the battle screen, completes a battle (win or lose), and sees updated stats/progress on the Home Dashboard.

**Flow Diagram:**  
Code snippet  
graph TD  
    A\[Open App \--\> Home Dashboard\];  
    A \--\> B(Check Daily Reward / Streak);  
    B \-- Tap Claim \--\> C\[Claim Daily Reward Animation\];  
    C \--\> D{Tap Daily Quest Cartridge};  
    D \-- "Slot-In" Animation \--\> E\[Workout Tracker Screen\];  
    E \--\> F{Complete Workout};  
    F \--\> G\[Workout Complete Ceremony: \+XP / \+Ticket\];  
    G \--\> H{Return to Home Dashboard};  
    H \--\> I{Tap Battle Tab};  
    I \--\> J\["Cartridge Load" Animation\];  
    J \--\> K\[Battle Screen: Select Opponent (Training Dummy MVP)\];  
    K \--\> L{Complete Battle};  
    L \--\> M\[Battle Result Ceremony: \+Skill / \+Loot\];  
    M \--\> N{Check Evolution Gate};  
    N \-- Threshold Met \--\> O\[Evolution Ceremony\];  
    N \-- Not Met \--\> P\[Return to Home Dashboard\];  
    O \--\> P;

*   
* **Edge Cases & Error Handling:**  
  * No health data synced: Prompt user to check connection or enter manually.  
  * Tries to battle without a ticket: Show message "Complete your Daily Quest to earn a Battle Ticket\!".  
  * App closed mid-workout/battle: Attempt to save state and offer resume on next launch.  
* **Notes:** This flow represents the core repeatable loop. Transitions must be fluid, especially the "Cartridge Load" into the Phaser WebView. Reward moments after workout and battle need satisfying 'juice'.

---

## **Wireframes & Mockups**

#### **Design Files**

* **Primary Design & Prototyping Tools:** Detailed visual mockups and interactive prototypes will be created and maintained using **Figma**, supplemented by AI-driven prototyping tools like **MagicPath.ai** and potentially **21st.dev/magic** for rapid iteration and visualization. Figma will serve as the primary source of truth for pixel-perfect visual execution and component specifications. MagicPath.ai/21st.dev/magic outputs will be used for conceptualization and quick prototyping during the design phase.  
* **Visual References:**  
  * `16BitFit-Prototype-2.png` serves as the primary reference for the authentic Game Boy hardware shell aesthetic and screen content style.  
  * MagicPath prototype (`16BitFit Dashboard (1).png`) provides a reference for the component layout *within* the screen area (Avatar, Rings, Cartridge, Tabs).

#### **Key Screen Layouts**

* **Home Dashboard (Conceptual Layout based on Merged Direction):**  
  * **Purpose:** Primary landing screen; provides quick status overview (Avatar, Fitness/Skill progress, Streak) and entry point to core loops (Workout/Battle).  
  * **Key Elements:**  
    * Authentic Game Boy Shell frame (visual only).  
    * Virtual LCD Screen area using strict 4-color DMG palette.  
    * Centered Home Avatar (pixel art, idle blink).  
    * Dual Progress Rings (Fitness/Skill) below avatar.  
    * Momentum/Streak Bar below rings.  
    * Large "Quest Cartridge" button below rings.  
    * "Change Quest" link below cartridge.  
    * Bottom Tab Bar (Home, Battle, Profile, Settings) within LCD area.  
    * Stats Ribbon (Steps, Cals, Time) displayed *on the shell* below the screen.  
  * **Interaction Notes:** Tap Rings \-\> Stats Panel slides up. Tap Cartridge \-\> "Slot-in" animation, haptic, sound, navigates to Workout. Tap Tabs \-\> Navigate, light haptic.  
  * **Design File Reference:** Figma Link (TBD) / MagicPath Project Link (TBD) \- Will contain detailed mockups based on `16BitFit-Prototype-2.png` shell \+ modified screen layout.  
* **Workout Tracker Screen (Conceptual Layout):**  
  * **Purpose:** Minimalist interface for tracking active workouts, reducing cognitive load.  
  * **Key Elements:**  
    * Simple background (DMG palette).  
    * Large, centered display for primary metric.  
    * Large, easily tappable pixel art Start/Pause/Stop button.  
    * (Optional) Small indicator showing Home Avatar reacting.  
  * **Interaction Notes:** Tapping Start/Pause provides haptic feedback. Swiping might cycle metrics.  
  * **Design File Reference:** Figma Link (TBD) / MagicPath Project Link (TBD).  
* **Battle Screen (Conceptual Layout \- Phaser Scene):**  
  * **Purpose:** Display the core fighting game combat within the WebView.  
  * **Key Elements (Rendered by Phaser):**  
    * Side-scrolling stage background (SF2-inspired).  
    * Player/Opponent sprites.  
    * HUD elements (Health Bars, Timer) \- SF2 style.  
  * **Overlay Elements (Rendered by React Native):**  
    * Translucent on-screen pixel art D-pad/Buttons if needed.  
  * **Interaction Notes:** Touch controls trigger actions via bridge. Hits trigger effects/haptics.  
  * **Design File Reference:** Figma Link (TBD) \- Will show HUD layout/control concepts.

---

## **Component Library / Design System**

#### **Design System Approach**

* **Custom System:** We will create a **bespoke, custom component library** for 16BitFit-V3 rather than using a standard UI kit.  
* **Inspiration:** The system will draw heavy inspiration from existing retro/pixel UI kits (`RetroUI`, `nes-ui-react`, `Pixel UI & HUD Pack`) and design concepts (`Wordle GameBoy UI Kit`, `FlexUI Game Boy Kit`) to ensure authenticity and consistency.  
* **Philosophy:** Components will embody the "Modern Retro" principle: visually styled with pixel-perfect details and authentic palettes (Hardware colors for shell components, DMG green for screen components), but built with modern React Native practices for performance, accessibility, and composability (inspired by shadcn/ui principles).  
* **Implementation:** Components will likely be built using `React Native` core components, styled via `StyleSheet` (or NativeWind), potentially leveraging `react-native-skia` for custom pixel rendering/effects, and animated with `Reanimated 4`. Detailed technical specifications will be in the `front-end-architecture.md` document.

#### **Core Components (Initial List \- Non-Exhaustive)**

* **PixelButton:**  
  * **Purpose:** Primary interactive element.  
  * **Variants:** Primary (Magenta hardware color), Secondary (Gray hardware color), DMG Green variants (on-screen). Sizes (L, M, S).  
  * **States:** Idle, Pressed, Disabled.  
  * **Usage:** Quest Cartridge, menus. Styled like `16BitFit-Prototype-2.png` buttons.  
* **PixelPanel/Card:**  
  * **Purpose:** Content container.  
  * **Variants:** Shell Background (`#D7D5CA`), Screen Background (`#9BBC0F`).  
  * **States:** Static.  
  * **Usage:** Avatar container, stats panels. Sharp pixel borders (`#9A9A9A` or `#0F380F`).  
* **PixelProgressBar/Ring:**  
  * **Purpose:** Visualize progress.  
  * **Variants:** Horizontal Bar, Circular Ring. DMG Green palette.  
  * **States:** Filled percentage.  
  * **Usage:** Dual Rings, health bars. Pixel-perfect rendering.  
* **PixelIcon:**  
  * **Purpose:** Visual representation.  
  * **Variants:** 16x16 or 32x32 icons.  
  * **States:** Idle, Active.  
  * **Usage:** Tab Bar, Status Row. Must use DMG Green palette when on-screen.  
* **PixelTabBar:**  
  * **Purpose:** Primary navigation.  
  * **Variants:** Bottom fixed bar within LCD.  
  * **States:** Active tab highlighted.  
  * **Usage:** Main navigation.

---

## **Branding & Style Guide**

#### **Visual Identity**

* **Brand Guidelines:** This document and Figma (TBD) serve as guidelines. Core identity: "Modern Retro," blending authentic Game Boy Classic hardware aesthetics with modern usability.  
* **Logo:** (Placeholder \- TBD) \- Pixel-art logo.

#### **Color Palette**

* **Shell Palette (React Native UI Chrome):** Based on Game Boy Classic hardware.  
  * `body`: `#D7D5CA` (Warm light gray-beige)  
  * `bezel`: `#9A9A9A` (Cool gray)  
  * `recess`: `#6C6B6B` (Deep gray)  
  * `text/dpad`: `#1C1C1C` (Glossy black)  
  * `buttonAB`: `#B64A75` (Deep magenta)  
  * `buttonSS`: `#9E9E9E` (Cool gray)  
  * `accentBlue`: `#2C3FA3` (Royal blue \- sparingly)  
* **Screen Palette (Virtual LCD Content \- DMG):** Strict 4-color monochrome green.  
  * `darkest`: `#0F380F`  
  * `dark`: `#306230`  
  * `light`: `#8BAC0F`  
  * `lightest`: `#9BBC0F`  
* **Usage:** Shell palette for app chrome/menus outside screen. Screen palette *exclusively* for content within virtual LCD. Battle screen uses separate SF2 palette (TBD).

#### **Typography**

* **Font Families:**  
  * **Primary (Headers/Labels):** "Press Start 2P".  
  * **Secondary (Body/UI Text):** "Inter" or "Montserrat" (Clean Sans-Serif) \- Sparingly for readability.  
* **Type Scale (Conceptual):**  
  * H1: \~12-16px Pixel Font  
  * H2: \~10-12px Pixel Font  
  * Body: \~16px Modern Sans  
  * Labels: \~8-10px Pixel Font  
  * Micro Text: \~6-8px Pixel Font

#### **Iconography**

* **Icon Library:** Custom **pixel art icons** (16x16 or 32x32).  
* **Usage:** Icons on LCD use DMG palette. Icons on shell use hardware palette.  
* **Guidelines:** Simple, recognizable representations.

#### **Spacing & Layout**

* **Grid System:** Adhere to an **8-pixel grid** where possible, prioritizing modern usability (whitespace, hierarchy).  
* **Spacing Scale (Conceptual):** Multiples of 4 or 8 pixels (4px, 8px, 16px, 24px).

---

## **Accessibility Requirements**

#### **Compliance Target**

* **Standard:** Aim for **WCAG 2.1 Level AA** compliance where feasible. Prioritize AA for essential text and controls, especially on the shell background. Offer high-contrast mode if needed.

#### **Key Requirements**

* **Visual:**  
  * **Color Contrast:** Maximize contrast within DMG palette (darkest on lightest). Ensure shell text (`#1C1C1C` on `#D7D5CA`) meets AA (4.5:1).  
  * **Focus Indicators:** Clear, visible focus states using borders or color inversion.  
  * **Text Sizing:** Allow system font scaling for modern sans text. Ensure default pixel font sizes are legible.  
* **Interaction:**  
  * **Keyboard Navigation:** Logical order.  
  * **Screen Reader Support:** Descriptive `accessibilityLabel`, `Role`, `State`.  
  * **Touch Targets:** Minimum 44x44dp.  
* **Content:**  
  * **Alternative Text:** Labels for meaningful images/icons.  
  * **Heading Structure:** Semantic structure.  
  * **Form Labels:** Clear association.

#### **Testing Strategy**

* **Manual Testing:** Screen readers, keyboard nav.  
* **Automated Testing:** Linting, accessibility checkers.  
* **User Testing:** Include users with disabilities.  
* **Contrast Checks:** Use tools (e.g., WebAIM).

---

## **Responsiveness Strategy**

#### **Breakpoints**

* **Primary Target:** Mobile portrait.  
* **Tablet Adaptation:** Graceful scaling in portrait (proportional shell, fixed content size). Use dp/pt.  
* **Landscape Mode:**  
  * **Shell/UI:** Strictly **portrait-only**.  
  * **Battle Screen (Phaser):** Switches to **landscape mode** via "Cartridge Load" transition. Locks back to portrait on exit.

#### **Adaptation Patterns**

* **Layout Scaling:** Shell scales proportionally; content inside LCD remains mostly fixed pixel size.  
* **Navigation Changes:** Bottom tab bar remains fixed.  
* **Content Priority:** Core elements remain focus.  
* **Interaction Changes:** Touch targets maintained.

---

## **Animation & Micro-interactions**

#### **Motion Principles**

* **Fluid Retro:** Smooth animations (Reanimated) visually styled as retro (pixel dissolves, sprite-like motion).  
* **Purposeful Juice:** Enhance feedback and delight, avoid decoration.  
* **Performance First:** 60fps UI target, run on native thread.  
* **Consistency:** Use defined easing/durations.  
* **Accessibility:** Respect "Reduce Motion" settings.

#### **Key Animations (Micro-Interaction Library Examples)**

* **Button Press/Release:**  
  * *Visual:* Scale down (0.96), move down 1px (\~150ms); spring back with overshoot (\~100ms).  
  * *Haptic:* Light/Medium impact.  
  * *Audio:* 8-bit "blip" or "click".  
* **Screen Transition (Pixel Dissolve):**  
  * *Visual:* Skia shader animates pixelation (0 to \~8px blocks, \~500ms total). Use fades for minor transitions.  
* **Stat Gain / Progress Bar Fill:**  
  * *Visual:* Bar fill animates (\~300ms). Optional pixel particles flow (\~300ms). Flash/glow on completion (\~100ms).  
  * *Haptic:* Light success pattern.  
  * *Audio:* Positive jingle/sound.  
* **Notifications / Toasts:**  
  * *Visual:* Slide in/out (\~300ms ease-out/in), slight bounce. Style like pixel speech bubbles.  
  * *Haptic:* Notification pattern.  
  * *Audio:* Notification sound.  
* **Evolution / Milestone Ceremony:**  
  * *Visual:* Longer sequence (\~1200ms) with screen effects, avatar animation, particles, banner text.  
  * *Haptic:* Coordinated heavy success pattern.  
  * *Audio:* Fanfare/jingle.

---

## **Performance Considerations**

#### **Performance Goals**

* **UI Responsiveness:** \<100ms response time for inputs. 60fps UI animations.  
* **App Load Time:** Cold start \<3 seconds. Warm start \<1 second.  
* **Memory Usage (Total):** \<150MB peak during battles.  
* **Battery Consumption:** Minimize drain through optimization.

#### **Design Strategies**

* **Minimize Re-renders:** Efficient RN component structure.  
* **Optimize Assets:** Sprite atlases, indexed PNGs.  
* **Lazy Loading:** For non-critical components/assets.  
* **Efficient Animations:** Reanimated 4 worklets, Skia for custom drawing.  
* **WebView Management:** Preloading/pooling, pause on background.

---

## **Next Steps**

#### **Immediate Actions**

1. **Finalize & Save Spec:** Save this completed UI/UX Specification document as `docs/front-end-spec.md` in the `16BitFit-V3` project repository.  
2. **(Optional) Generate AI UI Prompt:** Execute the `*generate-ui-prompt` command if desired, using this spec and the PRD as input to create a prompt for tools like v0/Lovable.  
3. **Initiate Architect Handoff:** Provide this UI/UX Specification, along with the PRD (`docs/prd.md`), to the Architect (`architect`) agent to begin the **Frontend Architecture** (`front-end-architecture-tmpl.yaml`) or **Fullstack Architecture** (`fullstack-architecture-tmpl.yaml`) creation process.  
4. **Create Visual Designs (Figma, MagicPath.ai, etc.):** Begin detailed, pixel-perfect mockups and interactive prototypes in **Figma**, supplemented by **MagicPath.ai** and potentially **21st.dev/magic** for rapid iteration, based on this specification.

#### **Design Handoff Checklist**

* \[X\] Overall UX Goals & Principles Defined  
* \[X\] Information Architecture (Site Map, Navigation) Mapped  
* \[X\] Core User Flows (Onboarding, Daily Loop) Documented  
* \[ \] Detailed Mockups/Prototypes in Figma/MagicPath.ai (To Be Created)  
* \[X\] Component Library Approach Defined (Custom Modern Retro)  
* \[X\] Branding & Style Guide Established (Dual Palette System)  
* \[X\] Accessibility Requirements Defined (WCAG AA Target)  
* \[X\] Responsiveness Strategy Clear (Portrait Shell, Landscape Battle)  
* \[X\] Animation Principles & Key Micro-interactions Specified  
* \[X\] Performance Goals & Strategies Outlined

---

## **Checklist Results**

* (Placeholder: If a specific UI/UX checklist is defined and executed against this document, the results would be summarized here. Currently, no specific checklist was run during the creation of this spec.)

