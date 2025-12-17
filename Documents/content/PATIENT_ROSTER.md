# Patient Roster

> **Document Type:** Content Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Status:** MVP Planning

---

## Overview

This document outlines all planned patients for "See You Next Session", including their disorders, difficulty levels, and key gameplay elements.

---

## Patient 1: Gregory Vigil (Tutorial)

| Attribute | Value |
|-----------|-------|
| **Name** | Gregory Vigil |
| **Age** | 27 |
| **Height** | 6'1" |
| **Difficulty** | Easy |
| **Disorder** | Generalized Anxiety Disorder (GAD) |
| **Status** | In Development |

### Personality
Guarded and careful when revealing things. Appears unsure of his own experiences. Over-explains and second-guesses himself constantly.

**Example:** *"I've been having trouble sleeping. Well maybe not compared to some people. I don't think I need sleep aids or anything. Unless of course you think I do!"*

### Visual Symptoms (Focus Mode Clues)

| Symptom | Location | Psychology |
|---------|----------|------------|
| Orange/red hair | Head | Signals danger/caution; stands out |
| Black clothing | Body | Power, sophistication facade |
| Triangle patterns | Clothing | Sharp gaze, caution signs |
| Freckles | Face | Imperfections beneath managed appearance |
| Bitten nails | Hands | Anxious habit contradicting perfect appearance |
| Tidy hair/clothes | Overall | Meticulously maintained to appease perceived observers |
| Bags under eyes | Face | Sleep difficulties |
| Erratic eye movement | Eyes | Anxiety about surroundings |
| Fidgeting fingers | Hands | Anxious energy despite calm exterior |
| Shaky hands | Hands | Discomfort from being observed |

### Key Dialogue Themes
- Sleep difficulties
- Constant worry about others' perceptions
- Desire to appear "normal" or "valuable"
- Difficulty relaxing
- Over-preparation and checking behaviors

### Contradiction Puzzle
- **Statement:** "I'm sleeping fine, really."
- **Visual:** Bags under eyes / Fatigue
- **Result:** Gregory admits to insomnia

### Files
- [Gregory Character Sheet](./patients/gregory.md)
- Session files: `src/patients/gregory/`

---

## Patient 2: [TBD] (Challenge)

| Attribute | Value |
|-----------|-------|
| **Name** | TBD |
| **Age** | TBD |
| **Difficulty** | Medium |
| **Disorder** | Bipolar I Disorder |
| **Status** | Planned |

### Presentation
Variable mood state. May start manic and shift to depressed (or vice versa) across turns.

### Key Dialogue (Manic Phase)
- "I don't need sleep, I have so many ideas!"
- "I just bought a boat. It's going to be great."

### Key Dialogue (Depressed Phase)
- "What's the point?"
- "I'm just so tired."

### Visual Symptoms (Manic)
| Symptom | Location |
|---------|----------|
| Dilated pupils | Eyes |
| Flashy clothes/jewelry | Body |
| Rapid movement | Animation |

### Visual Symptoms (Depressed)
| Symptom | Location |
|---------|----------|
| Slumped posture | Body |
| Flat expression | Face |
| Messy hair | Head |

### Contradiction Puzzle
- **Statement:** "I'm just naturally high energy, I've always been like this."
- **Visual:** Slumped posture (later turn) / History of depressive episodes
- **Result:** Patient acknowledges cycle of highs and lows

### Unlock Condition
Complete Gregory's session with C rank or higher

---

## Patient 3: [TBD] (Boss - Stretch Goal)

| Attribute | Value |
|-----------|-------|
| **Name** | TBD |
| **Difficulty** | ⭐⭐⭐ Hard |
| **Disorder** | Factitious Disorder |
| **Status** | 💭 Concept |

### Presentation
Overly dramatic about symptoms but physically healthy. Tests the player's ability to spot deception.

### Key Dialogue
- "I fell down the stairs, my leg is shattered."
- "I think the infection is spreading."

### Visual Symptoms (Hidden Health)
| Symptom | Location | Meaning |
|---------|----------|---------|
| Rosy cheeks | Face | Indicates health |
| Perfect teeth/hair | Head | Self-care intact |
| No visible wounds | Body | Claims contradicted |

### Contradiction Puzzle
- **Statement:** "My leg is broken, I can't walk."
- **Visual:** Normal walking to chair / No injury signs
- **Result:** Patient becomes defensive or changes story

---

## Future Patients (Post-MVP)

| Name | Disorder | Difficulty | Notes |
|------|----------|------------|-------|
| TBD | PTSD | Medium | Combat veteran or trauma survivor |
| TBD | OCD | Medium | Intrusive thoughts focus |
| TBD | Depression | Easy | More straightforward presentation |
| TBD | ADHD | Medium | May require different session format |
| TBD | Personality Disorder | Hard | Complex, requires multiple sessions |

---

## Design Principles

1. **Accuracy:** Symptoms based on DSM-5 criteria
2. **Respect:** No caricatures or stereotypes
3. **Puzzles:** Each patient has meaningful contradictions to discover
4. **Progression:** Difficulty increases with patient unlock order
5. **Variety:** Different disorders require different approaches

---

## Related Documents

- [Gregory Character Sheet](./patients/gregory.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Disorders Reference](../../src/data/disorders.js)
