# **Architectural Patterns for High-Performance Mobile Gaming with Supabase: A Report for 16BitFit-V3**

## **Section 1: Foundational Database and Realtime Architecture**

This section establishes the architectural bedrock for the 16BitFit-V3 backend, focusing on a performant PostgreSQL schema and a scalable real-time synchronization strategy. The analysis will demonstrate that while Supabase offers multiple real-time patterns, the selection of the correct pattern is not a matter of preference but a critical decision that dictates the application's ultimate scalability. The recommended approach—leveraging Realtime Broadcast with database triggers—is designed to circumvent significant performance bottlenecks inherent in alternative methods, ensuring a robust and scalable data layer.

### **1.1 Optimal PostgreSQL Schema Design for Game State**

The foundation of any scalable application is a well-designed database schema. For 16BitFit-V3, leveraging PostgreSQL's relational power is a core advantage of the Supabase platform.1 A normalized schema ensures data integrity, optimizes query performance, and provides the structural flexibility needed to accommodate future game mechanics.

**Table Structure and Relationships**

A normalized structure is proposed to represent the core game entities. This design separates concerns and minimizes data redundancy, following established database design principles.3

* **profiles**: This table will store user-specific data that extends beyond the default authentication information. It will have a one-to-one relationship with the auth.users table, linked by a primary key that is also a foreign key to auth.users.id. This is a standard and recommended pattern for managing public user profiles.5  
* **avatars**: Contains the current state of a user's in-game avatar. This includes fields like evolution\_stage (e.g., using a PostgreSQL ENUM type for defined stages), current\_epp (Evolution Progress Points), and a foreign key user\_id linking back to profiles.  
* **avatar\_stats**: This table holds the dynamic combat and performance statistics for an avatar, such as health\_points, attack\_power, defense, and the energy\_meter. It maintains a one-to-one relationship with the avatars table. Separating frequently updated stats from the more static avatar data can reduce write contention and improve caching strategies. For flexible stats like temporary buffs or debuffs, a JSONB column can be utilized for its efficient querying and indexing capabilities.6  
* **fitness\_logs**: A time-series table that records historical fitness data for each user (e.g., activity\_type, duration\_seconds, steps, timestamp). This table will be the source for calculating EPP. Its user\_id column will be a foreign key to profiles.

**Primary Keys and Data Types**

The choice of primary keys and data types has a significant impact on performance and scalability.

* **Primary Keys**: It is strongly recommended to use Universally Unique Identifiers (UUIDs) as primary keys for all tables.7 Unlike sequential integers, UUIDs can be generated independently on any client or server, which is ideal for distributed systems and offline-first scenarios. This approach also helps distribute writes across the table's indexes, preventing "hotspot" contention that can occur with monotonically increasing keys in high-throughput systems.9 The uuid-ossp extension can be enabled in Supabase to facilitate this.6  
* **Data Types**: Utilizing PostgreSQL's rich set of data types enhances data integrity and performance. TIMESTAMPTZ (timestamp with time zone) should be used for all time-based data to avoid ambiguity. As mentioned, JSONB is highly effective for semi-structured data like combat stat modifiers. Using specific types like INT, BIGINT, and NUMERIC where appropriate is preferable to using generic TEXT fields.

**Indexing Strategy**

An aggressive indexing strategy is non-negotiable for performance. Indexes should be created on all foreign key columns (user\_id, avatar\_id, etc.) and any columns frequently used in WHERE clauses or JOIN conditions. This is particularly crucial for columns used in Row Level Security (RLS) policies, where a missing index can degrade query performance by orders of magnitude.7

### **1.2 Realtime Subscription Strategies: A Comparative Analysis**

Supabase offers two primary mechanisms for streaming database changes to clients: Postgres Changes and Broadcast.11 While Postgres Changes offers simplicity, it contains a critical scalability limitation that makes it unsuitable for a high-concurrency application like a mobile game.

* **Postgres Changes**: This system provides a direct, low-configuration way to listen to database modifications. It leverages PostgreSQL's logical replication feature, which reads changes directly from the database's Write-Ahead Log (WAL).12 The Supabase Realtime server decodes this stream and pushes updates to subscribed clients. Clients can subscribe to INSERT, UPDATE, or DELETE events on an entire table or filter for specific rows.11  
* **Broadcast**: This is a more flexible and decoupled pub/sub system. It allows any authorized client to send and receive ephemeral messages over a WebSocket channel.15 Messages are not limited to database changes; they can be any arbitrary data, such as game events or cursor positions. Importantly, messages can be broadcast not only from clients but also from server-side logic, including database triggers or Edge Functions, via a REST API call or a direct database function call.15

**The Scalability Trap of Postgres Changes**

The seemingly straightforward nature of Postgres Changes conceals a severe performance bottleneck. The Supabase documentation on benchmarks reveals that for every single database change on a table with RLS enabled, the system must execute a database query for *every single client subscribed to that table* to verify if they are authorized to receive the change.18

Consider a scenario with 5,000 concurrent players online, all subscribed to their own profile updates. If one player's avatar stats are updated, this single UPDATE operation triggers 5,000 individual authorization checks (database reads) to determine which client should receive the message. This creates a multiplicative load on the database ($1$ write $\\rightarrow$ $N$ reads, where $N$ is the number of subscribers), causing the database itself to become the bottleneck long before the Realtime server reaches its capacity. This design makes Postgres Changes fundamentally unscalable for use cases with a large number of concurrent subscribers, which is the exact profile of a successful mobile game.

### **1.3 Recommended Pattern: Leveraging Broadcast with Database Triggers**

To avoid the scalability trap, the recommended architecture for 16BitFit-V3 is to use the Broadcast mechanism in conjunction with PostgreSQL triggers. This pattern decouples the real-time notification from the database authorization load, shifting the responsibility of fanning out messages to the highly scalable Elixir-based Realtime server.1 This approach is not only more performant but also offers greater control over the data sent to clients.

**Architectural Overview**

The implementation involves a three-part system: a database trigger, a trigger function, and a client-side subscription to a granular channel.

1. **Database Trigger**: A trigger is attached to the avatar\_stats table. It is configured to fire AFTER INSERT OR UPDATE.  
   SQL  
   CREATE TRIGGER handle\_avatar\_stats\_change  
   AFTER INSERT OR UPDATE ON public.avatar\_stats  
   FOR EACH ROW EXECUTE FUNCTION public.notify\_avatar\_stats\_change();

2. **Trigger Function (plpgsql)**: This PostgreSQL function contains the core logic. Instead of broadcasting the entire NEW row object, it constructs a custom, minimal JSON payload containing only the changed data (a "delta"). It then uses the realtime.send() function to broadcast this payload to a user-specific channel. Using realtime.send() is preferable to realtime.broadcast\_changes() as it provides more control over the event name and payload structure.17  
   SQL  
   CREATE OR REPLACE FUNCTION public.notify\_avatar\_stats\_change()  
   RETURNS TRIGGER AS $$  
   DECLARE  
     payload JSONB;  
   BEGIN  
     \-- Construct a payload with only the necessary data  
     payload :\= jsonb\_build\_object(  
       'user\_id', NEW.user\_id,  
       'health\_points', NEW.health\_points,  
       'energy\_meter', NEW.energy\_meter,  
       'updated\_at', NOW()  
     );

     \-- Broadcast the custom payload to a private, user-specific channel  
     PERFORM realtime.send(  
       'user-state:' |

| NEW.user\_id, \-- Channel topic  
'stats\_update', \-- Event name  
payload,  
true \-- Private channel  
);

  RETURN NEW;  
END;  
$$ LANGUAGE plpgsql SECURITY DEFINER;  
\`\`\`

3. **Client-Side Subscription**: The React Native client subscribes *only* to its own unique, private channel. This ensures that a client is never burdened with processing updates intended for other players, significantly reducing client-side load and network traffic.11  
   JavaScript  
   const userId \= supabase.auth.getUser().id;  
   const userChannel \= supabase.channel(\`private:user-state:${userId}\`);

   userChannel  
    .on('broadcast', { event: 'stats\_update' }, (payload) \=\> {  
       console.log('Received stats update:', payload);  
       // Update local game state (e.g., in Zustand or Legend-State)  
     })  
    .subscribe((status) \=\> {  
       if (status \=== 'SUBSCRIBED') {  
         console.log('Successfully subscribed to user state channel\!');  
       }  
     });

This pattern effectively shifts the workload. The database performs one write and executes one trigger function. The Realtime server, which is purpose-built for managing a massive number of concurrent WebSocket connections, handles the secure delivery of the message to the single intended client. Authorization is performed once when the client joins the private channel, not on every single message that is broadcast.

### **1.4 Implementing Row-Level Security (RLS) for Realtime**

Security is paramount, and Supabase's architecture is built around PostgreSQL's Row Level Security.7 For the recommended Broadcast pattern to function securely, a specific RLS policy must be applied to the realtime.messages table, which is the internal table used by the Realtime server to manage broadcasts.11

**RLS Policy for Private Broadcasts**

This policy grants authenticated users permission to SELECT (i.e., receive) messages from the realtime.messages table, but only if the message's topic matches the pattern corresponding to their own user ID.

SQL

CREATE POLICY "Users can receive their own state broadcasts"  
ON realtime.messages FOR SELECT  
TO authenticated  
USING (  
  \-- The topic must match the format 'user-state:\<user-id\>'  
  realtime.topic() \= 'user-state:' |

| (SELECT auth.uid())::text  
);

**Performance Considerations for RLS**

RLS policies are executed for every query against a protected table, and inefficient policies can become a major performance bottleneck.10 A critical optimization technique is to wrap function calls like auth.uid() within a SELECT statement. This encourages the PostgreSQL query planner to treat the function's result as a stable value for the duration of the query, caching it instead of re-evaluating it for every row being checked. This simple change can result in performance improvements of over 100x on large tables.10

An optimized version of the policy would look like this:

SQL

CREATE POLICY "Users can receive their own state broadcasts (Optimized)"  
ON realtime.messages FOR SELECT  
TO authenticated  
USING (  
  realtime.topic() \= 'user-state:' |

| (SELECT auth.uid())::text  
);

*(Note: In this specific realtime.topic() usage, the function call is already structured in a way that is generally performant. However, for more complex policies involving joins or multiple checks against auth.uid(), the (SELECT auth.uid()) pattern is essential.)*

By combining a well-structured relational schema with the scalable Broadcast-with-triggers pattern and performant RLS policies, 16BitFit-V3 can build a data layer that is secure, efficient, and capable of supporting a large, active player base.

## **Section 2: Performance Engineering and Scalability for Supabase Realtime**

Ensuring a smooth, low-latency experience is critical for player retention in a mobile game. This section analyzes the performance characteristics of Supabase Realtime, translates the platform's official benchmarks into actionable insights for 16BitFit-V3, and outlines proactive optimization strategies to handle high concurrency and maintain application responsiveness.

### **2.1 Analysis of Realtime Performance Benchmarks**

Supabase provides extensive performance benchmarks that demonstrate the capabilities of its Elixir-based Realtime server.18 Interpreting these benchmarks within the context of 16BitFit-V3's architecture provides confidence in the platform's ability to scale.

* **Throughput and Latency**: The most relevant test case is the "Broadcast: Using the database" benchmark, which simulates our recommended trigger-based pattern. The results show the system can handle **10,000 messages per second** with **80,000 concurrent users**. The median latency is **46 ms**, with a 95th percentile (p95) latency of **132 ms**.18 For game state updates—which occur after a workout is completed, not multiple times per second—this level of performance is more than sufficient and well within the threshold for a perceived "real-time" experience.  
* **Concurrent Connections**: The underlying architecture, built on Elixir and the Phoenix framework, is designed for massive concurrency.1 Scalability tests demonstrate the platform's ability to handle up to **250,000 concurrent users** and achieve a message throughput of over **800,000 messages per second** in broadcast-heavy scenarios.18 This indicates that the Realtime server itself is unlikely to be the bottleneck as the game's user base grows.  
* **Impact of Payload Size**: The benchmarks clearly illustrate a direct relationship between the size of the message payload and the resulting latency. In one test, increasing the payload from 1KB to 50KB more than doubled the median latency from 13 ms to 27 ms and the p95 latency from 36 ms to 81 ms.18 This data provides quantitative support for the payload shaping strategy outlined in Section 1.3. Sending only the essential data delta, rather than the entire game state object, is a critical optimization for minimizing latency.

While these benchmarks are conducted under ideal network conditions, they establish a strong performance baseline. The actual user-perceived latency will be a function of this baseline performance, minus the overhead from custom RLS policies and the additional network latency to the end-user's device. Therefore, optimizations at the application level remain crucial.

### **2.2 Scaling for High Concurrency: Architectural Limits and Quotas**

Supabase operates on a tiered pricing model with specific quotas that define the operational limits of the Realtime service. Understanding these limits is essential for planning the game's launch, managing costs, and designing a graceful degradation strategy.

The key quotas for the Free, Pro, and Team/Enterprise plans are summarized below 23:

| Feature | Free | Pro | Team / Enterprise |
| :---- | :---- | :---- | :---- |
| **Concurrent Connections** | 200 | 500 | 10,000+ |
| **Messages per Second** | 100 | 500 | 2,500+ |
| **Channel Joins per Second** | 100 | 500 | 2,500+ |
| **Broadcast Payload Size** | 256 KB | 3,000 KB (3 MB) | 3,000 KB+ |

For a mobile game like 16BitFit-V3, the "Concurrent Connections" limit is the most critical metric to monitor. The Free plan's 200 connections and the Pro plan's 500 connections could be exhausted quickly during a successful launch. Planning to start on or quickly upgrade to a plan with a higher connection limit is a necessary strategic consideration.

When these quotas are exceeded, the Realtime server will reject new connections or messages and send specific error codes over the WebSocket connection, such as too\_many\_connections or tenant\_events (for exceeding message-per-second limits).23 The official @supabase/supabase-js client library is designed to handle these events and will attempt to reconnect automatically once the throughput drops below the quota.23 However, during this period, clients will not receive real-time updates, highlighting the importance of implementing the "fetch-on-reconnect" logic discussed later in Section 5\.

### **2.3 Proactive Optimization: Advanced Techniques**

Beyond the foundational pattern of using Broadcast with triggers, several advanced techniques can be employed to further optimize performance, reduce network traffic, and minimize client-side processing.

* **Granular Channel Topic Design**: The design of channel topics is a powerful tool for optimization. Instead of a single channel per user, consider even more granular topics for different parts of the game state. For example, the frequently updated Energy Meter could be broadcast on a separate energy-meter:\<user\_id\> channel, while less frequent avatar stat changes are sent on user-state:\<user\_id\>. This allows the client to selectively subscribe only to the high-frequency data it needs to display at any given moment, preventing unnecessary app wake-ups and data processing.17  
* **Client-Side Debouncing and Throttling**: For UI elements that update frequently, such as the Energy Meter, it is crucial to implement client-side debouncing or throttling on the re-rendering logic. Receiving a stream of 10 messages per second should not trigger 10 full UI re-renders. Instead, the client should batch these updates and update the UI at a controlled interval (e.g., once every 200ms) to ensure a smooth frame rate and prevent performance degradation.7  
* **Leveraging Presence for State Sync**: Supabase's Presence feature is designed to track the online status of users in a channel.15 It can be used to display which friends are currently active. Furthermore, Presence can be used as a trigger for state synchronization. When a client detects a new user joining a shared channel (e.g., a future co-op mode), it can trigger an API call to fetch that user's public state, rather than relying on a broadcast message for the initial state load.

### **2.4 Monitoring and Diagnostics for Realtime Performance**

Proactive monitoring is essential for identifying and resolving performance issues before they impact a significant number of players. The Supabase platform provides several tools for observability.

* **Supabase Reports Dashboard**: The project dashboard includes a dedicated "Reports" section with visualizations for key Realtime metrics. This includes charts for **Realtime Connections**, a breakdown of **Channel Events** (Broadcast, Postgres Changes, Presence), and the **Rate of Channel Joins**.26 Regularly reviewing these reports can help identify trends, diagnose connection stability issues, and understand how players are engaging with the game's real-time features.  
* **Database and API Monitoring**: Since the entire real-time pipeline originates from a database write, monitoring the health of the database is critical. The reports dashboard also provides metrics on database CPU and memory usage, Disk IOPS, and slow query identification via the pg\_stat\_statements extension.7 A spike in CPU usage that correlates with a high number of active users could indicate an inefficient trigger function or RLS policy that needs optimization.27  
* **Realtime Logs**: For debugging specific errors, the Realtime logs, accessible in the dashboard, provide a detailed record of connection attempts, authorization failures, and quota-related errors.23 When a client fails to subscribe to a channel, these logs are the primary tool for diagnosing the root cause.

By combining a deep understanding of the platform's performance characteristics with proactive optimization and diligent monitoring, the 16BitFit-V3 team can build a backend that remains fast and reliable as its user base scales.

## **Section 3: Implementing Server-Side Game Logic: A Strategic Analysis**

For a game like 16BitFit-V3, server-side logic is essential for calculating progress, ensuring game state integrity, and preventing cheating. Supabase offers two distinct environments for executing this logic: **PostgreSQL Functions**, which run inside the database, and **Supabase Edge Functions**, which are globally distributed serverless functions.28 The choice between them is not a binary "either/or" decision but a strategic exercise in placing logic where it can be executed most efficiently. The optimal architecture for 16BitFit-V3 will be a hybrid pipeline that leverages the unique strengths of both.

### **3.1 PostgreSQL Functions: The Data-Centric Approach**

PostgreSQL Functions (also known as stored procedures) are blocks of code, typically written in SQL or PL/pgSQL, that reside and execute directly within the database engine.5 They are the ideal choice for operations that are tightly coupled with the data itself.

* **Proximity to Data**: The primary advantage of a PostgreSQL Function is its zero-latency access to data. When performing complex calculations that require querying multiple tables or large datasets, executing this logic within the database eliminates the network overhead of transferring data to an external compute layer and back.28 This makes them exceptionally performant for data-intensive tasks.  
* **Transactional Integrity**: Database functions can execute a series of operations within a single atomic transaction. This guarantees that all changes are committed together, or none are, maintaining data consistency. This is crucial for game logic where multiple state updates must occur in unison. For example, awarding EPP, updating combat stats, and checking for an evolution level-up should be an all-or-nothing operation.  
* **Use Case for 16BitFit-V3**: A perfect application is a function named calculate\_and\_apply\_epp(p\_user\_id UUID, p\_fitness\_log\_id BIGINT). This function would be invoked by a trigger after a new entry is added to the fitness\_logs table. Inside the function, it would:  
  1. Query the fitness\_logs table for the user's recent activity.  
  2. Apply the game's proprietary algorithm to calculate the final EPP value.  
  3. Query a stat\_scaling\_rules table to determine how stats should increase based on the avatar's current evolution\_stage.  
  4. UPDATE the user's row in the avatar\_stats table with the new EPP and scaled stats.  
     All these steps occur as a single, atomic transaction, ensuring the game state remains consistent.

### **3.2 Supabase Edge Functions: The Low-Latency, Decoupled Approach**

Supabase Edge Functions are TypeScript functions that run on the Deno runtime, deployed globally across an edge network.32 They are designed for handling HTTP requests and are the ideal choice for logic that requires low latency for the end-user or interaction with external services.

* **Low Latency for Users**: Because Edge Functions are executed in a region physically close to the user, the network round-trip time is minimized. This makes them perfect for creating responsive API endpoints that the mobile client interacts with directly.30  
* **External API Integration**: As a modern TypeScript environment, Edge Functions have first-class support for making outbound HTTP requests using fetch. This is essential for integrating with any third-party APIs, such as a payment processor for in-app purchases or a weather service to grant workout bonuses. Performing outbound network calls from within a PostgreSQL function is possible but highly inefficient and can lock up database connections.31  
* **Decoupling and Resource Management**: Edge Functions run on a separate serverless infrastructure, completely decoupled from the database's compute resources. A CPU-intensive task, like image processing or a complex calculation, can be offloaded to an Edge Function without impacting the database's ability to serve queries.7  
* **Use Case for 16BitFit-V3**: The primary public API endpoint for the mobile app should be an Edge Function. For instance, a /record-workout endpoint would receive the POST request from the client. Its responsibilities would be to:  
  1. Authenticate the request by validating the user's JWT.  
  2. Perform initial, lightweight input validation.  
  3. INSERT the validated raw workout data into the fitness\_logs table.  
  4. Immediately return a success response (200 OK) to the client.  
     This approach provides a snappy user experience, as the client receives a quick confirmation while the more intensive data processing is handled asynchronously in the background by the database trigger.

### **3.3 Trade-Off Analysis: Performance, Complexity, Security, and Cost**

The following table provides a clear, comparative summary to guide the decision-making process for where to place different pieces of game logic.

| Feature | PostgreSQL Functions (PL/pgSQL) | Supabase Edge Functions (TypeScript/Deno) |
| :---- | :---- | :---- |
| **Performance** | Extremely high data throughput due to zero-latency access to data. Can become a bottleneck if performing slow, synchronous external API calls. | Low user-perceived latency for API responses due to edge distribution. Higher latency for data-heavy operations that require multiple round-trips to the database. |
| **Complexity** | Requires proficiency in SQL and PL/pgSQL. Ideal for set-based logic and data transformations. Becomes cumbersome for complex business logic, string manipulation, or asynchronous tasks. | Uses TypeScript, a language familiar to most web and mobile developers. Excellent for complex business logic, handling JSON, and integrating with external services via npm/deno modules. |
| **Security** | Security is managed through PostgreSQL's robust role and privilege system. Functions can run with the permissions of the caller (SECURITY INVOKER) or the creator (SECURITY DEFINER), offering fine-grained control.30 | Security is the developer's responsibility. It requires explicit JWT validation for every request and rigorous input sanitization to prevent vulnerabilities. Secrets must be managed as environment variables.33 |
| **Cost** | Consumes database compute resources (CPU, memory, IOPS). Intensive functions can necessitate upgrading the database plan. | Billed on a serverless model (invocations, execution duration, memory usage). Can be more cost-effective for workloads that are infrequent but computationally expensive. |
| **Best For** | Data-intensive calculations, database triggers, enforcing complex data constraints, and performing atomic, multi-statement transactions (e.g., the core calculate\_and\_apply\_epp logic). | Public API endpoints, handling webhooks, integrating with third-party APIs, and orchestrating calls to database functions (e.g., the /record-workout endpoint). |

### **3.4 Decision Framework and Hybrid Patterns for 16BitFit-V3**

The most performant, scalable, and maintainable architecture for 16BitFit-V3 is not to choose one compute option over the other, but to create an event-driven pipeline that uses each for its specific strengths.

**Recommended Logic Flow:**

1. **Client (React Native)**: The user finishes a workout. The app sends the raw data (e.g., { "type": "running", "duration\_seconds": 1800 }) via a POST request to a dedicated Supabase Edge Function.  
2. **Edge Function (/record-workout)**: This function acts as the secure, public-facing ingress point.  
   * It authenticates the user by validating the JWT from the Authorization header.  
   * It performs strict input validation to ensure the data is in the correct format.  
   * It performs a single, fast INSERT of the raw data into the fitness\_logs table.  
   * It immediately returns a 200 OK response to the client, allowing the UI to show a "Workout Saved\!" message instantly.  
3. **Database Trigger (on fitness\_logs INSERT)**: The insertion into the fitness\_logs table automatically fires a trigger.  
   * This trigger is configured to execute the calculate\_and\_apply\_epp PostgreSQL function, passing in the relevant IDs from the NEW row.  
4. **PostgreSQL Function (calculate\_and\_apply\_epp)**: This function, running with high-performance proximity to the data, executes the core game logic.  
   * It performs all necessary calculations and updates the avatar\_stats table within a single transaction.  
5. **Realtime Broadcast (via Trigger)**: As established in Section 1, the UPDATE to the avatar\_stats table fires its own trigger, which constructs a minimal payload and broadcasts it to the user's private channel, completing the cycle by updating the client's UI with the new stats.

This hybrid, asynchronous pattern is maximally efficient. The user-facing component (the Edge Function) is optimized for low-latency response, while the data-intensive component (the PostgreSQL Function) is optimized for high-throughput data processing. This separation of concerns creates a system that is both highly responsive and robustly scalable.

## **Section 4: Fortifying Edge Functions for Game Integrity**

In a competitive mobile game, maintaining game integrity is as important as performance. Supabase Edge Functions, serving as the primary gateway for client interactions, must be rigorously secured to prevent cheating and protect against common web vulnerabilities. A multi-layered defense strategy, combining platform features with disciplined coding practices, is essential.

### **4.1 Authentication and Authorization within Edge Functions**

Every sensitive Edge Function must verify the identity and permissions of the user making the request. It is a critical error to assume that a function, even if obscurely named, will not be discovered and targeted.

* **JWT Validation**: The standard for securing Edge Functions is to require a valid JSON Web Token (JWT) issued by Supabase Auth. The function must extract the token from the Authorization: Bearer \<token\> header of the incoming request. The @supabase/supabase-js client library can then be used to create an authenticated server-side client that automatically validates the token against the project's JWT secret.7 If the token is invalid or expired, the function must immediately terminate with a 401 Unauthorized error.  
  TypeScript  
  // Inside an Edge Function (e.g., /functions/record-workout/index.ts)  
  import { createClient } from '@supabase/supabase-js';

  //... inside the request handler  
  const authHeader \= req.headers.get('Authorization');  
  if (\!authHeader) {  
    return new Response('Missing authorization header', { status: 401 });  
  }

  const supabaseClient \= createClient(  
    Deno.env.get('SUPABASE\_URL')\!,  
    Deno.env.get('SUPABASE\_ANON\_KEY')\!,  
    { global: { headers: { Authorization: authHeader } } }  
  );

  const { data: { user }, error } \= await supabaseClient.auth.getUser();

  if (error ||\!user) {  
    return new Response('Invalid JWT', { status: 401 });  
  }  
  // Proceed with logic, user is authenticated

* **Enforcing Granular Access Control**: Authentication confirms *who* the user is; authorization determines *what* they are allowed to do. For more advanced scenarios, such as admin-only functions, the logic should inspect the user's custom claims stored in raw\_app\_meta\_data.35 This data is secure as it can only be modified server-side, making it a reliable source for role-based access control (RBAC).

### **4.2 Rigorous Input Validation and Sanitization**

All data originating from a client device must be considered untrustworthy. Rigorous server-side validation is the primary defense against a wide range of attacks, including data corruption, injection vulnerabilities, and denial-of-service vectors.33

* **Schema-Based Validation**: The most robust method for input validation is to use a schema-based validation library. A tool like Zod allows developers to define a strict schema for the expected request body. The function can then parse the incoming data against this schema, and if validation fails, it can immediately reject the request with a 400 Bad Request error, providing clear feedback on what was wrong. This prevents malformed or malicious data from ever reaching the core game logic or database.34  
  TypeScript  
  import { z } from 'https://deno.land/x/zod/mod.ts';

  const workoutSchema \= z.object({  
    type: z.enum(\['running', 'lifting', 'cycling'\]),  
    duration\_seconds: z.number().int().positive(),  
    //... other fields  
  });

  //... inside the request handler  
  const body \= await req.json();  
  const validationResult \= workoutSchema.safeParse(body);

  if (\!validationResult.success) {  
    return new Response(JSON.stringify(validationResult.error), { status: 400 });  
  }  
  // Proceed with validated data: validationResult.data

### **4.3 Secure Management of API Keys and Secrets**

The security of the entire backend rests on the proper management of secret keys.

* **Use Environment Variables for Secrets**: All sensitive credentials, especially the SUPABASE\_SERVICE\_ROLE\_KEY, must be stored as encrypted environment variables within the Supabase project's settings. They should never be hardcoded into the function's source code. Inside the Deno runtime, these are accessed securely via Deno.env.get("SECRET\_NAME").32  
* **Principle of Least Privilege**: The public anon key should be used whenever possible. The service\_role key, which bypasses all RLS policies, should be used only when absolutely necessary (e.g., in a trusted server environment for administrative tasks). When an Edge Function needs to perform an action that requires elevated privileges, a service\_role client can be created, but the logic within that part of the function must be exceptionally secure, as it operates outside the protection of RLS.7

### **4.4 Anti-Cheating Patterns**

Designing the system to be inherently resistant to cheating is crucial for a competitive game.

* **Server-Authoritative Logic**: This is the most fundamental principle of anti-cheat design. The client should only ever report its *actions* or *inputs* (e.g., "I completed a 30-minute run"). It should never be allowed to report the *outcome* (e.g., "I earned 500 EPP"). All calculations that affect game state, such as awarding points, leveling up, or determining combat damage, must be performed exclusively on the server (within Edge Functions or PostgreSQL Functions).33 This prevents players from simply modifying the client-side code or network traffic to grant themselves unearned rewards.  
* **Rate Limiting and Throttling**: To prevent abuse, such as a player spamming the /record-workout endpoint with a script, rate limiting must be implemented. While Supabase provides some built-in rate limiting on its Auth endpoints 36, custom rate limiting for Edge Function endpoints is the developer's responsibility. A common and effective pattern is to use a fast, in-memory data store like Upstash Redis in conjunction with an Edge Function to track request counts from a given user or IP address and reject requests that exceed a defined threshold.32  
* **Enable Supabase Attack Protection**: The Supabase dashboard provides "Attack Protection" features for authentication, including CAPTCHA integration and email address abuse detection. These should be enabled to provide a first line of defense against automated account creation and brute-force attacks.36

By implementing these security best practices as a standard for all Edge Function development, the 16BitFit-V3 team can build a secure backend that protects player data and ensures a fair, competitive environment.

## **Section 5: Ecosystem Integration and Client-Side State Management**

A performant backend is only half the equation; the React Native client must be architected to handle real-time data efficiently, maintain a consistent state, and provide a fluid user experience, even under adverse network conditions. This section details recommended libraries and patterns for building a robust client that integrates seamlessly with the Supabase backend.

### **5.1 Core Client Libraries and Tooling**

The foundation of the client-side integration is the official Supabase JavaScript library.

* **@supabase/supabase-js**: This is the canonical library for all interactions with the Supabase backend from a JavaScript environment. It provides a unified, type-safe interface for Authentication, database CRUD operations (via PostgREST), Realtime subscriptions, invoking Edge Functions, and managing Storage.12  
* **React Native Environment**: To function correctly within a React Native environment, @supabase/supabase-js requires a few additional dependencies and polyfills. Specifically, a storage adapter is needed to persist the user's session securely on the device. @react-native-async-storage/async-storage is the standard for this purpose. Additionally, react-native-url-polyfill is often required to ensure compatibility of the networking layer.38

### **5.2 Advanced State Synchronization with Legend-State**

For a game with complex, interconnected UI elements that must react to real-time updates, a powerful state management library is essential. While many options exist (like Zustand or Redux), Legend-State stands out due to its first-class, built-in support for Supabase and its focus on offline-first architectures.

* **Built-in Supabase Sync**: Legend-State offers a syncedSupabase plugin that dramatically simplifies the process of synchronizing a piece of local state with a Supabase database table. It handles the boilerplate of setting up Realtime subscriptions and applying incoming changes to the local state observable automatically.40  
* **Offline-First Capabilities**: A key advantage for a mobile game is Legend-State's design for local-first applications. It can be configured to persist all state changes to local storage (via AsyncStorage) immediately. If the device is offline, these changes are queued. When connectivity is restored, the library automatically retries and syncs the pending changes with the Supabase backend.40 This provides a seamless user experience, allowing players to interact with the game even with intermittent network access.  
* **Performance through Fine-Grained Reactivity**: Legend-State is engineered for performance. It enables fine-grained reactivity, meaning that when a piece of state changes, only the specific components that depend on that exact piece of state will re-render. This avoids the unnecessary re-rendering of large component trees, which is critical for maintaining a smooth 60 FPS frame rate in a game UI.40

### **5.3 Leveraging React Query for Caching and Optimistic UI**

While a library like Legend-State is excellent for managing global UI state, TanStack Query (formerly React Query) is the industry standard for managing *server state*. It excels at handling the lifecycle of data that is fetched from an API, including caching, background refetching, and mutations.

* **Server State Management**: React Query simplifies data fetching logic by abstracting away the complexities of loading states, error handling, and caching. Instead of manually managing this in useEffect hooks, developers can use the useQuery hook to declaratively fetch data, which React Query will then cache and keep fresh according to configurable rules.41  
* **Optimistic UI Updates**: This is a crucial pattern for creating a highly responsive user experience. When a user performs an action (like updating their profile name), an optimistic update involves changing the UI *immediately*, before the server has confirmed the change. React Query's useMutation hook provides an onMutate callback that makes this pattern easy to implement. The developer can manually update the local query cache with the new value. If the server request succeeds, the cache is simply re-validated. If it fails, React Query automatically rolls the cache back to its previous state.42 This makes the application feel instantaneous to the user.  
* **Ecosystem Integration**: The community has developed libraries like @supabase-cache-helpers/storage-react-query and supaquery that bridge the gap between Supabase and React Query. These helpers can automatically generate query keys and handle cache invalidation after mutations, further reducing boilerplate code.42

### **5.4 Ensuring Data Integrity: Handling Connection Drops and Missed Messages**

A significant and often overlooked challenge with Supabase Realtime is its lack of a built-in message queue or history. If a client disconnects for any reason—poor network, the app being backgrounded by the OS—it will miss any broadcast messages sent during that downtime. The client's automatic reconnection feature does *not* replay these missed events.45 For a game where state integrity is vital, this reliability gap must be addressed at the application level.

**The "Fetch-on-Reconnect" Pattern**

The recommended solution is to implement a state versioning and re-synchronization mechanism.

1. **State Versioning**: Add a last\_updated\_at TIMESTAMPTZ column to all critical, real-time tables (like avatar\_stats). This column should be automatically updated to NOW() whenever the row is modified, which can be enforced with a simple database trigger.  
2. **Re-sync Logic**: The client application must be designed to handle reconnection events. The @supabase/supabase-js client emits events for connection state changes. The client should listen for the transition back to a CONNECTED state.  
3. **On Reconnection**: When the client reconnects, it must perform the following steps to ensure its state is consistent:  
   * Check the most recent last\_updated\_at value it has in its local state for a given entity.  
   * Make a standard REST API call to the database (e.g., using .from('avatar\_stats').select('\*').gt('last\_updated\_at', localTimestamp)). This fetches all rows that have been modified since the client's last known state.  
   * Merge the received changes into its local state store (e.g., Legend-State or the React Query cache).  
   * Only after this re-sync is complete should it consider its state consistent and re-establish its Realtime subscriptions for future updates.

This pattern transforms Supabase Realtime from a potentially lossy fire-and-forget system into a robust and eventually consistent state synchronization mechanism, which is a non-negotiable requirement for a multiplayer or competitive game.

## **Section 6: Competitive Landscape: Supabase vs. Alternative Backends**

The selection of a Backend-as-a-Service (BaaS) platform is a long-term strategic decision that influences developer velocity, operational overhead, and the financial scalability of the application. This section provides a comparative analysis of Supabase against its primary competitors—Firebase and self-hosted solutions—to validate its selection for the specific requirements of the 16BitFit-V3 mobile game.

### **6.1 Supabase vs. Firebase (Realtime Database/Firestore)**

Firebase is the most established player in the BaaS market and the most direct competitor to Supabase. While both offer a similar suite of tools (database, auth, functions, storage), their foundational philosophies and architectures lead to significant trade-offs.

* **Data Model (SQL vs. NoSQL)**: This is the most fundamental difference. Supabase is built on PostgreSQL, a powerful relational database. This is exceptionally well-suited for game data, which is often highly structured and interconnected (players, avatars, stats, items, logs). The ability to perform complex queries with JOINs, use transactions for data integrity, and enforce a rigid schema is a major advantage for maintaining a consistent and queryable game state.2 Firebase uses NoSQL databases (Realtime Database and Firestore), which store data in a JSON-like tree structure. While flexible for rapid prototyping, managing relational data requires denormalization (duplicating data) or performing multiple queries on the client-side, which can become complex to manage and expensive to execute.46  
* **Real-time and Offline Support**: Firebase's real-time synchronization is widely considered mature and battle-tested, and it offers excellent, built-in offline support out of the box.2 Firestore automatically caches data on the client, allowing the app to function seamlessly offline and syncing changes upon reconnection. This is a significant advantage for mobile applications.46 Supabase's real-time performance is strong, as shown by its benchmarks 18, but it lacks native offline support. This capability must be implemented by the developer, typically by integrating a dedicated local-first state management library like Legend-State.40  
* **Scalability and Cost**: This is a critical differentiator. Firebase operates on a usage-based pricing model, billing for each individual database read, write, and delete operation.46 For a successful game with a large and active user base, this can lead to unpredictable and potentially astronomical costs, creating significant business risk.49 Supabase offers a more predictable, tiered pricing model based on resource usage (e.g., database size, compute hours) and does not charge per API request.46 This makes it far easier to forecast costs and scale the business sustainably.  
* **Vendor Lock-in and Extensibility**: As an open-source platform built on the PostgreSQL standard, Supabase offers a clear path away from vendor lock-in. A Supabase database can be migrated to any other PostgreSQL provider with relative ease.48 Firebase, as a proprietary Google product, creates a much stronger dependency on its ecosystem, making migration a complex and costly undertaking.49 Furthermore, Supabase's foundation on PostgreSQL provides access to a vast ecosystem of powerful extensions (like PostGIS for geospatial data or pgvector for AI), offering unparalleled extensibility.6

### **6.2 Supabase vs. Self-Hosted WebSocket Solutions**

The alternative to using a managed BaaS is to build and host the backend infrastructure from scratch, for example, using a Node.js server with a library like Socket.IO or a custom Elixir/Phoenix application.

* **Complexity and Maintenance**: The "build-vs-buy" trade-off is stark. A self-hosted solution offers ultimate control and flexibility but comes with immense operational overhead. The development team becomes responsible for provisioning servers, managing databases, ensuring high availability, implementing scaling strategies, patching security vulnerabilities, and monitoring the entire stack.50 This is a significant and continuous engineering effort that diverts resources away from developing the core game experience.  
* **Integration**: Supabase provides a tightly integrated ecosystem where Authentication, Database, RLS, and Realtime all work together seamlessly. In a self-hosted environment, these integrations must be built from scratch. For example, a secure mechanism would be needed to validate a user's session token and authorize their connection to the WebSocket server, a non-trivial task that Supabase handles out of the box.  
* **Scalability**: While it is possible to build a highly scalable real-time server, it is a significant engineering challenge. Supabase's Realtime server is built on Elixir and the Phoenix framework, a technology stack renowned for its ability to handle millions of concurrent WebSocket connections with high performance and fault tolerance.13 Replicating this level of scalability and reliability in-house would require specialized expertise and substantial investment.  
* **Cost**: While the direct infrastructure costs of self-hosting may appear lower initially, the Total Cost of Ownership (TCO) is often significantly higher when factoring in the developer hours required for initial development, ongoing maintenance, and scaling the system. A managed service like Supabase abstracts away this complexity, allowing a smaller team to deliver a more robust product faster.

### **6.3 Final Verdict: Architectural Recommendation for 16BitFit-V3**

After a thorough analysis of the architectural requirements and competitive landscape, **Supabase is the recommended backend platform for 16BitFit-V3.**

It strikes the optimal balance between developer velocity, long-term scalability, and business risk.

* Its **relational PostgreSQL core** provides a more robust and appropriate foundation for complex game data compared to Firebase's NoSQL offerings.  
* Its **managed Realtime and Edge Function services** offer the performance and scalability of a purpose-built system without the immense operational burden and cost of a self-hosted solution.  
* Its **predictable pricing model** de-risks the project's financial scalability, a critical advantage over Firebase's pay-per-operation model.

While Supabase has known weaknesses, such as the lack of native offline support and the potential for missed real-time messages on disconnect, these can be effectively mitigated with the client-side architectural patterns outlined in this report (e.g., using Legend-State and implementing a "fetch-on-reconnect" strategy).

By adopting the specific patterns detailed herein—from the Broadcast-with-triggers Realtime strategy to the hybrid model for server-side logic—the 16BitFit-V3 team can harness the full power of the Supabase platform. This will enable the creation of a secure, high-performance, and scalable backend, providing a solid foundation for the game's success.

#### **Works cited**

1. Architecture | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/getting-started/architecture](https://supabase.com/docs/guides/getting-started/architecture)  
2. Supabase vs. Firebase: a Complete Comparison in 2025 \- Bytebase, accessed October 24, 2025, [https://www.bytebase.com/blog/supabase-vs-firebase/](https://www.bytebase.com/blog/supabase-vs-firebase/)  
3. Database design basics \- Microsoft Support, accessed October 24, 2025, [https://support.microsoft.com/en-us/office/database-design-basics-eb2159cf-1e30-401a-8084-bd4f9c9ca1f5](https://support.microsoft.com/en-us/office/database-design-basics-eb2159cf-1e30-401a-8084-bd4f9c9ca1f5)  
4. How to Design a Database for Multiplayer Online Games \- GeeksforGeeks, accessed October 24, 2025, [https://www.geeksforgeeks.org/dbms/how-to-design-a-database-for-multiplayer-online-games/](https://www.geeksforgeeks.org/dbms/how-to-design-a-database-for-multiplayer-online-games/)  
5. supabase functions (not edge) \- DEV Community, accessed October 24, 2025, [https://dev.to/tigawanna/supabase-functions-not-edge-2o1](https://dev.to/tigawanna/supabase-functions-not-edge-2o1)  
6. Database | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/database/overview](https://supabase.com/docs/guides/database/overview)  
7. Best Practices for Securing and Scaling Supabase for Production Data Workloads | by firman brilian | Medium, accessed October 24, 2025, [https://medium.com/@firmanbrilian/best-practices-for-securing-and-scaling-supabase-for-production-data-workloads-4394aba9e868](https://medium.com/@firmanbrilian/best-practices-for-securing-and-scaling-supabase-for-production-data-workloads-4394aba9e868)  
8. Best practices for using Spanner as a gaming database | Google Cloud, accessed October 24, 2025, [https://cloud.google.com/spanner/docs/best-practices-gaming-database](https://cloud.google.com/spanner/docs/best-practices-gaming-database)  
9. PostGraphile | PostgreSQL Schema Design, accessed October 24, 2025, [https://www.graphile.org/postgraphile/postgresql-schema-design/](https://www.graphile.org/postgraphile/postgresql-schema-design/)  
10. Troubleshooting | RLS Performance and Best ... \- Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)  
11. Subscribing to Database Changes | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/realtime/subscribing-to-database-changes](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes)  
12. How to Implement Supabase Realtime in Your App \- Chat2DB, accessed October 24, 2025, [https://chat2db.ai/resources/blog/implement-supabase-realtime](https://chat2db.ai/resources/blog/implement-supabase-realtime)  
13. Self-Hosting | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/reference/self-hosting-realtime/introduction](https://supabase.com/docs/reference/self-hosting-realtime/introduction)  
14. Subscribe & Unsubscribe to Supabase channels \- WeWeb | Documentation, accessed October 24, 2025, [https://docs.weweb.io/websockets/supabase-realtime/subscribe-channel.html](https://docs.weweb.io/websockets/supabase-realtime/subscribe-channel.html)  
15. Realtime | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime)  
16. Realtime \- Broadcast | Supabase Features, accessed October 24, 2025, [https://supabase.com/features/realtime-broadcast](https://supabase.com/features/realtime-broadcast)  
17. Getting Started with Realtime | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/realtime/getting\_started](https://supabase.com/docs/guides/realtime/getting_started)  
18. Benchmarks | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/realtime/benchmarks](https://supabase.com/docs/guides/realtime/benchmarks)  
19. Supabase Realtime, with Multiplayer Features, accessed October 24, 2025, [https://supabase.com/blog/supabase-realtime-with-multiplayer-features](https://supabase.com/blog/supabase-realtime-with-multiplayer-features)  
20. Supabase Realtime postgres changes scalability \- Reddit, accessed October 24, 2025, [https://www.reddit.com/r/Supabase/comments/1lfs6b7/supabase\_realtime\_postgres\_changes\_scalability/](https://www.reddit.com/r/Supabase/comments/1lfs6b7/supabase_realtime_postgres_changes_scalability/)  
21. Blog | Realtime \- Supabase, accessed October 24, 2025, [https://supabase.com/blog/tags/realtime](https://supabase.com/blog/tags/realtime)  
22. Automating performance tests \- Supabase, accessed October 24, 2025, [https://supabase.com/blog/automating-performance-tests](https://supabase.com/blog/automating-performance-tests)  
23. Realtime Quotas | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/realtime/quotas](https://supabase.com/docs/guides/realtime/quotas)  
24. Supabase Realtime Rate Limit Exceeded \- Doctor Droid, accessed October 24, 2025, [https://drdroid.io/stack-diagnosis/supabase-realtime-rate-limit-exceeded](https://drdroid.io/stack-diagnosis/supabase-realtime-rate-limit-exceeded)  
25. Real-Time Multiplayer with Supabase Realtime and Flutter \- Vibe Studio, accessed October 24, 2025, [https://vibe-studio.ai/insights/real-time-multiplayer-with-supabase-realtime-and-flutter](https://vibe-studio.ai/insights/real-time-multiplayer-with-supabase-realtime-and-flutter)  
26. Reports | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/telemetry/reports](https://supabase.com/docs/guides/telemetry/reports)  
27. Supabase Realtime High latency on the server side is affecting performance. \- Doctor Droid, accessed October 24, 2025, [https://drdroid.io/stack-diagnosis/supabase-realtime-high-latency-on-the-server-side-is-affecting-performance](https://drdroid.io/stack-diagnosis/supabase-realtime-high-latency-on-the-server-side-is-affecting-performance)  
28. Supabase Back-end Logics | Database vs Edge Functions ..., accessed October 24, 2025, [https://www.closefuture.io/blogs/supabase-database-vs-edge-functions](https://www.closefuture.io/blogs/supabase-database-vs-edge-functions)  
29. Supabase: what's the difference between stored procedures, RPC's, database functions, etc, accessed October 24, 2025, [https://stackoverflow.com/questions/77866348/supabase-whats-the-difference-between-stored-procedures-rpcs-database-funct](https://stackoverflow.com/questions/77866348/supabase-whats-the-difference-between-stored-procedures-rpcs-database-funct)  
30. Database Functions | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/database/functions](https://supabase.com/docs/guides/database/functions)  
31. Database Functions vs Edge Functions \- Supabase \- Answer Overflow, accessed October 24, 2025, [https://www.answeroverflow.com/m/1422016088337813544](https://www.answeroverflow.com/m/1422016088337813544)  
32. Edge Functions | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)  
33. Best Security Practices in Supabase: A Comprehensive Guide ..., accessed October 24, 2025, [https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide](https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide)  
34. Supabase Edge Functions Function Security Vulnerability \- Doctor Droid, accessed October 24, 2025, [https://drdroid.io/stack-diagnosis/supabase-edge-functions-function-security-vulnerability](https://drdroid.io/stack-diagnosis/supabase-edge-functions-function-security-vulnerability)  
35. Row Level Security | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
36. Harden Your Supabase: Lessons from Real-World Pentests, accessed October 24, 2025, [https://www.pentestly.io/blog/supabase-security-best-practices-2025-guide](https://www.pentestly.io/blog/supabase-security-best-practices-2025-guide)  
37. supabase/realtime: Broadcast, Presence, and Postgres Changes via WebSockets \- GitHub, accessed October 24, 2025, [https://github.com/supabase/realtime](https://github.com/supabase/realtime)  
38. Build a User Management App with Expo React Native | Supabase Docs, accessed October 24, 2025, [https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)  
39. Use Supabase Auth with React Native, accessed October 24, 2025, [https://supabase.com/docs/guides/auth/quickstarts/react-native](https://supabase.com/docs/guides/auth/quickstarts/react-native)  
40. Local-first Realtime Apps with Expo and Legend-State \- Supabase, accessed October 24, 2025, [https://supabase.com/blog/local-first-expo-legend-state](https://supabase.com/blog/local-first-expo-legend-state)  
41. How to use Supabase with React Query \- Makerkit, accessed October 24, 2025, [https://makerkit.dev/blog/saas/supabase-react-query](https://makerkit.dev/blog/saas/supabase-react-query)  
42. kaelansmith/supaquery: Easily integrate Supabase & React Query, with built-in optimistic updates. \- GitHub, accessed October 24, 2025, [https://github.com/kaelansmith/supaquery](https://github.com/kaelansmith/supaquery)  
43. Enhancing React Native Apps with Optimistic UI: Mastering useOptimistic and useTransition, accessed October 24, 2025, [https://fiyaz2110.medium.com/enhancing-react-native-apps-with-optimistic-ui-mastering-useoptimistic-and-usetransition-7d29c6867481](https://fiyaz2110.medium.com/enhancing-react-native-apps-with-optimistic-ui-mastering-useoptimistic-and-usetransition-7d29c6867481)  
44. supabase-cache-helpers/storage-react-query \- NPM, accessed October 24, 2025, [https://www.npmjs.com/package/%40supabase-cache-helpers%2Fstorage-react-query](https://www.npmjs.com/package/%40supabase-cache-helpers%2Fstorage-react-query)  
45. realtime subscription reliability \- Supabase \- Answer Overflow, accessed October 24, 2025, [https://www.answeroverflow.com/m/1398819457035538635](https://www.answeroverflow.com/m/1398819457035538635)  
46. Supabase vs Firebase, accessed October 24, 2025, [https://supabase.com/alternatives/supabase-vs-firebase](https://supabase.com/alternatives/supabase-vs-firebase)  
47. Firebase vs. Supabase (vs. Both?) \- Reddit, accessed October 24, 2025, [https://www.reddit.com/r/Firebase/comments/10osnpn/firebase\_vs\_supabase\_vs\_both/](https://www.reddit.com/r/Firebase/comments/10osnpn/firebase_vs_supabase_vs_both/)  
48. Supabase vs. Firebase: Which is best? \[2025\] \- Zapier, accessed October 24, 2025, [https://zapier.com/blog/supabase-vs-firebase/](https://zapier.com/blog/supabase-vs-firebase/)  
49. Firebase vs. Supabase: Which BaaS Should You Choose for Your App in 2025? \- Calda, accessed October 24, 2025, [https://www.thecalda.com/blog/firebase-vs-supabase-which-baas-should-you-choose-for-your-app-in-2025](https://www.thecalda.com/blog/firebase-vs-supabase-which-baas-should-you-choose-for-your-app-in-2025)  
50. Socket.IO vs Supabase Realtime: which should you choose in 2025?, accessed October 24, 2025, [https://ably.com/compare/socketio-vs-supabase](https://ably.com/compare/socketio-vs-supabase)  
51. Should I use WebSockets or just keep using real-time DB? : r/Supabase \- Reddit, accessed October 24, 2025, [https://www.reddit.com/r/Supabase/comments/1hcso3d/should\_i\_use\_websockets\_or\_just\_keep\_using/](https://www.reddit.com/r/Supabase/comments/1hcso3d/should_i_use_websockets_or_just_keep_using/)