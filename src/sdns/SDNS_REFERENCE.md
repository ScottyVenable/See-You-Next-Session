# SDNS - Session Dialogue and Narration System

## Complete Language Reference & Developer Guide

**Version 1.0.0** | *See You Next Session*

---

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [File Structure](#file-structure)
4. [Language Syntax](#language-syntax)
   - [Comments](#comments)
   - [Blocks](#blocks)
   - [Speakers](#speakers)
   - [Speech & Actions](#speech--actions)
   - [Keywords](#keywords)
   - [Directives](#directives)
   - [Control Flow](#control-flow)
   - [Variables](#variables)
5. [Response Handlers](#response-handlers)
6. [Breakthrough System](#breakthrough-system)
7. [Game State Integration](#game-state-integration)
8. [Best Practices](#best-practices)
9. [API Reference](#api-reference)
10. [Examples](#examples)

---

## Introduction

The **Session Dialogue and Narration System (SDNS)** is a custom scripting language designed specifically for therapy simulation games. It enables writers to create dynamic, branching dialogue that responds to player choices and game state.

### Key Features

- **Character-driven dialogue** with mood indicators
- **Conditional branching** based on rapport, focus, and custom variables
- **Keyword extraction** for evidence collection mechanics
- **Breakthrough system** for dramatic narrative moments
- **Deep game integration** with automatic state management
- **Clean, readable syntax** that's easy to write and maintain

### File Extension

SDNS files use the `.session` extension:
```
turn1.session
turn2.session
config.json
```

---

## Quick Start

### Basic Dialogue File

```session
// My First Session File
// Patient: Example Patient

=== START ===
NARRATOR
*The patient enters the room slowly, looking nervous.*

PATIENT (nervous)
"Hello, doctor. I'm not sure where to begin."

@pause 0.5

PATIENT
"I've been having some [trouble sleeping] lately."

-> continue_intro

=== continue_intro ===
PATIENT (hesitant)
"Is that... is that something you can help with?"

@rapport +2
```

### Loading in React

```javascript
import { useDialogue, loadSessionDialogue } from '../sdns';

function DialogueBox({ gameState, actions }) {
    const dialogue = useDialogue(gameState, actions);
    
    useEffect(() => {
        async function init() {
            const source = await loadSessionDialogue('gregory', 1);
            dialogue.loadDialogue(source);
            dialogue.startBlock('START');
        }
        init();
    }, []);
    
    return (
        <div className="dialogue-box">
            <span className="speaker">{dialogue.currentSpeech?.speaker}</span>
            <p>{dialogue.currentSpeech?.text}</p>
            <button onClick={dialogue.advance}>Continue</button>
        </div>
    );
}
```

---

## File Structure

### Directory Layout

```
src/patients/
└── gregory/                    # Patient folder (ID)
    ├── patient_config.json     # Patient metadata
    └── dialogue/
        ├── config.json         # Dialogue configuration
        ├── turn1.session       # Turn 1 dialogue
        ├── turn2.session       # Turn 2 dialogue
        ├── turn3.session       # Turn 3 dialogue
        └── turn4.session       # Turn 4 dialogue
```

### patient_config.json

```json
{
    "id": "gregory",
    "version": "1.0.0",
    "profile": {
        "name": "Gregory Vigil",
        "age": 27,
        "occupation": "Administrative Assistant",
        "avatar": "gregory-neutral.png"
    },
    "clinical": {
        "primaryDiagnosis": "gad",
        "severity": "moderate",
        "phase": "assessment"
    },
    "unlockRequirements": {
        "type": "always"
    }
}
```

### dialogue/config.json

```json
{
    "patientId": "gregory",
    "totalTurns": 4,
    "topics": {
        "therapy": {
            "label": "About Therapy",
            "subtopics": ["reason", "expectations", "concerns"]
        },
        "sleep": {
            "label": "Sleep",
            "unlockCondition": { "rapport": 30 },
            "subtopics": ["quality", "routine", "thoughts"]
        }
    },
    "breakthroughs": {
        "insomnia-admission": {
            "requirements": {
                "keyword": "kw-trouble-sleeping",
                "symptom": "insomnia"
            }
        }
    }
}
```

---

## Language Syntax

### Comments

```session
// Single line comment

/* 
   Multi-line 
   comment 
*/

// Use comments liberally to document your dialogue
// They are stripped out during parsing
```

### Blocks

Blocks are named sections of dialogue. Execution flows through blocks sequentially or via jumps.

```session
=== START ===
// The main entry point - required for every session file
// Execution begins here when dialogue starts

=== another_block ===
// Custom blocks for organizing dialogue
// Jump to them with -> another_block

=== @response:topic.subtopic ===
// Response handlers - triggered when player selects a topic
// Format: @response:category.specific

=== @breakthrough:name ===
// Breakthrough blocks - special dramatic moments
// Triggered by keyword + symptom combinations
```

#### Block Naming Rules

- Use lowercase with underscores: `sleep_discussion`
- Response handlers use dots: `@response:sleep.quality`
- Breakthroughs use colons: `@breakthrough:insomnia-reveal`
- The `START` block is required and case-sensitive

### Speakers

Four speaker types are supported:

```session
PATIENT
"Standard patient dialogue."

PATIENT (mood)
"Patient dialogue with mood indicator."

THERAPIST
"Rarely used - player responses are typically selected, not spoken."

NARRATOR
*Describes actions, environment, or observations.*

SYSTEM
"Used for game instructions or meta-information."
```

#### Available Moods

| Mood | Description |
|------|-------------|
| `nervous` | Anxious, fidgety energy |
| `hesitant` | Uncertain, careful speech |
| `defensive` | Guarded, resistant |
| `guarded` | Closed off, minimal sharing |
| `vulnerable` | Open, exposed |
| `sad` | Depressed, low energy |
| `anxious` | Worried, rapid thoughts |
| `angry` | Frustrated, hostile |
| `thoughtful` | Reflective, considering |
| `honest` | Sincere, truthful |
| `embarrassed` | Ashamed, uncomfortable |
| `exhausted` | Tired, drained |
| `seeking validation` | Looking for reassurance |

### Speech & Actions

#### Regular Speech

```session
PATIENT
"Regular dialogue in quotes."

PATIENT (nervous)
"Dialogue with mood indicator."

PATIENT
"Multi-line dialogue is supported. The parser will 
automatically join lines with spaces, so you can 
write longer passages comfortably."
```

#### Action/Narration

```session
NARRATOR
*Actions and descriptions use asterisks instead of quotes.*

NARRATOR
*Gregory shifts uncomfortably in his seat, his fingers 
drumming against his leg.*

PATIENT
*sighs heavily*
```

### Keywords

Keywords are special text that players can collect as evidence. They appear highlighted in the dialogue and can trigger gameplay effects, reveal symptoms, and provide interactive tooltips.

#### Keyword Formats

SDNS supports multiple keyword formats, from simple to fully customized:

```session
// 1. SIMPLE - Auto-matched or auto-generated keyword
PATIENT
"I've been having [trouble sleeping] lately."

// 2. REFERENCE - Link to keyword database
PATIENT
"I've been meaning to come for a while now. [Months, actually](time.months)."

// 3. PATIENT-SPECIFIC - Patient's unique version
PATIENT
"[Months, actually](gregory.time.months-actually) But I kept thinking..."

// 4. REFERENCE WITH OVERRIDE - Modify existing keyword
PATIENT
"It's been [several months](time.months, {"importance": "high"})."

// 5. INLINE DEFINITION - Define keyword in place
PATIENT
"I keep [doing it wrong](@keyword{
    id: "doing-wrong",
    category: "cognition",
    effects: { reveals: ["perfectionism"] }
})."

// 6. LEGACY METADATA - Still supported
PATIENT
"I [sleep fine]<contradicts:bags-under-eyes>."
```

#### Keyword Reference Syntax

Reference keywords from the database using dot notation:

```session
// Category.keyword format
[display text](category.keyword_id)

// Examples:
[months](time.months)
[worried](emotion.worried)
[can't sleep](behavior.cant-sleep)
[heart racing](symptom.heart-racing)
[no one understands](relationship.no-one)
[not good enough](cognition.not-good-enough)
```

#### Patient-Specific Keywords

Reference patient-unique keywords with three-part notation:

```session
// Patient.category.keyword format
[display text](patient_id.category.keyword_id)

// Examples for Gregory:
[Months, actually](gregory.time.months-actually)
[overreacting](gregory.cognition.overreacting)
[I sleep fine](gregory.behavior.sleep-fine)
```

#### Inline Keyword Definition

Define keywords directly in the dialogue for one-off use:

```session
[display text](@keyword{
    id: "unique-id",
    category: "category-name",
    description: "Tooltip description",
    style: {
        color: "#e74c3c",
        importance: "high"
    },
    effects: {
        focusCost: 5,
        reveals: ["symptom-id"],
        rapportChange: 2
    },
    menuOptions: [
        {
            id: "custom-action",
            label: "Ask about this",
            action: "queue-topic",
            params: { topic: "related.topic" }
        }
    ]
})
```

#### Keyword Categories

| Category | Description | Example |
|----------|-------------|---------|
| `time` | Duration, frequency, timing | `[months](time.months)` |
| `emotion` | Feelings and affect | `[anxious](emotion.anxious)` |
| `behavior` | Actions and patterns | `[avoiding](behavior.avoiding)` |
| `symptom` | Clinical signs | `[insomnia](symptom.insomnia)` |
| `relationship` | Social connections | `[no friends](relationship.no-friends)` |
| `cognition` | Thoughts and beliefs | `[failure](cognition.failure)` |

#### Keyword Effects

Keywords can trigger various game effects:

```session
// In keyword database (src/data/keywords/categories/...)
'emotion.hopeless': {
    id: 'emotion.hopeless',
    effects: {
        focusCost: 10,           // Focus points to collect
        rapportChange: 3,        // Rapport modifier
        reveals: ['hopelessness'], // Reveal symptoms
        contradicts: ['happy-appearance'], // Mark contradictions
        triggers: ['depression-marker'], // Trigger breakthroughs
        unlocks: ['safety-topics'],  // Unlock new topics
        setVars: { 'hopeless_mentioned': true } // Set variables
    }
}
```

#### Keyword Styling

Control visual appearance using inline properties or CSS preset references:

```session
// Option 1: Inline style properties (in keyword definition)
style: {
    color: '#e74c3c',           // Text color
    bgColor: 'rgba(231,76,60,0.15)', // Background
    icon: 'alert-circle',        // Icon identifier
    animation: 'pulse',          // Animation (pulse, glow, shake)
    importance: 'critical'       // low, medium, high, critical
}

// Option 2: CSS preset reference (in dialogue)
[I had trouble sleeping]<keyword:gregory.behavior.sleep-trouble><style:behavior.red><anim:pulse>
```

#### Style Presets

Use `<style:category.preset>` to apply predefined CSS styles:

| Category | Presets | Color |
|----------|---------|-------|
| `behavior` | `default`, `red`, `warning`, `avoidance` | Red tones |
| `emotion` | `default`, `purple`, `sad`, `anxious`, `positive` | Purple/varied |
| `cognition` | `default`, `blue`, `distortion`, `belief` | Blue tones |
| `symptom` | `default`, `orange`, `critical`, `physical` | Orange/red |
| `relationship` | `default`, `teal`, `conflict`, `support`, `loss` | Teal/varied |
| `time` | `default`, `silver`, `recent`, `chronic` | Gray tones |

Example usage:
```session
PATIENT (nervous)
"I've been [worried](emotion.worried)<style:emotion.anxious> about this for [weeks](time.weeks)<style:time.chronic>."
```

#### Animation Presets

Use `<anim:type>` to apply animations:

| Animation | Description |
|-----------|-------------|
| `none` | No animation |
| `highlight` | Brief flash effect on interaction |
| `pulse` | Gentle breathing/pulsing effect |
| `glow` | Soft luminance shift |
| `shimmer` | Light sweep effect across keyword |
| `shake` | Brief shake (for contradictions) |
| `pop` | Scale pop for emphasis |
| `float` | Subtle lift on hover |

Example:
```session
PATIENT
"I [sleep fine]<contradicts:bags-under-eyes><anim:shake>."
```

#### Importance Levels

Keywords have importance levels that affect subtle visual treatment:

| Level | Visual Treatment |
|-------|------------------|
| `low` | Baseline - subtle styling |
| `medium` | Slightly more noticeable |
| `high` | 2px border, slight glow |
| `critical` | 2px border, idle pulse animation |

Note: Visual differences are subtle to avoid spoiling gameplay.

#### Keyword Menu Options

Define tooltip actions:

```session
menuOptions: [
    {
        id: 'note-add',
        label: 'Add to Notes',
        icon: 'note',
        action: 'note'
    },
    {
        id: 'ask-followup',
        label: 'Ask: Tell me more',
        icon: 'message-circle',
        action: 'queue-topic',
        params: { topic: 'related.topic' }
    },
    {
        id: 'safety-check',
        label: '⚠️ Safety Assessment',
        icon: 'shield',
        action: 'queue-topic',
        params: { topic: 'safety.assessment', priority: 'critical' }
    }
]
```

#### Legacy Metadata (Deprecated)

The older metadata format is still supported but new code should use references:

```session
// Legacy format - still works
PATIENT
"I [sleep fine]<contradicts:bags-under-eyes>."
"I [check things]<reveals:checking-behavior>."

// Preferred new format
PATIENT
"I [sleep fine](gregory.behavior.sleep-fine)."
```

### Directives

Directives are commands that affect game state or dialogue flow.

#### @pause

```session
@pause 0.5    // Pause for 0.5 seconds
@pause 1      // Pause for 1 second
@pause 2.5    // Pause for 2.5 seconds
```

#### @rapport

```session
@rapport +5   // Increase rapport by 5
@rapport -3   // Decrease rapport by 3
@rapport +10  // Significant rapport gain
```

#### @focus

```session
@focus -10    // Costs 10 focus (player resource)
@focus +5     // Restore 5 focus
```

#### @reveal

```session
@reveal insomnia              // Reveal the insomnia symptom
@reveal checking-behavior     // Reveal checking behavior
@reveal fear-of-judgment      // Reveal fear of judgment
```

#### @unlock

```session
@unlock deeper_discussion     // Unlock a new dialogue block
@unlock family_history        // Allow access to family topics
```

#### @set

```session
@set admitted_sleep_issues = true    // Boolean
@set trust_level = 3                 // Number
@set patient_name = "Gregory"        // String
@set breakthrough_potential = true   // Flag for special content
```

#### @trigger

```session
// Trigger breakthrough when keyword + symptom combine
@trigger kw-trouble-sleeping + insomnia
```

### Control Flow

#### Conditional Blocks

```session
@if rapport >= 50
    PATIENT (vulnerable)
    "I can tell you the truth now..."
    
    @rapport +5
@elseif rapport >= 30
    PATIENT (hesitant)
    "Well, maybe I can share a little..."
    
    @rapport +2
@else
    PATIENT (guarded)
    "I'd rather not discuss that."
    
    @rapport -1
@endif
```

#### Condition Operators

| Operator | Meaning |
|----------|---------|
| `>=` | Greater than or equal |
| `<=` | Less than or equal |
| `>` | Greater than |
| `<` | Less than |
| `==` | Equal to |
| `!=` | Not equal to |
| `&&` | Logical AND |
| `\|\|` | Logical OR |
| `!` | Logical NOT |

#### Available Variables in Conditions

| Variable | Description |
|----------|-------------|
| `rapport` | Current rapport level (0-100) |
| `focus` | Current focus points |
| `turn` | Current turn number |
| `breakthroughs` | Number of breakthroughs achieved |

#### Condition Functions

```session
@if has_symptom("insomnia")
    PATIENT
    "As I mentioned, the sleep issues..."
@endif

@if has_keyword("kw-trouble-sleeping")
    // Player collected this keyword
@endif

@if has_breakthrough("insomnia-admission")
    // This breakthrough was achieved
@endif

@if asked_about("sleep")
    // Player asked about sleep topic
@endif
```

#### Block Jumps

```session
=== START ===
PATIENT
"Hello, doctor."

-> greeting_response    // Jump to another block

=== greeting_response ===
PATIENT
"Where should we begin?"
```

---

## Response Handlers

Response handlers are triggered when the player selects a conversation topic.

### Basic Response Handler

```session
=== @response:sleep.quality ===
NARRATOR
*Gregory's hand moves toward the dark circles under his eyes.*

@if rapport >= 60
    PATIENT (honest)
    "My sleep has been [terrible, actually]."
    
    @rapport +12
    @reveal insomnia
@else
    PATIENT (defensive)
    "It's fine. I sleep fine."
    
    @rapport +1
@endif
```

### Topic Categories

Common topic categories:

- `therapy` - About the therapeutic process
- `sleep` - Sleep patterns and issues
- `social` - Relationships and interactions
- `emotions` - Feelings and inner experience
- `work` - Career and daily responsibilities
- `family` - Background and history
- `self` - Identity and self-perception
- `appearance` - Self-presentation

### Subtopics

```session
=== @response:sleep.quality ===
// How well they sleep

=== @response:sleep.routine ===
// Their bedtime routine

=== @response:sleep.thoughts ===
// What they think about at night
```

---

## Breakthrough System

Breakthroughs are significant narrative moments that occur when specific conditions are met.

### Defining Breakthroughs

```session
=== @breakthrough:insomnia-admission ===
@trigger kw-trouble-sleeping + insomnia

NARRATOR
*Gregory's composure finally cracks. His eyes well up.*

PATIENT (vulnerable)
"I haven't slept properly in months. I was lying before."

PATIENT
"I was afraid you'd think I was weak."

@rapport +25
@set breakthrough_achieved = true
```

### Breakthrough Triggers

Breakthroughs are triggered when:
1. Player collects a specific keyword
2. A specific symptom is revealed
3. Both conditions match a defined trigger

```javascript
// In game code
const result = dialogue.checkBreakthrough('kw-trouble-sleeping', 'insomnia');
if (result) {
    // Breakthrough triggered!
    playBreakthroughAnimation();
}
```

---

## Game State Integration

### Available Game State

The SDNS engine has access to:

```javascript
gameState = {
    rapport: 50,                    // 0-100
    focus: 100,                     // Player resource
    currentTurn: 1,                 // 1-4 typically
    revealedSymptoms: ['anxiety'],  // Array of symptom IDs
    collectedTokens: [],            // Collected keywords
    breakthroughs: [],              // Achieved breakthroughs
}
```

### Game Actions

Actions that SDNS can trigger:

```javascript
actions = {
    changeRapport: (amount, source) => {},
    spendFocus: (amount) => {},
    restoreFocus: (amount) => {},
    revealSymptom: (symptomId) => {},
    unlockDialogue: (blockId) => {},
}
```

---

## Best Practices

### Writing Guidelines

1. **Start guarded, build trust**
   - Low rapport = defensive, hedging responses
   - High rapport = vulnerable, honest sharing
   
2. **Use mood indicators consistently**
   - They guide voice actors and help with UI
   
3. **Place keywords on important revelations**
   - Not every statement needs a keyword
   - Focus on clinically significant information

4. **Structure conditions logically**
   - Higher rapport checks first
   - Always have a fallback (else) branch

### Performance Tips

1. **Keep blocks focused**
   - One topic/moment per block
   - Use jumps for long sequences
   
2. **Preload dialogue**
   ```javascript
   const dialogues = await preloadPatientDialogue('gregory', 4);
   ```

3. **Use response handlers for branching**
   - Cleaner than massive if/else trees

### Common Patterns

#### The Hedge Pattern

```session
@if rapport >= 50
    PATIENT (honest)
    "Yes, I [do have trouble] with that."
@elseif rapport >= 30
    PATIENT (hedging)
    "Maybe. Sometimes. I'm not sure."
@else
    PATIENT (defensive)
    "No, I don't think so."
@endif
```

#### Progressive Revelation

```session
=== @response:topic.first ===
PATIENT
"I worry sometimes..."

@unlock topic.deeper

=== @response:topic.deeper ===
// Only available after first was asked
PATIENT
"Actually, I worry constantly..."

@reveal chronic-worry
```

---

## API Reference

### Parser Module

```javascript
import { parseDialogue, Lexer, Parser, TokenType } from '../sdns';

// Parse a string
const ast = parseDialogue(source);

// Low-level access
const lexer = new Lexer(source);
const tokens = lexer.tokenize();
const parser = new Parser(tokens);
const ast = parser.parse();
```

### Engine Module

```javascript
import { DialogueEngine, createDialogueEngine } from '../sdns';

const engine = new DialogueEngine(gameState, actions);
engine.loadDialogue(source);
engine.startBlock('START');

// Execute dialogue
let result;
while ((result = engine.executeNext())) {
    if (result.type === 'speech') {
        displaySpeech(result);
    }
}

// Handle player response
engine.handleResponse('sleep', 'quality');

// Check for breakthrough
engine.checkBreakthrough('kw-keyword', 'symptom-id');
```

### useDialogue Hook

```javascript
import { useDialogue } from '../sdns';

const {
    // State
    currentSpeech,      // Current speech object
    speechQueue,        // Queued speeches
    isPlaying,          // Is dialogue active
    isPaused,           // Is paused
    currentKeywords,    // Keywords in current speech
    dialogueHistory,    // All shown speeches
    
    // Actions
    loadDialogue,       // Load from string
    startBlock,         // Start a block
    advance,            // Next speech
    handleResponse,     // Player topic selection
    checkBreakthrough,  // Check for breakthrough
    reset,              // Reset state
} = useDialogue(gameState, actions);
```

### Loader Module

```javascript
import { 
    loadSessionDialogue,
    loadDialogueConfig,
    loadPatientConfig,
    getPatientList,
    preloadPatientDialogue,
} from '../sdns';

// Load a specific turn
const source = await loadSessionDialogue('gregory', 1);

// Get all patients
const patients = await getPatientList();

// Preload all turns
const allDialogue = await preloadPatientDialogue('gregory', 4);
```

---

## Examples

### Complete Turn 1 Structure

```session
// ============================================
// Patient: Example Patient
// Turn: 1 - Initial Assessment
// ============================================

=== START ===
NARRATOR
*The patient enters and takes a seat.*

PATIENT (nervous)
"Hello. Thank you for seeing me."

@pause 0.5

PATIENT
"I'm not really sure where to start."

-> reason_for_visit

=== reason_for_visit ===
PATIENT (hesitant)
"I've been having some [difficulties] lately."

@if rapport >= 30
    PATIENT
    "They've been [building up] for a while."
@else
    PATIENT (guarded)
    "Nothing too serious, probably."
@endif

// Response handlers follow...

=== @response:therapy.reason ===
@if rapport >= 40
    PATIENT (thoughtful)
    "Why am I here? Good question."
    
    PATIENT
    "I've been [struggling] with some things."
    
    @rapport +5
    @reveal initial-distress
@else
    PATIENT (defensive)
    "I outlined it in my intake form."
    
    @rapport +1
@endif

=== @response:sleep.quality ===
@if rapport >= 60
    PATIENT (honest)
    "Terrible. I [barely sleep anymore]."
    
    @rapport +10
    @reveal insomnia
@elseif rapport >= 30
    PATIENT (hedging)
    "It's... complicated."
@else
    PATIENT (defensive)
    "I sleep fine."
@endif
```

---

## Troubleshooting

### Common Issues

**Dialogue not loading:**
- Check file path matches pattern: `/src/patients/{id}/dialogue/turn{n}.session`
- Verify JSON configs are valid

**Keywords not highlighting:**
- Ensure brackets are used: `[keyword text]`
- Check for typos in bracket characters

**Conditions not working:**
- Verify variable names are correct
- Check operator syntax (use `>=` not `=>`}
- Ensure @endif closes all @if blocks

**HMR not updating:**
- Try hard refresh (Ctrl+Shift+R)
- Check dev server console for errors
- Verify file is saved

---

## Version History

### 1.0.0 (Current)
- Initial release
- Full parser implementation
- React hook integration
- HMR support
- Breakthrough system
- Response handlers

---

*SDNS is part of the See You Next Session game project.*
*For questions or contributions, see the main project repository.*
