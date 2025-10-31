## **1\) Pixel‑perfect rendering approaches (and when to use each)**

### **A. Plain React Native Views/Styles**

**When to use:** Simple chrome (frames, separators, static panels) where you don’t need shader effects.

**Pros**

* Easiest to implement; zero extra deps.

* Hairline dividers, simple borders are efficient.

**Cons**

* Anti‑aliasing and sub‑pixel rounding can blur “1‑px” edges on high‑DPI devices.

* Rounded borders can anti‑alias inconsistently across platforms. [React Native+2React Native+2](https://reactnative.dev/docs/pixelratio?utm_source=chatgpt.com)

**Keys for crispness**

**Snap to the pixel grid** with `PixelRatio.roundToNearestPixel`. Use integer coordinates/sizes to avoid half‑pixel rendering.

 `import { PixelRatio } from 'react-native';`

`// Snap layout sizes to device pixels`  
`export const px = (dp: number) => PixelRatio.roundToNearestPixel(dp);`

*  This ensures layout values correspond to an integer number of physical pixels, which prevents blur on scaled displays. [React Native+1](https://reactnative.dev/docs/pixelratio?utm_source=chatgpt.com)

* Use `StyleSheet.hairlineWidth` for 1‑pixel borders/lines. [React Native+1](https://reactnative.dev/docs/next/stylesheet?utm_source=chatgpt.com)

---

### **B. `react-native-svg`**

**When to use:** Vector icons and static shapes that rarely change per frame.

**Pros**

* Familiar SVG semantics for icons and logos.

* Great for static or infrequently updated vector artwork.

**Cons**

* Many nodes updating every frame can become chatty/expensive (prop updates cross the RN boundary). For dynamic, shader‑like effects, SVG is usually not the best fit compared to Skia’s GPU pipeline. [Software Mansion+1](https://blog.swmansion.com/you-might-not-need-react-native-svg-b5c65646d01f?utm_source=chatgpt.com)

---

### **C. GPU Canvas via react‑native‑skia**

**When to use:** Anything that must look like hardware‑era pixel art (nearest‑neighbor sampling), shader transitions (dissolve, wipes), crisp stroked rectangles, or palette quantization.

**Pros**

* Draw straight to a GPU canvas; Reanimated shared values can be fed directly into Skia props to run on the **UI thread**.

* You can disable anti‑aliasing for razor‑sharp edges, and you get precise control over sampling (e.g., **nearest** for pixel art). [Shopify+1](https://shopify.github.io/react-native-skia/docs/animations/animations/?utm_source=chatgpt.com)

* Runtime shaders (SkSL) let you do noise, ordered dithering, palette mapping, etc., at full speed. [Shopify](https://shopify.github.io/react-native-skia/docs/shaders/overview/?utm_source=chatgpt.com)

**Tips**

* Disable anti‑alias for hard pixels: `<Rect … antiAlias={false} />` (or via `<Paint antiAlias={false} />`).

* Ensure integer coordinates to avoid “on‑edge” rasterization (OpenGL/SKIA pixel centers are at 0.5). If you do draw 1‑px strokes, offset by 0.5 if AA is on. [Stack Overflow+1](https://stackoverflow.com/questions/42465758/about-skia-antialias?utm_source=chatgpt.com)

* For pixel art images, keep **nearest** filtering:  
   `sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }}`. (Nearest is the default in Skia’s Image component.) [Shopify](https://shopify.github.io/react-native-skia/docs/images)

---

### **D. Custom Fabric native components / TurboModules**

**When to use:** Very specialized rendering or hardware access. In 2025, the **New Architecture** (Fabric \+ JSI) is default in RN and reduces JS/native overhead—but for 2D UI rendering, Skia already provides a fast path; only reach for custom native rendering when Skia can’t do what you need. [React Native+1](https://reactnative.dev/architecture/landing-page?utm_source=chatgpt.com)

---

## **2\) `react-native-skia` code: pixel dissolve \+ strict DMG palette**

**Context:** The DMG screen is 160×144 and uses a characteristic 4‑color palette. We’ll scale an internal 160×144 canvas by an **integer factor** to preserve the pixel grid and use shaders for transitions and palette enforcement. [任天堂ホームページ](https://www.nintendo.com/en-gb/Support/Game-Boy-Pocket-Color/Product-information/Technical-data/Technical-data-619585.html?srsltid=AfmBOor8PMmLkBse0dmzTt6FTZRLDm-R-TlsAliDL_UaIH-jS2ZvFG1J&utm_source=chatgpt.com)  
 **Palette:** `#0F380F, #306230, #8BAC0F, #9BBC0F` (the classic “Original Game Boy” set). [Lospec](https://lospec.com/palette-list/original-gameboy?utm_source=chatgpt.com)

### **A) “Pixel dissolve” transition (two images)**

This SkSL fragment shader compares a **per‑cell random** value against an animated `progress` to decide whether to show the **from** or **to** image. It also includes a `pixel` block size so the dissolve advances in **pixelated chunks**:

`// PixelDissolve.tsx`  
`import React, { useMemo } from 'react';`  
`import {`  
  `Canvas, Fill, Shader, ImageShader, useImage,`  
  `FilterMode, MipmapMode, Skia`  
`} from '@shopify/react-native-skia';`  
`import { useSharedValue, withTiming } from 'react-native-reanimated';`

`// Compile shader once`  
`` const dissolveSrc = Skia.RuntimeEffect.Make(` ``  
`uniform shader fromTex;`  
`uniform shader toTex;`  
`uniform float progress;     // 0..1`  
`uniform float pixel;        // pixel block size`  
`// Hash-based random per "pixel block"`  
`float rand(vec2 co) {`  
  `return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);`  
`}`  
`half4 main(vec2 pos) {`  
  `vec2 cell = floor(pos / pixel);`  
  `float r = rand(cell);`  
  `vec4 A = fromTex.eval(pos);`  
  `vec4 B = toTex.eval(pos);`  
  `// show B as progress increases`  
  `float m = step(r, progress);`  
  `return half4(mix(A, B, m));`  
`}`  
`` `)!; ``

`export function PixelDissolve({`  
  `fromUri,`  
  `toUri,`  
  `width,`  
  `height,`  
  `pixel = 4,`  
  `duration = 650,`  
`}: {`  
  `fromUri: string;`  
  `toUri: string;`  
  `width: number;`  
  `height: number;`  
  `pixel?: number;`  
  `duration?: number;`  
`}) {`  
  `const from = useImage(fromUri);`  
  `const to = useImage(toUri);`

  `const sampling = useMemo(`  
    `() => ({ filter: FilterMode.Nearest, mipmap: MipmapMode.None }),`  
    `[]`  
  `);`

  `const progress = useSharedValue(0);`  
  `React.useEffect(() => {`  
    `progress.value = 0;`  
    `progress.value = withTiming(1, { duration });`  
  `}, [duration, progress]);`

  `if (!from || !to) return null;`

  `return (`  
    `<Canvas style={{ width, height }}>`  
      `<Fill>`  
        `<Shader source={dissolveSrc} uniforms={{ progress: progress, pixel }}>`  
          ``{/* Children supply shader uniforms of type `shader` */}``  
          `<ImageShader image={from} fit="cover" sampling={sampling} />`  
          `<ImageShader image={to} fit="cover" sampling={sampling} />`  
        `</Shader>`  
      `</Fill>`  
    `</Canvas>`  
  `);`  
`}`

*Notes:* We rely on Skia RuntimeEffect/Shader, and pass Reanimated shared values **directly** as props—no `createAnimatedComponent` needed. This runs on the **UI thread**. [Shopify+1](https://shopify.github.io/react-native-skia/docs/shaders/overview/?utm_source=chatgpt.com)

---

### **B) Strict 4‑color DMG palette (optional ordered dither)**

The shader below maps any incoming color to the nearest of the four DMG colors by luminance thresholds. It includes a very light 2×2 “screen‑door” dither around thresholds to reduce flat banding, while keeping that era‑correct look.

`// DMGPaletteFilter.tsx`  
`import React from 'react';`  
`import { Canvas, Fill, Shader, Group, Skia } from '@shopify/react-native-skia';`

`// Skia shader: quantize to 4 colors with slight 2x2 dither near thresholds`  
`` const dmgSrc = Skia.RuntimeEffect.Make(` ``  
`uniform float4 palette[4];   // RGBA colors (DMG set)`  
`uniform float ditherAmount;  // 0..1 small dither around thresholds`  
`uniform shader content;      // the content to quantize`

`// Simple luminance`  
`float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }`

`half4 main(vec2 pos) {`  
  `vec4 col = content.eval(pos);`  
  `float y = luma(col.rgb);`

  `// 2x2 checkboard dither in [-ditherAmount, +ditherAmount]`  
  `float dither = (mod(pos.x + pos.y, 2.0) < 1.0 ? -ditherAmount : ditherAmount);`  
  `float v = clamp(y + dither, 0.0, 1.0);`

  `// Thresholds for 4 bands (tune if you like)`  
  `float t0 = 0.25, t1 = 0.5, t2 = 0.75;`

  `float4 c0 = palette[0];`  
  `float4 c1 = palette[1];`  
  `float4 c2 = palette[2];`  
  `float4 c3 = palette[3];`

  `float4 outc = (v < t0) ? c0 :`  
                `(v < t1) ? c1 :`  
                `(v < t2) ? c2 : c3;`

  `return half4(outc.rgb, col.a);`  
`}`  
`` `)!; ``

`// Helper to convert hex to normalized rgba array`  
`const hexToFloat4 = (hex: string): [number, number, number, number] => {`  
  `const v = parseInt(hex.replace('#', ''), 16);`  
  `const r = ((v >> 16) & 255) / 255;`  
  `const g = ((v >> 8) & 255) / 255;`  
  `const b = (v & 255) / 255;`  
  `return [r, g, b, 1];`  
`};`

`// DMG palette (#0F380F, #306230, #8BAC0F, #9BBC0F)`  
`const DMG = [`  
  `hexToFloat4('#0F380F'),`  
  `hexToFloat4('#306230'),`  
  `hexToFloat4('#8BAC0F'),`  
  `hexToFloat4('#9BBC0F'),`  
`];`

`export const DMGPalette: React.FC<{`  
  `width: number;`  
  `height: number;`  
  `ditherAmount?: number; // 0..0.1 recommended`  
  `children: React.ReactNode; // Skia nodes to be quantized`  
`}> = ({ width, height, ditherAmount = 0.03, children }) => {`  
  `return (`  
    `<Canvas style={{ width, height }}>`  
      `<Fill>`  
        `<Shader source={dmgSrc} uniforms={{ palette: DMG, ditherAmount }}>`  
          `<Group>{children}</Group>`  
        `</Shader>`  
      `</Fill>`  
    `</Canvas>`  
  `);`  
`};`

You can render anything inside `<DMGPalette>` (text, shapes, images) and it will be clamped to the four DMG colors. The RuntimeEffect/Shader API and passing of uniforms are documented in Skia’s shader pages. [Shopify](https://shopify.github.io/react-native-skia/docs/shaders/overview/?utm_source=chatgpt.com)

---

## **3\) Reanimated 4 patterns for sprite‑like motion @ 60 fps**

**Reanimated 4** can run animations entirely on the **UI thread** via worklets. You can either:

* (a) use the classic `withTiming/withSpring` \+ `useAnimatedStyle`, or

* (b) use the new **CSS‑style transitions** with `transitionTimingFunction` and **`steps()`**, which is perfect for “stepped” sprite movement. [Software Mansion+1](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/?utm_source=chatgpt.com)

### **A) Discrete, pixel‑grid movement using CSS steps()**

This example moves a UI sprite 128 dp to the right, but **jumps** in 16 equal steps (think 8‑ or 16‑px tiles). Runs on the native/UI thread.

`import React from 'react';`  
`import Animated, { steps } from 'react-native-reanimated';`  
`import { Pressable, View } from 'react-native';`

`export function StepMotionDemo() {`  
  `const [on, setOn] = React.useState(false);`

  `return (`  
    `<View style={{ height: 100, justifyContent: 'center' }}>`  
      `<Pressable onPress={() => setOn(v => !v)}>`  
        `<Animated.View`  
          `style={{`  
            `width: 24, height: 24, backgroundColor: '#9BBC0F',`  
            `// CSS-like transitions in Reanimated 4`  
            `transitionProperty: ['transform'],`  
            `transitionDuration: 400,`  
            `// Discrete sprite-like jumps:`  
            `transitionTimingFunction: steps(16, 'jump-end'),`  
            `transform: [{ translateX: on ? 128 : 0 }],`  
          `}}`  
        `/>`  
      `</Pressable>`  
    `</View>`  
  `);`  
`}`

`steps(n, 'jump-*')` is part of Reanimated 4’s timing functions for CSS transitions and is supported on iOS/Android/Web. [Software Mansion](https://docs.swmansion.com/react-native-reanimated/docs/css-transitions/transition-timing-function/)

---

### **B) Worklet‑driven snapping to an N‑px grid**

For strict grid alignment, round every intermediate position to the nearest multiple (e.g., 4 px):

`import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';`

`const TILE = 4; // px`

`export function SnapToGridBox() {`  
  `const x = useSharedValue(0);`

  `React.useEffect(() => {`  
    `x.value = 0;`  
    `x.value = withTiming(160, { duration: 600 }); // runs on UI thread`  
  `}, [x]);`

  `const style = useAnimatedStyle(() => {`  
    `'worklet';`  
    `const snapped = Math.round(x.value / TILE) * TILE;`  
    `return { transform: [{ translateX: snapped }] };`  
  `});`

  `return <Animated.View style={[{ width: 24, height: 24, backgroundColor: '#8BAC0F' }, style]} />;`  
`}`

This stays on the UI thread and avoids JS‑thread jank. [Software Mansion](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/?utm_source=chatgpt.com)

---

### **C) Sprite‑sheet frame stepping with `useFrameCallback`**

Drive a 12 fps animation independent of display refresh; update a `sharedValue` **per frame** on the UI thread:

`import { useSharedValue, useFrameCallback } from 'react-native-reanimated';`

`export function SpriteTicker(onFrame: (index: number) => void, fps = 12) {`  
  `const frame = useSharedValue(0);`  
  `const acc = useSharedValue(0);`  
  `const interval = 1000 / fps; // ms`

  `useFrameCallback(({ timeSincePreviousFrame }) => {`  
    `'worklet';`  
    `if (timeSincePreviousFrame == null) return;`  
    `acc.value += timeSincePreviousFrame;`  
    `if (acc.value >= interval) {`  
      `acc.value -= interval;`  
      `frame.value = (frame.value + 1) % 99999;`  
      `// You can drive other shared values/props here (still on UI thread).`  
    `}`  
  `});`

  `// Read frame.value in animated styles or Skia props.`  
  `return frame;`  
`}`

`useFrameCallback` runs on every frame on the UI thread (\~16 ms on 60 Hz), ideal for sprite stepping without involving the JS thread. [Software Mansion](https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback)

---

## **4\) Performance trade‑offs (retro UI)**

| Technique | What it’s best at | Bottlenecks | Notes |
| ----- | ----- | ----- | ----- |
| **Skia shaders (procedural)** | Dynamic effects (dissolves, quantization, dither), per‑pixel processing on GPU | Shader compile time and per‑pixel ALU cost; complex shaders can increase GPU work | Pre‑compile/reuse RuntimeEffects; keep kernels simple; “shader compile jank” is a known issue in other Skia‑based stacks when not pre‑warmed. [Skia+1](https://skia.org/docs/user/sksl/?utm_source=chatgpt.com) |
| **Pre‑rendered sprite sheets / bitmaps** | Guaranteed crispness and cheapest runtime work (just blits) | Memory footprint; large sheets can thrash caches and increase bandwidth | On mobile GPUs, **texture fetches are cheap**; heavy procedural noise can cost more than a lookup. The classic trade‑off is **memory vs execution time**: textures use memory, shaders use compute. [cs.umd.edu+1](https://www.cs.umd.edu/~varshney/papers/i3d92.pdf?utm_source=chatgpt.com) |
| **RN Views/Styles** | Simple panels, borders, layout | Pixel rounding/AA can soften edges; limited to basic effects | Snap to integer pixels and use hairlines; but for “DMG‑sharp” visuals, Skia wins. [React Native+1](https://reactnative.dev/docs/pixelratio?utm_source=chatgpt.com) |
| **react‑native‑svg** | Static logos/icons | Many animated nodes per frame can be chatty | Prefer Skia when animating vector effects or many nodes each frame. [Software Mansion](https://blog.swmansion.com/you-might-not-need-react-native-svg-b5c65646d01f?utm_source=chatgpt.com) |

Also note: image sampling in Skia can be set to **nearest** (default) to keep pixel art crisp when scaling; mipmaps should be **off** for exact pixels. [Shopify](https://shopify.github.io/react-native-skia/docs/images)

---

## **5\) A global theme system that enforces your two palettes**

You have two hard rules:

1. **Hardware chrome theme** (e.g., `#D7D5CA`, `#9A9A9A`, etc.)

2. **DMG screen theme** restricted to **exactly four** colors.

Combine **NativeWind** (Tailwind‑for‑RN) with a small TS token layer and optional lint rules so no one can “sneak” a fifth color.

### **A) Tokens (TypeScript)**

`// theme/tokens.ts`  
`export const Hardware = {`  
  `chassis: '#D7D5CA',`  
  `chrome:  '#9A9A9A',`  
  `// add other fixed hardware colors here`  
`} as const;`

`export const DMG = {`  
  `darkest:  '#0F380F',`  
  `dark:     '#306230',`  
  `light:    '#8BAC0F',`  
  `lightest: '#9BBC0F',`  
`} as const;`

`// Strict types prevent ad‑hoc hex usage:`  
`export type DMGKey = keyof typeof DMG;`  
`export type DMGHex = (typeof DMG)[DMGKey];`

`export type Theme = {`  
  `hardware: typeof Hardware;`  
  `screen: typeof DMG;`  
`};`

`export const theme: Theme = { hardware: Hardware, screen: DMG };`

### **B) NativeWind config with CSS variables (runtime‑switchable)**

NativeWind supports defining colors as **CSS variables** and changing them at runtime via `vars()`/theme switching. Map your tokens to variables so classes like `bg-dmg-0` always resolve to the approved values. [NativeWind+1](https://www.nativewind.dev/docs/guides/themes?utm_source=chatgpt.com)

`// tailwind.config.ts`  
`import type { Config } from 'tailwindcss';`

`export default {`  
  `content: ['App.tsx', 'src/**/*.{ts,tsx}'],`  
  `theme: {`  
    `extend: {`  
      `colors: {`  
        `// DMG screen (4 colors)`  
        `'dmg-0': 'var(--dmg-0)',`  
        `'dmg-1': 'var(--dmg-1)',`  
        `'dmg-2': 'var(--dmg-2)',`  
        `'dmg-3': 'var(--dmg-3)',`  
        `// Hardware chrome`  
        `'hw-chassis': 'var(--hw-chassis)',`  
        `'hw-chrome':  'var(--hw-chrome)',`  
      `},`  
    `},`  
  `},`  
`} satisfies Config;`

At runtime, set variables with NativeWind’s helpers:

`// theme/provider.tsx`  
`import React, { PropsWithChildren } from 'react';`  
`import { vars } from 'nativewind';`  
`import { Hardware, DMG } from './tokens';`

`export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {`  
  `const style = vars({`  
    `'--dmg-0': DMG.darkest,`  
    `'--dmg-1': DMG.dark,`  
    `'--dmg-2': DMG.light,`  
    `'--dmg-3': DMG.lightest,`  
    `'--hw-chassis': Hardware.chassis,`  
    `'--hw-chrome':  Hardware.chrome,`  
  `});`  
  `return <>{React.cloneElement(<>{children}</>, { style })}</>;`  
`};`

You can also switch themes with `useColorScheme` or your own toggle—NativeWind documents CSS‑variable‑driven theming and `vars()`. [NativeWind+1](https://www.nativewind.dev/docs/guides/themes?utm_source=chatgpt.com)

**Usage in components**

`// Hardware wrapper`  
`export const Bezel: React.FC<React.PropsWithChildren> = ({ children }) => (`  
  `<View className="bg-hw-chassis border-2 border-hw-chrome rounded-lg p-2">`  
    `{children}`  
  `</View>`  
`);`

`// DMG screen content (strict 4 colors)`  
`export const DMGText: React.FC<{ tone: 'dmg-0'|'dmg-1'|'dmg-2'|'dmg-3' }> = ({ tone, children }) => (`  
  ``<Text className={`text-${tone}`}>{children}</Text>``  
`);`

### **C) Optional enforcement with lint rules**

* Enable `react-native/no-color-literals` to flag hard‑coded colors in styles.

* Add a small custom ESLint rule (or an off‑the‑shelf design‑token plugin) to block any hex/rgb outside your whitelist. [Stack Overflow+2eslint.org+2](https://stackoverflow.com/questions/71986471/react-native-warning-eslintreact-native-no-color-literals?utm_source=chatgpt.com)

---

## **Extra: building the virtual DMG screen at integer scale**

For the in‑screen content, render to a **160×144** Skia canvas and scale by an integer factor so pixels remain square with **nearest** sampling:

`import { Canvas, Group } from '@shopify/react-native-skia';`  
`import { useWindowDimensions } from 'react-native';`

`const DMG_W = 160, DMG_H = 144;`

`export function DMGScreen({ children }: { children: React.ReactNode }) {`  
  `const { width: W, height: H } = useWindowDimensions();`  
  `const scale = Math.max(1, Math.floor(Math.min(W / DMG_W, H / DMG_H))); // integer`

  `const x = Math.floor((W - DMG_W * scale) / 2);`  
  `const y = Math.floor((H - DMG_H * scale) / 2);`

  `return (`  
    `<Canvas style={{ width: W, height: H }}>`  
      `<Group transform={[{ translateX: x }, { translateY: y }, { scale }]}`  
        `// Everything inside is drawn at 160x144 logical pixels`  
      `>`  
        `{children}`  
      `</Group>`  
    `</Canvas>`  
  `);`  
`}`

Integer scaling and nearest sampling preserve pixel edges exactly; 160×144 is the Game Boy’s native resolution. [Shopify+1](https://shopify.github.io/react-native-skia/docs/images)

---

## **Putting it together: pixel‑perfect UI elements with Skia**

**Crisp button panel (hardware chrome)**

`import { Canvas, Rect, RRect, Paint } from '@shopify/react-native-skia';`

`export function ChromePanel({ w=200, h=60 }: { w?: number; h?: number }) {`  
  `return (`  
    `<Canvas style={{ width: w, height: h }}>`  
      `{/* Outer bezel */}`  
      `<RRect`  
        `x={0} y={0} width={w} height={h} r={6}`  
        `color="#D7D5CA" // hardware token`  
      `>`  
        `{/* Stroke with AA off for razor edge */}`  
        `<Paint style="stroke" strokeWidth={1} color="#9A9A9A" antiAlias={false} />`  
      `</RRect>`  
      `{/* Inner groove */}`  
      `<Rect x={2} y={2} width={w-4} height={h-4} color="#D7D5CA">`  
        `<Paint style="stroke" strokeWidth={1} color="#9A9A9A" antiAlias={false} />`  
      `</Rect>`  
    `</Canvas>`  
  `);`  
`}`

**DMG progress bar (4 colors only)**

`import { DMGPalette } from './DMGPaletteFilter';`  
`import { Canvas, Rect } from '@shopify/react-native-skia';`  
`import Animated, { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';`

`export function DMGProgress({ progress }: { progress: number }) {`  
  `// progress: 0..1`  
  `const width = 160, height = 12;`  
  `const fill = Math.round(progress * width);`

  `return (`  
    `<DMGPalette width={width} height={height}>`  
      `<Rect x={0}   y={0} width={width} height={height} color="#0F380F" />   {/* background */}`  
      `<Rect x={1}   y={1} width={fill-2} height={height-2} color="#8BAC0F" /> {/* fill */}`  
      `<Rect x={fill} y={1} width={width - fill - 1} height={height-2} color="#306230" />`  
    `</DMGPalette>`  
  `);`  
`}`

---

## **Source highlights (why these choices work)**

* **Skia shaders and paint attributes** – RuntimeEffect/Shader, uniforms, and paint props (including `antiAlias`). [Shopify+1](https://shopify.github.io/react-native-skia/docs/shaders/overview/?utm_source=chatgpt.com)

* **Nearest‑neighbor sampling** for crisp pixel art. [Shopify](https://shopify.github.io/react-native-skia/docs/images)

* **Reanimated \+ Skia integration** – pass shared values directly as props; no animated wrappers required. [Shopify](https://shopify.github.io/react-native-skia/docs/animations/animations/?utm_source=chatgpt.com)

* **Reanimated 4 CSS‑style transitions** with **`steps()`** for sprite‑like jumps; **`useFrameCallback`** for per‑frame worklets. [Software Mansion+1](https://docs.swmansion.com/react-native-reanimated/docs/css-transitions/transition-timing-function/)

* **Game Boy facts** – 160×144 display; classic DMG palette. [任天堂ホームページ+1](https://www.nintendo.com/en-gb/Support/Game-Boy-Pocket-Color/Product-information/Technical-data/Technical-data-619585.html?srsltid=AfmBOor8PMmLkBse0dmzTt6FTZRLDm-R-TlsAliDL_UaIH-jS2ZvFG1J&utm_source=chatgpt.com)

* **Why Skia over SVG for dynamic graphics** – SVG great for static, Skia for animated/dynamic effects. [Shopify](https://shopify.engineering/getting-started-with-react-native-skia?utm_source=chatgpt.com)

* **Shader vs textures trade‑off** – classic **memory vs compute** principle; sprite sheets are cheap to render; heavy procedural work costs GPU time. [cs.umd.edu+1](https://www.cs.umd.edu/~varshney/papers/i3d92.pdf?utm_source=chatgpt.com)

* **NativeWind theming with CSS variables** and `vars()` for runtime themes. [NativeWind+1](https://www.nativewind.dev/docs/guides/themes?utm_source=chatgpt.com)

* **Preventing color drift** – lints to block literal colors, custom ESLint rules or token plugins. [Stack Overflow+1](https://stackoverflow.com/questions/71986471/react-native-warning-eslintreact-native-no-color-literals?utm_source=chatgpt.com)

---

### **Practical checklist (to keep 60 fps)**

* **Keep animations on the UI thread** (worklets, CSS transitions). Avoid `runOnJS` in hot paths. [Software Mansion](https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback)

* **Pre‑create** RuntimeEffects/Shaders; don’t compile per frame. (Shader compilation stalls are a known jank source in Skia‑based stacks.) [Flutter Docs](https://docs.flutter.dev/ui/design/graphics/fragment-shaders?utm_source=chatgpt.com)

* **Integer scale** your 160×144 virtual screen; **nearest** sampling; disable AA for 1‑px strokes. [Shopify+1](https://shopify.github.io/react-native-skia/docs/images)

* **Prefer textures** (sprite sheets) for static elements and icons; use shaders for where they shine (dissolve, dither, palette ops). [cs.umd.edu](https://www.cs.umd.edu/~varshney/papers/i3d92.pdf?utm_source=chatgpt.com)

* **Enforce tokens** in tooling (NativeWind \+ ESLint), not just in docs.

