/**
 * OpenAI API Client for Supabase Edge Functions (Deno)
 * 
 * Provides utilities for calling OpenAI's gpt-image-1 Image Edit API
 * to generate DMG pixel art avatars from user headshots.
 */

const OPENAI_API_BASE = "https://api.openai.com/v1";
const OPENAI_IMAGE_EDIT_ENDPOINT = `${OPENAI_API_BASE}/images/edits`;

/**
 * OpenAI Image Edit API response type
 */
export interface OpenAIImageEditResponse {
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
}

/**
 * Get OpenAI API key from environment
 * @throws {Error} If OPENAI_API_KEY is not set
 */
export function getOpenAIApiKey(): string {
    const key = Deno.env.get("OPENAI_API_KEY");
    if (!key) {
        throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    return key;
}

/**
 * Call OpenAI Image Edit API with gpt-image-1 model
 * 
 * @param formData - FormData containing:
 *   - model: "gpt-image-1"
 *   - prompt: Detailed style instructions
 *   - image: User headshot File object
 *   - size: "1024x1024"
 *   - quality: "medium" | "high"
 *   - output_format: "png"
 *   - response_format: "b64_json" | "url"
 * 
 * @returns OpenAI response with generated image data
 * @throws {Error} If API call fails
 */
export async function callOpenAIImageEdit(
    formData: FormData
): Promise<OpenAIImageEditResponse> {
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
        console.error("OpenAI image edit error:", {
            status: res.status,
            statusText: res.statusText,
            body: text,
        });

        // Parse error details if available
        try {
            const errorData = JSON.parse(text);
            throw new Error(
                `OpenAI image edit failed: ${res.status} - ${errorData.error?.message || text}`
            );
        } catch {
            throw new Error(`OpenAI image edit failed: ${res.status} - ${text}`);
        }
    }

    return await res.json();
}

/**
 * Call OpenAI Image Edit API with retry logic
 * 
 * @param formData - FormData for image edit
 * @param maxRetries - Maximum number of retry attempts (default: 1)
 * @param timeoutMs - Timeout in milliseconds (default: 45000)
 * 
 * @returns OpenAI response
 * @throws {Error} If all retries fail or timeout occurs
 */
export async function callOpenAIImageEditWithRetry(
    formData: FormData,
    maxRetries: number = 1,
    timeoutMs: number = 45000
): Promise<OpenAIImageEditResponse> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            try {
                const response = await callOpenAIImageEdit(formData);
                clearTimeout(timeoutId);
                return response;
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
                console.warn(
                    `OpenAI call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`,
                    error
                );
                // Wait 1 second before retry
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }

    throw lastError!;
}

/**
 * Decode base64 string to Uint8Array
 * Utility for handling b64_json responses
 * 
 * @param b64 - Base64 encoded string
 * @returns Decoded bytes
 */
export function decodeBase64(b64: string): Uint8Array {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
