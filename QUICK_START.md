# 16BitFit Quick Start Guide

## ✅ Prerequisites Met
- ✅ Node 18.20.8 installed (via fnm)
- ✅ fnm configured for auto-switching
- ✅ Metro cache cleaned
- ✅ iOS build verified working

---

## 🚀 Running the App (Daily Workflow)

### Terminal 1: Start Metro Bundler

```bash
cd /Users/seanwinslow/Desktop/Claude_Folders/16BitFit-V3/apps/mobile-shell

# fnm will auto-switch to Node 18 if you've sourced your .bashrc
npx react-native start
```

### Terminal 2: Launch iOS Simulator

```bash
cd /Users/seanwinslow/Desktop/Claude_Folders/16BitFit-V3/apps/mobile-shell

# Run on default simulator
npx react-native run-ios

# Or specify a simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

---

## 🔄 If You Need to Switch Terminals

If fnm auto-switching isn't working in a new terminal:

```bash
# Activate fnm in current session
eval "$(fnm env --use-on-cd)"

# Or reload your shell config
source ~/.bashrc  # or ~/.zshrc if using zsh

# Verify Node version
node -v  # Should show v18.20.8
```

---

## 🧹 Troubleshooting

### Metro Won't Start

```bash
# Kill any running Metro
killall node

# Clear cache
rm -rf $TMPDIR/metro-* $TMPDIR/haste-* $TMPDIR/react-*

# Start with clean cache
npx react-native start --reset-cache
```

### iOS Build Fails

```bash
cd apps/mobile-shell/ios

# Clean and reinstall pods
pod deintegrate
pod install

# Clean Xcode build
rm -rf build

# Try again
cd ..
npx react-native run-ios
```

### Wrong Node Version

```bash
# Check current version
node -v

# Switch to Node 18
fnm use 18

# Verify
node -v  # Should be v18.20.8
```

---

## 📊 What's Working Now

✅ **Welcome Screen** - Logo, fonts, buttons all rendering  
✅ **Profile Setup** - Input fields, validation, skip option  
✅ **Archetype Selection** - All 5 archetypes with pixel art  
✅ **Navigation** - Smooth transitions between screens  
✅ **Design System** - 4-color LCD palette throughout  

---

## 🎯 Next Story: 1.5 - Photo Upload & AI Avatar Generation

You're ready to continue development!

---

**Last Updated:** November 19, 2025  
**Node Version:** 18.20.8  
**React Native:** 0.71.8  
**Status:** ✅ Fully Operational
