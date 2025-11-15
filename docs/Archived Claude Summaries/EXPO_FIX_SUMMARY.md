# Expo Go Fix - Quick Summary

**Status:** 🟡 Ready to Execute
**Execution Prompt:** `/docs/ARCHITECT_EXECUTION_PROMPT_EXPO_FIX.md`
**Reference:** `/docs/Expo Go Error - Google Deep Think Response.md`

---

## 🎯 The Problem

Expo Go times out with: "There was a problem running the requested app. Unknown error: The request timed out"

---

## 🔍 Root Cause (from Google Deep Think)

1. **Wrong Registration:** Using `AppRegistry` instead of Expo's `registerRootComponent`
2. **Incomplete Config:** Missing `sdkVersion`, `scheme`, `jsEngine` in `app.json`
3. **Blocking Font Load:** Async font loading prevents initial render
4. **Network Issues:** iOS simulator LAN connection unreliable

---

## 🛠️ The Solution

### 3 Files to Modify:

#### 1. `index.js`
**Change:**
```javascript
// OLD
import {AppRegistry} from 'react-native';
AppRegistry.registerComponent(appName, () => App);

// NEW
import { registerRootComponent } from 'expo';
registerRootComponent(App);
```

#### 2. `app.json`
**Add:**
```json
{
  "expo": {
    "sdkVersion": "52.0.0",    // CRITICAL
    "scheme": "16bitfitv3",     // CRITICAL
    "jsEngine": "hermes",       // CRITICAL
    "assetBundlePatterns": ["**/*"],
    "plugins": [
      "expo-font",
      "expo-asset",
      "expo-splash-screen"      // NEW
    ]
  }
}
```

#### 3. `App.tsx`
**Change:**
```typescript
// OLD - Blocks render while fonts load
if (!fontsLoaded) {
  return <LoadingScreen />;
}

// NEW - Use expo-splash-screen
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

// Return null if not loaded (splash stays visible)
if (!fontsLoaded && !error) {
  return null;
}

// Hide splash on layout
<View onLayout={onLayoutRootView}>
  <NavigationContainer>
    <OnboardingNavigator />
  </NavigationContainer>
</View>
```

---

## ⚡ Quick Start

```bash
# 1. Navigate to app
cd "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell"

# 2. Install dependency
npx expo install expo-splash-screen

# 3. Apply all 3 file changes (see ARCHITECT_EXECUTION_PROMPT_EXPO_FIX.md)

# 4. Start Expo
npx expo start --clear

# 5. Press 'i' to launch in simulator
```

---

## ✅ Success Looks Like

- ✅ Expo Go connects without timeout
- ✅ Splash screen appears while fonts load
- ✅ App renders WelcomeScreen with custom fonts
- ✅ Hot reload works (press 'r')
- ✅ Can test on physical device

---

## 🚨 If LAN Mode Fails

```bash
# Use tunnel mode instead
npx expo start --tunnel

# Then press 'i'
```

---

## 📊 Expected Timeline

- File modifications: 15 minutes
- Testing: 15 minutes
- **Total: 30 minutes**

---

## 📝 For Architect Agent

Follow the detailed step-by-step instructions in:
**`/docs/ARCHITECT_EXECUTION_PROMPT_EXPO_FIX.md`**

That document contains:
- Complete file contents to copy
- Verification steps for each change
- Troubleshooting guide
- Success criteria checklist
- Commit message template

---

**Ready? Open `ARCHITECT_EXECUTION_PROMPT_EXPO_FIX.md` and start with Phase 1!**
