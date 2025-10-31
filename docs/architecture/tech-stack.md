# **Tech Stack**

## **Cloud Infrastructure**

* **Provider:** Supabase  
* **Key Services:** PostgreSQL Database, Realtime Subscriptions (Broadcast), Authentication, Edge Functions (Deno), PostgreSQL Functions (PL/pgSQL), Storage  
* **Deployment Regions:** TBD (Likely US East/West for NA Launch)

## **Technology Stack Table**

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
