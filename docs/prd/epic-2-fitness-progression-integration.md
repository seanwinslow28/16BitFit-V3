# Epic 2: Fitness Progression Integration

**Epic Goal:** Implement the visual evolution of the user's personalized Home Avatar from Stage 1 to Stage 2 based on accumulated fitness activity (steps, manual workouts). Link this fitness progression to tangible increases in the selected Combat Character's statistics (HP, damage). Display updated fitness and character stats on the Home Screen and add basic reactive animations to the Home Avatar.

**Integration Requirements:** Requires reading synced fitness data (steps) from user state/profile, accessing workout logs, updating user profile with evolution stage and character stats, and potentially calling the AI service again if the user opts for a new photo at Stage 2. Builds directly on the Home Screen and Combat Character systems established in Epic 1.

## Story 2.1: Implement Fitness-to-Evolution Progress Calculation  
**As a** Developer,  
**I want** to implement the logic that converts synced steps and manually logged workouts into a quantifiable "Evolution Progress" metric for the Home Avatar,  
**so that** fitness activity directly drives character progression.

### Acceptance Criteria  
1.  A defined algorithm converts daily steps (from Story 1.3) into evolution progress points.  
2.  A defined algorithm converts manually logged workouts (from FR8) into evolution progress points (potentially weighted by type/duration).  
3.  Evolution progress points accumulate over time and are stored persistently (e.g., in Supabase profile).  
4.  A specific progress point threshold is defined for triggering the evolution from Stage 1 to Stage 2.  
5.  The calculation handles historical data correctly (e.g., progress accumulates even if the app isn't opened daily).

## Story 2.2: Implement Home Avatar Visual Evolution (Stage 1 to 2\)  
**As a** User,  
**I want** my personalized Home Avatar's appearance to automatically change from the Stage 1 body to the Stage 2 body when I reach the required fitness progress threshold, with an option to update my photo,  
**so that** I can visually see my fitness achievements reflected in my character.

### Acceptance Criteria  
1.  When the user's Evolution Progress (from Story 2.1) crosses the Stage 2 threshold, the system flags the user for evolution.  
2.  Upon next app launch or relevant event, the user is presented with an option to evolve to Stage 2 (potentially via a celebratory 'Evolution Ceremony').  
3.  User is given the option to upload a new headshot photo for Stage 2 integration (FR11). If chosen, the AI generation process (from Story 1.5) is triggered using the Stage 2 archetype body image.  
4.  If the user declines a new photo or if generation fails, the existing face is merged with the Stage 2 archetype body image.  
5.  The user's profile is updated with the new Stage 2 avatar image URL and evolution stage status.  
6.  The Home Screen subsequently displays the new Stage 2 Home Avatar.

## Story 2.3: Implement Stat Scaling for Combat Characters  
**As a** Developer,  
**I want** to implement logic that increases the base stats (e.g., HP, base damage) of the selected Combat Character (Sean or Mary) based on the user's Home Avatar evolution stage (Stage 1 vs. Stage 2),  
**so that** fitness progression provides a tangible benefit in combat.

### Acceptance Criteria  
1.  Base stats (HP, damage multipliers, etc.) are defined for Combat Characters at Stage 1.  
2.  Increased base stats or stat modifiers are defined for Combat Characters upon reaching Stage 2 evolution.  
3.  The system correctly calculates the Combat Character's current effective stats based on the user's current Home Avatar evolution stage.  
4.  These calculated stats are stored persistently or derived dynamically when needed for combat.  
5.  The stat scaling provides a noticeable but balanced advantage in combat (balancing TBD).

## Story 2.4: Update Home Screen with Live Stats  
**As a** User,  
**I want** the Home Screen shell area to display my actual current fitness stats (Steps, Calories - **if calculated**, Workout Duration - **if tracked**) and the Profile Tab to show my selected Combat Character's current, scaled stats,  
**so that** I have an up-to-date overview of my progress.

### Acceptance Criteria  
1.  The Home Screen shell area correctly fetches and displays the user's current daily step count synced from HealthKit/Connect (Story 1.3).  
2.  The Home Screen shell area displays workout duration (based on manual logs from FR8 or potentially synced data if available).  
3.  **(Optional/Stretch for MVP - Requires Calculation Logic)** The Home Screen shell area displays an estimated calorie burn based on synced/logged activity.  
4.  The Profile Tab displays the selected Combat Character's stats (HP, etc.) reflecting the current scaling based on evolution stage (Story 2.3).  
5.  The displayed stats update appropriately when new fitness data is synced or when evolution occurs.

## Story 2.5: Implement Reactive Home Avatar Animations  
**As a** User,  
**I want** my Home Avatar on the Home Screen to show simple positive animations when I've been active recently and negative animations if I've been inactive,  
**so that** I get immediate, ambient feedback on my fitness consistency.

### Acceptance Criteria  
1.  Criteria for "recently active" (e.g., met step goal yesterday, logged workout today) and "inactive" (e.g., missed step goal for X days) are defined.  
2.  Simple, distinct positive animation(s) (e.g., subtle smile, sparkle effect, idle blink variation) are created for the Home Avatar.  
3.  Simple, distinct negative animation(s) (e.g., subtle frown, sigh effect, idle blink variation) are created for the Home Avatar.  
4.  The Home Screen logic checks the user's recent activity status against the defined criteria.  
5.  The corresponding positive or negative animation plays periodically or on app load based on the user's status.  
6.  A neutral/default state animation (e.g., idle blink) exists.

---
