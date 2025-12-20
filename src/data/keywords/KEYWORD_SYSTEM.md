# SDNS Keyword System

## Overview

The keyword system provides structured data definitions for interactive keywords in dialogue files. Keywords are clickable/collectable elements that reveal information about the patient and advance the player's understanding.

## Syntax

### New Linked Format (Recommended)

```sdns
PATIENT (nervous)
"I've been feeling [anxious]<keyword:generic.emotion.anxious> for [months, actually]<keyword:gregory.time.monthsActually>."
```

Format: `[display text]<keyword:source.category.keywordId>`

- **display text**: What appears in the dialogue
- **source**: `generic` for universal keywords, or patient ID (e.g., `gregory`)
- **category**: Keyword category (time, emotion, behavior, cognition, relationship, background)
- **keywordId**: Specific keyword identifier

### Text Animations

Apply animations to text for emphasis:

```sdns
PATIENT (distressed)
"I just feel so [terrified]<anim:shake> all the time."
```

Available animations:
| Animation | Effect | Use Case |
|-----------|--------|----------|
| `shake` | Subtle trembling | Distress, fear, emphasis |
| `pulse` | Gentle scale pulse | Important revelations |
| `glow` | Soft glow effect | Breakthroughs, insights |
| `fade` | Fade in | Gradual reveals |
| `highlight` | Flash highlight | Drawing attention |
| `wiggle` | Small wiggle | Nervous, uncertain |

Combine with keywords:
```sdns
"I can't [trust my own perception]<keyword:gregory.cognition.trustPerception><anim:pulse>."
```

### Legacy Formats (Still Supported)

```sdns
// Simple (auto-generated keyword)
[keyword text]

// Category reference
[keyword text](category.identifier)

// Patient-specific reference
[keyword text](gregory.time.monthsActually)

// With metadata
[keyword text]<symptom:anxiety>
```

## Keyword Definition Files

The system supports two file formats: JSON (`.keywords.json`) and SDNS-native (`.keys`).

### File Locations

```
src/data/keywords/definitions/
    generic.keywords.json    # Universal keywords (JSON format)
    gregory.keywords.json    # Gregory-specific (JSON format)
    keyword-schema.json      # JSON Schema for validation

src/patients/[patient]/
    [patient].keys           # SDNS-native format (recommended)
```

### JSON Format (.keywords.json)

```json
{
    "$schema": "./keyword-schema.json",
    "source": "gregory",
    "displayName": "Gregory Vigil Keywords",
    "description": "Keywords specific to Gregory's presentation",
    "version": "1.0.0",
    "patientInfo": {
        "name": "Gregory Vigil",
        "diagnosis": "Generalized Anxiety Disorder",
        "keyTraits": ["hedging", "perfectionism"]
    },
    "keywords": {
        "time": {
            "_category": {
                "label": "Time References",
                "icon": "calendar",
                "description": "Time-related keywords"
            },
            "monthsActually": {
                "id": "gregory.time.monthsActually",
                "displayText": "Months, actually",
                "aliases": ["months actually", "a few months now"],
                "description": "Gregory reveals the true duration",
                "importance": "high",
                "style": {
                    "color": "#6b7fd7",
                    "bgColor": "rgba(107, 127, 215, 0.18)",
                    "icon": "calendar"
                },
                "effects": {
                    "focusCost": 5,
                    "reveals": ["symptom-duration"],
                    "rapportChange": 3
                },
                "menuOptions": [
                    {
                        "id": "note-duration",
                        "label": "Note: Duration",
                        "icon": "edit-3",
                        "action": "note"
                    }
                ],
                "note": "First admission of duration"
            }
        }
    },
    "menuOptions": {
        "default": [...],
        "contradiction": [...],
        "breakthrough": [...]
    }
}
```

### SDNS-Native Format (.keys)

The `.keys` format uses SDNS-like syntax for consistency with `.session` files:

```keys
// gregory.keys - Gregory Vigil Keywords
===META===

source: "gregory"
displayName: "Gregory Vigil Keywords"
version: "1.0.0"

===KEYWORDS===

// Time-related keywords
[time.monthsActually] {
    category: time
    displayText: "Months, actually"
    aliases: ["months actually", "a few months now"]
    description: "Gregory reveals the true duration"
    importance: high
    note: "First admission"
    
    style: {
        color: "#6b7fd7"
        bgColor: "rgba(107, 127, 215, 0.18)"
        icon: "calendar"
    }
    
    effects: {
        focusCost: 5
        reveals: ["symptom-duration"]
        rapportChange: 3
    }
    
    menuOptions: [
        {
            id: "note-duration"
            label: "Note: Duration"
            icon: "edit-3"
            action: "note"
        }
    ]
}

===ACTIONS===

@askAbout.therapy.delay {
    label: "Ask About Waiting"
    description: "Ask why they waited to seek help"
    
    dialogueOptions: [
        {
            text: "What made you decide to finally come in?"
            response: "I guess things got bad enough..."
            mood: "hesitant"
            effects: {
                rapportChange: 2
                focusCost: 5
            }
        }
    ]
}

===ANIMATIONS===

@shake {
    type: "shake"
    duration: 500
    intensity: 3
    easing: "ease-in-out"
    description: "Subtle shake for distress"
}

@pulse {
    type: "pulse"
    duration: 1000
    scale: 1.1
    description: "Gentle pulse for revelations"
}
```

### .keys File Sections

| Section | Purpose |
|---------|---------|
| `===META===` | File metadata (source, displayName, version) |
| `===KEYWORDS===` | Keyword definitions with `[category.id]` syntax |
| `===ACTIONS===` | Action definitions with `@actionId` syntax |
| `===ANIMATIONS===` | Animation definitions with `@animId` syntax |

## Importance Levels

| Level | Description | Visual | Use |
|-------|-------------|--------|-----|
| `low` | Supplementary info | Gray | Background details |
| `medium` | Relevant observation | Yellow | Standard findings |
| `high` | Important symptom | Orange | Key diagnostic info |
| `critical` | Safety/breakthrough | Red | Must-collect items |

## Effects System

```json
{
    "effects": {
        "focusCost": 5,           // Focus points consumed when collected
        "rapportChange": 3,       // Rapport modification (+/-)
        "reveals": ["anxiety"],   // Things revealed in notebook
        "triggers": ["event-id"], // Events triggered
        "contradicts": ["obs-1"], // Observations this contradicts
        "unlocks": ["topic-1"],   // Topics/features unlocked
        "setVars": {              // Variables to set
            "admitted_duration": true
        }
    }
}
```

## VS Code IntelliSense

The VS Code extension provides:

1. **Source Completion**: After `<keyword:` shows available sources
2. **Category Completion**: After `<keyword:gregory.` shows categories
3. **Keyword Completion**: After `<keyword:gregory.time.` shows keywords
4. **Hover Info**: Shows keyword details on hover
5. **Commands**:
   - `SDNS: Reload Keyword Definitions` - Refresh keyword files
   - `SDNS: Show Keyword Info` - View keyword details

## Game Integration

### Loading Keywords

```javascript
import { initKeywordParser, parseKeywords } from '../sdns';

// Initialize at app startup
await initKeywordParser();

// Parse dialogue text
const keywords = parseKeywords(dialogueText, { patientId: 'gregory' });

// Each keyword includes:
// - displayText: What to show
// - referenceId: Full keyword ID
// - keyword: Complete keyword object with style, effects, menuOptions
// - isLinked: true for new format
```

### Rendering Keywords

```javascript
import { renderKeywords, getKeywordLoader } from '../sdns';

const loader = getKeywordLoader();

// Replace keyword syntax with HTML
const html = loader.renderKeywords(text, (keyword, displayText, id) => {
    const style = keyword?.style || {};
    return `<span class="keyword" data-id="${id}" style="color: ${style.color}">
        ${displayText}
    </span>`;
});
```

## Categories

| ID | Label | Icon | Description |
|----|-------|------|-------------|
| `time` | Time & Duration | calendar | Temporal references |
| `emotion` | Emotions | heart | Emotional expressions |
| `behavior` | Behaviors | activity | Observable behaviors |
| `symptom` | Symptoms | alert-circle | Physical/mental symptoms |
| `relationship` | Relationships | users | Interpersonal references |
| `cognition` | Thoughts & Beliefs | brain | Cognitive patterns |
| `background` | Background | book | History & context |

## Adding New Keywords

1. Open the appropriate `.keywords.json` file
2. Add keyword under the relevant category
3. Run `SDNS: Reload Keyword Definitions` in VS Code
4. Use in dialogue: `[text]<keyword:source.category.id>`

## Safety Keywords

Keywords marked with `"safety": true` require special handling:
- Always shown to player
- May trigger safety protocols in game
- Examples: suicidal ideation, self-harm references
