# 16BitFit V3 - Gamified Fitness with Pixel Art Combat

A gamified fitness application combining React Native mobile shell with Phaser 3 game engine for an immersive retro gaming experience that transforms workouts into epic boss battles.

## Project Structure

This is an **Nx-managed monorepo** with the following structure:

```
16bitfit-v3-mono/
├── apps/
│   ├── mobile-shell/      # React Native mobile app (v0.71.8)
│   ├── game-engine/       # Phaser 3 game engine (v3.70.0)
│   └── supabase-functions/# Deno Edge Functions
├── packages/
│   ├── shared-types/      # TypeScript interfaces and types
│   ├── bridge-interface/  # Hybrid Velocity Bridge protocol
│   └── ui-components/     # Shared React Native UI components
├── supabase/
│   ├── migrations/        # Database schema and PG functions
│   └── config.toml        # Supabase local development config
├── docs/                  # Documentation
├── tools/                 # Build scripts and utilities
└── README.md
```

## Tech Stack

### Frontend
- **React Native** v0.71.8 - Cross-platform mobile shell
- **TypeScript** v5.x - Type safety and developer experience
- **Phaser 3** v3.70.0 - 2D combat game engine (WebView)
- **Zustand** v4.x - Lightweight state management
- **React Navigation** v6.x - App navigation
- **Reanimated** v2.x - Performant UI animations
- **react-native-skia** v1.x - Custom pixel rendering
- **NativeWind** v4.x - Utility-first styling (Tailwind for RN)

### Backend
- **Supabase** - Cloud-hosted BaaS (Auth, DB, Realtime, Functions, Storage)
- **PostgreSQL** - Supabase-hosted primary database
- **Deno** - Edge Functions runtime (TypeScript)

### Build & Testing
- **Metro** - React Native bundler
- **Webpack** - Phaser bundle builder
- **Jest + RNTL** - Unit and integration testing
- **Nx** - Monorepo build orchestration

## Prerequisites

### Required Software

- **Node.js** v18.x (REQUIRED - v18.20.8 recommended)
  - ⚠️ **Critical:** React Native 0.71.8 is NOT compatible with Node.js v20+
  - Use `nvm` (Node Version Manager) to manage Node versions
  - Install nvm: `brew install nvm` (macOS)
- **npm** >= 9.0.0
- **CocoaPods** (for iOS development)
- **Xcode** >= 14.0 (for iOS)
- **Android Studio** (for Android)
- **Java JDK** 11+ (for Android)
- **Watchman** (recommended for better file watching)

### Node Version Manager Setup

If you don't have `nvm` installed:

```bash
# Install nvm via Homebrew (macOS)
brew install nvm

# Create nvm working directory
mkdir ~/.nvm

# Add to your shell profile (~/.zshrc or ~/.bashrc)
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"

# Reload your shell
source ~/.zshrc  # or source ~/.bashrc
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 16BitFit-V3
```

### 2. Set Up Node.js v18

**Critical Step:** Ensure you're using Node.js v18.x before proceeding:

```bash
# Install Node.js v18
nvm install 18

# Use Node.js v18
nvm use 18

# Verify version (should show v18.x.x)
node -v
```

The project includes a `.node-version` file in `apps/mobile-shell/` that specifies Node 18.

### 3. Install Dependencies

```bash
# Ensure Node 18 is active
nvm use 18

# Install all dependencies
npm install
```

This will install all dependencies for the entire monorepo workspace and run post-install scripts including:
- Boost iOS patch for React Native 0.71.8 compatibility
- Husky git hooks setup

**Note:** If you encounter a `react-native-reanimated` conflict during installation:
```bash
# Remove conflicting nested dependency
rm -rf node_modules/nativewind/node_modules/react-native-reanimated

# Then continue with iOS setup
```

### 4. Environment Variables

Copy the `.env.example` file to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `GITHUB_TOKEN` - GitHub Personal Access Token (for MCP connector)
- `FIRECRAWL_API_KEY` - Firecrawl API key (for documentation research)

### 5. Install iOS Dependencies (macOS only)

```bash
# Navigate to iOS directory
cd apps/mobile-shell/ios

# Set UTF-8 encoding (required for CocoaPods)
export LANG=en_US.UTF-8

# Install pods
pod install

# Return to project root
cd ../../..
```

**Important Notes:**
- CocoaPods requires UTF-8 encoding. Always set `LANG=en_US.UTF-8` before running pod commands
- If you get deployment target errors, the Podfile is configured for iOS 13.0 minimum
- The post-install script automatically integrates a Metro synchronization build phase

## Development

### Running the Mobile Shell

#### Prerequisites for Running
- Ensure Node.js v18 is active in your terminal
- CocoaPods dependencies installed (iOS only)

#### iOS Development

**Method 1: React Native CLI (Recommended)**

Start Metro bundler in one terminal:
```bash
cd apps/mobile-shell

# Ensure Node 18 is active
export NVM_DIR="$HOME/.nvm"
source "/usr/local/opt/nvm/nvm.sh"
nvm use 18

# Start Metro bundler
npx react-native start
```

In a second terminal, launch the app:
```bash
cd apps/mobile-shell

# Ensure Node 18 is active
export NVM_DIR="$HOME/.nvm"
source "/usr/local/opt/nvm/nvm.sh"
nvm use 18

# Launch on simulator (auto-selects available simulator)
npx react-native run-ios

# Or specify a simulator
npx react-native run-ios --simulator="iPhone 17 Pro"
```

**Method 2: Xcode**

1. Start Metro bundler first (in terminal):
```bash
cd apps/mobile-shell
export NVM_DIR="$HOME/.nvm"
source "/usr/local/opt/nvm/nvm.sh"
nvm use 18
npx react-native start
```

2. Open Xcode workspace:
```bash
open apps/mobile-shell/ios/MobileShell.xcworkspace
```

3. Select your target simulator from the device dropdown
4. Press `Cmd + R` or click the Play button to build and run

**Expected Output:**
- Build should complete successfully
- App installs on simulator
- Metro shows: `BUNDLE ./index.js`
- Console shows: `LOG Running "MobileShell" with {"rootTag":1,"initialProps":{}}`
- Simulator displays the app with "16BitFit Shell Ready" screen

#### Android Development

```bash
cd apps/mobile-shell

# Ensure Node 18 is active
export NVM_DIR="$HOME/.nvm"
source "/usr/local/opt/nvm/nvm.sh"
nvm use 18

# Start Metro (in one terminal)
npx react-native start

# Launch on Android (in another terminal)
npx react-native run-android
```

Or use root scripts:
```bash
npm run android
```

### Building the Game Engine

```bash
nx run game-engine:build
```

Or from game-engine directory:
```bash
cd apps/game-engine
npm run build
```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests for mobile-shell only:
```bash
cd apps/mobile-shell
npm test
```

### Linting and Formatting

```bash
# Lint all files
npm run lint

# Format all files
npm run format

# Check formatting without writing
npm run format:check

# Type check all packages
npm run type-check
```

## Project Scripts

From the root directory:

- `npm run mobile-shell` - Start Metro bundler for React Native
- `npm run ios` - Run iOS app
- `npm run android` - Run Android app
- `npm run build:ios` - Build iOS release
- `npm run build:android` - Build Android release
- `npm run lint` - Lint all projects
- `npm run format` - Format all files with Prettier
- `npm run type-check` - Type check all TypeScript files
- `npm run test` - Run all tests

## MCP (Model Context Protocol) Connectors

This project uses MCP connectors to enhance AI-assisted development:

### Essential Connectors

1. **Filesystem MCP** (Built-in)
   - Direct file system operations across the codebase
   - No setup required

2. **GitHub MCP** (High Priority)
   - Version control operations
   - Requires `GITHUB_TOKEN` in `.env`

3. **Firecrawl MCP** (High Priority)
   - Documentation research for dependencies
   - Requires `FIRECRAWL_API_KEY` in `.env`

4. **Context7 MCP**
   - Library-specific documentation for exact versions
   - Pre-configured via CLI:
   ```bash
   claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ctx7sk-d94bb01d-d98d-432f-a4ad-1a6b554c46ed"
   ```

### Optional Connectors

5. **Figma MCP** (If design files available)
   - Design file inspection
   - Requires `FIGMA_ACCESS_TOKEN` in `.env`

6. **Chrome DevTools MCP** (For WebView debugging)
   - Inspect Phaser game in WebView
   - Debug Hybrid Velocity Bridge

## Architecture

### Hybrid Architecture

16BitFit uses a **Hybrid Velocity Bridge** architecture:

- **React Native Shell**: Native UI, navigation, data management
- **Phaser WebView**: High-performance 2D combat rendering
- **WebSocket Bridge**: Real-time bidirectional communication

### Component Organization

Mobile Shell follows **Atomic Design**:
- `components/atoms/` - Basic UI elements (buttons, inputs, text)
- `components/molecules/` - Simple combinations (form fields, cards)
- `components/organisms/` - Complex components (headers, forms)
- `features/` - Feature-specific components and logic
- `screens/` - Top-level screen components

### State Management

- **Zustand** for global app state
- **React Navigation** for navigation state
- **Supabase Realtime** for backend sync

## Configuration Details

### Metro Bundler Configuration

The project uses a custom Metro configuration for monorepo support ([metro.config.js](apps/mobile-shell/metro.config.js)):

**Key Features:**
- **Monorepo Support:** Watches entire workspace root for changes
- **Explicit Module Resolution:** Defines `nodeModulesPaths` for both app and root
- **Hierarchical Lookup Disabled:** Prevents Metro from searching parent directories
- **Extended Source Extensions:** Supports `.ts`, `.tsx`, `.js`, `.jsx`, `.json`
- **BMAD-METHOD Exclusion:** Blocks BMAD-METHOD directory to prevent Haste conflicts

**Metro Version:** v0.73.10 (compatible with RN 0.71.8)

### Babel Configuration

The project uses a minimal Babel configuration ([babel.config.js](apps/mobile-shell/babel.config.js)):

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // NativeWind babel plugin temporarily disabled (RN 0.71.8 incompatibility)
    // 'nativewind/babel',
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

**Important Notes:**
- `react-native-reanimated/plugin` MUST be the last plugin in the array
- NativeWind babel plugin is temporarily disabled due to compatibility issues with RN 0.71.8
- Re-enable NativeWind after upgrading to React Native 0.74+

## Known Issues & Solutions

### ✅ Resolved: iOS Build Configuration

**Previous Issue:** iOS builds were failing due to:
1. Node.js version incompatibility (v24.x with RN 0.71.8)
2. Metro bundle connection issues in monorepo setup
3. React Native Reanimated conflicts from NativeWind

**Resolution Applied (October 2025):**
1. ✅ Node.js downgraded to v18.20.8 (compatible with RN 0.71.8)
2. ✅ Metro configuration updated for monorepo structure
3. ✅ Babel configuration updated with proper plugin ordering
4. ✅ NativeWind babel plugin temporarily disabled
5. ✅ React Native Reanimated conflicts resolved
6. ✅ CocoaPods installation successful with UTF-8 encoding
7. ✅ App successfully builds and runs on iOS simulator

**Current Status:** iOS development environment is fully functional

### ⚠️ Known Limitations

#### 1. NativeWind Styling Temporarily Disabled

**Issue:** NativeWind v4.x babel plugin causes compilation errors with React Native 0.71.8

**Current Workaround:**
- NativeWind babel plugin is commented out in `babel.config.js`
- Styles may not render as expected until React Native upgrade

**Permanent Solution:**
- Upgrade to React Native 0.74+ or 0.76+ (recommended)
- Re-enable NativeWind babel plugin after upgrade

#### 2. React Native Version Constraint

**Issue:** React Native 0.71.8 has version compatibility constraints:
- Requires Node.js v18.x (not compatible with v20+)
- Limited support for newer packages
- Approaching end-of-life for community support

**Recommendation:**
- Plan migration to React Native 0.76+ for long-term stability
- Current setup is stable for immediate development needs

## Troubleshooting

### Common Issues and Solutions

#### Metro Bundler Issues

**Problem:** Metro won't start or shows cache errors

**Solution:**
```bash
cd apps/mobile-shell

# Clear Metro cache
rm -rf $TMPDIR/metro-* $TMPDIR/haste-* $TMPDIR/react-*

# Start Metro with cache reset
npx react-native start --reset-cache
```

**Problem:** Metro shows "Unable to resolve module" errors

**Solution:**
```bash
# Ensure you're using Node 18
nvm use 18

# Clear all caches and reinstall
rm -rf node_modules apps/mobile-shell/node_modules
npm install

# Clear Metro cache and restart
cd apps/mobile-shell
npx react-native start --reset-cache
```

#### iOS Build Issues

**Problem:** CocoaPods installation fails with encoding errors

**Solution:**
```bash
cd apps/mobile-shell/ios

# Set UTF-8 encoding
export LANG=en_US.UTF-8

# Deintegrate and reinstall
pod deintegrate
pod install
```

**Problem:** "Multiple versions of Reanimated detected"

**Solution:**
```bash
# Remove nested react-native-reanimated
rm -rf node_modules/nativewind/node_modules/react-native-reanimated

# Reinstall pods
cd apps/mobile-shell/ios
export LANG=en_US.UTF-8
pod install
```

**Problem:** App builds but shows blank screen or errors in simulator

**Solution:**
1. Check Metro terminal for JavaScript errors
2. Open Developer Menu in simulator (`Cmd + D`)
3. Select "Reload" (`Cmd + R`)
4. Check logs:
```bash
# View simulator logs
xcrun simctl spawn booted log stream --predicate 'processImagePath CONTAINS "MobileShell"' --level debug
```

#### Node Version Issues

**Problem:** Build fails with "Unsupported Node version" or strange npm errors

**Solution:**
```bash
# Verify Node version
node -v  # Should show v18.x.x

# If not, switch to Node 18
nvm use 18

# If Node 18 not installed
nvm install 18
nvm use 18

# Clean and rebuild
rm -rf node_modules
npm install
```

### Deep Clean and Rebuild

If you encounter persistent issues, perform a complete clean rebuild:

```bash
# 1. Ensure Node 18 is active
nvm use 18

# 2. Stop all Metro processes
killall node || true

# 3. Clean workspace
rm -rf node_modules
rm -rf tmp
rm -rf apps/mobile-shell/node_modules
rm -rf apps/mobile-shell/ios/Pods
rm -rf apps/mobile-shell/ios/build
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
watchman watch-del-all || true

# 4. Reinstall dependencies
npm install

# 5. Remove any nested reanimated conflicts
rm -rf node_modules/nativewind/node_modules/react-native-reanimated

# 6. Reinstall iOS pods
cd apps/mobile-shell/ios
export LANG=en_US.UTF-8
pod deintegrate
pod install
cd ../../..

# 7. Start Metro with clean cache
cd apps/mobile-shell
npx react-native start --reset-cache
```

## Quick Reference

### Essential Commands

```bash
# === NODE VERSION MANAGEMENT ===
nvm use 18                    # Switch to Node 18
node -v                       # Verify Node version

# === METRO BUNDLER ===
cd apps/mobile-shell
npx react-native start        # Start Metro bundler
npx react-native start --reset-cache  # Start with cache reset

# === iOS DEVELOPMENT ===
# Launch app on simulator
npx react-native run-ios --simulator="iPhone 17 Pro"

# Install/update pods
cd ios && export LANG=en_US.UTF-8 && pod install && cd ..

# View simulator logs
xcrun simctl spawn booted log stream --predicate 'processImagePath CONTAINS "MobileShell"'

# === IN-SIMULATOR SHORTCUTS ===
Cmd + D                       # Open Developer Menu
Cmd + R                       # Reload app
Cmd + Shift + H               # Go to home screen
Cmd + K                       # Toggle keyboard

# === CLEANING ===
watchman watch-del-all        # Clear Watchman cache
rm -rf $TMPDIR/metro-*        # Clear Metro cache
rm -rf $TMPDIR/haste-*        # Clear Haste cache
rm -rf node_modules           # Remove dependencies

# === COCOAPODS ===
export LANG=en_US.UTF-8       # Set encoding for CocoaPods
pod deintegrate               # Remove pod integration
pod install                   # Install pods
pod install --repo-update     # Install with repo update
```

### Environment Setup (Copy to Shell Profile)

Add these to your `~/.zshrc` or `~/.bashrc` for convenience:

```bash
# NVM Setup
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"

# CocoaPods UTF-8 encoding
export LANG=en_US.UTF-8

# Alias for quick 16BitFit development
alias rn18='nvm use 18'
alias 16bit='cd ~/Desktop/16BitFit-V3'
alias metro='cd ~/Desktop/16BitFit-V3/apps/mobile-shell && nvm use 18 && npx react-native start'
```

## Testing

### Test Organization

Tests are co-located with their source files:
- Unit tests: `*.test.ts` or `*.test.tsx`
- Location: `__tests__/` directories or next to source files

### Running Tests

```bash
# All tests
npm test

# Mobile shell tests only
cd apps/mobile-shell && npm test

# With coverage
npm test -- --coverage
```

### Current Test Coverage

- ✅ HomeScreen component rendering
- ✅ Core dependency imports (React Native, Supabase, Navigation, etc.)
- ✅ Authentication integration tests (Story 1.2)
- ⏳ E2E tests with Detox/Maestro (coming in future stories)

### Authentication Testing

Story 1.2 provides comprehensive authentication functionality with deferred and traditional auth patterns.

**Integration Tests:** `apps/mobile-shell/src/services/__tests__/authService.integration.test.ts`

**Testing Deferred Authentication:**
```typescript
import { useAuthStore } from './stores/authStore';

// Create deferred user (no authentication required)
const { createDeferred, deferredProfile } = useAuthStore();
await createDeferred('username123', 'Display Name');

// Profile persists across app restarts via AsyncStorage
// Upgrade to authenticated later
const { upgradeToAuth } = useAuthStore();
await upgradeToAuth(deferredProfile.id, 'email@example.com', 'password');
```

**Testing Email/Password Authentication:**
```typescript
import { useAuthStore } from './stores/authStore';

// Sign up new user
const { signUp } = useAuthStore();
await signUp('email@example.com', 'password', 'username', 'Display Name');

// Sign in existing user
const { signIn } = useAuthStore();
await signIn('email@example.com', 'password');

// Sign out
const { signOut } = useAuthStore();
await signOut();
```

**Testing Social Authentication:**
```typescript
import { useAuthStore } from './stores/authStore';

// Initiate OAuth flow (Google, Apple)
const { signInWithSocial } = useAuthStore();
await signInWithSocial('google');

// Session established after OAuth redirect to com.16bitfit://auth/callback
```

**Manual Verification (Supabase Dashboard):**
1. Navigate to Authentication → Users to view created users
2. Check Table Editor → user_profiles to verify profiles
3. Confirm `auth_status` field reflects deferred vs authenticated state
4. Verify profile auto-creation via trigger for new auth users

**See Also:**
- [Supabase Setup Guide](docs/guides/SUPABASE_SETUP_GUIDE.md) - Complete setup and verification
- [Story 1.2 Documentation](docs/stories/1.2.supabase-auth.story.md) - Acceptance criteria and usage examples

## Contributing

This project follows strict coding standards:

### Naming Conventions

- Components (React): `PascalCase` (e.g., `UserProfileCard.tsx`)
- Hooks (React): `camelCase` with `use` prefix (e.g., `useFitnessData.ts`)
- Service Files: `camelCase` (e.g., `userService.ts`)
- State Stores: `camelCase` with `Store` suffix (e.g., `userStore.ts`)
- Edge Functions: `kebab-case` (e.g., `avatar-generator/`)
- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`

### Git Workflow

Pre-commit hooks are configured via Husky:
- ESLint runs on staged `.ts`, `.tsx`, `.js`, `.jsx` files
- Prettier formats all staged files
- Type checking must pass

## License

[To be added]

## Successful Launch Verification

### What to Expect When the App Launches Successfully

When everything is configured correctly, you should see:

#### 1. Metro Terminal Output
```
Welcome to Metro v0.73.10
Fast - Scalable - Integrated

BUNDLE  ./index.js
LOG  Running "MobileShell" with {"rootTag":1,"initialProps":{}}
```

#### 2. Build Terminal Output
```
info Found Xcode workspace "MobileShell.xcworkspace"
success Successfully built the app
info Installing "/path/to/MobileShell.app" on iPhone 17 Pro
success Successfully launched the app on the simulator
```

#### 3. Simulator Display
The app should display a screen showing:
- **Title:** "16BitFit Shell Ready"
- **Status Messages:**
  - React Native v0.71.8
  - Phaser 3 Game Engine Initialized
  - Supabase Connected
- **Bottom Navigation:** Home and Phase 4 Tests tabs

### Current Build Status

**Last Successful Build:** October 26, 2025

**Configuration:**
- ✅ Node.js: v18.20.8
- ✅ React Native: v0.71.8
- ✅ Metro: v0.73.10
- ✅ Target: iPhone 17 Pro Simulator
- ✅ Build Type: Debug
- ✅ Bundle: Successfully served at http://localhost:8081

**Key Files Modified for This Build:**
- [metro.config.js](apps/mobile-shell/metro.config.js) - Monorepo configuration
- [babel.config.js](apps/mobile-shell/babel.config.js) - Babel plugins
- [package.json](package.json) - React Native Reanimated overrides
- [.node-version](apps/mobile-shell/.node-version) - Node 18 specification

## Recent Changes Log

### October 2025 - Metro Bundle Connection Fix

**Problem Solved:** App was unable to connect to Metro bundler, preventing development.

**Changes Applied:**

1. **Node.js Version Management**
   - Downgraded from Node v24.2.0 to v18.20.8
   - Added nvm installation and setup documentation
   - Created `.node-version` file for consistency

2. **Metro Configuration** ([metro.config.js](apps/mobile-shell/metro.config.js))
   - Added explicit `projectRoot` and `workspaceRoot` definitions
   - Enabled `disableHierarchicalLookup` for monorepo compatibility
   - Extended `sourceExts` to include TS/TSX files explicitly
   - Configured dual `nodeModulesPaths` for app and workspace

3. **Babel Configuration** ([babel.config.js](apps/mobile-shell/babel.config.js))
   - Temporarily disabled NativeWind babel plugin (RN 0.71.8 incompatibility)
   - Ensured `react-native-reanimated/plugin` is last in plugins array
   - Added TODO comments for React Native upgrade

4. **Dependency Management**
   - Resolved react-native-reanimated duplicate instances
   - Added npm overrides for Reanimated version pinning
   - Configured nohoist rules for React Native packages

5. **CocoaPods Configuration**
   - Set UTF-8 encoding requirement in documentation
   - Integrated Metro synchronization build phase
   - Successfully installed all iOS dependencies

**Result:** App now builds successfully and connects to Metro bundler without errors.

## Support

For issues and questions:
- Create an issue in the repository
- Check documentation in `/docs`
- Review story files in `/docs/stories`
- See troubleshooting section above for common issues
- Reference analysis documents in `/docs` for detailed technical decisions

### Related Documentation

- [Metro Bundle Issue Analysis](docs/Google%20Deep%20Think%20Analysis%20-%2010-26%20-%204.md)
- [iOS Build Migration Report](docs/IOS_BUILD_MIGRATION_REPORT.md)
- [iOS Simulator Issues Analysis](docs/IOS_SIMULATOR_ISSUES_ANALYSIS.md)
- [iOS Launch Guide](docs/archive/IOS_LAUNCH_GUIDE.md)

---

**Generated with Claude Code** 🤖
**Last Updated:** October 26, 2025
**Status:** ✅ iOS Development Environment Fully Operational
