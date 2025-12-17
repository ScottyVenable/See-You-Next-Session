# SDNS Future Features & Enhancement Ideas

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
│  📍 START   │    └──────────┘      └────┬─────┘                │
│  💬 greeting│                           │                       │
│  💬 opening │          ┌────────────────┼────────────────┐      │
│  🎯 insight │          ▼                ▼                ▼      │
│  ⚡ crisis  │    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│             │    │ response │    │ response │    │ response │  │
│  RESPONSES  │    │ deflect  │    │  honest  │    │  deeper  │  │
│  ─────────  │    └────┬─────┘    └────┬─────┘    └────┬─────┘  │
│  🔄 deflect │         │               │               │        │
│  🔄 honest  │         └───────────────┴───────────────┘        │
│  🔄 deeper  │                         │                        │
│             │                         ▼                        │
│             │                   ┌──────────┐                   │
│             │                   │ opening  │                   │
│             │                   └──────────┘                   │
│             │                                                   │
└─────────────┴───────────────────────────────────────────────────┘
```

#### 1.2 Dialogue Block Editor
- **WYSIWYG dialogue editing** with speaker portraits
- **Keyword insertion** via dropdown/autocomplete
- **Mood/expression selector** with visual preview
- **Real-time syntax validation**
- **Drag-and-drop flow connections**

#### 1.3 Keyword Manager
```
┌─────────────────────────────────────────────────────────────────┐
│  KEYWORD MANAGER                                                │
├─────────────────────────────────────────────────────────────────┤
│  [New Keyword] [Import] [Export] [Categories ▼]                 │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search keywords...                                          │
├───────────────┬─────────────────────────────────────────────────┤
│ ► time        │  KEYWORD: time.months                           │
│   ├ months    │  ────────────────────────────────────────────── │
│   ├ weeks     │  Display Text: "Months"                         │
│   └ years     │  Description: Duration indicating months        │
│ ► emotion     │  Importance: ● critical ○ high ○ medium ○ low   │
│   ├ anxious   │  Category: time                                 │
│   ├ worried   │  ────────────────────────────────────────────── │
│   └ hopeless  │  EFFECTS:                                       │
│ ► symptom     │  [+] reveals: time-awareness                    │
│ ► behavior    │  [+] unlocks: follow-up-duration                │
│ ► cognition   │  ────────────────────────────────────────────── │
│ ► relationship│  MENU OPTIONS:                                  │
│               │  ☑ note.add    ☑ ask.follow-up                  │
│  [Gregory]    │  ☑ clinical.assess                              │
│   ├ performing│  ────────────────────────────────────────────── │
│   └ overreact │  PREVIEW:                                       │
│               │  "It's been [Months](time.months), actually."   │
└───────────────┴─────────────────────────────────────────────────┘
```

#### 1.4 Preview Mode
- **Live dialogue preview** with actual game rendering
- **Test player responses** without full game launch
- **Variable inspector** showing state changes
- **Timeline scrubbing** through conversation flow

### Technical Implementation
```javascript
// Session Creator would generate structured JSON
{
  "meta": {
    "patient": "gregory",
    "session": 2,
    "created": "2024-01-15",
    "author": "designer"
  },
  "blocks": [
    {
      "id": "START",
      "type": "entry",
      "dialogue": [...],
      "connections": ["greeting"]
    }
  ]
}

// Then export to .session format
@meta
  patient: gregory
  session: 2
  created: 2024-01-15

=== START ===
// generated dialogue...
```

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

// Check response history
@if player.responses.contains("ignored warning signs")
  // Reference specific past choice
@endif
```

#### 2.3 Time-Based Conditions
```sdns
// Session timing
@if session.time > 15:00
  SYSTEM
  "Session time is running low."
@endif

// Turn-based
@if turn >= 8 AND NOT breakthrough.achieved
  // Late-session no-breakthrough path
@endif
```

---

## 3. Emotional State Machine

### Concept
A more sophisticated patient emotional system that tracks multiple emotional dimensions.

### Implementation
```javascript
// Patient Emotional State
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
// Mood modifiers affect emotional state
@mood valence:-0.1, anxiety:+0.2

PATIENT (anxious, guarded)
"I don't want to talk about that."

// Automatic mood transitions based on state
@if emotional.anxiety >= 0.9
  @jump crisis-intervention
@endif
```

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
  },
  "normalizing": {
    template: "Many people experience {symptom} after {event}.",
    approach: "Psychoeducational",
    effect: { anxiety: -3, hope: +2 }
  }
};
```

### SDNS Usage
```sdns
// Response options using archetypes
[1] @archetype:validating "Your feelings are completely understandable."
[2] @archetype:probing "What happened next?"
[3] @archetype:challenging "But earlier you said..."
```

---

## 5. Observation System

### Concept
Let players make non-verbal observations that add to clinical notes.

### Implementation
```sdns
=== greeting ===

NARRATOR
Gregory enters the room slowly, avoiding eye contact.

// Observable elements the player can note
@observable body-language
  id: "avoiding-eye-contact"
  category: nonverbal
  note: "Avoided eye contact when entering"
  reveals: social-anxiety-indicator
@end

@observable behavior  
  id: "slow-movement"
  category: psychomotor
  note: "Slow, hesitant movements"
  reveals: depression-indicator
@end

PATIENT (reserved)
"Hi..."
```

### Player Interface
```
┌─────────────────────────────────────────────────────────────────┐
│  👁️ OBSERVATION MODE                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  You notice:                                                    │
│  ┌─────────────────────────────────────────────────┐           │
│  │ [Click to Note]  Avoiding eye contact           │           │
│  └─────────────────────────────────────────────────┘           │
│  ┌─────────────────────────────────────────────────┐           │
│  │ [Click to Note]  Moving slowly, hesitantly      │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  [Continue without noting]                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Session Templates

### Concept
Reusable session structures for common therapeutic patterns.

### Templates
```sdns
// Template: Initial Assessment
@template initial-assessment
  required_blocks:
    - introduction
    - presenting-problem
    - history-taking
    - mental-status
    - closing
  
  suggested_duration: 45-60 minutes
  suggested_turns: 15-20
  
  structure:
    introduction: 10%
    presenting-problem: 30%
    history-taking: 35%
    mental-status: 15%
    closing: 10%
@end

// Template: Crisis Intervention
@template crisis-intervention
  required_blocks:
    - safety-assessment
    - stabilization
    - safety-planning
    - follow-up
  
  must_include:
    - suicidal-ideation-assessment
    - safety-contract
    - emergency-contacts
@end
```

---

## 7. Multi-Session Continuity

### Concept
Track and reference information across multiple sessions.

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

// Reference in future sessions
@if memory.has("disclosed-abuse")
  // Adjusted dialogue paths
@endif
```

### Save Data Structure
```javascript
{
  "patient_id": "gregory",
  "sessions": [
    {
      "number": 1,
      "date": "2024-01-08",
      "breakthroughs": [],
      "memories": [...],
      "rapport_end": 35,
      "notes": [...]
    },
    {
      "number": 2,
      "date": "2024-01-15",
      "breakthroughs": ["time-awareness"],
      "memories": [...],
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

---

## 8. Dialogue Variations System

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

---

## 9. Clinical Accuracy Validation

### Concept
Built-in validation for clinical accuracy and therapeutic appropriateness.

### Validators
```javascript
const CLINICAL_VALIDATORS = {
  // Ensure safety protocols
  "safety-check": {
    trigger: ["suicide", "self-harm", "SI", "SH"],
    requires: ["safety-assessment-block", "crisis-protocol-available"],
    error: "Session mentions safety concerns but lacks safety protocol"
  },
  
  // Therapeutic boundary checks
  "boundary-check": {
    forbidden_patterns: [
      /THERAPIST.*\b(should|must|have to)\b/,  // Prescriptive language
      /THERAPIST.*\b(I think you should)\b/    // Advice-giving
    ],
    warning: "Therapist dialogue may violate person-centered boundaries"
  },
  
  // Diagnosis accuracy
  "dx-accuracy": {
    if_mentions: "diagnosis",
    requires: "proper-assessment-completed",
    warning: "Diagnosis mentioned without proper assessment sequence"
  }
};
```

### VS Code Integration
```
⚠️ Line 45: Safety concern keyword detected without crisis protocol
   Add @crisis-protocol block or @safety-plan reference

⚠️ Line 78: Therapist uses prescriptive language "you should"
   Consider: "What do you think about..." or "Some people find..."
```

---

## 10. Localization Support

### Concept
Multi-language support for international audiences and translation workflows.

### Structure
```
src/data/
├── locales/
│   ├── en/
│   │   ├── keywords.json
│   │   └── ui.json
│   ├── es/
│   │   ├── keywords.json
│   │   └── ui.json
│   └── ja/
│       ├── keywords.json
│       └── ui.json
└── sessions/
    ├── gregory/
    │   ├── session-1.en.session
    │   ├── session-1.es.session
    │   └── session-1.ja.session
```

### SDNS Localization Tags
```sdns
@locale en

PATIENT (anxious)
"I've been feeling really [anxious](emotion.anxious) lately."

// Localized version (es)
@locale es

PATIENT (anxious)
"Últimamente me he sentido muy [ansioso](emotion.anxious)."
```

---

## Implementation Priority

| Feature | Complexity | Impact | Priority |
|---------|------------|--------|----------|
| Session Creator GUI | High | High | P1 |
| Observation System | Medium | High | P1 |
| Dynamic Conditions | Medium | Medium | P2 |
| Emotional State Machine | High | High | P2 |
| Response Archetypes | Low | Medium | P2 |
| Session Templates | Low | Medium | P3 |
| Multi-Session Continuity | High | High | P3 |
| Dialogue Variations | Medium | Low | P3 |
| Clinical Validation | Medium | High | P2 |
| Localization | High | Medium | P4 |

---

## Next Steps

1. **Prototype Session Creator** - Start with basic node editor
2. **Implement Observation System** - Integrate with existing keyword/note system
3. **Extend Condition Parser** - Add compound condition support
4. **Design Emotional State UI** - Visual representation of patient state
5. **Create Template Library** - Build common session patterns

---

*Document Version: 1.0*
*Last Updated: Session Development Phase*
*Status: Ideas & Proposals*
