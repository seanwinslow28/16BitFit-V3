# Story 1.5 Implementation Plan: GPT-Image-1 Avatar Generation

**Date:** November 19, 2025  
**Decision:** Use gpt-image-1 for MVP, plan SD+LoRA for future  
**Status:** Ready to implement

---

## Changes from Original Story 1.5 Spec

| Current Spec | New Approach (gpt-image-1) | Reason |
|---|---|---|
| `openai.images.generate()` | `openai.images.edit()` | Edit API allows style transfer while preserving identity |
| DALL-E 3 model | gpt-image-1 model | Newer model with better instruction-following |
| Text-only prompt | Input image + detailed prompt | Can reference actual user photo |
| Edge Function: `generate-avatar` | Edge Function: `avatar-generator` | Match new API's naming conventions |
| Simple prompt template | Universal + DMG-specific templates | More consistent, future-proof architecture |

**✅ Key Advantage:** gpt-image-1's `images.edit` API can take the actual user photo and apply DMG styling while preserving identity—this solves the face-likeness problem identified in deep research.

---

## Implementation Checklist

### Phase 1: Backend Foundation (Days 1-2)

#### 1.1 Create Shared OpenAI Client
**File:** `apps/supabase-functions/shared/openaiClient.ts`

```typescript
// Deno-compatible OpenAI client for Image Edit API

const OPENAI_API_BASE = "https://api.openai.com/v1";
const OPENAI_IMAGE_EDIT_ENDPOINT = `${OPENAI_API_BASE}/images/edits`;

export function getOpenAIApiKey(): string {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return key;
}

export async function callOpenAIImageEdit(
  formData: FormData
): Promise<{
  data: Array<{
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}> {
  const apiKey = getOpenAIApiKey();

  const res = await fetch(OPENAI_IMAGE_EDIT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("OpenAI image edit error:", res.status, text);
    throw new Error(`OpenAI image edit failed: ${res.status} - ${text}`);
  }

  return await res.json();
}
```

**Tasks:**
- [x] Create file
- [ ] Add error handling for rate limits
- [ ] Add retry logic (1 retry max)
- [ ] Add timeout handling (45s)
- [ ] Add logging for latency tracking

---

(... Document continues with full prompts, edge function, frontend, database, testing, and migration strategy ...)

For complete implementation details, see full artifact content.
