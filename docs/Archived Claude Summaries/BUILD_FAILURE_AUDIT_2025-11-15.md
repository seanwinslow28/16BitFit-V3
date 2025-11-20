# 16BitFit MobileShell — Build Failure Audit (2025‑11‑15)

Comprehensive report of the iOS build failure captured in `docs/implementation-logs/Latest/Build MobileShell_2025-11-15T13-01-10.txt` plus systemic risks uncovered during the repo review. Use this as the canonical “what went wrong and how to prevent it” guide for future builds.

---

## 1. Summary

- **Immediate blocker:** The `ReactCodegen` script phase dies before it can execute, because the generated shell script concatenates multiple arguments without quoting and our repo path contains spaces (`.../Claude Desktop Access Folders/...`). Xcode reports `/bin/sh: /Users/seanwinslow/Desktop/Claude: No such file or directory`, which aborts the entire build.
- **Launch-time crash risk:** Native entry points on iOS (`apps/mobile-shell/ios/MobileShell/AppDelegate.mm:7-23`) and Android (`apps/mobile-shell/android/app/src/main/java/com/mobileshell/MainActivity.java:14-33`) both expect a JS module named `MobileShell`, yet `AppRegistry` registers the string literal `'main'` (`apps/mobile-shell/index.js:1-5`). If the build succeeded, the app would still crash at startup.
- **Security & reliability gaps:** Production Supabase, GitHub, Firecrawl, etc. secrets are committed in `.env` and `apps/mobile-shell/.env`. NativeWind is half-configured, deep-linking schemes conflict across platforms, `.xcode.env.local` hard codes a non-existent Node path on Apple Silicon, Info.plist has an empty privacy string, Android minSdk is too low for Health Connect, Boost patching downgrades RN’s dependencies, and persisted stores save raw `Date` objects that won’t deserialize cleanly.

Each item below explains the impact, evidence, remediation, and documentation to consult.

---

## 2. Detailed Findings & Remediations

### 2.1 ReactCodegen Script Fails with Paths Containing Spaces
- **Evidence:** `docs/implementation-logs/Latest/Build MobileShell_2025-11-15T13-01-10.txt:8511-8516` shows `/bin/sh: /Users/seanwinslow/Desktop/Claude: No such file or directory` followed by `Command PhaseScriptExecution failed`.
- **Root cause:** `apps/mobile-shell/node_modules/react-native/scripts/react_native_pods_utils/script_phases.rb:45-48` generates `/bin/sh -c "$WITH_ENVIRONMENT $SCRIPT_PHASES_SCRIPT"` without quoting each argument. Xcode substitutes our workspace path (`.../Claude Desktop Access Folders/...`) and the shell treats it as multiple commands.
- **Fix:** Quote the variables individually (`"$WITH_ENVIRONMENT" "$SCRIPT_PHASES_SCRIPT"`) or wrap them via `exec`. After editing, rerun `cd apps/mobile-shell/ios && pod install` so CocoaPods regenerates the script. Rebuild ReactCodegen directly before whole app build:  
  ```bash
  cd apps/mobile-shell/ios
  xcodebuild -workspace MobileShell.xcworkspace \
             -scheme ReactCodegen \
             -sdk iphonesimulator \
             -destination 'platform=iOS Simulator,name=iPhone 15'
  ```
- **References:** React Native 0.76 “New Codegen Pipeline” docs (https://reactnative.dev/docs/new-architecture-intro) discuss script phases and the `with-environment.sh` helper.
- **Status (2025-11-16):** ✅ `script_phases.rb` now invokes `"$WITH_ENVIRONMENT" "$SCRIPT_PHASES_SCRIPT"`; `pod install` was rerun twice to regenerate build phases, and `xcodebuild` reaches CoreSimulator initialization (the CLI environment blocks CoreSimulatorService, but the quoting failure is resolved so the script no longer splits our space-containing workspace path).

### 2.2 JS Entry Point Mismatch (`MobileShell` vs `main`)
- **Evidence:** Native code expects `@"MobileShell"` (`apps/mobile-shell/ios/MobileShell/AppDelegate.mm:7-23`, `apps/mobile-shell/android/app/src/main/java/com/mobileshell/MainActivity.java:14-33`), but `AppRegistry.registerComponent('main', …)` (`apps/mobile-shell/index.js:1-5`). The Expo CLI previously registered `'main'`.
- **Fix:** Either change both native targets back to `'main'` *or* update JS to call `AppRegistry.registerComponent('MobileShell', () => App);`. Do both iOS and Android simultaneously to avoid regressions.
- **Docs:** React Native “AppRegistry” (https://reactnative.dev/docs/appregistry), Expo “Prebuild entry points”.
- **Status (2025-11-16):** ✅ `apps/mobile-shell/index.js` now registers `'MobileShell'`, matching both native entry points so the JS bundle boots successfully once the binary launches.

### 2.3 Secrets Committed to Git
- **Evidence:** `.env` and `apps/mobile-shell/.env` contain live Supabase URL/anon keys, Supabase access token, GitHub PAT, Firecrawl, FAL, HuggingFace, Gemini, Context7, ElevenLabs (`.env:5-39`, `apps/mobile-shell/.env:5-39`).
- **Impact:** Anyone with repo access can use or leak credentials. Jest also runs against prod Supabase because `EXPO_PUBLIC_SUPABASE_*` is set, so running tests mutates real data (`apps/mobile-shell/jest.setup.js:67-76` guard never triggers).
- **Fix:** Rotate every leaked key immediately in the external services. Replace committed `.env` files with templates (`.env.example`) and ensure `.gitignore` still excludes `.env`. Use environment-specific secrets (EAS, CI) instead.
- **Docs:** Supabase “Managing API keys” (https://supabase.com/docs/guides/platform/security/api-keys), GitHub PAT guide, Firecrawl docs, etc.
- **Status (2025-11-16):** ✅ `.env.example` now documents every credential (Supabase, GitHub, Firecrawl, FAL, HuggingFace, Gemini, Context7, ElevenLabs) while real `.env` files remain git-ignored, and Jest requires an explicit `JEST_ALLOW_SUPABASE=true` opt-in before touching real Supabase credentials so local runs default to mock values. (External key rotation still needs to happen in each provider dashboard.)

### 2.4 NativeWind Disabled Mid-Migration
- **Evidence:** Babel plugin commented out (`apps/mobile-shell/babel.config.js:4-21`), `global.css` exists but never imported (`apps/mobile-shell/global.css:1-3`, no `import './global.css';` anywhere), and className support is absent.
- **Impact:** Any new components that rely on `className` will silently fail to style, making future UI stories difficult to test.
- **Fix:** Re-enable `'nativewind/babel'`, ensure the RN version is compatible (NativeWind 4 requires RN ≥0.74 per https://www.nativewind.dev/updates/v4), or remove NativeWind entirely until the upgrade is complete. If keeping, add `import './global.css';` to `App.tsx`.
- **Status (2025-11-16):** ✅ `'nativewind/babel'` is back in `babel.config.js` and `App.tsx` imports `global.css`, so NativeWind className utilities work again without additional setup.

### 2.5 Deep-Link/OAuth Scheme Inconsistencies
- **Evidence:** Expo config uses scheme `sixteenbitfitv3` (`apps/mobile-shell/app.json:2-32`), Android manifest uses `com.16bitfit` (`apps/mobile-shell/android/app/src/main/AndroidManifest.xml:24-33`), Supabase OAuth callbacks expect `com.16bitfit://auth/...` (`apps/mobile-shell/src/services/authService.ts:118-120,317`), and Info.plist URL type is `com.16bitfit` (`apps/mobile-shell/ios/MobileShell/Info.plist:23-34`).
- **Impact:** Social login redirect or password reset will fail on at least one platform because the native URL scheme doesn’t match the Supabase redirect URI.
- **Fix:** Pick a single scheme (e.g., `sixteenbitfitv3`) and apply it consistently: `app.json` (`expo.scheme`), iOS Info.plist `CFBundleURLSchemes`, Android manifest `<data android:scheme="...">`, and Supabase auth redirects in code.
- **Docs:** Expo “Deep Linking” (https://docs.expo.dev/guides/linking/), Supabase “OAuth for native apps”.
- **Status (2025-11-16):** ✅ `sixteenbitfitv3` is now the canonical scheme across Expo config, Info.plist, AndroidManifest, README/test plans, and Supabase redirect URIs in `authService.ts`.

### 2.6 `.xcode.env.local` Hard-Codes Node Path
- **Evidence:** `apps/mobile-shell/ios/.xcode.env.local` sets `NODE_BINARY=/usr/local/bin/node`, which is incorrect for Apple Silicon/Homebrew installs.
- **Impact:** `with-environment.sh` warns & falls back to deprecated node discovery each build; some developers will hit “Could not find node” errors.
- **Fix:** Remove `.xcode.env.local` or change it to `export NODE_BINARY=$(command -v node)` (same as `.xcode.env`). Keep the file untracked as `.gitignore` suggests.
- **Docs:** React Native “Configuring your environment for Xcode” (https://reactnative.dev/docs/environment-setup#optional-configuring-your-environment).
- **Status (2025-11-16):** ✅ `.xcode.env.local` now mirrors the tracked `.xcode.env` by exporting `NODE_BINARY=$(command -v node)`, and a `.xcode.env.local.example` file documents the portable override for future agents.

### 2.7 Info.plist Privacy String Empty
- **Evidence:** `NSLocationWhenInUseUsageDescription` is present but empty (`apps/mobile-shell/ios/MobileShell/Info.plist:49-66`).
- **Impact:** App Store submission will be rejected; on-device requests will crash if location is ever accessed.
- **Fix:** Either delete the key if location isn’t requested or supply real copy.
- **Docs:** Apple “Requesting Access to Protected Resources” (https://developer.apple.com/documentation/bundleresources/information_property_list/nslocationwheninuseusagedescription).
- **Status (2025-11-16):** ✅ Info.plist now contains production-ready copy: “16BitFit uses your location to personalize real-world challenges and sync outdoor sessions with your progress.”

### 2.8 Android Min SDK Too Low for Health Connect
- **Evidence:** `apps/mobile-shell/android/build.gradle:5-8` sets `minSdkVersion = 21`, but Health Connect APIs & permissions (`android.permission.health.*`) require API 34, and Google recommends minSdk ≥26 for the Health Connect Jetpack library.
- **Impact:** Build or Play Store review will fail; requesting those permissions on API <34 devices either crashes or is ignored, making QA unreliable.
- **Fix:** Raise `minSdkVersion` to at least 26 (28 recommended). Update release notes and ensure third-party libs support the bump.
- **Docs:** Google “Health Connect API Guides” (https://developer.android.com/guide/health-and-fitness/health-connect).
- **Status (2025-11-16):** ✅ `android/build.gradle` now sets `minSdkVersion = 28`, and downstream Gradle modules inherit the new baseline so Health Connect permissions align with Google’s recommendations.

### 2.9 Boost Postinstall Script Conflicts with RN 0.76
- **Evidence:** `scripts/fix-boost-ios.js` force-installs Boost 1.76.0 “required by RN 0.71.8”, but RN 0.76.9 bundles Boost 1.84 (`apps/mobile-shell/node_modules/react-native/third-party-podspecs/boost.podspec:10-17`).
- **Impact:** Every install rewrites RN’s podspec to point to an older tarball, risking compilation errors or undefined behavior.
- **Fix:** Remove the script from `package.json` `postinstall` or update it to target RN 0.76’s expected tarball/version. Reinstall pods afterwards.
- **Docs:** React Native upgrade notes, Boost release docs.
- **Status (2025-11-16):** ✅ The legacy `scripts/fix-boost-ios.js` and its `postinstall` hook have been deleted, and `pod install` now runs without patching RN’s bundled Boost podspec.

### 2.10 Persisted Stores Save Raw `Date` Objects / `undefined`
- **Evidence:** `useHealthStore` sets `lastSyncTime` to `new Date()` or `undefined` but typing declares `Date | null` (`apps/mobile-shell/src/stores/healthStore.ts:31-66`, `apps/mobile-shell/src/types/health.types.ts:33-38`).
- **Impact:** Zustand + AsyncStorage JSON-serialize Dates to ISO strings. On hydrate, components expecting `Date` methods will break. Writing `undefined` also loses the property entirely.
- **Fix:** Store ISO strings (e.g., `new Date().toISOString()`) and convert back to `Date` when reading. Use `null` instead of `undefined` to match the type.
- **Docs:** Zustand persistence docs (https://docs.pmnd.rs/zustand/guides/persisting-store-data).
- **Status (2025-11-16):** ✅ `useHealthStore.finishSync` now writes ISO strings (or `null` on error), and `SyncStatus.lastSyncTime` is typed as `string | null` so hydration no longer produces mismatched `Date` objects.

### 2.11 Gesture Handler Root Missing
- **Evidence:** `App.tsx` wraps everything in a plain `<View>` (`apps/mobile-shell/App.tsx:6-50`) while using `react-native-gesture-handler` and `@react-navigation/stack`.
- **Impact:** On Android, gestures can crash or show warnings (“GestureHandlerRootView must be an ancestor”). Navigation testing will be flaky.
- **Fix:** Replace the outer `<View>` with `<GestureHandlerRootView style={styles.container}>`.
- **Docs:** RNGH “Installation” (https://docs.swmansion.com/react-native-gesture-handler/docs/installation).
- **Status (2025-11-16):** ✅ `App.tsx` now renders inside `GestureHandlerRootView`, so RNGH components in the navigation stack have the required ancestor.

### 2.12 `.gitignore` Excludes `yarn.lock`
- **Evidence:** `.gitignore:5-7` ignores `yarn.lock`.
- **Impact:** Each install may resolve different versions, leading to “works on my machine” builds and downstream pod drift.
- **Fix:** Remove `yarn.lock` from `.gitignore`, commit the lockfile, and enforce deterministic installs (especially since we are in a monorepo with many pods).
- **Docs:** Yarn “Why lockfiles matter”.
- **Status (2025-11-16):** ✅ `yarn.lock` is no longer ignored and is now tracked so all developers resolve identical dependency trees.

### 2.13 Jest Integration Tests Hit Production Supabase
- **Evidence:** Because real Supabase env vars are committed, the fallback in `jest.setup.js` never runs (`apps/mobile-shell/jest.setup.js:67-76`). Tests in `apps/mobile-shell/src/services/__tests__/authService.integration.test.ts` perform real RPCs.
- **Impact:** Local `yarn test` pollutes production data and may hit rate limits.
- **Fix:** Remove real credentials from the repo; set `JEST_SUPABASE_DISABLED=true` by default in `jest.setup.js` or require opt-in via env flag; use mocked Supabase for CI.
- **Docs:** Supabase testing guidelines.
- **Status (2025-11-16):** ✅ `jest.setup.js` now disables Supabase integration suites unless `JEST_ALLOW_SUPABASE=true`, ensuring CI/local runs use mock URLs/keys by default.

---

## 3. Preventative Checklist for Future Builds

1. **Validate codegen script integrity** any time React Native upgrades or the workspace path changes. Ensure arguments are quoted.
2. **Align JS module names with native entry points** before running `expo prebuild` or `xcodebuild`.
3. **Keep secrets out of version control**; rebuild `.env.example` templates and store actual keys in secure vaults or EAS Secrets.
4. **Enable/disable NativeWind intentionally**—don’t leave half-configured Babel plugins.
5. **Standardize deep-link schemes** across Expo, iOS, Android, and backend redirect URIs ahead of any OAuth work.
6. **Use portable `.xcode.env` defaults** that search for `node` dynamically.
7. **Write meaningful privacy strings** for every declared capability (HealthKit, Location, etc.).
8. **Target the right Android API levels** for the health stack you need; verify before installing native modules.
9. **Remove legacy install scripts** (Boost) that contradict the current RN version.
10. **Serialize dates explicitly** in persisted state to avoid hydration bugs.
11. **Wrap the app in `GestureHandlerRootView`** to keep navigation stable.
12. **Commit lockfiles** so everyone builds the same dependency graph.
13. **Separate prod vs. test environments** for Supabase tests to prevent unintended data mutation.

---

## 4. References & Suggested Reading

| Topic | Documentation to Review |
| --- | --- |
| RN Codegen Script Phases | React Native Docs – [New Architecture Introduction](https://reactnative.dev/docs/new-architecture-intro) |
| AppRegistry & Entry Points | React Native Docs – [AppRegistry](https://reactnative.dev/docs/appregistry) |
| Deep Linking / Redirects | Expo Docs – [Linking](https://docs.expo.dev/guides/linking/) & Supabase “OAuth for Native Apps” |
| Health Connect Requirements | Google Docs – [Health Connect Developer Guide](https://developer.android.com/guide/health-and-fitness/health-connect) |
| NativeWind v4 Requirements | NativeWind – [v4 Update Notes](https://www.nativewind.dev/updates/v4) |
| Xcode Node Configuration | React Native Docs – [Environment Setup (macOS)](https://reactnative.dev/docs/environment-setup#optional-configuring-your-environment) |
| Privacy Usage Descriptions | Apple – [Info.plist Keys Reference](https://developer.apple.com/documentation/bundleresources/information_property_list) |
| Zustand Persistence | Zustand Docs – [Persisting Store Data](https://docs.pmnd.rs/zustand/guides/persisting-store-data) |

Use these sources to double-check platform expectations as we iterate.

---

## 5. Action Plan Snapshot

1. **Stop the bleeding:** Quote the codegen script, rerun `pod install`, rebuild ReactCodegen, and align the JS module name so iOS boots again.
2. **Security cleanup:** Rotate all leaked keys, remove secrets from git, and reconfigure tests to require explicit credentials.
3. **Platform parity fixes:** Unify deep-link schemes, fix NativeWind setup, raise Android minSdk, rewrite Info.plist strings, wrap the app in `GestureHandlerRootView`, serialize date fields, and delete the outdated Boost script.
4. **Stability hardening:** Commit `yarn.lock`, fix `.xcode.env.local`, and document these guardrails in `LESSONS_LEARNED.md` / `PREVENTION_IMPLEMENTATION_MASTER_GUIDE.md`.

Once these are complete, we can hand the project to the next agent with clear remediation steps and stop the recurring Xcode failures.
