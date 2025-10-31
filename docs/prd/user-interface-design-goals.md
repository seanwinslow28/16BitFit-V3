# User Interface Design Goals

**(Note: This section provides a high-level summary. Refer to \`docs/front-end-spec.md\` for complete UI/UX details, including specific palettes, components, flows, and interaction patterns.)**

## Overall UX Vision

To create an intuitive, engaging, and nostalgically authentic **"Modern Retro Fusion"** UI, blending Game Boy hardware aesthetics (shell) with a DMG-palette virtual screen, guided by modern UX principles like clarity and simplicity. The focus is on clear feedback for the dual progression (fitness/skill) and reinforcing the core SBFG loop.

## Key Interaction Paradigms

* **Retro Simulation:** Main shell app simulates Game Boy hardware interaction with modern touch input.  
* **Bottom Tab Bar Navigation:** Primary navigation within the virtual screen.  
* **"Cartridge Load" Transition:** Thematic transition animation when entering/exiting the Phaser WebView battle screen.  
* **Purposeful Juice:** Use of micro-animations, haptics, and sound to enhance feedback.

## Core Screens and Views (MVP)

Refer to \`front-end-spec.md\` for the detailed Site Map and User Flows. Key MVP screens include Onboarding, Home Dashboard, Workout Tracker, Battle Screen (WebView), Profile/Avatar, and basic Settings.

## Accessibility

Target WCAG AA compliance where feasible, with specific considerations outlined in \`front-end-spec.md\`.

## Branding

Strict adherence to the **Dual Palette System** (Hardware Shell vs. DMG Screen) and use of specified **Pixel Fonts** ("Press Start 2P", potentially "Inter"/"Montserrat") as defined in \`front-end-spec.md\`.

## Target Device and Platforms

Mobile Portrait (Shell), Mobile Landscape (Battle Screen) on iOS (12+) / Android (10+).

---
