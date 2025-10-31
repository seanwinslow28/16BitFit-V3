# **External APIs**

This section details the external APIs required for 16BitFit-V3 functionality and how they will be integrated.

---

## **API: Stable Diffusion API (Host TBD, e.g., Replicate, Dedicated Endpoint)**

* **Purpose:** To generate the personalized Home Avatar by integrating the user's uploaded headshot onto the selected Fitness Archetype body image using techniques like IP-Adapter, LoRAs, and potentially ControlNet, followed by server-side quantization.  
* **Documentation:** \[Link to Specific Hosted API Documentation \- TBD\]  
* **Base URL(s):** (TBD based on provider)  
* **Authentication:** API Key (Managed securely via Supabase Edge Function environment variables).  
* **Rate Limits:** Subject to provider's tier limits. Need to monitor and potentially upgrade tier based on usage.

**Key Endpoints Used:**

* (TBD \- Likely a POST /predictions or similar endpoint accepting image inputs, adapter references, LoRA identifiers, ControlNet maps, and text prompts).

**Integration Notes:**

* Interaction with the Stable Diffusion API **MUST** occur exclusively through a Supabase Edge Function (Component: Edge Functions) to protect the API key, manage the complex request payload, and perform mandatory pre/post-processing.  
* **Pre-processing:** Face detection, alignment, cropping, background removal within the Edge Function before sending to the AI API.  
* **AI Request:** Construct payload including pre-processed face image, archetype body sprite (potentially as ControlNet mask/map), pixel art LoRA identifier, style prompts ("Game Boy pixel art", "4-color green palette", etc.), and IP-Adapter/InstantID configuration.  
* **Post-processing (Mandatory):** Receive generated image, apply **color quantization** algorithm server-side to enforce the 4 DMG colors, composite onto body if needed, store final image (e.g., Supabase Storage), and return URL.  
* Implement non-AI pixelation fallback (downscale, grayscale, quantize/dither) within the Edge Function if AI generation fails or times out.  
* Error handling for API failures (rate limits, timeouts, content policy) must be implemented.  
* Cost monitoring is essential.

---

*(Placeholder for Post-MVP AI Sprite Generation API \- e.g., Google Gemini/Imagen)*

* **Purpose:** To generate combat character and boss sprites (Post-MVP).  
* **Documentation:** (TBD)  
* **Base URL(s):** (TBD)  
* **Authentication:** (TBD \- likely API Key via Edge Function)  
* **Rate Limits:** (TBD)  
* **Integration Notes:** Likely managed via separate Edge Functions, potentially leveraging anchor references as explored in V2.
