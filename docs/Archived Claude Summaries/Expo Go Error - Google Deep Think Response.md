This comprehensive plan addresses the Expo dev server startup issues in your React Native 0.77.3 monorepo by resolving dependency conflicts, correcting the Metro configuration for isolated workspaces, and ensuring compatibility with Expo SDK 52\.

### **1\. Root Cause Analysis**

The issues stem from how npm workspaces handle dependency hoisting in a monorepo structure.

1. **React Version Conflict & Hoisting:** React Native 0.77.3 (and Expo SDK 52\) strictly requires `react@18.3.1`. Your monorepo root uses `react@19.2.0`. Npm "hoists" dependencies to the root `node_modules/` by default. The Metro bundler incorrectly resolves the incompatible, hoisted React 19.2.0 when bundling `mobile-shell`.  
2. **Metro Module Error (`TerminalReporter`):** The error `Cannot find module 'metro/src/lib/TerminalReporter'` occurs due to a version mismatch between `@expo/cli` and the resolved `metro` package. Incorrect hoisting causes the wrong version of Metro to be loaded, breaking internal paths required by the CLI.  
3. **Testing Library Conflict:** `@testing-library/react-hooks@8.0.1` is deprecated, incompatible with React 18+, and causes peer dependency conflicts.  
4. **Monorepo Configuration:** Metro was not configured to correctly watch the entire workspace (like `packages/ui-components`) and resolve dependencies appropriately in a monorepo environment.

### **2\. Step-by-Step Fix Plan**

We will use npm's `hoistingLimits` feature to isolate the `mobile-shell` dependencies. This allows the root to maintain React 19.2.0 while ensuring `mobile-shell` uses React 18.3.1.

**Execute all commands from the monorepo root (`16BitFit-V3/`) unless otherwise specified.**

#### **Step 1: Cleanup**

Start with a completely clean installation state.

Bash  
echo "Cleaning dependencies, lock files, and Pods..."

\# Remove all node\_modules in the workspace efficiently  
find . \-name "node\_modules" \-type d \-prune \-exec rm \-rf '{}' \+

\# Remove root lock file  
rm \-f package-lock.json

\# Clean iOS Pods  
cd apps/mobile-shell/ios  
\# Use pod deintegrate if CocoaPods is installed, otherwise just remove Pods/Lockfile  
if command \-v pod \> /dev/null; then  
  pod deintegrate  
fi  
rm \-rf Pods Podfile.lock

\# Navigate back to the monorepo root  
cd ../../..

#### **Step 2: Configure Dependency Isolation**

Modify the `mobile-shell` configuration to prevent its dependencies from being hoisted.

1. **Edit `16BitFit-V3/apps/mobile-shell/package.json`:** Add the `installConfig` block.

JSON  
// 16BitFit-V3/apps/mobile-shell/package.json  
{  
  "name": "mobile-shell",  
  // ... (dependencies, devDependencies, etc.)  
  "private": true,  
  // Add this configuration block:  
  "installConfig": {  
    "hoistingLimits": "workspaces"  
  }  
}

#### **Step 3: Resolve Testing Library Conflicts**

Remove the deprecated package and update the core testing library.

**Run these commands from the monorepo root:**  
Bash  
npm uninstall @testing-library/react-hooks \--workspace=apps/mobile-shell  
npm install @testing-library/react-native@latest \--save-dev \--workspace=apps/mobile-shell

1.   
2. **Action Required (Code Refactor):** Update any test files that used the old package: *Change from:* `import { renderHook } from '@testing-library/react-hooks';` *To:* `import { renderHook } from '@testing-library/react-native';`

#### **Step 4: Configure Metro for the Monorepo**

When using `hoistingLimits`, Metro must be explicitly configured to resolve modules correctly.

1. **Update (or create) `16BitFit-V3/apps/mobile-shell/metro.config.js`:**

JavaScript  
// 16BitFit-V3/apps/mobile-shell/metro.config.js  
const { getDefaultConfig } \= require('expo/metro-config');  
const path \= require('path');

// Find the project and workspace roots  
const projectRoot \= \_\_dirname;  
// This resolves to the monorepo root (../../ from apps/mobile-shell)  
const workspaceRoot \= path.resolve(projectRoot, '../..');

// Create the default Expo config  
const config \= getDefaultConfig(projectRoot);

// 1\. Watch all files within the monorepo (including shared packages)  
config.watchFolders \= \[workspaceRoot\];

// 2\. Let Metro know where to resolve packages (required for hoistingLimits)  
config.resolver.nodeModulesPaths \= \[  
  path.resolve(projectRoot, 'node\_modules'), // local node\_modules  
  path.resolve(workspaceRoot, 'node\_modules'), // root node\_modules  
\];

// 3\. Force Metro to resolve dependencies only from these specific locations.  
// This is CRUCIAL when using \`hoistingLimits\` to prevent conflicts.  
config.resolver.disableHierarchicalLookup \= true;

module.exports \= config;

#### **Step 5: Install Dependencies and Fix Versions**

Perform the installation and use Expo CLI to align the isolated dependencies.

Bash  
\# From the monorepo root (16BitFit-V3/)

\# 1\. Install dependencies (this respects hoistingLimits)  
npm install

\# 2\. Navigate to the mobile shell  
cd apps/mobile-shell

\# 3\. Fix the isolated dependencies (The TerminalReporter Fix)  
\# This ensures the correct versions of Metro and @expo/cli are installed locally.  
npx expo install \--fix

#### **Step 6: Verification and Pod Installation**

Bash  
\# Still in apps/mobile-shell

\# Verification Check (Optional but Recommended):  
echo "Verifying React version isolation..."  
echo "Mobile-shell React version (should be 18.3.1):"  
npm list react \--depth=0  
echo "Root React version (should be 19.2.0):"  
(cd ../.. && npm list react \--depth=0)

\# Install iOS Pods  
npx pod-install

#### **Step 7: Start the Dev Server**

Bash  
\# Still in apps/mobile-shell  
\# Start the server, clearing the cache  
npx expo start \--ios \--clear

### **3\. Configuration Updates**

The key configuration updates performed above are:

* **`apps/mobile-shell/package.json`**: Added `"installConfig": { "hoistingLimits": "workspaces" }` and resolved testing library dependencies.  
* **`apps/mobile-shell/metro.config.js`**: Updated for monorepo support with `watchFolders`, `nodeModulesPaths`, and `disableHierarchicalLookup: true`.

**(Optional) Fixing `app.json` Warning:** To fix the `Warning: Root-level "expo" object found...`, ensure your `app.json` structure is correct.

JSON  
// apps/mobile-shell/app.json  
{  
  "expo": {  
    "name": "16BitFit-V3",  
    "slug": "16bitfit-v3",  
    // ... all other settings (ios, android, plugins like expo-font)  
  }  
  // Ensure "name" or "displayName" are NOT present here at the root level.  
}

### **4\. Validation Steps**

1. **Expo Dev Server:** Verify that `npx expo start --ios --clear` runs without the `TerminalReporter` error or React version conflicts.  
2. **Expo Go Connection:** The iOS simulator (16BitFit-Testing-iPhone13) should launch Expo Go and successfully bundle the application.  
3. **Custom Fonts:** Visually confirm that "Press Start 2P" and "Montserrat" fonts are rendered correctly (supported via `expo-font` in Expo Go).  
4. **Hot Reload:** Edit a file in `apps/mobile-shell/src` AND a file in `packages/ui-components`. The simulator should update instantly for both changes.  
5. **Tests:** Run `npm test` in `apps/mobile-shell` to ensure tests still pass (after migrating `renderHook` imports).  
6. **Native Builds:** Verify the project still builds successfully when opened in Xcode.

### **5\. Alternative Approaches**

**Alternative 1: Global React Downgrade** We could have downgraded the root `package.json` to React 18.3.1. We chose `hoistingLimits` instead because it provides better isolation, allowing the rest of the monorepo (e.g., a potential web app) to continue using React 19.2.0, making the solution more robust for complex monorepos.

**Alternative 2: Expo Dev Client vs. Expo Go**

* **Expo Go (Current Plan):** Best for rapid iteration when using only Expo SDK modules.  
* **`expo-dev-client`:** A custom development build required if you introduce custom native code or libraries not included in the Expo SDK.

**Recommendation:** Stick with Expo Go. Your project requirements are fully compatible, and Expo Go offers the fastest development experience.

