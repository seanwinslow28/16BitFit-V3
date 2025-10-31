# iOS Build Migration Report - 16BitFit V3

**Date:** October 25, 2025
**Project:** 16BitFit V3 - Mobile Shell
**React Native Version:** 0.71.8
**iOS Deployment Target:** 15.1
**Xcode Version:** 26.0.1
**CocoaPods Version:** 1.16.2

---

## Executive Summary

This document provides a comprehensive breakdown of all changes, issues, and resolutions encountered during the iOS build migration process for the 16BitFit V3 project. The migration involved updating deployment targets, resolving dependency conflicts, fixing C++ compatibility issues, and configuring the monorepo structure for proper iOS builds.

---

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Issues Encountered & Resolutions](#issues-encountered--resolutions)
3. [File Changes & Modifications](#file-changes--modifications)
4. [Simulator Requirements](#simulator-requirements)
5. [Remaining Work Breakdown](#remaining-work-breakdown)
6. [Testing & Verification Plan](#testing--verification-plan)
7. [Known Warnings & Non-Critical Issues](#known-warnings--non-critical-issues)
8. [Future Recommendations](#future-recommendations)

---

## Environment Configuration

### System Requirements

**Hardware:**
- Architecture: x86_64 (Intel Mac or Rosetta 2)
- Minimum macOS: 15.6.1 (24G90)

**Software Versions:**
```
Platform: darwin
OS: macOS 15.6.1 (24G90)
Xcode: 26.0.1 (17A400)
Ruby: 3.4.4
CocoaPods: 1.16.2
Node.js: (from npm workspaces)
Git: 2.50.1
```

**Key Dependencies:**
```json
{
  "react": "18.2.0",
  "react-native": "0.71.8",
  "react-native-screens": "^4.18.0",
  "react-native-reanimated": "^2.17.0",
  "nativewind": "^4.2.1",
  "react-native-safe-area-context": "5.6.1",
  "react-native-skia": "1.12.4"
}
```

---

## Issues Encountered & Resolutions

### Issue 1: iOS Deployment Target Mismatch

**Problem:**
```
The iOS Simulator deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 15.0,
but react-native-screens v4.18.0 requires iOS 15.1+
```

**Root Cause:**
- Podfile specified `platform :ios, '15.0'`
- react-native-screens v4.18.0 podspec enforces `min_supported_ios_version = "15.1"`

**Resolution:**
Updated [apps/mobile-shell/ios/Podfile](apps/mobile-shell/ios/Podfile):
```ruby
# Before:
platform :ios, '15.0'

# After:
platform :ios, '15.1'
```

**Files Changed:**
- `apps/mobile-shell/ios/Podfile` (line 4)

---

### Issue 2: React Native Reanimated Duplication

**Problem:**
```
[!] Invalid `RNReanimated.podspec` file: Multiple versions of Reanimated detected.
Conflict between:
- /Users/.../node_modules/react-native-reanimated
- /Users/.../node_modules/nativewind/node_modules/react-native-reanimated
```

**Root Cause:**
- NativeWind v4.2.1 has a nested dependency on `react-native-css-interop@0.2.1`
- react-native-css-interop has peer dependency: `react-native-reanimated >= 3.6.2`
- Project uses `react-native-reanimated@2.17.0`
- npm workspace hoisting caused both versions to be installed

**Resolution:**

1. **Immediate Fix:** Manually removed nested node_modules
```bash
rm -rf /Users/.../node_modules/nativewind/node_modules
```

2. **Long-term Prevention:** Updated workspace nohoist configuration in [package.json](package.json):
```json
{
  "workspaces": {
    "nohoist": [
      "**/react-native",
      "**/react-native/**",
      "**/@react-native/**",
      "**/@react-native-community/**",
      "**/react-native-reanimated",
      "**/react-native-reanimated/**",
      "**/nativewind",
      "**/nativewind/**"
    ]
  }
}
```

**Files Changed:**
- `/Users/.../16BitFit-V3/package.json` (lines 11-20)

**Note:** NativeWind's react-native-css-interop dependency expects Reanimated v3.x, but project uses v2.17.0. This is a known compatibility gap. Future migration to Reanimated v3 recommended.

---

### Issue 3: Boost Library Download Failure

**Problem:**
```
[!] Error installing boost
Verification checksum was incorrect, expected f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41,
got 9c2f4b99bc7ddb95a8babff8ba78a4108aa0951243ea919166a7e2e279825502
```

**Root Cause:**
- JFrog Artifactory URL (`https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2`) returned HTML landing page instead of actual tarball
- CocoaPods HTTP downloader doesn't handle redirects properly for some mirror URLs
- React Native 0.71.8's boost.podspec hardcoded to broken JFrog URL

**Resolution:**

1. **Manual Download:** Downloaded Boost 1.76.0 from SourceForge mirror
```bash
curl -L "https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2/download" \
  -o /tmp/boost_sf.tar.bz2
# Verified checksum: f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41 ✓
```

2. **Modified Podspec:** Updated boost.podspec to use local file
```ruby
# File: node_modules/react-native/third-party-podspecs/boost.podspec

# Before:
spec.source = {
  :http => 'https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2',
  :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41'
}

# After:
spec.source = {
  :http => 'file:///tmp/boost_sf.tar.bz2',
  :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41'
}
```

**Files Changed:**
- `node_modules/react-native/third-party-podspecs/boost.podspec` (lines 13-14)

**⚠️ Important:** This change is in `node_modules` and will be lost on `npm install`. The `/tmp/boost_sf.tar.bz2` file must remain available for subsequent builds.

**Permanent Solution Needed:**
- Option A: Host boost_1_76_0.tar.bz2 on project CDN
- Option B: Upgrade to React Native 0.72+ which uses Boost 1.83.0 with working mirrors
- Option C: Create post-install script to automatically apply this fix

---

### Issue 4: Monorepo Path Configuration

**Problem:**
```
No such file or directory @ rb_sysopen -
/Users/.../apps/mobile-shell/ios/../node_modules/react-native/package.json
```

**Root Cause:**
- Default `react_native_post_install` function assumes react-native is at `../node_modules/react-native`
- In monorepo structure, react-native is at root: `../../../node_modules/react-native`

**Resolution:**
Updated [apps/mobile-shell/ios/Podfile](apps/mobile-shell/ios/Podfile) post_install hook:
```ruby
# Before:
post_install do |installer|
  react_native_post_install(
    installer,
    # react_native_path defaults to "../node_modules/react-native"
    :mac_catalyst_enabled => false
  )
end

# After:
post_install do |installer|
  react_native_post_install(
    installer,
    "../../../node_modules/react-native",  # Explicit monorepo path
    :mac_catalyst_enabled => false
  )
end
```

**Files Changed:**
- `apps/mobile-shell/ios/Podfile` (line 54)

---

### Issue 5: Boost C++17 Compatibility with Xcode 26

**Problem:**
```
/Users/.../Pods/boost/boost/container_hash/hash.hpp:131:33:
error: no template named 'unary_function' in namespace 'std';
did you mean '__unary_function'?
```

**Root Cause:**
- Boost 1.76.0 uses deprecated `std::unary_function` and `std::binary_function`
- These were removed from C++ standard library in C++17
- Xcode 26 with libc++ no longer provides these legacy symbols
- React Native 0.71.8 sets `CLANG_CXX_LANGUAGE_STANDARD = c++17`

**Technical Details:**
- `std::unary_function` was deprecated in C++11
- Officially removed in C++17 (ISO/IEC 14882:2017)
- Boost 1.76.0 (April 2021) predates strict enforcement in modern compilers
- Boost 1.83.0+ (used in RN 0.72+) has fixed this issue

**Resolution:**
Added C++ preprocessor flag to re-enable removed symbols in [apps/mobile-shell/ios/Podfile](apps/mobile-shell/ios/Podfile):

```ruby
post_install do |installer|
  react_native_post_install(
    installer,
    "../../../node_modules/react-native",
    :mac_catalyst_enabled => false
  )
  __apply_Xcode_12_5_M1_post_install_workaround(installer)

  # Fix for Boost C++17 compatibility issue with Xcode 26
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      config.build_settings['OTHER_CPLUSPLUSFLAGS'] ||= [
        '$(OTHER_CFLAGS)',
        '-D_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION'
      ]
    end
  end
end
```

**What This Does:**
- `_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION` is a libc++ compatibility flag
- Re-enables `std::unary_function` and `std::binary_function` as deprecated symbols
- Allows legacy Boost code to compile with C++17 standard
- Applied to ALL pod targets for consistency

**Files Changed:**
- `apps/mobile-shell/ios/Podfile` (lines 61-67)

**Alternative Approaches Considered:**
1. ❌ Downgrade to C++14 - Breaks React Native 0.71.8 requirements
2. ❌ Patch Boost headers - Too invasive, hard to maintain
3. ✅ Use compatibility flag - Clean, reversible, well-documented approach

---

## File Changes & Modifications

### Complete List of Modified Files

#### 1. `/Users/seanwinslow/Desktop/16BitFit-V3/package.json`

**Changes:**
- Added `react-native-reanimated` to workspace nohoist
- Added `nativewind` to workspace nohoist

**Diff:**
```diff
"workspaces": {
  "packages": ["apps/*", "packages/*"],
  "nohoist": [
    "**/react-native",
    "**/react-native/**",
    "**/@react-native/**",
    "**/@react-native-community/**",
+   "**/react-native-reanimated",
+   "**/react-native-reanimated/**",
+   "**/nativewind",
+   "**/nativewind/**"
  ]
}
```

**Reason:** Prevent dependency hoisting that causes version conflicts

---

#### 2. `/Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell/ios/Podfile`

**Changes:**
1. Updated iOS deployment target to 15.1
2. Added explicit react-native path for monorepo
3. Added C++17 compatibility fix for Boost

**Complete Updated Podfile:**
```ruby
require_relative '../../../node_modules/react-native/scripts/react_native_pods'
require_relative '../../../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '15.1'  # CHANGED FROM 15.0
prepare_react_native_project!

flipper_config = ENV['NO_FLIPPER'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'MobileShell' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :flipper_configuration => flipper_config,
    :hermes_enabled => true,
    :fabric_enabled => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'MobileShellTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(
      installer,
      "../../../node_modules/react-native",  # ADDED: Explicit path for monorepo
      :mac_catalyst_enabled => false
    )
    __apply_Xcode_12_5_M1_post_install_workaround(installer)

    # ADDED: Fix for Boost C++17 compatibility issue with Xcode 26
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        config.build_settings['OTHER_CPLUSPLUSFLAGS'] ||= [
          '$(OTHER_CFLAGS)',
          '-D_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION'
        ]
      end
    end
  end
end
```

**Line-by-Line Breakdown:**
- Line 4: `platform :ios, '15.1'` - Sets minimum iOS version for all pods
- Line 54: `"../../../node_modules/react-native"` - Corrects path for monorepo structure
- Lines 61-67: C++17 compatibility loop - Applies compiler flags to all pod targets

---

#### 3. `/Users/seanwinslow/Desktop/16BitFit-V3/node_modules/react-native/third-party-podspecs/boost.podspec`

**⚠️ Temporary Modification (not version controlled)**

**Changes:**
```diff
spec.source = {
- :http => 'https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2',
+ :http => 'file:///tmp/boost_sf.tar.bz2',
  :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41'
}
```

**⚠️ Critical Dependency:**
This requires `/tmp/boost_sf.tar.bz2` to exist on the build machine.

**Preservation Steps:**
```bash
# Verify file exists:
ls -lh /tmp/boost_sf.tar.bz2

# If missing, re-download:
curl -L "https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2/download" \
  -o /tmp/boost_sf.tar.bz2

# Verify checksum:
shasum -a 256 /tmp/boost_sf.tar.bz2
# Expected: f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41
```

---

## Simulator Requirements

### Available iOS Simulators

Based on Xcode 26.0.1 installed simulators:

```
{ platform:iOS Simulator, arch:x86_64, id:7A0637F6-9ADD-468C-BC5F-81AAC8147E91,
  OS:18.5, name:16BitFit - Testing }

{ platform:iOS Simulator, arch:x86_64, id:67CC2531-F214-4EF7-813B-843AF78EC096,
  OS:18.5, name:Pocket PM }

{ platform:iOS Simulator, arch:x86_64, id:4A1DB7B1-6795-41EF-86A0-0F70D9563F35,
  OS:18.5, name:iPad (A16) }
```

### Recommended Simulator for 16BitFit V3

**Primary Testing Device:**
```
Name: 16BitFit - Testing
ID: 7A0637F6-9ADD-468C-BC5F-81AAC8147E91
OS: iOS 18.5
Architecture: x86_64
```

**Why This Simulator:**
1. Custom-named for this project ("16BitFit - Testing")
2. iOS 18.5 provides modern API testing capabilities
3. x86_64 architecture matches build machine
4. Likely already configured with test users/data

### Device Requirements for Production

**Target iOS Versions:**
- Minimum: iOS 15.1 (set in Podfile)
- Recommended: iOS 15.0+ for broader compatibility
- Testing Target: iOS 16.0+ (optimal for React Native 0.71.8)

**Device Classes:**
- iPhone (primary): iPhone 11 and newer
- iPad (secondary): iPad Air (3rd gen) and newer
- Rationale: React Native Skia (1.12.4) requires modern GPU capabilities

### Creating Additional Simulators

If additional simulators are needed:

```bash
# List available runtime versions
xcrun simctl list runtimes

# Create new iPhone 14 Pro simulator
xcrun simctl create "iPhone 14 Pro - 16BitFit" \
  "iPhone 14 Pro" \
  "iOS18.5"

# Boot the simulator
xcrun simctl boot "iPhone 14 Pro - 16BitFit"

# Open Simulator.app
open -a Simulator
```

**Recommended Additional Simulators:**
1. iPhone SE (3rd generation) - Small screen testing
2. iPhone 14 Pro Max - Large screen/ProMotion testing
3. iPad Pro 12.9" - Tablet layout testing

---

## Remaining Work Breakdown

### Phase 1: Build Completion ⏳ IN PROGRESS

**Status:** CocoaPods installed successfully, C++17 fix applied, build needs retry

**Tasks:**
1. ✅ Complete deep clean (node_modules, caches, build artifacts)
2. ✅ Update iOS deployment target to 15.1
3. ✅ Fix Reanimated duplication issue
4. ✅ Resolve Boost download failure
5. ✅ Fix monorepo path configuration
6. ✅ Apply C++17 compatibility fix
7. ⏳ **[NEXT]** Retry iOS build with all fixes applied
8. ⏳ Verify successful compilation of all targets
9. ⏳ Resolve any remaining build errors

**Time Estimate:** 10-20 minutes (depending on build performance)

**Build Command:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell/ios
xcodebuild \
  -workspace MobileShell.xcworkspace \
  -scheme MobileShell \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,id=7A0637F6-9ADD-468C-BC5F-81AAC8147E91' \
  build
```

**Alternative (via npm):**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3
npm run ios
```

**Expected Outcome:**
- ✅ All pod targets compile successfully
- ✅ MobileShell.app builds without errors
- ✅ Warnings about iOS 11.0 deployment targets (non-critical)

---

### Phase 2: App Launch & Metro Bundle 📱 PENDING

**Status:** Blocked by Phase 1 completion

**Prerequisites:**
- ✅ Successful iOS build (from Phase 1)
- Metro bundler running
- Simulator booted

**Tasks:**
1. Start Metro bundler in separate terminal
2. Launch app on simulator
3. Verify app launches without crashes
4. Check Metro bundler for JavaScript errors
5. Test basic app navigation

**Commands:**
```bash
# Terminal 1: Start Metro
cd /Users/seanwinslow/Desktop/16BitFit-V3
npm run mobile-shell

# Terminal 2: Build and run
npm run ios
```

**Expected Issues:**
- Hot reload might not work initially (requires cache clear)
- First launch may be slow (JavaScript bundle compilation)
- Simulator might need manual boot

**Success Criteria:**
- ✅ App displays on simulator screen
- ✅ No red error screens
- ✅ Metro bundler shows successful bundle
- ✅ App responds to touch inputs

**Time Estimate:** 5-10 minutes

---

### Phase 3: Proactive Debugging Scan 🔍 PENDING

**Status:** Step 5 from original systematic plan

**Purpose:** Identify potential issues before they cause runtime problems

**Scan Checklist:**

#### 3.1 Xcode Build Settings Verification

**Location:** `MobileShell.xcodeproj/project.pbxproj`

**Items to Check:**
- [ ] Header Search Paths contain all required pod headers
- [ ] Framework Search Paths include React frameworks
- [ ] Library Search Paths point to correct directories
- [ ] Other Linker Flags include `-ObjC` and `-lc++`
- [ ] Deployment target matches Podfile (15.1)

**Commands:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell/ios

# Check header search paths
grep -A 5 "HEADER_SEARCH_PATHS" MobileShell.xcodeproj/project.pbxproj

# Check framework search paths
grep -A 5 "FRAMEWORK_SEARCH_PATHS" MobileShell.xcodeproj/project.pbxproj

# Check linker flags
grep -A 5 "OTHER_LDFLAGS" MobileShell.xcodeproj/project.pbxproj
```

#### 3.2 metro.config.js Verification

**Location:** `apps/mobile-shell/metro.config.js`

**Items to Check:**
- [ ] Monorepo configuration with workspace root
- [ ] Correct module resolution for hoisted dependencies
- [ ] Asset paths configured correctly
- [ ] Transformer configured for Skia/Reanimated

**Expected Configuration:**
```javascript
const { getDefaultConfig } = require('metro-config');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();

  return {
    projectRoot: __dirname,
    watchFolders: [
      path.resolve(__dirname, '../../node_modules'),
      path.resolve(__dirname, '../../packages')
    ],
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  };
})();
```

#### 3.3 AppDelegate Verification

**Location:** `apps/mobile-shell/ios/MobileShell/AppDelegate.mm` (or .m)

**Items to Check:**
- [ ] Reanimated bridge setup (`[RNReanimated initialize]`)
- [ ] Correct bundle URL for dev/prod
- [ ] Proper Hermes initialization
- [ ] Safe area context initialization

**Required Reanimated Setup:**
```objective-c
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNReanimated/RNReanimated.h>  // Add this

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  // Add this for Reanimated 2
  [RNReanimated initialize];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                    moduleName:@"MobileShell"
                                             initialProperties:nil];
  // ... rest of implementation
}
```

#### 3.4 Build Phases Verification

**Location:** Xcode → MobileShell Target → Build Phases

**Required Phases:**
- [ ] "Start Packager" - Starts Metro bundler
- [ ] "Bundle React Native code and images" - Packages JavaScript
- [ ] "Embed Pods Frameworks" - Links CocoaPods dependencies
- [ ] "Copy Pods Resources" - Copies assets

**Check via Command Line:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell/ios

# Extract build phases
xcodebuild \
  -project MobileShell.xcodeproj \
  -target MobileShell \
  -showBuildSettings | grep "SCRIPT_"
```

#### 3.5 Native Module Autolinking Verification

**Location:** CocoaPods output during `pod install`

**Expected Modules:**
```
Auto-linking React Native modules for target `MobileShell`:
  - RNCAsyncStorage
  - RNReanimated
  - RNScreens
  - react-native-safe-area-context
  - react-native-skia
```

**Verify Each Module:**
```bash
cd /Users/seanwinslow/Desktop/16BitFit-V3/apps/mobile-shell/ios/Pods

# Check each module exists
ls -d RNCAsyncStorage RNReanimated RNScreens \
  react-native-safe-area-context react-native-skia
```

#### 3.6 Duplicate Symbols Check

**During Build, Watch For:**
```
duplicate symbol '_OBJC_CLASS_$_...' in:
```

**Common Causes:**
- Same library linked twice
- Manual library inclusion + CocoaPods inclusion
- Multiple versions of same dependency

**Prevention:**
- Use `pod deintegrate` before major dependency changes
- Never manually drag frameworks into Xcode
- Trust CocoaPods for all native dependencies

#### 3.7 Missing Frameworks Check

**During Build, Watch For:**
```
ld: framework not found ...
ld: library not found for -l...
```

**Fix:**
```bash
# Re-run pod install
cd apps/mobile-shell/ios
LANG=en_US.UTF-8 pod install

# Clean build folder
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileShell-*
```

**Time Estimate for Phase 3:** 30-45 minutes

---

### Phase 4: Runtime Testing 🧪 PENDING

**Status:** Blocked by Phase 2 completion

**Test Categories:**

#### 4.1 Basic Functionality
- [ ] App launches successfully
- [ ] No crashes on startup
- [ ] React Native packager connects
- [ ] JavaScript executes without errors

#### 4.2 Navigation
- [ ] React Navigation renders correctly
- [ ] Screen transitions work smoothly
- [ ] Tab navigation functional (if implemented)
- [ ] Deep linking works (if configured)

#### 4.3 Animation Libraries
- [ ] React Native Reanimated 2 works
- [ ] Skia renders correctly
- [ ] No frame drops during animations
- [ ] Gesture handlers respond properly

#### 4.4 State Management
- [ ] Zustand store persists
- [ ] State updates trigger re-renders
- [ ] No memory leaks in DevTools

#### 4.5 Native Modules
- [ ] AsyncStorage reads/writes data
- [ ] Safe area insets calculated correctly
- [ ] Screen orientation changes handled
- [ ] Native alerts display properly

**Time Estimate:** 1-2 hours

---

### Phase 5: Performance Optimization 🚀 FUTURE

**Status:** Post-launch

**Optimization Targets:**
1. Reduce app bundle size
2. Optimize image assets
3. Implement code splitting
4. Enable Hermes bytecode precompilation
5. Profile and fix JavaScript performance bottlenecks

---

## Testing & Verification Plan

### Pre-Build Verification

**Before running build, verify:**
```bash
# 1. Boost file exists
ls -lh /tmp/boost_sf.tar.bz2

# 2. Node modules installed correctly
ls -d node_modules/react-native node_modules/nativewind

# 3. No nested react-native-reanimated
find node_modules/nativewind -name "react-native-reanimated" -type d

# 4. Podfile.lock exists and updated
ls -l apps/mobile-shell/ios/Podfile.lock

# 5. Pods installed correctly
ls apps/mobile-shell/ios/Pods/ | wc -l  # Should show 54+ directories
```

### Build Verification

**During build, watch for:**
- ✅ All pods compile without errors
- ⚠️ Warnings about iOS 11.0 targets (expected, non-critical)
- ❌ Any `error:` messages (must be resolved)

**Success Indicators:**
```
** BUILD SUCCEEDED **
```

**Log Analysis:**
```bash
# Check for errors in build log
grep -i "error:" /tmp/xcodebuild.log | head -20

# Check for warnings
grep -i "warning:" /tmp/xcodebuild.log | wc -l

# Check build time
grep "Pod install took" /tmp/xcodebuild.log
```

### Post-Build Verification

**After successful build:**
```bash
# 1. Verify .app bundle exists
ls -lh ~/Library/Developer/Xcode/DerivedData/MobileShell-*/Build/Products/Debug-iphonesimulator/MobileShell.app

# 2. Check app size
du -sh ~/Library/Developer/Xcode/DerivedData/MobileShell-*/Build/Products/Debug-iphonesimulator/MobileShell.app

# 3. Verify JavaScript bundle
ls -lh ~/Library/Developer/Xcode/DerivedData/MobileShell-*/Build/Products/Debug-iphonesimulator/MobileShell.app/main.jsbundle
```

### Runtime Verification

**Launch verification checklist:**
1. Simulator boots without errors
2. App icon appears in simulator
3. Splash screen displays correctly
4. Main screen renders without red error box
5. Metro bundler shows successful connection
6. Console logs show React Native version

**Metro Bundler Health Check:**
```
# Expected output in Metro:
 BUNDLE  ./index.js

 LOG  Running "MobileShell" with {"rootTag":1}
```

### Smoke Test Checklist

After successful launch, perform these quick tests:

- [ ] **Touch Response:** Tap elements, verify they respond
- [ ] **Navigation:** Navigate between screens (if multiple screens exist)
- [ ] **Reanimated:** Trigger any animations, verify smoothness
- [ ] **Skia:** Check if any Skia-rendered elements display correctly
- [ ] **AsyncStorage:** Test data persistence (write, close app, reopen, read)
- [ ] **Hot Reload:** Make a code change, verify hot reload works
- [ ] **Live Reload:** Shake device, reload, verify app restarts

---

## Known Warnings & Non-Critical Issues

### Expected Warnings During Build

#### 1. iOS Deployment Target Warnings

**Warning Message:**
```
warning: The iOS Simulator deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 11.0,
but the range of supported deployment target versions is 12.0 to 26.0.99.
```

**Affected Pods:**
- boost
- RNCAsyncStorage
- RNReanimated
- Flipper* (all Flipper-related pods)
- CocoaAsyncSocket
- fmt
- libevent
- RCT-Folly
- YogaKit
- OpenSSL-Universal
- SocketRocket

**Why This Happens:**
These pods have hardcoded `s.platform = :ios, '11.0'` in their podspecs, which predates Xcode 26's minimum simulator support of iOS 12.0.

**Impact:** None - Runtime deployment target is controlled by Podfile (`platform :ios, '15.1'`)

**Can Be Ignored:** ✅ Yes - These warnings don't affect build success or runtime behavior

**Suppression (Optional):**
Add to post_install in Podfile:
```ruby
installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
    deployment_target = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
    if deployment_target.to_f < 12.0
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
    end
  end
end
```

#### 2. ERB Deprecation Warnings

**Warning Message:**
```
warning: Passing safe_level with the 2nd argument of ERB.new is deprecated.
warning: Passing trim_mode with the 3rd argument of ERB.new is deprecated.
```

**Source:**
`node_modules/react-native/scripts/react_native_pods_utils/script_phases.rb:51`

**Why This Happens:**
React Native 0.71.8's Ruby scripts use deprecated ERB API syntax. Fixed in React Native 0.72+.

**Impact:** None - Purely informational

**Can Be Ignored:** ✅ Yes

#### 3. Run Script Phase Warnings

**Warning Message:**
```
warning: Run script build phase 'Bundle React Native code and images' will be run during
every build because it does not specify any outputs.

warning: Run script build phase 'Start Packager' will be run during every build because
it does not specify any outputs.
```

**Why This Happens:**
These scripts don't declare output dependencies, so Xcode can't determine if they need to re-run.

**Impact:** Slightly slower incremental builds

**Can Be Ignored:** ✅ Yes - Required for React Native development workflow

**Fix (Optional):**
In Xcode → MobileShell Target → Build Phases → Each script → Uncheck "Based on dependency analysis"

#### 4. fmt char_traits Deprecation

**Warning Message:**
```
warning: 'char_traits<fmt::internal::char8_type>' is deprecated: char_traits<T> for T not
equal to char, wchar_t, char8_t, char16_t or char32_t is non-standard
```

**Source:** fmt library used by Folly

**Why This Happens:**
Old fmt version (6.2.1) in RCT-Folly uses deprecated char traits. Fixed in fmt 8.0+.

**Impact:** None - Compiles successfully despite warning

**Can Be Ignored:** ✅ Yes

---

### Non-Critical Build Issues

#### 1. Boost in /tmp Directory

**Issue:** Boost tarball stored in temporary location

**Permanence:** Lost on system reboot

**Fix:**
Move to permanent location and update podspec:
```bash
# Create permanent storage
mkdir -p ~/Library/CocoaPods/boost
cp /tmp/boost_sf.tar.bz2 ~/Library/CocoaPods/boost/

# Update boost.podspec
# Change: file:///tmp/boost_sf.tar.bz2
# To: file:///Users/seanwinslow/Library/CocoaPods/boost/boost_sf.tar.bz2
```

**Better Solution:**
Create `postinstall` script in package.json:
```json
{
  "scripts": {
    "postinstall": "node scripts/fix-boost-podspec.js"
  }
}
```

```javascript
// scripts/fix-boost-podspec.js
const fs = require('fs');
const path = require('path');

const podspecPath = path.join(__dirname, '../node_modules/react-native/third-party-podspecs/boost.podspec');
const boostUrl = 'file://' + path.join(process.env.HOME, 'Library/CocoaPods/boost/boost_sf.tar.bz2');

let content = fs.readFileSync(podspecPath, 'utf8');
content = content.replace(
  /spec\.source\s*=\s*{[^}]+}/,
  `spec.source = { :http => '${boostUrl}', :sha256 => 'f0397ba6e982c4450f27bf32a2a83292aba035b827a5623a14636ea583318c41' }`
);

fs.writeFileSync(podspecPath, content);
console.log('✅ Fixed boost.podspec to use local file');
```

#### 2. Reanimated Version Mismatch

**Issue:** Project uses Reanimated v2.17.0, NativeWind expects v3.6.2+

**Current Workaround:** Removed NativeWind's nested node_modules

**Long-term Risk:**
- NativeWind v4 features may not work fully with Reanimated v2
- Future NativeWind updates may break compatibility

**Recommended Action:**
Plan migration to Reanimated v3:
```json
{
  "dependencies": {
    "react-native-reanimated": "^3.16.1"
  }
}
```

**Migration Complexity:** Medium
- API changes between v2 and v3
- Need to update all animation code
- Test on all platforms
- Update documentation

**Timeline:** Post-MVP / Phase 2 of development

---

## Future Recommendations

### 1. React Native Upgrade Path

**Current:** React Native 0.71.8 (Released: February 2023)
**Latest Stable:** React Native 0.76.x (As of October 2025)

**Benefits of Upgrading:**
- ✅ Boost 1.83.0 (fixes C++17 issues natively)
- ✅ Better TypeScript support
- ✅ Improved performance with Hermes engine
- ✅ Modern architecture features
- ✅ Active security patches

**Upgrade Complexity:** High

**Recommended Timeline:** Q2 2026 (after initial product launch)

**Upgrade Path:**
```
0.71.8 → 0.72.x → 0.74.x → 0.76.x
```

**Resources:**
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [Breaking Changes Documentation](https://github.com/react-native-community/releases)

---

### 2. Dependency Consolidation

**Current Issues:**
- NativeWind requires Reanimated v3
- Using Reanimated v2 due to compatibility

**Recommended Actions:**

1. **Short-term:** Document compatibility requirements
2. **Medium-term:** Upgrade Reanimated v2 → v3
3. **Long-term:** Consider alternatives if NativeWind proves unstable

**Alternative to NativeWind:**
- [Tamagui](https://tamagui.dev/) - Full design system with better RN integration
- Custom Tailwind implementation with [twrnc](https://github.com/jaredh159/tailwind-react-native-classnames)
- Native styling with [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)

---

### 3. Build Automation

**Problem:** Manual fixes required for Boost and nohoist

**Solution:** Automated post-install scripts

**Implementation:**

Create `scripts/post-install.sh`:
```bash
#!/bin/bash
set -e

echo "🔧 Running post-install fixes..."

# Fix 1: Ensure Boost is available
if [ ! -f "$HOME/Library/CocoaPods/boost/boost_sf.tar.bz2" ]; then
  echo "📥 Downloading Boost 1.76.0..."
  mkdir -p "$HOME/Library/CocoaPods/boost"
  curl -L "https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2/download" \
    -o "$HOME/Library/CocoaPods/boost/boost_sf.tar.bz2"
fi

# Fix 2: Patch boost.podspec
echo "🔨 Patching boost.podspec..."
node scripts/fix-boost-podspec.js

# Fix 3: Remove nested reanimated if exists
if [ -d "node_modules/nativewind/node_modules/react-native-reanimated" ]; then
  echo "🧹 Removing nested react-native-reanimated..."
  rm -rf node_modules/nativewind/node_modules/react-native-reanimated
fi

echo "✅ Post-install fixes complete!"
```

Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "bash scripts/post-install.sh"
  }
}
```

---

### 4. CI/CD Integration

**For Future Team Onboarding:**

Create `.github/workflows/ios-build.yml`:
```yaml
name: iOS Build

on: [push, pull_request]

jobs:
  build:
    runs-on: macos-14  # Xcode 26+
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup Boost
        run: |
          mkdir -p ~/Library/CocoaPods/boost
          curl -L "https://sourceforge.net/projects/boost/files/boost/1.76.0/boost_1_76_0.tar.bz2/download" \
            -o ~/Library/CocoaPods/boost/boost_sf.tar.bz2

      - name: Install Pods
        run: |
          cd apps/mobile-shell/ios
          pod install

      - name: Build iOS
        run: |
          cd apps/mobile-shell/ios
          xcodebuild \
            -workspace MobileShell.xcworkspace \
            -scheme MobileShell \
            -sdk iphonesimulator \
            -configuration Release \
            build
```

---

### 5. Documentation Maintenance

**Living Documents to Create:**

1. **DEVELOPMENT.md**
   - Local setup instructions
   - Common errors and solutions
   - Troubleshooting guide

2. **CONTRIBUTING.md**
   - Code style guide
   - PR requirements
   - Testing checklist

3. **ARCHITECTURE.md**
   - Component hierarchy
   - State management patterns
   - Navigation structure

4. **CHANGELOG.md**
   - Version history
   - Breaking changes
   - Migration guides

---

### 6. Monitoring & Debugging

**Recommended Tools:**

1. **Flipper** (Already installed via CocoaPods)
   - React DevTools
   - Network inspector
   - Layout inspector
   - Crash reporter

2. **Reactotron**
   - State inspection
   - API monitoring
   - AsyncStorage viewer

3. **Sentry** (Production error tracking)
   ```bash
   npm install --save @sentry/react-native
   ```

4. **Firebase Crashlytics**
   ```bash
   npm install --save @react-native-firebase/app @react-native-firebase/crashlytics
   ```

---

## Execution Plan

### Immediate Next Steps (Next 30 Minutes)

1. **Verify Pre-Conditions:**
```bash
# Ensure Boost file exists
ls -lh /tmp/boost_sf.tar.bz2

# Verify Podfile changes
cat apps/mobile-shell/ios/Podfile | grep "15.1"
cat apps/mobile-shell/ios/Podfile | grep "LIBCPP_ENABLE"

# Verify nohoist
cat package.json | grep -A 10 "nohoist"
```

2. **Run Clean Build:**
```bash
# From project root
cd /Users/seanwinslow/Desktop/16BitFit-V3

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileShell-*

# Build iOS app
cd apps/mobile-shell/ios
xcodebuild \
  -workspace MobileShell.xcworkspace \
  -scheme MobileShell \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,id=7A0637F6-9ADD-468C-BC5F-81AAC8147E91' \
  clean build 2>&1 | tee /tmp/xcodebuild-clean.log
```

3. **Analyze Results:**
```bash
# Check for success
grep "BUILD SUCCEEDED" /tmp/xcodebuild-clean.log

# If failed, find errors
grep -i "error:" /tmp/xcodebuild-clean.log | head -20

# Count warnings
grep -i "warning:" /tmp/xcodebuild-clean.log | wc -l
```

### If Build Succeeds (Next 15 Minutes)

4. **Launch App:**
```bash
# Terminal 1: Start Metro
cd /Users/seanwinslow/Desktop/16BitFit-V3
npm run mobile-shell

# Terminal 2: Run on simulator
npm run ios
```

5. **Smoke Test:**
- [ ] App launches without crash
- [ ] Metro bundler connects
- [ ] No red error screens
- [ ] Basic touch interaction works

6. **Complete Phase 3 Debugging Scan** (30-45 minutes)

### If Build Fails (Next 30-60 Minutes)

4. **Analyze Error:**
```bash
# Extract specific error
grep -A 30 "error:" /tmp/xcodebuild-clean.log | head -50
```

5. **Apply Fix Based on Error Type:**

**If Boost-related:**
- Verify `/tmp/boost_sf.tar.bz2` exists and has correct checksum
- Verify `boost.podspec` has `file:///tmp/boost_sf.tar.bz2`
- Try re-downloading Boost from SourceForge

**If Reanimated-related:**
- Verify no nested `node_modules/nativewind/node_modules/react-native-reanimated`
- Check `package.json` nohoist configuration
- Run `npm install` again to apply nohoist

**If Linker-related:**
- Run `pod deintegrate` and `pod install` again
- Clean Xcode derived data
- Restart Xcode if open

**If C++ Compiler-related:**
- Verify Podfile post_install has C++17 flag
- Run `pod install` to regenerate Pods.xcodeproj with new settings
- Check that `OTHER_CPLUSPLUSFLAGS` is set in build settings

6. **Iterate Until Success**

---

## Success Metrics

### Build Success Definition

✅ **Build Succeeded** when:
1. Xcode exits with code 0
2. `BUILD SUCCEEDED` appears in output
3. `.app` bundle created in DerivedData
4. No `error:` messages in log (warnings OK)

### App Launch Success Definition

✅ **Launch Succeeded** when:
1. App appears on simulator screen
2. Metro bundler shows "Bundling complete"
3. No red error box displayed
4. App responds to touch inputs
5. Console shows React Native version log

### Project Health Definition

✅ **Project Healthy** when:
1. Builds succeed consistently
2. App launches without manual intervention
3. Hot reload works reliably
4. No memory leaks detected in DevTools
5. All core features functional

---

## Appendix

### Quick Reference Commands

```bash
# Deep clean
rm -rf node_modules apps/*/node_modules apps/*/ios/Pods apps/*/ios/Podfile.lock
npm install

# iOS clean build
cd apps/mobile-shell/ios
rm -rf Pods Podfile.lock build
LANG=en_US.UTF-8 pod install
cd ../../..
npm run ios

# Check simulator list
xcrun simctl list devices | grep "16BitFit"

# Boot specific simulator
xcrun simctl boot 7A0637F6-9ADD-468C-BC5F-81AAC8147E91

# View Metro logs
npx react-native start --reset-cache

# Kill Metro
lsof -ti:8081 | xargs kill -9

# Clear iOS simulator data
xcrun simctl erase all
```

### File Locations Reference

```
Project Root: /Users/seanwinslow/Desktop/16BitFit-V3/

Key Files:
├── package.json (workspace config, nohoist)
├── apps/mobile-shell/
│   ├── package.json (app dependencies)
│   ├── metro.config.js (bundler config)
│   └── ios/
│       ├── Podfile (iOS dependencies)
│       ├── Podfile.lock (locked versions)
│       ├── Pods/ (installed pods)
│       └── MobileShell.xcworkspace (Xcode project)
├── node_modules/
│   └── react-native/
│       └── third-party-podspecs/
│           └── boost.podspec (modified)
└── /tmp/boost_sf.tar.bz2 (required for builds)
```

### Contact & Support

**For Build Issues:**
- Check this document first
- Review error logs in `/tmp/xcodebuild.log`
- Search React Native GitHub issues
- Search CocoaPods GitHub issues

**For Dependencies:**
- React Native: https://reactnative.dev/docs/troubleshooting
- CocoaPods: https://guides.cocoapods.org/using/troubleshooting
- Boost: https://www.boost.org/users/download/

---

**Document Version:** 1.0
**Last Updated:** October 25, 2025
**Maintained By:** 16BitFit Development Team
**Next Review:** After successful first build
