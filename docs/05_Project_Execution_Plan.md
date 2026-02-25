# 05_Project_Execution_Plan.md

## 1. Project Management Methodology
We will follow a **Hybrid Agile** approach.
*   **Iterative:** We build in 1-week Sprints.
*   **Structured:** We have a strict "Definition of Done" (DoD) for each module.

### Definition of Done (DoD)
A feature is NOT done until:
1.  Code is written and compiles without lint errors.
2.  Works in the browser (Chrome & Mobile View).
3.  Database updates are successful.
4.  UI has Empty States (e.g., "No tasks yet") and Loading States.

---

## 2. Phase-by-Phase Execution Plan

### Sprint 1: The Foundation (Days 1-3)
*   **Goal:** User can Login and see a Dashboard.
*   **Tasks:**
    *   Initialize Next.js + Tailwind.
    *   Setup Supabase Project (Tables + RLS Policies).
    *   Build Authentication Pages (Sign Up / Sign In).
    *   Build App Shell (Sidebar, Header, Responsive Layout).

### Sprint 2: The Core "Event Engine" (Days 4-7)
*   **Goal:** User can Create an Event and see it.
*   **Tasks:**
    *   Build "Create Event" Wizard (Stepper UI).
    *   Implement "Template Logic" (If Wedding -> Insert 40 tasks).
    *   Build "Event Overview" Dashboard (The Home Screen).

### Sprint 3: Planning Tools (Days 8-12)
*   **Goal:** User can actually "Plan".
*   **Tasks:**
    *   **Task Module:** CRUD Tasks, Checkbox interactions, Progress Bar calculation.
    *   **Budget Module:** Budget Table, "Remaining" logic, Visual Charts.

### Sprint 4: Marketplace & Polish (Days 13-15)
*   **Goal:** User can interact with the outside world.
*   **Tasks:**
    *   Build Vendors Directory (Static Data for MVP).
    *   Implement "Request Quote" modal.
    *   **The Difference Maker:** UI Polish. Add animations (Framer Motion). Fix spacing. Ensure fonts are perfect.

---

## 3. Quality Assurance (QA) Plan

### 3.1 Testing Levels
1.  **Component Testing:** "Does this Button render?" (Visual check).
2.  **Flow Testing:** "Can I create an event from start to finish without crashing?"
3.  **Edge Case Testing:**
    *   What if Budget is $0?
    *   What if Event Date is in the past?
    *   What if I have 500 tasks?

### 3.2 Bug Classification
*   **P0 (Critical):** App crashes, Data Loss, Login fails. -> *Fix Immediately.*
*   **P1 (High):** Feature broken (e.g., Cannot add task). -> *Fix before next task.*
*   **P2 (Medium):** UI glitch, Typo, Ugly spacing. -> *Fix in "Polish" phase.*

---

## 4. Deployment Strategy

### 4.1 Environment Setup
*   **Development (Local):** `localhost:3000`. Connects to Supabase `Development` project.
*   **Production (Vercel):** `eventflow.vercel.app`. Connects to Supabase `Production` project.

### 4.2 CI/CD Checklist
Before pushing to Production:
1.  Run `npm run build` locally to check for Type Errors.
2.  Run `npm run lint` to check for code style issues.
3.  Verify all Environment Variables are set in Vercel.

---

## 5. Risk Assessment (Pre-Mortem)

| Risk | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Complexity Overload:** We try to build too much. | High | High | Strict adherence to MVP. If it's not in the FRD, we don't build it yet. |
| **Database Security:** User A sees User B's data. | Low | Critical | Test RLS policies manually. Create two test accounts and try to hack each other. |
| **Burnout:** Getting stuck on "perfect" UI. | Medium | Medium | Time-box UI tasks. "Good enough" is better than perfect for V1. |
