This document outlines a comprehensive strategy for the conversion and scaling mechanics of 16BitFit-V3, focusing on fairness, engagement, and long-term balance.

### **1\. Step Conversion: Evolution Points (EPP) and Energy Meter**

Steps fuel two different systems: long-term progression (Evolution Progress Points or EPP) and immediate combat utility (Energy Meter). They should use different conversion models.

#### **A. Energy Meter (Combat Resource)**

The Energy Meter is a consumable resource. It should be predictable and encourage a healthy baseline of daily activity.

**Model: Capped Linear**

This model is simple and intuitive for the user.

* Formula:  
  Energy \= Min(MaxEnergy, Steps / StepsPerEnergy)  
* **Tunable Parameters:**  
  * MaxEnergy: The total capacity of the bar (e.g., 100).  
  * StepsPerEnergy: The number of steps required to generate 1 unit of Energy (e.g., 100 steps).  
* *Example:* With the parameters above, the Energy Meter is full at 10,000 steps.

#### **B. Evolution Progress Points (EPP)**

EPP drives avatar evolution. The model must implement diminishing returns to reward the transition from inactive to active, while preventing excessive grinding.

**Model: Asymptotic Function (Smooth Diminishing Returns)**

An asymptotic function (related to exponential decay) provides a smooth curve that rises quickly and then naturally flattens as it approaches a maximum cap.

* Formula:  
  DailyEPP \= MaxDailyEPP \* (1 \- e^(-k \* Steps))  
* **Tunable Parameters:**  
  * MaxDailyEPP: The maximum EPP obtainable from steps daily (e.g., 100).  
  * e: Euler's number (approx. 2.71828).  
  * k: The decay constant, controlling the curve's steepness.  
* Tuning k: To determine k, decide on a milestone. For example, if 10,000 steps should yield 80% of the MaxDailyEPP (80 EPP):  
  80 \= 100 \* (1 \- e^(-k \* 10000))  
  k ≈ 0.00016  
* **Example Outcome (k=0.00016):**  
  * 3,000 Steps ≈ 38 EPP  
  * 6,000 Steps ≈ 61 EPP  
  * 10,000 Steps ≈ 80 EPP  
  * 20,000 Steps ≈ 96 EPP (The second 10k steps only yielded 16 EPP)

#### **C. Encouraging Consistency: Streak Multipliers**

To reward consistent daily habits, apply a multiplier to the calculated daily EPP if the user meets a minimum activity threshold (e.g., 5,000 steps or one logged workout).

* Day 1: 1.0x  
* Day 2: 1.05x  
* Day 3: 1.10x  
* ...  
* Capping at Day 7: 1.25x

### **2\. Workout Conversion (Strength, Cardio, Flexibility)**

Manually logged workouts must be standardized. Assuming detailed intensity data (like heart rate) is unavailable, we rely on workout type and duration, assigning weights relevant to a Strength-Based Fighting Game (SBFG).

**Model: Weighted Time-Based Conversion**

* Formula:  
  WorkoutEPP \= Duration (minutes) \* BaseEPPperMinute \* TypeWeight \* IntensityModifier  
* **Tunable Parameters:**  
  * BaseEPPperMinute: The core value of exercise time, used to balance workouts against steps.  
  * **Type Weights:**  
    * Strength: 1.5 (Highly relevant to SBFG)  
    * Cardio: 1.2  
    * Flexibility: 0.8  
  * **Intensity Modifier (If logged by the user):**  
    * High: 1.3  
    * Medium: 1.0  
    * Low: 0.7  
    * (Default to 1.0 if not specified)

Balancing and Caps:

To prevent abuse of manual logging and ensure steps remain a core mechanic, implement a cap on EPP earned from workouts (e.g., MaxWorkoutEPP). This cap might be set to 50-70% of the MaxDailyEPP from steps.

### **3\. Evolution Stage Scaling and Combat Stats**

Evolution must provide a noticeable advantage without making the character overpowered. Player skill and Energy Meter management must remain the decisive factors in combat.

**Model: Multiplicative (Percentage-Based) Scaling**

Percentage-based scaling is generally safer for long-term balance across 5 stages than additive bonuses.

* Formula:  
  CombatStat \= BaseStat \* (1 \+ (EvolutionStage \- 1\) \* BoostPercentage)  
* Suggested Tuning (Modest Progression):  
  We recommend a consistent 6% boost per stage for both HP and Damage.

| Evolution Stage | Stat Percentage | Overall Advantage vs. Stage 1 |
| :---- | :---- | :---- |
| Stage 1 | 100% | 0% |
| Stage 2 | 106% | 6% |
| Stage 3 | 112% | 12% |
| Stage 4 | 118% | 18% |
| Stage 5 | 124% | 24% |

Rationale:

A 6% advantage (Stage 2 vs. Stage 1\) is noticeable but easily overcome by skill or better use of the Energy Meter. A 24% advantage (Stage 5 vs. Stage 1\) is significant, rewarding long-term effort, but not insurmountable.

### **4\. Handling Historical Fitness Data**

Users must receive credit for activity even if they do not open the app daily.

**Best Practice: Timestamp-Based Iterative Processing**

1. **Store Last Sync Timestamp:** Record the exact time of the last successful data processing.  
2. **Query Historical Data:** When the app opens, request all fitness data from HealthKit/Health Connect starting from the Last Sync Timestamp.  
3. **Iterate Day-by-Day:** Process the retrieved data chronologically, one day at a time.  
4. **Apply Daily Logic:** **Crucially, apply the EPP formulas (diminishing returns) and daily caps independently for each 24-hour period.** Do not aggregate historical steps into a lump sum before processing.  
5. **Accumulate EPP:** Add the EPP calculated for each historical day to the user's total.  
6. **Energy Meter Exception:** The Energy Meter is a daily tactical resource. Only the *current* day's steps should fill the meter. Energy from missed days is lost, encouraging daily engagement with the game mechanics.  
7. **Update Timestamp:** Set the Last Sync Timestamp to the current time.

### **5\. Designing for Adjustability**

Algorithms must be adjustable based on user data and feedback without requiring a full app update.

**Strategy: Server-Side Configuration**

All parameters mentioned above should be managed via a remote configuration (e.g., Firebase Remote Config).

**Key Tunable Parameters ("Levers"):**

* **Activity Conversion:**  
  * StepsPerEnergy: How quickly the Energy bar fills.  
  * MaxDailyEPP (Steps) and MaxWorkoutEPP (Workouts).  
  * k (Decay Constant): Controls the steepness of the diminishing returns curve for steps.  
  * BaseEPPperMinute: The central parameter for balancing workouts vs. steps.  
  * TypeWeight (Strength, Cardio, Flexibility) and IntensityModifier.  
* **Progression Speed:**  
  * **EPP Thresholds:** The cumulative EPP required for each Stage transition (e.g., EPP needed for S1 \-\> S2). This is the main control over the pace of the game.  
* **Combat Balance:**  
  * BoostPercentage: The stat increase per evolution stage (e.g., 6%).

