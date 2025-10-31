/**
 * Health Data Sync Service
 * Orchestrates fetching health data and syncing to Supabase
 * Story 1.3 - HealthKit/Connect Integration & Step Sync
 */

import { supabase } from '../supabaseClient';
import { StepDataPoint } from '../../types/health.types';
import { SyncFailedError } from '../../types/health.errors';
import { healthService } from './healthService';
import { useHealthStore } from '../../stores/healthStore';

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
