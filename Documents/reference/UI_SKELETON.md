# UI Skeleton - Wireframe Reference

> **Document Type:** Visual Design Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **For:** Kiki (Art Director) & Scott (Developer)  
> **Purpose:** Visual layout reference for all game screens and components

---

## Screen Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    GAME FLOW DIAGRAM                            │
│                                                                 │
│   ┌──────────┐    ┌────────────────┐    ┌──────────────┐       │
│   │Main Menu │───▶│ Patient Select │───▶│ Game Screen  │       │
│   └──────────┘    └────────────────┘    └──────┬───────┘       │
│        ▲                                        │               │
│        │          ┌────────────────┐            │               │
│        └──────────│ Session Report │◀───────────┘               │
│                   └────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Main Menu

**Files:** `MainMenu.jsx` | `main-menu.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Background Image/Pattern]                   │
│                                                                 │
│                                                                 │
│                   ╔═══════════════════════╗                     │
│                   ║   SEE YOU NEXT        ║  ◀─ Header Font     │
│                   ║      SESSION          ║                     │
│                   ║                       ║                     │
│                   ║   "A diagnostic       ║  ◀─ Subtitle        │
│                   ║    narrative game"    ║                     │
│                   ╚═══════════════════════╝                     │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │     ▶ NEW GAME        │  ◀─ Primary Button  │
│                   └───────────────────────┘                     │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │      CONTINUE         │  ◀─ Secondary       │
│                   └───────────────────────┘                     │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │      SETTINGS         │  ◀─ Tertiary        │
│                   └───────────────────────┘                     │
│                                                                 │
│                                                      v0.2.0     │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Background: Subtle office/therapy room ambience
- Title: Professional but approachable
- Buttons: Hover states with slight lift effect

---

## 2. Patient Select

**Files:** `PatientSelect.jsx` | `patient-select.css`

### Current Design (Card Grid)
```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Back                    SELECT PATIENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ┌─────┐             │  │ ┌─────┐             │              │
│  │ │ [?] │  GREGORY    │  │ │ ??? │  PATIENT 2  │              │
│  │ │     │  Age: 27    │  │ │     │  LOCKED     │              │
│  │ └─────┘  Easy        │  │ └─────┘             │              │
│  │                     │  │                     │              │
│  │  [PLAY SESSION]     │  │  Complete Gregory   │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Planned Redesign (Email Inbox Style)
```
┌─────────────────────────────────────────────────────────────────┐
│ INBOX                                    [Sort ▼] [Filter ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ● Gregory Vigil                           Dec 10, 2025  │   │
│  │   New Intake Form                                       │   │
│  │   I hope this message finds you well. My name is...     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ ??? [LOCKED]                                          │   │
│  │   Complete Gregory's session to unlock                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Card States:**
- **Unlocked:** Full portrait, name visible, difficulty badge
- **Locked:** Silhouette/question mark, unlock condition
- **Completed:** Green checkmark, can replay

---

## 3. Game Screen (Main Gameplay)

**Files:** `GameScreen.jsx` | `game-screen.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME SCREEN                             │
├───────────────────┬─────────────────────────┬───────────────────┤
│                   │                         │                   │
│   PATIENT VIEW    │    DIALOGUE PANEL       │   WORKSTATION     │
│   (~30%)          │    (~40%)               │   (~30%)          │
│                   │                         │                   │
│   ┌───────────┐   │   ┌─────────────────┐   │  ┌─────────────┐  │
│   │           │   │   │ [?] Patient      │   │  │Turn  2 / 4  │  │
│   │   [?]      │   │   ├─────────────────┤   │  └─────────────┘  │
│   │ Patient   │   │   │                 │   │                   │
│   │ Sprite    │   │   │ "I just can't   │   │  ┌─────────────┐  │
│   │           │   │   │ stop [worrying  │   │  │▓▓▓▓▓▓░░░░░░ │  │
│   │  [Hotspot]│   │   │ about           │   │  │  FOCUS: 60  │  │
│   │           │   │   │ everything]..." │   │  └─────────────┘  │
│   │           │   │   │      1 / 3  ▶   │   │                   │
│   └───────────┘   │   └─────────────────┘   │  ┌─────────────┐  │
│                   │                         │  │📋 Clipboard │  │
│                   │   ┌─────────────────┐   │  │ • Tokens... │  │
│                   │   │ [Topic Select]  │   │  └─────────────┘  │
│                   │   └─────────────────┘   │                   │
│                   │                         │  ┌─────────────┐  │
│                   │                         │  │⚗️ SYNTHESIS │  │
│                   │                         │  └─────────────┘  │
│                   │                         │                   │
│                   │                         │  [Handbook]       │
└───────────────────┴─────────────────────────┴───────────────────┘
```

---

## 3A. Patient View Component

**Files:** `PatientView.jsx` | `patient-view.css`

```
NORMAL MODE:
┌─────────────────────────────────────────┐
│            PATIENT VIEW                 │
│                                         │
│    ┌───────────────────────────────┐    │
│    │                               │    │
│    │         BASE SPRITE           │    │
│    │           [?]                 │    │
│    │                               │    │
│    │                               │    │
│    └───────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

FOCUS MODE ACTIVE:
┌─────────────────────────────────────────┐
│ ╔═════════════════════════════════════╗ │
│ ║  [Vignette darkens edges]           ║ │
│ ║                                     ║ │
│ ║      ┌─ ─ ─ ─ ─ ─ ─ ─ ─┐           ║ │
│ ║      ╎   ★ HOTSPOT ★   ╎ ◀─ Pulsing║ │
│ ║      ╎    (clickable)  ╎   glow    ║ │
│ ║      └─ ─ ─ ─ ─ ─ ─ ─ ─┘           ║ │
│ ║           [?]                        ║ │
│ ╚═════════════════════════════════════╝ │
└─────────────────────────────────────────┘
```

**Hotspot Behavior:**
- Normal Mode: Hidden
- Focus Mode: Subtle glow, cursor → magnifying glass
- On Hover: Brighter glow, shows focus cost
- On Click: Spends focus, reveals symptom overlay

---

## 3B. Dialogue Box Component

**Files:** `DialogueBox.jsx` | `dialogue-box.css`

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [?]  Patient                                    [ANXIOUS] │  │
│  │  ─────────────────────────────────────────────────────────│  │
│  │                                                           │  │
│  │  "I just can't stop [worrying about everything].         │  │
│  │   Work, my family, even little things like whether       │  │
│  │   I locked the door."                                    │  │
│  │                                                   |       │  │
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────────│  │
│  │  Keywords: 2/5                              1 / 3            ▶  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

KEYWORD STATES:
   [worrying about everything]  ◀─── AVAILABLE (purple bg, + badge)
   [worrying about everything]  ◀─── COLLECTED (teal bg, ✓, draggable)
```

---

## 3C. Focus Meter Component

**Files:** `FocusMeter.jsx` | `focus-meter.css`

```
┌───────────────────────────────────┐
│  FOCUS                               │
│  ┌─────────────────────────────┐  │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░│  │
│  └─────────────────────────────┘  │
│           60 / 100                │
│                                   │
│  ┌───────────────────────────┐    │
│  │   ENTER FOCUS MODE            │    │
│  └───────────────────────────┘    │
└───────────────────────────────────┘

METER COLORS:
  100-60%  ▓▓▓▓▓▓  Teal (#4ecdc4)
   59-30%  ▓▓▓▓▓▓  Yellow (#ffe66d)
   29-0%   ▓▓▓▓▓▓  Red (#e94560)
```

---

## 3D. Clipboard Component

**Files:** `Clipboard.jsx` | `clipboard.css`

```
COMPACT VIEW:
┌─────────────────────────────────────────┐
│  Clipboard                          [+]  │
├─────────────────────────────────────────┤
│  STATEMENTS                              │
│  ┌─────────────────────────────────┐    │
│  │ "worrying about everything"       │x   │
│  └─────────────────────────────────┘    │
│                                         │
│  OBSERVATIONS                            │
│  ┌─────────────────────────────────┐    │
│  │ Bitten nails                    │x   │
│  └─────────────────────────────────┘    │
│                                         │
│  Drag tokens to Synthesis Zone!         │
└─────────────────────────────────────────┘
```

**Token Colors:**
- Text Token: Purple left border (#6c5ce7)
- Visual Token: Teal left border (#00b894)

---

## 3E. Synthesis Zone Component

**Files:** `SynthesisZone.jsx` | `synthesis-zone.css`

```
EMPTY:
┌─────────────────────────────────────────┐
│  Synthesis Zone                         │
├─────────────────────────────────────────┤
│  ┌─────────┐       ┌─────────┐          │
│  │  Drop   │   +   │  Drop   │          │
│  │  Here   │       │  Here   │          │
│  └─────────┘       └─────────┘          │
│  ┌─────────────────────────────────┐    │
│  │       ANALYZE                     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

WITH TOKENS:
┌─────────────────────────────────────────┐
│  ┌─────────────┐   ┌─────────────┐      │
│  │ "sleeping    │   │ Bags under  │      │
│  │ fine..."     │   │   eyes      │      │
│  └─────────────┘   └─────────────┘      │
│  ┌─────────────────────────────────┐    │
│  │       ANALYZE                     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

SUCCESS:
╔═══════════════════════════════════╗
║  BREAKTHROUGH!                     ║
║  You found a contradiction!       ║
╚═══════════════════════════════════╝
```

---

## 4. Session Report

**Files:** `SessionReport.jsx` | `session-report.css`

```
PHASE 1 - DIAGNOSIS SELECTION:
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION COMPLETE                             │
│                    Gregory - Session 1                          │
├─────────────────────────────────────────────────────────────────┤
│   SELECT YOUR DIAGNOSIS                                         │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  GENERALIZED ANXIETY DISORDER                           │   │
│   │  Excessive worry, sleep issues, difficulty focusing     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  MAJOR DEPRESSIVE DISORDER                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │            SUBMIT DIAGNOSIS                             │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

PHASE 2 - RESULTS:
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION RESULTS                              │
│                                                                 │
│   ╔═══════════════════════════════════════════════════════╗     │
│   ║              *** EXCELLENT! ***                   ║     │
│   ║   Correct: GENERALIZED ANXIETY DISORDER               ║     │
│   ╚═══════════════════════════════════════════════════════╝     │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  PERFORMANCE BREAKDOWN                                │     │
│   │  Breakthroughs:    1 / 1      ████████░░  80%        │     │
│   │  Symptoms:         3 / 4      ██████░░░░  75%        │     │
│   │  Focus:            Good       ██████████  95%        │     │
│   │  ─────────────────────────────────────────────────── │     │
│   │  TOTAL:                                83%           │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
│   ┌─────────────────┐  ┌─────────────────┐                      │
│   │   MAIN MENU     │  │   NEXT PATIENT  │                      │
│   └─────────────────┘  └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Palette

| Category | Color | Hex | Usage |
|----------|-------|-----|-------|
| **Background** | Deep Navy | #1a1a2e | Primary background |
| | Dark Blue | #16213e | Secondary background |
| | Medium Blue | #0f3460 | Tertiary background |
| **Accent** | Coral Red | #e94560 | Primary accent |
| | Teal | #4ecdc4 | Success, tokens |
| | Yellow | #ffe66d | Warning |
| **Tokens** | Purple | #6c5ce7 | Text tokens |
| | Green | #00b894 | Visual tokens |
| **Text** | Off-White | #eaeaea | Primary text |
| | Gray | #a0a0a0 | Muted text |

---

## Typography

| Element | Font | Usage |
|---------|------|-------|
| **Headers** | Session Header | Game title, section headers, modal titles |
| **Body** | JMH Typewriter | All dialogue, UI text, buttons |

---

## Implementation Status

### Screens
- [x] Main Menu
- [x] Patient Select
- [x] Game Screen
- [ ] Session Report (partial)

### Components
- [x] Patient View
- [x] Dialogue Box
- [x] Focus Meter
- [x] Clipboard
- [x] Synthesis Zone
- [x] Turn Clock
- [x] Handbook
- [x] Dev Console

### Polish Needed
- [ ] Loading states
- [ ] Error states
- [ ] Transition animations
- [ ] Sound integration

---

## Related Documents

- [UI Components](../technical/UI_COMPONENTS.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Asset List](./ASSET_LIST.md)
