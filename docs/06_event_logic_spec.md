# Event Logic & "Smart" Features Specification

## 1. Overview
This document translates the detailed user requirements for **Event Types** and **Services** into a structured data model. This model will power the "Smart" features of the EMS:
-   **Dynamic Checklist Generator:** Auto-creating tasks based on the specific Event Type.
-   **Budget Recommender:** Suggesting budget splits (e.g., Weddings spend more on Food/Decor, Corporate events spend more on Venue/AV).
-   **Vendor Matching:** Suggesting relevant service categories.

## 2. Event Taxonomy
The system will support the following hierarchy: **Category -> Subtype**.

### A. Wedding Events
| Subtype | Key Attributes | Recommended Services |
| :--- | :--- | :--- |
| **Banquet Hall** | Indoor, Formal, Stage-centric | Venue, Decor (Stage), Catering, Lighting |
| **Beach Wedding** | Outdoor, Scenic, Mandap | Venue (Resort), Decor (Floral), Logistics (Travel) |
| **Destination** | Travel-heavy, Multi-day | Logistics (Accom-flight), Venue, Planner, Catering |
| **Traditional** | Ritual-heavy, Cultural | Decor (Traditional), Priest, Music (Live/Shehnai) |
| **Court/Simple** | Low Budget, Legal-focused | Photography, Small Catering (Lunch) |
| **Theme** | Stylized (Royal, Pastel, etc.) | Decor (Custom), Costume/Styling, Lighting |

### B. Birthday Parties
| Subtype | Key Attributes | Recommended Services |
| :--- | :--- | :--- |
| **Kids** | Fun, Games, Day-time | Decor (Balloons), Entertainment (Magic), Cake |
| **Adult** | Evening, Social, Music | DJ, Catering (Cocktails), Venue (Lounge) |
| **Surprise** | Timing-critical, Intimate | Decor (Minimal), Cake, Gifts |
| **Theme** | Stylized (Retro, Neon) | Decor (Props), Costume, Music |

### C. Baby Shower
* **Types:** Traditional, Theme (Pink/Blue), Home-based.
* **Focus:** Decor, Catering (Light), Games.

### D. Corporate Events
* **Types:** Conference, Product Launch, Party, AGM, Team Building.
* **Focus:** AV/Tech, Venue (Professional), Catering (Buffet), Logistics.

### E. Cultural & Social
* **Types:** Festivals (Diwali, etc.), College Fests, Community Gatherings.
* **Focus:** Large Scale, Crowd Management, Sound Systems, Food Stalls.

### F. Engagements & Anniversaries
* **Types:** Ring Ceremony, Silver/Golden Jubilee.
* **Focus:** Photography, Venue, Dining.

### G. Live Concerts & Shows
* **Types:** Music Concert, DJ Night, Comedy, Dance.
* **Focus:** Sound & Light (Heavy), Ticketing, Security, Crowd Control.

---

## 3. Service Taxonomy & Mapping
These services will be linked to the events above.

1.  **Venue Planning**: Banquet, Lawn, Beach, Rooftop, Home.
2.  **Decoration**: Floral, Balloon, Traditional, Modern.
3.  **Catering**: Veg/Non-Veg, Jain, Buffet, Live Counters.
4.  **Photography**: Traditional, Candid, Cinematic, Drone.
5.  **Music/Ent**: DJ, Live Band, Anchor, Celebrity.
6.  **Costume/Styling**: Rental, Makeup (Future).
7.  **Lighting/Sound**: Stage, LED, PA Systems.
8.  **Guest Mgmt**: Invites, Seating, RSVP.
9.  **Transport**: Pickup/Drop, Logistics.
10. **Budgeting**: Packages (Low/Premium).

---

## 4. Implementation Strategy (The "Smart" Logic)

### A. Data Structure (`lib/constants/eventTemplates.ts`)
We will create a massive configuration object that defines defaults for each type.

```typescript
export const EVENT_TEMPLATES = {
  wedding: {
    label: "Wedding",
    subtypes: ["Banquet", "Beach", "Destination", "Traditional", "Court"],
    defaultTasks: [
      "Finalize Guest List",
      "Book Venue (6 months out)",
      "Book Photographer",
      "Finalize Menu",
      "Send Invitations"
    ],
    budgetDistribution: {
      venue: 0.40,
      catering: 0.30,
      decor: 0.15,
      other: 0.15
    }
  },
  corporate: {
    label: "Corporate",
    subtypes: ["Conference", "Party", "Launch"],
    defaultTasks: [
      "Confirm Agenda",
      "Book Venue with AV",
      "Arrange Catering (Coffee/Lunch)",
      "Print Badges/Materials"
    ],
    budgetDistribution: {
      venue: 0.50,
      catering: 0.20,
      technology: 0.20,
      marketing: 0.10
    }
  }
  // ... maps for all user categories
}
```

### B. Dynamic Checklist Logic
When a user finishes the "Event Creation Wizard":
1.  Check the `event_type` and `subtype` (need to add subtypes to wizard).
2.  Look up `EVENT_TEMPLATES`.
3.  Auto-insert rows into the `tasks` table for that event based on `defaultTasks`.

### C. Budget Logic
When a user sets a `budget_total` in the wizard:
1.  Use `budgetDistribution` percentages to suggest breakdown.
2.  (Optional) Create placeholder "Expenses" for them (e.g., "Estimated Venue Cost: $X").

---

## 5. Revised Roadmap for Phase 3
1.  **Update Database**: No schema changes needed for templates (static for now), maybe add `subtype` to `events` table.
2.  **Update Wizard**: Add "Subtype" selection step (e.g., if Wedding selected -> ask "Beach or Banquet?").
3.  **Build Logic**: Implement the auto-task creation hook (Supabase Edge Function or Client-side logic on Wizard complete).
