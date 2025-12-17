# UI Components Reference

> **Document Type:** Technical Reference  
> **Created:** December 15, 2025  
> **Last Updated:** December 17, 2025  
> **Author:** Scott (Developer)

---

## Overview

This document catalogs all UI components in the game, their files, and implementation status.

---

## Component Architecture

```
src/components/
├── game/           # Gameplay-specific components
├── screens/        # Full-screen views
└── ui/             # Reusable UI elements
```

---

## Screen Components

### MainMenu.jsx
**File:** `src/components/screens/MainMenu.jsx`  
**Style:** `src/styles/main-menu.css`  
**Status:** Implemented

| Element | Description |
|---------|-------------|
| Title | "See You Next Session" with header font |
| Subtitle | "A diagnostic narrative game" |
| New Game | Primary button, starts game |
| Continue | Secondary button, loads save |
| Settings | Tertiary button, opens settings |
| Version | Bottom-right version number |

---

### PatientSelect.jsx
**File:** `src/components/screens/PatientSelect.jsx`  
**Style:** `src/styles/patient-select.css`  
**Status:** Implemented (redesign planned)

| Element | Description |
|---------|-------------|
| Patient Cards | Grid of selectable patients |
| Locked State | Silhouette + unlock condition |
| Unlocked State | Portrait + name + difficulty |
| Completed State | Checkmark overlay |

**Planned Redesign:** Email inbox style with patient intro emails

---

### GameScreen.jsx
**File:** `src/components/screens/GameScreen.jsx`  
**Style:** `src/styles/game-screen.css`  
**Status:** Implemented

**Layout:**
```
┌─────────────────┬──────────────────────┬─────────────────┐
│  PatientView    │  DialogueBox         │  Workstation    │
│  (~30%)         │  (~40%)              │  (~30%)         │
│                 │                      │                 │
│                 │  DialogueSelector    │  TurnClock      │
│                 │                      │  FocusMeter     │
│                 │                      │  Clipboard      │
│                 │                      │  SynthesisZone  │
│                 │                      │  Handbook       │
└─────────────────┴──────────────────────┴─────────────────┘
```

---

### SessionReport.jsx
**File:** `src/components/screens/SessionReport.jsx`  
**Style:** `src/styles/session-report.css`  
**Status:** Planned

| Element | Description |
|---------|-------------|
| Report Card | Session summary |
| Diagnosis Slot | Final diagnosis submission |
| Grade Display | S/A/C/F ranking |
| Supervisor Note | Feedback text |
| Continue Button | Return to patient select |

---

## Game Components

### DialogueBox.jsx
**File:** `src/components/game/DialogueBox.jsx`  
**Style:** `src/styles/dialogue-box.css`  
**Status:** Implemented

**Features:**
- Typewriter text effect
- Keyword highlighting (clickable)
- Mood indicator chip
- Progress dots
- Speaker name display
- Keyword counter

---

### DialogueSelector.jsx
**File:** `src/components/game/DialogueSelector.jsx`  
**Status:** Implemented

**Features:**
- 3D layered button design
- Topic categories (Family, Work, Relationships, Emotions, Self)
- Sub-option expansion
- Focus cost badges
- Keyboard shortcuts (1-5, Escape)
- Spring animations

---

### PatientView.jsx
**File:** `src/components/game/PatientView.jsx`  
**Style:** `src/styles/patient-view.css`  
**Status:** Implemented

**Features:**
- Patient sprite display
- Symptom hotspots (Focus Mode)
- Hotspot highlighting
- Focus Mode visual effects
- Draggable visual tokens

---

### Clipboard.jsx
**File:** `src/components/game/Clipboard.jsx`  
**Style:** `src/styles/clipboard.css`  
**Status:** Implemented

**Features:**
- Token storage grid
- Text token section
- Visual token section
- Expandable view
- Drag-drop targets

---

### SynthesisZone.jsx
**File:** `src/components/game/SynthesisZone.jsx`  
**Style:** `src/styles/synthesis-zone.css`  
**Status:** Implemented (moving to Clipboard planned)

**Features:**
- Two token slots (Text + Visual)
- Analyze button
- Result display
- Animation feedback

---

### FocusMeter.jsx
**File:** `src/components/game/FocusMeter.jsx`  
**Style:** `src/styles/focus-meter.css`  
**Status:** Implemented

**Features:**
- Vertical bar display
- Fill animation
- Focus Mode toggle
- Numeric display

---

### RapportMeter.jsx
**File:** `src/components/game/RapportMeter.jsx`  
**Status:** Implemented

**Features:**
- Relationship indicator
- Fill animation
- Tooltip with description

---

### TurnClock.jsx
**File:** `src/components/game/TurnClock.jsx`  
**Style:** `src/styles/turn-clock.css`  
**Status:** Implemented

**Features:**
- Turn number display (1-4)
- Session time indication
- Visual progress

---

### Handbook.jsx
**File:** `src/components/game/Handbook.jsx`  
**Style:** `src/styles/handbook.css`  
**Status:** Implemented

**Features:**
- Disorder listings
- Symptom descriptions
- Drag-drop target for tokens
- Search/filter

---

## UI Components

### DevConsole.jsx
**File:** `src/components/ui/DevConsole.jsx`  
**Style:** `src/styles/dev-console.css`  
**Status:** Implemented

**Features:**
- Toggle with ~ key
- Command input
- Output display
- Game state inspection
- Cheat commands

---

### MenuButton.jsx
**File:** `src/components/ui/MenuButton.jsx`  
**Status:** Implemented

**Variants:**
- Primary (accent color)
- Secondary
- Tertiary

---

### ErrorBoundary.jsx / ErrorOverlay.jsx
**File:** `src/components/ui/ErrorBoundary.jsx`  
**Status:** Implemented

**Features:**
- Catches React errors
- Displays friendly error message
- Recovery options

---

## Planned Components

| Component | Purpose | Priority |
|-----------|---------|----------|
| EmailInbox | Patient select redesign | High |
| SkillTree | Progression system | Low |
| SettingsPanel | Game settings | Medium |
| TutorialOverlay | First-time guidance | Medium |

---

## Style Guide

### Fonts
- **Headers:** Session Header font
- **Body:** Body font family
- **Dialogue:** 0.95rem size

### Colors
See `src/styles/main.css` for CSS variables

### Animations
Using Motion (Framer Motion) for:
- Spring animations (keyword pop)
- Typewriter effects
- Panel transitions
- Button hover states

---

## Related Documents

- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [UI Skeleton Wireframes](./UI_SKELETON.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
