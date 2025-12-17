# Gregory Vigil - Character Sheet

> **Document Type:** Character Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Status:** Primary development focus

---

## Basic Information

| Attribute | Value |
|-----------|-------|
| **Full Name** | Gregory Vigil |
| **Age** | 27 |
| **Height** | 6'1" |
| **Disorder** | Generalized Anxiety Disorder (GAD) |
| **Difficulty** | ⭐ Easy (Tutorial Patient) |
| **Role** | Introduction to core mechanics |

### Name Significance
- **Gregory:** Means "watchful, alert"
- **Vigil:** Means "watchful, awake"
- Combined: Reflects his constant state of hypervigilance

---

## Personality Profile

### Presentation Style
Gregory comes across as guarded and careful when revealing information. He seems unsure of even his own experiences, constantly qualifying and second-guessing his statements.

### Communication Pattern
Over-explains everything, worried he hasn't been clear enough or might say something "wrong."

**Example Dialogue:**
> "I've been having trouble sleeping. Well maybe not compared to some people. I don't think I need sleep aids or anything. Unless of course you think I do!"

### Core Fears
- Being judged negatively
- Making mistakes
- Being a burden
- Not being "good enough"
- Standing out (ironically, his appearance makes him stand out)

---

## Visual Design

### Color Psychology

| Element | Color | Psychology |
|---------|-------|------------|
| Hair | Orange/Red | Signals danger/caution; makes him stand out and feel out of place |
| Clothing | Black | Signals power, sophistication, confidence, authority - a cover for what he wants others to believe |

### Physical Features

| Feature | Description | Psychological Significance |
|---------|-------------|---------------------------|
| Tall height (6'1") | Stands noticeably taller | Feels eyes are always on him; out of place no matter what |
| Triangle patterns | Sharp geometric clothing designs | Represents sharp gaze and caution signs |
| Freckles | Visible on face | Imperfections beneath an otherwise managed appearance |
| Tidy hair | Meticulously maintained | Trying to appear pleasing and valuable |
| Tidy clothes | Clean, pressed, organized | Always feels watched, tries to appease observers |

### Observable Symptoms (Focus Mode)

| Symptom | Body Part | Observable Condition | What It Reveals |
|---------|-----------|---------------------|-----------------|
| Bitten nails | Hands | Fingernails chewed short | Anxious habit contradicting "perfect" appearance |
| Bags under eyes | Face | Dark circles | Sleep difficulties (may be revealed when pushed) |
| Erratic eye movement | Eyes | Frequent scanning | Anxiety about surroundings |
| Fidgeting fingers | Hands | Constant small movements | Anxious energy despite calm exterior |
| Bouncing leg | Legs | Rhythmic bouncing | Internal restlessness |
| Shaky hands | Hands | Visible tremor | Discomfort from being observed |
| Chewed lip | Face | Redness/slight scab | Nervous habit |

---

## Email Introduction

*This email appears in the Patient Select screen, styled as an intake form.*

---

**New Intake Form**

**Gregory Vigil** - 27 years old

---

I hope this message finds you well. My name is Gregory Vigil, and I am writing to inquire about the possibility of becoming a client under your care, should you currently be accepting new patients.

I want to be respectful of your time, so I will try to be as clear and thorough as possible regarding my reason for reaching out. Over the past several months, I have noticed a number of ongoing difficulties that, while not immediately disruptive in isolation, have begun to accumulate in ways that feel increasingly unsustainable for me. I believe it may be appropriate, and responsible, to speak with a professional rather than continue attempting to address these concerns independently.

Thank you very much for your time and consideration. I understand that this is a detailed message, but I felt it was important to be as precise as possible. I look forward to hearing from you at your convenience.

Sincerely,
Gregory Vigil

---

### Email Design Notes
- Very formal, no errors (checked a hundred times)
- Over-explains (worried about getting everything in)
- Does NOT say "I have anxiety" (diagnosis should come from gameplay)
- Focuses on issues anxiety causes (sleep, social, etc.)
- May have used AI assistance to "get it right" (in-character)

---

## Session Structure

### Turn 1: Introduction
- Surface-level conversation
- Gregory presents his "perfect" self
- Initial keywords about sleep, worry
- Player learns dialogue mechanics

### Turn 2: Building Trust
- Rapport determines openness
- More specific concerns emerge
- Visual symptoms more noticeable
- First contradiction opportunity

### Turn 3: Going Deeper
- Higher rapport unlocks vulnerable dialogue
- Core fears begin to surface
- Multiple breakthrough opportunities
- Complex symptom patterns visible

### Turn 4: Resolution
- Final synthesis opportunity
- Diagnosis submission
- Patient response to diagnosis
- Session conclusion

---

## Key Contradictions

### Primary Contradiction
| Statement | Visual Evidence | Result |
|-----------|-----------------|--------|
| "I'm sleeping fine, really." | Bags under eyes / Fatigue | Admits to insomnia |

### Secondary Contradictions
| Statement | Visual Evidence | Result |
|-----------|-----------------|--------|
| "I'm calm, this doesn't bother me." | Shaky hands / Bouncing leg | Acknowledges anxiety |
| "I take care of myself." | Bitten nails / Chewed lip | Reveals nervous habits |
| "I don't worry about what others think." | Over-formal speech / Eye scanning | Opens up about social anxiety |

---

## Breakthrough Conditions

For Gregory, breakthroughs occur when:
1. Correct text + visual token synthesis
2. Rapport above threshold (varies by breakthrough)
3. Appropriate turn number reached

### Example Breakthrough
```
Condition: rapport >= 50 AND synthesis("sleeping fine", "bags under eyes")
Result: Gregory reveals he hasn't slept well in months
New Dialogue: Unlocks deeper conversation about nighttime anxiety
Focus Restored: +40
```

---

## Related Files

- Session dialogue: `src/patients/gregory/`
- Sprite assets: `src/assets/patients/gregory/` (planned)
- Symptoms data: `src/data/symptoms.js`

---

## Related Documents

- [Patient Roster](../PATIENT_ROSTER.md)
- [Game Design Document](../../design/GAME_DESIGN_DOCUMENT.md)
