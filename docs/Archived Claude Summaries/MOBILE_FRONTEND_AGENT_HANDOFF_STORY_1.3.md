# Mobile/Frontend Agent - Story 1.3 Handoff

**Agent Role:** Mobile/Frontend Developer
**Story:** 1.3 - HealthKit/Connect Integration & Step Sync
**Story Points:** 8
**Estimated Time:** 3 days (24 hours)
**Priority:** High - Foundation for user engagement

---

## 🎯 MISSION BRIEF

Integrate Apple HealthKit (iOS) and Google Health Connect (Android) to fetch daily step count data and sync it to our Supabase backend. This is a foundational feature that enables real-world fitness data to power the 16BitFit gamification experience.

**Your Objective:** Build a robust, platform-abstracted health data pipeline that works seamlessly on both iOS and Android.

---

## 📚 CONTEXT & PREREQUISITES

### What's Already Complete
- ✅ **Story 1.1:** Project initialized, dependencies installed
- ✅ **Story 1.2:** Supabase backend + auth system fully functional
- ✅ User profiles table exists with auth capabilities
- ✅ Mobile app running with navigation

### What You're Building
A health data integration layer consisting of:
1. **Platform Services** - iOS HealthKit + Android Health Connect implementations
2. **State Management** - Zustand store for health data state
3. **Sync Service** - Orchestrates data fetching and Supabase uploads
4. **Database Schema** - New `user_steps` table for storing daily step data
5. **App Lifecycle Integration** - Automatic sync on launch/foreground

### Architecture Pattern
Follow the existing patterns established in Story 1.2:
- **Service Layer:** `authService.ts` → `healthService.ts` (reference pattern)
- **State Management:** `authStore.ts` → `healthStore.ts` (reference pattern)
- **Platform Abstraction:** Use `.ios.ts` and `.android.ts` file extensions

---

## 🎓 REQUIRED READING

**Before starting, review these files:**

1. **Story Requirements** (15 min)
   - `docs/stories/1.3.healthkit-integration.story.md` - Acceptance criteria

2. **Preparation Guide** (30 min)
   - `docs/STORY_1.3_PREPARATION_GUIDE.md` - Technical details and libraries

3. **Deep Think Analysis** (45 min)
   - `Gemini Deep Think - Story 1.3 Implementation.md` - Comprehensive execution plan

4. **Reference Patterns** (30 min)
   - `apps/mobile-shell/src/services/authService.ts` - Service pattern
   - `apps/mobile-shell/src/stores/authStore.ts` - Store pattern

**Total Reading Time:** ~2 hours (included in Day 1 estimate)

---

## 📋 EXECUTION PLAN (Deep Think Validated)

### **Phase 0: Backend Preparation** (1.5 hours, Risk: Low)

**Goal:** Prepare Supabase database schema

#### Task 0.1: Create `user_steps` Table Migration (45 min)

**Create Migration File:**
```bash
# Using Supabase MCP tool or CLI
supabase migration new create_user_steps_table
```

**Migration SQL:**
```sql
-- Create user_steps table for daily step tracking
CREATE TABLE IF NOT EXISTS public.user_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  step_count INTEGER NOT NULL DEFAULT 0,
  source VARCHAR(20) NOT NULL CHECK (source IN ('HealthKit', 'HealthConnect')),
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint to enable idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_steps_unique
  ON public.user_steps(user_id, date);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_steps_user_date
  ON public.user_steps(user_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE public.user_steps ENABLE ROW LEVEL SECURITY;

-- Users can only access their own step data
CREATE POLICY "Users can view own steps"
  ON public.user_steps
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own steps"
  ON public.user_steps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own steps"
  ON public.user_steps
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_user_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_steps_timestamp
  BEFORE UPDATE ON public.user_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_steps_updated_at();
```

**Validation:**
- [ ] Migration file created
- [ ] Table exists in Supabase dashboard
- [ ] RLS policies active
- [ ] Unique constraint on (user_id, date) working

#### Task 0.2: Regenerate TypeScript Types (45 min)

```bash
# Regenerate database types
npx supabase gen types typescript --project-id noxwzelpibuytttlgztq > apps/mobile-shell/src/types/database.types.ts
```

**Validation:**
- [ ] TypeScript types include `user_steps` table
- [ ] No TypeScript errors in codebase

---

### **Phase 1: Shared Foundation** (3 hours, Risk: Low)

**Goal:** Set up architecture, types, and install dependencies

#### Task 1.1: Install Dependencies (45 min)

```bash
cd apps/mobile-shell

# Install iOS HealthKit library
npm install @kingstinct/react-native-healthkit --save

# Install Android Health Connect library
npm install react-native-health-connect --save

# Install pods (iOS)
cd ios
pod install
cd ..

# Verify build
npm run ios  # Test iOS build
npm run android  # Test Android build
```

**Validation:**
- [ ] Both libraries added to package.json
- [ ] iOS pods installed successfully
- [ ] App builds on both platforms without errors

#### Task 1.2: Define TypeScript Interfaces (45 min)

**Create:** `apps/mobile-shell/src/types/health.types.ts`

```typescript
// Health data source types
export type HealthSource = 'HealthKit' | 'HealthConnect';

// Permission status enum
export enum PermissionStatus {
  Unknown = 'Unknown',
  Granted = 'Granted',
  Denied = 'Denied',
  Unavailable = 'Unavailable', // iPad or Health Connect not installed
}

// Single data point for daily steps
export interface StepDataPoint {
  date: string; // YYYY-MM-DD format
  stepCount: number;
  source: HealthSource;
}

// Platform service interface (both iOS and Android must implement)
export interface IHealthPlatformService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<PermissionStatus>;
  fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]>;
}

// Sync status for UI
export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
}
```

**Create:** `apps/mobile-shell/src/types/health.errors.ts`

```typescript
// Custom error types for health operations
export class HealthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'HealthError';
  }
}

export class PermissionDeniedError extends HealthError {
  constructor(message: string = 'Health permissions denied by user') {
    super(message, 'PERMISSION_DENIED');
  }
}

export class ServiceUnavailableError extends HealthError {
  constructor(message: string = 'Health service unavailable on this device') {
    super(message, 'SERVICE_UNAVAILABLE');
  }
}

export class SyncFailedError extends HealthError {
  constructor(message: string = 'Failed to sync health data') {
    super(message, 'SYNC_FAILED');
  }
}
```

**Validation:**
- [ ] Type files created and importable
- [ ] No TypeScript errors

#### Task 1.3: Create Health Store (45 min)

**Create:** `apps/mobile-shell/src/stores/healthStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionStatus, SyncStatus } from '../types/health.types';

interface HealthState extends SyncStatus {
  // Availability and permissions
  isAvailable: boolean;
  permissionStatus: PermissionStatus;

  // Data
  dailySteps: number;
  lastSyncDate: string | null; // YYYY-MM-DD

  // Actions
  setAvailability: (available: boolean) => void;
  setPermissionStatus: (status: PermissionStatus) => void;
  setDailySteps: (steps: number, date: string) => void;
  startSync: () => void;
  finishSync: (error?: string) => void;
  clearError: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      // Initial state
      isAvailable: false,
      permissionStatus: PermissionStatus.Unknown,
      dailySteps: 0,
      lastSyncDate: null,
      isSyncing: false,
      lastSyncTime: null,
      syncError: null,

      // Actions
      setAvailability: (available) => set({ isAvailable: available }),

      setPermissionStatus: (status) => set({ permissionStatus: status }),

      setDailySteps: (steps, date) =>
        set({ dailySteps: steps, lastSyncDate: date }),

      startSync: () =>
        set({ isSyncing: true, syncError: null }),

      finishSync: (error) =>
        set({
          isSyncing: false,
          lastSyncTime: error ? undefined : new Date(),
          syncError: error || null,
        }),

      clearError: () => set({ syncError: null }),
    }),
    {
      name: '16bitfit-health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

**Validation:**
- [ ] Store imports without errors
- [ ] Can access store state in test component

#### Task 1.4: Initialize Service Structure (45 min)

**Create folder structure:**
```
apps/mobile-shell/src/services/health/
├── healthService.ts              (public facade)
├── healthServiceImpl.ios.ts      (iOS implementation - STUB)
├── healthServiceImpl.android.ts  (Android implementation - STUB)
└── syncService.ts                (data sync orchestration - STUB)
```

**Create:** `apps/mobile-shell/src/services/health/healthService.ts`

```typescript
import { Platform } from 'react-native';
import { IHealthPlatformService, PermissionStatus, StepDataPoint } from '../../types/health.types';

// React Native automatically imports the correct platform file
let platformService: IHealthPlatformService;

if (Platform.OS === 'ios') {
  platformService = require('./healthServiceImpl.ios').default;
} else if (Platform.OS === 'android') {
  platformService = require('./healthServiceImpl.android').default;
} else {
  // Fallback for unsupported platforms
  platformService = {
    isAvailable: async () => false,
    requestPermissions: async () => PermissionStatus.Unavailable,
    fetchDailySteps: async () => [],
  };
}

// Public health service facade
class HealthService implements IHealthPlatformService {
  isAvailable = platformService.isAvailable;
  requestPermissions = platformService.requestPermissions;
  fetchDailySteps = platformService.fetchDailySteps;
}

export const healthService = new HealthService();
```

**Create STUB files** (will implement in next phases):

`healthServiceImpl.ios.ts`:
```typescript
import { IHealthPlatformService, PermissionStatus, StepDataPoint } from '../../types/health.types';

class HealthServiceIOS implements IHealthPlatformService {
  async isAvailable(): Promise<boolean> {
    // TODO: Implement in Phase 2
    return false;
  }

  async requestPermissions(): Promise<PermissionStatus> {
    // TODO: Implement in Phase 2
    return PermissionStatus.Unknown;
  }

  async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
    // TODO: Implement in Phase 2
    return [];
  }
}

export default new HealthServiceIOS();
```

`healthServiceImpl.android.ts`:
```typescript
import { IHealthPlatformService, PermissionStatus, StepDataPoint } from '../../types/health.types';

class HealthServiceAndroid implements IHealthPlatformService {
  async isAvailable(): Promise<boolean> {
    // TODO: Implement in Phase 3
    return false;
  }

  async requestPermissions(): Promise<PermissionStatus> {
    // TODO: Implement in Phase 3
    return PermissionStatus.Unknown;
  }

  async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
    // TODO: Implement in Phase 3
    return [];
  }
}

export default new HealthServiceAndroid();
```

`syncService.ts`:
```typescript
// TODO: Implement in Phase 4
export const syncRecentData = async () => {
  console.log('Sync service - to be implemented in Phase 4');
};
```

**Validation:**
- [ ] File structure created
- [ ] healthService.ts imports correctly
- [ ] Platform detection works (log Platform.OS)
- [ ] No import/build errors

---

### **Phase 2: iOS HealthKit Implementation** (6 hours, Risk: HIGH)

**Goal:** Complete iOS HealthKit integration

⚠️ **CRITICAL RISKS:**
- Xcode configuration issues (entitlements, provisioning)
- Missing Info.plist entries will cause crashes
- HealthKit unavailable on iPads

#### Task 2.1: Configure Xcode Project (1.5 hours, HIGH RISK)

**Step 1: Open Xcode**
```bash
open apps/mobile-shell/ios/MobileShell.xcworkspace
```

**Step 2: Enable HealthKit Capability**
1. Select **MobileShell** target
2. Go to **Signing & Capabilities** tab
3. Click **+ Capability**
4. Add **HealthKit**
5. Verify capability appears in the list

**Step 3: Update Info.plist**

Open `apps/mobile-shell/ios/MobileShell/Info.plist` and add:

```xml
<key>NSHealthShareUsageDescription</key>
<string>16BitFit needs access to your step count data to track your fitness progress and power your combat character's evolution.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>16BitFit may write workout data to your Health app to keep your fitness data synchronized.</string>
```

**Step 4: Verify Provisioning Profile**
- Ensure your Apple Developer account has HealthKit enabled
- Development certificate should automatically include HealthKit
- If using enterprise/distribution profiles, verify HealthKit is enabled

**Validation:**
- [ ] HealthKit capability visible in Xcode
- [ ] Info.plist entries added
- [ ] App builds successfully on iOS simulator
- [ ] No provisioning profile errors

#### Task 2.2: Implement iOS Availability Check (1 hour)

**Update:** `healthServiceImpl.ios.ts`

```typescript
import { IHealthPlatformService, PermissionStatus, StepDataPoint } from '../../types/health.types';
import { ServiceUnavailableError } from '../../types/health.errors';
import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
} from '@kingstinct/react-native-healthkit';

class HealthServiceIOS implements IHealthPlatformService {
  private readonly permissions: HealthKitPermissions = {
    read: ['StepCount'],
  };

  /**
   * Check if HealthKit is available on this device
   * NOTE: HealthKit is unavailable on iPads
   */
  async isAvailable(): Promise<boolean> {
    try {
      const available = await AppleHealthKit.isAvailable();
      return available;
    } catch (error) {
      console.warn('HealthKit availability check failed:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<PermissionStatus> {
    // TODO: Implement in next task
    return PermissionStatus.Unknown;
  }

  async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
    // TODO: Implement in next task
    return [];
  }
}

export default new HealthServiceIOS();
```

**Validation:**
- [ ] Code compiles
- [ ] `isAvailable()` returns `true` on iPhone simulator
- [ ] `isAvailable()` returns `false` on iPad (if tested)

#### Task 2.3: Implement iOS Permission Request (1.5 hours)

**Update:** `healthServiceImpl.ios.ts` - Add to class:

```typescript
/**
 * Request HealthKit permissions from user
 * CRITICAL: User may approve/deny individual permissions
 */
async requestPermissions(): Promise<PermissionStatus> {
  try {
    // Check availability first
    const available = await this.isAvailable();
    if (!available) {
      return PermissionStatus.Unavailable;
    }

    // Request permissions
    await AppleHealthKit.requestAuthorization(this.permissions);

    // Check if step count permission was granted
    // Note: HealthKit doesn't tell us if user denied, only if we have access
    const authStatus = await AppleHealthKit.getRequestStatusForAuthorization(
      this.permissions
    );

    // If we can query data, permission is granted
    if (authStatus === 'authorized') {
      return PermissionStatus.Granted;
    }

    // User likely denied
    return PermissionStatus.Denied;
  } catch (error) {
    console.error('HealthKit permission request failed:', error);
    return PermissionStatus.Denied;
  }
}
```

**Testing Instructions:**
1. Run app on iOS simulator
2. Trigger permission request
3. Verify iOS Health permission dialog appears
4. Test both "Allow" and "Don't Allow" scenarios

**Validation:**
- [ ] Permission dialog appears
- [ ] "Allow" returns `PermissionStatus.Granted`
- [ ] "Don't Allow" returns `PermissionStatus.Denied`
- [ ] No crashes

#### Task 2.4: Implement iOS Step Fetching (2 hours)

**Update:** `healthServiceImpl.ios.ts` - Add to class:

```typescript
/**
 * Fetch daily step counts for a date range
 * @param startDate - Start of range (inclusive)
 * @param endDate - End of range (inclusive)
 * @returns Array of daily step data points
 */
async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
  try {
    // Check availability and permissions first
    const available = await this.isAvailable();
    if (!available) {
      throw new ServiceUnavailableError('HealthKit unavailable on this device');
    }

    // Fetch step samples
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      period: 'day' as const, // Daily aggregation
    };

    const steps = await AppleHealthKit.getStepCount(options);

    // Transform to our data format
    const dataPoints: StepDataPoint[] = [];

    if (Array.isArray(steps)) {
      for (const sample of steps) {
        // Extract date in YYYY-MM-DD format
        const date = new Date(sample.startDate);
        const dateString = date.toISOString().split('T')[0];

        dataPoints.push({
          date: dateString,
          stepCount: Math.round(sample.value),
          source: 'HealthKit',
        });
      }
    } else if (steps && typeof steps === 'object' && 'value' in steps) {
      // Single result
      const date = new Date(steps.startDate);
      const dateString = date.toISOString().split('T')[0];

      dataPoints.push({
        date: dateString,
        stepCount: Math.round(steps.value),
        source: 'HealthKit',
      });
    }

    return dataPoints;
  } catch (error) {
    console.error('HealthKit step fetch failed:', error);
    throw error;
  }
}
```

**Testing Instructions:**
1. Open Health app on iOS simulator
2. Add manual step data:
   - Health → Browse → Activity → Steps → Add Data
   - Add 5000 steps for today
   - Add 3000 steps for yesterday
3. Run your app and fetch steps
4. Verify counts match

**Validation:**
- [ ] Fetches today's steps correctly
- [ ] Fetches historical steps (last 7 days)
- [ ] Data matches Health app
- [ ] Returns empty array if no data
- [ ] Handles errors gracefully

---

### **Phase 3: Android Health Connect Implementation** (6 hours, Risk: HIGH)

**Goal:** Complete Android Health Connect integration

⚠️ **CRITICAL RISKS:**
- Health Connect may not be installed (users must install from Play Store)
- Data aggregation required (raw records need daily totals)
- Manifest configuration must be precise

#### Task 3.1: Configure Android Project (1.5 hours)

**Update:** `apps/mobile-shell/android/app/src/main/AndroidManifest.xml`

Add inside `<manifest>` tag (before `<application>`):

```xml
<!-- Health Connect Permissions -->
<uses-permission android:name="android.permission.health.READ_STEPS"/>
<uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED"/>
<uses-permission android:name="android.permission.health.READ_EXERCISE"/>
```

Add inside `<application>` → `<activity>` tag:

```xml
<!-- Health Connect Permission Rationale -->
<intent-filter>
  <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
</intent-filter>
```

**Validation:**
- [ ] Manifest updated correctly
- [ ] App builds successfully on Android
- [ ] No manifest merge errors

#### Task 3.2: Implement Android Availability Check (1.5 hours, HIGH RISK)

**Update:** `healthServiceImpl.android.ts`

```typescript
import { IHealthPlatformService, PermissionStatus, StepDataPoint } from '../../types/health.types';
import { ServiceUnavailableError } from '../../types/health.errors';
import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

class HealthServiceAndroid implements IHealthPlatformService {
  private initialized = false;

  /**
   * Check if Health Connect is installed and available
   * CRITICAL: Health Connect is a separate app that must be installed
   */
  async isAvailable(): Promise<boolean> {
    try {
      const status = await getSdkStatus();

      // Health Connect is available
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        // Initialize if not done yet
        if (!this.initialized) {
          const initResult = await initialize();
          this.initialized = initResult;
        }
        return this.initialized;
      }

      // Health Connect not installed or outdated
      return false;
    } catch (error) {
      console.warn('Health Connect availability check failed:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<PermissionStatus> {
    // TODO: Next task
    return PermissionStatus.Unknown;
  }

  async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
    // TODO: Implement later
    return [];
  }
}

export default new HealthServiceAndroid();
```

**Testing Instructions:**
1. Run on Android emulator
2. Verify Health Connect installation:
   - If not installed: App should report unavailable
   - If installed: App should report available

**Validation:**
- [ ] Correctly detects Health Connect installation
- [ ] Returns `false` if not installed
- [ ] Returns `true` if installed
- [ ] Initializes successfully

#### Task 3.3: Implement Android Permission Request (1.5 hours)

**Update:** `healthServiceImpl.android.ts` - Add to class:

```typescript
/**
 * Request Health Connect permissions
 * Opens Health Connect permission dialog
 */
async requestPermissions(): Promise<PermissionStatus> {
  try {
    // Check availability first
    const available = await this.isAvailable();
    if (!available) {
      return PermissionStatus.Unavailable;
    }

    // Request step count read permission
    const permissions = [
      { accessType: 'read', recordType: 'Steps' },
    ];

    const granted = await requestPermission(permissions);

    // Check result
    if (granted) {
      return PermissionStatus.Granted;
    } else {
      return PermissionStatus.Denied;
    }
  } catch (error) {
    console.error('Health Connect permission request failed:', error);
    return PermissionStatus.Denied;
  }
}
```

**Testing Instructions:**
1. Run on Android device/emulator with Health Connect
2. Trigger permission request
3. Verify Health Connect permission screen appears
4. Test grant/deny scenarios

**Validation:**
- [ ] Permission dialog appears
- [ ] "Allow" returns `PermissionStatus.Granted`
- [ ] "Don't Allow" returns `PermissionStatus.Denied`

#### Task 3.4: Implement Android Step Fetching (1.5 hours)

**Update:** `healthServiceImpl.android.ts` - Add to class:

```typescript
/**
 * Fetch daily step counts for a date range
 * CRITICAL: Must aggregate raw step records into daily totals
 */
async fetchDailySteps(startDate: Date, endDate: Date): Promise<StepDataPoint[]> {
  try {
    // Check availability
    const available = await this.isAvailable();
    if (!available) {
      throw new ServiceUnavailableError('Health Connect unavailable');
    }

    // Fetch step records
    const records = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      },
    });

    // Aggregate by date (CRITICAL: Health Connect returns raw records)
    const dailyTotals = new Map<string, number>();

    for (const record of records) {
      // Extract date in YYYY-MM-DD format
      const date = new Date(record.startTime);
      const dateString = date.toISOString().split('T')[0];

      // Aggregate steps for this date
      const current = dailyTotals.get(dateString) || 0;
      dailyTotals.set(dateString, current + record.count);
    }

    // Convert to array
    const dataPoints: StepDataPoint[] = Array.from(dailyTotals.entries()).map(
      ([date, stepCount]) => ({
        date,
        stepCount: Math.round(stepCount),
        source: 'HealthConnect',
      })
    );

    // Sort by date (newest first)
    dataPoints.sort((a, b) => b.date.localeCompare(a.date));

    return dataPoints;
  } catch (error) {
    console.error('Health Connect step fetch failed:', error);
    throw error;
  }
}
```

**Testing Instructions:**
1. Use Health Connect Toolbox to inject test data
2. Add steps for today and yesterday
3. Fetch data and verify aggregation
4. Check daily totals match expectations

**Validation:**
- [ ] Fetches steps correctly
- [ ] Aggregates raw records into daily totals
- [ ] Data matches Health Connect app
- [ ] Returns empty array if no data

---

### **Phase 4: Data Synchronization** (5 hours, Risk: Medium)

**Goal:** Sync fetched data to Supabase and integrate with app lifecycle

#### Task 4.1: Implement Supabase Upload Logic (2 hours)

**Update:** `syncService.ts`

```typescript
import { supabase } from '../supabaseClient';
import { StepDataPoint } from '../../types/health.types';
import { SyncFailedError } from '../../types/health.errors';

/**
 * Upload step data to Supabase
 * Uses UPSERT to handle duplicates (idempotent)
 */
export async function uploadStepsToSupabase(
  dataPoints: StepDataPoint[]
): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new SyncFailedError('User not authenticated');
    }

    // Transform to database format
    const records = dataPoints.map(point => ({
      user_id: user.id,
      date: point.date,
      step_count: point.stepCount,
      source: point.source,
      synced_at: new Date().toISOString(),
    }));

    // Upsert (insert or update on conflict)
    const { error } = await supabase
      .from('user_steps')
      .upsert(records, {
        onConflict: 'user_id,date', // Based on unique constraint
        ignoreDuplicates: false, // Update if exists
      });

    if (error) {
      throw new SyncFailedError(`Supabase upload failed: ${error.message}`);
    }

    console.log(`Successfully synced ${records.length} days of step data`);
  } catch (error) {
    console.error('Step data upload failed:', error);
    throw error;
  }
}

/**
 * Sync recent health data (last 7 days)
 */
export async function syncRecentData(): Promise<void> {
  const { healthService } = await import('./health/healthService');
  const { useHealthStore } = await import('../../stores/healthStore');

  const store = useHealthStore.getState();

  try {
    // Start sync
    store.startSync();

    // Check availability
    const available = await healthService.isAvailable();
    if (!available) {
      store.setAvailability(false);
      throw new SyncFailedError('Health service unavailable');
    }
    store.setAvailability(true);

    // Check permissions
    const permissionStatus = await healthService.requestPermissions();
    store.setPermissionStatus(permissionStatus);

    if (permissionStatus !== 'Granted') {
      throw new SyncFailedError('Health permissions not granted');
    }

    // Calculate date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Fetch data
    const dataPoints = await healthService.fetchDailySteps(startDate, endDate);

    // Upload to Supabase
    if (dataPoints.length > 0) {
      await uploadStepsToSupabase(dataPoints);

      // Update store with today's steps
      const today = new Date().toISOString().split('T')[0];
      const todayData = dataPoints.find(p => p.date === today);
      if (todayData) {
        store.setDailySteps(todayData.stepCount, today);
      }
    }

    // Finish sync successfully
    store.finishSync();
  } catch (error) {
    // Finish sync with error
    const message = error instanceof Error ? error.message : 'Unknown error';
    store.finishSync(message);
    throw error;
  }
}
```

**Validation:**
- [ ] Data uploads to Supabase correctly
- [ ] Duplicate uploads update existing records (no duplication)
- [ ] Store state updates correctly
- [ ] Errors handled gracefully

#### Task 4.2: Integrate with App Lifecycle (1.5 hours)

**Update:** `apps/mobile-shell/App.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { syncRecentData } from './src/services/health/syncService';

// Throttle sync to prevent excessive API calls
const SYNC_THROTTLE_MS = 15 * 60 * 1000; // 15 minutes

function App(): JSX.Element {
  const lastSyncTime = useRef<number>(0);
  const appState = useRef(AppState.currentState);

  // Throttled sync function
  const performSync = async () => {
    const now = Date.now();
    if (now - lastSyncTime.current < SYNC_THROTTLE_MS) {
      console.log('Sync throttled - too soon since last sync');
      return;
    }

    try {
      lastSyncTime.current = now;
      await syncRecentData();
      console.log('Health data sync completed');
    } catch (error) {
      console.error('Health data sync failed:', error);
    }
  };

  // Initial sync on app launch
  useEffect(() => {
    performSync();
  }, []);

  // Sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to foreground - syncing health data');
        performSync();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
```

**Validation:**
- [ ] Sync triggers on app launch
- [ ] Sync triggers when app returns to foreground
- [ ] Sync throttled (not more than once per 15 min)
- [ ] No crashes on sync failures

---

## ⚠️ CRITICAL IMPLEMENTATION NOTES

### Platform-Specific Gotchas (READ CAREFULLY)

#### iOS HealthKit
1. **Crash on Missing Privacy Strings:** If `NSHealthShareUsageDescription` is missing from Info.plist, app will crash when requesting permissions
2. **iPad Compatibility:** HealthKit is NOT available on iPads - always check `isAvailable()` first
3. **Entitlements:** Must enable HealthKit capability in Xcode project
4. **Simulator Testing:** HealthKit WORKS in iOS Simulator - add data manually via Health app

#### Android Health Connect
1. **Separate App:** Health Connect must be installed from Play Store - check availability
2. **Data Aggregation:** Health Connect returns RAW records (e.g., 50 steps from 10:00-10:05). You MUST aggregate into daily totals
3. **Manifest Permissions:** Permissions must be declared in AndroidManifest.xml
4. **Permission Rationale:** Must include intent filter for permission explanation

### Common Pitfalls

1. **Data Duplication:** Ensure Supabase `upsert()` uses the unique constraint (user_id, date) for conflict resolution
2. **Timezone Issues:** Always use YYYY-MM-DD format immediately after fetching to avoid timezone misalignment
3. **Over-fetching:** Only fetch last 7 days - don't attempt to fetch entire history
4. **Permission Handling:** Always check permissions before fetching data
5. **Error Propagation:** Catch and log errors - don't let sync failures crash the app

---

## 🧪 TESTING STRATEGY

### Unit Testing (Optional but Recommended)

**Mock health services for testing:**
```typescript
jest.mock('../services/health/healthService');
```

### Platform Testing (REQUIRED)

#### iOS Testing
1. **Simulator:**
   - Open Health app on simulator
   - Browse → Activity → Steps → Add Data
   - Add test data for today and yesterday
   - Run app and verify data fetched correctly

2. **Physical Device:**
   - Use real step data from iPhone
   - Verify accuracy against Health app

#### Android Testing
1. **Emulator with Health Connect:**
   - Install Health Connect APK
   - Use Health Connect Toolbox to inject test data
   - Verify data fetching and aggregation

2. **Physical Device:**
   - Use real step data
   - Verify accuracy against Health Connect app

### Critical Edge Cases

Test these scenarios:
- [ ] Permission granted then revoked via OS settings
- [ ] Days with 0 steps
- [ ] Offline mode (sync fails gracefully)
- [ ] Health Connect not installed (Android)
- [ ] HealthKit unavailable (iPad)
- [ ] Multiple sync attempts (idempotent upsert)
- [ ] Time zone changes

---

## ✅ ACCEPTANCE CRITERIA CHECKLIST

| AC# | Criteria | Status |
|-----|----------|--------|
| AC1 | HealthKit (iOS) and Health Connect (Android) libraries integrated | ⬜ |
| AC2 | Permission request flow implemented | ⬜ |
| AC3 | Daily step count fetched on app launch/foregrounding | ⬜ |
| AC4 | Step data stored in user_profiles table | ⬜ |
| AC5 | Error handling for permission denial/sync failures | ⬜ |

---

## 📊 DEFINITION OF DONE

### Code Complete
- [ ] All phases 0-4 tasks completed
- [ ] iOS implementation working
- [ ] Android implementation working
- [ ] Sync service functional
- [ ] Store state management working

### Testing Complete
- [ ] iOS tested on simulator
- [ ] Android tested on emulator
- [ ] Physical device testing (iOS preferred)
- [ ] Edge cases tested
- [ ] Data accuracy validated

### Documentation Complete
- [ ] Story file updated with implementation notes
- [ ] Code comments added for complex logic
- [ ] Known issues documented

### Integration Complete
- [ ] Database migration applied
- [ ] TypeScript types regenerated
- [ ] App lifecycle integration working
- [ ] No crashes or build errors

---

## 🚀 EXECUTION TIMELINE

**Day 1 (8 hours):**
- [ ] Read documentation (2 hours)
- [ ] Phase 0: Backend preparation (1.5 hours)
- [ ] Phase 1: Shared foundation (3 hours)
- [ ] Start Phase 2: iOS HealthKit setup (1.5 hours)

**Day 2 (8 hours):**
- [ ] Complete Phase 2: iOS HealthKit (4.5 hours remaining)
- [ ] Phase 3: Android Health Connect (6 hours) - Start

**Day 3 (8 hours):**
- [ ] Complete Phase 3: Android (if needed)
- [ ] Phase 4: Data synchronization (5 hours)
- [ ] Testing and validation (3 hours)
- [ ] Documentation updates (1 hour)

---

## 🆘 IF YOU GET STUCK

### Common Issues & Solutions

**Issue:** iOS build fails after adding HealthKit
- **Solution:** Clean build folder in Xcode (Product → Clean Build Folder), delete Pods and reinstall

**Issue:** Android Health Connect permission dialog doesn't appear
- **Solution:** Check manifest permissions and intent filter are correct

**Issue:** Data not syncing to Supabase
- **Solution:** Check RLS policies, verify user authentication, check table exists

**Issue:** Step counts don't match platform health apps
- **Solution:** Verify date ranges, check timezone handling, ensure daily aggregation is correct

### Need Help?

1. Review Deep Think analysis: `Gemini Deep Think - Story 1.3 Implementation.md`
2. Check preparation guide: `docs/STORY_1.3_PREPARATION_GUIDE.md`
3. Reference existing patterns: `authService.ts` and `authStore.ts`
4. Ask backend/auth agent for database help
5. Ask architect for architecture/design questions

---

## 📞 FINAL NOTES

### What Success Looks Like

At the end of Story 1.3:
- ✅ iOS app fetches step data from HealthKit
- ✅ Android app fetches step data from Health Connect
- ✅ Data syncs to Supabase automatically
- ✅ Users can see their daily step count
- ✅ App handles errors gracefully

### Next Story Preview

**Story 1.4:** Onboarding Flow - Profile & Archetype Selection
- Will build UI for health permission requests
- Will use the health data to show fitness stats
- Your health service will be consumed by UI components

### Reminders

- 🔴 **iOS requires physical device for production testing**
- 🔴 **Android requires Health Connect installation**
- 🟡 **Test both permission grant and denial flows**
- 🟢 **Follow existing code patterns**
- 🟢 **Comment complex logic**
- 🟢 **Ask questions if unclear**

---

**Good luck! You've got this! 🚀**

**Estimated Completion:** 3 days (24 hours)
**Confidence Level:** High (with Deep Think analysis)
**Risk Mitigation:** Comprehensive testing strategy

---

*This handoff was prepared with comprehensive analysis from Google Deep Think and architectural guidance from the System Architect.*
