# React Native 0.76 / Expo SDK 52 Alignment Plan

**Owner:** Codex  
**Date:** 2025-11-16  
**Status:** Draft – execute before touching more native dependencies.

## Goals
- Move the bare Expo app to the React Native version that Expo SDK 52 expects (0.76.x).
- Keep Hermes/Metro artifacts in sync with the runtime bundled in Pods.
- Reduce churn during the upgrade by sequencing codegen, iOS Pods, and Android Gradle updates.

## Prerequisites
1. Regenerate lockfiles so we have reproducible installs (`yarn install` from repo root).
2. Capture a clean build log on the current RN 0.75.4 stack for regression comparison.
3. Ensure local Node >= 18.18 and Ruby >= 3.1 for new CocoaPods templates.

## Step-by-step
1. **Update package manifests**
   - `apps/mobile-shell/package.json`:
     - Set `"react-native": "0.76.2"` (matching the Expo 52 release tag).
     - Keep `react` pinned to `18.3.1`.
     - Run `npx expo install react-native` to let Expo pick the exact semver if they bump the patch.
     - Reinstall dependent packages via `npx expo install react-native-gesture-handler react-native-screens react-native-safe-area-context react-native-reanimated`.
   - Root `package.json`:
     - Align `"metro-hermes-compiler"` to `0.76.2` so CLI bundles are compatible with the Hermes runtime shipped through Pods.
2. **Regenerate native artifacts**
   - `cd apps/mobile-shell/ios && pod install`
   - `cd apps/mobile-shell/android && ./gradlew clean`.
3. **Codegen sanity check**
   - `xcodebuild -workspace MobileShell.xcworkspace -scheme ReactCodegen -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15'`
   - `./gradlew :ReactAndroid:installArchives` (verifies new Hermes AARs resolve).
4. **Fix breaking API changes**
   - Adopt the RN 0.76 `PermissionsAndroid` typing changes.
   - Update any `PlatformColor` imports flagged by TypeScript.
   - Run `npx @react-native-community/cli doctor` to confirm template settings.
5. **Update lint/test configs**
   - Re-run `yarn lint` and `yarn test`.
   - Update Jest mocks if necessary for the newer React Native renderer.
6. **Smoke test**
   - `expo run:ios` / `expo run:android` on simulators.
   - Archive build (`xcodebuild -scheme MobileShell -configuration Release`).
   - `./gradlew assembleRelease`.

## Hermes / Metro follow-up
- Add a CI task that validates `node_modules/.bin/metro-hermes-compiler --version` matches the Hermes version printed in `ios/Podfile.lock` (`hermes-engine (0.76.x)`).
- Document in `README.md` that whenever `expo install react-native@latest` is run, you must re-run `yarn add -D metro-hermes-compiler@<matching version>`.

## Risks
- Native dependencies compiled against RN 0.75 headers may need patches (e.g., `react-native-health`).
- AGP 8.4 requires Gradle 8.7; ensure CI images support it before merging.
- Expo SDK 52 introduces new CLI validations that can fail if `.expo` cache is stale – run `rm -rf apps/mobile-shell/.expo` prior to the first build.
