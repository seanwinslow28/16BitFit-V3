# 16BitFit V3 - Complete Audio Asset Specification

Based on my analysis of the project documentation, including interaction patterns, combat mechanics, user flows, and design system specifications, here is a comprehensive audio asset list for the Game Boy-style fitness gamification app.

---

## BACKGROUND MUSIC (BGM) TRACKS

### BGM-001: Main Theme / Home Screen
**Description:** Uplifting, energetic Pokémon-style overworld theme for the Home Dashboard
**Style/Mood:** Nostalgic Game Boy chiptune, motivational, 8-bit instrumentation
**When it plays:** Home Screen (Game Boy shell view with avatar)
**Duration:** 90-120 seconds (loopable)
**Tempo:** 120-140 BPM
**Key Notes:** Should evoke excitement and readiness for fitness activities

### BGM-002: Onboarding Welcome
**Description:** Gentle, inviting Pokémon-style intro music
**Style/Mood:** Warm, friendly, encouraging 8-bit melody
**When it plays:** Welcome Screen (Story 1.4, Step 1/3)
**Duration:** 60-90 seconds (loopable)
**Tempo:** 100-120 BPM
**Key Notes:** Creates positive first impression, not too intense

### BGM-003: Profile Creation
**Description:** Light, anticipatory background music
**Style/Mood:** Soft 8-bit melody with subtle progression
**When it plays:** Profile Setup & Archetype Selection screens
**Duration:** 90-120 seconds (loopable)
**Tempo:** 110-130 BPM
**Key Notes:** Maintains engagement without overwhelming forms

### BGM-004: Battle Menu / Pre-Fight
**Description:** Intense Street Fighter 2-style character select music
**Style/Mood:** Building tension, arcade fighting game energy
**When it plays:** Battle screen navigation, character selection confirmation
**Duration:** 60-90 seconds (loopable)
**Tempo:** 130-150 BPM
**Key Notes:** Prepares player mentally for combat

### BGM-005: Training Dummy Battle
**Description:** Mid-tempo Street Fighter 2-style stage music
**Style/Mood:** Energetic but not overwhelming, training montage feel
**When it plays:** During battle against Training Dummy (Story 1.8)
**Duration:** 120-180 seconds (loopable)
**Tempo:** 140-160 BPM
**Key Notes:** Maintains energy for 99-second rounds, seamless loop

### BGM-006: Tutorial Battle
**Description:** Simplified, instructional Street Fighter-style music
**Style/Mood:** Clear, focused, less intense than regular battles
**When it plays:** First-time user tutorial battle (Story 1.10)
**Duration:** 90-120 seconds (loopable)
**Tempo:** 120-140 BPM
**Key Notes:** Doesn't distract from learning controls

### BGM-007: Victory Theme (Short)
**Description:** Triumphant Street Fighter 2-style victory jingle
**Style/Mood:** Celebratory, rewarding, 8-bit fanfare
**When it plays:** After winning a battle round
**Duration:** 5-8 seconds (non-looping)
**Tempo:** Variable (fanfare-style)
**Key Notes:** Clear victory signal, dopamine hit

### BGM-008: Evolution Ceremony
**Description:** Epic Pokémon evolution-style transformation music
**Style/Mood:** Building crescendo, magical, triumphant
**When it plays:** Home Avatar evolution from Stage 1 to Stage 2
**Duration:** 15-20 seconds (non-looping)
**Tempo:** Variable (builds from 100 to 140 BPM)
**Key Notes:** Emotional payoff for fitness progression

### BGM-009: Settings / Profile View
**Description:** Calm, utilitarian menu music
**Style/Mood:** Neutral, organized, Pokémon PC system-style
**When it plays:** Settings screen, Profile/Stats screen
**Duration:** 60-90 seconds (loopable)
**Tempo:** 90-110 BPM
**Key Notes:** Unobtrusive background for reading stats

---

## SOUND EFFECTS - UI INTERACTIONS

### SFX-UI-001: Button Press (Primary)
**Description:** Standard 8-bit button press sound (Pattern 1)
**Style/Mood:** Satisfying click, Game Boy tactile feedback
**When it plays:** Primary CTA buttons ("GET STARTED", "CREATE ACCOUNT", "CONTINUE")
**Duration:** 50ms
**Reference:** Interaction-patterns.md line 86-88
**Volume:** 40% system volume

### SFX-UI-002: Button Press (Secondary)
**Description:** Lighter 8-bit button press
**Style/Mood:** Softer click, less emphasized
**When it plays:** Secondary buttons, tertiary links
**Duration:** 40ms
**Volume:** 35% system volume

### SFX-UI-003: Card Select (Ascending Chime)
**Description:** Upward 8-bit chime for positive selection
**Style/Mood:** Pokémon menu selection style, cheerful
**When it plays:** Archetype card selection, character selection
**Duration:** 100ms
**Reference:** Interaction-patterns.md line 210-211
**Volume:** 45% system volume

### SFX-UI-004: Card Deselect (Descending Blip)
**Description:** Downward 8-bit blip for deselection
**Style/Mood:** Neutral, not negative, just different
**When it plays:** When another card is selected, deselecting previous
**Duration:** 100ms
**Reference:** Interaction-patterns.md line 211
**Volume:** 40% system volume

### SFX-UI-005: Input Focus
**Description:** Subtle selection beep
**Style/Mood:** Quiet, attention-grabbing
**When it plays:** Text input fields receive focus
**Duration:** 30ms
**Reference:** Interaction-patterns.md line 334-335
**Volume:** 30% system volume

### SFX-UI-006: Validation Error
**Description:** 8-bit "wrong" buzzer, SF2-style error tone
**Style/Mood:** Clear negative feedback, not harsh
**When it plays:** Form validation errors, shake animation (Pattern 4)
**Duration:** 200ms
**Reference:** Interaction-patterns.md line 432-433
**Volume:** 50% system volume

### SFX-UI-007: Validation Success (Short)
**Description:** Quick success chime, single note
**Style/Mood:** Rewarding, positive
**When it plays:** Quick success confirmations, field validation passes
**Duration:** 200ms
**Reference:** Interaction-patterns.md line 733
**Volume:** 45% system volume

### SFX-UI-008: Success Fanfare
**Description:** 8-bit melody celebrating major success
**Style/Mood:** Pokémon achievement-style, triumphant
**When it plays:** Profile creation success (Pattern 5), onboarding complete
**Duration:** 800ms
**Reference:** Interaction-patterns.md line 540-541
**Volume:** 60% system volume

### SFX-UI-009: Screen Transition Forward
**Description:** Ascending 8-bit tone, page turn sound
**Style/Mood:** Progress, movement forward
**When it plays:** Forward navigation in onboarding flow (Step 1→2→3)
**Duration:** 150ms
**Reference:** Interaction-patterns.md line 628
**Volume:** 40% system volume

### SFX-UI-010: Screen Transition Back
**Description:** Descending 8-bit tone, gentle return
**Style/Mood:** Neutral reversal, not negative
**When it plays:** Back button navigation
**Duration:** 150ms
**Reference:** Interaction-patterns.md line 629
**Volume:** 40% system volume

### SFX-UI-011: Loading Loop
**Description:** Subtle 8-bit loading pulse
**Style/Mood:** Calm, patient, non-intrusive
**When it plays:** During loading states (avatar generation, data sync)
**Duration:** 2000ms (loopable)
**Reference:** Interaction-patterns.md line 540
**Volume:** 20% system volume

### SFX-UI-012: Toast Appear
**Description:** Quick notification pop
**Style/Mood:** Attention-grabbing but not alarming
**When it plays:** Toast notifications slide in
**Duration:** 100ms
**Reference:** Interaction-patterns.md line 733-735
**Volume:** 40% system volume

### SFX-UI-013: Tab Switch
**Description:** Soft menu switch sound
**Style/Mood:** Clean, organized
**When it plays:** Bottom tab bar navigation (Home/Battle/Profile/Settings)
**Duration:** 80ms
**Volume:** 35% system volume

### SFX-UI-014: Cartridge Load Animation
**Description:** Game Boy cartridge insertion sound, mechanical click
**Style/Mood:** Nostalgic hardware simulation, satisfying
**When it plays:** "Cartridge Load" transition entering battle mode
**Duration:** 1200ms (includes mechanical sounds)
**Volume:** 55% system volume

### SFX-UI-015: Progress Ring Complete
**Description:** Celebration chime for ring completion
**Style/Mood:** Achievement unlocked style
**When it plays:** Daily or weekly progress ring fills completely
**Duration:** 500ms
**Volume:** 50% system volume

### SFX-UI-016: Streak Milestone
**Description:** Escalating chime sequence
**Style/Mood:** Increasingly celebratory
**When it plays:** Reaching 3, 7, 14, 30-day streaks
**Duration:** 600-800ms (varies by milestone)
**Volume:** 55% system volume

---

## SOUND EFFECTS - BATTLE / COMBAT

### SFX-COMBAT-001: Light Punch (Whiff)
**Description:** Quick whoosh sound, air punch
**Style/Mood:** SF2-style light attack
**When it plays:** Light punch executed, no connection
**Duration:** 150ms
**Volume:** 45% system volume

### SFX-COMBAT-002: Medium Punch (Whiff)
**Description:** Stronger whoosh, more force
**Style/Mood:** SF2-style medium attack
**When it plays:** Medium punch executed, no connection
**Duration:** 180ms
**Volume:** 50% system volume

### SFX-COMBAT-003: Heavy Punch (Whiff)
**Description:** Powerful whoosh with wind-up
**Style/Mood:** SF2-style heavy attack
**When it plays:** Heavy punch executed, no connection
**Duration:** 250ms
**Volume:** 55% system volume

### SFX-COMBAT-004: Light Kick (Whiff)
**Description:** Swift kick whoosh
**Style/Mood:** SF2-style light kick
**When it plays:** Light kick executed, no connection
**Duration:** 160ms
**Volume:** 45% system volume

### SFX-COMBAT-005: Medium Kick (Whiff)
**Description:** Moderate kick whoosh
**Style/Mood:** SF2-style medium kick
**When it plays:** Medium kick executed, no connection
**Duration:** 190ms
**Volume:** 50% system volume

### SFX-COMBAT-006: Heavy Kick (Whiff)
**Description:** Powerful kick whoosh with spin
**Style/Mood:** SF2-style heavy kick
**When it plays:** Heavy kick executed, no connection
**Duration:** 260ms
**Volume:** 55% system volume

### SFX-COMBAT-007: Hit Connect (Light)
**Description:** Light impact sound, SF2 hit confirm
**Style/Mood:** Satisfying contact, clear feedback
**When it plays:** Light attacks connect with opponent
**Duration:** 100ms
**Volume:** 50% system volume

### SFX-COMBAT-008: Hit Connect (Medium)
**Description:** Solid impact sound, stronger feedback
**Style/Mood:** Meaty hit, SF2-style
**When it plays:** Medium attacks connect with opponent
**Duration:** 120ms
**Volume:** 55% system volume

### SFX-COMBAT-009: Hit Connect (Heavy)
**Description:** Devastating impact with screen shake
**Style/Mood:** Powerful crunch, SF2 heavy hit
**When it plays:** Heavy attacks connect with opponent
**Duration:** 180ms
**Volume:** 65% system volume

### SFX-COMBAT-010: Block Sound
**Description:** Defensive shield block, SF2 guard
**Style/Mood:** Protective, deflective
**When it plays:** Attacks are blocked
**Duration:** 110ms
**Volume:** 50% system volume

### SFX-COMBAT-011: Damage Taken (Light)
**Description:** Character grunt, light pain
**Style/Mood:** SF2 character voice chip, 8-bit
**When it plays:** Character takes light damage
**Duration:** 150ms
**Volume:** 50% system volume

### SFX-COMBAT-012: Damage Taken (Heavy)
**Description:** Character heavy grunt, significant pain
**Style/Mood:** SF2 character voice chip, emphasized
**When it plays:** Character takes heavy damage
**Duration:** 250ms
**Volume:** 60% system volume

### SFX-COMBAT-013: Jump
**Description:** Upward whoosh, lift-off sound
**Style/Mood:** SF2 jump mechanic
**When it plays:** Character executes jump
**Duration:** 200ms (rise)
**Volume:** 45% system volume

### SFX-COMBAT-014: Land
**Description:** Impact landing thud
**Style/Mood:** Weight hitting ground
**When it plays:** Character lands after jump
**Duration:** 100ms
**Volume:** 50% system volume

### SFX-COMBAT-015: Walk/Step
**Description:** Footstep sound, 8-bit crunch
**Style/Mood:** Rhythmic movement
**When it plays:** Character walks forward/backward
**Duration:** 80ms (per step)
**Volume:** 35% system volume

### SFX-COMBAT-016: Combo Hit
**Description:** Rapid-fire hits sequence
**Style/Mood:** Combo counter escalation
**When it plays:** Multiple hits connect in succession
**Duration:** Variable (per hit in combo)
**Volume:** 50-60% system volume (escalating)

### SFX-COMBAT-017: Counter Hit
**Description:** Special impact sound with sparkle
**Style/Mood:** Extra satisfying, precision timing
**When it plays:** Attack connects during opponent's attack startup
**Duration:** 150ms
**Volume:** 65% system volume

### SFX-COMBAT-018: Round Start "FIGHT!"
**Description:** Announcer voice saying "FIGHT!"
**Style/Mood:** SF2-style 8-bit voice sample
**When it plays:** Round timer starts (99 seconds)
**Duration:** 600ms
**Volume:** 70% system volume

### SFX-COMBAT-019: Round End "K.O.!"
**Description:** Announcer voice saying "K.O.!"
**Style/Mood:** SF2-style 8-bit voice sample
**When it plays:** Opponent health reaches zero
**Duration:** 700ms
**Volume:** 70% system volume

### SFX-COMBAT-020: Round End "Time Up!"
**Description:** Announcer voice saying "TIME UP!"
**Style/Mood:** SF2-style 8-bit voice sample
**When it plays:** Round timer reaches zero
**Duration:** 800ms
**Volume:** 70% system volume

### SFX-COMBAT-021: Energy Meter Deplete
**Description:** Power-down sound, energy drain
**Style/Mood:** Mechanical drain, concern indicator
**When it plays:** Energy meter depletes below 20%
**Duration:** 400ms
**Volume:** 45% system volume

### SFX-COMBAT-022: Energy Meter Recharge
**Description:** Power-up sound, recharging
**Style/Mood:** Positive restoration
**When it plays:** Energy meter recharges via passive/hits
**Duration:** 300ms
**Volume:** 40% system volume

### SFX-COMBAT-023: Low Energy Warning
**Description:** Pulsing alert tone
**Style/Mood:** Urgent but not panic
**When it plays:** Energy meter critically low (<10%)
**Duration:** 200ms (repeating every 2 seconds)
**Volume:** 50% system volume

### SFX-COMBAT-024: Insufficient Energy
**Description:** Error buzz, denied action
**Style/Mood:** Clear negative feedback
**When it plays:** Player attempts action without enough energy
**Duration:** 150ms
**Volume:** 50% system volume

---

## SOUND EFFECTS - PROGRESSION / EVOLUTION

### SFX-PROG-001: Avatar Evolution Start
**Description:** Magical transformation initiation
**Style/Mood:** Pokémon evolution start, mystical
**When it plays:** Home Avatar begins Stage 1→2 evolution
**Duration:** 2000ms (building)
**Volume:** 60% system volume

### SFX-PROG-002: Avatar Evolution Complete
**Description:** Triumphant transformation finale
**Style/Mood:** Pokémon evolution complete, satisfying resolution
**When it plays:** Home Avatar evolution animation completes
**Duration:** 3000ms
**Volume:** 65% system volume

### SFX-PROG-003: Stat Increase
**Description:** Level-up style ascending tone
**Style/Mood:** RPG stat boost, clear improvement
**When it plays:** Combat character stats increase due to fitness progression
**Duration:** 500ms
**Volume:** 55% system volume

### SFX-PROG-004: Experience Gain
**Description:** Subtle points accumulation
**Style/Mood:** Rewarding, progressive
**When it plays:** Fitness activity contributes to evolution progress
**Duration:** 300ms
**Volume:** 40% system volume

### SFX-PROG-005: Threshold Reached
**Description:** Escalating alert, milestone approaching
**Style/Mood:** Excitement building
**When it plays:** Evolution progress reaches 90% threshold
**Duration:** 800ms
**Volume:** 50% system volume

### SFX-PROG-006: Workout Logged
**Description:** Confirmation beep with satisfaction
**Style/Mood:** Task complete, positive
**When it plays:** Manual workout entry confirmed
**Duration:** 400ms
**Volume:** 50% system volume

### SFX-PROG-007: Daily Goal Complete
**Description:** Achievement fanfare (medium)
**Style/Mood:** Celebratory, well done
**When it plays:** Daily step goal reached (10,000 steps)
**Duration:** 1000ms
**Volume:** 60% system volume

### SFX-PROG-008: Weekly Goal Complete
**Description:** Achievement fanfare (major)
**Style/Mood:** Epic celebration, big milestone
**When it plays:** Weekly fitness goals completed
**Duration:** 1500ms
**Volume:** 65% system volume

### SFX-PROG-009: Avatar Reaction Positive
**Description:** Happy chirp, character acknowledgment
**Style/Mood:** Cute, encouraging
**When it plays:** Home Avatar shows positive animation (recent activity detected)
**Duration:** 250ms
**Volume:** 45% system volume

### SFX-PROG-010: Avatar Reaction Negative
**Description:** Concerned sigh, gentle disappointment
**Style/Mood:** Not harsh, motivational nudge
**When it plays:** Home Avatar shows negative animation (inactivity detected)
**Duration:** 400ms
**Volume:** 40% system volume

---

## SOUND EFFECTS - ACHIEVEMENTS / REWARDS

### SFX-ACHIEVE-001: Achievement Unlock
**Description:** Triumphant achievement fanfare
**Style/Mood:** Xbox/PlayStation achievement-style, 8-bit
**When it plays:** Any achievement unlocked
**Duration:** 1200ms
**Volume:** 65% system volume

### SFX-ACHIEVE-002: First Battle Victory
**Description:** Special extended victory theme
**Style/Mood:** Tutorial complete, major milestone
**When it plays:** Defeating Training Dummy for first time
**Duration:** 5000ms
**Volume:** 65% system volume

### SFX-ACHIEVE-003: Perfect Victory
**Description:** Extra special victory theme
**Style/Mood:** Flawless performance, ultimate satisfaction
**When it plays:** Winning battle without taking damage
**Duration:** 3000ms
**Volume:** 70% system volume

### SFX-ACHIEVE-004: Streak Extended
**Description:** Building momentum sound
**Style/Mood:** Escalating excitement
**When it plays:** Daily activity streak continues
**Duration:** 600ms
**Volume:** 55% system volume

### SFX-ACHIEVE-005: Streak Broken
**Description:** Disappointed loss sound, not punishing
**Style/Mood:** Gentle letdown, motivational to restart
**When it plays:** Daily activity streak breaks
**Duration:** 800ms
**Volume:** 45% system volume

### SFX-ACHIEVE-006: Character Unlock
**Description:** New character fanfare
**Style/Mood:** Exciting new content, SF2 character select
**When it plays:** New combat character becomes available (post-MVP)
**Duration:** 2000ms
**Volume:** 65% system volume

### SFX-ACHIEVE-007: Boss Unlocked
**Description:** Ominous unlock sound
**Style/Mood:** Challenging content ahead, dramatic
**When it plays:** New boss becomes available (post-MVP)
**Duration:** 2500ms
**Volume:** 60% system volume

---

## SOUND EFFECTS - HEALTH / FITNESS DATA

### SFX-HEALTH-001: HealthKit Sync Start
**Description:** Data transfer initiation
**Style/Mood:** Technical, organized
**When it plays:** Health data sync begins
**Duration:** 300ms
**Volume:** 40% system volume

### SFX-HEALTH-002: HealthKit Sync Complete
**Description:** Successful data transfer
**Style/Mood:** Smooth confirmation
**When it plays:** Health data sync completes successfully
**Duration:** 500ms
**Volume:** 50% system volume

### SFX-HEALTH-003: HealthKit Sync Error
**Description:** Error alert, needs attention
**Style/Mood:** Clear problem indicator
**When it plays:** Health data sync fails
**Duration:** 600ms
**Volume:** 55% system volume

### SFX-HEALTH-004: Step Goal Progress (25%)
**Description:** Subtle milestone chime
**Style/Mood:** Encouraging progress
**When it plays:** Reaching 25%, 50%, 75% of daily step goal
**Duration:** 300ms
**Volume:** 40% system volume

### SFX-HEALTH-005: Real-Time Step Update
**Description:** Quiet tick sound
**Style/Mood:** Almost subliminal feedback
**When it plays:** Step count updates in real-time on Home Screen
**Duration:** 50ms
**Volume:** 25% system volume

---

## SOUND EFFECTS - ENVIRONMENTAL / AMBIENT

### SFX-AMB-001: Menu Hover
**Description:** Subtle selection hover
**Style/Mood:** Pokémon menu cursor movement
**When it plays:** Cursor/touch hovers over interactive elements
**Duration:** 40ms
**Volume:** 30% system volume

### SFX-AMB-002: Idle Avatar Blink
**Description:** Soft character animation sound
**Style/Mood:** Cute, lifelike
**When it plays:** Home Avatar idle animation blinks
**Duration:** 100ms
**Volume:** 35% system volume

### SFX-AMB-003: Weather Effect (Rain)
**Description:** 8-bit rain atmosphere
**Style/Mood:** Calming background ambiance
**When it plays:** Weather-based UI theme (optional future feature)
**Duration:** Looping
**Volume:** 20% system volume

### SFX-AMB-004: Quest Cartridge Pulse
**Description:** Glowing pulse sound
**Style/Mood:** Attention-grabbing, available action
**When it plays:** Quest Cartridge button available with new content
**Duration:** 500ms (repeating every 3 seconds)
**Volume:** 35% system volume

### SFX-AMB-005: Tutorial Hint
**Description:** Helper notification sound
**Style/Mood:** Friendly reminder, Pokémon Pokédex-style
**When it plays:** Tutorial prompts appear
**Duration:** 400ms
**Volume:** 45% system volume

---

## SOUND EFFECTS - SYSTEM / SETTINGS

### SFX-SYS-001: Settings Toggle On
**Description:** Switch activation sound
**Style/Mood:** Positive, enabled
**When it plays:** Toggle switches turned ON in settings
**Duration:** 150ms
**Volume:** 45% system volume

### SFX-SYS-002: Settings Toggle Off
**Description:** Switch deactivation sound
**Style/Mood:** Neutral, disabled
**When it plays:** Toggle switches turned OFF in settings
**Duration:** 150ms
**Volume:** 40% system volume

### SFX-SYS-003: Volume Adjustment
**Description:** Test tone for volume slider
**Style/Mood:** Simple reference tone
**When it plays:** Adjusting volume slider in settings
**Duration:** 200ms
**Volume:** Variable (follows slider)

### SFX-SYS-004: Logout Confirm
**Description:** Confirmation sound
**Style/Mood:** Final, decisive
**When it plays:** User confirms logout action
**Duration:** 500ms
**Volume:** 50% system volume

### SFX-SYS-005: Account Deleted
**Description:** Deletion confirmation
**Style/Mood:** Final, permanent
**When it plays:** Account deletion confirmed (destructive action)
**Duration:** 800ms
**Volume:** 55% system volume

### SFX-SYS-006: Permission Granted
**Description:** Access granted sound
**Style/Mood:** Welcoming, positive
**When it plays:** HealthKit/notification permissions granted
**Duration:** 600ms
**Volume:** 50% system volume

### SFX-SYS-007: Permission Denied
**Description:** Access denied sound
**Style/Mood:** Blocked, needs attention
**When it plays:** User denies required permissions
**Duration:** 500ms
**Volume:** 50% system volume

---

## AUDIO IMPLEMENTATION SPECIFICATIONS

### File Format Requirements
- **Format:** WAV (uncompressed) for source files
- **Export Format:** MP3 (for React Native) at 192kbps
- **Sample Rate:** 44.1kHz
- **Bit Depth:** 16-bit
- **Channels:** Mono (for SFX), Stereo (for BGM)
- **File Size Target:** <50KB per SFX, <500KB per BGM loop

### Audio Engine Configuration
```typescript
// Expo AV audio configuration
Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,  // Allow audio in silent mode
  staysActiveInBackground: false,  // Don't play when backgrounded
  shouldDuckAndroid: true,  // Lower volume for system sounds
  playThroughEarpieceAndroid: false,
});
```

### Volume Hierarchy (System Volume Percentages)
- **Critical Announcements:** 70% (Round start, K.O.)
- **Major Achievements:** 65-70% (Evolution complete, achievements)
- **Combat Effects:** 45-65% (Hits, attacks)
- **UI Feedback:** 35-50% (Buttons, selections)
- **Ambient/Background:** 20-35% (Environment, subtle cues)

### Audio Mixing Guidelines
- **Simultaneous Sounds:** Maximum 4 concurrent sounds
- **Priority System:**
  1. Critical feedback (errors, warnings)
  2. Combat sounds (hits, attacks)
  3. UI interactions (buttons, transitions)
  4. Background music (lowest priority, ducks for SFX)

### Reduced Motion / Accessibility
- **Setting:** "Reduce Audio Effects" toggle in Settings
- **Behavior:** Shortens SFX durations by 50%, disables ambient loops
- **Alternative:** Visual-only feedback when audio disabled

### Audio Preloading Strategy
```typescript
// Preload critical SFX on app launch
const criticalSounds = [
  'button-press.mp3',
  'error.mp3',
  'success-short.mp3',
  'hit-connect-light.mp3',
];

// Lazy load context-specific sounds
const battleSounds = []; // Load only when entering battle
const progressionSounds = []; // Load for evolution sequences
```

---

## ASSET NAMING CONVENTION

### Format
`[category]-[type]-[number]_[descriptor].wav`

### Examples
- `bgm-001_main-theme.wav`
- `sfx-ui-001_button-press.wav`
- `sfx-combat-007_hit-light.wav`
- `sfx-prog-002_evolution-complete.wav`

---

## PRODUCTION NOTES

### Chiptune Production Tools (Recommended)
- **FamiTracker** - Authentic NES/Game Boy sound
- **BeepBox** - Browser-based chiptune composer
- **LSDJ** - Game Boy tracker (for authentic GB sound)
- **Plogue Chipsounds** - VST instrument for DAWs
- **MilkyTracker** - Module tracker for retro sounds

### Reference Audio Analysis
**Pokémon Red/Blue (Game Boy):**
- Pallet Town theme (BGM reference)
- Menu selection sounds (UI reference)
- Battle intro (transition reference)
- Evolution music (progression reference)

**Street Fighter 2 (Arcade):**
- Character select theme (menu reference)
- Ryu's stage theme (battle reference)
- Hit sounds (combat reference)
- K.O./Victory sounds (feedback reference)

### Quality Assurance Checklist
- [ ] All files below target file size
- [ ] No audio clipping or distortion
- [ ] Seamless BGM loops (no pops/clicks)
- [ ] Volume levels balanced across all assets
- [ ] Sample rate and bit depth consistent
- [ ] Files properly named per convention
- [ ] Tested on iOS and Android devices
- [ ] Verified with device silent mode enabled
- [ ] Checked for timing issues with animations
- [ ] Accessibility features tested

---

## SUMMARY STATISTICS

**Total Audio Assets:** 95 unique files

**Breakdown:**
- Background Music (BGM): 9 tracks
- UI Sound Effects: 16 sounds
- Combat Sound Effects: 24 sounds
- Progression/Evolution: 10 sounds
- Achievements/Rewards: 7 sounds
- Health/Fitness Data: 5 sounds
- Environmental/Ambient: 5 sounds
- System/Settings: 7 sounds

**Estimated Total Storage:**
- SFX: ~2.5 MB (85 files × ~30KB average)
- BGM: ~4.5 MB (9 tracks × ~500KB average)
- **Total: ~7 MB** (compressed MP3s)

**Development Priority Tiers:**

**Tier 1 (MVP Critical):**
- All UI interaction sounds (16)
- Core combat sounds (18)
- Tutorial/onboarding BGM (3)
- Battle BGM (2)
- Essential progression (4)

**Tier 2 (Enhanced Experience):**
- Achievement sounds (7)
- Additional combat variations (6)
- Evolution ceremony audio (3)
- Health sync feedback (5)

**Tier 3 (Polish):**
- Ambient sounds (5)
- System/settings sounds (7)
- Additional BGM tracks (4)

---

## NEXT STEPS

1. **Audio Designer Handoff:** Share this specification with audio designer/composer
2. **Asset Production:** Create Tier 1 assets first (MVP critical)
3. **Integration Testing:** Test each sound with corresponding interaction pattern
4. **Performance Testing:** Verify no audio lag on target devices
5. **User Testing:** Gather feedback on volume levels and appropriateness
6. **Iteration:** Refine based on user feedback and performance metrics
7. **Finalization:** Complete Tier 2 and Tier 3 assets for full launch

---

**Document Version:** 1.0
**Created By:** UI/UX Specialist
**Date:** 2025-11-01
**Based On:** 16BitFit V3 Documentation (interaction-patterns.md, combat mechanics, user flows, PRD, brief)

---

This comprehensive audio specification document provides everything needed for an audio designer to create a complete, cohesive soundscape for 16BitFit V3. Each asset is tied to specific user interactions documented in the project, ensuring the audio enhances the Game Boy nostalgia and Street Fighter combat authenticity while supporting the fitness gamification mechanics.
