# SYNS Dialogue Language Specification

A simple, readable scripting language for creating patient dialogue in "See You Next Session".

## File Extension
`.syns` - See You Next Session dialogue files

## Basic Syntax

### Comments
```syns
// Single line comment
/* Multi-line
   comment */
```

### Dialogue Blocks
```syns
=== block_name ===
// Content goes here
-> next_block
```

### Speech Lines
```syns
PATIENT: "This is what the patient says."
PATIENT (nervous): "I'm feeling a bit anxious..."
THERAPIST: "How does that make you feel?"
NARRATOR: *The patient shifts uncomfortably*
```

### Keywords (Clickable/Collectible)
```syns
PATIENT: "I've been [having trouble sleeping] lately."
//                  ^ This becomes a keyword token

PATIENT: "I'm [sleeping fine, really]<contradicts:bags-under-eyes>."
//       ^ Keyword with contradiction marker
```

### Mood Indicators
```syns
PATIENT (nervous): "..."
PATIENT (defensive): "..."
PATIENT (relieved): "..."
PATIENT (anxious): "..."
PATIENT (angry): "..."
PATIENT (sad): "..."
PATIENT (hopeful): "..."
```

---

## Conditions

### Basic Conditions
```syns
@if rapport >= 75
    PATIENT: "I feel like I can trust you with this..."
@endif

@if rapport < 50
    PATIENT: "I'd rather not talk about that."
@endif
```

### Condition Operators
- `>=`, `<=`, `>`, `<`, `==`, `!=` - Comparison
- `&&` - AND
- `||` - OR
- `!` - NOT

### Available Variables
```syns
rapport          // Current rapport (0-100)
focus            // Current focus
turn             // Current turn number
breakthroughs    // Number of breakthroughs achieved

// Checks
has_symptom("symptom-id")      // Player revealed this symptom
has_keyword("keyword-id")       // Player collected this keyword
has_breakthrough("bt-id")       // Player achieved this breakthrough
asked_about("topic")            // Player asked about this topic
```

### Complex Conditions
```syns
@if rapport >= 75 && has_symptom("bags-under-eyes")
    PATIENT (relieved): "Okay, I'll admit it... I haven't been sleeping."
@elseif rapport >= 50
    PATIENT (hesitant): "Sleep? It's... been difficult."
@else
    PATIENT (defensive): "I sleep fine."
@endif
```

---

## Branching & Choices

### Simple Branch
```syns
-> next_block_name
```

### Conditional Branch
```syns
@if rapport >= 75
    -> deep_confession
@else
    -> surface_response
@endif
```

### Player Choices (Prompt Responses)
```syns
@when asked_about("sleep")
    @if rapport >= 75
        PATIENT: "Honestly? I lie awake for hours..."
        @reveal sleep-issues
    @else
        PATIENT: "I sleep fine, really."
    @endif
@end

@when asked_about("family")
    PATIENT: "My family? What about them?"
    -> family_discussion
@end
```

---

## Actions & Effects

### Reveal Symptoms
```syns
@reveal symptom-id
// Makes a visual symptom discoverable
```

### Change Rapport
```syns
@rapport +10    // Increase rapport
@rapport -5     // Decrease rapport
```

### Unlock Dialogue
```syns
@unlock block_name
// Makes a dialogue block available
```

### Set Flags
```syns
@set admitted_sleep_issues = true
@set trust_level = "high"

@if $admitted_sleep_issues
    PATIENT: "Like I said before..."
@endif
```

### Give Focus
```syns
@focus +20     // Restore focus
@focus -10     // Spend focus
```

---

## Special Blocks

### Entry Point
```syns
=== START ===
// First block that runs for this phase
```

### Response Handlers
```syns
=== @response:family ===
// Triggered when player asks about family topic
```

### Breakthrough Dialogue
```syns
=== @breakthrough:sleep ===
@trigger keyword-sleep-lie + bags-under-eyes
    PATIENT (relieved): "*sighs* Okay, you're right..."
    PATIENT: "I [haven't slept properly in weeks]<reveals:insomnia>."
    @rapport +15
    @focus +40
@end
```

---

## Full Example

```syns
// Patient: Alex - Tutorial (Generalized Anxiety)
// Phase: Turn 1

=== START ===
PATIENT (nervous): "Thanks for seeing me, doctor."
PATIENT: "I... I've been having a [rough time] lately."
-> intro_continue

=== intro_continue ===
@pause 1.5
PATIENT (anxious): "I just can't stop [worrying about everything]."
PATIENT: "Work, my family, even little things..."
-> sleep_topic

=== sleep_topic ===
PATIENT (defensive): "I'm [sleeping fine, really]<contradicts:bags-under-eyes>."
@if rapport < 40
    PATIENT: "Can we talk about something else?"
@endif

=== @response:emotions.sleep ===
@if rapport >= 75 && has_symptom("bags-under-eyes")
    PATIENT (vulnerable): "Okay... I haven't been sleeping well."
    PATIENT: "I lie awake for [hours every night], worrying."
    @set admitted_sleep = true
    @rapport +5
@elseif rapport >= 50
    PATIENT (hesitant): "Sleep is... complicated."
    PATIENT: "Some nights are better than others."
@else
    PATIENT (defensive): "I told you, I sleep fine."
    PATIENT: "Why do you keep asking?"
    @rapport -3
@endif

=== @response:family.childhood ===
@if rapport >= 60
    PATIENT (sad): "My childhood? It was... complicated."
    PATIENT: "My parents [always expected perfection]."
    @reveal childhood-trauma
@else
    PATIENT (guarded): "It was normal, I guess."
@endif

=== @breakthrough:sleep ===
@trigger keyword-sleep-lie + bags-under-eyes
    NARRATOR: *The patient's eyes widen as they realize the contradiction*
    PATIENT (relieved): "*sighs* Okay, you're right."
    PATIENT: "I [haven't slept properly in weeks]<reveals:insomnia>."
    PATIENT: "I lie awake for hours, my mind just won't stop."
    @rapport +15
    @focus +40
    @unlock deep_sleep_discussion
@end
```

---

## File Organization

```
src/dialogue/
├── patients/
│   ├── alex/
│   │   ├── turn1.syns
│   │   ├── turn2.syns
│   │   ├── turn3.syns
│   │   ├── turn4.syns
│   │   └── breakthroughs.syns
│   └── patient2/
│       └── ...
├── parser.js
├── engine.js
└── DIALOGUE_SPEC.md
```

---

## Parser Output (AST)

The parser converts `.syns` files into an AST like:

```javascript
{
  blocks: {
    'START': {
      lines: [
        { type: 'speech', speaker: 'PATIENT', mood: 'nervous', text: '...', keywords: [] },
        { type: 'goto', target: 'intro_continue' }
      ]
    },
    '@response:emotions.sleep': {
      conditions: [...],
      lines: [...]
    }
  },
  breakthroughs: {
    'sleep': {
      trigger: { keyword: 'keyword-sleep-lie', symptom: 'bags-under-eyes' },
      lines: [...]
    }
  }
}
```
