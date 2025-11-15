# 🚀 Quick Start Guide - Claude Code on the Web

## ✅ Pre-Flight Checklist

Before you go to sleep, verify these items:

### 1. GitHub Repository
- [x] Branch `fix/p0-build-stabilization` exists
- [x] Latest changes pushed to GitHub
- [x] CLAUDE.md file exists in root
- [x] Design system docs exist in `docs/design-system/`

**Verify:**
```bash
git status
git log --oneline -5
```

### 2. Claude Code Environment
- [ ] Environment created: "16BitFit-V3 - Claude Code In Web"
- [ ] Network access: **Trusted Sources** (MUST be selected)
- [ ] GitHub app connected to your account

**Verify at:** https://claude.ai/code/settings

### 3. Repository Access
- [ ] Repository visible: `seanwinslow28/16BitFit-V3`
- [ ] Can select branch: `fix/p0-build-stabilization`

---

## 📋 How to Launch the Task

### Step 1: Navigate to Claude Code on the Web
**URL:** https://claude.ai/code

### Step 2: Select Repository
- Repository: `seanwinslow28/16BitFit-V3`
- Branch: `fix/p0-build-stabilization`

### Step 3: Open the Prompt File
**Location:** `/Users/seanwinslow/Desktop/Claude Desktop Access Folders/16BitFit-V3/CLAUDE_CODE_WEB_PROMPT.md`

### Step 4: Copy Entire Prompt
- Open `CLAUDE_CODE_WEB_PROMPT.md` in any text editor
- Select all (Cmd+A)
- Copy (Cmd+C)

### Step 5: Paste into Claude Code Web
- Click in the message input box
- Paste (Cmd+V)
- Review briefly to ensure formatting is correct

### Step 6: Verify Settings
- [x] Branch: `fix/p0-build-stabilization`
- [x] Network access: Trusted Sources
- [x] Environment: 16BitFit-V3 - Claude Code In Web

### Step 7: Launch
- Click "Send" or press Enter
- Claude will confirm understanding and start work
- You can close the browser - work continues in the cloud

---

## 📊 Monitoring Progress (Optional)

You can check progress without interrupting:

### Via Web Browser:
- https://claude.ai/code
- View task status
- See commits as they happen
- Read progress updates

### Via Mobile App:
- Download Claude mobile app
- Sign in with same account
- Navigate to Code section
- View task progress

**You do NOT need to monitor - Claude will work autonomously for ~8 hours**

---

## 🌅 Morning Checklist

When you wake up:

### 1. Check Pull Request
**URL:** https://github.com/seanwinslow28/16BitFit-V3/pulls

**Look for:**
- PR title: "feat: Complete P0/P1 component development..."
- Status: Ready for review
- Files changed: ~30+ files
- Lines added: ~4,000+

### 2. Review Development Report
**File:** `OVERNIGHT_DEVELOPMENT_REPORT.md` (should be in repo root)

**Check:**
- ✅ Tasks completed
- 🐛 Bugs fixed
- ⚠️ Any blockers or issues
- 📈 Code quality metrics

### 3. Quick Validation (5 minutes)
```bash
cd /Users/seanwinslow/Desktop/Claude\ Desktop\ Access\ Folders/16BitFit-V3
git pull origin fix/p0-build-stabilization

cd apps/mobile-shell
npm install
npx tsc --noEmit  # Should show 0 errors
npm test          # Should be all green
```

### 4. Visual QA (15 minutes)
```bash
# Start Metro bundler
npm run start

# In another terminal, start iOS simulator
npm run ios

# Navigate through onboarding flow:
# 1. Welcome screen (should show ProgressIndicator)
# 2. Profile setup (should use FormField components)
# 3. Archetype selection (should show ArchetypeCard grid)
```

**Check:**
- [ ] Colors match DMG palette (4 greens only)
- [ ] Animations are smooth (60 FPS feel)
- [ ] Touch targets are at least 44x44pt
- [ ] Haptic feedback works on button presses
- [ ] Components look pixel-perfect

### 5. Merge or Iterate
**If everything looks good:**
```bash
# Merge PR via GitHub UI
# OR via command line:
git checkout main
git merge fix/p0-build-stabilization
git push origin main
```

**If issues found:**
- Comment on PR with specific issues
- Claude (or you) can address in follow-up commits

---

## 🎯 What to Expect in the Morning

### Best Case Scenario (90% probability):
✅ 15 components fully implemented
✅ 15 test files with 80%+ coverage
✅ Story 1.4 integration complete
✅ 0 TypeScript errors
✅ Pull request ready to merge
✅ Detailed development report

**Estimated completion:** 6-8 hours
**Pull request created:** ~2 AM (if started at 10 PM)

### Realistic Scenario (Good):
✅ 12-14 components implemented
⚠️ 1-2 components with minor issues
✅ Most tests passing (95%+)
⚠️ 1-2 TypeScript errors to fix manually
✅ Pull request created with notes on issues

**Manual fix time:** 30-60 minutes

### Unexpected Blockers (10% probability):
⚠️ Dependency conflict discovered
⚠️ Missing reference file needed for specs
⚠️ Network access issue preventing installs

**In this case:**
- Claude will document blockers clearly
- Work will be committed up to blocking point
- You can resolve blocker and re-run remaining tasks

---

## 🛟 Troubleshooting

### "Network access denied" error
**Fix:**
1. Go to https://claude.ai/code/settings
2. Select environment "16BitFit-V3 - Claude Code In Web"
3. Change network access from "None" to "Trusted Sources"
4. Retry task

### "Repository not found" error
**Fix:**
1. Verify GitHub app is installed: https://github.com/apps/claude-code
2. Grant access to `16BitFit-V3` repository
3. Refresh Claude Code on the Web

### "Branch not found" error
**Fix:**
```bash
git push origin fix/p0-build-stabilization
```
Ensure branch is pushed to GitHub remote.

### Task seems stuck
**Check:**
1. Visit https://claude.ai/code
2. View task status
3. Check recent commits on GitHub (work may be progressing)

**If truly stuck (no commits for 2+ hours):**
- Task may have hit a blocker
- Check for error messages in task log
- Can restart task from last successful phase

---

## 📞 Support Resources

### Claude Code Docs:
- https://code.claude.com/docs/en/claude-code-on-the-web

### GitHub Repository:
- https://github.com/seanwinslow28/16BitFit-V3

### Project Documentation:
- CLAUDE.md (root)
- docs/design-system/atomic-components.md
- docs/design-system/molecular-components.md

---

## 🎉 Success Metrics

**Your overnight development session will be considered successful if:**

| Metric | Target | Acceptable |
|--------|--------|------------|
| Components implemented | 15/15 (100%) | 12/15 (80%) |
| Test coverage | 80%+ | 70%+ |
| TypeScript errors | 0 | <5 |
| Tests passing | 100% | 95%+ |
| PR created | Yes | Yes |
| Story 1.4 functional | Yes | Partially |

**Even if only 80% complete, you'll have saved 20-30 hours of manual development!**

---

## ⏰ Recommended Schedule

**Tonight (10 PM):**
- [ ] 10:00 PM: Run pre-flight checklist
- [ ] 10:10 PM: Launch Claude Code task
- [ ] 10:15 PM: Verify task started (see first commit)
- [ ] 10:20 PM: Go to sleep! 😴

**Morning (6 AM):**
- [ ] 6:00 AM: Check pull request status
- [ ] 6:05 AM: Read overnight development report
- [ ] 6:15 AM: Run quick validation (TypeScript, tests)
- [ ] 6:30 AM: Visual QA on simulator
- [ ] 7:00 AM: Merge PR or log follow-up tasks

**Total hands-on time:** ~20 minutes tonight, ~1 hour tomorrow morning
**Development time gained:** ~20-30 hours

---

## 💡 Pro Tips

1. **Don't check progress at 2 AM** - You'll be tempted, but Claude works best without interruption

2. **Trust the process** - Even if some components need tweaks, the bulk of the work will be done

3. **Review the report first** - Claude will document everything clearly, including any issues

4. **Visual QA is important** - Colors and spacing need your human eye to verify perfection

5. **Iterate if needed** - If something isn't quite right, you can ask Claude (terminal or web) to refine it

---

**You're all set! Copy the prompt from `CLAUDE_CODE_WEB_PROMPT.md` and launch the task. Good night! 🌙**
