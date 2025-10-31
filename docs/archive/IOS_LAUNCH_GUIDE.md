# iOS App Launch Guide - 16BitFit V3

## Overview

The 16BitFit V3 iOS app can be launched in two different ways. Each method handles Metro bundler synchronization differently.

---

## 🎯 **Recommended Method: Launch from Xcode**

### Why This Method?

- Uses our automated Metro synchronization fix
- No manual Metro management required
- Most reliable for development
- Shows build logs and errors clearly

### Steps:

1. **Open the workspace in Xcode:**

   ```bash
   cd /Users/seanwinslow/Desktop/16BitFit-V3
   open apps/mobile-shell/ios/MobileShell.xcworkspace
   ```

2. **Select your simulator:**
   - Click the device dropdown near the Run button
   - Choose any iOS Simulator (e.g., "iPhone 15 Pro")

3. **Click the Run button (▶️)**
   - Our `[16BitFit] Synchronize Metro` build phase will automatically:
     - Check if Metro is running
     - Start Metro if needed
     - Wait for Metro to initialize
     - Proceed with the build only when Metro is ready

4. **Verify build phase (first time):**
   - Go to `MobileShell` target → `Build Phases`
   - Confirm `[16BitFit] Synchronize Metro` is the **first** build phase
   - Confirm `Start Packager` phase is **removed**

### What You'll See:

**In Xcode Build Log:**

```
Running ensure-metro.sh...
[16BitFit] Synchronizing Metro Bundler...
✅ Metro is already running and ready.
```

OR (if Metro wasn't running):

```
Running ensure-metro.sh...
[16BitFit] Synchronizing Metro Bundler...
Starting Metro bundler (background process)...
Waiting for Metro to initialize (max 120s)...
✅ Metro initialization complete.
```

---

## 🔧 **Alternative Method: React Native CLI**

### Why Use This?

- Faster for quick iterations
- Some developers prefer CLI workflow
- Can be scripted/automated

### ⚠️ Important Caveat:

The `npm run ios` command uses React Native CLI, which **bypasses Xcode build phases**. This means our Metro synchronization fix doesn't run automatically. You must start Metro manually first.

### Steps:

1. **Terminal 1 - Start Metro manually:**

   ```bash
   cd /Users/seanwinslow/Desktop/16BitFit-V3
   npm run start

   # Wait for Metro to show:
   # "Welcome to Metro"
   # "Loading dependency graph, done."
   ```

2. **Terminal 2 - Launch the app:**

   ```bash
   npm run ios

   # OR specify a simulator:
   npm run ios -- --simulator="iPhone 15 Pro"
   ```

3. **Keep Metro running:**
   - Leave Terminal 1 running
   - Metro will hot-reload your changes

### What If You Forget to Start Metro First?

You'll see this error:

```
No bundle URL present.
Make sure you're running a packager server...
```

**Solution:** Start Metro in another terminal and reload the app (`Cmd+R` in simulator).

---

## 🐛 **Troubleshooting**

### Error: "Port 8081 already in use"

**Cause:** Another process is using Metro's port.

**Solution:**

```bash
# Kill all processes on port 8081
lsof -ti:8081 | xargs kill -9

# Then restart Metro or rebuild from Xcode
```

### Error: "No bundle URL present"

**Cause:** Metro isn't running or didn't finish initializing.

**Solution:**

- **If using Xcode:** Check build logs for errors from `ensure-metro.sh`
- **If using CLI:** Make sure you ran `npm run start` first
- Check Metro logs: `tail -f apps/mobile-shell/metro-sync.log`

### Metro Logs Location

```bash
# View Metro logs (when using Xcode method)
tail -f apps/mobile-shell/metro-sync.log

# Clear old logs
rm apps/mobile-shell/metro-sync.log
```

### Build Phase Not Running?

**Verify the build phase exists:**

```bash
grep -i "16BitFit.*Synchronize Metro" apps/mobile-shell/ios/MobileShell.xcodeproj/project.pbxproj
```

**Re-apply the fix:**

```bash
cd apps/mobile-shell/ios
pod install
# Should show: "Successfully injected '[16BitFit] Synchronize Metro' build phase."
```

---

## 📊 **Comparison Table**

| Feature              | Xcode Method      | CLI Method                      |
| -------------------- | ----------------- | ------------------------------- |
| **Metro Auto-Start** | ✅ Yes            | ❌ No (manual)                  |
| **Build Phase Fix**  | ✅ Active         | ❌ Bypassed                     |
| **Speed**            | Moderate          | Fast                            |
| **Reliability**      | ⭐⭐⭐⭐⭐        | ⭐⭐⭐ (if Metro started first) |
| **Build Logs**       | Detailed          | Minimal                         |
| **Hot Reload**       | ✅ Yes            | ✅ Yes                          |
| **Recommended For**  | Daily development | Quick tests                     |

---

## 🚀 **Quick Reference Commands**

### Xcode Method

```bash
open apps/mobile-shell/ios/MobileShell.xcworkspace
# Then click Run (▶️)
```

### CLI Method

```bash
# Terminal 1:
npm run start

# Terminal 2:
npm run ios
```

### Kill Metro

```bash
lsof -ti:8081 | xargs kill -9
```

### Rebuild from Scratch

```bash
cd apps/mobile-shell/ios
rm -rf build
pod install
# Then launch from Xcode
```

---

## ✅ **Best Practices**

1. **Use Xcode during active development** - Most reliable
2. **Use CLI for quick iterations** - When you already have Metro running
3. **Always check Metro status** - `curl -s http://localhost:8081/status`
4. **Keep one Metro instance** - Don't run multiple Metro servers
5. **Check logs when issues occur** - `apps/mobile-shell/metro-sync.log`

---

**Last Updated:** October 25, 2025
**Metro Sync Fix:** Implemented in commit `f7ba011`
