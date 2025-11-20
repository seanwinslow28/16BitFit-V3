# EAS Secrets Setup Guide - 16BitFit V3
**Last Updated:** 2025-11-16
**Author:** Claude (Architect Agent)

---

## Table of Contents
1. [Overview](#overview)
2. [Understanding EAS Secrets](#understanding-eas-secrets)
3. [Prerequisites](#prerequisites)
4. [Required Secrets](#required-secrets)
5. [Step-by-Step Setup](#step-by-step-setup)
6. [Build Profile Configuration](#build-profile-configuration)
7. [Testing Your Setup](#testing-your-setup)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

This guide will walk you through configuring **Expo Application Services (EAS) Secrets** for your 16BitFit V3 mobile app. EAS Secrets allow you to securely manage environment variables for production builds without committing sensitive data to git.

**What you'll accomplish:**
- ✅ Configure separate secrets for development, preview, and production environments
- ✅ Securely inject Supabase credentials into production builds
- ✅ Keep your local `.env` files separate from cloud build configurations
- ✅ Enable different configurations per build profile

---

## Understanding EAS Secrets

### What Are EAS Secrets?

EAS Secrets are environment variables stored securely in Expo's cloud infrastructure and injected into your app during the build process.

**Key Concepts:**

| Concept | Description | Example |
|---------|-------------|---------|
| **Secret** | A key-value pair stored in EAS | `EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co` |
| **Scope** | Where the secret is available | `project` (all builds) or `account` (all projects) |
| **Build Profile** | Different build configurations | `development`, `preview`, `production` |
| **Channel** | OTA update distribution channel | Matches build profile names |

### How EAS Secrets Work

```
┌─────────────────┐
│   Your .env     │  ← Local development only
│  (gitignored)   │
└─────────────────┘

┌─────────────────┐
│  EAS Secrets    │  ← Cloud builds (production)
│  (in Expo cloud)│
└─────────────────┘

Build Process:
1. EAS reads eas.json build profile
2. Injects secrets from Expo cloud
3. Compiles app with environment variables
4. Outputs signed binary (IPA/APK/AAB)
```

### Local .env vs EAS Secrets

| Feature | Local .env | EAS Secrets |
|---------|-----------|-------------|
| **Used for** | Local development (`npm start`) | Cloud builds (`eas build`) |
| **Security** | Gitignored, on your machine | Encrypted in Expo cloud |
| **Access** | Only you | Anyone with Expo account access |
| **Updates** | Edit file directly | Use `eas secret:create` CLI |
| **Per-environment** | Manual env file swaps | Automatic per build profile |

---

## Prerequisites

### 1. Expo Account
- ✅ You're logged in as: `seanpwins`
- Verify: `npx eas-cli whoami`

### 2. EAS CLI Installed
- ✅ Version: 16.27.0+
- Install: `npm install -g eas-cli`

### 3. Project Configuration
- ✅ `app.json` configured with bundle IDs
- ✅ `eas.json` created with build profiles

### 4. API Credentials Ready
You'll need your rotated credentials from `.env`:
- Supabase URL
- Supabase Anon Key

---

## Required Secrets

### For Production Builds

These are the **minimum required** secrets for your app to function:

| Secret Name | Value Source | Public? | Description |
|-------------|-------------|---------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | ✅ Yes | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API | ✅ Yes | Anon/public key (safe to embed) |

**Note:** The `EXPO_PUBLIC_` prefix makes these variables accessible in your React Native code via `process.env`.

### Optional Secrets (Future Features)

These are for advanced features you may add later:

| Secret Name | When Needed | Description |
|-------------|-------------|-------------|
| `EXPO_PUBLIC_FAL_KEY` | Sprite generation | FAL.ai API key |
| `EXPO_PUBLIC_ELEVENLABS_API_KEY` | Audio generation | ElevenLabs API key |
| `EXPO_PUBLIC_GEMINI_API` | AI features | Google Gemini API key |

**Important:** Only the Supabase credentials are needed right now. Add others as you implement those features.

---

## Step-by-Step Setup

### Method 1: Interactive Setup (Recommended for Beginners)

This method uses an interactive prompt to guide you through the process.

#### Step 1: Create Secrets Interactively

```bash
# Navigate to mobile-shell directory
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3/apps/mobile-shell

# Create Supabase URL secret
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL

# When prompted:
# 1. Press Enter to confirm the name
# 2. Paste your Supabase URL (e.g., https://xxx.supabase.co)
# 3. Press Enter
# 4. Select "shared" when asked about environments
```

```bash
# Create Supabase Anon Key secret
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY

# When prompted:
# 1. Press Enter to confirm the name
# 2. Paste your Supabase anon key (eyJhbGc...)
# 3. Press Enter
# 4. Select "shared" when asked about environments
```

#### Step 2: Verify Secrets Were Created

```bash
# List all secrets for this project
npx eas-cli secret:list --scope project
```

**Expected Output:**
```
┌────────────────────────────────────┬────────────┬────────────────────────────────┐
│ Name                               │ Updated at │ Environments                   │
├────────────────────────────────────┼────────────┼────────────────────────────────┤
│ EXPO_PUBLIC_SUPABASE_URL           │ 2 min ago  │ development, preview, production│
│ EXPO_PUBLIC_SUPABASE_ANON_KEY      │ 1 min ago  │ development, preview, production│
└────────────────────────────────────┴────────────┴────────────────────────────────┘
```

---

### Method 2: Non-Interactive Setup (Advanced)

If you prefer to set secrets without interactive prompts:

```bash
# Set secrets directly from your local .env file
# WARNING: This requires your .env to be present and correctly formatted

cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3/apps/mobile-shell

# Option A: Push all secrets from .env file
npx eas-cli secret:push --scope project --environment-name production

# Option B: Set individual secrets with values
npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://your-project.supabase.co" \
  --type string

npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_ANON_KEY \
  --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --type string
```

---

### Method 3: Environment-Specific Secrets

If you want **different Supabase instances** for dev/preview/production:

```bash
# Development environment (uses staging Supabase)
npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://staging-project.supabase.co" \
  --environment-name development

# Production environment (uses production Supabase)
npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://prod-project.supabase.co" \
  --environment-name production
```

**For most projects, shared secrets (Method 1) are sufficient.**

---

## Build Profile Configuration

Your `eas.json` is configured with three build profiles:

### Development Profile

**Purpose:** Internal testing, debugging
**Distribution:** Internal (TestFlight, Firebase App Distribution)
**Environment:** Uses development secrets (or shared if not specified)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    }
  }
}
```

**Build command:**
```bash
npx eas-cli build --profile development --platform ios
```

---

### Preview Profile

**Purpose:** QA testing, stakeholder demos
**Distribution:** Internal
**Environment:** Uses preview secrets (or shared if not specified)

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    }
  }
}
```

**Build command:**
```bash
npx eas-cli build --profile preview --platform android
```

---

### Production Profile

**Purpose:** App Store / Play Store submission
**Distribution:** Store
**Environment:** Uses production secrets

```json
{
  "build": {
    "production": {
      "distribution": "store",
      "channel": "production",
      "autoIncrement": true
    }
  }
}
```

**Build command:**
```bash
npx eas-cli build --profile production --platform all
```

---

## Testing Your Setup

### Test 1: Verify Secrets Exist

```bash
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3/apps/mobile-shell

# List all project secrets
npx eas-cli secret:list --scope project

# Check if specific secret exists
npx eas-cli secret:get --scope project --name EXPO_PUBLIC_SUPABASE_URL
```

**Expected:** Both Supabase secrets should appear in the list.

---

### Test 2: Dry-Run Build Configuration

```bash
# Check what environment variables will be injected (doesn't actually build)
npx eas-cli build:configure

# Or inspect a specific profile
npx eas-cli config --profile production --type build
```

---

### Test 3: Actual Build (Optional - Costs Credits)

⚠️ **Warning:** EAS builds consume build credits. Free tier includes limited builds per month.

```bash
# Start a development build for iOS simulator (faster, cheaper)
npx eas-cli build --profile development --platform ios

# Monitor build progress at: https://expo.dev/accounts/seanpwins/projects/16bitfit-v3/builds
```

**Build process:**
1. EAS clones your latest git commit
2. Injects secrets based on build profile
3. Runs `npm install` and `pod install`
4. Compiles iOS/Android binary
5. Uploads to EAS servers
6. Provides download link

---

## Troubleshooting

### Issue 1: "Secret not found" during build

**Symptom:**
```
❌ Error: Secret "EXPO_PUBLIC_SUPABASE_URL" not found for project
```

**Solution:**
```bash
# Verify secret exists
npx eas-cli secret:list --scope project

# If missing, create it
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL
```

---

### Issue 2: App crashes on launch after EAS build

**Symptom:**
App builds successfully but crashes immediately on device.

**Likely Cause:**
Environment variables are `undefined` in the app code.

**Debug:**
```bash
# Check build logs for environment variable injection
npx eas-cli build:view [BUILD_ID]

# Verify your app.json extra config (if using expo-constants)
# File: apps/mobile-shell/app.json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

**Solution:**
Ensure your code uses `process.env.EXPO_PUBLIC_*` variables (already configured in `supabaseClient.ts`).

---

### Issue 3: Different values in development vs production

**Symptom:**
Local `npm start` works, but EAS build connects to wrong Supabase instance.

**Cause:**
EAS Secrets override local `.env` file during cloud builds.

**Solution:**
- **Development (local):** Use `.env` file (gitignored)
- **Cloud builds:** Use EAS Secrets
- To test cloud build behavior locally, temporarily comment out `.env` and rely on EAS secrets (not recommended for daily dev)

---

### Issue 4: "Project not linked to EAS"

**Symptom:**
```
❌ Error: This project is not linked to EAS
```

**Solution:**
```bash
# Initialize EAS project (if not done already)
npx eas-cli init

# Or link to existing EAS project
npx eas-cli project:init
```

---

## Best Practices

### 1. Use Shared Secrets for Single Supabase Instance

If you're using the same Supabase project across all environments:
```bash
# Create once, available everywhere
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL
# Select "shared" when prompted
```

### 2. Use Environment-Specific Secrets for Separate Instances

If you have staging and production Supabase projects:
```bash
# Staging Supabase for development/preview
npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://staging.supabase.co" \
  --environment-name development

# Production Supabase for production builds
npx eas-cli secret:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://prod.supabase.co" \
  --environment-name production
```

### 3. Never Commit Secrets to Git

✅ **Do:**
- Store secrets in EAS
- Use `.env.example` as templates
- Add `.env` to `.gitignore`

❌ **Don't:**
- Commit `.env` files
- Hardcode credentials in code
- Share secrets in Slack/email

### 4. Rotate Secrets Regularly

**Schedule:** Every 90 days (next rotation: February 16, 2026)

**Process:**
```bash
# 1. Generate new credentials in Supabase dashboard
# 2. Update local .env file
# 3. Update EAS secrets
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --force
# (--force flag overwrites existing secret)

# 4. Rebuild production app
npx eas-cli build --profile production --platform all
```

### 5. Use Least-Privilege Keys

- ✅ Use `anon` key for client apps (already doing this)
- ❌ Never use `service_role` key in React Native code
- ✅ Implement Row Level Security (RLS) in Supabase
- ✅ Enable 2FA on your Expo account

### 6. Monitor Secret Access

**Expo dashboard:** https://expo.dev/accounts/seanpwins/settings/access-tokens

- Review who has access to your Expo project
- Remove former team members
- Use access tokens for CI/CD instead of personal accounts

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3/apps/mobile-shell

# Create secret (interactive)
npx eas-cli secret:create --scope project --name SECRET_NAME

# Create secret (non-interactive)
npx eas-cli secret:create --scope project --name SECRET_NAME --value "secret-value"

# List all secrets
npx eas-cli secret:list --scope project

# Get specific secret value
npx eas-cli secret:get --scope project --name SECRET_NAME

# Delete secret
npx eas-cli secret:delete --scope project --name SECRET_NAME

# Update existing secret (overwrite)
npx eas-cli secret:create --scope project --name SECRET_NAME --value "new-value" --force

# Build with specific profile
npx eas-cli build --profile production --platform ios
npx eas-cli build --profile production --platform android
npx eas-cli build --profile production --platform all

# View build status
npx eas-cli build:list
npx eas-cli build:view [BUILD_ID]
```

---

## Next Steps

After configuring EAS secrets:

1. **Test a development build:**
   ```bash
   npx eas-cli build --profile development --platform ios
   ```

2. **Set up automatic builds (optional):**
   - Configure GitHub Actions to trigger builds on push
   - See: https://docs.expo.dev/eas/build/building-on-ci/

3. **Configure OTA updates (optional):**
   ```bash
   npx eas-cli update --channel production --message "Initial production update"
   ```

4. **Prepare for App Store submission:**
   - Update `eas.json` submit config with your Apple ID
   - Generate app icons and splash screens
   - Write App Store description and screenshots

---

## Related Documentation

- **Expo EAS Secrets:** https://docs.expo.dev/eas/environment-variables/
- **EAS Build:** https://docs.expo.dev/eas/build/
- **Supabase React Native Guide:** https://supabase.com/docs/guides/getting-started/quickstarts/react-native
- **16BitFit Security Audit:** [docs/SECURITY_AUDIT_2025-11-16.md](SECURITY_AUDIT_2025-11-16.md)

---

## Support

**Issue Tracker:** https://github.com/seanwinslow28/16BitFit-V3/issues
**Expo Forums:** https://forums.expo.dev
**Supabase Discord:** https://discord.supabase.com

---

**Last Updated:** 2025-11-16
**Maintained by:** Sean Winslow / Claude Architect Agent
