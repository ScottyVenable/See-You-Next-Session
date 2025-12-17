# Game Screen Layout Optimization TODO

> **Document Type:** Planning & Art Specifications  
> **Created:** December 17, 2025  
> **For:** Scott (Developer) & Kiki (Art Director)  
> **Purpose:** Finalize game screen layout, establish pixel dimensions, and define the patient view "active area" for art production  
> **Status:** Active

---

## Goal

Establish final, locked-in dimensions for the game screen layout so Kiki can begin producing patient art assets. The Patient View area must remain **consistent and unchanging** regardless of other UI changes (menus, drawers, etc.) to prevent art rework.

---

## Current State Analysis

### Existing Layout (3-Column Grid)
```
┌─────────────────┬──────────────────────┬─────────────────┐
│  PATIENT VIEW   │   DIALOGUE PANEL     │   WORKSTATION   │
│  (~30% width)   │   (~40% width)       │   (~30% width)  │
│   minmax        │     minmax           │    minmax       │
│  (280px, 1fr)   │   (400px, 1.5fr)     │  (300px, 340px) │
└─────────────────┴──────────────────────┴─────────────────┘
```

### Current CSS Grid Definition
```css
grid-template-columns: minmax(280px, 1fr) minmax(400px, 1.5fr) minmax(300px, 340px);
```

### Target Resolution
- **Base Target:** 1920x1080 (16:9)
- **Minimum Supported:** 1280x720

---

## Task List

### Phase 1: Lock Patient View Dimensions

- [ ] **1.1** Decide on fixed vs responsive patient panel width
  - Option A: Fixed pixel width (e.g., 400px)
  - Option B: Fixed percentage (e.g., 28% of viewport)
  - **Recommendation:** Fixed pixel width for art consistency
  
- [ ] **1.2** Calculate patient sprite "active area" dimensions
  - Full panel width minus padding
  - Full panel height minus header and status bars
  - Document exact pixel values for Kiki
  
- [ ] **1.3** Define aspect ratio for patient sprite container
  - Portrait orientation (taller than wide)
  - Recommended: 3:4 or 2:3 aspect ratio
  - Must fit comfortably in panel at all supported resolutions

- [ ] **1.4** Create visual mockup with pixel measurements
  - Show exact dimensions for art production
  - Include safe zones and hotspot areas

### Phase 2: UI Component Adjustments

- [ ] **2.1** Move Synthesis Zone inside Clipboard expanded view
  - Currently separate component
  - Should be a tab/section within clipboard drawer
  
- [ ] **2.2** Implement drawer system for right panel
  - Workstation tools as collapsible drawers
  - Expand to fill panel space (not modal overlays)
  - Drawers: Turn Clock, Focus Meter, Rapport, Clipboard, Handbook

- [ ] **2.3** Ensure patient panel remains static during drawer operations
  - Other panels may resize
  - Patient View dimensions must NOT change
  - Add CSS constraints to enforce this

### Phase 3: Responsive Design Plan

- [ ] **3.1** Define breakpoints
  - Desktop: 1920x1080 (primary)
  - Laptop: 1366x768
  - Minimum: 1280x720
  
- [ ] **3.2** Patient View behavior at each breakpoint
  - Should scale proportionally or stay fixed?
  - Art should be created at largest size, scaled down
  
- [ ] **3.3** Document scaling strategy for art assets
  - Create at 2x resolution for crisp rendering
  - CSS scaling for smaller screens

### Phase 4: Polish and Aesthetic

- [ ] **4.1** Reduce "flash game" aesthetic
  - Review border-radius values
  - Soften gradients
  - Improve shadow depth
  
- [ ] **4.2** Main Menu button spacing fix

- [ ] **4.3** Patient Select email inbox redesign

---

## Pixel Specifications for Art (DRAFT)

> **NOTE:** These values are DRAFTS pending final layout decisions. Do not begin art production until marked FINAL.

### At 1920x1080 Resolution

| Component | Width | Height | Notes |
|-----------|-------|--------|-------|
| **Full Screen** | 1920px | 1080px | Base resolution |
| **Patient Panel** | ~360px | ~1040px | After padding |
| **Sprite Container** | ~320px | ~600px | Main art area |
| **Active Art Area** | TBD | TBD | Safe zone for character |
| **Hotspot Zones** | ~80px | ~80px | Clickable symptom areas |

### Sprite Requirements (When Finalized)

| Asset | Dimensions | Format | Notes |
|-------|------------|--------|-------|
| Base Sprite | TBD | PNG | Transparent background |
| Emotion Overlays | TBD | PNG | Layer on base |
| Symptom Overlays | TBD | PNG | Hotspot indicators |

---

## Implementation Notes

### Locking Patient View

To ensure the Patient View stays consistent even when other UI changes:

```css
/* Proposed: Fixed patient panel width */
.patient-panel {
    width: 360px;          /* Fixed width */
    min-width: 360px;      /* Prevent shrinking */
    max-width: 360px;      /* Prevent growing */
    flex-shrink: 0;        /* Don't shrink in flex */
}

/* Alternative: Fixed aspect ratio container */
.patient-sprite-container {
    aspect-ratio: 3 / 4;   /* Or 2 / 3 */
    width: 100%;
    max-width: 320px;
}
```

### Drawer System Concept

```
WORKSTATION PANEL (Collapsed):
┌───────────────────────────┐
│ 🕐 Turn 2/4        [+]    │  <- Collapsed header
├───────────────────────────┤
│ 🧠 Focus: 60/100   [+]    │
├───────────────────────────┤
│ 💚 Rapport: 45     [+]    │
├───────────────────────────┤
│ 📋 Clipboard (3)   [+]    │  <- Expand to show tokens
├───────────────────────────┤
│ 📖 Handbook        [+]    │
└───────────────────────────┘

WORKSTATION PANEL (Clipboard Expanded):
┌───────────────────────────┐
│ 🕐 Turn 2/4        [-]    │
│ 🧠 Focus: 60/100   [-]    │
│ 💚 Rapport: 45     [-]    │
├───────────────────────────┤
│ 📋 CLIPBOARD       [−]    │
│ ┌───────────────────────┐ │
│ │ Token 1               │ │
│ │ Token 2               │ │
│ │ Token 3               │ │
│ ├───────────────────────┤ │
│ │ ⚗️ SYNTHESIS ZONE     │ │  <- Inside clipboard!
│ │ [Drop tokens here]    │ │
│ └───────────────────────┘ │
├───────────────────────────┤
│ 📖 Handbook        [+]    │
└───────────────────────────┘
```

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Dec 17 | Created this document | Kiki needs pixel specs for art |
| TBD | Patient panel width | Pending layout testing |
| TBD | Sprite aspect ratio | Pending art style discussion |

---

## Next Steps

1. **Scott:** Run the game at 1920x1080 and measure actual rendered pixel dimensions of the patient area
2. **Scott:** Create test rectangle overlay showing exact art boundaries
3. **Scott & Kiki:** Review and agree on final dimensions
4. **Scott:** Update this document with FINAL specifications
5. **Kiki:** Begin art production once dimensions are marked FINAL

---

## Questions for Kiki

1. What aspect ratio works best for character sprites? (3:4, 2:3, 1:2?)
2. How much padding/breathing room is needed around the character?
3. Should hotspot areas have specific shapes/sizes for art overlays?
4. Do you prefer fixed pixel dimensions or percentage-based?

---

## Related Documents

- [UI Skeleton](../reference/UI_SKELETON.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Asset List](../reference/ASSET_LIST.md)
- [Main TODO](./TODO.md)
