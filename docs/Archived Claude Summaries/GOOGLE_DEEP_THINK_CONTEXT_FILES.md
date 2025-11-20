# Google Deep Think - Context Files List

## Instructions for Uploading to Google Deep Think

Copy the content from the files listed below and paste them into Google Deep Think along with the `GOOGLE_DEEP_THINK_BUILD_FIX_PROMPT.md` prompt.

---

## Required Files (Priority Order)

### 🔴 P0: Error-Containing Files (MUST INCLUDE)

#### 1. OnboardingContext.test.tsx
**Path:** `apps/mobile-shell/src/screens/onboarding/__tests__/OnboardingContext.test.tsx`
**Purpose:** Contains Error #1 (`@testing-library/react` import)
**Lines to copy:** Lines 1-50 (or entire file)

#### 2. healthServiceImpl.ios.ts
**Path:** `apps/mobile-shell/src/services/health/healthServiceImpl.ios.ts`
**Purpose:** Contains Error #2 (missing `write` property)
**Lines to copy:** Lines 1-60 (focus on permissions object at line 14-18)

#### 3. supabaseClient.ts
**Path:** `apps/mobile-shell/src/services/supabaseClient.ts`
**Purpose:** Contains Error #3 (missing `env.ts` import)
**Lines to copy:** Entire file (42 lines)

#### 4. env.example.ts
**Path:** `apps/mobile-shell/src/config/env.example.ts`
**Purpose:** Template showing how `env.ts` should look
**Lines to copy:** Entire file (42 lines)

---

### 🟡 P1: Configuration Files (HIGHLY RECOMMENDED)

#### 5. package.json (mobile-shell)
**Path:** `apps/mobile-shell/package.json`
**Purpose:** Shows dependencies, especially testing libraries
**Lines to copy:** Entire file (82 lines)
**Key sections to highlight:**
- Line 22-42: `dependencies` (includes `@testing-library/react-native`)
- Line 44-67: `devDependencies`
- Line 69-80: `jest` configuration

#### 6. app.json
**Path:** `apps/mobile-shell/app.json`
**Purpose:** Expo configuration (environment variables)
**Lines to copy:** Entire file

#### 7. tsconfig.json
**Path:** `apps/mobile-shell/tsconfig.json`
**Purpose:** TypeScript compiler configuration
**Lines to copy:** Entire file

---

### 🟢 P2: Reference Implementations (RECOMMENDED)

#### 8. PixelButton.test.tsx
**Path:** `apps/mobile-shell/src/components/atoms/PixelButton/__tests__/PixelButton.test.tsx`
**Purpose:** Example of CORRECT testing pattern (uses `@testing-library/react-native`)
**Lines to copy:** Lines 1-30 (imports and first test)
**Why:** Shows the correct import pattern to compare with Error #1

#### 9. healthServiceImpl.android.ts
**Path:** `apps/mobile-shell/src/services/health/healthServiceImpl.android.ts`
**Purpose:** Compare permission structure between iOS/Android
**Lines to copy:** Lines 1-50 (focus on permissions setup)
**Why:** Validate consistency between platforms

---

### 📄 P3: Project Documentation (OPTIONAL BUT HELPFUL)

#### 10. CLAUDE.md
**Path:** `CLAUDE.md` (root directory)
**Purpose:** Complete project configuration and build commands
**Lines to copy:**
- Lines 1-100 (Project Overview + Build Commands)
- Lines 150-250 (Design System + Component Guidelines)
**Why:** Provides project context for recommendations

#### 11. BUILD_ISSUES_ANALYSIS.md
**Path:** `BUILD_ISSUES_ANALYSIS.md` (root directory)
**Purpose:** Initial analysis by Claude Desktop Architect
**Lines to copy:** Entire file (you just created this)
**Why:** Shows preliminary analysis for comparison

#### 12. COPY_PASTE_PROMPT.txt
**Path:** `COPY_PASTE_PROMPT.txt` (root directory)
**Purpose:** Original overnight development instructions
**Lines to copy:** Lines 1-100 (context and Phase 1)
**Why:** Explains what was SUPPOSED to happen

---

## How to Structure Your Google Deep Think Input

### Method 1: Single Combined File (Recommended)

Create a single document with this structure:

```markdown
# 16BitFit V3 Build Fix Analysis - Input for Google Deep Think

## MAIN PROMPT
[Paste entire content of GOOGLE_DEEP_THINK_BUILD_FIX_PROMPT.md here]

---

## CONTEXT FILE 1: OnboardingContext.test.tsx
```typescript
[Paste file content here]
```

---

## CONTEXT FILE 2: healthServiceImpl.ios.ts
```typescript
[Paste file content here]
```

---

## CONTEXT FILE 3: supabaseClient.ts
[Continue for all 12 files...]
```

### Method 2: Upload as Attachments (If Available)

If Google Deep Think supports file attachments:
1. Upload `GOOGLE_DEEP_THINK_BUILD_FIX_PROMPT.md` as the main prompt
2. Attach all 12 files listed above
3. Ensure file paths are visible in filenames

### Method 3: Paste in Conversation (Interactive)

If using conversational mode:
1. Start with main prompt
2. When asked for specific files, paste them
3. Google Deep Think will request additional context as needed

---

## File Reading Commands (For Quick Copy-Paste)

You can use these commands to extract file content:

### Error Files (P0)
```bash
# File 1: OnboardingContext.test.tsx
cat apps/mobile-shell/src/screens/onboarding/__tests__/OnboardingContext.test.tsx

# File 2: healthServiceImpl.ios.ts
cat apps/mobile-shell/src/services/health/healthServiceImpl.ios.ts | head -60

# File 3: supabaseClient.ts
cat apps/mobile-shell/src/services/supabaseClient.ts

# File 4: env.example.ts
cat apps/mobile-shell/src/config/env.example.ts
```

### Configuration Files (P1)
```bash
# File 5: package.json
cat apps/mobile-shell/package.json

# File 6: app.json
cat apps/mobile-shell/app.json

# File 7: tsconfig.json
cat apps/mobile-shell/tsconfig.json
```

### Reference Implementations (P2)
```bash
# File 8: PixelButton.test.tsx
cat apps/mobile-shell/src/components/atoms/PixelButton/__tests__/PixelButton.test.tsx | head -30

# File 9: healthServiceImpl.android.ts
cat apps/mobile-shell/src/services/health/healthServiceImpl.android.ts | head -50
```

### Documentation (P3)
```bash
# File 10: CLAUDE.md
cat CLAUDE.md

# File 11: BUILD_ISSUES_ANALYSIS.md
cat BUILD_ISSUES_ANALYSIS.md

# File 12: COPY_PASTE_PROMPT.txt
cat COPY_PASTE_PROMPT.txt
```

---

## Minimal File Set (If Context Limit Reached)

If Google Deep Think has a context limit, use these **5 essential files only**:

1. ✅ **OnboardingContext.test.tsx** - Error #1
2. ✅ **healthServiceImpl.ios.ts** (lines 1-60) - Error #2
3. ✅ **supabaseClient.ts** - Error #3
4. ✅ **package.json** (mobile-shell) - Dependencies
5. ✅ **env.example.ts** - Environment config template

This gives Google Deep Think enough context to analyze all 3 errors.

---

## File Content Summaries (If You Need TL;DR)

### Error #1 Context
- **File:** `OnboardingContext.test.tsx`
- **Issue:** Imports `renderHook` from `@testing-library/react` (doesn't exist)
- **Should import from:** `@testing-library/react-native`
- **Why:** React Native has different testing utilities than web React

### Error #2 Context
- **File:** `healthServiceImpl.ios.ts`
- **Issue:** Permissions object missing `write: []` property
- **Required by:** `react-native-health` v1.19.0 type definitions
- **Why:** HealthKit API requires both read AND write arrays (even if write is empty)

### Error #3 Context
- **File:** `supabaseClient.ts` imports from `../config/env`
- **Issue:** `env.ts` file doesn't exist (only `env.example.ts` template exists)
- **Solution:** Copy template OR use Expo Constants
- **Why:** Environment file is gitignored, must be created locally

---

## Expected Google Deep Think Output Size

Based on the prompt complexity, expect:

- **Part 1 (Executive Summary):** ~500 words
- **Part 2 (Error Analysis):** ~3,000 words (1,000 per error)
- **Part 3 (Best Practices):** ~2,000 words
- **Part 4 (Action Plan):** ~1,500 words
- **Part 5 (Lessons Learned):** ~1,000 words

**Total:** ~8,000 words / ~16-20 pages of analysis

**Processing Time:**
- Google Deep Think: 5-10 minutes (deep research mode)
- Gemini 2.0 Flash Thinking: 2-3 minutes (fast mode)

---

## Checklist Before Submitting to Google Deep Think

- [ ] Main prompt copied (`GOOGLE_DEEP_THINK_BUILD_FIX_PROMPT.md`)
- [ ] All P0 files attached (4 error-related files)
- [ ] At least 2 P1 files attached (package.json + tsconfig.json)
- [ ] File paths clearly labeled
- [ ] Code snippets properly formatted (markdown code blocks)
- [ ] Request set to "deep analysis" mode (not quick summary)
- [ ] Output format specified (markdown with code examples)

---

## Alternative: Use This Prompt Directly

If you can't access the separate files, you can use this **self-contained version**:

[Create a condensed version with inline file contents]

But the multi-file approach is STRONGLY RECOMMENDED for better analysis.

---

**Ready to submit? Good luck with the Deep Think analysis!** 🧠🔍
