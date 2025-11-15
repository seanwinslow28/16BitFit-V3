# **The Ultimate Prompting Guide for MagicPath.ai**

*by your MagicPath.ai Prompting Specialist*

---

## **TL;DR (use this when you’re in a rush)**

* **Say exactly what you want**: components, layout, data, interactions, constraints, and style tokens.

* **Work in steps**: set a global theme → generate screens/components → refine → wire flows.

* **Structure prompts** with sections like `Goal`, `Layout`, `Components`, `Data`, `Interactions`, `Constraints`, `Style`.

* **Persist the theme** across generations (“use the existing theme tokens on the canvas”).

* **Exclude things explicitly** with a “Constraints / Avoid” block (and when possible, describe the positive alternative).

* **Reuse assets** by referencing prior work (e.g., component recall), and keep flows on the infinite canvas for context. [Banani+1](https://www.banani.co/blog/magicpath-ai-review)

---

## **1\) The Bad → Better → Best Framework (5 worked examples)**

Copy–paste the **BEST** versions into MagicPath. They’re written to be “high‑fidelity” and production‑oriented.

### **Example 1 — SaaS Revenue Dashboard (Web)**

**BAD**

`Make a dashboard.`

**BETTER**

`Create a responsive SaaS dashboard for a financial analytics app with a sidebar, a top navbar, KPI cards, and an MRR line chart.`

**BEST**

`[Goal] Build a responsive SaaS revenue dashboard (web) for a B2B analytics app.`

`[Layout]`  
`- 12‑column grid, 1200px max content width, 24px gutters.`  
`- Left fixed sidebar (240px), scrollable main content, sticky top navbar.`  
`- Above‑the‑fold: 4 KPI cards.`

`[Components]`  
`1) KPI cards (4): New Users, Churn Rate, LTV, ARPU; each shows value, delta badge (+/–), and mini‑sparkline.`  
`2) Main chart: "Monthly Recurring Revenue (MRR)" line graph with monthly ticks, hover tooltips, and a 12‑month range selector (90/180/365 quick filters).`  
`3) Revenue breakdown table with sortable columns: Plan, Customers, MRR, Churn %, LTV.`  
`4) Alerts panel: empty state + example "Payment processor delay" alert.`

`[Data]`  
`- Seed with realistic demo data (USD). Round to whole dollars; percent to 1 decimal.`  
`- Example: MRR last 12 months with seasonality; churn 2–6%; LTV $900–$2,400.`

`[Interactions]`  
`- KPI hover reveals calculation note.`  
`- Chart hover + keyboard left/right to step months; 200ms ease‑out animations.`  
`- Table: sort by MRR (desc) by default; column resize.`

`[Constraints / Avoid]`  
`- Avoid donut charts; use line for trends, bar for breakdowns.`  
`- No stock photos.`

`[Style tokens]`  
`- Primary #4F46E5; Accent #10B981; Error #EF4444.`  
`- Neutral scale Slate (50–900). Radius 8px; shadow 0 6px 20px rgba(15,23,42,.08).`  
`- Font: Inter (14/16/20/24/32); spacing 4/8/12/16/24/32.`

`[Accessibility]`  
`- Min contrast 4.5:1 on text; focus rings visible; tab order logical.`

`[Persistence]`  
`- Save theme tokens for use on subsequent screens in this project. Keep styles consistent across generations.`

---

### **Example 2 — Mobile Fintech Onboarding (iOS/Android)**

**BAD**

`Design an onboarding flow.`

**BETTER**

`Design a 3‑step onboarding for a fintech app with email sign‑up and KYC.`

**BEST**

`[Goal] Create a 4‑screen mobile onboarding (iOS/Android): Welcome → Create Account → Verify Email → KYC (ID + selfie).`

`[Layout]`  
`- Safe‑area aware; 8‑pt grid; sticky primary CTA bottom.`  
`- Progress indicator (4 steps) top.`

`[Components]`  
`- Welcome: logo, tagline, "Create account" (primary), "I already have an account" (ghost).`  
`- Create Account: email, password, password requirements, show/hide toggle, SSO buttons (Apple/Google).`  
`- Verify Email: code entry with 6 boxes, auto‑advance, "Resend in :30".`  
`- KYC: upload ID (front/back), selfie capture, status checklist.`

`[Interactions]`  
`- Real‑time validation; inline errors; disabled CTA until valid.`  
`- Haptic microfeedback on success; 160ms ease‑out transitions.`

`[Constraints / Avoid]`  
`- Avoid social proof carousels; keep distraction low.`  
`- No marketing popups during KYC.`

`[Style tokens]`  
`- Carry over project theme tokens if present; else Primary #0EA5E9, Neutral Zinc.`  
`- Font system defaults (San Francisco/Roboto) for platform fluency.`

`[Copy]`  
`- Plain‑language, short sentences, localizable strings with placeholders.`

`[Output]`  
`- Generate 4 screens on the canvas with arrows indicating flow; name frames "01‑Welcome", "02‑Create‑Account", "03‑Verify‑Email", "04‑KYC".`

---

### **Example 3 — E‑commerce Product Detail Page (Web PDP)**

**BAD**

`Make a product page.`

**BETTER**

`Build a product detail page with gallery, price, and add to cart.`

**BEST**

`[Goal] Product Detail Page for a DTC apparel store.`

`[Layout]`  
`- 2‑column: left gallery, right details; collapses to stacked at < 1024px.`  
`- Sticky "Add to Cart" on mobile.`

`[Components]`  
`- Media gallery: hero image, 4 thumbnails, zoom on hover (desktop), swipe (mobile).`  
`- Title, reviews (stars + count), price with strike‑through sale.`  
`- Variant pickers: color swatches, size grid with disabled out‑of‑stock.`  
`- Quantity stepper; Add to Cart; Save to wishlist (icon button).`  
`- Details accordions: Fabric & Care, Shipping & Returns, Size Guide (modal).`  
`- Recommendation row: 4 cards, "You may also like".`

`[Interactions]`  
`- Variant selection updates SKU, price, gallery.`  
`- Size guide modal keyboard navigable.`  
`- Add to Cart triggers mini‑cart flyout with undo.`

`[Constraints / Avoid]`  
`- Avoid auto‑playing video; no parallax.`  
`- Limit content width to 1140px.`

`[Style tokens]`  
`- Primary #111827; Accent #2563EB; Success #16A34A.`  
`- Radii 6/12; shadows subtle; rounded buttons only.`

`[Accessibility]`  
`- Announce size/stock changes for screen readers; ensure 44px tap targets.`

---

### **Example 4 — Admin Data Table (User Management)**

**BAD**

`Create a user table.`

**BETTER**

`Create a user management table with filters and actions.`

**BEST**

`[Goal] Admin "Users" data table.`

`[Columns]`  
`- Name, Email, Role (Admin/Manager/Viewer), Status (Active/Suspended/Invited), Last Seen, Actions.`

`[Layout & Interactions]`  
`- Sticky header; horizontal scroll if needed; column resize + reorder.`  
`- Bulk select with indeterminate checkbox; bulk actions: Invite, Suspend, Change Role.`  
`- Row actions menu (3‑dot): View, Suspend/Unsuspend, Reset Password.`  
`- Filters: role (multi), status (multi), last seen (date range), search (name/email).`  
`- Empty state + zero‑match state with “clear filters” chip.`

`[Data]`  
`- Seed with 50 realistic entries; generate plausible names/emails; mix statuses.`

`[Constraints / Avoid]`  
`- Avoid full‑page modals; use right‑side drawer for “View”.`  
`- No inline editable cells (use drawer form).`

`[Style]`  
`- Use existing project theme; density “comfortable” (56px rows); zebra striping off; hover highlight on.`

`[Accessibility]`  
`- Screen‑reader labels on controls; announce bulk selection count.`

---

### **Example 5 — B2B Landing Page (Lead Gen)**

**BAD**

`Design a landing page.`

**BETTER**

`Design a B2B landing page with hero, features, and CTA.`

**BEST**

`[Goal] B2B SaaS landing page optimized for lead capture.`

`[Sections]`  
`1) Hero: value prop H1 (≤ 9 words), supporting copy (≤ 18 words), primary CTA "Book a demo" + secondary "See pricing", trust logos (5).`  
`2) Bento grid features (2x3 mosaic): 2 large, 4 small tiles; each tile: icon, H4, one‑line benefit.`  
`3) Social proof: 3 case studies with metrics; “from 4.3 → 4.8 CSAT in 60 days”.`  
`4) Integrations: 8 logos grid; tooltips on hover.`  
`5) Pricing teaser: 3 tiers summary; deep link to pricing page.`  
`6) Footer: sitemap, compliance badges.`

`[Layout]`  
`- Max width 1200px; 24/32 spacing scale; sticky top nav on scroll.`

`[Interactions]`  
`- Smooth‑scroll nav; hover lift on feature tiles; reduced‑motion alternative.`

`[Constraints / Avoid]`  
`- Avoid carousel; no stocky hero illustrations; keep reading width 60–72ch.`

`[Style]`  
`- Primary #1D4ED8; neutral slate; font Inter/DM Sans; radius 12; subtle gradients for hero.`

---

## **2\) Advanced Techniques**

### **A) Chain‑Prompting for a Multi‑Screen Flow (Login → Dashboard → Settings)**

Use this sequence to build a coherent flow with a persistent theme:

1. **Set the foundation (theme & tokens)**

`Create a global theme for this project and save tokens:`  
`- Primary #4F46E5, Accent #06B6D4, Error #EF4444`  
`- Neutral Slate (50–900), Radius 8, Shadow 0 6px 20px rgba(15,23,42,.08)`  
`- Typography: Inter with optical sizes for 14/16/20/24/32, weight 400/600`  
`Persist this theme across future generations on this canvas. Do not reset theme.`

2. **Screen 1 — Login**

`Generate "01‑Login" (web):`  
`- Centered auth card: email, password, remember me, primary "Sign in", secondary "Continue with Google/Apple"`  
`- Forgot password link, legal copy with privacy/terms links`  
`- Keyboard‑nav friendly; focus rings visible`

3. **Screen 2 — Dashboard**

`Generate "02‑Dashboard" using the existing theme:`  
`- 4 KPI cards; MRR line chart; recent activity list`  
`- Left sidebar with icons + labels; active state for “Dashboard”`  
`- Responsive behavior at 1280/1024/768/375 breakpoints; keep layout rules consistent`

4. **Screen 3 — Settings**

`Generate "03‑Settings":`  
`- Tabs: Profile, Security, Workspace`  
`- Security tab: password change form + 2FA toggle (with modal for setup)`  
`- Workspace tab: role management table; invite user drawer`

5. **Wire the flow \+ persist styles**

`Link “Sign in” on Login → Dashboard.`  
`Add a gear icon in the Dashboard navbar linking → Settings.`  
`Confirm theme tokens from step 1 are applied on all screens; do not introduce new colors.`

**Why this works in MagicPath**  
 MagicPath’s **infinite canvas** makes it natural to create multiple screens and connect them into **clickable flows**, while keeping **themes/styles consistent** across generations; you can also export **production‑oriented code** when you’re done. [Banani+1](https://www.banani.co/blog/magicpath-ai-review)

**Pro move — reuse pieces:** If you’ve created components earlier (e.g., KPI cards), reference/recall them by name in later prompts so the system pulls the same pattern and styling for consistency. Some users report using an **@component\_name** recall syntax when working with libraries. [Medium](https://medium.com/%40birdzhanhasan_26235/magicpath-ai-183688ec4c9d)

---

### **B) Visual–Technical Descriptors (say it like a designer and a front‑ender)**

Use these phrasing patterns to remove ambiguity:

* **Bento grid (marketing/features)**

  * “Create a 2×3 bento grid (mosaic). Large tiles span 2 columns × 2 rows; small tiles are 1×1. Keep gutters 24px. Each tile has icon (24px), H4 (max 48 chars), and one‑line benefit (≤ 12 words). Hover: translateY(–2px), shadow increase (200ms ease‑out).”

* **Glassmorphism (cards/banners)**

  * “Card background: rgba(255,255,255,0.08), backdrop‑filter: blur(12px), 1px inside border rgba(255,255,255,0.2), subtle inner highlight, soft shadow. Ensure 4.5:1 contrast for text chips.”

* **Neumorphism (soft UI)**

  * “Surface and controls share base color; use paired inner/outer diffuse shadows (2–6px). Maintain clear focus styles and contrast to avoid accessibility issues.”

* **Hover states**

  * “Buttons have states: default / hover / pressed / disabled. Hover: \+4% brightness, raise shadow; pressed: reduce Y by 1px, tighter shadow; all transitions 160–200ms ease‑out; respect prefers‑reduced‑motion.”

*(The point isn’t the buzzword—it’s turning it into measurable tokens: radii, opacities, blur, motion curves.)*

---

### **C) The “Negative Prompt” Equivalent in MagicPath**

**Is there a special command to *remove/avoid* elements?**  
 There isn’t public documentation of a dedicated *negative‑prompt field* in MagicPath; most practitioners simply spell out constraints in the prompt and keep them persistent across steps (e.g., a `Constraints / Avoid` block). Meanwhile, MagicPath write‑ups highlight flows, themes, and code export—not negative fields—so explicit wording is your best tool. [Banani+1](https://www.banani.co/blog/magicpath-ai-review)

**How to do it well**

* Add a **`[Constraints / Avoid]`** section:

  * “Avoid carousels; no stock images; no parallax; no full‑page modals; keep content width ≤ 1140px.”

* Where possible, **state the positive opposite** instead of “not X.” (This is a general best practice across generative tools: models follow positive targets more reliably than negations.) For example, instead of “no carousel,” write “use a static 2×3 bento grid.” [Ideogram Docs](https://docs.ideogram.ai/using-ideogram/prompting-guide/4-handling-negatives?utm_source=chatgpt.com)

* **Re‑assert constraints** in follow‑ups: “Keep all prior constraints; do **not** add carousels or parallax.”

* If something unwanted appears, issue a **surgical edit**: “Remove the hero video and replace it with a static image header using the same dimensions. Keep all other elements unchanged.”

**Reusable block (paste this into any prompt)**

`[Constraints / Avoid]`  
`- Do not introduce new colors outside the theme tokens.`  
`- No carousels, no parallax, no auto‑playing media.`  
`- Keep max content width ≤ 1140px; readable line length 60–72ch.`  
`- Maintain 4.5:1 contrast; preserve keyboard focus styles.`  
`(Apply these constraints to all subsequent edits in this project.)`

---

## **3\) Prompt Scaffolds (copy‑ready templates)**

### **A) Component prompt**

`[Goal] Build a {component} for {product/context}.`

`[Layout] {grid, container sizes, breakpoints}`  
`[States] default / hover / pressed / disabled / focus / error / empty`  
`[Data] {fields, types, realistic seeds, formatting rules}`  
`[Interactions] {sorting, filtering, hover, keyboard, animation timings}`  
`[Constraints / Avoid] {things to exclude, perf/a11y rules}`  
`[Style tokens] {color, radius, shadows, typography, spacing}`  
`[Output] {name the frame/layer, where to place on canvas}`

### **B) Screen prompt**

`[Goal] Create "{screen name}" for {platform}.`

`[Layout] {columns, gutters, sticky bars}`  
`[Sections] {ordered list with purpose per section}`  
`[Components] {reusable parts by name}`  
`[Interactions] {navigation, modals/drawers, edge cases}`  
`[Constraints / Avoid] {list}`  
`[Style tokens] use existing project theme tokens (do not reset)`  
`[Accessibility] {contrast, focus, tab order, motion alternatives}`

### **C) Flow prompt**

`[Goal] Build a {N}-screen flow: {Screen A} → {Screen B} → {Screen C}.`

`[Global theme] {tokens here, persist across screens}`  
`[Per-screen specs] {bullet points for each screen}`  
`[Navigation] {what links to what}`  
`[Data] {what carries across screens, example payloads}`  
`[Constraints / Avoid] {carry forward exclusions}`  
`[Output] Place screens left→right on the canvas, label 01/02/03, draw arrows between them.`

---

## **4\) Common Pitfalls (and fixes)**

* **Vague nouns (“make a dashboard”)** → **Be concrete**: name widgets, fields, and rules.

* **Forgetting breakpoints** → Specify target widths and how the layout collapses.

* **Style drift across generations** → “Use existing theme tokens; do not reset.” (Say it every time.)

* **Hidden complexity** (e.g., KYC) → List edge cases, error states, and copy.

* **Over‑negation** → Prefer positive substitutes (“use bento grid”) instead of “no carousel”. [Ideogram Docs](https://docs.ideogram.ai/using-ideogram/prompting-guide/4-handling-negatives?utm_source=chatgpt.com)

---

## **5\) MagicPath‑specific pointers (useful when planning prompts)**

* **Infinite canvas & multi‑screen prototypes** help you arrange flows spatially and keep context while iterating. [Banani](https://www.banani.co/blog/magicpath-ai-review)

* **Themes / reusable styles** can carry through different generations on the same canvas—lean on that to keep a design consistent. [Banani](https://www.banani.co/blog/magicpath-ai-review)

* **Clickable user flows** and **shareable previews** are commonly highlighted by users; plan your prompts to name screens and link interactions explicitly. [Medium](https://medium.com/%40birdzhanhasan_26235/magicpath-ai-183688ec4c9d)

* **Code export** (e.g., React/HTML/CSS) is available in paid tiers—write prompts that encourage semantic, dev‑ready structures (clear layer names, sane div nesting). [Banani+1](https://www.banani.co/blog/magicpath-ai-review)

* **Component recall**: some users mention recalling previously created components by name (e.g., with an `@component_name` syntax) to maintain consistency. If you rely on this, name your parts clearly at creation time. [Medium](https://medium.com/%40birdzhanhasan_26235/magicpath-ai-183688ec4c9d)

---

## **6\) Mini‑Library of “Prompt Lego Bricks”**

Use these lines inside any prompt:

* **Grid**

  * “12‑col grid, 24px gutters, max‑width 1200px; collapse to 8‑col @1024, 4‑col @768; cards span 3/6/12 cols at these breakpoints.”

* **Motion**

  * “All UI transitions 160–200ms ease‑out; respects `prefers-reduced-motion` (reduce translate/scale).”

* **Tables**

  * “Sticky headers; column resize; sort with visual indicator; empty state \+ zero‑match state.”

* **Forms**

  * “Inline validation on blur; error text below field; disabled CTA until valid; success toasts with undo.”

* **A11y**

  * “Min contrast 4.5:1, focus rings 2px outside border; tab order logical; 44px minimum hit‑targets.”

---

## **7\) Quick “Bad → Best” Upgrade Checklist**

1. List **all** components you expect.

2. Define the **layout system** (grid, gutters, breakpoints).

3. Seed **realistic data** and formatting rules.

4. Specify **states** and **interactions** (hover, sort, filter, modals).

5. Add **constraints/avoidances** (negative equivalents).

6. Lock in **theme tokens** and demand they **persist**.

7. Name frames/components for re‑use and flow wiring.

---

### **What I could (and couldn’t) verify publicly**

* Public articles and reviews emphasize MagicPath’s **infinite canvas**, **multi‑screen flows**, **themes that carry across generations**, **shareable previews**, and **code export**; they do **not** document a dedicated negative‑prompt input, so the constraints‑block method above is the pragmatic approach.

