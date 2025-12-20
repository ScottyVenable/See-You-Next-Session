---
applyTo: "**"
---

# See You Next Session - Development Instructions

> **Last Updated:** December 20, 2025  
> **Version:** 2.0 - Comprehensive Update

This document provides comprehensive guidelines for AI assistants and contributors working on this project.

---

## Project Overview

**See You Next Session** is a narrative simulation/puzzle game where players act as mental health professionals diagnosing patients by identifying contradictions between dialogue and physical presentation.

### Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React 18 + Vite | Functional components, hooks |
| Native App | Tauri 2 | Windows/macOS/Linux builds |
| Styling | CSS + Styled Components | Component-scoped styles |
| Animation | Motion (Framer Motion) | Spring-based animations |
| Dialogue | SDNS | Custom scripting language |
| State | React Context | GameContext for global state |
| Art | Clip Studio Paint | 2D sprites |
| Audio | FL Studio | Sound effects, music |

### Current MVP Focus

**Primary Goal:** Complete Gregory (tutorial patient) with all 4 turns playable.

**Do NOT work on:**
- Additional patients beyond Gregory
- Skill tree/progression systems
- Multiplayer features
- Mobile optimization
- Advanced settings menus

See `Documents/planning/MVP_SCOPE.md` for full scope definition.

---

## Critical Rules

### 1. Terminal Usage

**NEVER run commands in the "DEV SERVER" terminal.**

The "DEV SERVER" terminal is exclusively reserved for running the game's development server (`npm run dev` or `npm run tauri dev`). It should not be used for:
- Installing packages (`npm install`)
- Running scripts
- Git commands
- File operations
- Any other terminal operations

Always use a separate terminal instance (PowerShell, bash, etc.) for all other commands.

### 2. No Emojis in Code

**Do NOT use emojis in code comments or documentation files.**

Emojis can cause:
- Encoding issues across different environments
- Display problems in various text editors
- Parsing issues in some build tools

| Context | Emojis Allowed? |
|---------|-----------------|
| Code comments | NO |
| JSDoc annotations | NO |
| Variable/function names | NO |
| Markdown documentation | NO |
| UI display strings (user-facing) | YES |
| Commit messages | NO |

```javascript
// BAD - emoji in comment
// TODO: Fix this bug 🐛

// GOOD - plain text comment
// TODO: Fix this bug

// AVOID EMOJIS IN GAME UI, PREFER PHOSPHER ICONS OR MATERIAL ICONS
```

### 3. MVP Mindset

Before implementing ANY feature, ask:
1. Is this required for Gregory's session to be playable?
2. Can we ship without this?
3. Will this take more than 1 day?

If the answer suggests scope creep, **defer the feature**.

### 4. Mental Health Sensitivity

This game handles mental health topics. Always:
- Use clinical, respectful language
- Avoid stigmatizing terminology
- Never mock or caricature mental illness
- Ensure content could be reviewed by a mental health professional

---

## Project Structure

```
src/
├── components/
│   ├── game/           # Gameplay components
│   │   ├── DialogueBox.jsx
│   │   ├── Clipboard.jsx
│   │   ├── Handbook.jsx
│   │   ├── SynthesisZone.jsx
│   │   ├── PatientView.jsx
│   │   ├── FocusMeter.jsx
│   │   └── TurnClock.jsx
│   ├── screens/        # Full-page views
│   │   ├── MainMenu.jsx
│   │   ├── GameScreen.jsx
│   │   ├── PatientSelect.jsx
│   │   └── SessionReport.jsx
│   └── ui/             # Reusable UI primitives
│       ├── DevConsole.jsx
│       └── ErrorBoundary.jsx
│
├── context/
│   ├── GameContext.jsx     # Global game state
│   └── UIContext.jsx       # UI-specific state
│
├── data/
│   ├── disorders.js        # Disorder definitions
│   ├── symptoms.js         # Symptom definitions
│   ├── keywords/           # Keyword system
│   │   ├── definitions/
│   │   └── styles/
│   └── patients/           # Patient metadata
│
├── patients/               # Patient content
│   └── gregory/
│       ├── dialogue/
│       │   └── gregory_1.session
│       ├── patient_config.json
│       └── gregory.keys
│
├── sdns/                   # Dialogue scripting system
│   ├── parser.js
│   ├── engine.js
│   ├── loader.js
│   ├── keyword-parser.js
│   └── SDNS_REFERENCE.md
│
├── styles/
│   ├── main.css
│   ├── keywords/           # Keyword styling
│   └── [component].css
│
└── utils/
    ├── ErrorHandler.js     # Centralized logging
    ├── SaveManager.js
    └── SoundManager.js
```

---

## Coding Standards

### React Components

```javascript
// Standard component template
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

import { useGame } from '../../context/GameContext.jsx';
import { errorHandler, ErrorLevel } from '../../utils/ErrorHandler.js';

import './component-name.css';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props
 * @param {string} props.prop1 - Description
 * @param {function} props.onAction - Callback description
 */
function ComponentName({ prop1, onAction }) {
    const { gameState, actions } = useGame();
    const [localState, setLocalState] = useState(null);
    
    useEffect(() => {
        // Setup logic
        return () => {
            // Cleanup logic
        };
    }, []);
    
    const handleAction = useCallback(() => {
        try {
            // Action logic
            onAction?.();
        } catch (error) {
            errorHandler.ui('Action failed', ErrorLevel.ERROR, { error });
        }
    }, [onAction]);
    
    return (
        <div className="component-name">
            {/* JSX content */}
        </div>
    );
}

export default ComponentName;
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.jsx | `DialogueBox.jsx` |
| Hooks | use + PascalCase.js | `useDialogue.js` |
| Utilities | PascalCase.js | `ErrorHandler.js` |
| Styles | kebab-case.css | `dialogue-box.css` |
| Data files | kebab-case.js | `disorders.js` |
| SDNS files | patientId_N.session | `gregory_1.session` |
| Keywords files | patientId.keys | `gregory.keys` |
| Constants | SCREAMING_SNAKE | `MAX_FOCUS` |

### Import Order

```javascript
// 1. React core
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';

// 3. Internal contexts/hooks
import { useGame } from '../../context/GameContext.jsx';
import { useDialogue } from '../../sdns/useDialogue.js';

// 4. Internal utilities
import { errorHandler } from '../../utils/ErrorHandler.js';

// 5. Internal components
import ChildComponent from './ChildComponent.jsx';

// 6. Styles (always last)
import './component.css';
```

### CSS Standards

```css
/* Use BEM-like naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Use CSS custom properties for theming */
.keyword {
    --keyword-color: var(--category-color, #888);
    color: var(--keyword-color);
}

/* Mobile-first responsive */
.component {
    /* Base mobile styles */
}

@media (min-width: 768px) {
    .component {
        /* Tablet+ */
    }
}
```

---

## SDNS (Session Dialogue and Narration System)

---

## SDNS (Session Dialogue and Narration System)

The game uses a custom dialogue scripting language for all patient conversations.

### Key Files

| File | Purpose |
|------|---------|
| `src/sdns/parser.js` | Parses .session files into AST |
| `src/sdns/engine.js` | Executes parsed dialogue |
| `src/sdns/loader.js` | Loads session files |
| `src/sdns/keyword-parser.js` | Extracts keywords from text |
| `src/sdns/SDNS_REFERENCE.md` | Full language specification |

### Basic Syntax

```sdns
=== START ===
NARRATOR
*Scene description with %observable symptoms%<symptom:symptom_id>.*

PATIENT (mood)
"Dialogue with [keyword text]<keyword:source.category.id>."

@if rapport >= 50
    PATIENT (vulnerable)
    "High rapport dialogue."
@else
    PATIENT (guarded)
    "Low rapport dialogue."
@endif

-> next_block

=== next_block ===
// Continue dialogue...
```

### Keyword Syntax

```sdns
// Basic keyword
[display text]<keyword:patientId.category.id>

// With animation
[text]<keyword:id><anim:pulse>

// With style
[text]<keyword:id><style:category.preset>

// With contradiction marker
[text]<keyword:id><contradicts:symptom_id>

// Symptom observation (visual token)
%observable detail%<symptom:symptom_id>
```

### Moods

Valid moods for speakers: `neutral`, `guarded`, `nervous`, `hesitant`, `vulnerable`, `defensive`, `thoughtful`, `seeking validation`

---

## Error Handling

Use the centralized error handler for all error logging:

```javascript
import { errorHandler, ErrorLevel, ErrorCategory } from '../utils/ErrorHandler.js';

// Category-specific methods
errorHandler.sdns('Block not found', ErrorLevel.WARN, { blockName });
errorHandler.patient('Config missing', ErrorLevel.ERROR, { patientId });
errorHandler.ui('Render failed', ErrorLevel.CRITICAL, { component });
errorHandler.dialogue('Parse error', ErrorLevel.ERROR, { line });

// Generic logging
errorHandler.log('Message', ErrorLevel.INFO, ErrorCategory.GENERAL, { data });
```

### Error Levels

| Level | Use Case |
|-------|----------|
| `DEBUG` | Development only information |
| `INFO` | General information |
| `WARN` | Recoverable issues |
| `ERROR` | Failures that impact functionality |
| `CRITICAL` | Game-breaking errors |

### Categories

`DIALOGUE`, `SDNS`, `PATIENT`, `SAVE`, `AUDIO`, `UI`, `GAME_STATE`, `NETWORK`, `GENERAL`

---

## GameContext State

```javascript
import { useGame } from '../../context/GameContext.jsx';

function MyComponent() {
    const { gameState, actions } = useGame();
    
    // Access state
    const { focus, rapport, currentPatient, textTokens, visualTokens } = gameState;
    
    // Modify state
    actions.spendFocus(15);
    actions.adjustRapport(10);
    actions.addToken({ id, type, content });
    actions.attemptSynthesis(textToken, visualToken);
}
```

---

## Testing and Development

### Running the Game

```bash
# Development (web) - opens at localhost:5173
npm run dev

# Development (Tauri desktop app)
npm run tauri dev

# Build for production
npm run build
npm run tauri build
```

### Dev Console

Press `~` (tilde) in-game to open the developer console.

| Command | Description |
|---------|-------------|
| `help` | List all commands |
| `focus [0-100]` | Set focus level |
| `rapport [0-100]` | Set rapport level |
| `screen [name]` | Switch screens (menu, game, select, report) |
| `patient [id]` | Load patient by ID |
| `clear` | Clear console output |

### Testing Checklist

Before submitting changes:
- [ ] Game loads without console errors
- [ ] Dialogue flows work correctly
- [ ] Keywords are clickable and collectible
- [ ] Focus/rapport changes work
- [ ] Save/load functions work
- [ ] No visual regressions

---

## Key Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Game Design | `Documents/design/GAME_DESIGN_DOCUMENT.md` | Core mechanics, UI |
| Technical Architecture | `Documents/technical/TECHNICAL_ARCHITECTURE.md` | System design |
| SDNS Reference | `src/sdns/SDNS_REFERENCE.md` | Dialogue syntax |
| MVP Scope | `Documents/planning/MVP_SCOPE.md` | What to build |
| Gregory Checklist | `Documents/planning/GREGORY_MVP_CHECKLIST.md` | MVP tasks |
| Best Practices | `Documents/technical/CODEBASE_BEST_PRACTICES.md` | Code standards |
| Testing Guide | `Documents/technical/TESTING_AND_CI_GUIDE.md` | Test setup |

---

## Adding New Features

### Quick Reference

1. **New Component:** `src/components/[category]/ComponentName.jsx`
2. **New Styles:** `src/styles/component-name.css`
3. **New Patient:** `src/patients/[patientId]/` with config, keys, dialogue
4. **New Keywords:** Update patient's `.keys` file
5. **New Utility:** `src/utils/UtilityName.js`

### Before Adding Features

1. Check `Documents/planning/MVP_SCOPE.md` - Is this in scope?
2. Check `Documents/TODO.md` - Is this already planned?
3. Follow patterns in `Documents/technical/CODEBASE_BEST_PRACTICES.md`

---

## Git Workflow

### Branch Naming

```
feature/description    - New features
fix/description        - Bug fixes
refactor/description   - Code improvements
docs/description       - Documentation updates
```

### Commit Format

```
type: Brief description

- Detail 1
- Detail 2
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Version Format

`branch-name-XXXXXXX` (first 7 characters of commit hash)

---

## Performance Guidelines

| Do | Don't |
|----|-------|
| Memoize expensive calculations | Recalculate every render |
| Use `key` props correctly | Use array index as key |
| Clean up effects | Leave subscriptions open |
| Lazy load where appropriate | Import everything upfront |
| Use CSS animations | Animate with JavaScript when CSS works |

---

## Contact

- **Scott** - Programmer/Designer (React/JavaScript)
- **Kiki** - Art Director/Writer (Clip Studio Paint, FL Studio)
