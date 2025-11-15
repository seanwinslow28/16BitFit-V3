# 🚀 EXECUTION PLAN: Fix Expo Go Integration

**Source:** Google Deep Think Analysis
**Created:** 2025-11-09
**Priority:** 🔴 HIGH
**Estimated Time:** 30-45 minutes

---

## 📋 PROMPT FOR ARCHITECT/DEVELOPER AGENT

Copy and paste this into your agent:

```
*architect - Execute the Google Deep Think Expo fix plan. Follow the steps exactly as outlined below. This will resolve the Metro bundler error and enable Expo Go on the iOS simulator.

IMPORTANT: Execute all commands from the monorepo root unless otherwise specified.

Your tasks:
1. Clean all dependencies and lock files
2. Configure dependency isolation for mobile-shell
3. Update testing library dependencies
4. Configure Metro for monorepo support
5. Reinstall dependencies with proper isolation
6. Install iOS Pods
7. Start Expo dev server and verify it works

After each major step, confirm completion before proceeding to the next step.
```

---

## 🎯 ROOT CAUSE (Summary)

**The Problem:**
- npm workspaces "hoisted" React 19.2.0 from root to mobile-shell
- React Native 0.77.3 requires React 18.3.1 (strict version)
- Metro bundler loaded wrong React version → errors
- `@expo/cli` couldn't find correct Metro modules due to hoisting

**The Solution:**
Use npm's `hoistingLimits` to isolate mobile-shell dependencies while keeping React 19 at root.

---

## 📝 STEP-BY-STEP EXECUTION

### **STEP 1: Clean Everything**

**Working Directory:** Monorepo root (`16BitFit-V3/`)

```bash
echo "Cleaning dependencies, lock files, and Pods..."

# Remove all node_modules in the workspace efficiently
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Remove root lock file
rm -f package-lock.json

# Clean iOS Pods
cd apps/mobile-shell/ios
# Use pod deintegrate if CocoaPods is installed, otherwise just remove Pods/Lockfile
if command -v pod > /dev/null; then
  pod deintegrate
fi
rm -rf Pods Podfile.lock

# Navigate back to the monorepo root
cd ../../..

echo "✅ Cleanup complete"
```

**Expected Result:** All `node_modules`, `package-lock.json`, and iOS Pods removed

---

### **STEP 2: Configure Dependency Isolation**

**Working Directory:** Monorepo root
**File to Edit:** `apps/mobile-shell/package.json`

**Action:** Add the `installConfig` block to prevent hoisting

**BEFORE:**
```json
{
  "name": "@apps/mobile-shell",
  "version": "0.0.1",
  "private": true,
  "scripts": { ... },
  "dependencies": { ... }
}
```

**AFTER:**
```json
{
  "name": "@apps/mobile-shell",
  "version": "0.0.1",
  "private": true,
  "installConfig": {
    "hoistingLimits": "workspaces"
  },
  "scripts": { ... },
  "dependencies": { ... }
}
```

**Instruction for Agent:**
```
Add the following to apps/mobile-shell/package.json immediately after "private": true:

  "installConfig": {
    "hoistingLimits": "workspaces"
  },
```

**Expected Result:** `installConfig` block added to package.json

---

### **STEP 3: Fix Testing Library Dependencies**

**Working Directory:** Monorepo root

```bash
# Remove deprecated package
npm uninstall @testing-library/react-hooks --workspace=apps/mobile-shell

# Update to latest testing library
npm install @testing-library/react-native@latest --save-dev --workspace=apps/mobile-shell

echo "✅ Testing library updated"
```

**Expected Result:**
- `@testing-library/react-hooks` removed
- `@testing-library/react-native` updated to latest

**⚠️ NOTE FOR LATER:** Test files using `renderHook` will need updating:
- Change: `import { renderHook } from '@testing-library/react-hooks';`
- To: `import { renderHook } from '@testing-library/react-native';`

---

### **STEP 4: Configure Metro for Monorepo**

**Working Directory:** Monorepo root
**File to Update:** `apps/mobile-shell/metro.config.js`

**Action:** Replace entire contents with monorepo-aware configuration

```javascript
// 16BitFit-V3/apps/mobile-shell/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace roots
const projectRoot = __dirname;
// This resolves to the monorepo root (../../ from apps/mobile-shell)
const workspaceRoot = path.resolve(projectRoot, '../..');

// Create the default Expo config
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo (including shared packages)
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages (required for hoistingLimits)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'), // local node_modules
  path.resolve(workspaceRoot, 'node_modules'), // root node_modules
];

// 3. Force Metro to resolve dependencies only from these specific locations.
// This is CRUCIAL when using `hoistingLimits` to prevent conflicts.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

**Instruction for Agent:**
```
Replace the entire contents of apps/mobile-shell/metro.config.js with the monorepo-aware Metro configuration shown above.
```

**Expected Result:** Metro configured for monorepo with isolated dependencies

---

### **STEP 5: Install Dependencies**

**Working Directory:** Monorepo root → then mobile-shell

```bash
# From the monorepo root (16BitFit-V3/)

# 1. Install dependencies (this respects hoistingLimits)
echo "Installing dependencies with hoisting limits..."
npm install

echo "✅ Root dependencies installed"

# 2. Navigate to the mobile shell
cd apps/mobile-shell

# 3. Fix the isolated dependencies (The TerminalReporter Fix)
# This ensures the correct versions of Metro and @expo/cli are installed locally.
echo "Fixing Expo dependencies..."
npx expo install --fix

echo "✅ Expo dependencies fixed"
```

**Expected Result:**
- Dependencies installed with proper isolation
- React 18.3.1 in mobile-shell/node_modules
- React 19.2.0 in root/node_modules
- Metro correctly installed locally

---

### **STEP 6: Verification & Pod Installation**

**Working Directory:** `apps/mobile-shell`

```bash
# Verification Check (Optional but Recommended):
echo "Verifying React version isolation..."
echo "Mobile-shell React version (should be 18.3.1):"
npm list react --depth=0
echo ""
echo "Root React version (should be 19.2.0):"
(cd ../.. && npm list react --depth=0)

echo ""
echo "Installing iOS Pods..."
# Install iOS Pods
npx pod-install

echo "✅ Pods installed successfully"
```

**Expected Result:**
- mobile-shell shows react@18.3.1
- root shows react@19.2.0
- Pods installed successfully (83 dependencies)

---

### **STEP 7: Fix app.json Warning (Optional)**

**Working Directory:** Monorepo root
**File to Edit:** `apps/mobile-shell/app.json`

**Current Structure (INCORRECT):**
```json
{
  "name": "16BitFit",
  "displayName": "16BitFit",
  "expo": {
    "name": "16BitFit",
    "slug": "16bitfit-v3",
    ...
  }
}
```

**Fixed Structure (CORRECT):**
```json
{
  "expo": {
    "name": "16BitFit",
    "slug": "16bitfit-v3",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#9BBC0F"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.sixteenbitfit.app"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#9BBC0F"
      },
      "package": "com.sixteenbitfit.app"
    },
    "plugins": [
      "expo-font"
    ]
  }
}
```

**Instruction for Agent:**
```
Remove the "name" and "displayName" fields from the ROOT level of app.json.
Keep only the "expo" object at the root level.
```

**Expected Result:** Warning about root-level "expo" object disappears

---

### **STEP 8: Start Expo Dev Server**

**Working Directory:** `apps/mobile-shell`

```bash
# Clear cache and start
echo "Starting Expo dev server..."
npx expo start --ios --clear
```

**Expected Result:**
```
Starting project at /Users/seanwinslow/.../apps/mobile-shell

› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

**SUCCESS INDICATORS:**
- ✅ No "Cannot find module 'metro/src/lib/TerminalReporter'" error
- ✅ No React version conflict errors
- ✅ Metro bundler starts successfully
- ✅ QR code appears
- ✅ iOS simulator opens Expo Go automatically

---

## ✅ VALIDATION CHECKLIST

After completing all steps, verify:

- [ ] **Expo Dev Server Runs** - `npx expo start --ios` works without errors
- [ ] **Expo Go Opens** - iOS simulator launches Expo Go automatically
- [ ] **App Loads** - 16BitFit app appears in Expo Go
- [ ] **Custom Fonts Display** - Press Start 2P and Montserrat fonts render correctly
- [ ] **Hot Reload Works** - Edit a file and see instant updates
- [ ] **Tests Pass** - Run `npm test` (after updating renderHook imports)
- [ ] **Xcode Builds** - Native build still works

---

## 🔧 TROUBLESHOOTING

### **If Metro Still Can't Find TerminalReporter:**

```bash
cd apps/mobile-shell
rm -rf node_modules
npm install
npx expo install --fix
```

### **If React Versions Still Conflict:**

```bash
cd apps/mobile-shell
npm list react --depth=0
# Should show react@18.3.1

cd ../..
npm list react --depth=0
# Should show react@19.2.0
```

If versions are wrong, repeat Step 1 (cleanup) and Step 5 (install).

### **If Expo Go Doesn't Install on Simulator:**

Press `i` in the Expo dev server terminal to manually trigger iOS simulator launch.

---

## 🎯 SUCCESS CRITERIA

- ✅ `npx expo start --ios` runs without errors
- ✅ Expo Go installs and opens on iOS simulator
- ✅ App loads with custom fonts (Press Start 2P + Montserrat)
- ✅ Live reload works when editing files
- ✅ No breaking changes to existing functionality
- ✅ Native builds (Xcode) continue to work

---

## 📝 NOTES FOR DEVELOPER

**Key Changes Made:**
1. Added `hoistingLimits` to isolate mobile-shell dependencies
2. Configured Metro for monorepo workspace support
3. Updated testing library (removed deprecated package)
4. Fixed app.json structure to remove warnings

**Why This Works:**
- `hoistingLimits: "workspaces"` prevents npm from hoisting mobile-shell deps to root
- Metro's `disableHierarchicalLookup` forces strict path resolution
- React 18.3.1 stays isolated in mobile-shell while root uses React 19.2.0

**Testing Library Migration:**
After fix is complete, update test files:
```javascript
// OLD (will break)
import { renderHook } from '@testing-library/react-hooks';

// NEW (correct for React 18)
import { renderHook } from '@testing-library/react-native';
```

---

**Estimated Total Time:** 30-45 minutes
**Confidence Level:** 🟢 HIGH (Solution from Google Deep Think)

---

**Ready to execute!** Copy the prompt at the top and give it to the architect/developer agent.
