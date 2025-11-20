Totally doable, and using gpt-image-1 for the MVP is a solid call before you go full Stable Diffusion \+ LoRA later.

Below is a **copy‑pasteable prompt for your IDE agent** that:

* Explains the **workflow** for avatar generation with `gpt-image-1` \+ `images.edit`

* Assumes your backend is the **Supabase Edge Function** `apps/supabase-functions/avatar-generator/`

* Uses your React Native **mobile shell** as the client

* Includes a **universal style template** and a **hyper-detailed DMG Game Boy pixel art template**

After the big prompt, I’ll add a quick “sources” section so you can see where the technical constraints came from.

---

## **Prompt for your IDE Agent**

You can copy everything in this block straight into your IDE/code agent:

`You are an IDE/code assistant working in the 16BitFit-V3 monorepo.`

`## High-level goal`

`Implement an MVP avatar generation pipeline that:`

`1. Takes a **user headshot** (uploaded from the React Native mobile app),`  
``2. Sends it to a **Supabase Edge Function** (`apps/supabase-functions/avatar-generator/index.ts`),``  
``3. That Edge Function calls **OpenAI’s gpt-image-1** via the **Image Edit API (`images.edit`)**,``  
`4. Applies a **DMG Game Boy pixel-art style** to the user’s face while keeping identity recognizable,`  
``5. Stores the final avatar in **Supabase Storage** and updates `home_avatar_url` in the DB,``  
`6. Returns the avatar URL to the client.`

`In the future, this pipeline should be swappable for Stable Diffusion + LoRA without changing the mobile app contract, so design around an abstraction.`

`---`

`## 0. Constraints & assumptions`

`Respect the project’s architecture:`

``- Frontend: `apps/mobile-shell/` (React Native)``  
`` - Backend: Supabase Edge Functions in `apps/supabase-functions/` ``  
`- DB/Auth/Storage: Supabase (Postgres + Storage)`  
``- There is or will be a `user_profiles` table with a `home_avatar_url` field used by the Home Screen.``

`When you create new files, follow the architecture doc’s conventions:`  
`` - Edge functions live under `apps/supabase-functions/<feature>/index.ts` ``  
`` - Shared utilities go under `apps/supabase-functions/shared/` ``

`---`

`## 1. Environment & configuration`

`### 1.1. OpenAI config`

`1. Add an environment variable in the Supabase project for the OpenAI API key:`

   ``- `OPENAI_API_KEY` – the secret API key for OpenAI.``

``2. In `apps/supabase-functions/shared/` create a file:``

   `` - `openaiClient.ts` ``

   ``Contents (Deno-compatible, using `fetch` + `FormData`):``

   `- Export:`

     `` - `OPENAI_API_BASE = "https://api.openai.com/v1";` ``  
     `` - `OPENAI_IMAGE_EDIT_ENDPOINT = OPENAI_API_BASE + "/images/edits";` ``  
     ``- A helper `getOpenAIApiKey()` that reads `Deno.env.get("OPENAI_API_KEY")` and throws a clear error if missing.``

   `- Export a helper:`

     ```` ```ts ````  
     `export async function callOpenAIImageEdit(formData: FormData): Promise<any> {`  
       `const apiKey = getOpenAIApiKey();`

       `const res = await fetch(OPENAI_IMAGE_EDIT_ENDPOINT, {`  
         `method: "POST",`  
         `headers: {`  
           ``"Authorization": `Bearer ${apiKey}`,``  
         `},`  
         `body: formData,`  
       `});`

       `if (!res.ok) {`  
         `const text = await res.text();`  
         `console.error("OpenAI image edit error:", res.status, text);`  
         ``throw new Error(`OpenAI image edit failed: ${res.status}`);``  
       `}`

       `return await res.json();`  
     `}`  
     ```` ``` ````

   `- This helper will be used by the avatar generator function.`

`3. Ensure Supabase Edge Functions are configured to allow outbound HTTPS requests.`

`---`

`## 2. API contract between mobile app and avatar-generator function`

`Create or enforce a **single POST endpoint**:`

`` - Supabase Edge Function name: `avatar-generator` ``  
`- Path: exposed via Supabase’s standard function URL, e.g.`  
  `` - `/functions/v1/avatar-generator` ``

`### 2.1. Request payload (from mobile)`

`The mobile app should send JSON like:`

```` ```json ````  
`{`  
  `"headshot_storage_path": "raw-headshots/user-123/2025-11-18-1.png",`  
  `"archetype": "trainer",`  
  `"palette_mode": "dmg",`   
  `"regen_reason": "initial_upload"`   
`}`

Fields:

* `headshot_storage_path`: Supabase Storage path to the user’s uploaded headshot image.

* `archetype`: one of the Fitness Archetypes (e.g. `"trainer"`, `"runner"`, etc.).

* `palette_mode`: `"dmg"` for this MVP (we only support DMG).

* `regen_reason`: optional string for logging (e.g., `"initial_upload"`, `"stage2_evolution"`).

The user identity should **come from the JWT** (Supabase Auth) rather than being passed in the body.

### **2.2. Response payload**

On success:

`{`  
  `"status": "ok",`  
  `"avatar_url": "<public_or_signed_url_to_avatar>"`  
`}`

On recoverable error:

`{`  
  `"status": "error",`  
  `"code": "IMAGE_EDIT_FAILED",`  
  `"message": "Human-readable error."`  
`}`

HTTP status:

* `200` for success,

* `4xx` for client-side issues (invalid input, missing image),

* `5xx` for server-side errors (OpenAI failure, storage failure).

---

## **3\. Implement the avatar-generator Edge Function**

Create/modify:  
 `apps/supabase-functions/avatar-generator/index.ts`

### **3.1. Basic function skeleton**

* Use the standard Supabase Edge Function template:

  * Parse CORS.

  * Initialize Supabase Admin client with service role key.

  * Validate JWT and identify user.

  * Read and validate JSON body (use Zod if available).

### **3.2. Steps inside the handler**

**Step 1 – Parse and validate input**

* Required: `headshot_storage_path`, `archetype`.

* Optional: `palette_mode` (default `"dmg"`), `regen_reason`.

Reject requests if:

* `headshot_storage_path` is missing or not in expected bucket.

* `archetype` is not one of the allowed enum values.

* User is not authenticated.

**Step 2 – Fetch the input headshot from Supabase Storage**

* Assume headshots are stored in a bucket like `raw-headshots`.

Use the Supabase Storage admin client to:

 `const { data, error } = await supabaseAdmin`  
  `.storage`  
  `.from("raw-headshots")`  
  `.download(headshot_storage_path_relative_to_bucket);`

*   
* If `error` or `data` is null, return a 400 or 500 with `IMAGE_NOT_FOUND`.

Convert the download result to a `Uint8Array` or `ArrayBuffer` so you can wrap it in a `File`:

 `const arrayBuffer = await data.arrayBuffer();`  
`const bytes = new Uint8Array(arrayBuffer);`

`const imageFile = new File(`  
  `[bytes],`  
  `"headshot.png",`  
  `{ type: "image/png" }`  
`);`

* 

**Step 3 – Build the DMG Game Boy pixel-art prompt**

Use the **Universal Style Template** and the **DMG Game Boy Pixel Art Style Template** defined in section 5 & 6 below. Construct a final prompt string like:

`const prompt = buildDmgPixelArtPrompt({`  
  `archetype,`  
  `extraContext: "Home Avatar portrait for 16BitFit SBFG game UI."`  
`});`

Where `buildDmgPixelArtPrompt` is a helper you will create in  
 `apps/supabase-functions/shared/avatarPrompts.ts`.

**Step 4 – Construct the OpenAI Image Edit API request**

* Use the `gpt-image-1` model with the **Image Edit API** (`images.edit`).

* For **this MVP**, we only use **one input image**: the user’s headshot.

Call structure (semantically):

* HTTP method: `POST`

* URL: `https://api.openai.com/v1/images/edits`

* Auth header: `Authorization: Bearer <OPENAI_API_KEY>`

* Body: `multipart/form-data` via `FormData`:

   Fields to send:

  * `model`: `"gpt-image-1"`

  * `prompt`: the detailed DMG prompt string.

  * `image`: the `File` object created from the user headshot.

  * `size`: `"1024x1024"`

    * gpt-image-1 supports `"1024x1024"`, `"1536x1024"`, `"1024x1536"`, or `"auto"`; we standardize on `"1024x1024"` for avatars.

  * `quality`: `"medium"` or `"high"` (start with `"medium"` for latency vs. quality).

  * `output_format`: `"png"` (pixel art \+ potential transparency).

  * `response_format`: `"b64_json"` (so we get base64 bytes in the JSON).

Implementation in Deno:

`import { callOpenAIImageEdit } from "../shared/openaiClient.ts";`

`const formData = new FormData();`  
`formData.append("model", "gpt-image-1");`  
`formData.append("prompt", prompt);`  
`formData.append("size", "1024x1024");`  
`formData.append("quality", "medium");`  
`formData.append("output_format", "png");`  
`formData.append("response_format", "b64_json");`  
`formData.append("image", imageFile); // File created from headshot bytes`

`const openAiResponse = await callOpenAIImageEdit(formData);`

Expect the response schema (from OpenAI’s Images API) to include:

* `data[0].b64_json`: base64-encoded PNG bytes.

* `data[0].revised_prompt` (optional; ignore for now).

* `usage` with token counts (optional; you can log this for metrics).

**Step 5 – Decode and upload avatar to Supabase Storage**

Decode base64:

 `const b64 = openAiResponse.data?.[0]?.b64_json;`  
`if (!b64) throw new Error("OpenAI response missing b64_json");`

`const avatarBytes = Uint8Array.from(`  
  `atob(b64),`  
  `(c) => c.charCodeAt(0)`  
`);`

1. 

Upload to a dedicated bucket, e.g. `avatars`:

 ``const avatarPath = `user-${userId}/${Date.now()}-dmg.png`;``

`const { error: uploadError } = await supabaseAdmin`  
  `.storage`  
  `.from("avatars")`  
  `.upload(avatarPath, avatarBytes, {`  
    `contentType: "image/png",`  
    `upsert: true,`  
  `});`

`if (uploadError) {`  
  ``throw new Error(`Avatar upload failed: ${uploadError.message}`);``  
`}`

2.   
3. Get a public or signed URL:

For MVP, public URL is fine:

 `const { data: publicUrlData } = supabaseAdmin`  
  `.storage`  
  `.from("avatars")`  
  `.getPublicUrl(avatarPath);`

`const avatarUrl = publicUrlData?.publicUrl;`

* 

**Step 6 – Update DB and respond**

Update the user profile row (assuming `user_profiles` table and `home_avatar_url` column):

 `const { error: dbError } = await supabaseAdmin`  
  `.from("user_profiles")`  
  `.update({`  
    `home_avatar_url: avatarUrl,`  
    `updated_at: new Date().toISOString(),`  
  `})`  
  `.eq("user_id", userId);`

`if (dbError) {`  
  ``throw new Error(`DB update failed: ${dbError.message}`);``  
`}`

1. 

Return JSON:

 `return new Response(`  
  `JSON.stringify({ status: "ok", avatar_url: avatarUrl }),`  
  `{`  
    `status: 200,`  
    `headers: { "Content-Type": "application/json" },`  
  `}`  
`);`

2. 

**Step 7 – Error handling**

* For any error in:

  * Input validation → return 400 with an error code (e.g. `INVALID_INPUT`).

  * Supabase download → 404 or 500 with `IMAGE_DOWNLOAD_FAILED`.

  * OpenAI call → 502 with `IMAGE_EDIT_FAILED`.

  * Storage upload → 500 with `AVATAR_UPLOAD_FAILED`.

  * DB update → 500 with `PROFILE_UPDATE_FAILED`.

* Always log:

  * `userId`, `archetype`, `palette_mode`, `regen_reason`, truncated OpenAI error, and timing.

---

## **4\. Frontend (React Native) integration outline**

You do not need to fully implement the frontend, but the backend contract should anticipate:

1. **User selects or takes a headshot** in `apps/mobile-shell` using the existing or future image picker.

2. The app uploads the image to Supabase Storage bucket `raw-headshots` and gets the storage path.

The app calls the Edge Function `avatar-generator` with:

 `{`  
  `headshot_storage_path: "...",`  
  `archetype: selectedArchetype,`  
  `palette_mode: "dmg",`  
  `regen_reason: "initial_upload"`  
`}`

3.   
4. The app receives `{ avatar_url }` and stores it in local state; the Home Screen uses that URL for the Home Avatar image.

Make sure the backend’s JSON schema is stable and documented so that future Stable Diffusion/LoRA implementation can reuse the same contract.

---

## **5\. Universal Image Edit Prompt Template (for future styles)**

Create `apps/supabase-functions/shared/avatarPrompts.ts` with:

`export function buildUniversalStylePrompt(options: {`  
  `styleDescription: string;`  
  `backgroundDescription: string;`  
  `renderingDescription: string;`  
  `useCaseDescription?: string;`  
`}) {`  
  `const {`  
    `styleDescription,`  
    `backgroundDescription,`  
    `renderingDescription,`  
    `useCaseDescription = "This will be used as a game avatar inside a retro fitness RPG.",`  
  `} = options;`

  `` return ` ``  
`Use the input image as the base and KEEP THE SAME PERSON, identity, and facial structure.`

`Identity & composition constraints:`  
`- Preserve the same person, face, eyes, nose, mouth, jawline, and hairstyle as in the input photo.`  
`- Do NOT change their age, ethnicity, body type, or gender presentation.`  
`- Maintain the same camera angle and general pose from the input.`  
`- Keep the expression very similar unless the style explicitly requires a small change.`  
`- Avoid dramatic pose changes, cropping, or rotations unless absolutely necessary for the style.`

`Goal:`  
`- Restyle this image as: ${styleDescription}`

`Background:`  
`- ${backgroundDescription}`

`Rendering & visual style:`  
`- ${renderingDescription}`

`Use case:`  
`- ${useCaseDescription}`

`Constraints:`  
`- Do NOT add text, logos, UI elements, or interface chrome.`  
`- Do NOT add unrelated objects or props that are not implied by the style.`  
`- Ensure the person is clearly recognizable as the same individual from the input.`  
`- Center the composition so it works well as a square avatar (1024x1024).`  
`` `.trim(); ``  
`}`

This is a general-purpose template; the DMG prompt below should build on top of this.

---

## **6\. DMG Game Boy Pixel Art Style Prompt (Style \#1)**

In `apps/supabase-functions/shared/avatarPrompts.ts`, add a specific builder for DMG:

`export function buildDmgPixelArtPrompt(options: {`  
  `archetype: string;`  
  `extraContext?: string;`  
`}) {`  
  `const { archetype, extraContext = "" } = options;`

  `` const styleDescription = ` ``  
`DMG Game Boy-style pixel art avatar.`

`- Authentic original Game Boy (DMG-01) visual language.`  
`- 4-tone green palette similar to classic Game Boy LCD:`  
  `- Very dark green for outlines and deepest shadows.`  
  `- Mid-dark green for main lines and darker areas.`  
  `- Mid-light green for local midtones.`  
  `- Lightest green for highlights and background areas.`  
`- 1-pixel outlines around key shapes (silhouette, face, hair, clothing).`  
`- Hard pixel edges, no anti-aliasing, no soft gradients.`  
`- Subtle 1-pixel dithering to suggest shading and volume.`  
`- Resolution concept: think in terms of a low-res sprite upscaled cleanly, not a hi-res painting.`  
`- Style should feel like an in-game character portrait for a Game Boy RPG, not a modern high-res illustration.`  
`` `.trim(); ``

  `` const backgroundDescription = ` ``  
`Simple, clean Game Boy-style background:`  
`- Either a flat light-green tone or a very minimal pattern (subtle stripes or dots),`  
`- Background must not distract from the character,`  
`- No detailed scenery, no complex objects, no text.`  
`` `.trim(); ``

  `` const renderingDescription = ` ``  
`- Strict pixel art look with clear visible pixels.`  
`- No blur, no photorealistic lighting, no painterly brush strokes.`  
`- Overall contrast should be readable on a small Game Boy-like screen.`  
`- Use the 4-tone palette consistently across skin, hair, and clothing.`  
`- Keep the character silhouette bold and readable at small sizes.`  
`` `.trim(); ``

  `` const useCaseDescription = ` ``  
`Home Avatar portrait for the 16BitFit SBFG mobile game, displayed inside a virtual Game Boy-style LCD on the Home Screen.`  
`Archetype: ${archetype}.`  
`${extraContext}`  
`` `.trim(); ``

  `const base = buildUniversalStylePrompt({`  
    `styleDescription,`  
    `backgroundDescription,`  
    `renderingDescription,`  
    `useCaseDescription,`  
  `});`

  `` const identityLock = ` ``  
`Additional identity constraints:`  
`- Face shape, eyes, nose, mouth, and hairstyle must clearly match the input person.`  
`- The user's ethnicity, age, and overall appearance must remain consistent.`  
`- Think of this as "the same person, drawn as a DMG Game Boy sprite", not a new or generic character.`  
`- Clothing style can be simplified to match the chosen archetype (${archetype}), but must not completely erase the original identity.`  
`` `.trim(); ``

  `` const framing = ` ``  
`Framing:`  
`- Compose as a chest-up portrait (head and upper torso).`  
`- Center the character vertically and horizontally.`  
`- Leave a small amount of breathing room around the head for UI framing.`  
`` `.trim(); ``

  `` return ` ``  
`${base}`

`${identityLock}`

`${framing}`  
`` `.trim(); ``  
`}`

This function must be used in the Edge Function to generate the `prompt` string passed to `gpt-image-1`.

---

## **7\. Best-practice notes for using gpt-image-1 edits**

When calling the Image Edit endpoint, follow these practices:

1. **One main image** for this MVP

   * Use only the user’s headshot as the `image` input. You do NOT need multiple input images for this first version.

   * This keeps the editing instruction simple: “take this person and restyle as DMG pixel art”.

2. **Consistent parameters**

   * `size`: `"1024x1024"` – good balance for detail and consistent layout.

   * `quality`: start with `"medium"`; if the art is too soft/noisy, consider `"high"` at the cost of latency.

   * `output_format`: `"png"` – good for pixel art and potential transparency.

   * `response_format`: `"b64_json"` – easier to handle in a serverless environment than ephemeral URLs.

3. **Prompt verbosity**

   * gpt-image-1 handles long, detailed prompts well, especially for style instructions.

   * Use the detailed DMG style block above; more clarity typically results in more consistent style.

4. **Latency & robustness**

   * Treat the OpenAI call as a potentially slow network operation (several seconds under load).

   * Implement per-request timeout logic at the Edge Function level (e.g. abort after \~45–60 seconds and return an error so the UI can show a “Generation taking too long” message).

   * Avoid retrying too many times automatically; maybe one retry at most.

5. **Content safety & errors**

   * Be prepared for OpenAI to reject certain images or prompts under their safety policies.

   * If the OpenAI API returns a moderation-related error, log it and surface a generic error to the user (e.g., “We couldn’t generate an avatar from this photo. Please try a different picture.”).

6. **Future-proofing for Stable Diffusion**

   * Keep the Edge Function’s external interface stable:

     * Same request and response shape.

Internally, factor the OpenAI call into a separate function, e.g.:

 `async function generateAvatarWithOpenAI(params: { ... }) { ... }`

*   
  * Later you can swap to a `generateAvatarWithStableDiffusion` implementation without changing the frontend.

End of instructions.

`---`

`## Sources I used (for your sanity check)`

`Here’s where the technical details came from:`

`- **Image editing with gpt-image-1 (Python examples, sizes, quality, masks, etc.)**`    
  ``The OpenAI cookbook “Generate images with GPT Image” shows how to call `client.images.edit` with `model="gpt-image-1"`, pass input images, and read `data[0].b64_json`, plus valid `size` options and `quality` settings.``   

`- **GPT Image API capabilities (generate + edit existing images, masks, etc.)**`    
  `OpenAI’s GPT Image API help article confirms that GPT Image supports *generating brand-new images* and *editing existing images* (e.g. style changes and inpainting), and mentions masking behavior and moderation.`   

`- **Image generation/edit API reference (gpt-image-1 specific options)**`    
  ``The Images API reference describes the `images.edit` endpoint, the `model` parameter including `gpt-image-1`, allowed `size` values (`1024x1024`, `1536x1024`, `1024x1536`, `auto`), and response fields (array of images with `b64_json` / `url`).``   

`- **3rd-party docs summarizing edit constraints (file formats, size limits, prompt length)**`    
  ``TT-API’s OpenAI-compatible documentation for `images/edits` summarizes practical constraints: `image` files for `gpt-image-1` must be `png`, `jpg`, or `webp` under ~25MB; `prompt` can be up to 32k characters; and the edit endpoint supports `gpt-image-1`. This matches how most OpenAI-compatible gateways expose the same API.``   

`- **General overview of gpt-image-1 as a natively multimodal model**`    
  `The GPT Image 1 model docs and overview articles confirm that it’s the successor to DALL·E 3, supports both generation and editing, and is optimized for instruction-following and high-fidelity edits (e.g. style transfer and compositing).`   

`If you want, next step we can tighten this further around performance (timeouts, warmups) or add a tiny quantization step to push the sprites closer to true DMG palette after generation.`

