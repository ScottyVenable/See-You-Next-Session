# SDNS Future Features & Enhancement Ideas

> **Document Type:** Feature Proposals  
> **Created:** December 15, 2025  
> **Last Updated:** December 17, 2025  
> **Status:** Ideas & Proposals (Post-MVP)

---

## Overview

This document outlines potential future enhancements to the Session Dialogue and Narration System (SDNS) that could improve the authoring experience, gameplay depth, and clinical accuracy of dialogue sessions.

---

## 1. Session Creator GUI Tool

### Concept
A dedicated in-game or standalone GUI application for creating and editing `.session` files without needing to write raw SDNS syntax.

### Core Features

#### 1.1 Visual Node Editor
```
┌─────────────────────────────────────────────────────────────────┐
│  SESSION CREATOR - Gregory Session 2                      ─ □ X │
├─────────────────────────────────────────────────────────────────┤
│  [File] [Edit] [View] [Tools] [Preview] [Help]                  │
├─────────────┬───────────────────────────────────────────────────┤
│             │                                                   │
│  BLOCKS     │    ┌──────────┐      ┌──────────┐                │
│  ─────────  │    │  START   │ ───▶ │ greeting │                │
│  * START    │    └──────────┘      └────┬─────┘                │
│  > greeting │                           │                       │
│  > opening  │          ┌────────────────┼────────────────┐      │
│  # insight  │          ▼                ▼                ▼      │
│             │    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│             │    │ response │    │ response │    │ response │  │
│             │    │ deflect  │    │  honest  │    │  deeper  │  │
│             │    └──────────┘    └──────────┘    └──────────┘  │
└─────────────┴───────────────────────────────────────────────────┘
```

#### 1.2 Key GUI Features
- **WYSIWYG dialogue editing** with speaker portraits
- **Keyword insertion** via dropdown/autocomplete
- **Mood/expression selector** with visual preview
- **Real-time syntax validation**
- **Drag-and-drop flow connections**
- **Live dialogue preview** with game rendering
- **Variable inspector** showing state changes

### Implementation Priority: **P1 - High Impact**

---

## 2. Dynamic Dialogue Conditions

### Concept
Extend the condition system with more complex, real-time evaluations.

### New Condition Types

#### 2.1 Compound Conditions
```sdns
// AND/OR logic
@if (rapport >= 50 AND breakthroughs >= 2) OR session >= 3
  PATIENT (opening up)
  "There's something I haven't told you..."
@endif

// Nested conditions
@if rapport >= 50
  @if revealed.trauma
    // Deep trust + revealed trauma path
  @else
    // High trust, trauma not yet revealed
  @endif
@endif
```

#### 2.2 Pattern Conditions
```sdns
// Check player behavior patterns
@if player.pattern.confrontational >= 3
  PATIENT (defensive)
  "Why do you keep pushing?"
@endif
```

#### 2.3 Time-Based Conditions
```sdns
// Session timing
@if session.time > 15:00
  SYSTEM
  "Session time is running low."
@endif
```

### Implementation Priority: **P2 - Medium Impact**

---

## 3. Emotional State Machine

### Concept
A more sophisticated patient emotional system that tracks multiple emotional dimensions.

### Implementation
```javascript
{
  "emotional_state": {
    "valence": 0.3,      // -1 (negative) to 1 (positive)
    "arousal": 0.7,      // 0 (calm) to 1 (agitated)
    "dominance": 0.2,    // 0 (submissive) to 1 (dominant)
    
    "specific_emotions": {
      "anxiety": 0.8,
      "sadness": 0.4,
      "anger": 0.2,
      "shame": 0.6,
      "hope": 0.1
    },
    
    "thresholds": {
      "crisis": { "anxiety": 0.9, "arousal": 0.9 },
      "breakthrough": { "valence": 0.6, "hope": 0.5 }
    }
  }
}
```

### SDNS Integration
```sdns
@mood valence:-0.1, anxiety:+0.2

PATIENT (anxious, guarded)
"I don't want to talk about that."

@if emotional.anxiety >= 0.9
  @jump crisis-intervention
@endif
```

### Implementation Priority: **P2 - High Impact**

---

## 4. Therapist Response Archetypes

### Concept
Pre-defined response templates that embody different therapeutic approaches.

### Archetypes
```javascript
const RESPONSE_ARCHETYPES = {
  "reflective": {
    template: "It sounds like you're feeling {emotion} about {topic}.",
    approach: "Person-centered",
    effect: { rapport: +5, trust: +3 }
  },
  "probing": {
    template: "Can you tell me more about {topic}?",
    approach: "Exploratory",
    effect: { insight: +3, anxiety: +1 }
  },
  "validating": {
    template: "That makes sense given what you've been through.",
    approach: "Supportive",
    effect: { rapport: +8, shame: -2 }
  },
  "challenging": {
    template: "I notice you said {contradiction}. How do you reconcile that?",
    approach: "Cognitive",
    effect: { insight: +5, rapport: -2, anxiety: +2 }
  }
};
```

### Implementation Priority: **P2 - Medium Impact**

---

## 5. Observation System

### Concept
Let players make non-verbal observations that add to clinical notes.

### Implementation
```sdns
=== greeting ===

NARRATOR
Gregory enters the room slowly, avoiding eye contact.

@observable body-language
  id: "avoiding-eye-contact"
  category: nonverbal
  note: "Avoided eye contact when entering"
  reveals: social-anxiety-indicator
@end

PATIENT (reserved)
"Hi..."
```

### Player Interface
```
┌─────────────────────────────────────────────────────────────────┐
│  👁️ OBSERVATION MODE                                            │
├─────────────────────────────────────────────────────────────────┤
│  You notice:                                                    │
│  ┌─────────────────────────────────────────────────┐           │
│  │ [Click to Note]  Avoiding eye contact           │           │
│  └─────────────────────────────────────────────────┘           │
│  ┌─────────────────────────────────────────────────┐           │
│  │ [Click to Note]  Moving slowly, hesitantly      │           │
│  └─────────────────────────────────────────────────┘           │
│  [Continue without noting]                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Priority: **P1 - High Impact**

---

## 6. Multi-Session Continuity

### Concept
Track and reference information across multiple sessions with the same patient.

### Implementation
```sdns
// Reference previous session data
@if previous_session.breakthroughs.includes("trauma-reveal")
  THERAPIST (warm)
  "Last time we talked about something really difficult. 
   How have you been processing that?"
@endif

// Session memory
@remember
  key: "disclosed-abuse"
  session: 2
  context: "Patient revealed childhood emotional abuse"
  significance: critical
@end
```

### Save Data Structure
```javascript
{
  "patient_id": "gregory",
  "sessions": [
    {
      "number": 1,
      "breakthroughs": [],
      "rapport_end": 35,
      "notes": [...]
    },
    {
      "number": 2,
      "breakthroughs": ["time-awareness"],
      "rapport_end": 52
    }
  ],
  "cumulative": {
    "total_breakthroughs": 1,
    "therapeutic_alliance": 52,
    "revealed_topics": ["duration", "perfectionism"]
  }
}
```

### Implementation Priority: **P3 - High Impact (Post-MVP)**

---

## 7. Dialogue Variations System

### Concept
Automatic variation in dialogue to prevent repetition.

### Implementation
```sdns
// Define variations
@variations patient-greeting
  | "Hi..."
  | "Hey."
  | "Hello."
  | "[silence, nods]"
@end

// Use in dialogue
PATIENT (reserved)
@vary patient-greeting weight:session

// Weighted variations based on emotional state
@variations anxious-deflection
  | weight:anxiety>0.7 "I don't... I can't talk about that."
  | weight:anxiety>0.5 "Can we talk about something else?"
  | weight:default "I'd rather not."
@end
```

### Implementation Priority: **P3 - Low Impact**

---

## 8. Clinical Accuracy Validation

### Concept
Built-in validation for clinical accuracy and therapeutic appropriateness.

### Validators
```javascript
const CLINICAL_VALIDATORS = {
  "safety-check": {
    trigger: ["suicide", "self-harm", "SI", "SH"],
    requires: ["safety-assessment-block", "crisis-protocol-available"],
    error: "Session mentions safety concerns but lacks safety protocol"
  },
  "boundary-check": {
    forbidden_patterns: [
      /THERAPIST.*\b(should|must|have to)\b/,
      /THERAPIST.*\b(I think you should)\b/
    ],
    warning: "Therapist dialogue may violate person-centered boundaries"
  }
};
```

### VS Code Integration
```
⚠️ Line 45: Safety concern keyword detected without crisis protocol
⚠️ Line 78: Therapist uses prescriptive language "you should"
```

### Implementation Priority: **P2 - High Impact**

---

## 9. Localization Support

### Concept
Multi-language support for international audiences.

### Structure
```
src/data/
├── locales/
│   ├── en/
│   ├── es/
│   └── ja/
└── sessions/
    └── gregory/
        ├── session-1.en.session
        ├── session-1.es.session
        └── session-1.ja.session
```

### Implementation Priority: **P4 - Post-MVP**

---

## Implementation Priority Summary

| Feature | Complexity | Impact | Priority |
|---------|------------|--------|----------|
| Session Creator GUI | High | High | P1 |
| Observation System | Medium | High | P1 |
| Dynamic Conditions | Medium | Medium | P2 |
| Emotional State Machine | High | High | P2 |
| Response Archetypes | Low | Medium | P2 |
| Clinical Validation | Medium | High | P2 |
| Multi-Session Continuity | High | High | P3 |
| Dialogue Variations | Medium | Low | P3 |
| Localization | High | Medium | P4 |

---

## Next Steps

1. **Prototype Session Creator** - Start with basic node editor
2. **Implement Observation System** - Integrate with existing keyword system
3. **Extend Condition Parser** - Add compound condition support
4. **Design Emotional State UI** - Visual representation of patient state

---

## Related Documents

- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
- [Technical Architecture](../technical/TECHNICAL_ARCHITECTURE.md)
- [TODO & Roadmap](../planning/TODO.md)
