# ARCHITECT AGENT: Execute Expo Go Timeout Fix

**Date:** 2025-11-09
**Priority:** 🔴 CRITICAL
**Estimated Time:** 30-45 minutes
**Reference Document:** `/docs/Expo Go Error - Google Deep Think Response.md`

---

## 🎯 MISSION OBJECTIVE

Fix the Expo Go connection timeout by implementing Google Deep Think's diagnosed solution. This involves:
1. Changing app registration from `AppRegistry` to `registerRootComponent`
2. Completing `app.json` with all required Expo SDK 52 fields
3. Implementing `expo-splash-screen` for non-blocking font loading
4. Testing in Expo Go to verify connection success

**Success Criteria:**
✅ Expo Go connects without timeout
✅ App loads and displays correctly
✅ Custom fonts render properly
✅ Hot reload works with "r" key

---

## 📋 PRE-EXECUTION CHECKLIST

Before starting, verify:
- [ ] You have read `/docs/Expo Go Error - Google Deep Think Response.md` completely
- [ ] Current working directory: `/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell`
- [ ] Metro bundler is stopped (kill any running instances on port 8081)
- [ ] iOS Simulator is running
- [ ] Expo Go app is installed in simulator
- [ ] You understand the 3 files being modified: `index.js`, `App.tsx`, `app.json`

---

## 🔍 ROOT CAUSE SUMMARY (from Deep Think)

**Primary Blockers:**
1. ❌ **Issue 1 (Critical):** Using `AppRegistry.registerComponent` instead of Expo's `registerRootComponent`
   - Expo Go cannot find the app without proper registration
   - Results in timeout error

2. ❌ **Issue 3 (Critical):** Incomplete `app.json` configuration
   - Missing `sdkVersion: "52.0.0"`
   - Missing `scheme: "16bitfitv3"`
   - Missing `jsEngine: "hermes"` (required for New Architecture)
   - Expo Go doesn't know how to initialize the app

**Contributing Factors:**
3. ⚠️ **Issue 2:** Async font loading blocks initial render
   - Combined with SDK 52's slower startup (2x slower than SDK 51)
   - Delay exceeds Expo Go's timeout threshold

4. ⚠️ **Network:** iOS simulator LAN connection issues
   - Firewalls, VPNs, or network bridge problems
   - Fallback: Use tunnel mode if LAN fails

---

## 📁 FILES TO MODIFY

### File 1: `index.js` (Entry Point)
**Location:** `/apps/mobile-shell/index.js`
**Current:** Uses React Native's `AppRegistry.registerComponent`
**Change To:** Expo's `registerRootComponent`
**Impact:** Critical - Expo Go cannot work without this change

### File 2: `app.json` (Expo Configuration)
**Location:** `/apps/mobile-shell/app.json`
**Current:** Minimal config, missing critical fields
**Change To:** Complete SDK 52 configuration with all required fields
**Impact:** Critical - Expo Go needs these fields to initialize

### File 3: `App.tsx` (Main Component)
**Location:** `/apps/mobile-shell/App.tsx`
**Current:** Shows loading screen while fonts load (blocks render)
**Change To:** Use `expo-splash-screen` for non-blocking async loading
**Impact:** High - Prevents timeout during font loading

---

## 🚀 STEP-BY-STEP EXECUTION PLAN

### **PHASE 1: PREPARATION (5 minutes)**

#### Step 1.1: Navigate to Project Directory
```bash
cd "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell"
```

#### Step 1.2: Stop Any Running Metro Instances
```bash
# Kill existing Metro bundler processes
lsof -ti:8081 | xargs kill -9

# Verify port is free
lsof -i:8081
# Should return nothing
```

#### Step 1.3: Create Backup of Current Files
```bash
# Backup the 3 files we're modifying
cp index.js index.js.backup
cp App.tsx App.tsx.backup
cp app.json app.json.backup

# Verify backups created
ls -la *.backup
```

#### Step 1.4: Install expo-splash-screen Dependency
```bash
# Install the splash screen package (required for new App.tsx)
npx expo install expo-splash-screen

# This should complete quickly (package already may be cached)
```

**Expected Output:**
```
✔ Installed expo-splash-screen@~0.28.13
```

---

### **PHASE 2: FILE MODIFICATIONS (15 minutes)**

#### Step 2.1: Modify `index.js` (Entry Point)

**Current Content:**
```javascript
/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

**New Content (Copy Exactly):**
```javascript
/**
 * @format
 */

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent ensures that the app is registered correctly
// for the Expo environment (Expo Go or Development Builds).
registerRootComponent(App);
```

**How to Apply:**
```bash
# Read the file first to verify current content
cat index.js

# Use Edit tool to replace the entire file content
# OR manually update in your editor
```

**Verification:**
- [ ] Line 5 imports `registerRootComponent` from `expo`
- [ ] Line 6 imports `App` from `./App`
- [ ] Line 10 calls `registerRootComponent(App)`
- [ ] NO references to `AppRegistry` remain
- [ ] NO references to `appName` remain

---

#### Step 2.2: Modify `app.json` (Expo Configuration)

**Current Content:**
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
      "expo-font",
      "expo-asset"
    ]
  }
}
```

**New Content (Copy Exactly):**
```json
{
  "expo": {
    "name": "16BitFit",
    "slug": "16bitfit-v3",
    "version": "1.0.0",
    "orientation": "portrait",
    "sdkVersion": "52.0.0",
    "scheme": "16bitfitv3",
    "jsEngine": "hermes",
    "userInterfaceStyle": "automatic",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#9BBC0F"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
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
      "expo-font",
      "expo-asset",
      "expo-splash-screen"
    ]
  }
}
```

**Key Changes:**
1. ✅ Added `"sdkVersion": "52.0.0"` (CRITICAL - tells Expo Go which SDK to use)
2. ✅ Added `"scheme": "16bitfitv3"` (CRITICAL - identifies app to Expo Go)
3. ✅ Added `"jsEngine": "hermes"` (CRITICAL - required for New Architecture)
4. ✅ Changed `"userInterfaceStyle": "light"` → `"automatic"`
5. ✅ Added `"assetBundlePatterns": ["**/*"]` (ensures all assets are bundled)
6. ✅ Added `"expo-splash-screen"` to plugins array

**Verification:**
- [ ] `sdkVersion` is present and set to `"52.0.0"`
- [ ] `scheme` is present and set to `"16bitfitv3"`
- [ ] `jsEngine` is present and set to `"hermes"`
- [ ] `assetBundlePatterns` is present with `["**/*"]`
- [ ] `expo-splash-screen` is in the `plugins` array
- [ ] JSON is valid (no syntax errors)

```bash
# Validate JSON syntax
cat app.json | python3 -m json.tool > /dev/null && echo "✅ JSON is valid" || echo "❌ JSON is invalid"
```

---

#### Step 2.3: Modify `App.tsx` (Main Component)

**Current Content (First 60 lines):**
```typescript
/**
 * 16BitFit Mobile Shell
 * Main Application Entry Point
 * Story 1.4: Onboarding Flow with Custom Fonts
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useCustomFonts } from '@/hooks/useFonts';
import OnboardingNavigator from '@/screens/onboarding/navigation/OnboardingNavigator';
import { tokens } from '@/design-system';

function App(): JSX.Element {
  const { fontsLoaded, error } = useCustomFonts();

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={tokens.colors.text.primary} />
        <Text style={styles.loadingText}>Loading 16BitFit...</Text>
      </View>
    );
  }

  // Show error screen if fonts failed to load
  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>⚠️ Font Loading Error</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  // Render main app with onboarding flow
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

**New Content (Complete File - Copy Exactly):**
```typescript
/**
 * 16BitFit Mobile Shell
 * Main Application Entry Point
 * Story 1.4: Onboarding Flow with Custom Fonts
 */
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useCustomFonts } from '@/hooks/useFonts';
import OnboardingNavigator from '@/screens/onboarding/navigation/OnboardingNavigator';

// Keep the splash screen visible while we fetch resources.
// This must be called globally before the component renders.
SplashScreen.preventAutoHideAsync();

function App(): JSX.Element | null {
  const { fontsLoaded, error } = useCustomFonts();

  useEffect(() => {
    if (error) {
      console.error('Error loading fonts:', error);
      // In production, log to monitoring service (e.g., Sentry)
    }
  }, [error]);

  // Callback to hide the splash screen once resources are ready or an error occurred.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // If fonts are not loaded and no error occurred, return null.
  // The splash screen remains visible.
  if (!fontsLoaded && !error) {
    return null;
  }

  // Once loaded, render the app. We attach the layout handler to a root View.
  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <OnboardingNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
```

**Key Changes:**
1. ✅ Imported `* as SplashScreen from 'expo-splash-screen'`
2. ✅ Added `SplashScreen.preventAutoHideAsync()` at module level (line 17)
3. ✅ Changed return type to `JSX.Element | null`
4. ✅ Removed `ActivityIndicator` loading screen
5. ✅ Removed error display screen (just logs error)
6. ✅ Added `onLayoutRootView` callback to hide splash screen
7. ✅ Returns `null` if fonts not loaded (splash screen stays visible)
8. ✅ Wrapped NavigationContainer in View with `onLayout={onLayoutRootView}`
9. ✅ Simplified styles (only `container` with `flex: 1`)

**Verification:**
- [ ] Line 11 imports `expo-splash-screen`
- [ ] Line 17 calls `SplashScreen.preventAutoHideAsync()`
- [ ] Return type is `JSX.Element | null`
- [ ] No `ActivityIndicator` component remains
- [ ] No `loading` or `errorText` styles remain
- [ ] `onLayoutRootView` callback is defined and used
- [ ] File compiles without TypeScript errors

```bash
# Verify TypeScript compilation
npx tsc --noEmit
# Should complete without errors
```

---

### **PHASE 3: TESTING (15 minutes)**

#### Step 3.1: Clear All Caches and Start Expo

```bash
# Clear Metro bundler cache
npx expo start --clear
```

**Expected Output:**
```
Starting project at /Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell
Starting Metro Bundler
✔ Metro waiting on exp://192.168.x.x:8081

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press d │ show developer menu
```

**Wait for Metro to fully start** (look for "Metro waiting on exp://..." message)

---

#### Step 3.2: Open App in iOS Simulator (LAN Mode)

**Method 1: Auto-launch (Recommended)**
```bash
# Press 'i' in the Expo CLI terminal
# This will automatically open the app in the running iOS simulator
```

**Method 2: Manual QR Scan**
1. Open Expo Go app in iOS simulator
2. Tap "Scan QR Code"
3. Scan the QR code displayed in terminal

**Expected Behavior:**
- ✅ Expo Go connects immediately (no timeout)
- ✅ Native splash screen appears (green background #9BBC0F)
- ✅ Splash screen stays visible for 1-3 seconds (fonts loading)
- ✅ App renders with WelcomeScreen
- ✅ Title "16BITFIT" displays in Press Start 2P font (pixelated)
- ✅ Body text displays in Montserrat font (clean sans-serif)

**If Timeout Occurs:** Proceed to Step 3.3

---

#### Step 3.3: Fallback to Tunnel Mode (If LAN Fails)

If you see the timeout error again:

```bash
# Stop Metro (Ctrl+C)
# Restart with Tunnel mode
npx expo start --tunnel
```

**Expected Output:**
```
Starting project at /Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell
Starting Metro Bundler
› Opening tunnel
✔ Tunnel ready
✔ Metro waiting on exp://tunnel-url.ngrok.io:443

› Press i │ open iOS simulator
```

**Note:** Tunnel mode takes 10-20 seconds to establish. Wait for "Tunnel ready" message.

Then press `i` to launch in simulator.

**Tradeoff:**
- ✅ More reliable connection
- ✅ Bypasses local network issues
- ❌ Slower than LAN (extra network hop through Expo's proxy)
- ❌ Requires internet connection

---

#### Step 3.4: Verify Success Criteria

Once the app loads, verify:

**Visual Verification:**
- [ ] ✅ App loads without timeout error
- [ ] ✅ Splash screen disappeared after fonts loaded
- [ ] ✅ WelcomeScreen is displayed
- [ ] ✅ Title "16BITFIT" renders in pixelated Press Start 2P font
- [ ] ✅ Body text renders in Montserrat font
- [ ] ✅ Colors match LCD palette (#9BBC0F background)
- [ ] ✅ "GET STARTED" button is visible

**Functional Verification:**
```bash
# In Expo CLI terminal, press 'r' to reload
# App should reload without timeout
```

- [ ] ✅ Hot reload works (press `r`)
- [ ] ✅ App reloads within 2-3 seconds
- [ ] ✅ No console errors in Metro bundler logs

**Navigation Verification:**
- [ ] ✅ Tap "GET STARTED" button
- [ ] ✅ Navigates to ProfileSetupScreen
- [ ] ✅ Transition animation is smooth
- [ ] ✅ Back gesture works (swipe from left edge)

---

### **PHASE 4: VERIFICATION & DOCUMENTATION (5 minutes)**

#### Step 4.1: Check Metro Bundler Logs

In the terminal where Metro is running, verify:
- [ ] ✅ No red error messages
- [ ] ✅ No yellow warnings about missing modules
- [ ] ✅ "Bundled [number]ms" messages appear on reload

**Look for:**
```
✔ Bundled 234ms (iOS)
✔ Fast refresh completed in 123ms
```

---

#### Step 4.2: Test on Physical Device (Optional but Recommended)

**Prerequisites:**
- iPhone with Expo Go app installed
- Phone and computer on same Wi-Fi network

**Steps:**
1. With Metro still running, note the QR code in terminal
2. Open Expo Go on iPhone
3. Tap "Scan QR Code"
4. Scan the QR code from your computer screen
5. App should load on physical device

**Expected:**
- ✅ App loads successfully
- ✅ Fonts render correctly
- ✅ Colors look authentic on real screen
- ✅ Touch interactions work smoothly
- ✅ Performance is smooth (60fps)

---

#### Step 4.3: Document Results

Create a quick status report:

```bash
# Document the fix results
cat > "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/docs/EXPO_GO_FIX_RESULTS.md" << 'EOF'
# Expo Go Fix Results

**Date:** $(date)
**Status:** ✅ SUCCESS

## Changes Applied
1. ✅ Updated `index.js` to use `registerRootComponent`
2. ✅ Completed `app.json` with SDK 52 configuration
3. ✅ Implemented `expo-splash-screen` in `App.tsx`
4. ✅ Installed `expo-splash-screen` dependency

## Test Results
- ✅ Expo Go connects without timeout
- ✅ App loads successfully
- ✅ Custom fonts render correctly
- ✅ Hot reload works
- ✅ Navigation functions properly

## Connection Mode Used
[LAN / TUNNEL] - Select which worked

## Notes
[Add any additional observations]

EOF
```

---

## 🚨 TROUBLESHOOTING GUIDE

### Problem 1: "Cannot find module 'expo-splash-screen'"

**Cause:** Dependency not installed
**Solution:**
```bash
npx expo install expo-splash-screen
# Then restart Metro
```

---

### Problem 2: TypeScript Error in App.tsx

**Error:** `Cannot find name 'SplashScreen'`
**Cause:** Import statement missing or incorrect
**Solution:** Verify line 11 reads:
```typescript
import * as SplashScreen from 'expo-splash-screen';
```

---

### Problem 3: Still Getting Timeout in LAN Mode

**Cause:** Network configuration issues
**Solution:** Use Tunnel mode instead
```bash
npx expo start --tunnel
```

---

### Problem 4: "Splash screen is stuck" (doesn't disappear)

**Cause:** Font loading error or callback not firing
**Solution:**
1. Check Metro logs for font loading errors
2. Verify `onLayoutRootView` callback is defined correctly
3. Check that fonts exist at paths in `useFonts.ts`

```bash
# Verify font files exist
ls -la assets/fonts/Press_Start_2P/
ls -la assets/fonts/Montserrat/static/
```

---

### Problem 5: "Scheme not found" Error

**Cause:** app.json not properly updated
**Solution:** Verify `app.json` contains:
```json
"scheme": "16bitfitv3"
```

---

### Problem 6: Metro Bundler Won't Start (Port in Use)

**Cause:** Old Metro process still running
**Solution:**
```bash
# Force kill all processes on port 8081
lsof -ti:8081 | xargs kill -9

# Verify port is free
lsof -i:8081
# Should return nothing

# Start Metro again
npx expo start --clear
```

---

## 📊 SUCCESS VALIDATION CHECKLIST

Before marking this task complete, verify ALL items:

**File Changes:**
- [ ] ✅ `index.js` uses `registerRootComponent` from `expo`
- [ ] ✅ `app.json` has `sdkVersion: "52.0.0"`
- [ ] ✅ `app.json` has `scheme: "16bitfitv3"`
- [ ] ✅ `app.json` has `jsEngine: "hermes"`
- [ ] ✅ `app.json` has `expo-splash-screen` in plugins
- [ ] ✅ `App.tsx` imports and uses `expo-splash-screen`
- [ ] ✅ `expo-splash-screen` package is installed

**Functional Tests:**
- [ ] ✅ Expo Go connects without timeout
- [ ] ✅ Splash screen appears during font loading
- [ ] ✅ App renders WelcomeScreen after fonts load
- [ ] ✅ Press Start 2P font displays correctly (pixelated)
- [ ] ✅ Montserrat font displays correctly (clean)
- [ ] ✅ Hot reload works (press `r` in terminal)
- [ ] ✅ Navigation works (can tap "GET STARTED")
- [ ] ✅ No errors in Metro bundler console

**Optional (Highly Recommended):**
- [ ] ✅ Tested on physical device
- [ ] ✅ Performance is smooth (60fps)
- [ ] ✅ Colors look correct on physical screen

---

## 📝 FINAL STEPS

### 1. Update IMPLEMENTATION-ROADMAP.md

Add to Phase 4 section:

```markdown
#### **Expo Go Connection - Fixed (2025-11-09)**
- ✅ Changed `index.js` to use `registerRootComponent` from `expo`
- ✅ Completed `app.json` with SDK 52 requirements:
  - Added `sdkVersion: "52.0.0"`
  - Added `scheme: "16bitfitv3"`
  - Added `jsEngine: "hermes"`
  - Added `expo-splash-screen` plugin
- ✅ Implemented `expo-splash-screen` for non-blocking font loading
- ✅ App now loads successfully in Expo Go
- ✅ Hot reload workflow functional
- ✅ Physical device testing enabled

**Resolution:** Timeout was caused by incorrect app registration and incomplete Expo configuration. Fixed by following Google Deep Think's diagnosis.
```

---

### 2. Clean Up Backup Files (Optional)

If everything works, you can remove the backups:

```bash
# Remove backup files
rm index.js.backup App.tsx.backup app.json.backup
```

---

### 3. Commit Changes

```bash
cd "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3"

# Stage the changes
git add apps/mobile-shell/index.js
git add apps/mobile-shell/App.tsx
git add apps/mobile-shell/app.json
git add apps/mobile-shell/package.json  # Updated by expo install

# Create commit
git commit -m "$(cat <<'EOF'
fix: Resolve Expo Go connection timeout

Implemented Google Deep Think's solution:
- Changed index.js to use registerRootComponent from expo
- Completed app.json with SDK 52 configuration (sdkVersion, scheme, jsEngine)
- Implemented expo-splash-screen for non-blocking font loading
- Installed expo-splash-screen dependency

Result: Expo Go now connects successfully, hot reload works, physical device testing enabled.

Fixes: Expo Go timeout error "The request timed out"

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Verify commit
git log -1
```

---

## 🎉 COMPLETION CRITERIA

**This task is complete when:**
1. ✅ All 3 files modified successfully
2. ✅ Expo Go connects without timeout
3. ✅ App loads and displays correctly
4. ✅ Custom fonts render properly
5. ✅ Hot reload works
6. ✅ Changes committed to git
7. ✅ IMPLEMENTATION-ROADMAP.md updated

---

## 📚 REFERENCE DOCUMENTS

- **Google Deep Think Response:** `/docs/Expo Go Error - Google Deep Think Response.md`
- **Research Summary:** `/docs/COPIED FILES FOR DEEP THINK/11_RESEARCH_SUMMARY.md`
- **Original Prompt:** `/docs/COPIED FILES FOR DEEP THINK/00_PROMPT_FOR_GOOGLE_DEEP_THINK.md`

---

## ⏱️ ESTIMATED TIMELINE

- Phase 1 (Preparation): 5 minutes
- Phase 2 (File Modifications): 15 minutes
- Phase 3 (Testing): 15 minutes
- Phase 4 (Documentation): 5 minutes
- **Total: 40 minutes**

---

**Ready to execute? Start with Phase 1, Step 1.1!**

**Remember:** Read each step completely before executing. Verify outputs match expectations. If you encounter issues, consult the Troubleshooting Guide.
