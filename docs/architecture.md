\# 16BitFit-V3 Fullstack Architecture Document

\#\# Introduction

This document outlines the complete fullstack architecture for \*\*16BitFit-V3\*\*, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

\#\#\# Starter Template or Existing Project

\*\*N/A \- Greenfield project\*\*

\*\*Rationale:\*\* While we are migrating \*concepts\* and \*learnings\* from 16BitFit V2 (a significant existing project), the BMAD migration strategy explicitly calls for a Greenfield \*rebuild\* using the BMAD Method structure. Therefore, we are not directly using V2's codebase as a starter template, although its architecture and innovations heavily inform this design. We will initialize a new project structure according to BMAD principles.

\#\#\# Change Log

| Date       | Version | Description                                       | Author  |  
| :--------- | :------ | :------------------------------------------------ | :------ |  
| 2025-10-23 | 0.1     | Initial document draft                            | Winston |  
| 2025-10-24 | 0.2     | Integrated deep research synthesis findings       | Winston |

\#\# High Level Architecture

\#\#\# Technical Summary

The 16BitFit-V3 architecture employs a \*\*Hybrid Application Model\*\* designed for high performance and cross-platform compatibility. A React Native shell serves as the native container, providing access to device features (like HealthKit/Health Connect) and rendering the primary UI using a "Modern Retro Fusion" aesthetic. The core, high-performance SBFG combat experience is delivered via a Phaser 3 game engine running within an isolated WebView component. Communication between the React Native shell and the Phaser WebView is handled by the innovative \*\*Hybrid Velocity Bridge\*\*, implemented via a \*\*Local WebSocket Server \+ MessagePack\*\* protocol, targeting sub-10ms latency. The backend leverages Supabase as a Backend-as-a-Service (BaaS), providing database, real-time subscriptions (via Broadcast), authentication, and a \*\*hybrid logic model\*\* using both serverless Edge Functions (for ingress/external calls) and PostgreSQL Functions (for data-intensive logic). This architecture aims to achieve native-like 60fps combat performance within a mobile app framework while integrating real-world fitness data.

\#\#\# Platform and Infrastructure Choice

\*\*Platform Recommendation:\*\* \*\*Supabase\*\*

\*\*Rationale:\*\*  
1\.  \*\*V2 Success:\*\* The existing V2 architecture successfully utilized Supabase, proving its viability for the project's needs (database, real-time sync, edge functions).  
2\.  \*\*Developer Experience:\*\* Supabase offers a streamlined developer experience, integrating database, auth, and serverless functions, aligning with the goal of rapid iteration within the BMAD framework.  
3\.  \*\*Real-time:\*\* Built-in real-time capabilities via \*\*Broadcast\*\* (triggered by PG functions) offer better scalability than direct DB changes for this use case.  
4\.  \*\*Cost-Effectiveness:\*\* Generous free tier and predictable scaling costs align with MVP budget goals.  
5\.  \*\*Hybrid Logic:\*\* Supports both Edge Functions (Deno/TS) and PostgreSQL Functions (PL/pgSQL), allowing logic placement optimization.

\*\*Platform:\*\* \*\*Supabase\*\*  
\*\*Key Services:\*\*  
\* PostgreSQL Database (via Supabase DB)  
\* Realtime Subscriptions (Broadcast)  
\* Authentication (Supabase Auth)  
\* Edge Functions (Deno-based)  
\* PostgreSQL Functions (PL/pgSQL)  
\* Storage (if needed for user-uploaded content beyond avatar generation)  
\*\*Deployment Host and Regions:\*\* Supabase Cloud (Region TBD based on target user geography \- likely US East/West for North America launch). The React Native application itself will be deployed via Apple App Store and Google Play Store.

\#\#\# Repository Structure

\*\*Structure Recommendation:\*\* \*\*Monorepo\*\*

\*\*Rationale:\*\*  
1\.  \*\*V2 Experience:\*\* The PRD notes V2 likely favored a Monorepo. Consolidating facilitates managing shared code and dependencies.  
2\.  \*\*Code Sharing:\*\* Enables seamless sharing of types, constants, and potentially utility functions between the React Native shell and backend logic (Edge/PG function types).  
3\.  \*\*Atomic Commits:\*\* Simplifies coordinated changes across the RN shell, Phaser game configuration/bridge interface, and backend functions.  
4\.  \*\*Tooling:\*\* Mature tooling (Nx, Turborepo recommended) provides efficient build/test/deploy orchestration.

\*\*Structure:\*\* \*\*Monorepo\*\*  
\*\*Monorepo Tool:\*\* \*\*Nx\*\* (Recommended for its robust features, plugins, and explicit dependency management) or Turborepo.  
\*\*Package Organization:\*\*  
\* \`apps/mobile-shell\` (React Native application)  
\* \`apps/game-engine\` (Phaser 3 project, potentially containing build/config logic for the WebView bundle)  
\* \`apps/supabase-functions\` (Directory for Supabase Edge Functions)  
\* \`supabase/migrations\` (Directory for DB schema and PG Function definitions)  
\* \`packages/shared-types\` (TypeScript interfaces for API payloads, bridge messages, data models)  
\* \`packages/bridge-interface\` (Definitions and potentially shared utilities for the Hybrid Velocity Bridge protocol)  
\* \`packages/ui-components\` (If creating shared React Native components beyond basic styling)

\#\#\# High Level Architecture Diagram

\`\`\`mermaid  
graph TD  
    subgraph "User Device"  
        U(User) \--\> App\[React Native Shell App\];  
        App \-- Renders \--\> ShellUI\[Native UI (RN Components)\];  
        App \-- Renders \--\> WebView\[WebView Container\];  
        WebView \-- Hosts \--\> Phaser\[Phaser 3 Game Engine\];  
        ShellUI \-- Interacts \--\> App;  
    end

    subgraph "Communication"  
        App \<== WSBridge\[Local WebSocket Bridge\\n(MessagePack)\] \==\> Phaser;  
        style WSBridge stroke-width:4px, stroke:red  
    end

    subgraph "Backend (Supabase Cloud)"  
        App \--\> SBAuth\[Supabase Auth\];  
        App \--\> SBDB\[(Supabase DB\\nPostgreSQL)\];  
        App \--\> SBRealtime\[Supabase Realtime\\n(Broadcast)\];  
        App \--\> SBFunctions\[Supabase Edge Functions\\n(Ingress, External Calls)\];  
        SBDB \-- Triggers \--\> PGFuncs\[PostgreSQL Functions\\n(Core Logic)\];  
        PGFuncs \--\> SBDB;  
        PGFuncs \-- Initiates \--\> SBRealtime;  
        SBFunctions \--\> PGFuncs; \#\# Edge can call PG funcs  
        SBFunctions \--\> SBDB; \#\# Edge can directly interact if needed  
        SBFunctions \--\> ExtAI\[External AI APIs\\n(Stable Diffusion)\];  
    end

    subgraph "External Services"  
        App \--\> HealthAPI\[HealthKit / Health Connect API\];  
        HealthAPI \-. Sync Data .-\> App;  
    end

    U \-- Interacts \--\> ShellUI;  
    U \-- Interacts \--\> PhaserControls\[Game Controls (via RN Overlay)\];  
    PhaserControls \-- Input \--\> WSBridge;

    classDef supabase fill:\#3ecf8e,stroke:\#333,color:\#fff;  
    class SBAuth,SBDB,SBRealtime,SBFunctions,PGFuncs supabase;  
    classDef external fill:\#f9f,stroke:\#333,color:\#333;  
    class HealthAPI,ExtAI external;  
    classDef reactnative fill:\#61DAFB,stroke:\#333,color:\#000;  
    class App,ShellUI,WebView reactnative;  
    classDef phaser fill:\#9f55ff,stroke:\#333,color:\#fff;  
    class Phaser,PhaserControls phaser;

### **Architectural Patterns**

* **Hybrid Application:** Using a native shell (React Native) to host web-based content (Phaser in WebView) for performance-critical sections, leveraging native capabilities elsewhere. *Rationale:* Allows use of the mature Phaser engine for complex 2D fighting mechanics while retaining native access for Health APIs and UI performance.  
* **WebView Bridge (Local WebSocket \+ MessagePack):** A bespoke, low-latency communication system using a local WebSocket server in RN and MessagePack for binary serialization. *Rationale:* Research indicates this provides significantly better performance than standard postMessage for achieving \<10ms latency required for responsive fighting gameplay.  
* **Backend as a Service (BaaS):** Utilizing Supabase to provide backend infrastructure, reducing operational overhead. *Rationale:* Proven effective in V2, aligns with rapid development goals, provides necessary features (DB, Auth, Realtime, Functions).  
* **Hybrid Backend Logic (PG Functions \+ Edge Functions):** Placing data-intensive, transactional logic in PostgreSQL Functions triggered by DB events, while using Edge Functions for API ingress, validation, orchestration, and external API calls. *Rationale:* Leverages the strengths of each compute option for optimal performance and security, as recommended by research.  
* **Event-Driven Realtime (DB Triggers/Broadcast):** Using database triggers calling PG Functions to initiate Supabase Realtime Broadcasts on private user channels for state synchronization. *Rationale:* More scalable than relying on Postgres Changes with RLS, as highlighted by research.  
* **Component-Based UI:** Using React Native's component model for the shell UI. *Rationale:* Standard practice for RN development, facilitates creation of reusable UI elements for the "Modern Retro Fusion" aesthetic.  
* **State Management (Client-Side):** A dedicated library (e.g., Zustand) within the React Native shell for managing application state. *Rationale:* Essential for managing complexity in React applications.  
* **Game Loop & Scene Management (Phaser):** Utilizing Phaser's built-in game loop and scene manager for the combat engine. *Rationale:* Core features of the Phaser engine.  
* **Repository Pattern (Conceptual):** Abstracting data access logic within the React Native app and potentially within Edge/PG Functions interacting with Supabase. *Rationale:* Promotes testability and decouples business logic from data persistence details.

## **Tech Stack**

### **Cloud Infrastructure**

* **Provider:** Supabase  
* **Key Services:** PostgreSQL Database, Realtime Subscriptions (Broadcast), Authentication, Edge Functions (Deno), PostgreSQL Functions (PL/pgSQL), Storage  
* **Deployment Regions:** TBD (Likely US East/West for NA Launch)

### **Technology Stack Table**

| Category | Technology | Version | Purpose | Rationale |
| :---- | :---- | :---- | :---- | :---- |
| Frontend Language | TypeScript | \~5.x.x | Type safety, developer experience for RN | Standard for modern RN; enables shared types. |
| Frontend Framework | React Native | \~0.71.8 | Cross-platform mobile shell | Core tech from V2, proven viable; specific version for stability. |
| UI Components | Custom System | N/A | "Modern Retro Fusion" aesthetic | Required by UI Spec; ensures unique branding. |
| State Management | Zustand | \~4.x.x | Simple, lightweight global state for RN shell | Simplicity aligns with "strategic simplicity". |
| Routing | React Navigation | \~6.x.x | Navigation within the RN shell | Standard and robust navigation solution for React Native. |
| Animation | Reanimated | \~4.x.x | Performant UI animations in RN shell | Required by PRD/UI Spec for 60fps UI; V4 offers worklets. |
| Graphics Rendering | react-native-skia | \~1.x.x | Custom pixel rendering/effects in RN shell | Required by UI Spec for retro effects/UI. |
| Styling | NativeWind | \~4.x.x | Utility-first styling in RN | Tailwind-like experience for RN; confirmed approach. |
| Game Engine | Phaser 3 | \~3.70.0 | 2D Combat Engine within WebView | Core tech from V2, proven for 60fps combat. |
| Backend Language (Edge) | TypeScript | Deno Runtime | Language for Supabase Edge Functions | Supabase Edge Functions run Deno/TS. |
| Backend Language (DB) | PL/pgSQL | PostgreSQL Hosted | Language for PostgreSQL Functions | Standard for in-database logic; for data-intensive tasks. |
| Backend Platform | Supabase | Cloud Hosted | BaaS (DB, Auth, Realtime, Functions, Storage) | Core tech from V2, provides necessary services. |
| API Style | REST | N/A | Communication with Supabase / Edge Functions | Standard for Supabase client and Edge Functions. |
| Database | PostgreSQL | Supabase Hosted | Primary data storage | Provided by Supabase; robust relational DB. |
| Realtime | Supabase Realtime (Broadcast) | Supabase Hosted | Real-time data synchronization via PG triggers | Scalable approach recommended by research. |
| File Storage | Supabase Storage | Supabase Hosted | Storing user uploads (if needed post-avatar) | Integrated Supabase service. |
| Authentication | Supabase Auth | Supabase Hosted | User authentication and management | Integrated Supabase service; supports Anon Sign-in. |
| **AI (Avatar Gen)** | **Stable Diffusion API (Host TBD)** | **Latest** | **AI Face Integration for Home Avatar** | **Research indicates better control needed; requires quantization**. |
| AI (Sprite Gen) | Gemini API / Imagen 4 (TBD) | Latest | Combat/Boss Sprite Generation (Post-MVP) | Proven cost-effective pipeline from V2. |
| Fitness Data | HealthKit / Health Connect | Native APIs | Step/Workout Data Sync | Required by PRD for core mechanic. |
| **Bridge Comm Library** | **MessagePack (e.g., msgpack-lite)** | **Latest Stable** | **Binary Serialization for Bridge** | **Essential for low-latency bridge performance**. |
| **Bridge Transport** | **Local WebSocket Server (RN)** | **Native Module** | **Transport layer for Bridge communication** | **Recommended performant approach**. |
| Frontend Testing | Jest \+ RNTL | Latest Stable | Unit/Integration Testing for RN components | Standard testing stack for React Native. |
| Backend Testing (Edge) | Deno Testing \+ SuperDeno | Latest Stable | Unit/Integration Testing for Edge Functions | Native Deno tooling. |
| Backend Testing (DB) | pgTAP (Recommended) | Latest Stable | Unit Testing for PostgreSQL Functions | Standard framework for testing PL/pgSQL. |
| E2E Testing | Detox / Maestro (TBD) | Latest Stable | End-to-end testing for the mobile app | Detox for deep RN integration; Maestro for simpler setup. |
| Build Tool | Metro | RN Default | React Native Bundler | Standard for React Native. |
| Bundler | Metro | RN Default | (As above) | (As above). |
| IaC Tool | Supabase CLI / Mgmt API | Latest | Managing Supabase resources (schema, functions) | Sufficient for MVP. |
| CI/CD | GitHub Actions (Recommended) | N/A | Continuous Integration & Delivery | Simple integration if using GitHub. |
| Monitoring | Sentry (Recommended) | Latest | Error Tracking (Client & Serverless) | Robust error tracking, integrates with RN and Deno. |
| Logging | Supabase Logs \+ RN Lib | N/A | Application Logging | Supabase provides backend logs; need client library. |

## **Data Models**

This section defines the core data entities required for 16BitFit-V3. These models will inform the database schema design and the shared TypeScript interfaces used between the React Native shell, Phaser WebView (via bridge), and Supabase Edge Functions.

---

### **Model: UserProfile**

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

### **Model: WorkoutLog**

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

### **Model: DailySteps**

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

### **Model: CombatCharacterStats**

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

## **Components**

This section identifies the major logical components of the 16BitFit-V3 system, defining their responsibilities and how they interact within the Monorepo structure.

---

### **Component List**

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

### **Component Diagrams**

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

## **External APIs**

This section details the external APIs required for 16BitFit-V3 functionality and how they will be integrated.

---

### **API: Stable Diffusion API (Host TBD, e.g., Replicate, Dedicated Endpoint)**

* **Purpose:** To generate the personalized Home Avatar by integrating the user's uploaded headshot onto the selected Fitness Archetype body image using techniques like IP-Adapter, LoRAs, and potentially ControlNet, followed by server-side quantization.  
* **Documentation:** \[Link to Specific Hosted API Documentation \- TBD\]  
* **Base URL(s):** (TBD based on provider)  
* **Authentication:** API Key (Managed securely via Supabase Edge Function environment variables).  
* **Rate Limits:** Subject to provider's tier limits. Need to monitor and potentially upgrade tier based on usage.

**Key Endpoints Used:**

* (TBD \- Likely a POST /predictions or similar endpoint accepting image inputs, adapter references, LoRA identifiers, ControlNet maps, and text prompts).

**Integration Notes:**

* Interaction with the Stable Diffusion API **MUST** occur exclusively through a Supabase Edge Function (Component: Edge Functions) to protect the API key, manage the complex request payload, and perform mandatory pre/post-processing.  
* **Pre-processing:** Face detection, alignment, cropping, background removal within the Edge Function before sending to the AI API.  
* **AI Request:** Construct payload including pre-processed face image, archetype body sprite (potentially as ControlNet mask/map), pixel art LoRA identifier, style prompts ("Game Boy pixel art", "4-color green palette", etc.), and IP-Adapter/InstantID configuration.  
* **Post-processing (Mandatory):** Receive generated image, apply **color quantization** algorithm server-side to enforce the 4 DMG colors, composite onto body if needed, store final image (e.g., Supabase Storage), and return URL.  
* Implement non-AI pixelation fallback (downscale, grayscale, quantize/dither) within the Edge Function if AI generation fails or times out.  
* Error handling for API failures (rate limits, timeouts, content policy) must be implemented.  
* Cost monitoring is essential.

---

*(Placeholder for Post-MVP AI Sprite Generation API \- e.g., Google Gemini/Imagen)*

* **Purpose:** To generate combat character and boss sprites (Post-MVP).  
* **Documentation:** (TBD)  
* **Base URL(s):** (TBD)  
* **Authentication:** (TBD \- likely API Key via Edge Function)  
* **Rate Limits:** (TBD)  
* **Integration Notes:** Likely managed via separate Edge Functions, potentially leveraging anchor references as explored in V2.

## **Core Workflows**

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

## **Database Schema**

This section defines the PostgreSQL schema for 16BitFit-V3, based on the conceptual data models. It includes table definitions, primary keys, foreign keys, basic indexes, enables Row Level Security (RLS), and notes where PostgreSQL Functions will handle logic.

SQL  
\-- Enable UUID generation  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- \#\# User Profile Table \#\#  
\-- Stores core user information, linked to Supabase Auth  
CREATE TABLE public.user\_profiles (  
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, \-- Links to auth.users  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  updated\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  email TEXT UNIQUE, \-- Can be NULL initially if deferred auth  
  selected\_archetype TEXT CHECK (selected\_archetype IN ('Trainer', 'Runner', 'Yoga', 'Bodybuilder', 'Cyclist')), \--  
  selected\_combat\_character TEXT CHECK (selected\_combat\_character IN ('Sean', 'Mary')), \--  
  home\_avatar\_url TEXT, \-- URL to generated avatar  
  current\_evolution\_stage INTEGER NOT NULL DEFAULT 1, \-- Starts at stage 1  
  evolution\_progress REAL NOT NULL DEFAULT 0.0, \-- Progress points  
  fitness\_streak INTEGER NOT NULL DEFAULT 0, \-- Daily activity streak  
  last\_activity\_date DATE \-- For streak calculation  
);

\-- Enable RLS for user\_profiles  
ALTER TABLE public.user\_profiles ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can view their own profile  
CREATE POLICY "Allow individual user read access" ON public.user\_profiles  
  FOR SELECT USING (auth.uid() \= id);

\-- Policy: Users can update their own profile (selectively)  
CREATE POLICY "Allow individual user update access" ON public.user\_profiles  
  FOR UPDATE USING (auth.uid() \= id)  
  WITH CHECK (auth.uid() \= id);

\-- Trigger to update updated\_at timestamp  
CREATE OR REPLACE FUNCTION public.handle\_updated\_at()  
RETURNS TRIGGER AS $$  
BEGIN  
  NEW.updated\_at \= now();  
  RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;

CREATE TRIGGER on\_user\_profiles\_updated  
  BEFORE UPDATE ON public.user\_profiles  
  FOR EACH ROW  
  EXECUTE PROCEDURE public.handle\_updated\_at();

\-- \#\# Workout Log Table \#\#  
\-- Records manually logged workouts  
CREATE TABLE public.workout\_logs (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.user\_profiles(id) ON DELETE CASCADE,  
  created\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  workout\_type TEXT NOT NULL CHECK (workout\_type IN ('Strength', 'Cardio', 'Flexibility')), \--  
  duration\_minutes INTEGER NOT NULL CHECK (duration\_minutes \> 0),  
  start\_time TIMESTAMPTZ NOT NULL,  
  end\_time TIMESTAMPTZ NOT NULL CHECK (end\_time \> start\_time),  
  evolution\_points\_gained REAL NOT NULL DEFAULT 0.0 \-- \-- Note: Calculation likely handled by PG Function triggered on insert  
);

\-- Index for querying workouts by user  
CREATE INDEX idx\_workout\_logs\_user\_id ON public.workout\_logs(user\_id);

\-- Enable RLS for workout\_logs  
ALTER TABLE public.workout\_logs ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can manage their own workout logs  
CREATE POLICY "Allow individual user management" ON public.workout\_logs  
  FOR ALL USING (auth.uid() \= user\_id);

\-- \#\# Daily Steps Table \#\#  
\-- Stores daily step counts synced from health platforms  
CREATE TABLE public.daily\_steps (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES public.user\_profiles(id) ON DELETE CASCADE,  
  date DATE NOT NULL,  
  step\_count INTEGER NOT NULL DEFAULT 0 CHECK (step\_count \>= 0), \--  
  last\_synced\_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  energy\_generated REAL NOT NULL DEFAULT 0.0, \-- Calculated energy \-- Note: Calculation likely handled by PG Function triggered on insert/update  
  evolution\_points\_gained REAL NOT NULL DEFAULT 0.0, \-- Calculated points \-- Note: Calculation likely handled by PG Function triggered on insert/update  
  UNIQUE (user\_id, date) \-- Ensure only one record per user per day  
);

\-- Index for querying steps by user and date  
CREATE INDEX idx\_daily\_steps\_user\_date ON public.daily\_steps(user\_id, date DESC);

\-- Enable RLS for daily\_steps  
ALTER TABLE public.daily\_steps ENABLE ROW LEVEL SECURITY;

\-- Policy: Users can manage their own step data  
CREATE POLICY "Allow individual user step management" ON public.daily\_steps  
  FOR ALL USING (auth.uid() \= user\_id);

\-- \#\# PostgreSQL Functions & Triggers (Conceptual) \#\#  
\-- Note: Actual function definitions will reside in Supabase migrations.  
\-- Example Trigger Concept:  
\-- CREATE TRIGGER calculate\_epp\_after\_steps\_upsert  
\--   AFTER INSERT OR UPDATE ON public.daily\_steps  
\--   FOR EACH ROW  
\--   EXECUTE FUNCTION update\_evolution\_progress\_from\_steps(); \-- Assumes this PG function exists

\-- Example Trigger Concept:  
\-- CREATE TRIGGER calculate\_epp\_after\_workout\_log  
\--   AFTER INSERT ON public.workout\_logs  
\--   FOR EACH ROW  
\--   EXECUTE FUNCTION update\_evolution\_progress\_from\_workout(); \-- Assumes this PG function exists

\-- Example Function Concept (updates profile and triggers broadcast):  
\-- CREATE OR REPLACE FUNCTION update\_evolution\_progress\_from\_steps() RETURNS TRIGGER ...  
\-- BEGIN  
\--   \-- Calculate EPP based on NEW.step\_count using asymptotic formula  
\--   \-- UPDATE public.user\_profiles SET evolution\_progress \= evolution\_progress \+ calculated\_epp WHERE id \= NEW.user\_id;  
\--   \-- Perform Realtime Broadcast using pg\_notify or Supabase realtime.broadcast function  
\--   RETURN NEW;  
\-- END;  
\-- $$ LANGUAGE plpgsql SECURITY DEFINER; \-- Use SECURITY DEFINER carefully

\-- Note: CombatCharacterStats are initially defined as static config, not a DB table.

## **Frontend Architecture**

### **Component Architecture**

#### **Component Organization**

Components will be organized by feature or screen, with shared/reusable components separated within the apps/mobile-shell package.

Plaintext  
apps/mobile-shell/  
└── src/  
    ├── components/         \# Shared, reusable UI components (e.g., PixelButton, PixelPanel)  
    │   ├── atoms/  
    │   ├── molecules/  
    │   └── organisms/      \# e.g., CustomTabBar, AvatarCard  
    ├── features/           \# Feature-specific components and logic  
    │   ├── onboarding/  
    │   ├── home/           \# e.g., HomeAvatarDisplay (using Skia), ProgressRings (Skia)  
    │   ├── profile/  
    │   └── settings/  
    ├── screens/            \# Top-level screen components  
    │   ├── HomeScreen.tsx    \# Contains Skia Canvas for DMG screen content  
    │   ├── ...  
    ├── navigation/         \# Navigation configuration  
    ├── services/           \# API interaction layer  
    ├── stores/             \# Zustand state management  
    ├── styles/             \# Global styles, NativeWind config, Fonts  
    ├── hooks/              \# Reusable custom hooks  
    ├── bridge/             \# Logic for interacting with WebSocket Bridge client  
    └── utils/              \# Utility functions

#### **Component Template**

Standard functional component template using TypeScript, React Native core components, NativeWind for styling, and Skia components for screen content.

TypeScript  
import React from 'react';  
import { View, Text } from 'react-native';  
import { styled } from 'nativewind'; // For Shell components  
import { Canvas, Text as SkiaText, useFont } from '@shopify/react-native-skia'; // For Screen content  
// Import pixel font  
// const pixelFont \= useFont(require('./path/to/PressStart2P-Regular.ttf'), 10); // Example

const StyledView \= styled(View); // NativeWind example

interface ExampleScreenContentProps {  
  message: string;  
}

// Example Component rendering \*within\* the virtual DMG screen area using Skia  
const ExampleScreenContent: React.FC\<ExampleScreenContentProps\> \= ({ message }) \=\> {  
    // Load pixel font (handle potential loading state)  
    // if (\!pixelFont) { return null; }

    return (  
        \<\>  
            {/\* Use Skia elements for rendering \*/}  
            {/\* Coordinates based on 160x144 logical DMG screen \*/}  
            {/\* Colors will be quantized by shader \*/}  
            {/\* \<SkiaText x={10} y={20} text={message} font={pixelFont} color="black" /\> \*/}  
             \<SkiaText x={10} y={20} text={message} color="\#0F380F" /\> {/\* Use darkest DMG color \*/}  
             {/\* Add other Skia drawings: Rect, ImageSVG, etc. \*/}  
        \</\>  
    );  
};

// Example Screen component combining Shell (NativeWind) and Screen (Skia)  
const ExampleScreen: React.FC \= () \=\> {  
  return (  
    // Outer shell element styled with NativeWind using Hardware Palette  
    \<StyledView className="flex-1 bg-body p-4"\> {/\* bg-body refers to \#D7D5CA \*/}  
        {/\* Virtual Screen Area \*/}  
        \<StyledView className="aspect-\[10/9\] w-full border-4 border-recess bg-lightest"\> {/\* bg-lightest is \#9BBC0F \*/}  
            {/\* Skia Canvas takes up the screen area \*/}  
            \<Canvas style={{ flex: 1 }} /\* antiAlias={false} \- Apply shader instead \*/ \>  
                \<ExampleScreenContent message="Hello Skia\!" /\>  
                {/\* Apply Quantization Shader Here \*/}  
            \</Canvas\>  
        \</StyledView\>  
        {/\* Other Shell elements \*/}  
        \<StyledView className="mt-4"\>  
             {/\* Example Shell Button \*/}  
             {/\* \<PixelButton label="Shell Button" onPress={() \=\> {}} variant='primary'/\> \*/}  
        \</StyledView\>  
    \</StyledView\>  
  );  
};

export default ExampleScreen; // Simplified structure

### **State Management Architecture**

#### **State Structure**

Feature-based Zustand stores for distinct domains (user, fitness, game) within apps/mobile-shell/src/stores/. Consider Legend-State for enhanced Supabase sync/offline capabilities.

Plaintext  
apps/mobile-shell/src/stores/  
├── userStore.ts    \# Profile, auth state  
├── fitnessStore.ts \# Synced health data, streak, energy calc results  
├── gameStore.ts    \# Tickets, selected char, bridge state?  
├── appStore.ts     \# Global loading, notifications  
└── index.ts        \# Exports hooks

#### **State Management Patterns**

Use selectors, ensure immutability, handle async actions within stores, leverage middleware (logging, persist, Immer).

#### **State Management Template**

Zustand create API with TypeScript interfaces, including async action examples and notes on persistence.

TypeScript  
// apps/mobile-shell/src/stores/userStore.ts  
import { create } from 'zustand';  
// ... other imports ...  
// Define UserState interface based on shared types

const useUserStore \= create\<UserState\>((set, get) \=\> ({  
  // ... state properties ...  
  // ... actions ...  
  // ... async actions (e.g., fetchUserProfile) ...  
}));  
export default useUserStore;

### **Routing Architecture**

#### **Route Organization**

Bottom Tab Navigator for primary navigation (Home, Battle, Profile, Settings), nested Stack Navigators for depth, managed within apps/mobile-shell/src/navigation/.

Plaintext  
apps/mobile-shell/src/navigation/  
├── AppNavigator.tsx    \# Handles Auth/Onboarding vs Main App state  
├── TabNavigator.tsx    \# Bottom tabs with CustomTabBar  
├── OnboardingNavigator.tsx \# Stack for onboarding screens  
└── types.ts            \# Navigation types

#### **Protected Route Pattern**

Top-level AppNavigator conditionally renders OnboardingNavigator or TabNavigator based on user state (profile loaded / onboarding complete) from Zustand store.

TypeScript  
// apps/mobile-shell/src/navigation/AppNavigator.tsx  
// ... imports ...

const AppNavigator: React.FC \= () \=\> {  
  const profile \= useUserStore(/\* ... selector ... \*/);  
  const isOnboardingComplete \= /\* ... check profile state ... \*/;

  return (  
    \<NavigationContainer\>  
      \<Stack.Navigator screenOptions={{ headerShown: false }}\>  
        {isOnboardingComplete ? (  
          \<Stack.Screen name="MainApp" component={TabNavigator} /\>  
        ) : (  
          \<Stack.Screen name="Onboarding" component={OnboardingNavigator} /\>  
        )}  
      \</Stack.Navigator\>  
    \</NavigationContainer\>  
  );  
};  
export default AppNavigator;

### **Frontend Services Layer**

#### **API Client Setup**

Centralized Supabase client initialization in apps/mobile-shell/src/services/supabaseClient.ts, configured with AsyncStorage for session persistence.

TypeScript  
// apps/mobile-shell/src/services/supabaseClient.ts  
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { createClient } from '@supabase/supabase-js';  
// ... env var loading ...

export const supabase \= createClient(supabaseUrl\!, supabaseAnonKey\!, {  
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },  
});

#### **Service Example**

Service functions encapsulating Supabase interactions (select, update, function calls) using the client, async/await, error handling, and shared types within apps/mobile-shell/src/services/.

TypeScript  
// apps/mobile-shell/src/services/userService.ts  
import { supabase } from './supabaseClient';  
import type { UserProfile } from '@packages/shared-types';

async function getUserProfile(userId: string): Promise\<UserProfile | null\> {  
  // ... Supabase query ...  
}  
// ... other service functions ...  
export const userService \= { getUserProfile, /\* ... \*/ };

## **Backend Architecture**

### **Service Architecture**

Hybrid logic placement: Use **Supabase Edge Functions** for API ingress, validation, orchestration, external calls. Use **PostgreSQL Functions** for data-intensive, transactional logic triggered by DB events or called by Edge Functions.

#### **Serverless Architecture (Edge Functions)**

##### **Function Organization**

Organized by feature within apps/supabase-functions/.

Plaintext  
apps/supabase-functions/  
├── avatar-generator/ \# Example  
│   └── index.ts  
├── record-workout/   \# Example  
│   └── index.ts  
├── shared/  
└── deno.json

##### **Function Template**

Deno/TypeScript template handling CORS, initializing Supabase Admin client, validating requests (JWT, payload), calling PG Functions or external APIs, handling errors, and returning standard JSON responses (ApiErrorResponse on failure).

TypeScript  
// apps/supabase-functions/avatar-generator/index.ts  
import { serve } from '\[https://deno.land/std@0.177.0/http/server.ts\](https://deno.land/std@0.177.0/http/server.ts)';  
import { createClient } from '\[https://esm.sh/@supabase/supabase-js@2\](https://esm.sh/@supabase/supabase-js@2)';  
// ... env var loading ...

serve(async (req) \=\> {  
  // ... CORS handling ...  
  try {  
    // ... Init Supabase Admin Client ...  
    // ... Auth validation (extract user from JWT) ...  
    // ... Request payload validation (Zod recommended) ...

    // ... Call Stable Diffusion API ...  
    // ... Perform Post-processing (Quantization) ...

    // ... Update DB via Supabase Admin Client ...  
    // await supabaseAdmin.from('user\_profiles')...

    // ... Return success response ...  
  } catch (error) {  
    // ... Log detailed error ...  
    // ... Return standard ApiErrorResponse ...  
  }  
});

#### **PostgreSQL Functions (PL/pgSQL)**

##### **Logic Placement**

Implement core data logic (EPP calculations, stat updates) as PL/pgSQL functions within Supabase migrations (supabase/migrations/). Trigger these functions from DB events (INSERT/UPDATE on daily\_steps, workout\_logs).

##### **Example Concept**

SQL  
\-- supabase/migrations/xxxx\_create\_epp\_functions.sql

\-- Function to calculate EPP from steps (Asymptotic)  
CREATE OR REPLACE FUNCTION calculate\_epp\_from\_steps(steps INTEGER)  
RETURNS REAL AS $$  
DECLARE  
  max\_daily\_epp REAL := 100.0; \-- Configurable  
  k REAL := 0.00016; \-- Configurable  
BEGIN  
  RETURN max\_daily\_epp \* (1.0 \- exp(-k \* steps));  
END;  
$$ LANGUAGE plpgsql IMMUTABLE;

\-- Trigger Function to update profile and broadcast after step update  
CREATE OR REPLACE FUNCTION handle\_steps\_update()  
RETURNS TRIGGER AS $$  
DECLARE  
  calculated\_epp REAL;  
BEGIN  
  calculated\_epp := calculate\_epp\_from\_steps(NEW.step\_count);  
  \-- Update evolution\_progress in user\_profiles table  
  UPDATE public.user\_profiles  
  SET evolution\_progress \= evolution\_progress \+ (calculated\_epp \- COALESCE(OLD.evolution\_points\_gained, 0.0)), \-- Adjust progress based on change  
      updated\_at \= now() \-- Also update timestamp  
  WHERE id \= NEW.user\_id;

  \-- Update the calculated EPP on the daily\_steps row itself  
  NEW.evolution\_points\_gained \= calculated\_epp;

  \-- Trigger Realtime Broadcast  
  PERFORM supabase\_functions.http\_request( \-- Or use pg\_notify \+ Supabase Realtime Function Hook  
    'POST',  
    '\<SUPABASE\_URL\>/realtime/v1/broadcast',  
    '{"event": "profile\_update", "type": "broadcast", "payload": {"user\_id": "' || NEW.user\_id || '"}}', \-- Minimal payload  
    '{"Authorization": "Bearer \<SERVICE\_ROLE\_KEY\>", "Content-Type": "application/json", "apikey": "\<ANON\_KEY\>"}'  
     \-- Ideally use pg\_net extension or Supabase realtime.broadcast() if available in PG funcs  
  );

  RETURN NEW; \-- Return NEW for INSERT/UPDATE triggers  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER; \-- Use SECURITY DEFINER carefully

\-- Trigger Definition  
CREATE TRIGGER steps\_updated\_trigger  
  AFTER INSERT OR UPDATE ON public.daily\_steps  
  FOR EACH ROW  
  EXECUTE FUNCTION handle\_steps\_update();

### **Database Architecture**

#### **Schema Design**

Defined previously using SQL DDL, including user\_profiles, workout\_logs, daily\_steps tables with RLS enabled.

#### **Data Access Layer**

Use Supabase client library directly within service files (RN) or Edge Functions. Conceptual Repository pattern for organization. Core calculations handled by PG Functions triggered automatically.

TypeScript  
// Example: Edge function inserts raw data, triggering PG function  
// apps/supabase-functions/record-workout/index.ts  
// ... inside try block ...  
const { error: insertError } \= await supabaseAdmin  
  .from('workout\_logs')  
  .insert({  
    user\_id: user.id,  
    workout\_type: payload.type,  
    duration\_minutes: payload.duration,  
    start\_time: payload.start,  
    end\_time: payload.end,  
    // evolution\_points\_gained will be calculated by PG trigger function  
  });  
if (insertError) throw insertError;  
// PG function handles EPP calculation, profile update, and broadcast  
// ... return success ...

### **Auth Architecture**

#### **Auth Flow**

Use Supabase Anonymous Sign-Ins \+ Linking Identity. React Native Shell acts as Secure Proxy for WebView actions. No tokens exposed to WebView.

Code snippet  
sequenceDiagram  
    participant User  
    participant RNShell as React Native Shell  
    participant SupabaseClient as Supabase JS Client  
    participant SupabaseAuth as Supabase Auth Service  
    participant EdgeFunction

    User-\>\>RNShell: Launch App  
    RNShell-\>\>SupabaseClient: signInAnonymously()  
    SupabaseClient-\>\>SupabaseAuth: Request Anon Session  
    SupabaseAuth--\>\>SupabaseClient: Return Anon Session  
    SupabaseClient--\>\>RNShell: Store Anon Session Securely

    %% User decides to sign up/in later  
    User-\>\>RNShell: Initiate Signup/Login  
    RNShell-\>\>SupabaseClient: updateUser() / linkIdentity()  
    SupabaseClient-\>\>SupabaseAuth: Link Identity Request  
    SupabaseAuth--\>\>SupabaseClient: Return Full Session  
    SupabaseClient--\>\>RNShell: Store Full Session Securely

    %% Authenticated Action from WebView (Secure Proxy)  
    User-\>\>Phaser(WebView): Trigger Save Action  
    Phaser(WebView)-\>\>Bridge: Send 'SAVE\_DATA' intent (Payload)  
    Bridge-\>\>RNShell: Deliver Intent  
    RNShell-\>\>RNShell: Validate Intent  
    RNShell-\>\>SupabaseClient: Retrieve Auth Token  
    SupabaseClient--\>\>RNShell: Return JWT  
    RNShell-\>\>EdgeFunction: Call Function with JWT \+ Payload  
    EdgeFunction-\>\>SupabaseAuth: Verify JWT  
    EdgeFunction-\>\>EdgeFunction: Perform Action (e.g., DB write)  
    EdgeFunction--\>\>RNShell: Return Result  
    RNShell-\>\>Bridge: Send Result back to Phaser  
    Bridge-\>\>Phaser(WebView): Deliver Result

#### **Middleware/Guards**

* **React Native Shell:** Navigation guards based on Zustand auth state.  
* **Supabase Edge Functions:** Validate JWT passed in Authorization header using Supabase Admin client auth.getUser(token).

## **Unified Project Structure**

Monorepo structure managed by Nx, separating apps (mobile-shell, game-engine, supabase-functions) and packages (shared-types, bridge-interface, ui-components). Database migrations and PG functions reside in supabase/migrations/.

Plaintext  
16bitfit-v3-mono/  
├── apps/  
│   ├── mobile-shell/      \# React Native  
│   ├── game-engine/       \# Phaser config/build  
│   └── supabase-functions/\# Edge Functions  
├── packages/  
│   ├── shared-types/      \# TS Interfaces  
│   ├── bridge-interface/  \# Bridge Protocol Defs  
│   └── ui-components/     \# RN UI Components  
├── supabase/  
│   ├── migrations/        \# DB Schema & PG Functions  
│   └── config.toml        \# Supabase local config  
├── docs/                  \# Documentation  
├── tools/                 \# Scripts  
├── nx.json                \# Nx Config  
├── package.json           \# Root Deps  
├── tsconfig.base.json     \# Base TS Config  
└── README.md

## **Development Workflow**

### **Local Development Setup**

#### **Prerequisites**

Node.js, yarn/npm, Nx CLI, React Native Environment (Xcode/Android Studio), Supabase CLI, Deno, Docker (for local Supabase).

Bash  
\# Example prerequisite installations (macOS with Homebrew)  
brew install node yarn nx deno supabase/tap/supabase-cli docker \# Docker Desktop separate install  
\# Follow React Native CLI Quickstart guide

#### **Initial Setup**

Clone repo, install deps, link/start local Supabase, setup .env, install mobile deps, run pods.

Bash  
git clone \<repo\> && cd \<repo\>  
yarn install  
supabase link \--project-ref \<ref\>  
supabase start  
cp .env.example .env && \# EDIT .env with local keys  
cd apps/mobile-shell && yarn install && cd ../../  
cd apps/mobile-shell/ios && pod install && cd ../../..  
supabase db reset \# Apply initial migrations

#### **Development Commands**

Use Nx commands from root for serving apps, testing, linting, building. Run supabase start and supabase functions serve separately or via custom Nx target.

Bash  
\# Start local Supabase (run once)  
supabase start  
\# Start local Edge Functions  
supabase functions serve \--env-file .env  
\# Start RN Metro bundler & app  
nx serve mobile-shell  
\# Run tests  
nx run-many \--target=test \--all  
\# Lint  
nx run-many \--target=lint \--all

### **Environment Configuration**

#### **Required Environment Variables**

Managed via .env files (root for backend/functions, apps/mobile-shell/.env for client-safe vars). Includes Supabase URLs/keys (local vs prod), external API keys.

Bash  
\# .env.example (Root)  
SUPABASE\_URL="http://localhost:54321"  
SUPABASE\_ANON\_KEY="local-anon-key"  
SUPABASE\_SERVICE\_ROLE\_KEY="local-service-role-key"  
OPENAI\_API\_KEY="your-key" \# Actually Stable Diffusion Key  
\# ... Production keys commented out ...

\# apps/mobile-shell/.env (Example client-safe vars)  
EXPO\_PUBLIC\_SUPABASE\_URL=${SUPABASE\_URL} \# Use EXPO\_PUBLIC\_ prefix if using Expo conventions  
EXPO\_PUBLIC\_SUPABASE\_ANON\_KEY=${SUPABASE\_ANON\_KEY}

## **Deployment Architecture**

### **Deployment Strategy**

* **Frontend (Mobile Shell):** Native app bundles (.ipa, .aab) built via CI/CD (e.g., EAS Build, Codemagic) and distributed via App Store / Google Play.  
* **Backend (Supabase):** DB migrations applied via Supabase CLI (db push). Edge Functions deployed via Supabase CLI (functions deploy). PostgreSQL Functions deployed as part of migrations.

### **CI/CD Pipeline**

Conceptual GitHub Actions workflow: Trigger on main push/PR. Jobs for linting, testing (RN, Edge, PG via pgTAP), deploying backend (migrations, functions), and building/deploying mobile app (using service like EAS Build). Secrets management crucial.

YAML  
\# .github/workflows/ci-deploy.yaml (Conceptual)  
name: CI & Deploy  
on: \[push, pull\_request\] \# Simplified triggers

jobs:  
  test\_lint: \# Lints and runs tests across monorepo  
    \# ... steps for checkout, node setup, install, lint, test (RN, Edge, PG) ...  
  deploy\_backend: \# Deploys DB migrations, PG funcs, Edge funcs  
    needs: test\_lint  
    if: github.ref \== 'refs/heads/main'  
    \# ... steps for checkout, Supabase CLI setup, db push, functions deploy ...  
  deploy\_mobile: \# Builds and deploys mobile apps (e.g., via EAS)  
    needs: deploy\_backend  
    if: github.ref \== 'refs/heads/main'  
    \# ... steps for checkout, node setup, mobile build service setup (EAS), build, submit ...

### **Environments**

| Environment | Frontend URL | Backend URL (Supabase Project) | Purpose |
| :---- | :---- | :---- | :---- |
| Development | Local Emulator/Device | Local Supabase (localhost:54321) | Local development & testing |
| Staging | Internal Distribution (TF/GPlay Beta) | Staging Supabase Project | Pre-production testing, QA |
| Production | App Store / Google Play | Production Supabase Project | Live environment |

## **Security and Performance**

### **Security Requirements**

* **Frontend:** Secure Storage (react-native-keychain), Deep Link validation, Dependency Audits, Code Obfuscation.  
* **Backend:** RLS on all tables, Input Validation (Edge Functions), API Key Mgmt (Secrets \+ Edge Functions only), Rate Limiting (TBD), CORS (Prod restrictive), Least Privilege (Service Role in functions only).  
* **Authentication:** Supabase Auth, Secure JWT Handling (RN only via Secure Proxy), Strong Passwords, Session Mgmt.  
* **Data Protection:** Strict Health Data adherence, Secure Photo handling, Encryption (at-rest, in-transit via HTTPS).  
* **Bridge/WebView:** Validate Bridge message origin/structure in RN, Harden WebView config (originWhitelist, mixedContentMode, disable debug).

### **Performance Optimization**

* **Frontend (RN Shell):** Bundle Size (Metro), Optimize Re-renders (memo, hooks), Reanimated 4 Worklets, Skia for graphics, Optimize Startup Time (\<3s).  
* **Backend (Supabase):** DB Query Optimization (Indexes), Edge/PG Function efficiency (cold starts, lean logic), Targeted Realtime subscriptions.  
* **Game Engine (Phaser/WebView):** **Local WebSocket \+ MessagePack Bridge** (\<10ms target), Object Pooling, Texture Atlasing, Progressive Asset Loading, Fixed Timestep Physics, **Quality Tier System**, Rendering Optimization, Strict Memory Management (\<150MB target), touchstart events.  
* **Reliability:** Implement **Fetch-on-Reconnect** pattern for Realtime client.

## **Testing Strategy**

### **Testing Pyramid**

Manual QA \> E2E (Detox/Maestro) \> Integration (RNTL / SuperDeno) \> Unit (Jest / Deno / pgTAP).

### **Test Organization**

Tests co-located or in dedicated folders within apps and packages. E2E tests likely in apps/mobile-shell/e2e/. PG Function tests (\*.test.sql) alongside migrations.

#### **Frontend Tests (React Native Shell)**

Jest \+ RNTL for unit/integration tests (\*.test.tsx).

#### **Backend Tests (Supabase Edge Functions)**

Deno Testing \+ SuperDeno for unit/integration tests (\*.test.ts).

#### **Backend Tests (PostgreSQL Functions)**

pgTAP for unit testing PL/pgSQL functions within migrations (\*.test.sql).

#### **E2E Tests**

Detox or Maestro for critical user flows (\*.test.ts).

### **Test Examples**

(Conceptual templates provided previously for RN Component, Edge Function, E2E flow). PG function tests would use pgTAP syntax.

## **Coding Standards**

### **Critical Fullstack Rules**

* **Type Sharing:** Use packages/shared-types exclusively.  
* **API Calls (FE):** Use apps/mobile-shell/src/services/ layer.  
* **Env Vars:** Access via config modules only.  
* **Error Handling:** Follow defined strategy.  
* **State Updates (FE):** Immutable updates only.  
* **DB Access (BE):** Use Supabase client via service/repo layer; prefer PG funcs for logic.  
* **Security Context:** No sensitive data in logs.  
* **Bridge Comm:** Use packages/bridge-interface protocol exclusively.  
* **Pixel Perfection (FE):** Adhere to UI Spec (Palettes, Fonts, Grid, Skia).

### **Naming Conventions**

| Element | Frontend (apps/mobile-shell) | Backend (apps/supabase-functions, DB) | Example |
| :---- | :---- | :---- | :---- |
| Components (React) | PascalCase | N/A | UserProfileCard.tsx |
| Hooks (React) | camelCase (usePrefix) | N/A | useFitnessData.ts |
| Service Files | camelCase | camelCase | userService.ts |
| State Stores | camelCase (useSuffix) | N/A | userStore.ts |
| Edge Functions (Dir) | kebab-case | kebab-case | avatar-generator/ |
| PG Functions | N/A | snake\_case | calculate\_epp\_from\_steps() |
| Database Tables | N/A | snake\_case (plural) | user\_profiles, workout\_logs |
| Database Columns | N/A | snake\_case | selected\_archetype, step\_count |
| Variables/Functions | camelCase | camelCase (TS), snake\_case (SQL) | getUserProfile, totalSteps |
| Types/Interfaces | PascalCase | PascalCase | UserProfile, DailySteps |

## **Error Handling Strategy**

### **Error Flow**

Catch errors at source (FE, BE, Bridge, Phaser), log centrally (Sentry), provide user-friendly feedback. Diagram illustrates flow.

### **Error Response Format (Edge Functions)**

Standard ApiErrorResponse JSON object with error: { code, message, details?, timestamp, requestId? }.

### **Frontend Error Handling (React Native Shell)**

Error Boundaries, try/catch in services/hooks, map ApiErrorResponse, handle Bridge errors, global handler (report to Sentry), user-friendly messages.

### **Backend Error Handling (Supabase Edge & PG Functions)**

* **Edge:** Validate inputs (Zod), catch client/external API errors, throw custom business logic errors, top-level catch, log details, return standard ApiErrorResponse.  
* **PG Functions:** Use PL/pgSQL exception handling, log errors within DB or raise exceptions for Edge Function to catch.

## **Monitoring and Observability**

### **Monitoring Stack**

* **Frontend:** Sentry (Crash Reporting, Performance).  
* **Backend:** Supabase Platform Logs \+ Sentry (Edge Function errors/perf).  
* **Error Tracking:** Sentry (Unified FE/BE).  
* **Performance:** Sentry Performance \+ Supabase Query Monitoring \+ Custom Bridge/Phaser instrumentation.  
* **Realtime:** Supabase Dashboard.

### **Key Metrics**

* **Frontend:** Crash Rate (\<0.1%), ANRs, Startup Time (\<3s), UI Perf (60fps), JS Errors, API Perf, Bridge Perf.  
* **Backend:** Edge Func Rate/Errors(\<0.5%)/Duration, DB Query Perf/Usage, API GW Metrics, Auth Metrics.  
* **Game Engine:** Combat FPS (60fps), Input Latency (\<50ms), Memory Usage (\<150MB), Asset Load Times, Game Logic Errors.

## **Checklist Results Report (Post-Research Integration)**

*(Summary copied from previous response)*

### **1\. Executive Summary**

* **Project Type:** Fullstack (React Native Shell \+ Phaser WebView \+ Supabase BaaS)  
* **Overall Architecture Readiness:** High (Ready for Development)  
* **Critical Risks Identified:** Performance NFRs (Bridge), AI Dependency (Complexity/Cost), Bridge Complexity, Realtime Scalability, Skia Implementation.  
* **Key Strengths:** Leverages V2 wins, Clear SoC, Research-validated Tech Stack, Refined Backend Strategy (Hybrid Logic, Broadcast), Enhanced Security (RN Secure Proxy), Comprehensive Strategies (Testing, Error Handling etc.), Monorepo Structure.  
* **Sections Evaluated:** All sections evaluated.

### **2\. Section Analysis**

*(All sections ✅ PASS with high confidence after research integration. Minor points noted)*

### **3\. Risk Assessment (Updated based on Research)**

1. Hybrid Bridge Performance/Implementation (High) \- Mitigate: Early validation, Quality Tiers.  
2. AI Avatar Pipeline Complexity/Cost (Medium-High) \- Mitigate: Edge Function, Monitor, Fallback.  
3. Realtime Scalability (Medium) \- Mitigate: Private Channels, Minimal Payload, Fetch-on-Reconnect.  
4. Skia/Shader Implementation (Medium) \- Mitigate: Leverage examples, Allocate time.  
5. Phaser/WebView Limitations (Low-Medium) \- Mitigate: V2 Learnings, Memory Mgmt, Profiling.

### **4\. Recommendations**

* **Must-Fix:** None.  
* **Address Early:** Bridge Implementation, AI Avatar Pipeline, Skia Shader, PG Function workflow.  
* **Nice-to-Have:** Supabase generated types, Legend-State exploration.

### **5\. AI Implementation Readiness**

* **High Readiness.** Structure & patterns support AI dev. Careful prompting needed for Bridge, Skia, PG Functions.

### **6\. Frontend-Specific Assessment**

* Comprehensive, aligned with UI Spec, validated choices (Skia/Reanimated).

