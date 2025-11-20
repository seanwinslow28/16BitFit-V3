# 16BitFit-V3 Project Context & Antigravity Operating Rules

> **CRITICAL INSTRUCTION FOR AI AGENTS:**
> You are operating within the **BMAD Method** framework. You are not a generic assistant.
> When asked to perform a task, you must **Identify** the appropriate BMAD Role (Dev, Architect, PM, UX) and **Inhabit** that persona by reading their definition in `.bmad-core/agents/`.
> **Read this entire file before executing any code.**

## 1. The Vision ("The Why")
**16BitFit V3** transforms daily steps into RPG battles through a Game Boy-inspired fitness app. Users track real-world physical activity via Apple Health/Google Fit, converting steps into energy for turn-based combat training sessions.
* **Core Loop:** Walk IRL -> Earn Energy -> Fight Bosses in App -> Evolve Avatar.
* **Aesthetic:** "Modern Retro Fusion" simulating a physical Game Boy device (Shell) with a 4-color LCD screen (Content).

## 2. The Map ("The Where")
This is an **Nx Monorepo**. Do not hallucinate file paths.

* **`apps/mobile-shell/`**: The React Native (Expo) application. **(MAIN FOCUS)**
    * *Stack:* RN 0.71.8 (Strict Node 18 requirement), TypeScript, NativeWind, Zustand.
    * *Responsibility:* Native UI, HealthKit sync, Navigation, Hosting the WebView.
* **`apps/game-engine/`**: The Phaser 3 Game.
    * *Stack:* Phaser 3.70.0, Webpack.
    * *Responsibility:* All combat logic, physics, sprite rendering. Runs inside the WebView.
* **`.bmad-core/agents/`**: Your Persona Definitions.
    * *Usage:* When asked to be the "Dev Agent", read `.bmad-core/agents/dev.md`.
* **`docs/`**: The Single Source of Truth.
    * `docs/design-system/`: Component specs.
    * `docs/stories/`: Sharded implementation tasks.

## 3. The How (Tech Stack & Rules)

### ⚡ Critical Engineering Constraints
1.  **Node Version:** You MUST use **Node 18.20.8**. React Native 0.71.8 fails on Node 20+. Use `nvm use 18`.
2.  **Backend:** Supabase only (PostgreSQL, Edge Functions, Auth).
3.  **Design System:** STRICT adherence to the **LCD Screen-Only Palette** (Docs: `docs/design-system/design-tokens-LCD.md`).
    * Lightest: `#9BBC0F` | Light: `#8BAC0F` | Dark: `#306230` | Darkest: `#0F380F`
4.  **Testing:** Jest + RNTL. No Enzyme.

## 4. Current Status (November 2025)

### ✅ RECENT PROGRESS (Updated November 19, 2025)
**Story 1.4 (Onboarding) - BLOCKER RESOLVED**
* **Resolution:** Node version mismatch identified and fixed (switched from v22 → v18.20.8 using fnm)
* **Status:** Onboarding flow fully functional - Welcome, Profile Setup, and Archetype Selection screens all working
* **Next:** Ready to proceed to Story 1.5 (Photo Upload & AI Avatar Generation)

### ✅ STABLE
* Project setup and infrastructure (Story 1.1).
* Supabase backend integration (Story 1.2).
* Design system tokens.

### ✅ COMPONENT LIBRARY STATUS (Updated November 19, 2025)
* **Atomic Components:** **10/10 COMPLETE** ✅
  - All atoms implemented and verified working in Story 1.4 onboarding flow
  - Includes: PixelButton, PixelText, PixelInput, PixelSprite, PixelBorder, PixelIcon, PixelDivider, PixelBadge, PixelProgressBar, PixelCheckbox
* **Molecular Components:** **10/10 COMPLETE** ✅ 🎉
  - All molecules fully implemented with animations and full functionality
  - Includes: ArchetypeCard, FormField, ProgressIndicator, ToastNotification, ProfileHeader, StatBar, ActionSheet, EmptyState, LoadingSpinner, ConfirmDialog
  - **Status:** Component library is PRODUCTION READY for Story 1.5 and beyond!

## 5. BMAD Method Integration (The Team)

Antigravity Agents must map tasks to these specific BMAD personas found in `.bmad-core/agents/`:

| Task Domain | BMAD Role | File Source |
| :--- | :--- | :--- |
| **Coding, Bug Fixing, Implementation** | **Developer** (`@dev`) | `.bmad-core/agents/dev.md` |
| **System Design, Tech Stack, Bridge Protocol** | **Architect** (`@architect`) | `.bmad-core/agents/architect.md` |
| **Requirements, Stories, Priorities** | **Product Owner** (`@po`) | `.bmad-core/agents/po.md` |
| **UI Design, CSS/Styling, Animations** | **UX Expert** (`@ux`) | `.bmad-core/agents/ux-expert.md` |
| **QA, Testing, Validation** | **QA** (`@qa`) | `.bmad-core/agents/qa.md` |

### Antigravity Operating Protocol
1.  **Observe:** Identify which BMAD role is needed for the prompt.
2.  **Orient:** Read that agent's Markdown file in `.bmad-core/agents/` AND the relevant `docs/` file.
3.  **Act:** Execute the task using the terminal or file editor.
4.  **Report:** Confirm completion against the Acceptance Criteria in the Story file.

## 6. "Vibe CEO" Directives
* **Fix the Build First:** If the simulator doesn't run, features don't matter.
* **Simplicity > Complexity:** If you can do it with a sprite, don't use a skeleton.
* **No Hallucinations:** If a file is missing, ask before creating it.