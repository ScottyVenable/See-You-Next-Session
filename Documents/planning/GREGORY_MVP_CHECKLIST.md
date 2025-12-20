# Gregory MVP Development Checklist

> **Document Type:** Development Checklist  
> **Created:** December 20, 2025  
> **Focus:** MVP completion for Gregory (Tutorial Patient)  
> **Design Goal:** Modular patterns that scale to future patients

---

## Overview

Gregory Vigil is our tutorial patient, designed to teach players the core mechanics while providing a complete gameplay experience. This checklist ensures Gregory is fully functional and that the code is modular enough to easily add more patients.

**Disorder:** Generalized Anxiety Disorder (GAD)  
**Difficulty:** Easy (Tutorial)  
**Sessions:** 4 turns representing a 1-hour therapy session

---

## 1. Patient Data Structure

### Required Files

- [ ] `src/patients/gregory/patient_config.json` - Complete and validated
- [ ] `src/patients/gregory/gregory.keys` - All keywords defined
- [ ] `src/patients/gregory/dialogue/gregory_1.session` - Turn 1 complete
- [ ] `src/patients/gregory/dialogue/gregory_2.session` - Turn 2 complete
- [ ] `src/patients/gregory/dialogue/gregory_3.session` - Turn 3 complete
- [ ] `src/patients/gregory/dialogue/gregory_4.session` - Turn 4 complete

### Patient Config Checklist

```json
{
    "id": "gregory",
    "name": "Gregory Vigil",
    "age": 27,
    "disorder": "generalized_anxiety_disorder",
    "difficulty": "easy",
    "sessions": ["gregory_1", "gregory_2", "gregory_3", "gregory_4"],
    "visualSymptoms": [/* ... */],
    "email": {/* intake email content */}
}
```

- [ ] All required fields present
- [ ] `visualSymptoms` array has hotspot coordinates
- [ ] `email` object has subject, body, signature
- [ ] Disorder ID matches `src/data/disorders.js` entry

---

## 2. Keyword System

### Gregory's Keywords

Categories to implement:

- [ ] **Sleep** - `gregory.sleep.*` (trouble, claims_fine, cant_shut_off)
- [ ] **Duration** - `gregory.duration.*` (months_delay, weeks_of_symptoms)
- [ ] **Emotion** - `gregory.emotion.*` (difficulties, anxious, overwhelmed)
- [ ] **Minimizing** - `gregory.minimizing.*` (nothing_serious, not_trouble)
- [ ] **Perfectionism** - `gregory.perfectionism.*` (said_correctly, checking)
- [ ] **Coping** - `gregory.coping.*` (hoping_away, avoiding)
- [ ] **Pattern** - `gregory.pattern.*` (accumulating, escalating)
- [ ] **Uncertainty** - `gregory.uncertainty.*` (i_think, maybe)

### Keyword Implementation Checklist

- [ ] All keywords defined in `gregory.keys`
- [ ] Keywords have proper importance levels (low/medium/high/critical)
- [ ] Contradiction markers linked to visual symptoms
- [ ] CSS classes assigned for visual styling
- [ ] Animations assigned where appropriate

---

## 3. Visual Symptoms

### Observable Symptoms Checklist

| Symptom | Hotspot | Sprite State | Implemented |
|---------|---------|--------------|-------------|
| Bags under eyes | Face | Always visible | [ ] |
| Bitten nails | Hands | Close-up view | [ ] |
| Darting eyes | Face | Animation | [ ] |
| Leg bouncing | Legs | Animation | [ ] |
| Fidgeting fingers | Hands | Animation | [ ] |
| Trembling hands | Hands | Animation | [ ] |
| Chewed lip | Face | Close-up view | [ ] |

### Sprite Requirements

- [ ] Base sprite (neutral)
- [ ] Mood variations (guarded, nervous, hesitant, vulnerable, defensive)
- [ ] Symptom highlight states for Focus Mode
- [ ] Hotspot areas defined and clickable

---

## 4. Dialogue Completion

### Turn 1: Introduction (gregory_1.session)

- [ ] Opening narration establishes scene
- [ ] Initial dialogue introduces Gregory's character
- [ ] Sleep topic introduction
- [ ] First keywords appear naturally
- [ ] At least one conditional branch (rapport-based)
- [ ] Proper -> goto navigation
- [ ] All keywords use correct syntax

**Key Scenes:**
- [ ] Entrance and first impression
- [ ] "Why I'm here" explanation
- [ ] Sleep difficulty mention (with hedging)
- [ ] First symptom observations available

### Turn 2: Building Trust (gregory_2.session)

- [ ] Recap from Turn 1 (if applicable)
- [ ] Deeper exploration of concerns
- [ ] First contradiction opportunity
- [ ] Rapport gates for sensitive topics
- [ ] More visual symptoms observable

**Key Scenes:**
- [ ] Work/daily life discussion
- [ ] Social anxiety hints
- [ ] Perfectionism patterns
- [ ] "I'm fine" contradiction setup

### Turn 3: Going Deeper (gregory_3.session)

- [ ] High-rapport exclusive content
- [ ] Major breakthrough opportunities
- [ ] Core fears revealed
- [ ] Multiple synthesis opportunities
- [ ] Emotional vulnerability moments

**Key Scenes:**
- [ ] Childhood/background (optional unlock)
- [ ] Fear of judgment revelation
- [ ] Major contradiction confrontation
- [ ] Breakthrough if synthesized correctly

### Turn 4: Resolution (gregory_4.session)

- [ ] Summary of session
- [ ] Diagnosis opportunity
- [ ] Patient response to diagnosis
- [ ] Session conclusion
- [ ] Future appointment mention

**Key Scenes:**
- [ ] "What do you think is going on?"
- [ ] Player diagnosis input
- [ ] Gregory's reaction (varies by accuracy)
- [ ] Closing dialogue

---

## 5. Contradiction System

### Gregory's Contradictions

| Text Claim | Visual Evidence | Synthesis Result |
|------------|-----------------|------------------|
| "I sleep fine" | bags_under_eyes | Admits insomnia |
| "I'm calm" | trembling_hands | Acknowledges anxiety |
| "I take care of myself" | bitten_nails | Reveals nervous habits |
| "I don't worry about others" | darting_eyes | Opens up about social anxiety |

### Implementation Checklist

- [ ] Each contradiction has matching keyword + symptom
- [ ] Synthesis triggers breakthrough dialogue
- [ ] Breakthrough restores focus (+40)
- [ ] New dialogue unlocks after breakthrough
- [ ] Failed synthesis has appropriate feedback

---

## 6. Rapport Thresholds

### Gregory's Rapport Gates

| Rapport Level | Content Unlocked |
|---------------|------------------|
| 0-24 | Surface-level only, guarded responses |
| 25-49 | Some personal details, hedged honesty |
| 50-74 | Vulnerable moments, admits problems |
| 75-100 | Deep fears, childhood mentions, breakthroughs |

### Implementation Checklist

- [ ] All `@if rapport` conditions use correct thresholds
- [ ] Low-rapport alternatives exist for gated content
- [ ] Rapport gains/losses coded for dialogue choices
- [ ] Visual indicator shows rapport changes

---

## 7. Focus Mode Integration

### Focus Mode Features for Gregory

- [ ] All visual symptoms clickable in Focus Mode
- [ ] Symptoms have clinical descriptions
- [ ] Hotspots highlight correctly
- [ ] Focus costs deducted for "Look" action
- [ ] Symptoms add to visual token collection

---

## 8. Code Modularity

### Reusable Patterns

Ensure these patterns work for any patient:

- [ ] **PatientLoader** - Loads any patient by ID
- [ ] **DialogueLoader** - Loads any .session file
- [ ] **KeywordLoader** - Loads any .keys file
- [ ] **SymptomRenderer** - Renders symptoms from config
- [ ] **ConradictionMatcher** - Works with any keyword/symptom pair

### Adding New Patients Template

Document the process:

```markdown
## Adding a New Patient

1. Create folder: `src/patients/{patientId}/`
2. Create `patient_config.json` with required fields
3. Create `{patientId}.keys` with keywords
4. Create `dialogue/{patientId}_N.session` files
5. Add patient to `src/data/patients/index.js`
6. Add disorder (if new) to `src/data/disorders.js`
7. Create/reference sprites in `src/assets/patients/{patientId}/`
```

- [ ] Document patient addition process
- [ ] Validate PatientLoader handles missing patients gracefully
- [ ] Ensure error messages are helpful for content creators

---

## 9. UI Components for Gregory

### Required UI Elements

- [ ] Patient sprite in PatientView
- [ ] Email preview in PatientSelect
- [ ] Symptom hotspots overlay
- [ ] Mood chip displays correctly
- [ ] Speaker labels show "Gregory" or "Patient"
- [ ] All Gregory-specific keywords styled

---

## 10. Testing Checklist

### Manual Testing

- [ ] Complete Turn 1 without errors
- [ ] Complete Turn 2 without errors
- [ ] Complete Turn 3 without errors
- [ ] Complete Turn 4 without errors
- [ ] Test all dialogue branches (high/low rapport)
- [ ] Test all contradictions
- [ ] Test all breakthroughs
- [ ] Test focus depletion scenario
- [ ] Test diagnosis submission (correct and incorrect)

### Edge Cases

- [ ] Zero focus during session
- [ ] Maximum rapport achieved
- [ ] Minimum rapport maintained
- [ ] All keywords collected
- [ ] No keywords collected
- [ ] Skip all optional dialogue

---

## 11. Content Quality

### Writing Review

- [ ] Dialogue feels natural for character
- [ ] Hedging/uncertainty consistent with GAD
- [ ] No stigmatizing language
- [ ] Clinical observations are accurate
- [ ] Emotional moments feel earned

### Consistency Check

- [ ] Name always "Gregory" (not Greg, Gregory Vigil varies)
- [ ] Age references match (27)
- [ ] Timeline references consistent
- [ ] Symptom descriptions match visuals

---

## 12. Performance

- [ ] Session files load quickly
- [ ] No lag during dialogue transitions
- [ ] Focus Mode toggle is responsive
- [ ] Keyword interactions are smooth
- [ ] Save/load works for Gregory sessions

---

## Progress Tracking

| Section | Status | Notes |
|---------|--------|-------|
| Patient Data | In Progress | Config exists, needs validation |
| Keywords | In Progress | .keys file exists |
| Turn 1 Dialogue | Complete | Needs rename to gregory_1 |
| Turn 2 Dialogue | Not Started | |
| Turn 3 Dialogue | Not Started | |
| Turn 4 Dialogue | Not Started | |
| Visual Symptoms | Partial | Defined in config, sprites TBD |
| Contradictions | Partial | Defined, needs testing |
| Code Modularity | Good | Loader patterns established |
| Testing | Not Started | |

---

## Related Documents

- [Gregory Character Sheet](../content/patients/gregory.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
- [MVP Scope Document](./MVP_SCOPE.md)
