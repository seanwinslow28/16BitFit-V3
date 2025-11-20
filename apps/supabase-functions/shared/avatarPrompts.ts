/**
 * Avatar Generation Prompt Templates
 * 
 * Provides layered, composable prompt templates for AI avatar generation.
 * Architecture is designed to support multiple styles (DMG, GBC, high-res, etc.)
 * while maintaining consistent identity preservation principles.
 */

/**
 * Available archetype types for avatar generation
 */
export type ArchetypeType = "trainer" | "runner" | "yogi" | "lifter" | "cyclist";

/**
 * Validate archetype is one of the allowed values
 */
export function isValidArchetype(archetype: string): archetype is ArchetypeType {
    const validArchetypes: ArchetypeType[] = ["trainer", "runner", "yogi", "lifter", "cyclist"];
    return validArchetypes.includes(archetype as ArchetypeType);
}

/**
 * Options for universal style template
 */
export interface UniversalStyleOptions {
    styleDescription: string;
    backgroundDescription: string;
    renderingDescription: string;
    useCaseDescription?: string;
}

/**
 * Universal Style Template (Base Layer)
 * 
 * This template enforces identity preservation constraints that apply
 * to ALL avatar generation styles. It's the foundation that ensures
 * users are recognizable regardless of art style.
 * 
 * Future-proof: When adding new styles (GBC, high-res, etc.), build
 * on top of this template to maintain consistency.
 */
export function buildUniversalStylePrompt(options: UniversalStyleOptions): string {
    const {
        styleDescription,
        backgroundDescription,
        renderingDescription,
        useCaseDescription = "This will be used as a game avatar inside a retro fitness RPG.",
    } = options;

    return `
Use the input image as the base and KEEP THE SAME PERSON, identity, and facial structure.

Identity & composition constraints:
- Preserve the same person, face, eyes, nose, mouth, jawline, and hairstyle as in the input photo.
- Do NOT change their age, ethnicity, body type, or gender presentation.
- Maintain the same camera angle and general pose from the input.
- Keep the expression very similar unless the style explicitly requires a small change.
- Avoid dramatic pose changes, cropping, or rotations unless absolutely necessary for the style.

Goal:
- Restyle this image as: ${styleDescription}

Background:
- ${backgroundDescription}

Rendering & visual style:
- ${renderingDescription}

Use case:
- ${useCaseDescription}

Constraints:
- Do NOT add text, logos, UI elements, or interface chrome.
- Do NOT add unrelated objects or props that are not implied by the style.
- Ensure the person is clearly recognizable as the same individual from the input.
- Center the composition so it works well as a square avatar (1024x1024).
`.trim();
}

/**
 * Options for DMG pixel art prompt
 */
export interface DmgPixelArtOptions {
    archetype: ArchetypeType;
    extraContext?: string;
}

/**
 * DMG Game Boy Pixel Art Style Prompt (Style #1)
 * 
 * Generates prompts for authentic DMG (original Game Boy) pixel art avatars.
 * Enforces the strict 4-color green palette (#0F380F, #306230, #8BAC0F, #9BBC0F),
 * pixel-perfect rendering, and classic RPG character portrait framing.
 * 
 * This is the MVP style for 16BitFit. Future styles (GBC, etc.) will follow
 * a similar pattern.
 * 
 * @param options - Archetype and optional context
 * @returns Complete prompt for gpt-image-1
 */
export function buildDmgPixelArtPrompt(options: DmgPixelArtOptions): string {
    const { archetype, extraContext = "" } = options;

    // Validate archetype
    if (!isValidArchetype(archetype)) {
        throw new Error(
            `Invalid archetype: ${archetype}. Must be one of: trainer, runner, yogi, lifter, cyclist`
        );
    }

    const styleDescription = `
DMG Game Boy-style pixel art avatar.

- Authentic original Game Boy (DMG-01) visual language.
- 4-tone green palette similar to classic Game Boy LCD:
  - Very dark green (#0F380F) for outlines and deepest shadows.
  - Mid-dark green (#306230) for main lines and darker areas.
  - Mid-light green (#8BAC0F) for local midtones.
  - Lightest green (#9BBC0F) for highlights and background areas.
- 1-pixel outlines around key shapes (silhouette, face, hair, clothing).
- Hard pixel edges, no anti-aliasing, no soft gradients.
- Subtle 1-pixel dithering to suggest shading and volume.
- Resolution concept: think in terms of a low-res sprite upscaled cleanly, not a hi-res painting.
- Style should feel like an in-game character portrait for a Game Boy RPG, not a modern high-res illustration.
`.trim();

    const backgroundDescription = `
Simple, clean Game Boy-style background:
- Either a flat light-green tone or a very minimal pattern (subtle stripes or dots),
- Background must not distract from the character,
- No detailed scenery, no complex objects, no text.
`.trim();

    const renderingDescription = `
- Strict pixel art look with clear visible pixels.
- No blur, no photorealistic lighting, no painterly brush strokes.
- Overall contrast should be readable on a small Game Boy-like screen.
- Use the 4-tone palette consistently across skin, hair, and clothing.
- Keep the character silhouette bold and readable at small sizes.
`.trim();

    const useCaseDescription = `
Home Avatar portrait for the 16BitFit SBFG mobile game, displayed inside a virtual Game Boy-style LCD on the Home Screen.
Archetype: ${archetype}.
${extraContext}
`.trim();

    // Build base universal prompt
    const base = buildUniversalStylePrompt({
        styleDescription,
        backgroundDescription,
        renderingDescription,
        useCaseDescription,
    });

    // Add DMG-specific identity constraints
    const identityLock = `
Additional identity constraints:
- Face shape, eyes, nose, mouth, and hairstyle must clearly match the input person.
- The user's ethnicity, age, and overall appearance must remain consistent.
- Think of this as "the same person, drawn as a DMG Game Boy sprite", not a new or generic character.
- Clothing style can be simplified to match the chosen archetype (${archetype}), but must not completely erase the original identity.
`.trim();

    // Add framing instructions
    const framing = `
Framing:
- Compose as a chest-up portrait (head and upper torso).
- Center the character vertically and horizontally.
- Leave a small amount of breathing room around the head for UI framing.
`.trim();

    // Combine all layers
    return `
${base}

${identityLock}

${framing}
`.trim();
}

/**
 * Future style template placeholder
 * 
 * Example of how to add new styles while maintaining the same architecture:
 * 
 * export function buildGbcColorPrompt(options: GbcColorOptions): string {
 *   const styleDescription = "Game Boy Color pixel art with 56-color palette...";
 *   const backgroundDescription = "Colorful, vibrant GBC background...";
 *   const renderingDescription = "Pixel art with color quantization...";
 *   
 *   const base = buildUniversalStylePrompt({ ... });
 *   const gbcSpecifics = "...";
 *   return `${base}\n\n${gbcSpecifics}`.trim();
 * }
 */
