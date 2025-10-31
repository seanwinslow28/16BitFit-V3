/**
 * Record Workout Edge Function
 * Records workout data and calculates fitness metrics
 * Placeholder - will be implemented in workout tracking story
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  return new Response(
    JSON.stringify({
      message: 'Record Workout - Not yet implemented',
      status: 'placeholder',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
});
