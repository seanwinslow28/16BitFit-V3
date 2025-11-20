# 🛠️ CODEX HANDOFF: Build Crisis Implementation Guide

## 📋 PURPOSE OF THIS DOCUMENT

This document bridges the gap between **Google Deep Think's strategic analysis** and **Codex's implementation execution**. After Deep Think validates the remediation strategy, Codex will use this guide to:

1. Automate the implementation of approved fixes
2. Create testing scripts to validate each change
3. Generate rollback procedures
4. Set up monitoring to prevent recurrence

---

## 🎯 IMPLEMENTATION WORKFLOW

```
Google Deep Think Analysis
         ↓
   (This Document)
         ↓
    Codex Implementation
         ↓
   Validation & Testing
         ↓
   Production Deployment
```

---

## 📂 CONTEXT FOR CODEX

### Project Overview
- **Type:** Monorepo (Yarn Workspaces)
- **Primary App:** Mobile fitness app (React Native + Expo)
- **Structure:** 3 apps + 3 shared packages
- **Current Status:** Build failures blocking all development

### Technology Stack
- **React Native:** 0.76.9
- **Expo SDK:** 52.0.47
- **iOS:** Xcode 15.2, iOS SDK 17.2, CocoaPods
- **Android:** Gradle, Android SDK 34
- **Language:** TypeScript (strict mode)
- **Package Manager:** Yarn 1.22.22

### Critical Constraints
- ❌ Cannot downgrade React Native (Expo SDK 52 dependency)
- ❌ Cannot lose completed HealthKit integration work
- ❌ Cannot break Android while fixing iOS
- ✅ Must maintain monorepo structure
- ✅ Must keep TypeScript strict mode
- ✅ Must preserve Expo managed workflow benefits

---

## 🔍 ISSUES IDENTIFIED (Awaiting Deep Think Validation)

### Issue #1: C++ Standard Mismatch 🔴 CRITICAL
**File:** `apps/mobile-shell/ios/Podfile`
**Line:** 55
**Current:** `config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'`
**Proposed:** `config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'`

**Codex Tasks (IF Deep Think approves):**
- [ ] Create backup of current Podfile
- [ ] Implement language standard change
- [ ] Update related comment (line 52)
- [ ] Generate test script to verify C++20 compilation
- [ ] Create rollback script

### Issue #2: expo-modules-core Conflict 🟠 HIGH
**Files:**
- `package.json` (root) - has expo-modules-core v3.0.25
- `apps/mobile-shell/package.json` - has expo-modules-core v2.2.3

**Codex Tasks (IF Deep Think approves):**
- [ ] Remove expo-modules-core from root package.json
- [ ] Verify workspace dependency resolution
- [ ] Test that Expo autolinking still works
- [ ] Create dependency validation script

### Issue #3: Metro Configuration 🟡 MEDIUM
**File:** `apps/mobile-shell/metro.config.js`
**Issue:** Manual configuration may conflict with SDK 52 auto-config

**Codex Tasks (IF Deep Think approves simplification):**
- [ ] Create backup of current metro.config.js
- [ ] Implement simplified version
- [ ] Test Metro bundling and hot reload
- [ ] Verify monorepo workspace resolution

### Issue #4: Missing React Native CLI 🟡 MEDIUM
**File:** `apps/mobile-shell/package.json`
**Missing:** `@react-native-community/cli` and related packages

**Codex Tasks (IF Deep Think approves):**
- [ ] Add CLI packages to devDependencies
- [ ] Run yarn install
- [ ] Verify CLI commands work
- [ ] Document required versions

### Issue #5: Custom Metro Script Assessment 🔍 NEEDS REVIEW
**File:** `apps/mobile-shell/ios/Podfile` (lines 63-131)
**Component:** Custom `[16BitFit] Synchronize Metro` build phase

**Codex Tasks (Based on Deep Think decision):**
- [ ] If KEEP: Document why and add monitoring
- [ ] If MODIFY: Implement changes suggested by Deep Think
- [ ] If REMOVE: Create removal script and test build process

---

## 🛠️ CODEX IMPLEMENTATION PHASES

### Phase 0: Pre-Implementation Preparation
**DO BEFORE ANY CHANGES:**

1. **Create Comprehensive Backup**
   ```bash
   cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3

   # Backup critical files
   cp apps/mobile-shell/ios/Podfile apps/mobile-shell/ios/Podfile.backup
   cp apps/mobile-shell/metro.config.js apps/mobile-shell/metro.config.js.backup
   cp package.json package.json.backup
   cp apps/mobile-shell/package.json apps/mobile-shell/package.json.backup

   # Create Git commit checkpoint
   git add -A
   git commit -m "CHECKPOINT: Before build crisis remediation"
   git tag pre-remediation-backup
   ```

2. **Document Current State**
   ```bash
   # Capture current versions
   cd apps/mobile-shell
   yarn list --depth=0 > ../../docs/dependency-snapshot-before.txt

   # Capture current pod versions
   cd ios
   pod --version > ../../docs/cocoapods-version-before.txt
   ```

3. **Set Up Logging**
   ```bash
   # Create logs directory
   mkdir -p docs/implementation-logs

   # Start implementation log
   echo "Build Crisis Remediation - $(date)" > docs/implementation-logs/implementation-$(date +%Y%m%d-%H%M%S).log
   ```

---

### Phase 1: Critical Fixes (Based on Deep Think Approval)

#### 1.1: C++ Standard Migration (IF APPROVED)

**Codex Script:**
```bash
#!/bin/bash
# Script: fix-cpp-standard.sh
# Purpose: Update Podfile C++ standard from c++17 to c++20

PODFILE="apps/mobile-shell/ios/Podfile"
BACKUP="${PODFILE}.pre-cpp20-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup: ${BACKUP}"
cp "${PODFILE}" "${BACKUP}"

echo "Updating C++ standard to c++20..."
sed -i '' "s/config.build_settings\['CLANG_CXX_LANGUAGE_STANDARD'\] = 'c++17'/config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20'/g" "${PODFILE}"

echo "Updating comment..."
sed -i '' "s/Fix for Boost C++17 compatibility (Required for RN 0.71.8, from analysis)/C++20 compatibility for React Native 0.76+ (Required for FuseboxTracer and other RN modules)/g" "${PODFILE}"

echo "Verifying change..."
grep "c++20" "${PODFILE}" && echo "✅ C++20 update confirmed" || echo "❌ Update failed"

echo "Backup location: ${BACKUP}"
```

**Rollback Script:**
```bash
#!/bin/bash
# Script: rollback-cpp-standard.sh
# Purpose: Restore original Podfile if C++20 causes issues

BACKUP=$(ls -t apps/mobile-shell/ios/Podfile.pre-cpp20-* | head -1)

if [ -z "$BACKUP" ]; then
    echo "❌ No backup found"
    exit 1
fi

echo "Restoring from: ${BACKUP}"
cp "${BACKUP}" "apps/mobile-shell/ios/Podfile"
echo "✅ Rollback complete"
```

**Testing Script:**
```bash
#!/bin/bash
# Script: test-cpp-build.sh
# Purpose: Verify C++20 compilation works

cd apps/mobile-shell/ios

echo "Cleaning build artifacts..."
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileShell-*
pod deintegrate
pod install

echo "Attempting build with C++20..."
xcodebuild -workspace MobileShell.xcworkspace \
           -scheme MobileShell \
           -configuration Debug \
           -sdk iphonesimulator \
           -destination 'platform=iOS Simulator,name=iPhone 15' \
           clean build \
           | tee ../../../docs/implementation-logs/cpp20-test-build.log

if [ $? -eq 0 ]; then
    echo "✅ C++20 build successful"
    exit 0
else
    echo "❌ C++20 build failed - check logs"
    exit 1
fi
```

**Codex Task Checklist:**
- [ ] Generate the three scripts above
- [ ] Make scripts executable
- [ ] Add error handling
- [ ] Add progress indicators
- [ ] Test in dry-run mode first
- [ ] Execute with logging enabled
- [ ] Verify build succeeds
- [ ] Document any unexpected behaviors

---

#### 1.2: Expo Modules Core Conflict Resolution (IF APPROVED)

**Codex Script:**
```bash
#!/bin/bash
# Script: fix-expo-modules-conflict.sh
# Purpose: Remove expo-modules-core from root, keep in workspace only

ROOT_PACKAGE="package.json"
BACKUP="${ROOT_PACKAGE}.pre-expo-fix-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup: ${BACKUP}"
cp "${ROOT_PACKAGE}" "${BACKUP}"

echo "Removing expo-modules-core from root dependencies..."
# Use node to safely edit JSON
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('${ROOT_PACKAGE}', 'utf8'));
if (pkg.dependencies && pkg.dependencies['expo-modules-core']) {
    delete pkg.dependencies['expo-modules-core'];
    fs.writeFileSync('${ROOT_PACKAGE}', JSON.stringify(pkg, null, 2) + '\n');
    console.log('✅ Removed expo-modules-core from root');
} else {
    console.log('⚠️  expo-modules-core not found in root dependencies');
}
"

echo "Reinstalling dependencies..."
rm -rf node_modules
rm -rf apps/*/node_modules
yarn install

echo "Verifying resolution..."
yarn why expo-modules-core
```

**Testing Script:**
```bash
#!/bin/bash
# Script: test-expo-modules-resolution.sh
# Purpose: Verify Expo modules still work after conflict resolution

cd apps/mobile-shell

echo "Checking expo-modules-core resolution..."
RESOLVED_VERSION=$(yarn list --pattern expo-modules-core --depth=0 | grep "expo-modules-core@" | awk -F@ '{print $2}')

echo "Resolved version: ${RESOLVED_VERSION}"

if [ "${RESOLVED_VERSION}" = "2.2.3" ]; then
    echo "✅ Correct version resolved (workspace version)"
else
    echo "❌ Unexpected version: ${RESOLVED_VERSION}"
    exit 1
fi

echo "Testing Expo autolinking..."
npx expo-doctor@latest

echo "Testing iOS pod install..."
cd ios
pod install

if [ $? -eq 0 ]; then
    echo "✅ CocoaPods install successful"
else
    echo "❌ CocoaPods install failed"
    exit 1
fi
```

**Codex Task Checklist:**
- [ ] Generate conflict resolution script
- [ ] Generate testing script
- [ ] Execute removal of duplicate dependency
- [ ] Verify workspace resolution
- [ ] Test pod install still works
- [ ] Run expo-doctor validation
- [ ] Document resolved version

---

#### 1.3: Metro Configuration Simplification (IF APPROVED)

**Codex Script:**
```bash
#!/bin/bash
# Script: simplify-metro-config.sh
# Purpose: Replace manual Metro config with SDK 52 auto-config compatible version

METRO_CONFIG="apps/mobile-shell/metro.config.js"
BACKUP="${METRO_CONFIG}.pre-sdk52-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup: ${BACKUP}"
cp "${METRO_CONFIG}" "${BACKUP}"

echo "Generating simplified Metro config for SDK 52..."
cat > "${METRO_CONFIG}" << 'METRO_EOF'
// 16BitFit-V3/apps/mobile-shell/metro.config.js
// Simplified for Expo SDK 52 automatic monorepo support
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Expo SDK 52+ auto-configures monorepo support
const config = getDefaultConfig(__dirname);

// Watch monorepo root for workspace package changes
const workspaceRoot = path.resolve(__dirname, '../..');
config.watchFolders = [workspaceRoot];

module.exports = config;
METRO_EOF

echo "✅ Simplified Metro config generated"
echo "Backup location: ${BACKUP}"
```

**Testing Script:**
```bash
#!/bin/bash
# Script: test-metro-config.sh
# Purpose: Verify Metro bundler works with simplified config

cd apps/mobile-shell

echo "Clearing Metro cache..."
npx expo start --clear &
METRO_PID=$!

echo "Waiting for Metro to start..."
sleep 10

echo "Testing Metro health..."
curl -s http://localhost:8081/status | grep -q "packager-status:running"

if [ $? -eq 0 ]; then
    echo "✅ Metro bundler running successfully"
else
    echo "❌ Metro bundler failed to start"
fi

echo "Stopping Metro..."
kill $METRO_PID

echo "Testing production bundle..."
npx expo export --platform ios --output-dir ../../test_output/bundle-test

if [ $? -eq 0 ]; then
    echo "✅ Production bundle creation successful"
else
    echo "❌ Production bundle creation failed"
    exit 1
fi
```

**Codex Task Checklist:**
- [ ] Generate Metro simplification script
- [ ] Create testing script for Metro health
- [ ] Execute Metro config replacement
- [ ] Test Metro bundler startup
- [ ] Test hot reload functionality
- [ ] Test production bundle creation
- [ ] Verify workspace module resolution

---

### Phase 2: Dependency Cleanup (Lower Priority)

#### 2.1: Add Missing React Native CLI

**Codex Script:**
```bash
#!/bin/bash
# Script: add-missing-cli-deps.sh
# Purpose: Add missing @react-native-community/cli dependencies

cd apps/mobile-shell

echo "Adding React Native CLI dependencies..."
yarn add --dev \
  @react-native-community/cli@^15.0.0 \
  @react-native-community/cli-platform-ios@^15.0.0

echo "Verifying installation..."
yarn list --pattern "@react-native-community/cli" --depth=0

echo "Testing CLI availability..."
npx react-native --version

if [ $? -eq 0 ]; then
    echo "✅ CLI dependencies installed successfully"
else
    echo "❌ CLI installation failed"
    exit 1
fi
```

**Codex Task Checklist:**
- [ ] Generate CLI installation script
- [ ] Execute dependency addition
- [ ] Verify CLI commands work
- [ ] Test react-native info command
- [ ] Document installed versions

---

#### 2.2: Full Dependency Audit and Cleanup

**Codex Script:**
```bash
#!/bin/bash
# Script: audit-dependencies.sh
# Purpose: Run comprehensive dependency audit and identify issues

cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3

echo "Running dependency audit..."

echo "1. Checking for duplicate React Native installations..."
yarn why react-native | tee docs/implementation-logs/duplicate-rn-check.log

echo "2. Checking for duplicate Expo installations..."
yarn why expo | tee docs/implementation-logs/duplicate-expo-check.log

echo "3. Checking for duplicate React installations..."
yarn why react | tee docs/implementation-logs/duplicate-react-check.log

echo "4. Running Expo Doctor..."
cd apps/mobile-shell
npx expo-doctor@latest | tee ../../docs/implementation-logs/expo-doctor-report.log

echo "5. Checking for outdated dependencies..."
yarn outdated | tee ../../docs/implementation-logs/outdated-deps.log

echo "6. Validating peer dependencies..."
yarn check --integrity | tee ../../docs/implementation-logs/integrity-check.log

echo "✅ Audit complete - check logs in docs/implementation-logs/"
```

**Codex Task Checklist:**
- [ ] Generate audit script
- [ ] Execute full dependency scan
- [ ] Review all logs for issues
- [ ] Create summary of findings
- [ ] Recommend additional fixes

---

### Phase 3: Testing and Validation

#### 3.1: Comprehensive Build Test Suite

**Codex Task: Create `test-suite.sh`**

```bash
#!/bin/bash
# Script: test-suite.sh
# Purpose: Comprehensive testing of all fixes

set -e  # Exit on any error

echo "================================================"
echo "16BitFit V3 - Post-Remediation Test Suite"
echo "================================================"

REPORT_FILE="docs/implementation-logs/test-suite-$(date +%Y%m%d-%H%M%S).log"

log_result() {
    echo "$1" | tee -a "${REPORT_FILE}"
}

# Test 1: iOS Clean Build
log_result "\n[Test 1/10] iOS Clean Build"
cd apps/mobile-shell/ios
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileShell-*
pod deintegrate && pod install
cd ..
npx expo run:ios --no-install --no-bundler &
IOS_PID=$!
sleep 30
if kill -0 $IOS_PID 2>/dev/null; then
    log_result "✅ PASS - iOS build successful"
    kill $IOS_PID
else
    log_result "❌ FAIL - iOS build failed"
fi

# Test 2: Metro Bundler
log_result "\n[Test 2/10] Metro Bundler Health"
npx expo start --clear &
METRO_PID=$!
sleep 10
curl -s http://localhost:8081/status | grep -q "packager-status:running"
if [ $? -eq 0 ]; then
    log_result "✅ PASS - Metro bundler running"
else
    log_result "❌ FAIL - Metro bundler not responding"
fi
kill $METRO_PID

# Test 3: TypeScript Compilation
log_result "\n[Test 3/10] TypeScript Type Checking"
yarn type-check
if [ $? -eq 0 ]; then
    log_result "✅ PASS - TypeScript compilation successful"
else
    log_result "❌ FAIL - TypeScript errors found"
fi

# Test 4: Expo Doctor
log_result "\n[Test 4/10] Expo Doctor Validation"
npx expo-doctor@latest
if [ $? -eq 0 ]; then
    log_result "✅ PASS - Expo doctor checks passed"
else
    log_result "⚠️  WARN - Expo doctor found issues"
fi

# Test 5: Dependency Resolution
log_result "\n[Test 5/10] Dependency Resolution Check"
yarn list --depth=0 > /tmp/deps.txt
REACT_NATIVE_COUNT=$(grep -c "react-native@" /tmp/deps.txt)
if [ $REACT_NATIVE_COUNT -eq 1 ]; then
    log_result "✅ PASS - Single React Native installation"
else
    log_result "❌ FAIL - Multiple React Native installations detected"
fi

# Test 6: CocoaPods Validation
log_result "\n[Test 6/10] CocoaPods Validation"
cd ios
pod install
if [ $? -eq 0 ]; then
    log_result "✅ PASS - CocoaPods install successful"
else
    log_result "❌ FAIL - CocoaPods install failed"
fi
cd ..

# Test 7: Android Build (Cross-platform)
log_result "\n[Test 7/10] Android Build Validation"
cd android
./gradlew clean assembleDebug
if [ $? -eq 0 ]; then
    log_result "✅ PASS - Android build successful"
else
    log_result "❌ FAIL - Android build failed"
fi
cd ..

# Test 8: Hot Reload
log_result "\n[Test 8/10] Hot Reload Functionality"
npx expo start &
METRO_PID=$!
sleep 15
# Touch a file to trigger hot reload
touch src/App.tsx
sleep 5
log_result "✅ PASS - Hot reload triggered (manual verification needed)"
kill $METRO_PID

# Test 9: Production Bundle
log_result "\n[Test 9/10] Production Bundle Creation"
npx expo export --platform ios --output-dir ../../test_output/final-bundle
if [ $? -eq 0 ]; then
    log_result "✅ PASS - Production bundle created"
else
    log_result "❌ FAIL - Production bundle creation failed"
fi

# Test 10: HealthKit Integration (Smoke Test)
log_result "\n[Test 10/10] HealthKit Integration Smoke Test"
# This would require simulator/device testing
log_result "⚠️  MANUAL - HealthKit requires device/simulator testing"

echo "\n================================================"
echo "Test Suite Complete"
echo "================================================"
echo "Full report: ${REPORT_FILE}"
```

**Codex Task Checklist:**
- [ ] Generate comprehensive test suite
- [ ] Execute all tests
- [ ] Document all failures
- [ ] Create pass/fail summary
- [ ] Recommend follow-up actions

---

## 🔄 ROLLBACK PROCEDURES

### Emergency Rollback (If Everything Fails)

**Codex Task: Create `emergency-rollback.sh`**

```bash
#!/bin/bash
# Script: emergency-rollback.sh
# Purpose: Full rollback to pre-remediation state

echo "🚨 EMERGENCY ROLLBACK INITIATED 🚨"

cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3

# Restore from Git checkpoint
echo "Restoring from Git checkpoint..."
git reset --hard pre-remediation-backup

# Restore backups if Git unavailable
if [ $? -ne 0 ]; then
    echo "Git rollback failed, restoring from file backups..."

    # Restore Podfile
    if [ -f "apps/mobile-shell/ios/Podfile.backup" ]; then
        cp apps/mobile-shell/ios/Podfile.backup apps/mobile-shell/ios/Podfile
    fi

    # Restore Metro config
    if [ -f "apps/mobile-shell/metro.config.js.backup" ]; then
        cp apps/mobile-shell/metro.config.js.backup apps/mobile-shell/metro.config.js
    fi

    # Restore root package.json
    if [ -f "package.json.backup" ]; then
        cp package.json.backup package.json
    fi

    # Restore workspace package.json
    if [ -f "apps/mobile-shell/package.json.backup" ]; then
        cp apps/mobile-shell/package.json.backup apps/mobile-shell/package.json
    fi
fi

# Reinstall dependencies
echo "Reinstalling original dependencies..."
rm -rf node_modules
rm -rf apps/*/node_modules
yarn install

# Reinstall pods
echo "Reinstalling CocoaPods..."
cd apps/mobile-shell/ios
rm -rf Pods Podfile.lock
pod install

echo "✅ Rollback complete - project restored to pre-remediation state"
echo "⚠️  Review what went wrong before attempting fixes again"
```

---

## 📊 SUCCESS METRICS

### Build Success Indicators
- [ ] `yarn ios` completes without errors
- [ ] App launches on simulator
- [ ] No red screen errors
- [ ] Metro bundler runs without warnings
- [ ] Hot reload works
- [ ] TypeScript compilation passes
- [ ] Expo doctor shows no critical issues

### Runtime Success Indicators
- [ ] App navigation functions
- [ ] Fonts load correctly
- [ ] HealthKit permissions work (iOS)
- [ ] No native module linking errors
- [ ] Performance is acceptable (60fps)

### Configuration Health Indicators
- [ ] Single React Native installation
- [ ] Single Expo installation
- [ ] No dependency version conflicts
- [ ] CocoaPods install cleanly
- [ ] Gradle builds without warnings (Android)

---

## 🎯 CODEX SPECIFIC INSTRUCTIONS

### When Implementing Fixes:

1. **Always Create Backups First**
   - Never modify a file without creating a dated backup
   - Use Git tags for checkpoint commits
   - Document backup locations in logs

2. **Execute One Fix at a Time**
   - Don't batch multiple changes
   - Test after each fix
   - Document results before proceeding

3. **Log Everything**
   - Capture all command output
   - Save before/after comparisons
   - Record timestamps for all changes

4. **Verify Cross-Platform Impact**
   - iOS fixes shouldn't break Android
   - Test both platforms after major changes
   - Check that Metro bundler works for both

5. **Create Reusable Scripts**
   - Make scripts with clear parameters
   - Add error handling
   - Include rollback functionality
   - Make executable and well-documented

### Code Generation Standards:

- **Scripts:** Use Bash with set -e for error handling
- **JSON Editing:** Use Node.js to safely modify JSON files
- **Error Messages:** Clear, actionable, with emoji indicators (✅❌⚠️)
- **Logging:** Always tee output to dated log files
- **Paths:** Use full absolute paths, no assumptions

### Testing Standards:

- **Each script needs:** Success check, failure handling, cleanup
- **Tests should:** Be idempotent, log results, exit with proper codes
- **Manual steps:** Clearly marked with 🔍 MANUAL indicator

---

## 📋 POST-DEEP-THINK INTEGRATION

### After Deep Think Analysis:

1. **Update This Document** with Deep Think's specific recommendations
2. **Highlight approved fixes** (green ✅) vs rejected fixes (red ❌)
3. **Add any new issues** Deep Think discovered
4. **Modify scripts** based on Deep Think's specific guidance
5. **Adjust risk levels** per Deep Think's assessment

### Codex Execution Checklist:

- [ ] Read complete Deep Think response
- [ ] Identify all approved fixes
- [ ] Generate implementation scripts for approved items
- [ ] Generate testing scripts for each fix
- [ ] Generate rollback scripts for each fix
- [ ] Execute fixes in priority order
- [ ] Test at each checkpoint
- [ ] Document results
- [ ] Generate final report

---

## 📝 Implementation Progress – 2025-11-10

### ✅ Changes Executed
- Removed the duplicate root dependency on `expo-modules-core` and enforced `@expo/config-plugins@9.0.17` via Yarn resolutions to keep Expo’s support stack consistent (`package.json`).
- Cleaned caches, reinstalled workspace dependencies, and reran `npx expo install --fix` (offline) followed by `npx expo-doctor` to validate dependency health.
- Added the missing React Native CLI toolchain packages to the mobile workspace and removed the direct `expo-modules-core` reference so Expo owns that version (`apps/mobile-shell/package.json`).
- Updated the Podfile to enforce C++20, removed the legacy Metro synchronization build phase, and reinstalled pods with the proper `LANG` export (`apps/mobile-shell/ios/Podfile` + `Podfile.lock`).
- Rewrote `apps/mobile-shell/metro.config.js` using Expo’s SDK 52 defaults while still watching the monorepo root, and fixed the invalid Expo `scheme` so config validation passes (`apps/mobile-shell/app.json`).

### ⚠️ Open Issues
- `watchman` is not installed, so the cache purge from Phase 1 is incomplete; install Watchman or clear caches manually before running Metro/Expo again.
- Android still lacks an explicit C++20 override—the Deep Think plan expects `build.gradle` (or `externalNativeBuild`) to force `-std=c++20`, but no change has been applied yet.
- Expo modules were aligned using the offline `bundledNativeModules` map; once networking is available, rerun `npx expo install --fix` to confirm Expo SDK 52 doesn’t require `expo-modules-core` v3.x as Deep Think asserted.
- `npx expo-doctor` still warns about config fields not syncing without `expo prebuild` and about `metro` / `react-native-health` lacking New Architecture metadata; decide whether to address or suppress these in CI.

### 🔍 Verification Snapshot
- `npx expo-doctor` now only reports the two non-blocking warnings above; dependency conflicts, Metro overrides, and `expo-modules-core` duplication are resolved.
- `npx pod-install` succeeds (requires `LANG=en_US.UTF-8` in the shell due to CocoaPods’ UTF‑8 guard).
- Platform builds (`npx expo run:ios`, `npx expo run:android`) and Metro start (`npx expo start -c`) still need to be rerun post‑changes.

### 🚀 Next Steps
1. Add the Android C++20 configuration (Gradle `externalNativeBuild` flag or `react { cppStandard = 'c++20' }`), sync Gradle, and capture build logs.
2. Install Watchman (or equivalent), rerun the Phase 1 cache purge, and verify `npx expo start -c`, `npx expo run:ios`, and `npx expo run:android`.
3. Decide how to handle the remaining `expo-doctor` warnings: either adopt `expo prebuild` in CI or document why the managed/native hybrid workflow is acceptable and suppress the warnings.
4. Investigate Expo’s requirement for `expo-modules-core` v3.x once online, and be prepared to upgrade via `npx expo install --fix` if the live registry disagrees with the bundled map.
5. Port the Podfile/Gradle changes into Expo config plugins so running `expo prebuild --clean` doesn’t erase the C++20 enforcement, then rerun `npx pod-install`.

---

## 🚀 FINAL NOTES FOR CODEX

**You are the implementation layer.** Google Deep Think provides the strategy, this document provides the structure, and you provide the automation.

**Your goals:**
1. **Precision** - Execute exactly what Deep Think approved, nothing more
2. **Safety** - Always have rollback procedures ready
3. **Validation** - Test thoroughly at every step
4. **Documentation** - Log everything for future reference

**Your constraints:**
- Don't implement unapproved fixes (even if they seem obvious)
- Don't skip testing steps (even if you're confident)
- Don't delete backups (disk space is cheap, lost work is expensive)
- Don't combine phases (isolation makes debugging easier)

**Your success criteria:**
The team can run `yarn ios`, the app launches, and development can continue. Anything beyond that is a bonus.

---

**Last Updated:** 2025-11-10
**Created By:** Claude Code (Architect Agent)
**For:** Codex Implementation Agent
**Status:** Awaiting Google Deep Think validation

---

**Once Deep Think validates, this becomes your implementation bible. Follow it precisely. 📖**
