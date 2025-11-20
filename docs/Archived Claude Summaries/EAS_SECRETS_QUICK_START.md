# EAS Secrets Quick Start - 16BitFit V3
**⏱️ Estimated Time:** 10-15 minutes
**Last Updated:** 2025-11-16

---

## ✅ What You Already Have

Your project is **ready for EAS secrets** out of the box:

- ✅ **Expo account:** Logged in as `seanpwins`
- ✅ **EAS CLI:** Version 16.27.0 installed
- ✅ **eas.json:** Build profiles configured (development, preview, production)
- ✅ **App code:** Already uses `process.env.EXPO_PUBLIC_*` variables
- ✅ **Local .env:** Gitignored and secure

---

## 🎯 What You Need To Do

Follow these 3 simple steps to configure your production secrets:

---

### Step 1: Navigate to Project Directory

```bash
cd "/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/apps/mobile-shell"
```

---

### Step 2: Create Supabase URL Secret

```bash
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL
```

**When prompted:**
1. Press **Enter** to confirm the name
2. **Paste your Supabase URL** from your local `.env` file
   - Example: `https://noxwzelpibuytttlgztq.supabase.co`
3. Press **Enter**
4. When asked about environments, select **"shared"** (applies to all build profiles)

---

### Step 3: Create Supabase Anon Key Secret

```bash
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**When prompted:**
1. Press **Enter** to confirm the name
2. **Paste your Supabase anon key** from your local `.env` file
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)
3. Press **Enter**
4. Select **"shared"** for environments

---

### Step 4: Verify Secrets Were Created

```bash
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

✅ **If you see both secrets listed, you're done!**

---

## 🚀 What Happens Next?

### Local Development (No Changes)

Your local development workflow **stays exactly the same**:

```bash
npm start  # Uses your local .env file
```

### Cloud Builds (New Capability)

When you build with EAS, it automatically uses the secrets you just configured:

```bash
# Development build (for testing)
npx eas-cli build --profile development --platform ios

# Production build (for App Store)
npx eas-cli build --profile production --platform ios
```

**Magic:** EAS injects `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` during the build, so your app connects to Supabase without any code changes!

---

## 🔍 How To Get Your Credentials

If you need to copy your Supabase credentials again:

### Option 1: From Your Local .env File

```bash
# View your local .env (contains your rotated keys)
cat /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3/apps/mobile-shell/.env
```

Copy the values for:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: From Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in and select your **16BitFit** project
3. Click **⚙️ Project Settings** (bottom left)
4. Click **API** in the submenu
5. Copy:
   - **Project URL** (under "Configuration")
   - **anon public** key (under "Project API keys")

---

## 🛠️ Common Commands

```bash
# List all secrets
npx eas-cli secret:list --scope project

# View a specific secret value (if you forget it)
npx eas-cli secret:get --scope project --name EXPO_PUBLIC_SUPABASE_URL

# Update a secret (if you rotate credentials)
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --force

# Delete a secret
npx eas-cli secret:delete --scope project --name EXPO_PUBLIC_SUPABASE_URL
```

---

## ❓ Troubleshooting

### "Secret already exists"

If you see this error, it means the secret was already created. To update it:

```bash
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --force
```

The `--force` flag overwrites the existing secret.

---

### "Not logged in to Expo"

```bash
# Check login status
npx eas-cli whoami

# If not logged in
npx eas-cli login
```

---

### "Project not linked to EAS"

```bash
# Initialize EAS project
npx eas-cli init

# Follow the prompts to link your project
```

---

## 📚 Full Documentation

For advanced configurations, environment-specific secrets, and troubleshooting:

**Read:** [docs/EAS_SECRETS_SETUP_GUIDE.md](EAS_SECRETS_SETUP_GUIDE.md)

---

## ✅ Checklist

- [ ] Step 1: Navigate to `apps/mobile-shell` directory
- [ ] Step 2: Create `EXPO_PUBLIC_SUPABASE_URL` secret
- [ ] Step 3: Create `EXPO_PUBLIC_SUPABASE_ANON_KEY` secret
- [ ] Step 4: Verify both secrets appear in `eas secret:list`

**Total time:** ~10 minutes

---

**You're all set! Your production builds will now securely use your Supabase credentials. 🎉**
