# 🏗️ Desktop Architect Handoff - 16BitFit V3 Setup & Continuation

**Date Created:** 2025-10-31
**Project:** 16BitFit V3 - Gamified Fitness with Pixel Art Combat
**Source:** Migrated from laptop via GitHub
**Target:** Desktop development environment
**Methodology:** BMAD-METHOD (Breakthrough Method of Agile AI-Driven Development)

---

## 🎯 MISSION: Complete Desktop Setup & Continue Development

**You are the Architect agent on the desktop computer.** Your mission is to:
1. Verify the GitHub clone completed successfully
2. Install all project dependencies (npm, iOS pods)
3. Link the Supabase backend
4. Verify the development environment is fully operational
5. Understand the project context (what's done, what's in progress, what's next)
6. Distribute tasks to appropriate BMAD agents to continue development

---

## 📋 TABLE OF CONTENTS

1. [Quick Start - Immediate Setup Tasks](#quick-start---immediate-setup-tasks)
2. [Project Context & History](#project-context--history)
3. [What's Been Completed](#whats-been-completed)
4. [What's Currently In Progress](#whats-currently-in-progress)
5. [What Still Needs to Be Done](#what-still-needs-to-be-done)
6. [Lessons Learned from V2](#lessons-learned-from-v2)
7. [Critical Mistakes to Avoid](#critical-mistakes-to-avoid)
8. [BMAD Methodology Overview](#bmad-methodology-overview)
9. [Architecture & Tech Stack](#architecture--tech-stack)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Agent Distribution Strategy](#agent-distribution-strategy)

---

## ⚡ QUICK START - Immediate Setup Tasks

### Prerequisites Verification

Before starting, verify:
- [ ] Node.js v20+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Xcode installed (for iOS development)
- [ ] CocoaPods installed (`pod --version`)
- [ ] Supabase CLI installed (`supabase --version`)

### Step 1: Verify Clone Success

```bash
# Navigate to cloned repository
cd ~/Desktop/16BitFit-V3  # Or wherever you cloned it

# Verify git remote
git remote -v
# Should show: origin  https://github.com/seanwinslow28/16BitFit-V3.git

# Check current branch
git branch
# Should show: * main

# Verify repository structure
ls -la
# Should see: apps/, docs/, packages/, supabase/, BMAD-METHOD/, etc.
```

### Step 2: Copy .env File from External Drive

```bash
# CRITICAL: Copy .env file
cp /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env .env

# Verify .env exists
ls -la .env
# Should show: -rw-r--r--  1 yourname  staff  ~1KB

# Verify .env is ignored by git
git check-ignore .env
# Should output: .env

# NEVER commit .env
git status .env
# Should output: (nothing, because it's ignored)
```

**⚠️ CRITICAL:** If .env is missing, STOP. The project won't work without it.

### Step 3: Optional - Copy MIGRATION_STAGING

```bash
# Optional: Copy V2 reference assets if you want them
cp -r /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/MIGRATION_STAGING \
      docs/archive/

# This is NOT required but useful for reference
# Contains V2 sprites, audio, and code
```

### Step 4: Install Node Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Root dependencies
# - apps/mobile-shell dependencies
# - apps/game-engine dependencies
# - packages/* dependencies
#
# Time: ~5-10 minutes (downloading ~1GB)
```

**Expected Output:**
```
added 1547 packages, and audited 1548 packages in 3m
found 0 vulnerabilities
```

### Step 5: Install iOS Dependencies (CocoaPods)

```bash
# Navigate to iOS directory
cd apps/mobile-shell/ios

# Install pods
pod install

# Alternative if you get errors:
# NO_FLIPPER=1 pod install

# Return to project root
cd ../../..
```

**Expected Output:**
```
Installing...
Pod installation complete! There are X dependencies from the Podfile and X total pods installed.
```

**Time:** ~10-15 minutes (downloading ~1.7GB)

### Step 6: Link Supabase Project

```bash
# Link to existing Supabase project
supabase link --project-ref noxwzelpibuytttlgztq

# When prompted, you may need to authenticate
# Follow the CLI prompts to log in
```

**Expected Output:**
```
Linked to project: 16BitFit-V3 (noxwzelpibuytttlgztq)
```

### Step 7: Regenerate Supabase Types

```bash
# Generate TypeScript types from Supabase schema
supabase gen types typescript --local > \
  apps/mobile-shell/src/types/database.types.ts

# This fixes the "user_steps table not found" TypeScript error
```

### Step 8: Verify Setup

```bash
# Check git status (should be clean or show only generated types)
git status

# Verify no secrets exposed
git check-ignore .env
# Should output: .env

# Verify BMAD-METHOD is present
ls -la BMAD-METHOD/
# Should show: bmad-core/, expansion-packs/, etc.

# Check architecture docs
ls -la docs/architecture/
# Should show: 18 markdown files
```

### Step 9: Test iOS Build (Optional but Recommended)

```bash
# Try building the iOS app
npm run ios

# This will:
# - Start Metro bundler
# - Build iOS app in Xcode
# - Launch iOS simulator
# - Run the app

# Time: ~5-10 minutes for first build
```

**Expected:**
- Simulator launches
- App displays (even if placeholder screen)
- No critical errors in console

**If build fails:** See [Troubleshooting Guide](#troubleshooting-guide) below

---

## 📖 PROJECT CONTEXT & HISTORY

### Project Vision

**16BitFit V3** is a gamified fitness application that transforms real-world workouts into epic boss battles using:
- **React Native** mobile shell for native performance
- **Phaser 3** game engine for pixel-art combat in WebView
- **Supabase** backend for real-time data, auth, and edge functions
- **AI-generated sprites** ($15 for 374 sprites using Google Imagen 4)
- **Strategic simplicity** over technical complexity

### V2 → V3 Migration

This is **Version 3** - a greenfield rebuild using BMAD-METHOD.

**V2 Achievements:**
- Built functional prototype with 60fps combat
- Generated 374 sprites for $15 using AI
- Created Hybrid Velocity Bridge (<10ms WebView latency)
- Validated mobile WebView for real-time games
- Documented lessons learned in `docs/LESSONS_LEARNED.md`

**V3 Goals:**
- Professional architecture with BMAD methodology
- Nx monorepo structure
- Comprehensive documentation
- Test-driven development
- CI/CD pipeline
- Scalable for team collaboration

### Timeline

- **October 2024:** V2 prototype completed
- **October 24-26, 2025:** V3 initialization (Story 1.1 complete on laptop)
- **October 27-31, 2025:** Security audit, cleanup, migration prep
- **October 31, 2025:** Pushed to GitHub, migrating to desktop
- **November 2025:** Continue development on desktop (Story 1.3+)

---

## ✅ WHAT'S BEEN COMPLETED

### Epic 1: Project Initialization & GitHub Migration

#### Story 1.1: Project Initialization & Core Dependencies ✅
**Status:** Complete (on laptop)
**Agent:** Dev
**Completed:** October 24-26, 2025

**What Was Done:**
- Initialized Nx monorepo with React Native preset
- Created `apps/mobile-shell/` with React Native 0.71.8
- Created `apps/game-engine/` with Phaser 3.70.0
- Created `apps/supabase-functions/` for Edge Functions
- Created `packages/` for shared types and components
- Set up `supabase/` directory with migrations
- Configured linting (ESLint, Prettier) and pre-commit hooks
- Installed core dependencies:
  - @supabase/supabase-js
  - @react-navigation/native
  - react-native-reanimated 4.x
  - @shopify/react-native-skia
  - nativewind 4.x
  - zustand 4.x
- Set up MCP connectors (GitHub, Firecrawl, Context7, Supabase)
- Created comprehensive documentation structure

**Deliverables:**
- Working Nx monorepo
- iOS builds successfully on simulator
- Android configured (not yet tested)
- 18 architecture documentation files
- BMAD-METHOD framework installed

**Files:** `docs/stories/1.1.project-initialization.story.md`

#### Story MIGRATION-1.1: Security & Secrets Audit ✅
**Status:** Complete
**Agent:** Architect
**Completed:** October 31, 2025

**What Was Done:**
- Removed exposed Context7 API key from story file
- Verified all secrets in .env (git-ignored)
- Enhanced .gitignore with comprehensive patterns
- Searched entire codebase for embedded secrets
- Verified no iOS certificates or credentials exposed
- Generated comprehensive security audit report

**Deliverables:**
- `SECURITY_AUDIT_REPORT.md` - Complete security audit
- Updated `.gitignore` with iOS build logs, temp files
- Zero exposed secrets in repository

**Critical Finding:** Context7 API key was exposed in `docs/stories/1.1.project-initialization.story.md` - FIXED

#### Story MIGRATION-1.2: Repository Cleanup & Optimization ✅
**Status:** Complete
**Agent:** Dev
**Completed:** October 31, 2025

**What Was Done:**
- Deleted iOS build log (7.5MB)
- Excluded MIGRATION_STAGING directory (139MB kept locally)
- Verified all 95 untracked files are legitimate
- Optimized repository from 148MB to 9MB (94% reduction)
- Updated .gitignore to exclude MIGRATION_STAGING

**Deliverables:**
- `REPOSITORY_CLEANUP_REPORT.md` - Cleanup analysis
- Lean 9MB repository (without dependencies)
- Clean project structure ready for GitHub

**Files Removed:**
- `apps/mobile-shell/ios/Build MobileShell_2025-10-26T05-36-13.txt` (7.5MB)

**Files Excluded (kept locally):**
- `docs/archive/MIGRATION_STAGING/` (139MB of V2 assets)

#### Story MIGRATION-1.3: Pre-Push Quality Verification ✅
**Status:** Complete
**Agent:** QA
**Completed:** October 31, 2025

**What Was Done:**
- Validated all JSON files (package.json, tsconfig.json, nx.json, etc.)
- Ran TypeScript compilation check (`tsc --noEmit`)
- Verified critical file integrity (README, docs, reports)
- Tested .gitignore functionality
- Analyzed 38 TypeScript errors (all non-blocking)
- Generated comprehensive QA report
- Approved repository for GitHub push

**Deliverables:**
- `PRE_PUSH_QA_REPORT.md` - Quality verification report
- Approval for GitHub migration

**TypeScript Errors Found:** 38 total (all development work-in-progress, not blockers)
- 21 Deno Edge Function errors (environment-specific)
- 7 Health service type mismatches
- 2 Browser global errors (game engine)
- 2 Supabase schema errors (needs type regeneration)
- 6 Type safety issues

**Status:** All errors are expected, none block development

---

## 🔄 WHAT'S CURRENTLY IN PROGRESS

### Nothing Currently In Progress (Clean Slate on Desktop)

**Current State:**
- Repository successfully migrated to GitHub
- Desktop setup pending (YOU ARE HERE)
- Ready to continue Story 1.3 development after setup

**Next Immediate Tasks (After Setup):**
1. Verify environment operational
2. Review Story 1.3 requirements
3. Begin Story 1.3 implementation (Character system)
4. OR continue with Story 1.2 completion tasks if needed

---

## 📅 WHAT STILL NEEDS TO BE DONE

### Epic 1: Project Initialization (Continued)

#### Story 1.2: Database Schema & Supabase Setup
**Status:** Partially complete
**Priority:** HIGH
**Assigned Agent:** Backend Specialist

**Remaining Tasks:**
- Review existing migrations (3 files in `supabase/migrations/`)
- Create additional migrations for:
  - Character progression tables
  - Battle system tables
  - Achievement tables
  - Guild/social tables
- Set up Row Level Security (RLS) policies
- Create database functions (PL/pgSQL)
- Set up Supabase Edge Functions
- Test database schema locally
- Deploy to Supabase cloud

**Dependencies:**
- Regenerate Supabase types (CRITICAL - do this first)
- Review `docs/architecture/database-schema.md`

#### Story 1.3: Character System & Avatar Generation
**Status:** Not started
**Priority:** HIGH
**Assigned Agent:** Dev + UI/UX Specialist

**Tasks:**
- Implement character creation flow
- Integrate avatar generator Edge Function
- Create character customization UI
- Connect to Supabase user profiles
- Implement character progression logic
- Add character stats system

**Dependencies:**
- Story 1.2 (database schema)
- Avatar generation Edge Function

#### Story 1.4: Health Service Integration (iOS & Android)
**Status:** Partially implemented
**Priority:** MEDIUM
**Assigned Agent:** Health Integration Specialist

**Known Issues:**
- Health service type mismatches (7 TypeScript errors)
- iOS HealthKit integration incomplete
- Android Health Connect integration incomplete
- Sync service needs Supabase types update

**Tasks:**
- Fix type mismatches in `healthServiceImpl.android.ts`
- Fix type mismatches in `healthServiceImpl.ios.ts`
- Complete HealthKit permissions flow
- Complete Health Connect permissions flow
- Test step counting on both platforms
- Implement background sync

### Epic 2: Game Engine Integration

#### Story 2.1: Phaser WebView Bridge
**Status:** Not started
**Priority:** HIGH
**Assigned Agent:** Phaser3 Integration Specialist

**Tasks:**
- Implement Hybrid Velocity Bridge V2
- Create WebView component in React Native
- Set up Phaser game engine in WebView
- Test <10ms communication latency
- Implement binary message protocol
- Test 60fps performance

**Reference:**
- V2 implementation in `docs/archive/MIGRATION_STAGING/01_CRITICAL_INNOVATIONS/BridgeProtocolV2.js`
- Lessons learned in `docs/LESSONS_LEARNED.md`

#### Story 2.2: Combat System Core
**Status:** Not started
**Priority:** MEDIUM
**Assigned Agent:** Game Dev Specialist

**Tasks:**
- Port V2 combat system to V3
- Implement frame-based combat (60fps)
- Create fighter entity system
- Add combo system with 30-frame input buffer
- Implement special moves
- Add hit detection and damage calculation

**Reference:**
- V2 combat code in `docs/archive/MIGRATION_STAGING/01_CRITICAL_INNOVATIONS/CombatSystem.js`

### Epic 3: Boss Battle System

#### Story 3.1-3.5: Boss Implementation
**Status:** Not started
**Priority:** MEDIUM

**Bosses to Implement:**
1. Procrastination Phantom
2. Sloth Demon
3. Gym Bully
4. Stress Titan
5. Ultimate Slump (final boss)

**Tasks per Boss:**
- AI pattern implementation
- Sprite integration
- Attack patterns
- Health/damage balancing
- Victory/defeat conditions

**Reference:**
- Boss sprites in `docs/archive/MIGRATION_STAGING/02_SPRITE_ASSETS/bosses/`
- Boss AI in `docs/archive/MIGRATION_STAGING/01_CRITICAL_INNOVATIONS/BossAI.js`

### Epic 4: Asset Generation & Integration

#### Story 4.1: AI Sprite Generation Pipeline
**Status:** Not started
**Priority:** LOW (V2 assets available in MIGRATION_STAGING)

**Tasks:**
- Review V2 AI generation scripts
- Update for Google Imagen 4 API
- Create automation scripts
- Generate any missing sprites
- Optimize sprite sheets

**Reference:**
- Generation scripts in `docs/archive/MIGRATION_STAGING/04_AI_GENERATION/`
- Cost: $15 for 374 sprites (proven in V2)

### Epic 5: Testing & Quality Assurance

#### Story 5.1: Unit Test Coverage
**Status:** Not started
**Priority:** MEDIUM

**Tasks:**
- Set up Jest for React Native
- Set up Deno tests for Edge Functions
- Write component tests
- Write service tests
- Achieve 70%+ code coverage

#### Story 5.2: E2E Testing
**Status:** Not started
**Priority:** LOW

**Tasks:**
- Set up Detox or Maestro
- Write critical path E2E tests
- Automate test runs

### Epic 6: Deployment & CI/CD

#### Story 6.1: GitHub Actions CI/CD
**Status:** Not started
**Priority:** MEDIUM

**Tasks:**
- Set up TypeScript checks
- Set up linting checks
- Set up test automation
- Set up iOS build automation
- Set up Android build automation

---

## 📚 LESSONS LEARNED FROM V2

### Critical Insights (from `docs/LESSONS_LEARNED.md`)

#### 1. The $15 Sprite Revolution

**What Worked:**
- Google Imagen 4 API generated 374 production sprites for $15
- Anchor reference system ensured 75-85% visual consistency
- Batch processing (4 images/call) optimized costs
- 99.9% cost savings vs traditional art ($15 vs $15,000)

**Lesson for V3:** Use AI for asset generation, don't over-engineer

#### 2. Strategic Simplicity Over Technical Complexity

**What Worked:**
- Sprite-based animation (not skeletal)
- 80% less memory (10MB vs 50MB per character)
- Simpler implementation
- Better documentation
- Faster iteration

**Lesson for V3:** Choose simple over sophisticated at every decision point

#### 3. The Hybrid Velocity Bridge (<10ms)

**What Worked:**
- WebView pre-injection eliminated handshake latency
- Binary protocol reduced overhead
- Achieved <10ms communication (10x better than standard)
- Maintained 60fps in combat

**Lesson for V3:** WebView is viable for real-time games with right architecture

#### 4. Performance Optimization Hierarchy

**What Actually Mattered:**
1. Asset loading strategy (progressive > preload-all)
2. Texture atlas optimization
3. Object pooling (garbage collection)
4. Quality tier system (device adaptation)
5. Frame limiting (battery conservation)

**What Didn't Matter:**
- Micro-optimizations in JavaScript
- Complex caching strategies
- WebGL shader optimizations

**Lesson for V3:** Focus on asset loading and memory management, not micro-optimizations

#### 5. The 12-Specialist Sweet Spot

**What Worked:**
- 12 specialized agents (not 40+)
- Clear domain ownership
- No overlap or confusion
- Manageable coordination

**Lesson for V3:** BMAD-METHOD has right agent structure, use it

#### 6. Epic-Based Development

**What Worked:**
- Epic 2 validation before features
- Story-based task breakdown
- Clear completion criteria
- Performance baselines first

**Lesson for V3:** Follow BMAD story workflow, validate before building

---

## ⚠️ CRITICAL MISTAKES TO AVOID

### From V2 Migration Experience:

#### 1. Metro Bundler Cache Hell

**Problem:** Metro cache corruption caused mysterious build failures

**Solution:**
```bash
# Nuclear cache clear strategy
watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/metro-*
npm cache clean --force
npm install
npx react-native start --reset-cache
```

**Lesson:** Clear caches aggressively when build issues occur

#### 2. The EPIC2-STUB Pattern (Mistake)

**Problem:** Created 24 stub files to bypass compilation errors

**What We Should Have Done:** Fixed the actual errors, not created stubs

**Lesson for V3:** Don't create temporary workarounds, fix root causes

#### 3. Emoji Rendering Issues

**Problem:** Emojis broke iOS text rendering

**Solution:** Complete emoji removal from codebase

**Lesson:** Test platform-specific quirks early

#### 4. The 40+ Agents Mistake

**Problem:** Too many specialized agents caused:
- Communication bottlenecks
- Unclear responsibilities
- Decision paralysis
- Coordination overhead

**Lesson:** BMAD's 12 agents is the right number

#### 5. Skeletal Animation Temptation

**What We Almost Did:** Implement complex skeletal animation system

**Why We Didn't:**
- Would have added 6 weeks
- 10x complexity increase
- Worse performance
- Limited documentation

**Lesson:** Strategic simplicity > technical sophistication

#### 6. Premature Optimization

**What We Almost Did:** Micro-optimize JavaScript before profiling

**What We Should Do:** Profile first, optimize what matters

**Lesson:** Asset loading > code optimization

---

## 🎯 BMAD METHODOLOGY OVERVIEW

### What is BMAD-METHOD?

**BMAD** = **B**reakthrough **M**ethod of **A**gile AI-**D**riven Development

**Two Key Innovations:**

1. **Agentic Planning:** Specialized agents (Analyst, PM, Architect) create detailed PRDs and Architecture docs through human-in-the-loop refinement

2. **Context-Engineered Development:** Scrum Master creates hyper-detailed story files with full context, eliminating context loss

### BMAD Agent Structure

**Planning Phase (Web UI):**
- **Analyst** - Requirements gathering
- **PM** - Product strategy
- **Architect** - Technical architecture (YOU ARE HERE)
- **UX Expert** - User experience design

**Development Phase (IDE):**
- **Scrum Master (SM)** - Creates detailed story files
- **Dev** - Implements stories
- **QA** - Tests and verifies

**Specialized Agents:**
- **Backend Specialist** - Supabase, Edge Functions
- **Phaser3 Integration Specialist** - Game engine
- **UI/UX Specialist** - React Native UI
- **Health Integration Specialist** - HealthKit, Health Connect
- **Asset Generation Specialist** - AI sprites

### BMAD Workflow

1. **Planning (Web):** Create PRD + Architecture docs
2. **Sharding (IDE):** SM creates story files with full context
3. **Development (IDE):** Dev implements, QA verifies
4. **Iteration:** Repeat for each story

**Current Project Status:**
- ✅ PRD created (see `docs/prd/`)
- ✅ Architecture created (see `docs/architecture/`)
- ✅ Story 1.1 complete
- 🔄 Story 1.2-1.4 in progress

### BMAD Files in This Project

**Location:** `BMAD-METHOD/`

**Structure:**
```
BMAD-METHOD/
├── bmad-core/
│   ├── agents/          # Agent definitions
│   │   ├── bmad-orchestrator.md
│   │   ├── architect.md
│   │   ├── dev.md
│   │   ├── qa.md
│   │   └── sm.md
│   ├── data/            # Knowledge bases
│   └── tasks/           # Reusable tasks
└── expansion-packs/     # Domain-specific packs
```

**How to Use:**
- Activate agent: `*architect` (in web UI)
- Run task: `*task create-doc` (in web UI)
- Get help: `*help`

**Important:** BMAD-METHOD is part of this project, committed to git

---

## 🏛️ ARCHITECTURE & TECH STACK

### Monorepo Structure

```
16BitFit-V3/
├── apps/
│   ├── mobile-shell/      # React Native app
│   ├── game-engine/       # Phaser 3 config/build
│   └── supabase-functions/# Edge Functions
├── packages/
│   ├── shared-types/      # TypeScript interfaces
│   ├── bridge-interface/  # Bridge protocol
│   └── ui-components/     # Shared RN components
├── supabase/
│   └── migrations/        # SQL migrations
├── docs/
│   ├── architecture/      # 18 architecture docs
│   ├── stories/           # BMAD story files
│   ├── prd/               # Product requirements
│   └── qa/                # QA documentation
├── BMAD-METHOD/           # BMAD framework
├── .env                   # Secrets (git-ignored)
└── .gitignore             # Comprehensive patterns
```

### Tech Stack

**Frontend:**
- React Native 0.71.8 (mobile shell)
- TypeScript 5.x
- Phaser 3.70.0 (game engine in WebView)
- Zustand 4.x (state management)
- React Navigation 6.x
- Reanimated 4.x (animations)
- react-native-skia 1.x (custom rendering)
- NativeWind 4.x (Tailwind for RN)

**Backend:**
- Supabase Cloud (BaaS)
- PostgreSQL (Supabase hosted)
- Edge Functions (TypeScript on Deno)
- Supabase Auth
- Supabase Realtime
- Supabase Storage

**Build & Testing:**
- Nx (monorepo management)
- Metro (RN bundler)
- Jest + React Native Testing Library
- ESLint + Prettier
- Husky (pre-commit hooks)

**AI/MCP:**
- GitHub MCP (version control)
- Firecrawl MCP (documentation)
- Context7 MCP (library docs)
- Supabase MCP (database access)

### Key Architecture Decisions

**From `docs/architecture/index.md`:**

1. **Hybrid Architecture:** React Native shell + Phaser WebView
2. **Monorepo:** Nx for code sharing and organization
3. **Strategic Simplicity:** Sprite-based (not skeletal animation)
4. **BaaS Approach:** Supabase over custom backend
5. **AI-First Assets:** Generate sprites with AI ($15 cost)
6. **Performance Target:** 60fps combat, <10ms bridge latency

### Critical Architecture Files

**Must Read:**
- `docs/architecture/index.md` - Architecture overview
- `docs/architecture/tech-stack.md` - Technology choices
- `docs/architecture/frontend-architecture.md` - RN + Phaser
- `docs/architecture/backend-architecture.md` - Supabase
- `docs/architecture/unified-project-structure.md` - File organization
- `docs/LESSONS_LEARNED.md` - V2 insights

---

## 🛠️ TROUBLESHOOTING GUIDE

### Common Setup Issues

#### Issue 1: npm install fails

**Symptoms:**
```
npm ERR! network request failed
npm ERR! peer dependency issues
```

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

#### Issue 2: pod install fails

**Symptoms:**
```
[!] CocoaPods could not find compatible versions
```

**Solutions:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clear CocoaPods cache
pod cache clean --all

# Deintegrate and reinstall
cd apps/mobile-shell/ios
pod deintegrate
pod install

# If Flipper causes issues, disable it
NO_FLIPPER=1 pod install
```

#### Issue 3: Xcode build fails

**Symptoms:**
```
Build failed with errors
Command PhaseScriptExecution failed
```

**Solutions:**
```bash
# Clean Xcode build
cd apps/mobile-shell/ios
rm -rf ~/Library/Developer/Xcode/DerivedData
xcodebuild clean

# Reset Metro cache
watchman watch-del-all
rm -rf $TMPDIR/metro-*
npx react-native start --reset-cache

# Rebuild
npm run ios
```

#### Issue 4: .env file missing

**Symptoms:**
```
Error: Missing environment variables
Supabase connection failed
```

**Solution:**
```bash
# Copy from external drive
cp /Volumes/YOUR_DRIVE/16BitFit-V3-Secrets/.env .env

# Verify
cat .env | head -5
# Should show: SUPABASE_URL=...

# Verify git ignore
git check-ignore .env
# Should output: .env
```

#### Issue 5: TypeScript errors on first build

**Symptoms:**
```
38 TypeScript errors found
Type 'X' is not assignable to type 'Y'
```

**Not a Problem:**
- These are expected development errors
- See `PRE_PUSH_QA_REPORT.md` for full analysis
- None are blockers

**If you want to fix them:**
```bash
# Regenerate Supabase types
supabase gen types typescript --local > \
  apps/mobile-shell/src/types/database.types.ts

# Add dom lib to game-engine tsconfig
# Edit: apps/game-engine/tsconfig.json
# Add: "lib": ["dom", "es2015"]

# Create Deno config for Edge Functions
# Create: apps/supabase-functions/deno.json
```

#### Issue 6: Supabase link fails

**Symptoms:**
```
Error: Not authenticated
Project not found
```

**Solutions:**
```bash
# Login to Supabase
supabase login

# Link with correct project ref
supabase link --project-ref noxwzelpibuytttlgztq

# If still fails, check .env
cat .env | grep SUPABASE
# Should show valid URL and keys
```

#### Issue 7: Metro bundler port conflict

**Symptoms:**
```
Port 8081 already in use
```

**Solutions:**
```bash
# Kill existing Metro
lsof -ti:8081 | xargs kill

# Or use different port
npx react-native start --port 8082
```

---

## 🎯 AGENT DISTRIBUTION STRATEGY

### Immediate Tasks (After Setup) - Assign to Architect

**Your Role:** Verify setup and create task distribution plan

**Tasks:**
1. ✅ Run all setup steps above
2. ✅ Verify iOS build works (`npm run ios`)
3. ✅ Verify git status is clean
4. ✅ Review TypeScript errors (non-blocking)
5. ✅ Read architecture docs (`docs/architecture/`)
6. ✅ Review LESSONS_LEARNED.md
7. ✅ Create task distribution plan for other agents

### Task Distribution Plan

#### For Scrum Master (SM) Agent

**Prompt:**
```
Review Story 1.2, 1.3, 1.4 in docs/stories/
Create detailed implementation plans for:
- Story 1.2: Database Schema completion
- Story 1.3: Character System implementation
- Story 1.4: Health Service fixes

Break down into sub-tasks
Assign to appropriate specialist agents
Set priority and dependencies
```

#### For Dev Agent

**Prompt:**
```
Review Story 1.3: Character System
Implement character creation flow:
1. Character selection UI
2. Avatar generator integration
3. Supabase profile creation
4. Character stats system

Reference:
- docs/architecture/frontend-architecture.md
- docs/architecture/database-schema.md
```

#### For Backend Specialist

**Prompt:**
```
Review and complete Story 1.2: Database Schema
Tasks:
1. Review existing migrations in supabase/migrations/
2. Create character progression tables
3. Create battle system tables
4. Set up RLS policies
5. Create database functions

Reference:
- docs/architecture/database-schema.md
- docs/architecture/backend-architecture.md
```

#### For Health Integration Specialist

**Prompt:**
```
Fix Story 1.4 TypeScript errors:
1. Fix healthServiceImpl.android.ts type errors (7 errors)
2. Fix healthServiceImpl.ios.ts type errors
3. Complete HealthKit permissions flow
4. Complete Health Connect permissions flow
5. Test step counting

Reference:
- apps/mobile-shell/src/services/health/
- PRE_PUSH_QA_REPORT.md (TypeScript error analysis)
```

#### For QA Agent

**Prompt:**
```
After Dev completes tasks:
1. Test character creation flow
2. Test database migrations
3. Test health service integrations
4. Run TypeScript checks
5. Verify no regressions

Create QA report for each story
```

### Coordination Strategy

**Use BMAD Story Files:**
- Each story has full context
- Handoff between agents via completion reports
- SM coordinates overall progress

**Priority Order:**
1. Story 1.2 (Database) - CRITICAL path
2. Story 1.3 (Characters) - Depends on 1.2
3. Story 1.4 (Health) - Can parallelize with 1.3
4. Story 2.1 (Phaser Bridge) - After 1.2-1.4 complete

---

## 📊 PROJECT METRICS & STATUS

### Repository Stats

| Metric | Value |
|--------|-------|
| Total Files (in git) | 95 files |
| Repository Size | 9MB (without deps) |
| With Dependencies | ~3.1GB (node_modules + Pods) |
| Lines of Code | ~15,000 (estimated) |
| Documentation Files | 23 files |
| Architecture Docs | 18 files |

### Development Status

| Epic | Stories | Complete | In Progress | Remaining |
|------|---------|----------|-------------|-----------|
| Epic 1: Initialization | 5 | 1 | 0 | 4 |
| Epic 2: Game Engine | 3 | 0 | 0 | 3 |
| Epic 3: Boss Battles | 5 | 0 | 0 | 5 |
| Epic 4: Assets | 2 | 0 | 0 | 2 |
| Epic 5: Testing | 2 | 0 | 0 | 2 |
| Epic 6: Deployment | 2 | 0 | 0 | 2 |
| **Total** | **19** | **1** | **0** | **18** |

### Completion Percentage

- **Project Initialization:** 20% (Story 1.1 done, 1.2-1.5 remaining)
- **Overall Project:** 5% (1 of 19 stories complete)
- **Migration to Desktop:** 100% ✅

---

## 🎉 SUCCESS CRITERIA

### Setup is Complete When:

- [ ] All setup steps executed without errors
- [ ] `npm install` completed successfully
- [ ] `pod install` completed successfully
- [ ] `supabase link` connected successfully
- [ ] `git status` shows clean or only generated types
- [ ] `.env` file exists and is git-ignored
- [ ] `npm run ios` builds and launches app
- [ ] iOS simulator shows app (even if placeholder)
- [ ] All architecture docs reviewed
- [ ] LESSONS_LEARNED.md reviewed
- [ ] Task distribution plan created

### You're Ready to Develop When:

- [ ] Setup complete (above)
- [ ] Understand BMAD workflow
- [ ] Understand project history (V2 → V3)
- [ ] Know what's been completed
- [ ] Know what's next (Story 1.2-1.4)
- [ ] Know critical mistakes to avoid
- [ ] Reviewed TypeScript errors (38, all non-blocking)
- [ ] Can delegate to specialist agents

---

## 📞 GETTING HELP

### Resources

**Documentation:**
- `README.md` - Project overview
- `docs/architecture/index.md` - Architecture guide
- `docs/LESSONS_LEARNED.md` - V2 insights
- `SECURITY_AUDIT_REPORT.md` - Security audit
- `REPOSITORY_CLEANUP_REPORT.md` - Cleanup details
- `PRE_PUSH_QA_REPORT.md` - QA verification

**BMAD Resources:**
- `BMAD-METHOD/README.md` - Framework overview
- `BMAD-METHOD/docs/user-guide.md` - User guide
- `BMAD-METHOD/bmad-core/agents/` - Agent definitions

**External:**
- BMAD Discord: https://discord.gg/gk8jAdXWmj
- GitHub Issues: https://github.com/seanwinslow28/16BitFit-V3/issues
- Supabase Docs: https://supabase.com/docs

### When Stuck

1. **Check Troubleshooting Guide** (above)
2. **Review Architecture Docs** (`docs/architecture/`)
3. **Check LESSONS_LEARNED.md** (V2 solutions)
4. **Review QA Report** (`PRE_PUSH_QA_REPORT.md`)
5. **Ask BMAD Orchestrator** (`*orchestrator` in web UI)
6. **Consult Specialist Agent** (Backend, Phaser, Health, etc.)

---

## ✅ FINAL CHECKLIST

### Before Starting Development:

- [ ] Read this entire document
- [ ] Executed all setup steps
- [ ] Verified iOS build works
- [ ] Copied .env from external drive
- [ ] Regenerated Supabase types
- [ ] Reviewed all architecture docs
- [ ] Read LESSONS_LEARNED.md
- [ ] Understand BMAD workflow
- [ ] Know what's been completed (Stories 1.1, MIGRATION 1.1-1.3)
- [ ] Know what's next (Stories 1.2-1.4)
- [ ] Know critical mistakes to avoid
- [ ] Created task distribution plan

### When Ready to Proceed:

**Hand off to Scrum Master to:**
1. Create detailed plan for Story 1.2 (Database)
2. Create detailed plan for Story 1.3 (Characters)
3. Create detailed plan for Story 1.4 (Health)
4. Assign to specialist agents
5. Coordinate development workflow

**Or, hand off to Dev to:**
1. Start implementing Story 1.3 (Character System)
2. Follow existing story file in `docs/stories/`
3. Create completion report when done

---

## 🚀 LET'S BUILD!

You now have everything you need to:
- ✅ Complete desktop setup
- ✅ Understand project context and history
- ✅ Know what's done and what's next
- ✅ Avoid critical mistakes from V2
- ✅ Use BMAD methodology effectively
- ✅ Delegate to specialist agents
- ✅ Continue development seamlessly

**Welcome to the desktop!** 🎮

---

*Document Created: 2025-10-31*
*Project: 16BitFit V3*
*Source: Laptop (GitHub migrated)*
*Target: Desktop (Fresh setup)*
*Methodology: BMAD-METHOD v4.x*
*Status: Ready for Development*

---

## 📝 QUICK REFERENCE COMMANDS

```bash
# Setup sequence
cd ~/Desktop/16BitFit-V3
cp /Volumes/DRIVE/16BitFit-V3-Secrets/.env .env
npm install
cd apps/mobile-shell/ios && pod install && cd ../../..
supabase link --project-ref noxwzelpibuytttlgztq
supabase gen types typescript --local > apps/mobile-shell/src/types/database.types.ts
npm run ios

# Common commands
npm run ios              # Build iOS app
npm run android          # Build Android app
npm run test             # Run tests
npm run lint             # Run linter
npm run format           # Format code
git status               # Check repo status
supabase status          # Check Supabase status

# Troubleshooting
watchman watch-del-all && rm -rf node_modules && npm install
cd apps/mobile-shell/ios && pod deintegrate && pod install
rm -rf ~/Library/Developer/Xcode/DerivedData
lsof -ti:8081 | xargs kill
```

Good luck! 🍀
