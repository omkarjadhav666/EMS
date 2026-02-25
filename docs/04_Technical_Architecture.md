# 04_Technical_Architecture.md

## 1. Technology Stack Decisions

### 1.1 Frontend: Next.js 14+ (App Router)
*   **Why:** We need excellent SEO for the landing page (Server Side Rendering) and highly interactive dashboards (Client Components). The App Router provides the best of both worlds with specific layouts for Dashboard vs Landing.
*   **Language:** **TypeScript**. Strict mode enabled. No `any` types allowed. This prevents 90% of runtime bugs.
*   **Styling:** **Tailwind CSS**.
    *   *Why:* Speed of development. A design system is easily enforced via `tailwind.config.js` (colors, spacing).
    *   *Utility:* `clsx` and `tailwind-merge` for dynamic classes.

### 1.2 Backend & Database: Supabase
*   **Why:** We need a Backend-as-a-Service (BaaS) to move fast.
    *   **PostgreSQL:** The gold standard relation database. Robust, relational, scalable.
    *   **Auth:** Built-in JWT handling. No rolling our own security.
    *   **Realtime:** Websockets available out of the box (for future collaboration features).
*   **Interaction:** We will use the **Supabase JS Client** directly in Client Components for reads (with RLS) and **Server Actions** for mutations (Writes).

### 1.3 Tools & Libraries
*   **Forms:** `react-hook-form` + `zod`. (Validation is critical).
*   **UI Primitives:** `radix-ui` (Headless accessible components) or `shadcn/ui` (for Tabs, Dialogs, Popovers).
*   **Icons:** `lucide-react`.
*   **Date Handling:** `date-fns`.
*   **Charts:** `recharts` for the Budget Visualization.

---

## 2. Database Schema (Detailed)

### Table: `profiles`
*   `id` (uuid, PK) -> References `auth.users.id`
*   `email` (text)
*   `full_name` (text)
*   `avatar_url` (text)
*   `created_at` (timestamptz)

### Table: `events`
*   `id` (uuid, PK)
*   `user_id` (uuid, FK) -> References `profiles.id` (Indexed)
*   `title` (text)
*   `type` (enum: 'wedding', 'birthday', 'corporate', 'other')
*   `date` (timestamptz)
*   `location` (text)
*   `target_budget` (numeric, default 0)
*   `guest_count` (int, default 0)
*   `created_at` (timestamptz)

### Table: `tasks`
*   `id` (uuid, PK)
*   `event_id` (uuid, FK) -> References `events.id` (Indexed)
*   `title` (text)
*   `details` (text, nullable)
*   `status` (enum: 'pending', 'in-progress', 'done')
*   `priority` (enum: 'low', 'medium', 'high')
*   `due_date` (timestamptz, nullable)
*   `category` (text) -> ('logistics', 'payments', 'guests')

### Table: `budget_items`
*   `id` (uuid, PK)
*   `event_id` (uuid, FK) -> References `events.id` (Indexed)
*   `name` (text)
*   `category` (text)
*   `estimated_cost` (numeric, default 0)
*   `actual_cost` (numeric, default 0)
*   `paid_amount` (numeric, default 0)
*   `notes` (text)

### Table: `vendors` (Global Directory)
*   `id` (uuid, PK)
*   `name` (text)
*   `category` (text)
*   `description` (text)
*   `price_tier` (int) -> 1, 2, 3 ($ - $$$)
*   `contact_email` (text)
*   `image_url` (text)

### Table: `bookings`
*   `id` (uuid, PK)
*   `event_id` (uuid, FK)
*   `vendor_id` (uuid, FK)
*   `status` (enum: 'requested', 'approved', 'rejected')
*   `message` (text)

---

## 3. Data Architectures & Principles

### 3.1 Security Model (RLS)
Security is implemented at the **Database Layer**, not just the API layer.
*   **Policy:** `Users can only SELECT events where user_id == auth.uid()`.
*   **Policy:** `Users can on INSERT events where user_id == auth.uid()`.
*   This means even if a hacker manually hits our API with an ID `123`, if they don't own `123`, the database returns nothing.

### 3.2 Server Actions Pattern (Logic Flow)
Instead of `/api/create-event`, we use specific TypeScript functions.
```typescript
// actions/create-event.ts
'use server'

export async function createEvent(data: EventSchema) {
  // 1. Validate Input
  const parsed = schema.parse(data);
  
  // 2. Auth Check
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 3. Database Mutation
  const { data: event, error } = await supabase.from('events').insert({
    ...parsed,
    user_id: session.user.id
  });

  // 4. Logic: Generate Default Tasks
  if (event) {
    await generateDefaultTasks(event.id, event.type);
  }

  // 5. Revalidate Path
  revalidatePath('/dashboard');
}
```

### 3.3 Folder Structure
```
/app
  /(auth)         -> Login/Register layouts
  /(dashboard)    -> Authenticated layouts (Sidebar)
    /events
      /[id]
        page.tsx  -> Overview
        layout.tsx -> Event context providers
  /api            -> Webhooks only (Stripe/Supabase)
/components
  /ui             -> Reusable atoms (Buttons, Inputs)
  /features       -> Complex organisms (BudgetTable, TaskBoard)
/lib
  /actions        -> Server Actions
  /supabase       -> Database clients
  /utils          -> Helper functions
```
