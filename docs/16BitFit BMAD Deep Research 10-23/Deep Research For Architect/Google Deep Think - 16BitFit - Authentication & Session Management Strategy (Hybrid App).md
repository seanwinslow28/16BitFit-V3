This research defines a secure and seamless authentication architecture for 16BitFit-V3, addressing the integration of Supabase Auth in a hybrid React Native application hosting a Phaser 3 game within a WebView. The architecture prioritizes security while accommodating the requirement for deferred authentication.

The recommended approach utilizes Supabase's Anonymous Sign-Ins for initial access and strongly advocates for using the React Native host as a secure proxy for all authenticated interactions originating from the WebView, thereby protecting sensitive authentication tokens.

### **1\. Recommended Patterns for Deferred Authentication**

The optimal pattern for deferred authentication in React Native with Supabase Auth is **Anonymous Sign-Ins**.

**Implementation Strategy:**

1. **Enablement:** Ensure "Enable Anonymous Sign-Ins" is activated in the Supabase project's Authentication settings.  
2. **Initialization:** Upon the first launch, the React Native app checks for an existing session (supabase.auth.getSession()).  
3. **Guest Session Creation:** If no session is found, the app immediately calls supabase.auth.signInAnonymously().  
4. **Session Details:** This authenticates the user, assigning them a unique User ID and issuing a session (JWT and refresh token). This JWT includes the claim is\_anonymous: true.  
5. **Data Association:** All initial user progress (avatar state, EPP) is saved to the database referencing this anonymous User ID.

**Seamless Conversion (Linking):**

To convert the anonymous session to a permanent account without losing progress, the existing anonymous user record is upgraded.1 Crucially, this maintains the original User ID.

1. **Email/Password:** Use supabase.auth.updateUser({ email, password }) while the user is actively in the anonymous session.  
2. **OAuth (e.g., Apple/Google):** For native mobile flows, the recommended approach is to obtain the ID token from the provider natively (using libraries like @react-native-google-signin/google-signin or @invertase/react-native-apple-authentication) and then use supabase.auth.linkIdentityWithIdToken({ provider, token }).  
   * *Requirement:* "Allow Manual Linking" must be enabled in the Supabase project's authentication settings for identity linking to function.

### **2\. Securely Sharing Authentication State (RN to WebView)**

The most secure and efficient method to handle authenticated actions from the WebView is to use the **React Native shell as a secure proxy**.

**Comparison of Approaches:**

| Approach | Description | Security Risk | Complexity/Performance |
| :---- | :---- | :---- | :---- |
| **A. RN as Secure Proxy** | RN handles all Supabase calls. WebView sends requests to RN via the bridge. | **Low.** Tokens remain securely stored in the native environment. | Medium complexity. Introduces minor latency due to bridge communication. |
| **B. Injecting Tokens** (via injectedJavaScript) | Passing JWT/Refresh tokens into the WebView's JS context. | **High.** Exposes tokens to Cross-Site Scripting (XSS) attacks within the WebView environment. | High complexity. Requires complex synchronization to handle token refresh race conditions. |
| **C. WebView Direct Auth** | WebView manages its own login/session. | **High/Infeasible.** Duplicates session management; OAuth flows within WebViews are considered insecure. | High complexity. Difficult to synchronize with the native app state. |

**Recommendation: Architecture A (Secure Proxy)**

This architecture ensures that authentication tokens never leave the secure storage of the native environment.

**Proxy Implementation:**

1. **WebView Request:** The Phaser game identifies an action requiring authentication (e.g., saving a battle result) and sends a structured message to the React Native host via the communication bridge (e.g., window.ReactNativeWebView.postMessage() or a Local WebSocket if implemented).  
   * Example Message: { action: 'SAVE\_BATTLE', payload: { score: 100, opponentId: 'xyz' } }  
2. **RN Handling:** React Native receives the message (e.g., in the onMessage handler). It validates the request origin and payload (See Q4). It then uses its own authenticated Supabase client to execute the database query.  
3. **Response:** React Native sends the result of the operation back to the WebView via the bridge (e.g., webViewRef.current.injectJavaScript()).

### **3\. Session Validation and Refresh Management**

The **React Native shell must have sole responsibility** for managing the session lifecycle and token refreshes. The WebView should remain stateless regarding authentication.

1. **Secure Storage:** The Supabase client must be initialized using a secure storage adapter (e.g., react-native-keychain or expo-secure-store), **not** plain AsyncStorage.  
2. **Initialization:** Initialize the client with autoRefreshToken: true and persistSession: true.  
3. **AppState Management (Crucial for RN):** In non-browser environments like React Native, Supabase cannot automatically detect if the app is in the foreground or background. Developers must implement AppState listeners to manage the refresh process efficiently and conserve resources:

JavaScript  
import { AppState } from 'react-native';  
// ... initialize supabase client ...

// Ensure this listener is registered only once at the app root.  
AppState.addEventListener('change', (state) \=\> {  
  if (state \=== 'active') {  
    supabase.auth.startAutoRefresh();  
  } else {  
    // App is in the background  
    supabase.auth.stopAutoRefresh();  
  }  
});

If the high-risk Token Injection approach (Architecture B) were used, RN would need to listen for TOKEN\_REFRESHED events via onAuthStateChange and immediately inject the new tokens. The WebView's client would require autoRefreshToken: false to prevent race conditions, as Supabase refresh tokens are single-use.

### **4\. Security Implications and Precautions**

The primary security concern is the potential compromise of the WebView environment.

* **Risk of Token Injection:** Exposing tokens to the WebView (Architecture B) significantly increases the attack surface. XSS vulnerabilities in the game code or its dependencies could allow attackers to steal the JWT, leading to session hijacking.  
* **Mitigation:** The recommended proxy architecture (Architecture A) mitigates this risk entirely by isolating the tokens.

**Precautions for the Proxy Architecture:**

While the proxy model protects the tokens, the communication bridge itself must be secured:

* **Origin Verification:** The React Native onMessage handler must strictly validate the origin of messages from the WebView (event.nativeEvent.origin) to ensure they originate only from the trusted game source.  
* **Message Validation and Sanitization:** Treat all data from the WebView as untrusted. React Native must validate the message structure against a predefined list of allowed actions (e.g., 'SAVE\_BATTLE', 'LOAD\_PROGRESS') and sanitize the payload content before executing database operations.  
* **Content Security Policy (CSP):** Implement a strict CSP within the HTML hosting the Phaser game to mitigate the impact of potential XSS attacks, even if tokens are not exposed.  
* **Minimal Data Exposure:** Only expose necessary, non-sensitive information to the WebView (e.g., the User ID and their is\_anonymous status).

### **5\. Relevant Supabase Auth Features**

* **signInAnonymously():** The foundation of the deferred authentication strategy.  
* **updateUser() & linkIdentityWithIdToken():** Enables the seamless conversion of guest users to permanent accounts without data loss.  
* **startAutoRefresh() / stopAutoRefresh():** Essential for managing the session refresh lifecycle in React Native based on the app's state.  
* **Row Level Security (RLS):** Critical for data security. RLS policies use auth.uid() to restrict access. Policies can also check the is\_anonymous claim (auth.jwt()-\>\>'is\_anonymous'::boolean) to provide different permissions for guests.

### **6\. Alternative Architectures**

The analysis confirms that the **React Native Secure Proxy** (detailed in Question 2\) is the superior architecture for 16BitFit-V3.

While direct token injection might appear simpler or slightly more performant by avoiding the bridge latency, the security risks associated with exposing credentials in a complex WebView environment are substantial. The proxy model provides a robust security boundary, cleanly separating game presentation logic (WebView) from authentication and secure data access (React Native).

