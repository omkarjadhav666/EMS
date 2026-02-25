# 02_Requirements_Specification.md

## 1. Introduction

### 1.1 Purpose
This document formally defines the functional and non-functional requirements for the **EventFlow** platform. It serves as the "contract" between the Product Team and the Engineering Team.

### 1.2 Scope
The MVP (Minimum Viable Product) will cover the entire lifecycle of an event:
1.  **Creation:** Wizard-based setup.
2.  **Planning:** Task management and Budgeting.
3.  **Execution:** Vendor discovery and booking integration.
4.  **Review:** Admin oversight.

---

## 2. Functional Requirements (FRD)

### Module 1: User Authentication & Onboarding
*   **FR_AUTH_01:** System must allow users to generic Sign Up/Login using Email/Password.
*   **FR_AUTH_02:** System should support Social Auth (Google) for friction-less entry.
*   **FR_AUTH_03:** Users must be assigned a role upon creation (`USER` by default). `ADMIN` roles are assigned manually via database.
*   **FR_AUTH_04:** Onboarding wizard must collect: User Name, Organization name (optional), and Primary Event Interest (Wedding/Corporate/Social).

### Module 2: Event Logic Engine
*   **FR_EVENT_01 (The Wizard):** Creating an event must be a multi-step process, NOT a single form.
    *   Step 1: Event Type (Visual Card Selection).
    *   Step 2: Title, Date, & Location.
    *   Step 3: Guest Count & Budget Estimator.
*   **FR_EVENT_02 (Smart Templates):** Upon event creation, the system must generate a *pre-populated* Checklist based on the Event Type.
    *   *Wedding* -> "Book Officiant", "Schedule Dress Fitting".
    *   *Corporate* -> "Book AV Equipment", "Send Calendar Invites".
*   **FR_EVENT_03 (Budget Logic):**
    *   System must allow users to define a "Total Budget Cap".
    *   System must allow creating "Line Items" (Category, Estimated Cost, Actual Cost, Paid Status).
    *   **Crucial:** System must calculate `Variance = Estimated - Actual` and display alerts if negative.

### Module 3: Task Management (The Checklist)
*   **FR_TASK_01:** Tasks must have statuses: `Pending`, `In Progress`, `Completed`.
*   **FR_TASK_02:** Tasks must have priorities: `High`, `Medium`, `Low`.
*   **FR_TASK_03:** Users can add custom tasks.
*   **FR_TASK_04:** Users can delete pre-generated tasks (Forgiving UI).

### Module 4: Service Marketplace & Booking
*   **FR_SERV_01:** Users can browse a directory of vendors categorized by service (Catering, Venue, Music).
*   **FR_SERV_02:** Each vendor card must show: Name, Price Range ($ - $$$$), Rating (Mock), and Tags.
*   **FR_SERV_03 (Booking Flow):**
    *   User clicks "Request Quote".
    *   System opens a modal to collect: Date, Time, Special Requests.
    *   System saves a `BookingRequest` record in the database with status `PENDING`.
    *   Admin dashboard sees this request (Simulating the Vendor side for MVP).

### Module 5: Admin Dashboard
*   **FR_ADMIN_01:** Admin can view high-level metrics: Total Users, Total Active Events, Total GMV (Budget managed).
*   **FR_ADMIN_02:** Admin can standard generic CRUD operations on "Master Services" list. (Add new vendor).

---

## 3. Non-Functional Requirements (NFR)

### Performance
*   **NFR_PERF_01:** Dashboard "Time to Interactive" must be under **1.5 seconds** on 4G networks.
*   **NFR_PERF_02:** Database queries must utilize indexing. No full table scans on `events` table.
*   **NFR_PERF_03:** Images for vendors must be optimized (WebP format) and lazy-loaded.

### Security
*   **NFR_SEC_01:** **Row Level Security (RLS)** is non-negotiable. An authenticated user can NEVER query another user's event data.
*   **NFR_SEC_02:** All API inputs must be validated using Zod schemas to prevent Injection attacks.
*   **NFR_SEC_03:** Payment data (if added) must never touch our server; use Stripe Elements (Architectural prep).

### Usability
*   **NFR_UX_01:** The UI must be fully responsive (Mobile, Tablet, Desktop). The "On the go" planner is a key use case.
*   **NFR_UX_02:** Accessibility: All form inputs must have labels. Colors must pass WCAG AA contrast ratio.

---

## 4. Data Requirements (Schema Entities)

### 4.1 Core Entities
1.  **User (Profile):** Extends Supabase Auth. Holds `avatar`, `preferences`.
2.  **Event:** The central node.
3.  **Task:** Belongs to Event.
4.  **BudgetItem:** Belongs to Event.
5.  **Vendor:** Public entity, readable by all.
6.  **Booking:** Join table between User, Event, and Vendor.

---

## 5. User Stories (Agile)

| ID | Persona | Story | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **US-01** | Annie (Bride) | I want to see a percentage breakdown of my budget | A Pie chart shows "Venue" takes up 40% of my budget. |
| **US-02** | Dave (Admin) | I want to export my vendor list to PDF | A button downloads a clean formatted PDF of all booked services. |
| **US-03** | New User | I want to sign up with one click | Google Auth button works and redirects to Dashboard immediately. |
| **US-04** | Planner | I want the system to warn me if I overspend | If `Actual Cost` > `Budget`, the variance turns RED and a toast warning appears. |
