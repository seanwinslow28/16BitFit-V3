# Story 1.3 - HealthKit/Connect Integration - Preparation Guide

**Story:** 1.3 - HealthKit/Connect Integration & Step Sync
**Epic:** 1 - Foundation & Core Loop Setup
**Story Points:** 8
**Prerequisites:** Story 1.2 (Supabase Backend) ✅ COMPLETE

---

## 📋 Story Overview

### Objective
Integrate platform-specific health APIs (Apple HealthKit for iOS, Google Fit via Health Connect for Android) to request permissions and sync daily step count data into the application.

### User Story
> **As a** Developer,
> **I want** to integrate platform-specific health APIs (Apple HealthKit, Google Fit via Health Connect) to request permissions and sync daily step count data,
> **so that** real-world fitness activity can be brought into the application.

### Success Criteria
- [ ] Health libraries integrated for iOS and Android
- [ ] User permission flow implemented
- [ ] Daily step count fetching works
- [ ] Step data stored in user profile
- [ ] Error handling for permission denial/sync failures

---

## 🎯 Acceptance Criteria

| # | Criteria | Priority | Complexity |
|---|----------|----------|------------|
| AC1 | Necessary libraries/modules for HealthKit (iOS) and Health Connect API (Android) are integrated | 🔴 Critical | Medium |
| AC2 | The application correctly requests user permission to read step count data upon first relevant interaction | 🔴 Critical | Medium |
| AC3 | Step count data for the current day is successfully fetched upon app launch/foregrounding (if permission granted) | 🔴 Critical | High |
| AC4 | Fetched step count is stored or updated in the user's profile/state | 🟡 Important | Low |
| AC5 | Basic error handling is implemented for permission denial or sync failures | 🟡 Important | Medium |

---

## 🏗️ Technical Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App Layer                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────┐      ┌────────────────────┐   │
│  │  healthStore.ts    │◄────►│  healthService.ts  │   │
│  │  (Zustand State)   │      │  (Platform Logic)  │   │
│  └────────────────────┘      └────────────────────┘   │
│           │                            │               │
│           ▼                            ▼               │
│  ┌────────────────────────────────────────────────┐   │
│  │           Platform Health APIs                  │   │
│  │  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │   iOS HealthKit  │  │ Android Health   │   │   │
│  │  │   Native Bridge  │  │ Connect Bridge   │   │   │
│  │  └──────────────────┘  └──────────────────┘   │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│                   Supabase Backend                     │
├────────────────────────────────────────────────────────┤
│  user_profiles table:                                  │
│    - daily_steps (INTEGER)                             │
│    - daily_calories (INTEGER)                          │
│    - daily_workout_minutes (INTEGER)                   │
│    - health_data_last_synced (TIMESTAMPTZ)            │
│    - health_permissions_granted (BOOLEAN)              │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Libraries to Install

### iOS - HealthKit

**Recommended Library:** `@kingstinct/react-native-healthkit`

**Why:**
- Modern, actively maintained
- TypeScript support
- Works with New Architecture
- Better API design than alternatives

**Alternative:** `react-native-health` (older, stable)

### Android - Health Connect

**Library:** `react-native-health-connect`

**Note:** Health Connect is Google's unified health API (replaced Google Fit)

---

## 🛠️ Implementation Tasks

### Phase 1: Library Installation & Configuration (2-3 hours)

#### Task 1.1: Install iOS HealthKit Library
```bash
cd apps/mobile-shell
npm install @kingstinct/react-native-healthkit --save

# iOS pods
cd ios
pod install
cd ..
```

#### Task 1.2: Configure iOS Project
**File:** `apps/mobile-shell/ios/MobileShell/Info.plist`
```xml
<key>NSHealthShareUsageDescription</key>
<string>16BitFit needs access to your health data to track your fitness progress and power your combat character.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>16BitFit may write workout data to your Health app.</string>
```

**File:** `apps/mobile-shell/ios/MobileShell/MobileShell.entitlements`
```xml
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.access</key>
<array/>
```

Enable HealthKit capability in Xcode:
1. Open `apps/mobile-shell/ios/MobileShell.xcworkspace`
2. Select MobileShell target
3. Signing & Capabilities → + Capability → HealthKit

#### Task 1.3: Install Android Health Connect Library
```bash
npm install react-native-health-connect --save
```

#### Task 1.4: Configure Android Project
**File:** `apps/mobile-shell/android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.health.READ_STEPS"/>
<uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED"/>
<uses-permission android:name="android.permission.health.READ_EXERCISE"/>

<!-- Health Connect Intent Filter -->
<activity android:name=".MainActivity">
  <intent-filter>
    <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
  </intent-filter>
</activity>
```

---

### Phase 2: Create Health Service (3-4 hours)

#### Task 2.1: Create Health Service Interface

**File:** `apps/mobile-shell/src/services/healthService.ts`

**Key Functions to Implement:**
```typescript
// Permission Management
export const requestHealthPermissions = async (): Promise<HealthPermissions>

// Data Fetching
export const getDailySteps = async (date?: Date): Promise<number>
export const getDailyCalories = async (date?: Date): Promise<number>
export const getDailyWorkoutMinutes = async (date?: Date): Promise<number>
export const getDailyHealthData = async (date?: Date): Promise<DailyHealthData>

// Sync
export const syncHealthDataToProfile = async (): Promise<void>

// Utilities
export const isHealthAvailable = (): boolean
export const openHealthSettings = (): Promise<void>
```

**Platform Detection:**
```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // Use @kingstinct/react-native-healthkit
} else if (Platform.OS === 'android') {
  // Use react-native-health-connect
}
```

#### Task 2.2: iOS HealthKit Implementation
```typescript
import {
  requestAuthorization,
  queryQuantitySamples,
  HKQuantityTypeIdentifier,
} from '@kingstinct/react-native-healthkit';

// Request permissions
const requestIOSPermissions = async () => {
  const permissions = {
    read: [
      HKQuantityTypeIdentifier.stepCount,
      HKQuantityTypeIdentifier.activeEnergyBurned,
      // ... other data types
    ],
  };
  return await requestAuthorization(permissions);
};

// Fetch steps
const getIOSSteps = async (date: Date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const samples = await queryQuantitySamples(
    HKQuantityTypeIdentifier.stepCount,
    { from: startOfDay, to: endOfDay }
  );

  return samples.reduce((total, sample) => total + sample.quantity, 0);
};
```

#### Task 2.3: Android Health Connect Implementation
```typescript
import {
  initialize,
  requestPermission,
  readRecords,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

// Check availability
const checkAndroidHealthConnect = async () => {
  const availability = await getSdkStatus();
  return availability === SdkAvailabilityStatus.SDK_AVAILABLE;
};

// Request permissions
const requestAndroidPermissions = async () => {
  return await requestPermission([
    { accessType: 'read', recordType: 'Steps' },
    { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  ]);
};

// Fetch steps
const getAndroidSteps = async (date: Date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const records = await readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: startOfDay.toISOString(),
      endTime: endOfDay.toISOString(),
    },
  });

  return records.reduce((total, record) => total + record.count, 0);
};
```

---

### Phase 3: Create Health Store (1-2 hours)

#### Task 3.1: Zustand Health Store

**File:** `apps/mobile-shell/src/stores/healthStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as healthService from '../services/healthService';

interface HealthState {
  // Permissions
  isAuthorized: boolean;
  permissions: HealthPermissions | null;

  // Data
  dailySteps: number;
  dailyCalories: number;
  dailyWorkoutMinutes: number;
  lastSyncTime: Date | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  requestPermissions: () => Promise<boolean>;
  syncDailyData: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthorized: false,
      permissions: null,
      dailySteps: 0,
      dailyCalories: 0,
      dailyWorkoutMinutes: 0,
      lastSyncTime: null,
      isLoading: false,
      error: null,

      // Actions
      requestPermissions: async () => {
        set({ isLoading: true, error: null });
        try {
          const permissions = await healthService.requestHealthPermissions();
          set({
            isAuthorized: permissions.steps,
            permissions,
            isLoading: false
          });
          return permissions.steps;
        } catch (error) {
          set({
            error: 'Failed to request permissions',
            isLoading: false
          });
          return false;
        }
      },

      syncDailyData: async () => {
        const { isAuthorized } = get();
        if (!isAuthorized) return;

        set({ isLoading: true, error: null });
        try {
          const data = await healthService.getDailyHealthData();
          set({
            dailySteps: data.steps,
            dailyCalories: data.caloriesBurned,
            dailyWorkoutMinutes: data.workoutMinutes,
            lastSyncTime: new Date(),
            isLoading: false
          });

          // Sync to Supabase
          await healthService.syncHealthDataToProfile();
        } catch (error) {
          set({
            error: 'Failed to sync health data',
            isLoading: false
          });
        }
      },

      refreshData: async () => {
        await get().syncDailyData();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: '16bitfit-health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

### Phase 4: Database Schema Updates (30 minutes)

#### Task 4.1: Create Migration

**File:** `supabase/migrations/[timestamp]_add_health_fields.sql`

```sql
-- Add health data fields to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS daily_steps INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_calories INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_workout_minutes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_data_last_synced TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS health_permissions_granted BOOLEAN DEFAULT false;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_health_sync
  ON public.user_profiles(health_data_last_synced)
  WHERE health_permissions_granted = true;

-- Update RLS policies (if needed)
-- Users should be able to update their own health data
ALTER POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id OR auth_status = 'deferred');
```

#### Task 4.2: Apply Migration
```bash
# Using Supabase MCP tool
supabase migrations apply
```

---

### Phase 5: Integration & Testing (2-3 hours)

#### Task 5.1: App Lifecycle Integration

**Add to App.tsx or Root Component:**
```typescript
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useHealthStore } from './stores/healthStore';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      // Sync when app comes to foreground
      useHealthStore.getState().syncDailyData();
    }
  });

  // Initial sync
  useHealthStore.getState().syncDailyData();

  return () => subscription.remove();
}, []);
```

#### Task 5.2: Permission Flow UI (Simple)

Create a simple screen or modal to request permissions:
```typescript
const HealthPermissionScreen = () => {
  const { requestPermissions, isLoading } = useHealthStore();

  return (
    <View>
      <Text>Track Your Fitness</Text>
      <Text>16BitFit needs access to your step count to power your character</Text>
      <Button
        title="Enable Health Tracking"
        onPress={requestPermissions}
        loading={isLoading}
      />
      <Button title="Skip for Now" onPress={handleSkip} />
    </View>
  );
};
```

#### Task 5.3: Manual Testing

**iOS Testing:**
1. Must test on **physical device** (HealthKit doesn't work in simulator)
2. Generate health data using Health app
3. Test permission flow
4. Verify data sync

**Android Testing:**
1. Install Health Connect app from Play Store
2. Add test data via Health Connect
3. Test permission flow
4. Verify data sync

---

## 🧪 Testing Strategy

### Manual Test Cases

#### Test 1: Permission Request
- [ ] Permission prompt appears with correct message
- [ ] Granting permission updates store state
- [ ] Denying permission is handled gracefully

#### Test 2: Data Fetching
- [ ] Step count fetched correctly for current day
- [ ] Data updates when app comes to foreground
- [ ] Historical data can be fetched

#### Test 3: Data Persistence
- [ ] Health data synced to Supabase
- [ ] Data persists in local store
- [ ] Last sync timestamp accurate

#### Test 4: Error Handling
- [ ] No health app installed (Android)
- [ ] Permissions denied
- [ ] Network failure during sync
- [ ] Health API unavailable

### Automated Tests (Optional)

```typescript
// Mock health service
jest.mock('../services/healthService');

describe('healthStore', () => {
  it('requests permissions correctly', async () => {
    const { result } = renderHook(() => useHealthStore());
    await act(() => result.current.requestPermissions());
    expect(result.current.isAuthorized).toBe(true);
  });

  it('syncs daily data', async () => {
    const { result } = renderHook(() => useHealthStore());
    await act(() => result.current.syncDailyData());
    expect(result.current.dailySteps).toBeGreaterThan(0);
  });
});
```

---

## ⚠️ Known Challenges

### iOS Challenges
1. **Physical Device Required**: HealthKit doesn't work in simulator
2. **App Review**: Apple reviews health apps carefully - need privacy policy
3. **Background Sync**: Requires additional configuration for background updates

### Android Challenges
1. **Health Connect Availability**: Not all devices have it installed
2. **Fragmentation**: Different Android versions, different capabilities
3. **App Installation**: Users must install Health Connect separately

### Cross-Platform Challenges
1. **Different APIs**: iOS and Android have different data models
2. **Permission Models**: Different permission systems
3. **Data Granularity**: Different levels of detail available

---

## 📊 Success Metrics

**Story 1.3 is complete when:**
- [ ] All 5 acceptance criteria met
- [ ] Libraries installed and configured
- [ ] Health service implemented for both platforms
- [ ] Health store created with persistence
- [ ] Database migration applied
- [ ] Manual testing passed on physical devices
- [ ] Error handling covers all edge cases
- [ ] Documentation updated

---

## 🎯 Definition of Done

### Code Complete
- [ ] Health service implemented
- [ ] Health store created
- [ ] Platform-specific code tested
- [ ] Error handling comprehensive

### Testing Complete
- [ ] Manual testing on iOS physical device
- [ ] Manual testing on Android device
- [ ] Permission flows tested
- [ ] Data sync validated
- [ ] Edge cases covered

### Documentation Complete
- [ ] Story documentation updated
- [ ] API documentation written
- [ ] Usage examples provided
- [ ] Known issues documented

### Integration Complete
- [ ] App lifecycle hooks added
- [ ] Database migration applied
- [ ] Supabase sync working
- [ ] UI integration points identified (for Story 1.4)

---

## 🚀 Getting Started

### Quick Start Checklist

**Day 1: Setup & iOS**
- [ ] Install iOS HealthKit library
- [ ] Configure Xcode project
- [ ] Enable HealthKit capability
- [ ] Implement iOS health service
- [ ] Test on physical iPhone

**Day 2: Android**
- [ ] Install Health Connect library
- [ ] Configure Android manifest
- [ ] Implement Android health service
- [ ] Test on physical Android device

**Day 3: Integration**
- [ ] Create health store
- [ ] Apply database migration
- [ ] Add app lifecycle hooks
- [ ] Create permission UI
- [ ] Test end-to-end flow

---

## 📞 Resources

### Documentation Links
- **HealthKit:** https://developer.apple.com/documentation/healthkit
- **Health Connect:** https://developer.android.com/health-and-fitness/guides/health-connect
- **@kingstinct/react-native-healthkit:** https://github.com/Kingstinct/react-native-healthkit
- **react-native-health-connect:** https://github.com/matinzd/react-native-health-connect

### Story Files
- **Story Definition:** [docs/stories/1.3.healthkit-integration.story.md](stories/1.3.healthkit-integration.story.md)
- **This Guide:** [docs/STORY_1.3_PREPARATION_GUIDE.md](STORY_1.3_PREPARATION_GUIDE.md)

---

## 💡 Tips for Success

1. **Start with iOS**: HealthKit is more mature and stable
2. **Use Physical Devices**: Simulators don't support health APIs
3. **Test Edge Cases**: Permission denial, no health app, etc.
4. **Keep It Simple**: Focus on step count first, expand later
5. **Document Assumptions**: Health APIs have quirks - document them

---

**Prepared By:** System Architect
**Date:** October 28, 2025
**Ready to Start:** ✅ YES - Story 1.2 Complete

**Let's build an awesome health integration! 🏃‍♂️💪**
