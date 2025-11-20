/**
 * Avatar Generator Edge Function
 * 
 * Generates DMG Game Boy pixel art avatars using OpenAI's gpt-image-1 Image Edit API.
 * Takes user headshot and archetype, applies DMG styling while preserving identity.
 * 
 * Endpoint: POST /functions/v1/avatar-generator
 * Auth: Required (JWT)
 * 
 * Request body:
 * {
 *   "headshot_storage_path": "user-123/1234567890.png",
 *   "archetype": "trainer" | "runner" | "yogi" | "lifter" | "cyclist",
 *   "palette_mode": "dmg",  // Optional, default "dmg"
 *   "regen_reason": "initial_upload" | "retry" | "stage_evolution"  // Optional
 * }
 * 
 * Response (success):
 * {
 *   "status": "ok",
 *   "avatar_url": "https://..."
 * }
 * 
 * Response (error):
 * {
 *   "status": "error",
 *   "code": "ERROR_CODE",
 *   "message": "Human-readable error message"
 * }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  callOpenAIImageEditWithRetry,
  decodeBase64,
} from "../shared/openaiClient.ts";
import {
  buildDmgPixelArtPrompt,
  isValidArchetype,
  type ArchetypeType,
} from "../shared/avatarPrompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Request body validation
 */
interface AvatarGeneratorRequest {
  headshot_storage_path: string;
  archetype: string;
  palette_mode?: string;
  regen_reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  let userId: string | undefined;
  let archetype: string | undefined;

  try {
    // 1. Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 2. Verify JWT and extract user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({
          status: "error",
          code: "UNAUTHORIZED",
          message: "Missing authorization header",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("Invalid token:", authError);
      return new Response(
        JSON.stringify({
          status: "error",
          code: "UNAUTHORIZED",
          message: "Invalid or expired token",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    userId = user.id;

    // 3. Parse and validate request body
    let body: AvatarGeneratorRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({
          status: "error",
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      headshot_storage_path,
      archetype: rawArchetype,
      palette_mode = "dmg",
      regen_reason = "initial_upload",
    } = body;

    archetype = rawArchetype;

    // Validate required fields
    if (!headshot_storage_path || !archetype) {
      return new Response(
        JSON.stringify({
          status: "error",
          code: "INVALID_INPUT",
          message:
            "Missing required fields: headshot_storage_path and archetype are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate archetype
    if (!isValidArchetype(archetype)) {
      return new Response(
        JSON.stringify({
          status: "error",
          code: "INVALID_ARCHETYPE",
          message: `Invalid archetype: ${archetype}. Must be one of: trainer, runner, yogi, lifter, cyclist`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate palette mode (for now, only DMG is supported)
    if (palette_mode !== "dmg") {
      return new Response(
        JSON.stringify({
          status: "error",
          code: "INVALID_PALETTE_MODE",
          message: "Only 'dmg' palette mode is currently supported",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Avatar generation request:", {
      userId,
      archetype,
      palette_mode,
      regen_reason,
      headshot_storage_path,
    });

    // 4. Download headshot from Supabase Storage
    const { data: headshotData, error: downloadError } = await supabaseAdmin
      .storage
      .from("raw-headshots")
      .download(headshot_storage_path);

    if (downloadError || !headshotData) {
      console.error("Headshot download failed:", downloadError);
      return new Response(
        JSON.stringify({
          status: "error",
          code: "IMAGE_DOWNLOAD_FAILED",
          message: "Could not download headshot image. Please try uploading again.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Convert Blob to File for FormData
    const arrayBuffer = await headshotData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const imageFile = new File([bytes], "headshot.png", { type: "image/png" });

    console.log("Headshot downloaded:", {
      size: bytes.length,
      type: headshotData.type,
    });

    // 6. Build DMG pixel art prompt
    const prompt = buildDmgPixelArtPrompt({
      archetype: archetype as ArchetypeType,
      extraContext: `Generation reason: ${regen_reason}`,
    });

    console.log("Prompt generated:", {
      length: prompt.length,
      archetype,
    });

    // 7. Construct FormData for OpenAI Image Edit API
    const formData = new FormData();
    formData.append("model", "gpt-image-1");
    formData.append("prompt", prompt);
    formData.append("image", imageFile);
    formData.append("size", "1024x1024");
    formData.append("quality", "medium"); // Use "high" if quality is insufficient
    formData.append("output_format", "png");
    formData.append("response_format", "b64_json");

    // 8. Call OpenAI with retry logic and timeout
    console.log("Calling OpenAI Image Edit API...");
    const openAiStartTime = Date.now();

    let openAiResponse;
    try {
      openAiResponse = await callOpenAIImageEditWithRetry(
        formData,
        1, // maxRetries
        45000 // 45s timeout
      );
    } catch (error) {
      console.error("OpenAI image edit failed:", error);
      return new Response(
        JSON.stringify({
          status: "error",
          code: "IMAGE_EDIT_FAILED",
          message:
            "Avatar generation failed. Please try again or use a different photo.",
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openAiDuration = Date.now() - openAiStartTime;
    console.log("OpenAI call succeeded:", {
      duration: `${openAiDuration}ms`,
      usage: openAiResponse.usage,
    });

    // 9. Decode base64 avatar
    const b64 = openAiResponse.data?.[0]?.b64_json;
    if (!b64) {
      console.error("OpenAI response missing b64_json:", openAiResponse);
      throw new Error("OpenAI response missing b64_json");
    }

    const avatarBytes = decodeBase64(b64);
    console.log("Avatar decoded:", { size: avatarBytes.length });

    // 10. Upload to Supabase Storage (avatars bucket)
    const avatarPath = `user-${userId}/${Date.now()}-dmg.png`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(avatarPath, avatarBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError);
      return new Response(
        JSON.stringify({
          status: "error",
          code: "AVATAR_UPLOAD_FAILED",
          message: "Could not save generated avatar. Please try again.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Avatar uploaded to storage:", avatarPath);

    // 11. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(avatarPath);

    const avatarUrl = publicUrlData?.publicUrl;

    if (!avatarUrl) {
      console.error("Failed to generate public URL");
      throw new Error("Failed to generate public URL");
    }

    // 12. Update user profile
    const { error: dbError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        home_avatar_url: avatarUrl,
        avatar_generation_attempts: supabaseAdmin.raw(
          "COALESCE(avatar_generation_attempts, 0) + 1"
        ),
        avatar_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (dbError) {
      console.error("Profile update failed:", dbError);
      // Don't fail the request if DB update fails, avatar is already generated
      // Just log the error
    }

    const totalDuration = Date.now() - startTime;
    console.log("Avatar generation complete:", {
      userId,
      archetype,
      totalDuration: `${totalDuration}ms`,
      avatarUrl,
    });

    // 13. Success response
    return new Response(
      JSON.stringify({
        status: "ok",
        avatar_url: avatarUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error in avatar generation:", {
      userId,
      archetype,
      error: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({
        status: "error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
