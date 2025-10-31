# **Core Workflows**

This section illustrates key user workflows using sequence diagrams to clarify interactions between the major system components.

**Workflow 1: First-Time Onboarding & Initial Loop**

Code snippet  
sequenceDiagram  
    participant User  
    participant RNShell as React Native Shell  
    participant SBAuth as Supabase Auth  
    participant SBDB as Supabase DB  
    participant SBFunc as Supabase Edge Function (Avatar Gen)  
    participant SDApi as Stable Diffusion API  
    participant HealthAPI as HealthKit/Connect  
    participant Bridge as Local WebSocket Bridge  
    participant Phaser as Phaser Engine (WebView)

    User-\>\>+RNShell: Launch App  
    RNShell-\>\>User: Show Welcome/Intent Screen  
    User-\>\>RNShell: Choose Intent  
    RNShell-\>\>User: Show Archetype Selection  
    User-\>\>RNShell: Select Archetype  
    RNShell-\>\>User: Prompt Photo Upload  
    User-\>\>RNShell: Upload Headshot Photo  
    RNShell-\>\>+SBFunc: Request Avatar Generation (Photo Ref, Archetype)  
    SBFunc-\>\>SBFunc: Pre-process Photo (Crop, Align etc.)  
    SBFunc-\>\>+SDApi: Generate Image Request (Processed Photo, LoRA, CN, Prompt)  
    SDApi--\>\>-SBFunc: Return Generated Head Image  
    SBFunc-\>\>SBFunc: Post-process (Quantize Colors, Composite)  
    SBFunc-\>\>+SBDB: Store Final Avatar URL in UserProfile  
    SBDB--\>\>-SBFunc: Confirm Store  
    SBFunc--\>\>-RNShell: Return Success (Avatar URL)  
    RNShell-\>\>User: Show Generated Avatar  
    RNShell-\>\>User: Prompt Health Data Connection  
    User-\>\>RNShell: Grant Permissions  
    RNShell-\>\>+HealthAPI: Request Step Data Access  
    HealthAPI--\>\>-RNShell: Confirm Access / Return Initial Steps  
    RNShell-\>\>SBDB: Store Initial Step Data (DailySteps)  
    RNShell-\>\>User: Assign Daily Quest (Intro Workout)  
    User-\>\>RNShell: Tap Start Workout  
    RNShell-\>\>User: Show Workout Tracker Screen  
    User-\>\>RNShell: Complete Workout Actions  
    RNShell-\>\>User: Show Workout Complete Ceremony (+XP, \+Ticket)  
    RNShell-\>\>SBDB: Log Workout (WorkoutLog), Update Progress (UserProfile)  
    User-\>\>RNShell: Tap Continue (to Battle)  
    RNShell-\>\>Bridge: Send 'StartTutorial' Message (MessagePack)  
    Bridge-\>\>Phaser: Deliver Message  
    Note over RNShell,Phaser: "Cartridge Load" Animation  
    Phaser-\>\>User: Display Tutorial Battle vs Dummy  
    User-\>\>Phaser: Perform Combat Inputs  
    Phaser-\>\>User: Show Battle Victory Ceremony (+Skill, \+Loot)  
    Phaser-\>\>Bridge: Send 'TutorialComplete' Message (MessagePack)  
    Bridge-\>\>RNShell: Deliver Message  
    RNShell-\>\>SBDB: Update User Stats/Inventory based on Rewards  
    RNShell-\>\>-User: Show Home Dashboard (First Rewards Shown)
