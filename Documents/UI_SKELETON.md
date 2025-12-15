# See You Next Session - UI Skeleton Document

> **For:** Kiki (Art Director) & Scott (Programmer)  
> **Purpose:** Visual layout reference for all game screens and components

---

## 📐 Screen Overview

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

## 1️⃣ Main Menu

**File:** `MainMenu.jsx` | **Style:** `main-menu.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Background Image/Pattern]                   │
│                                                                 │
│                                                                 │
│                   ╔═══════════════════════╗                     │
│                   ║                       ║                     │
│                   ║   SEE YOU NEXT        ║  ◀─ Header Font     │
│                   ║      SESSION          ║     (Session Header)│
│                   ║                       ║                     │
│                   ║   "A diagnostic       ║  ◀─ Subtitle        │
│                   ║    narrative game"    ║     (Typewriter)    │
│                   ║                       ║                     │
│                   ╚═══════════════════════╝                     │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │     ▶ NEW GAME        │  ◀─ Primary Button  │
│                   └───────────────────────┘     (Accent Color)  │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │      CONTINUE         │  ◀─ Secondary       │
│                   └───────────────────────┘                     │
│                                                                 │
│                   ┌───────────────────────┐                     │
│                   │      SETTINGS         │  ◀─ Tertiary        │
│                   └───────────────────────┘                     │
│                                                                 │
│                                                      v0.1.0     │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Background: Subtle office/therapy room ambience (blurred or illustrated)
- Title should feel professional but approachable
- Buttons have hover states with slight lift effect

---

## 2️⃣ Patient Select

**File:** `PatientSelect.jsx` | **Style:** `patient-select.css`

```
┌─────────────────────────────────────────────────────────────────┐
│ ◀ Back                    SELECT PATIENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ┌─────┐             │  │ ┌─────┐             │              │
│  │ │     │  ALEX       │  │ │ ??? │  PATIENT 2  │              │
│  │ │ 👤  │  Age: 28    │  │ │     │  🔒 LOCKED  │              │
│  │ │     │  ────────── │  │ │     │             │              │
│  │ └─────┘  Tutorial   │  │ └─────┘  Complete   │              │
│  │          ⭐ Easy     │  │          Alex first │              │
│  │                     │  │                     │              │
│  │  [✓ COMPLETED]      │  │                     │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐              │
│  │ ┌─────┐             │  │ ┌─────┐             │              │
│  │ │ ??? │  PATIENT 3  │  │ │ ??? │  PATIENT 4  │              │
│  │ │     │  🔒 LOCKED  │  │ │     │  🔒 LOCKED  │              │
│  │ └─────┘             │  │ └─────┘             │              │
│  └─────────────────────┘  └─────────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Card States:**
- **Unlocked:** Full portrait, name visible, difficulty badge
- **Locked:** Silhouette/question mark, unlock condition shown
- **Completed:** Green checkmark overlay, can replay

**Difficulty Badges:**
- ⭐ Easy (Green)
- ⭐⭐ Medium (Yellow)  
- ⭐⭐⭐ Hard (Red)

---

## 3️⃣ Game Screen (Main Gameplay)

**File:** `GameScreen.jsx` | **Style:** `game-screen.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME SCREEN                             │
├───────────────────┬─────────────────────────┬───────────────────┤
│                   │                         │                   │
│   PATIENT VIEW    │    DIALOGUE PANEL       │   WORKSTATION     │
│   (Left Panel)    │    (Center Panel)       │   (Right Panel)   │
│                   │                         │                   │
│   ┌───────────┐   │   ┌─────────────────┐   │  ┌─────────────┐  │
│   │           │   │   │ 😟 Patient      │   │  │Turn  2 / 4  │  │
│   │           │   │   ├─────────────────┤   │  └─────────────┘  │
│   │   👤      │   │   │                 │   │                   │
│   │ Patient   │   │   │ "I just can't   │   │  ┌─────────────┐  │
│   │ Sprite    │   │   │ stop [worrying  │   │  │▓▓▓▓▓▓░░░░░░ │  │
│   │           │   │   │ about           │   │  │  FOCUS: 60  │  │
│   │  [Hotspot]│   │   │ everything]..." │   │  │             │  │
│   │           │   │   │                 │   │  │[Enter Focus]│  │
│   │           │   │   │      1 / 3  ▶   │   │  └─────────────┘  │
│   └───────────┘   │   └─────────────────┘   │                   │
│                   │                         │  ┌─────────────┐  │
│                   │   ┌─────────────────┐   │  │📋 Clipboard │  │
│                   │   │  Next Topic →   │   │  │─────────────│  │
│                   │   └─────────────────┘   │  │💬 Statements│  │
│                   │                         │  │ • "worrying │  │
│                   │                         │  │   about..." │  │
│                   │                         │  │👁️ Observa.  │  │
│                   │                         │  │ • Bitten    │  │
│                   │                         │  │   nails     │  │
│                   │                         │  └─────────────┘  │
│                   │                         │                   │
│                   │                         │  ┌─────────────┐  │
│                   │                         │  │⚗️ SYNTHESIS │  │
│                   │                         │  │ ┌───┐ + ┌───┐│  │
│                   │                         │  │ │   │   │   ││  │
│                   │                         │  │ └───┘   └───┘│  │
│                   │                         │  │  [Analyze]   │  │
│                   │                         │  └─────────────┘  │
│                   │                         │                   │
│                   │                         │  [📖 Handbook]    │
└───────────────────┴─────────────────────────┴───────────────────┘
```

---

## 3A. Patient View Component

**File:** `PatientView.jsx` | **Style:** `patient-view.css`

```
┌─────────────────────────────────────────┐
│                                         │
│            PATIENT VIEW                 │
│                                         │
│    ┌─────────────────────────────┐      │
│    │                             │      │
│    │    ┌───────────────────┐    │      │
│    │    │                   │    │      │
│    │    │    BASE SPRITE    │    │      │
│    │    │                   │    │      │
│    │    │   ┌─────┐         │    │      │
│    │    │   │ 👁️  │ ◀────────────────── Hotspot (Focus Mode)
│    │    │   │     │  Bags   │    │      │   Glows when hoverable
│    │    │   └─────┘  under  │    │      │
│    │    │          eyes    │    │      │
│    │    │                   │    │      │
│    │    │         ┌─────┐   │    │      │
│    │    │         │ 🔍  │ ◀─────────── Revealed symptom
│    │    │         │Hands│   │    │      │   Draggable to clipboard
│    │    │         └─────┘   │    │      │
│    │    │                   │    │      │
│    │    └───────────────────┘    │      │
│    │                             │      │
│    │    SYMPTOM OVERLAYS         │      │
│    │    (Stacked on base)        │      │
│    │                             │      │
│    └─────────────────────────────┘      │
│                                         │
└─────────────────────────────────────────┘

FOCUS MODE ACTIVE:
┌─────────────────────────────────────────┐
│ ╔═════════════════════════════════════╗ │
│ ║                                     ║ │
│ ║  [Vignette darkens edges]           ║ │
│ ║                                     ║ │
│ ║      ┌─ ─ ─ ─ ─ ─ ─ ─ ─┐           ║ │
│ ║      ╎   ★ HOTSPOT ★   ╎ ◀─ Pulsing║ │
│ ║      ╎    (clickable)  ╎   glow    ║ │
│ ║      └─ ─ ─ ─ ─ ─ ─ ─ ─┘           ║ │
│ ║                                     ║ │
│ ╚═════════════════════════════════════╝ │
└─────────────────────────────────────────┘
```

**Hotspot Behavior:**
- **Normal Mode:** Hidden
- **Focus Mode:** Subtle glow, cursor changes to magnifying glass
- **On Hover:** Brighter glow, shows focus cost
- **On Click:** Spends focus, reveals symptom overlay

---

## 3B. Dialogue Box Component

**File:** `DialogueBox.jsx` | **Style:** `dialogue-box.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                        DIALOGUE BOX                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  😟  Patient                                    [ANXIOUS] │  │
│  │  ─────────────────────────────────────────────────────────│  │
│  │                                                           │  │
│  │  "I just can't stop [worrying about everything].         │  │
│  │   Work, my family, even little things like whether       │  │
│  │   I locked the door."                                    │  │
│  │                                                   |       │  │ ◀─ Typing cursor
│  │                                                           │  │
│  │  ─────────────────────────────────────────────────────────│  │
│  │  1 / 3                              Click to continue ▶  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

KEYWORD STATES:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [worrying about everything]  ◀─── AVAILABLE (purple bg)       │
│         ┌─┐                         Shows "+" badge             │
│         │+│                         Click to collect            │
│         └─┘                                                     │
│                                                                 │
│   [worrying about everything]  ◀─── COLLECTED (teal bg)         │
│         ✓                           Draggable                   │
│                                     Cursor: grab                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

MOOD INDICATOR (Hover Tooltip):
┌──────────────────────────┐
│ 😟                       │
│ ┌──────────────────────┐ │
│ │ "Looks worried"      │ │  ◀─ Normal mode
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ "Displays anxious    │ │  ◀─ Focus mode (clinical)
│ │  behavior: rapid     │ │
│ │  speech, tension"    │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

---

## 3C. Focus Meter Component

**File:** `FocusMeter.jsx` | **Style:** `focus-meter.css`

```
┌─────────────────────────────────────────┐
│              FOCUS METER                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🧠 FOCUS                         │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░│  │  │
│  │  └─────────────────────────────┘  │  │
│  │           60 / 100                │  │
│  │                                   │  │
│  │  ┌───────────────────────────┐    │  │
│  │  │   👁️ ENTER FOCUS MODE     │    │  │  ◀─ Toggle button
│  │  └───────────────────────────┘    │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘

METER COLORS:
  100-60%  ▓▓▓▓▓▓▓▓▓▓  Teal (#4ecdc4)
   59-30%  ▓▓▓▓▓▓▓▓▓▓  Yellow (#ffe66d)
   29-0%   ▓▓▓▓▓▓▓▓▓▓  Red (#e94560)

FOCUS MODE ACTIVE:
┌───────────────────────────────────┐
│  🧠 FOCUS MODE ACTIVE             │
│  ┌─────────────────────────────┐  │
│  │▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│  │  ◀─ Slowly draining
│  └─────────────────────────────┘  │
│           45 / 100                │
│                                   │
│  ┌───────────────────────────┐    │
│  │   ✕ EXIT FOCUS MODE       │    │  ◀─ Red when active
│  └───────────────────────────┘    │
└───────────────────────────────────┘
```

---

## 3D. Clipboard Component

**File:** `Clipboard.jsx` | **Style:** `clipboard.css`

```
COMPACT VIEW:
┌─────────────────────────────────────────┐
│  📋 Clipboard                     [⛶]  │  ◀─ Expand button
├─────────────────────────────────────────┤
│  💬 STATEMENTS                          │
│  ┌─────────────────────────────────┐    │
│  │ 📝 "worrying about everything"  │×   │  ◀─ Draggable token
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 📝 "sleeping fine, really"      │×   │
│  └─────────────────────────────────┘    │
│                                         │
│  👁️ OBSERVATIONS                        │
│  ┌─────────────────────────────────┐    │
│  │ 🔍 Bitten nails                 │×   │  ◀─ Draggable token
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 🔍 Bags under eyes              │×   │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │
│  Drag tokens to Synthesis Zone!         │
└─────────────────────────────────────────┘

EXPANDED VIEW (Modal):
┌─────────────────────────────────────────────────────────────────┐
│                         📋 Clipboard                        [×] │
├─────────────────────────────────┬───────────────────────────────┤
│  💬 STATEMENTS (3)              │  👁️ OBSERVATIONS (2)          │
│  ───────────────────────────    │  ───────────────────────────  │
│                                 │                               │
│  ┌─────────────────────────┐    │  ┌─────────────────────────┐  │
│  │ 📝 "worrying about      │    │  │ 🔍 Bitten nails         │  │
│  │    everything"          │ ×  │  │                         │ ×│
│  └─────────────────────────┘    │  └─────────────────────────┘  │
│                                 │                               │
│  ┌─────────────────────────┐    │  ┌─────────────────────────┐  │
│  │ 📝 "sleeping fine,      │    │  │ 🔍 Bags under eyes      │  │
│  │    really"              │ ×  │  │                         │ ×│
│  └─────────────────────────┘    │  └─────────────────────────┘  │
│                                 │                               │
│  ┌─────────────────────────┐    │                               │
│  │ 📝 "hard to concentrate │    │                               │
│  │    at work"             │ ×  │                               │
│  └─────────────────────────┘    │                               │
│                                 │                               │
└─────────────────────────────────┴───────────────────────────────┘
```

**Token Colors:**
- **Text Token:** Purple left border (`#6c5ce7`)
- **Visual Token:** Teal left border (`#00b894`)

---

## 3E. Synthesis Zone Component

**File:** `SynthesisZone.jsx` | **Style:** `synthesis-zone.css`

```
┌─────────────────────────────────────────┐
│  ⚗️ Synthesis Zone                      │
│  Drag a statement + observation         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐       ┌─────────┐          │
│  │         │       │         │          │
│  │  Drop   │   +   │  Drop   │          │
│  │  Here   │       │  Here   │          │
│  │         │       │         │          │
│  └─────────┘       └─────────┘          │
│   (dashed)          (dashed)            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       🔬 ANALYZE                │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

WITH TOKENS:
┌─────────────────────────────────────────┐
│  ⚗️ Synthesis Zone                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐   ┌─────────────┐      │
│  │📝 "sleeping │   │🔍 Bags under│      │
│  │ fine..."    │×  │   eyes      │×     │
│  └─────────────┘   └─────────────┘      │
│   (purple)    +     (teal)              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       🔬 ANALYZE                │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

RESULT - SUCCESS:
┌─────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗  │
│  ║  💡 BREAKTHROUGH!                 ║  │
│  ║  You found a contradiction!       ║  │
│  ╚═══════════════════════════════════╝  │
│        (teal border, glowing)           │
└─────────────────────────────────────────┘

RESULT - FAILURE:
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │
│  │  These don't seem to contradict   │  │
│  │  each other...                    │  │
│  └───────────────────────────────────┘  │
│        (red border)                     │
└─────────────────────────────────────────┘
```

---

## 3F. Breakthrough Modal

**Triggered on successful synthesis**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   [DARK OVERLAY 85%]                            │
│                                                                 │
│          ╔═══════════════════════════════════════════╗          │
│          ║                                           ║          │
│          ║        💡 BREAKTHROUGH!                   ║          │
│          ║        ═══════════════                    ║          │
│          ║                                           ║          │
│          ║   😌 Alex                                 ║          │
│          ║   ─────────────────────────────────────   ║          │
│          ║                                           ║          │
│          ║   "*sighs* Okay, you're right.           ║          │
│          ║    I haven't slept properly in weeks.    ║          │
│          ║    I lie awake for hours, my mind        ║          │
│          ║    just won't stop."                     ║          │
│          ║                                           ║          │
│          ║   ┌─────────────────────────────────┐    ║          │
│          ║   │          CONTINUE               │    ║          │
│          ║   └─────────────────────────────────┘    ║          │
│          ║                                           ║          │
│          ╚═══════════════════════════════════════════╝          │
│                   (teal glowing border)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3G. Handbook Modal

**File:** `Handbook.jsx` | **Style:** `handbook.css`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   [DARK OVERLAY 80%]                            │
│                                                                 │
│    ╔═══════════════════════════════════════════════════════╗    │
│    ║  📖 DIAGNOSTIC HANDBOOK                           [×] ║    │
│    ╠══════════════════╦════════════════════════════════════╣    │
│    ║                  ║                                    ║    │
│    ║  DISORDERS       ║   GENERALIZED ANXIETY              ║    │
│    ║  ────────────    ║   DISORDER (GAD)                   ║    │
│    ║                  ║   ════════════════════════         ║    │
│    ║  ▶ Generalized   ║                                    ║    │
│    ║    Anxiety       ║   Characterized by persistent,     ║    │
│    ║                  ║   excessive worry about various    ║    │
│    ║    Bipolar I     ║   aspects of life.                 ║    │
│    ║                  ║                                    ║    │
│    ║    Factitious    ║   KEY SYMPTOMS:                    ║    │
│    ║    Disorder      ║   • Excessive worry               ║    │
│    ║                  ║   • Sleep disturbance             ║    │
│    ║    Depression    ║   • Difficulty concentrating      ║    │
│    ║                  ║   • Muscle tension                ║    │
│    ║                  ║   • Irritability                  ║    │
│    ║                  ║                                    ║    │
│    ║                  ║   DURATION: 6+ months              ║    │
│    ║                  ║                                    ║    │
│    ╚══════════════════╩════════════════════════════════════╝    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ Session Report

**File:** `SessionReport.jsx` | **Style:** `session-report.css`

```
PHASE 1 - DIAGNOSIS SELECTION:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    SESSION COMPLETE                             │
│                    Alex - Session 1                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   SELECT YOUR DIAGNOSIS                                         │
│   Based on your observations, what is your diagnosis?           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  GENERALIZED ANXIETY DISORDER                           │   │
│   │  Excessive worry, sleep issues, difficulty focusing     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  MAJOR DEPRESSIVE DISORDER                              │   │
│   │  Persistent sadness, loss of interest, fatigue          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  SOCIAL ANXIETY DISORDER                                │   │
│   │  Fear of social situations, avoidance behavior          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │            SUBMIT DIAGNOSIS                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

PHASE 2 - RESULTS:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    SESSION RESULTS                              │
│                                                                 │
│   ╔═══════════════════════════════════════════════════════╗     │
│   ║              ⭐⭐⭐ EXCELLENT! ⭐⭐⭐                   ║     │
│   ║                                                       ║     │
│   ║   Correct Diagnosis:                                  ║     │
│   ║   GENERALIZED ANXIETY DISORDER                        ║     │
│   ╚═══════════════════════════════════════════════════════╝     │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  PERFORMANCE BREAKDOWN                                │     │
│   ├───────────────────────────────────────────────────────┤     │
│   │                                                       │     │
│   │  Breakthroughs Found:     1 / 1      ████████░░  80% │     │
│   │  Symptoms Observed:       3 / 4      ██████░░░░  75% │     │
│   │  Focus Efficiency:        Good       ██████████  95% │     │
│   │                                                       │     │
│   │  ─────────────────────────────────────────────────── │     │
│   │  TOTAL SCORE:                              83%       │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                 │
│   ┌─────────────────┐  ┌─────────────────┐                      │
│   │   MAIN MENU     │  │   NEXT PATIENT  │                      │
│   └─────────────────┘  └─────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Reference

```
┌──────────────────────────────────────────────────────────────┐
│                      COLOR PALETTE                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  BACKGROUNDS                                                 │
│  ██████  Primary:    #1a1a2e  (Deep navy)                   │
│  ██████  Secondary:  #16213e  (Dark blue)                   │
│  ██████  Tertiary:   #0f3460  (Medium blue)                 │
│                                                              │
│  ACCENT COLORS                                               │
│  ██████  Accent:     #e94560  (Coral red)                   │
│  ██████  Success:    #4ecdc4  (Teal)                        │
│  ██████  Warning:    #ffe66d  (Yellow)                      │
│                                                              │
│  TOKEN COLORS                                                │
│  ██████  Text:       #6c5ce7  (Purple)                      │
│  ██████  Visual:     #00b894  (Green)                       │
│                                                              │
│  TEXT                                                        │
│  ██████  Primary:    #eaeaea  (Off-white)                   │
│  ██████  Muted:      #a0a0a0  (Gray)                        │
│  ██████  Dark:       #333333  (Charcoal)                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📝 Typography

```
┌──────────────────────────────────────────────────────────────┐
│                      FONT USAGE                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SESSION HEADER (header.ttf)                                 │
│  ─────────────────────────────                               │
│  Use for:                                                    │
│  • Game title                                                │
│  • Section headers                                           │
│  • Modal titles                                              │
│  • Important UI labels                                       │
│                                                              │
│  JMH TYPEWRITER (body fonts)                                 │
│  ─────────────────────────────                               │
│  Regular (400):  Body text, dialogue                         │
│  Bold (700):     Emphasis, labels                            │
│  Thin (300):     Subtle text, hints                          │
│  Black (900):    Strong emphasis (sparingly)                 │
│                                                              │
│  Use typewriter for:                                         │
│  • All patient dialogue (feels like notes)                   │
│  • UI buttons and labels                                     │
│  • Clipboard tokens                                          │
│  • Session report text                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Screens
- [x] Main Menu
- [x] Patient Select
- [x] Game Screen
- [x] Session Report

### Components
- [x] Patient View
- [x] Dialogue Box
- [x] Focus Meter
- [x] Clipboard (with expand)
- [x] Synthesis Zone
- [x] Turn Clock
- [x] Handbook
- [x] Breakthrough Modal

### Interactions
- [x] Keyword click to collect
- [x] Token drag & drop
- [x] Synthesis zone drops
- [x] Focus mode toggle
- [x] Hotspot detection
- [x] Mood tooltips

### Polish Needed
- [ ] Loading states
- [ ] Error states
- [ ] Transition animations
- [ ] Sound integration
- [ ] Mobile responsive (future)
