# 🗂️ External Drive File Copy Checklist

**Purpose:** Files to copy from laptop to external drive for desktop migration
**Date Created:** 2025-10-31
**Project:** 16BitFit V3

---

## ⚠️ CRITICAL FILES (REQUIRED)

### 1. `.env` File - **MANDATORY**

**Location on Laptop:**
```
/Users/seanwinslow/Desktop/16BitFit-V3/.env
```

**Copy Command:**
```bash
# Create directory on external drive
mkdir -p /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/

# Copy .env file
cp /Users/seanwinslow/Desktop/16BitFit-V3/.env \
   /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env
```

**Why Critical:**
- Contains all API keys and secrets
- Supabase URL and keys
- GitHub token
- Firecrawl API key
- Figma token
- Context7 API key

**Size:** ~1KB

**Note:** ⚠️ THIS IS THE MOST IMPORTANT FILE - Without it, the project won't work!

---

## 📋 OPTIONAL FILES (Recommended)

### 2. MIGRATION_STAGING Directory - **Optional Reference**

**Location on Laptop:**
```
/Users/seanwinslow/Desktop/16BitFit-V3/docs/archive/MIGRATION_STAGING/
```

**Copy Command:**
```bash
# Create directory on external drive
mkdir -p /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/

# Copy MIGRATION_STAGING
cp -r /Users/seanwinslow/Desktop/16BitFit-V3/docs/archive/MIGRATION_STAGING \
      /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/
```

**Why Useful:**
- Contains 127 sprite assets from V2 (~60MB)
- Contains 15 audio files from V2 (~5MB)
- Reference code from V2 (27 critical files)
- AI generation scripts you may want to reuse
- Database schema from V2

**Size:** 139MB

**Contents:**
- `01_CRITICAL_INNOVATIONS/` - Bridge code, combat system
- `02_SPRITE_ASSETS/` - Boss sprites, character sprites, UI
- `03_AUDIO_ASSETS/` - 15 MP3 sound effects
- `04_AI_GENERATION/` - AI sprite generation scripts
- `05_DATABASE_SCHEMA/` - Old SQL migrations
- `06_AGENT_CONFIGS/` - Old V2 agent configs
- `07_DOCUMENTATION/` - V2 technical docs

**Note:** This directory is excluded from git but kept locally for reference

---

## 🚫 FILES NOT NEEDED (Will Regenerate on Desktop)

### DO NOT COPY These:

❌ **node_modules/** (~1.0GB)
- Reason: Will reinstall with `npm install`
- Command on desktop: `npm install`

❌ **apps/mobile-shell/ios/Pods/** (~1.7GB)
- Reason: Will reinstall with `pod install`
- Command on desktop: `cd apps/mobile-shell/ios && pod install`

❌ **.nx/cache/** (varies)
- Reason: Auto-regenerates when you run Nx commands
- No action needed

❌ **build/ or dist/ directories** (if any)
- Reason: Regenerate with builds
- Command on desktop: `npm run build`

❌ **iOS Build logs** (*.txt in ios/)
- Reason: Not needed, were deleted during cleanup
- N/A

❌ **.DS_Store files**
- Reason: macOS auto-creates these
- N/A

---

## 📦 External Drive Organization

### Recommended Structure:

```
/Volumes/YOUR_DRIVE_NAME/
├── 16BitFit-V3-Secrets/
│   └── .env                    ⚠️ CRITICAL
│
├── 16BitFit-V3-V2-Assets/      (Optional)
│   └── MIGRATION_STAGING/
│       ├── 01_CRITICAL_INNOVATIONS/
│       ├── 02_SPRITE_ASSETS/
│       ├── 03_AUDIO_ASSETS/
│       ├── 04_AI_GENERATION/
│       ├── 05_DATABASE_SCHEMA/
│       ├── 06_AGENT_CONFIGS/
│       └── 07_DOCUMENTATION/
│
└── 16BitFit-V3-iOS-Certs/      (If you have any)
    ├── *.p12                   (iOS signing certificates)
    └── *.mobileprovision       (Provisioning profiles)
```

---

## 🔍 How to Check if You Have iOS Certificates

Run this on your laptop:
```bash
# Check for iOS certificates
find ~/Library/MobileDevice -name "*.mobileprovision" 2>/dev/null
find ~/Desktop/16BitFit-V3 -name "*.p12" 2>/dev/null

# Check Keychain Access
# Open: Applications → Utilities → Keychain Access
# Look for: "Apple Development" or "Apple Distribution" certificates
```

**If you find any iOS certificates:**
```bash
# Export from Keychain Access (recommended)
# 1. Open Keychain Access
# 2. Right-click on certificate
# 3. Export → Save as .p12
# 4. Copy to external drive

# Copy provisioning profiles
cp ~/Library/MobileDevice/Provisioning\ Profiles/*.mobileprovision \
   /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-iOS-Certs/
```

**Note:** For this project, you likely don't have production certificates yet (still in development)

---

## ✅ Pre-Copy Verification Checklist

Before copying, verify:

- [ ] External drive has enough space:
  - Minimum: 2KB (just .env)
  - With MIGRATION_STAGING: 140MB
  - With iOS certs: +50MB

- [ ] External drive is formatted correctly:
  - macOS Extended (Journaled) - Best
  - exFAT - Works (cross-platform)
  - FAT32 - Avoid (file size limits)

- [ ] .env file exists on laptop:
  ```bash
  ls -la /Users/seanwinslow/Desktop/16BitFit-V3/.env
  # Should show: -rw-r--r--  1 seanwinslow  staff  ~1KB
  ```

- [ ] .env file is NOT empty:
  ```bash
  wc -l /Users/seanwinslow/Desktop/16BitFit-V3/.env
  # Should show: ~40-50 lines
  ```

---

## 🚀 Copy Commands Summary

### Minimal Copy (CRITICAL ONLY)

```bash
# Just the essentials
mkdir -p /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/
cp /Users/seanwinslow/Desktop/16BitFit-V3/.env \
   /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env

# Verify
ls -lh /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env
```

### Full Copy (WITH V2 ASSETS)

```bash
# Critical + V2 assets
mkdir -p /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/
mkdir -p /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/

cp /Users/seanwinslow/Desktop/16BitFit-V3/.env \
   /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env

cp -r /Users/seanwinslow/Desktop/16BitFit-V3/docs/archive/MIGRATION_STAGING \
      /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/

# Verify
ls -lh /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env
du -sh /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/MIGRATION_STAGING
```

---

## 🖥️ On Your Desktop (After Clone)

### Copy Files Back from External Drive:

```bash
# Navigate to cloned repo
cd ~/Desktop/16BitFit-V3  # Or wherever you clone it

# Copy .env (CRITICAL)
cp /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-Secrets/.env .env

# Optional: Copy MIGRATION_STAGING
cp -r /Volumes/YOUR_DRIVE_NAME/16BitFit-V3-V2-Assets/MIGRATION_STAGING \
      docs/archive/

# Verify .env is there
ls -la .env
# Should show: -rw-r--r--  1 yourname  staff  ~1KB

# Verify .env is NOT in git
git check-ignore .env
# Should output: .env (meaning it's ignored)
```

---

## ⚠️ SECURITY REMINDERS

### DO NOT:
- ❌ Commit .env to git (it's already in .gitignore)
- ❌ Share .env file publicly
- ❌ Email .env file
- ❌ Store .env in cloud without encryption
- ❌ Leave external drive unencrypted with .env on it

### DO:
- ✅ Keep .env on external drive encrypted if possible
- ✅ Verify .env is in .gitignore before any git add/commit
- ✅ Use .env.example as template (already in repo)
- ✅ Store external drive securely
- ✅ Eject external drive properly

---

## 🔒 Optional: Encrypt External Drive

### macOS (Recommended):

```bash
# Use Disk Utility to encrypt the drive:
# 1. Open Disk Utility
# 2. Select your external drive
# 3. Click "Erase"
# 4. Format: APFS (Encrypted) or Mac OS Extended (Journaled, Encrypted)
# 5. Enter a strong password
# 6. Store password securely (NOT in the project)
```

**Why:** Protects your .env file if external drive is lost or stolen

---

## 📊 File Size Summary

| Item | Size | Priority |
|------|------|----------|
| .env | ~1KB | ⚠️ CRITICAL |
| MIGRATION_STAGING | 139MB | Optional |
| iOS Certificates | ~50MB | If applicable |
| **Total (min)** | **~1KB** | - |
| **Total (recommended)** | **~140MB** | - |

---

## ✅ Final Checklist Before Leaving Laptop

- [ ] Copied .env to external drive
- [ ] Verified .env is readable on external drive
- [ ] (Optional) Copied MIGRATION_STAGING to external drive
- [ ] (If applicable) Exported iOS certificates
- [ ] Ejected external drive safely
- [ ] Pushed code to GitHub (git push origin main)
- [ ] Verified GitHub repository is accessible

---

## 🎯 What You'll Do on Desktop

1. Clone from GitHub: `git clone https://github.com/seanwinslow28/16BitFit-V3.git`
2. Copy .env from external drive to project root
3. Install dependencies: `npm install`
4. Install iOS pods: `cd apps/mobile-shell/ios && pod install`
5. Link Supabase: `supabase link --project-ref noxwzelpibuytttlgztq`
6. Verify setup: `git status` (should be clean)
7. Test app: `npm run ios`

**See DESKTOP_ARCHITECT_HANDOFF.md for detailed setup instructions.**

---

*Checklist created: 2025-10-31*
*Project: 16BitFit V3*
*Migration: Laptop → Desktop via GitHub*
