# **Data Models**

This section defines the core data entities required for 16BitFit-V3. These models will inform the database schema design and the shared TypeScript interfaces used between the React Native shell, Phaser WebView (via bridge), and Supabase Edge Functions.

---

## **Model: UserProfile**

Purpose: Stores core user information, preferences, and links to other data. Aligns with Supabase Auth users table.

Key Attributes:

* id: UUID \- Primary key, references auth.users.id.  
* created\_at: TimestampTz \- Timestamp of profile creation.  
* updated\_at: TimestampTz \- Timestamp of last profile update.  
* email: Text \- User's email (optional if deferred auth).  
* selected\_archetype: Text \- Enum/Text: ('Trainer', 'Runner', 'Yoga', 'Bodybuilder', 'Cyclist').  
* selected\_combat\_character: Text \- Enum/Text: ('Sean', 'Mary').  
* home\_avatar\_url: Text \- URL to the generated avatar image.  
* current\_evolution\_stage: Integer \- Current stage (e.g., 1, 2).  
* evolution\_progress: Float \- Current progress points towards the next stage.  
* fitness\_streak: Integer \- Current daily fitness activity streak count.  
* last\_activity\_date: Date \- Date of the last recorded fitness activity (for streak/reactivity).

**Relationships:**

* One-to-one with auth.users.  
* One-to-many with WorkoutLog.  
* One-to-many with DailySteps (Implicit via user\_id).

---

## **Model: WorkoutLog**

Purpose: Records manually logged workouts by the user.

Key Attributes:

* id: UUID \- Primary key.  
* user\_id: UUID \- Foreign key referencing UserProfile.id.  
* created\_at: TimestampTz \- Timestamp when the log was created.  
* workout\_type: Text \- Enum/Text: ('Strength', 'Cardio', 'Flexibility').  
* duration\_minutes: Integer \- Duration of the workout.  
* start\_time: TimestampTz \- Start time of the workout.  
* end\_time: TimestampTz \- End time of the workout.  
* evolution\_points\_gained: Float \- Calculated points contributed to evolution progress.

**Relationships:**

* Many-to-one with UserProfile.

---

## **Model: DailySteps**

Purpose: Stores daily step counts synced from health platforms.

Key Attributes:

* id: UUID \- Primary key.  
* user\_id: UUID \- Foreign key referencing UserProfile.id.  
* date: Date \- The date for which the step count applies.  
* step\_count: Integer \- Total steps for the day.  
* last\_synced\_at: TimestampTz \- Timestamp of the last sync for this day.  
* energy\_generated: Float \- Calculated combat energy based on steps.  
* evolution\_points\_gained: Float \- Calculated points contributed to evolution progress.

**Relationships:**

* Many-to-one with UserProfile.

---

## **Model: CombatCharacterStats**

Purpose: Defines the base and potentially modified stats for playable combat characters. Stored as static configuration for MVP.

Key Attributes (Static Config Example):

* character\_name: Text \- ('Sean', 'Mary').  
* base\_hp: Integer.  
* base\_attack\_power: Float.  
* base\_defense: Float.  
* move\_list: JSONB \- Definitions of available moves.  
* stage\_modifiers: JSONB \- Stat multipliers based on UserProfile current\_evolution\_stage.

**Relationships:**

* Logically linked to UserProfile.selected\_combat\_character.
