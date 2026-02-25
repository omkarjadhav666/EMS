# 03_Design_and_UX_Strategy.md

## 1. Design Philosophy
**"Clarity over Creativity."**
While the UI should be beautiful, it must never be overwhelming. We use a **"Calm Tech"** approach.
*   **Whitespace:** Generous padding to reduce cognitive load.
*   **Visual Hierarchy:** The massive "$5,000 Left" number matters more than the "Edit" button.
*   **Feedback:** Every action (Click, Save, Error) has instant visual feedback.

---

## 2. Information Architecture (Sitemap)

### Level 1: Public
*   **Landing Page (`/`)**: Hero Section -> Value Props -> Feature Showcase -> Pricing (Fake) -> Footer.
    *   *Goal:* Get user to click "Start Planning Free".
*   **Auth Pages**:
    *   `/login`: Minimalist form.
    *   `/register`: Multi-step expectation setting.

### Level 2: Protected Application (`/dashboard`)
*   **Main Dashboard (`/dashboard`)**: The "Command Center".
    *   *Top:* "Welcome back, [Name]".
    *   *Center:* Active Events Cards (with Progress Bars).
    *   *Right:* System Notifications / Quick Actions.
    *   *Goal:* Get user into their specific event context.

### Level 3: The Event Context (`/dashboard/events/[id]`)
This uses a **Sidebar Navigation** layout.
*   **Overview (`/`)**: High-level stats, countdown timer, next 3 tasks.
*   **Tasks (`/tasks`)**: Kanban or List view of the checklist.
*   **Budget (`/budget`)**: Spreadsheet-like interface with charts.
*   **Timeline (`/timeline`)**: Vertical Gantt chart of milestones.
*   **Vendors (`/vendors`)**: Search and Book interface.
*   **Settings (`/settings`)**: Delete event, change date, invite collaborators.

---

## 3. Design System (The "EventFlow" Look)

### 3.1 Vibe & Philosophy
**"Ethereal Elegance."**
The interface should feel like a high-end wedding magazine or a luxury hotel lobby.
*   **Keywords:** Calm, Sophisticated, Breathable, Tactile.
*   **Motion:** Slow, fluid transitions (0.5s - 0.8s). No snappy/jerky movements.
*   **Texture:** Subtle grain or paper textures in backgrounds (optional but recommended for "richness").

### 3.2 Color Palette (Luxury Neutrals)
Instead of "Tech Purple", we use a palette inspired by sandstone, silk, and nature.
*   **Canvas (Backgrounds):**
    *   `Alabaster`: `#FDFBF7` (Warmer than pure white, easier on the eyes).
    *   `Soft Sand`: `#F3F0E6` (Secondary backgrounds, sidebars).
*   **Typography (The Ink):**
    *   `Charcoal`: `#2D2A26` (Primary Text - softer than black).
    *   `Taupe`: `#6B665E` (Secondary Text).
*   **Accents (The Jewelry):**
    *   `Gold Leaf`: `#D4AF37` (Primary Buttons, Highlights, Active States).
    *   `Sage Green`: `#849687` (Success states, "On Track").
    *   `Terra Cotta`: `#C08081` (Alerts, "Over Budget" - gentle but clear).

### 3.3 Typography
Typography is the main UI element in this aesthetic.
*   **Header Font (Serif):** `Playfair Display` or `Cormorant Garamond`.
    *   Used for: Headings, Big Numbers, Greeting messages.
    *   Style: High contrast, elegant italics for emphasis.
*   **Body Font (Sans-Serif):** `Lato` or `Mulish`.
    *   Used for: UI controls, dense tables, inputs.
    *   Style: Clean, geometric but humanist.
*   **Pairing Rule:** Large Serif headings + Spacious Sans-serif body.

### 3.4 Component Library Updates

#### Buttons
*   **Primary:** Solid `Gold Leaf` (or dark `Charcoal` for contrast), `rounded-sm` (slightly sharp, not fully pill-shaped). Text is uppercase wide-tracking.
*   **Secondary:** Thin 1px border `Charcoal`, transparent fill.
*   **Hover Effects:** Subtle fade, no harsh color jumps.

#### Cards (The "Paper" Look)
*   **Style:** `Alabaster` background, **no border**, heavy soft shadow `shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]`.
*   **Concept:** Elements should look like high-quality stationery cards floating on a desk.

#### Animations (The "Flow")
*   **Page Loads:** Elements fade in and slide up slowly (`y: 10, duration: 0.6`).
*   **Interactions:** Hovering a card lifts it effectively "weightlessly".

---

## 4. Key UX Flows Explained

### Flow A: The "Ah-ha" Moment (Event Creation)
1.  User clicks "New Event".
2.  Screen dims, focused modal appears.
3.  **Step 1:** "What are we celebrating?" -> Grid of large, beautiful cards (Wedding ring icon, Balloon icon, Briefcase icon).
4.  User clicks "Wedding".
5.  **Step 2:** "When is the big day?" -> Date picker.
6.  **Step 3:** "Magic happening..." (Fake loader).
7.  **Result:** User lands on dashboard, and *already sees* "Book Venue" (Due in 2 weeks) and "Draft Guest List" (Due tomorrow).
8.  *Win:* They didn't have to type those tasks. We did it for them.

### Flow B: The Budget Reality Check
1.  User enters Budget: $10,000.
2.  User adds "Venue Cost": $6,000.
3.  System updates "Remaining": $4,000.
4.  User adds "Catering": $5,000.
5.  **Reaction:**
    *   "Remaining" Text turns **Red**.
    *   A small tooltip appears: *"You are $1,000 over budget. Consider reducing Catering guest count?"*
6.  *Win:* Passive coaching. We don't just show numbers; we show implications.
