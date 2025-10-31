/**
 * Shared utilities for Edge Functions
 * Common functions used across multiple edge functions
 */

export function corsHeaders(origin: string = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

export function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      status,
    }
  );
}

export function successResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      status,
    }
  );
}
