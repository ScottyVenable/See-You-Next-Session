# See You Next Session - Game Design Document (GDD)

> **Document Type:** Core Design Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Authors:** Scott & Kiki  
> **Status:** Active Development (MVP Phase)

---

## 1. Executive Summary

**"See You Next Session"** is a narrative simulation and puzzle game where the player assumes the role of a mental health professional. The core gameplay loop revolves around managing mental energy ("Focus") to identify contradictions between a patient's spoken dialogue and their physical presentation.

**The Goal:** Accurately diagnose patients within a limited time frame (1-hour session simulated in 4 turns) by synthesizing observed clues and spoken statements.

**Target Audience:** Fans of *Papers, Please*, *Ace Attorney*, and narrative-driven simulation games.

**Platform:** Web (React + Vite), Desktop (Tauri)

---

## 2. Core Mechanics

### 2.1 The Token System (Drag-and-Drop Logic)

The game treats information as physical objects called **Tokens**.

| Token Type | Source | Creation Method |
|------------|--------|-----------------|
| **Text Tokens** | Patient dialogue | Click highlighted keywords in dialogue |
| **Visual Tokens** | Patient observation | Identify symptoms during Focus Mode |

**Interaction Logic:**

| Action | Result |
|--------|--------|
| Token + Handbook | Check if symptom aligns with specific disorder |
| Text + Visual (Synthesis) | Attempt to find a **Contradiction** |
| Correct Synthesis | **Breakthrough** - Patient opens up, new dialogue unlocks, Focus restored |
| Incorrect Synthesis | Tokens bounce apart, lose Focus |

### 2.2 Focus Resource System

The **Focus Meter** represents the therapist's mental stamina.

| Action | Focus Cost/Gain |
|--------|-----------------|
| Starting Focus | 100 Points (Max) |
| Enter Focus Mode | 0 Points (Free toggle) |
| "Look" Action (Identify Symptom) | -15 Points |
| Incorrect Synthesis Match | -10 Points |
| Successful Breakthrough | +40 Points |
| Correct Diagnosis | Refills to Max |

*Design Note: The math is weighted to encourage careful observation rather than spam-clicking. A player can afford ~6 "Looks" without a Breakthrough before running out of energy.*

### 2.3 Rapport System

The **Rapport Meter** measures the patient's comfort level with the therapist.

- Builds through empathetic dialogue choices
- Affects dialogue options available
- Influences breakthrough difficulty
- Can decrease with confrontational approaches

### 2.4 Turn-Based Session Structure

| Turn | Time Represented | Typical Progress |
|------|------------------|------------------|
| Turn 1 | 0:00 - 0:15 | Introduction, surface-level |
| Turn 2 | 0:15 - 0:30 | Building rapport, first clues |
| Turn 3 | 0:30 - 0:45 | Deeper exploration, breakthroughs |
| Turn 4 | 0:45 - 1:00 | Final synthesis, diagnosis |

---

## 3. Dialogue System (SDNS)

The game uses a custom **Session Dialogue and Narration System (SDNS)** for scripting patient conversations.

### Key Features
- Character-driven dialogue with mood indicators
- Conditional branching based on rapport, focus, and variables
- Keyword extraction for evidence collection
- Breakthrough triggers for dramatic moments
- Deep integration with game state

See [Technical Architecture](../technical/TECHNICAL_ARCHITECTURE.md) for implementation details.

---

## 4. Narrative Design & Sensitivity

### 4.1 Tone & Style Guide

| Do | Don't |
|----|-------|
| Professional yet human analysis | Judgmental language |
| Clinical, observational descriptions | Caricatures of mental illness |
| Empathetic internal monologue | Stigmatizing terminology |

**Example:**
- Bad: "He looks crazy."
- Good: "Patient exhibits rapid eye movement and pressured speech."

### 4.2 Content Warnings
- Game includes content warning at start
- Option to toggle off graphic descriptions
- Sensitive topics handled with clinical respect

### 4.3 End of Session Grading

| Rank | Criteria | Supervisor Note |
|------|----------|-----------------|
| **S** | Perfect Diagnosis + All Contradictions | "Excellent work. Your insight is invaluable." |
| **A** | Correct Diagnosis | "Solid assessment." |
| **C** | Incorrect but safe referral | "Review the symptoms for [Disorder] again." |
| **F** | Harmful/Negligent Diagnosis | "We need to discuss this file immediately." |

---

## 5. User Interface Layout

### 5.1 Game Screen Layout

```
┌─────────────────┬──────────────────────┬─────────────────┐
│                 │                      │                 │
│  PATIENT VIEW   │   DIALOGUE PANEL     │  WORKSTATION    │
│  (Left ~30%)    │   (Center ~40%)      │  (Right ~30%)   │
│                 │                      │                 │
│  - Sprite       │  - Dialogue box      │  - Turn clock   │
│  - Symptom      │  - Keywords          │  - Focus meter  │
│    hotspots     │  - Mood indicator    │  - Clipboard    │
│                 │  - Topic selector    │  - Synthesis    │
│                 │                      │  - Handbook     │
└─────────────────┴──────────────────────┴─────────────────┘
```

### 5.2 Focus Mode Visuals

| Element | Effect |
|---------|--------|
| Activation | Hold Right Mouse / Toggle button |
| Vignette | Screen edges darken |
| Desaturation | Background turns grayscale |
| Spotlight | Patient remains in color, illuminated |
| Cursor | Changes to magnifying glass |

---

## 6. Implemented Features

### Completed (as of Dec 2025)

**Dialogue System:**
- DialogueSelector with 3D layered buttons
- Topic categories (Family, Work, Relationships, Emotions, Self)
- Keyboard shortcuts (1-5 for topics, Escape to close)
- Focus cost display on dialogue options
- Keyword context menu (right-click)
- Keyword type classification (auto-detect)
- Keyword pop animations
- Keyword counter per segment
- Mood chip display with tooltips
- Clinical vs casual descriptions based on Focus Mode
- Typewriter effect with bracket handling
- Dialogue progress dots
- Draggable keywords
- Selected prompt indicator

**UI/UX:**
- Focus mode cursor (magnifying glass)
- Keyword font styles by type
- Dev console (~key toggle)
- Disclaimer popup with "Don't show again"

**Core Components:**
- Clipboard for token storage
- Handbook for disorder reference
- Synthesis zone for contradiction matching
- Turn clock
- Focus meter
- Rapport meter
- Patient view with hotspots

---

## 7. Game Flow

```
┌──────────┐    ┌────────────────┐    ┌──────────────┐
│Main Menu │───▶│ Patient Select │───▶│ Game Screen  │
└──────────┘    └────────────────┘    └──────┬───────┘
     ▲                                        │
     │          ┌────────────────┐            │
     └──────────│ Session Report │◀───────────┘
                └────────────────┘
```

---

## 8. Related Documents

- [Technical Architecture](../technical/TECHNICAL_ARCHITECTURE.md)
- [UI Components Reference](../technical/UI_COMPONENTS.md)
- [Asset List](../reference/ASSET_LIST.md)
- [Patient Roster](../content/PATIENT_ROSTER.md)
- [TODO & Roadmap](../planning/TODO.md)
