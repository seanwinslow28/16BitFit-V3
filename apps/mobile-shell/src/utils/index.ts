/**
 * Utility Functions
 * Common helper functions used throughout the app
 */

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
