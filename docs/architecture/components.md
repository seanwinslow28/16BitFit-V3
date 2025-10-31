# **Components**

This section identifies the major logical components of the 16BitFit-V3 system, defining their responsibilities and how they interact within the Monorepo structure.

---

## **Component List**

**Component: Mobile Shell (React Native App)**

* **Responsibility:** Provides the native application container, renders the main UI (Home Dashboard, Settings, Profile, Workout Tracker), manages navigation, handles native API interactions (HealthKit/Connect, Haptics), hosts the WebView, and orchestrates communication via the Hybrid Velocity Bridge.  
* **Key Interfaces:** Renders React Native UI components (packages/ui-components), Communicates with Supabase backend (Auth, DB, Realtime) via Supabase client, Interacts with native Health APIs, Sends/receives messages to/from Phaser via the Hybrid Velocity Bridge (packages/bridge-interface), Hosts the WebView component containing the Phaser game.  
* **Dependencies:** packages/shared-types, packages/bridge-interface, Supabase Client, React Navigation, Reanimated, Skia, Native Health Modules, **Local WebSocket Server Module**, **MessagePack Library**.  
* **Technology Stack:** React Native, TypeScript, NativeWind, Zustand, Reanimated 4, react-native-skia.

**Component: Game Engine (Phaser 3 WebView)**

* **Responsibility:** Renders and manages the core 2D fighting game experience (combat, character animations, physics, input handling), receives fitness-derived stats/energy, and communicates game events/results back to the shell via the Hybrid Velocity Bridge.  
* **Key Interfaces:** Renders game visuals using Phaser 3 API, Receives input commands, Sends/receives messages to/from React Native via the Hybrid Velocity Bridge (packages/bridge-interface), Loads assets.  
* **Dependencies:** Phaser 3, packages/bridge-interface (conceptually), **MessagePack Library**.  
* **Technology Stack:** Phaser 3, JavaScript (or TypeScript, TBD).

**Component: Hybrid Velocity Bridge (Interface/Protocol)**

* **Responsibility:** Defines the low-latency communication protocol (**Local WebSocket \+ MessagePack**) and mechanism between the React Native shell and the Phaser WebView. Implementation exists on both sides.  
* **Key Interfaces:** Provides methods/event listeners for sending/receiving structured **binary** messages (defined in packages/bridge-interface), Handles MessagePack serialization/deserialization.  
* **Dependencies:** packages/shared-types, **MessagePack Library**, **WebSocket Server/Client**.  
* **Technology Stack:** TypeScript (RN side), JavaScript/TypeScript (Phaser side), Native WebSocket Server Module, WebView WebSocket API, MessagePack.

**Component: Supabase Backend (BaaS)**

* **Responsibility:** Provides core backend services including user authentication, data persistence (PostgreSQL), real-time data synchronization (Broadcast), serverless functions (Edge \+ PG) for specific logic, and file storage.  
* **Key Interfaces:** Supabase Client Library API, PostgREST API, Realtime Subscription API, Auth API, Edge Function invocation endpoint(s).  
* **Dependencies:** External AI APIs (Stable Diffusion).  
* **Technology Stack:** Supabase Platform (PostgreSQL, GoTrue, Realtime, Deno Edge Functions, PL/pgSQL Functions).

**Component: Edge Functions (Supabase)**

* **Responsibility:** Executes specific server-side logic, primarily for API ingress, request validation, orchestration, and secure interactions with external APIs (e.g., AI avatar generation). Defers data-intensive logic to PG Functions.  
* **Key Interfaces:** HTTPS endpoints invokable by the RN Shell, Supabase Client Library API, External AI API clients, **May call PG Functions (RPC)**.  
* **Dependencies:** Supabase Client, External AI API SDKs/clients, packages/shared-types.  
* **Technology Stack:** Deno, TypeScript.

**Component: PostgreSQL Functions (PL/pgSQL)**

* **Responsibility:** Executes core data-intensive business logic (e.g., EPP calculations, stat updates) atomically within the database, triggered by data changes or called from Edge Functions. Implements logic requiring transactional integrity. Initiates Realtime Broadcasts.  
* **Key Interfaces:** Trigger functions, RPC functions callable from Supabase client/Edge Functions.  
* **Dependencies:** Supabase DB schema.  
* **Technology Stack:** PL/pgSQL.

**Component: Shared Types (packages/shared-types)**

* **Responsibility:** Defines shared TypeScript interfaces and types used across the Monorepo (e.g., API request/response payloads, bridge message formats, data model types).  
* **Key Interfaces:** Exports TypeScript types.  
* **Dependencies:** None.  
* **Technology Stack:** TypeScript.

**Component: Bridge Interface (packages/bridge-interface)**

* **Responsibility:** Defines the specific **MessagePack** message structures, constants, and potentially utility functions for the Hybrid Velocity Bridge protocol.  
* **Key Interfaces:** Exports types and potentially functions related to bridge communication.  
* **Dependencies:** packages/shared-types.  
* **Technology Stack:** TypeScript.

---

## **Component Diagrams**

**High-Level Container Diagram (Conceptual C4 Style \- Updated)**

Code snippet  
graph TD  
    User\[User\] \--\> MobileApp\[Mobile App\\n(React Native)\];

    subgraph "Supabase Cloud"  
        SupabaseDB\[(Database\\nPostgreSQL)\];  
        SupabaseAuth\[Auth Service\];  
        SupabaseRT\[Realtime Service\\n(Broadcast)\];  
        SupabaseFuncs\[Edge Functions\\n(Ingress, External Calls)\];  
        PGFuncs\[PostgreSQL Functions\\n(Core Logic)\];  
        SupabaseStorage\[(Storage)\];

        SupabaseDB \-- Triggers \--\> PGFuncs;  
        PGFuncs \--\> SupabaseDB;  
        PGFuncs \-- Initiates \--\> SupabaseRT;  
        SupabaseFuncs \--\> PGFuncs; \#\# Edge can call PG funcs  
        SupabaseFuncs \--\> SupabaseDB; \#\# Edge can directly interact if needed  
    end

    subgraph "Mobile App Container"  
        MobileApp \--\> RNShell\[React Native Shell\\n(UI, Native APIs, Bridge Client)\];  
        RNShell \--\> WebSocketServer\[Local WebSocket Server\]; \#\# Added WS Server  
        RNShell \--\> WebView\[WebView\\n(Hosts Phaser)\];  
        WebView \--\> PhaserEngine\[Phaser 3 Engine\\n(Combat Logic, Bridge Client)\];

        WebSocketServer \<-.-\>|MessagePack over WS| PhaserEngine; \#\# Updated Bridge Link  
        style WebSocketServer fill:\#ffcc00,stroke:\#333 \#\# Indicate Native Module  
    end

    RNShell \--\> SupabaseAuth;  
    RNShell \--\> SupabaseDB;  
    RNShell \--\> SupabaseRT;  
    RNShell \--\> SupabaseFuncs;  
    RNShell \--\> SupabaseStorage;  
    RNShell \--\> HealthAPI\[HealthKit / Health Connect\];

    SupabaseFuncs \--\> ExternalAI\[External AI APIs\\n(Stable Diffusion)\];

    style SupabaseDB fill:\#3ecf8e,stroke:\#333  
    style SupabaseAuth fill:\#3ecf8e,stroke:\#333  
    style SupabaseRT fill:\#3ecf8e,stroke:\#333  
    style SupabaseFuncs fill:\#3ecf8e,stroke:\#333  
    style PGFuncs fill:\#3ecf8e,stroke:\#333  
    style SupabaseStorage fill:\#3ecf8e,stroke:\#333  
    style HealthAPI fill:\#f9f,stroke:\#333  
    style ExternalAI fill:\#f9f,stroke:\#333  
    style RNShell fill:\#61DAFB,stroke:\#333  
    style WebView fill:\#61DAFB,stroke:\#333  
    style PhaserEngine fill:\#9f55ff,stroke:\#333
