<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# **Context:** We are building a mobile game using React Native for the shell and Phaser 3 within a WebView for the core 60fps fighting game engine. A previous version achieved <10ms communication latency using a "Hybrid Velocity Bridge" involving a pre-injected JavaScript bridge and a binary message protocol. We need to ensure this performance is maintained or improved in V3.

**Research Goal:** Investigate and compare cutting-edge techniques for optimizing high-frequency, low-latency communication between React Native and a WebView, specifically for real-time game input and state synchronization.

**Specific Questions:**

1. Beyond the standard `postMessage` API, what are the most performant methods for bidirectional communication between React Native and a WebView in 2025? Compare techniques like:
    * Direct JavaScript injection and evaluation.
    * Using native modules exposing synchronous methods (if possible/safe).
    * Leveraging shared memory or alternative IPC mechanisms (if feasible on mobile).
    * WebSockets connecting to a local server within the app.
    * Optimized serialization formats (e.g., Protobuf, MessagePack vs. JSON).
2. Provide code examples or references for implementing binary data transfer protocols between React Native and WebView JavaScript. What are the performance benefits and implementation challenges?
3. What specific optimizations can be applied to the WebView configuration itself (e.g., using specific WebView libraries like `react-native-webview`, flags, hardware acceleration settings) to minimize communication overhead on iOS and Android?
4. Are there recent benchmarks or case studies (post-2023) comparing different RN-WebView communication strategies for real-time applications or games?
5. How can we best profile and debug communication latency between React Native and the WebView during development?

I'll now compile a comprehensive research report based on the extensive information gathered.

## High-Performance React Native-WebView Communication for Real-Time Gaming (2025)

Your hybrid React Native + Phaser 3 architecture is on the cutting edge of mobile game development. Based on extensive research into 2025's state-of-the-art techniques, here's a comprehensive analysis of optimizing WebView communication to maintain your sub-10ms latency target.

### 1. Beyond `postMessage`: Advanced Communication Techniques

**JavaScript Interface (JSI) and TurboModules**

The React Native New Architecture (enabled by default in 0.76+) represents the most significant advancement for your use case. JSI eliminates the asynchronous JSON bridge entirely, enabling:[^1][^2]

- **Synchronous native method calls** directly from JavaScript without serialization overhead[^3][^1]
- **Direct C++ object references** between JavaScript and native code, bypassing bridge bottlenecks[^2]
- **Lazy-loaded modules by default**, reducing startup time significantly[^4]

For game input, this means touch events can be processed synchronously in the native layer and immediately available to your WebView without the 30-50ms delay typical of the old bridge architecture.[^5][^6]

**Implementation Strategy:**
Create a custom native module using JSI that exposes synchronous methods for game state updates. While `react-native-webview` still uses `postMessage`, you can build a parallel communication channel using TurboModules for critical game input:

```cpp
// C++ TurboModule for synchronous game input
class GameInputModule : public facebook::react::TurboModule {
  jsi::Value processInput(jsi::Runtime& runtime, const jsi::Value& input) {
    // Process immediately, no serialization
    return processedInput;
  }
};
```

**Direct JavaScript Injection Performance**

Pre-injected JavaScript bridges remain highly effective for low-latency communication. The `injectedJavaScriptBeforeContentLoaded` prop executes before page load, establishing your communication layer with minimal overhead. Key optimization:[^6][^7]

- **Pre-inject a message queue handler** that batches updates instead of firing individual `postMessage` calls
- **Use a shared ArrayBuffer** for binary data (see section 2)
- **Minimize serialization** by sending numeric codes instead of JSON objects where possible

**Local WebSocket Server Architecture**

Research shows promising results for local HTTP/WebSocket servers embedded in React Native apps. A test measuring Android performance found:[^8][^5]


| Data Size | postMessage | Local HTTP Server |
| :-- | :-- | :-- |
| Small (100 chars) | 31ms | 5.9ms |
| Medium (10k chars) | 33ms | 15ms |
| Large (1M chars) | 57ms | 75ms |

**For game input (small, frequent messages), local WebSocket connections show 5-6x faster performance**. Implementation approach:[^5]

1. Embed a lightweight HTTP/WebSocket server in your React Native app using native modules
2. Connect your WebView to `ws://localhost:[port]`
3. Eliminate the `postMessage` bottleneck for real-time game state synchronization

This approach is particularly effective because WebSockets avoid the 300ms tap delay inherent in mobile WebViews and provide true bidirectional streaming.[^9][^10]

### 2. Binary Data Transfer Protocols

**MessagePack vs Protobuf Performance**

For game state synchronization, binary serialization offers dramatic improvements over JSON:[^11][^12]

**MessagePack:**

- 30% smaller payloads than JSON on average[^11]
- Simple integration: `import { encode, decode } from '@msgpack/msgpack'`
- **Best for dynamic game data** where schema changes frequently[^12]
- Performance: ~2-3x faster serialization than JSON[^11]

**Protocol Buffers (Protobuf):**

- Strong typing and schema validation reduce runtime errors[^12]
- Compact binary format optimized for repeated field names (common in game state)[^13]
- **Best for structured, predictable data** like player positions, health, scores[^12]
- Requires `.proto` schema definition but provides excellent cross-platform compatibility[^11]

**Implementation Example:**

```javascript
// WebView side - MessagePack binary transfer
import { encode, decode } from '@msgpack/msgpack';

const gameState = { x: 100, y: 200, velocity: 5, health: 85 };
const binaryData = encode(gameState);

// Send as base64 string via postMessage (or ArrayBuffer with local WebSocket)
window.ReactNativeWebView.postMessage(
  btoa(String.fromCharCode(...new Uint8Array(binaryData)))
);

// React Native side
onMessage={(event) => {
  const binaryData = Uint8Array.from(atob(event.nativeEvent.data), c => c.charCodeAt(0));
  const gameState = decode(binaryData);
}}
```

**ArrayBuffer and TypedArrays for Direct Memory Access**

The most performant approach for real-time game data uses **ArrayBuffer with TypedArrays**:[^14][^15][^16]

- **Zero-copy memory access** when combined with JSI
- **Direct binary manipulation** of game state (positions, velocities, inputs)
- **SharedArrayBuffer** for true shared memory between threads (with proper synchronization)[^17]

```javascript
// Allocate shared game state buffer
const gameStateBuffer = new ArrayBuffer(256); // 256 bytes for game state
const stateView = new Float32Array(gameStateBuffer);

// Write player position (8 bytes: 2 floats)
stateView[^0] = playerX;
stateView[^1] = playerY;

// Transfer to native without copy using Transferable objects
postMessage({ type: 'gameState', buffer: gameStateBuffer }, [gameStateBuffer]);
```

Android's **ashmem (shared memory)** provides the fastest possible IPC mechanism on mobile:[^17]

- No serialization overhead whatsoever
- Direct memory mapping between processes
- **Atomic operations** on 64-bit architectures ensure thread-safe reads/writes[^17]

For a 60fps fighting game, shared memory could store the entire game state ring buffer, with the WebView reading input events and React Native writing UI updates directly to mapped memory.

### 3. WebView Configuration Optimizations

**Hardware Acceleration**

Enabling hardware acceleration is **critical for 60fps performance**:[^18][^19]

```javascript
// react-native-webview props
<WebView
  androidLayerType="hardware"  // Enable GPU rendering
  androidHardwareAccelerationDisabled={false}
  javaScriptEnabled={true}
/>
```

**Android native configuration:**

```xml
<!-- AndroidManifest.xml -->
<application android:hardwareAccelerated="true">
```

**iOS WKWebView** has hardware acceleration enabled by default but benefits from explicit configuration.[^19]

**Caveats:**

- Some Android 9 devices crash with hardware acceleration due to driver bugs[^18]
- Test thoroughly on target devices, particularly low-end Android hardware[^20]
- Text with transparency over images can cause performance issues even with hardware acceleration[^21]

**Optimized Caching Strategy**[^20]

```javascript
<WebView
  cacheEnabled={true}
  cacheMode="LOAD_CACHE_ELSE_NETWORK"  // Aggressive caching
  incognito={false}  // Allow caching
  sharedCookiesEnabled={true}
  thirdPartyCookiesEnabled={true}
/>
```

Shopify achieved **6x faster WebView load times** (6s → 1.4s) through aggressive preloading and caching:[^22]

```javascript
// Preload and cache WebView in background on app startup
const [preloadedView, setPreloadedView] = useState(null);

useEffect(() => {
  // Hidden WebView for preloading
  const preloader = (
    <View style={{ height: 0, width: 0 }}>
      <WebView
        source={{ uri: 'game.html' }}
        onLoad={() => setPreloadedView(true)}
      />
    </View>
  );
}, []);
```

**WebView Touch Event Optimization**

Mobile WebViews have inherent touch latency issues:[^23][^9]

1. **300ms click delay** on iOS/Android WebViews waiting for double-tap gestures[^10][^24]
    - **Solution:** Use `touchstart` events instead of `click` in your Phaser game
    - Set viewport meta tag: `<meta name="viewport" content="width=device-width, user-scalable=no">`[^10]
2. **Touch event throttling** - WebView may drop touch events during heavy processing[^23]
    - **Solution:** Implement custom touch event rate limiting in native layer (40-50ms intervals)[^23]
    - Use React Native's `Pressable` for game controls outside WebView to bypass this entirely

### 4. Benchmarks and Case Studies (2023-2025)

**Real-World Performance Data:**

**Phaser in WebView Performance:**

- Developers report **30-40fps** on mid-range Android devices with Phaser 3 in WebView[^25][^26]
- Adding `powerPreference: "high-performance"` to Phaser config provides measurable boost[^25]
- **Crosswalk/Cordova** with WebGL support significantly improves performance over stock WebView[^26]

**React Native WebView Latency:**

- Standard `postMessage`: **31-57ms** depending on payload size (Android)[^5]
- Local HTTP server: **5.9-15ms** for small-medium payloads[^5]
- JSI/TurboModules: **Near-zero overhead** for synchronous calls (< 1ms)[^1][^3]

**GameMaker HTML5 in React Native WebView:**
Users report **janky performance with input lag** spikes when tapping, particularly on Android. This aligns with the 300ms WebView tap delay issue and emphasizes the need for `touchstart` event handling.[^27]

**Best Practice from Industry:**

- **Uber** uses React Native + WebView extensively, making transitions imperceptible through careful optimization[^28]
- **Meta Quest** VR apps use React Native New Architecture for high-performance 3D rendering[^1]
- **Bluesky** social app uses New Architecture in production with excellent performance results[^1]


### 5. Profiling and Debugging Communication Latency

**Chrome DevTools for WebView**

Enable WebView debugging on Android:[^29]

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

Access via `chrome://inspect` to:

- **Profile JavaScript execution** inside the WebView with Performance panel[^30]
- **Monitor network requests** including local WebSocket connections
- **Measure frame timing** to identify 60fps bottlenecks[^30]

**React Native DevTools (Hermes)**

The new integrated DevTools (default in RN 0.76+) provides:[^31][^32]

- **Performance profiler** for JS thread activity
- **Network inspector** to measure `postMessage` roundtrip times
- **Memory profiler** to detect leaks in communication layer

**Flipper Performance Monitor**

For detailed frame-by-frame analysis:[^33][^34]

- Install `react-native-flipper-performance-plugin`
- Monitor **JS thread vs UI thread** performance simultaneously
- Calculate performance scores to track optimization progress[^34]
- **Limitation:** Only works in debug mode, which affects performance measurements[^35]

**Custom Latency Measurement:**

```javascript
// In WebView
const sendTimestamp = performance.now();
window.ReactNativeWebView.postMessage(JSON.stringify({ 
  type: 'INPUT',
  timestamp: sendTimestamp,
  data: inputData 
}));

// In React Native
onMessage={(event) => {
  const receiveTimestamp = performance.now();
  const data = JSON.parse(event.nativeEvent.data);
  const latency = receiveTimestamp - data.timestamp;
  console.log(`Communication latency: ${latency}ms`);
}}
```

**Key Profiling Targets:**

1. **JS Thread Frame Drops:** If JS thread crosses frame boundaries (>16.67ms), serialization is the likely culprit[^36][^37]
2. **Bridge Saturation:** Monitor `RCTEventEmitter` calls - excessive frequency indicates bridge bottleneck[^36]
3. **GPU Rendering:** Use Xcode Instruments (iOS) or Android Profiler to verify 60fps frame delivery to screen[^38]

### Recommendations for V3

**Immediate Optimizations (Low Effort, High Impact):**

1. Implement binary serialization with MessagePack for game state[^11]
2. Replace `click` with `touchstart` in Phaser to eliminate 300ms delay[^10]
3. Enable hardware acceleration and aggressive caching[^18][^20]
4. Pre-inject communication bridge before content load[^6]

**Medium-Term Migration (Moderate Effort):**

1. Upgrade to React Native 0.76+ to leverage New Architecture[^1]
2. Implement local WebSocket server for sub-10ms communication[^8][^5]
3. Build custom TurboModule for synchronous game input handling[^39][^3]

**Advanced Architecture (High Effort, Maximum Performance):**

1. Use JSI + ArrayBuffer for zero-copy binary communication[^2][^3]
2. Implement ashmem shared memory for Android (native module)[^17]
3. Consider Hermes engine optimizations for faster JS execution[^40][^39]
4. Profile and optimize GPU pipeline synchronization in Phaser[^41]

Your existing <10ms "Hybrid Velocity Bridge" was already excellent. With these 2025 techniques—particularly the New Architecture's JSI, local WebSocket approach, and binary protocols—you should be able to maintain or even improve upon that performance in V3.
<span style="display:none">[^100][^101][^102][^103][^104][^105][^106][^107][^108][^109][^110][^111][^112][^113][^114][^115][^116][^117][^118][^119][^120][^121][^122][^123][^124][^125][^126][^127][^128][^129][^42][^43][^44][^45][^46][^47][^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67][^68][^69][^70][^71][^72][^73][^74][^75][^76][^77][^78][^79][^80][^81][^82][^83][^84][^85][^86][^87][^88][^89][^90][^91][^92][^93][^94][^95][^96][^97][^98][^99]</span>

<div align="center">⁂</div>

[^1]: https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here

[^2]: https://reactnative.dev/architecture/landing-page

[^3]: https://blog.logrocket.com/leveraging-react-native-jsi-enhance-speed-performance/

[^4]: https://www.prowebtechnos.com/blog/introduction-to-react-native

[^5]: https://github.com/react-native-webview/react-native-webview/discussions/3669

[^6]: https://making.close.com/posts/react-native-webviews

[^7]: https://blog.logrocket.com/react-native-webview-complete-guide/

[^8]: https://mobileappcircular.com/optimizing-react-native-performance-realtime-data-with-websockets-3d07c9919da

[^9]: https://stackoverflow.com/questions/7375575/android-webview-very-laggy-button-response

[^10]: https://webkit.org/blog/5610/more-responsive-tapping-on-ios/

[^11]: https://hjkl11.hashnode.dev/performance-analysis-of-json-buffer-custom-binary-protocol-protobuf-and-messagepack-for-websockets

[^12]: https://cloudflare.domartisan.com/blog/messagepack-vs-protobuf-which-binary-data-framework-should-you-use-2

[^13]: https://www.igvita.com/2011/08/01/protocol-buffers-avro-thrift-messagepack/

[^14]: https://javascript.info/arraybuffer-binary-arrays

[^15]: https://loune.net/2011/05/javascript-arraybuffer-binary-handling-in-javascript/

[^16]: https://dev.to/kshitij978/arraybuffer-and-typedarray-3ege

[^17]: https://www.linkedin.com/pulse/shared-memory-fastest-way-share-data-between-android-stefano-santilli

[^18]: https://github.com/react-native-webview/react-native-webview/issues/575

[^19]: https://developer.android.com/topic/performance/hardware-accel

[^20]: https://blog.stackademic.com/i-made-rn-webview-app-10x-faster-than-yours-heres-how-i-did-it-7132b7421261

[^21]: https://reactnative.dev/docs/performance

[^22]: https://shopify.engineering/mobilebridge-native-webviews

[^23]: https://stackoverflow.com/questions/7422427/android-webview-slow

[^24]: https://news.ycombinator.com/item?id=6900388

[^25]: https://stackoverflow.com/questions/59460189/ridiculously-poor-performance-with-phaser-3-mobile-game

[^26]: https://stackoverflow.com/questions/25701356/developing-game-app-using-phaser-js-and-ionic-slow-shaky-rendering

[^27]: https://forum.gamemaker.io/index.php?threads%2Fgm-html-performance-on-mobiles.119541%2F

[^28]: https://www.reddit.com/r/reactnative/comments/18wqjyo/introducing_rnbridge_a_new_way_to_bridge_react/

[^29]: https://developer.chrome.com/docs/devtools/remote-debugging/webviews

[^30]: https://developer.chrome.com/docs/devtools/performance

[^31]: https://reactnative.dev/docs/react-native-devtools

[^32]: https://reactnative.dev/docs/debugging

[^33]: https://www.bam.tech/article/debug-react-native-performance-issues

[^34]: https://github.com/bamlab/react-native-flipper-performance-monitor

[^35]: https://www.reddit.com/r/reactnative/comments/t0r6d4/does_anyone_use_flipper_mainly_to_debug/

[^36]: https://reactnative.dev/docs/profiling

[^37]: https://reactnative-archive-august-2023.netlify.app/docs/0.70/performance

[^38]: https://www.callstack.com/blog/profiling-react-native-apps-with-ios-and-android-tools

[^39]: https://dev.to/sharad_k_e2232631d5ae480f/unlocking-react-native-speed-turbomodules-jsi-and-hermes-explained-294e

[^40]: https://onlinelibrary.wiley.com/doi/10.1002/ett.70232

[^41]: https://inputlag.science/engine

[^42]: https://jurnalp4i.com/index.php/science/article/view/5353

[^43]: http://arxiv.org/pdf/2101.00902.pdf

[^44]: https://arxiv.org/html/2504.03884v1

[^45]: https://arxiv.org/pdf/2309.10516.pdf

[^46]: https://www.ijfmr.com/papers/2024/5/29038.pdf

[^47]: https://arxiv.org/abs/2409.11667

[^48]: https://ph.pollub.pl/index.php/jcsi/article/view/6299

[^49]: https://dl.acm.org/doi/pdf/10.1145/3613904.3642517

[^50]: https://ph.pollub.pl/index.php/jcsi/article/download/2827/2658

[^51]: https://stackoverflow.com/questions/79143596/react-native-webview-performance-impacts-entire-app

[^52]: https://github.com/react-native-webview/react-native-webview/issues/3396

[^53]: https://moldstud.com/articles/p-enhancing-real-time-games-in-react-native-unlocking-websockets-full-potential

[^54]: https://www.youtube.com/watch?v=G1gyNV7mp5E

[^55]: https://www.reddit.com/r/reactnative/comments/112u44k/react_native_webview_is_buggy_and_very_slow_what/

[^56]: https://dev.to/youcefbedrani_64/bridging-the-gap-sharing-data-between-react-native-and-webview-4mdm

[^57]: https://www.devas.life/how-i-improved-my-react-native-app-50x-faster/

[^58]: https://www.curiosum.com/blog/dedicated-mobile-application-in-react-native-webview-guide

[^59]: https://github.com/react-native-webview/react-native-webview/issues/128

[^60]: https://github.com/react-native-webview/react-native-webview/issues/2962

[^61]: https://stackoverflow.com/questions/68334181/how-to-use-postmessage-in-a-react-native-webview

[^62]: https://docs.datadoghq.com/real_user_monitoring/mobile_and_tv_monitoring/react_native/web_view_tracking/

[^63]: https://www.reddit.com/r/reactnative/comments/1gvuybc/future_of_react_native/

[^64]: https://www.youtube.com/shorts/8Vym7LY6UIY

[^65]: https://ieeexplore.ieee.org/document/10840376/

[^66]: https://ijircce.com/admin/main/storage/app/pdf/gBEDCEOVMBDDAz6SrejvdWUDbRDS6qX24eBQlPeq.pdf

[^67]: https://journal-hnups.com.ua/index.php/soi/article/view/1912

[^68]: https://journal.smartpublisher.id/index.php/jurtikom/article/view/717

[^69]: https://www.semanticscholar.org/paper/ee09991aef8e4550c24cea6196ddece37b0ea872

[^70]: https://www.semanticscholar.org/paper/f3638f1443b1c905cb1f7ec17320f1979121cf0d

[^71]: https://ijsrem.com/download/evaluating-modern-android-frameworks-a-comparative-study-of-flutter-kotlin-multiplatform-jetpack-compose-and-react-native/

[^72]: https://ieeexplore.ieee.org/document/8760864/

[^73]: https://ieeexplore.ieee.org/document/9996039/

[^74]: https://dl.acm.org/doi/pdf/10.1145/3491204.3527477

[^75]: https://arxiv.org/pdf/2412.15803.pdf

[^76]: https://arxiv.org/pdf/2202.08409.pdf

[^77]: https://arxiv.org/abs/2306.03845

[^78]: https://www.mdpi.com/2078-2489/12/8/319/pdf

[^79]: https://zenodo.org/record/5500461/files/NodeXP__NOde_js_server_side_JavaScript_injection_vulnerability_DEtection_and_eXPloitation%20(1).pdf

[^80]: http://arxiv.org/pdf/2401.08595.pdf

[^81]: https://www.linkedin.com/pulse/exploring-react-native-webview-easy-solution-embedding-umair-hamza-qxyef

[^82]: https://stackoverflow.com/questions/54759897/set-layertype-for-webview-in-react-native

[^83]: https://github.com/react-native-webview/react-native-webview/issues/3085

[^84]: https://stackoverflow.com/questions/6355497/performant-entity-serialization-bson-vs-messagepack-vs-json

[^85]: https://msgpack.org/index.html

[^86]: https://stackoverflow.com/questions/70759106/webview-issue-injecting-javascript-in-react-native

[^87]: https://github.com/react-native-community/react-native-webview/issues/1057

[^88]: https://www.itservicesindia.com/blog/10-doubts-about-react-native-webview-you-should-clarify

[^89]: https://learn.microsoft.com/en-us/azure/architecture/best-practices/message-encode

[^90]: https://gitee.com/Mar-er/react-native-webview/blob/master/docs/Reference.md

[^91]: https://www.reddit.com/r/reactnative/comments/qlgbky/need_help_with_reactnative_webview_injecting/

[^92]: https://blog.octo.com/protocol-buffers-benchmark-and-mobile

[^93]: https://rsglobal.pl/index.php/ws/article/view/2812

[^94]: https://www.semanticscholar.org/paper/8076cbf25f94d10fc0e105a0f4628852bf07a85c

[^95]: https://journals.uol.edu.pk/pakjet/article/view/4421

[^96]: https://ieeexplore.ieee.org/document/11111679/

[^97]: https://www.mdpi.com/1424-8220/23/24/9813

[^98]: https://www.ijisrt.com/envision-edtech-revolutionizing-intelligent-education-through-ai-and-innovation-for-a-smarter-tomorrow

[^99]: https://ieeexplore.ieee.org/document/9766480/

[^100]: https://journals.univ-chlef.dz/index.php/jlt/article/view/598

[^101]: https://dl.acm.org/doi/10.1145/3697467.3697679

[^102]: https://www.semanticscholar.org/paper/0b10dc331cecff700f86044a85c7b399d758388b

[^103]: https://arxiv.org/pdf/2111.12682.pdf

[^104]: http://arxiv.org/pdf/2309.03524.pdf

[^105]: http://thescipub.com/pdf/10.3844/jcssp.2014.2165.2181

[^106]: http://arxiv.org/pdf/1010.2828.pdf

[^107]: https://ijsrcseit.com/paper/CSEIT217647.pdf

[^108]: http://article.sciencepublishinggroup.com/pdf/10.11648.j.ijics.20170205.12.pdf

[^109]: https://dl.acm.org/doi/pdf/10.1145/3622814

[^110]: https://stackoverflow.com/questions/16099904/how-to-use-shared-memory-ipc-in-android

[^111]: https://ably.com/blog/websockets-react-tutorial

[^112]: https://stackoverflow.com/questions/62434249/how-to-communicate-between-react-native-webview-and-a-react-web-app

[^113]: https://www.codeproject.com/Articles/14740/Fast-IPC-Communication-Using-Shared-Memory-and-Int?msg=5663381\&PageFlow=Fluid

[^114]: https://www.reddit.com/r/reactnative/comments/wjyccl/calling_synchronous_methods_on_native_modules_is/

[^115]: https://www.youtube.com/watch?v=Y2mDwW2pMv4

[^116]: https://www.videosdk.live/developer-hub/websocket/websocket-react-native

[^117]: https://dev.to/craftzdog/inter-communication-between-native-modules-on-react-native-57bn

[^118]: https://shift.infinite.red/react-native-android-app-memory-investigation-55695625da9c

[^119]: https://www.reddit.com/r/reactjs/comments/18ogc0o/web_sockets_are_not_efficient_and_hard_to_scale/

[^120]: https://www.linkedin.com/posts/pawanroy1997_ipc-in-android-when-you-open-instagram-and-activity-7373394068283777025-9U9P

[^121]: https://github.com/react-native-webview/react-native-webview/issues/1885

[^122]: https://reactnative.dev/docs/communication-ios

[^123]: https://www.youtube.com/watch?v=vXzpEJeVmi8

[^124]: https://arxiv.org/pdf/2203.11423v2.pdf

[^125]: http://arxiv.org/pdf/2409.00708.pdf

[^126]: http://arxiv.org/pdf/2406.10290.pdf

[^127]: http://arxiv.org/pdf/2403.11905.pdf

[^128]: https://arxiv.org/abs/2408.00019

[^129]: https://www.mdpi.com/2306-5729/8/8/134/pdf?version=1692439756

