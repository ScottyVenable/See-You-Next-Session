# Codebase Best Practices & Organization Guide

> **Document Type:** Technical Reference  
> **Created:** December 20, 2025  
> **Authors:** Development Team  
> **Status:** Active Reference

---

## 1. Directory Structure Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Separation of Concerns** | Each directory has one clear purpose |
| **Modular Components** | Features are self-contained and reusable |
| **Patient-Centric Content** | Patient data organized by patient ID |
| **Layer Isolation** | UI, logic, and data layers don't mix |

### Current Structure

```
src/
├── components/           # React UI components
│   ├── game/            # Gameplay-specific (Clipboard, DialogueBox, etc.)
│   ├── screens/         # Full-page views (MainMenu, GameScreen, etc.)
│   └── ui/              # Reusable UI primitives (buttons, modals, etc.)
│
├── context/             # React Context providers
│   ├── GameContext.jsx  # Global game state
│   └── UIContext.jsx    # UI-specific state
│
├── data/                # Static data definitions
│   ├── disorders.js     # Disorder definitions
│   ├── symptoms.js      # Symptom definitions
│   ├── keywords/        # Keyword system data
│   ├── menu-options/    # Dialogue menu options
│   └── patients/        # Patient metadata
│
├── patients/            # Patient content (dialogue, config)
│   └── {patientId}/     # Per-patient folder
│       ├── dialogue/    # Session files
│       ├── patient_config.json
│       └── {patientId}.keys
│
├── sdns/                # Dialogue scripting system
│   ├── parser.js        # SDNS syntax parser
│   ├── engine.js        # Runtime execution
│   ├── loader.js        # File loading
│   └── vscode-extension/# Editor support
│
├── styles/              # CSS stylesheets
│   ├── main.css         # Global styles
│   ├── keywords/        # Keyword-specific styles
│   └── {component}.css  # Component-specific styles
│
└── utils/               # Utility modules
    ├── ErrorHandler.js  # Centralized error handling
    ├── SaveManager.js   # Save/load game state
    └── SoundManager.js  # Audio management
```

---

## 2. Adding New Features

### Checklist for New Features

1. **Identify the layer** - Is this UI, logic, or data?
2. **Find existing patterns** - Look at similar implementations
3. **Create in appropriate directory** - Follow structure above
4. **Update exports** - Add to `index.js` files where applicable
5. **Add styles** - Create CSS file if component needs styles
6. **Document** - Update relevant docs if significant

### Adding a New Component

```javascript
// src/components/game/NewFeature.jsx

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { errorHandler, ErrorCategory } from '../../utils/ErrorHandler.js';

import './new-feature.css';  // Create matching CSS file

/**
 * NewFeature - Brief description of what this component does
 * 
 * Props:
 *   - prop1: Description of prop1
 *   - prop2: Description of prop2
 */
function NewFeature({ prop1, prop2 }) {
    const { gameState, actions } = useGame();
    const [localState, setLocalState] = useState(null);
    
    useEffect(() => {
        // Initialization logic
    }, []);
    
    const handleAction = () => {
        try {
            // Action logic
        } catch (error) {
            errorHandler.ui('NewFeature action failed', 'ERROR', { error });
        }
    };
    
    return (
        <div className="new-feature">
            {/* Component JSX */}
        </div>
    );
}

export default NewFeature;
```

### Adding a New Patient

1. Create patient folder: `src/patients/{patientId}/`
2. Create required files:
   - `dialogue/{patientId}_1.session` - First session dialogue
   - `patient_config.json` - Patient metadata
   - `{patientId}.keys` - Patient-specific keywords

```json
// patient_config.json template
{
    "id": "patient_id",
    "name": "Patient Name",
    "age": 25,
    "disorder": "Disorder Name",
    "difficulty": "easy|medium|hard",
    "sessions": ["session_1"],
    "visualSymptoms": [
        {
            "id": "symptom_id",
            "name": "Symptom Name",
            "hotspot": { "x": 50, "y": 30, "radius": 15 }
        }
    ]
}
```

### Adding a New Utility

```javascript
// src/utils/NewUtility.js

/**
 * NewUtility - Description of utility purpose
 * 
 * Usage:
 *   import { newUtility } from '../utils/NewUtility.js';
 *   newUtility.method(args);
 */

class NewUtility {
    constructor() {
        // Initialization
    }
    
    method(args) {
        // Implementation
    }
}

// Export singleton or class depending on use case
export const newUtility = new NewUtility();
export default NewUtility;
```

---

## 3. Coding Standards

### JavaScript/React

| Standard | Example |
|----------|---------|
| Functional components | `function Component() {}` |
| Hooks for state | `useState`, `useEffect`, `useContext` |
| Destructuring props | `function Component({ prop1, prop2 })` |
| Optional chaining | `object?.property?.nested` |
| Template literals | `` `String with ${variable}` `` |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `DialogueBox.jsx` |
| Hooks | camelCase with `use` prefix | `useDialogue.js` |
| Utilities | PascalCase or camelCase | `ErrorHandler.js` |
| CSS files | kebab-case | `dialogue-box.css` |
| Constants | SCREAMING_SNAKE | `MAX_FOCUS` |
| Variables/functions | camelCase | `handleClick` |

### CSS Standards

```css
/* Component-scoped class naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Use CSS custom properties for theming */
:root {
    --primary-color: #4a90d9;
    --font-size-base: 1rem;
}

/* Mobile-first responsive design */
.component {
    /* Base mobile styles */
}

@media (min-width: 768px) {
    .component {
        /* Tablet+ styles */
    }
}
```

### Import Order

```javascript
// 1. React and core libraries
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// 2. External dependencies
import { someLibrary } from 'some-library';

// 3. Internal contexts and hooks
import { useGame } from '../../context/GameContext.jsx';
import { useDialogue } from '../../sdns/useDialogue.js';

// 4. Internal utilities
import { errorHandler } from '../../utils/ErrorHandler.js';

// 5. Components
import ChildComponent from './ChildComponent.jsx';

// 6. Styles (always last)
import './component.css';
```

---

## 4. Error Handling

### Centralized Error Handler

Always use the centralized error handler for consistency:

```javascript
import { errorHandler, ErrorLevel, ErrorCategory } from '../utils/ErrorHandler.js';

// Available categories:
// DIALOGUE, SDNS, PATIENT, SAVE, AUDIO, UI, GAME_STATE, NETWORK, GENERAL

// Usage examples:
errorHandler.sdns('Block not found', ErrorLevel.WARN, { blockName });
errorHandler.patient('Config missing', ErrorLevel.ERROR, { patientId });
errorHandler.ui('Render failed', ErrorLevel.CRITICAL, { component });

// Generic usage:
errorHandler.log('Something happened', ErrorLevel.INFO, ErrorCategory.GENERAL, { data });
```

### Error Boundaries

Wrap major sections in error boundaries:

```javascript
import { ErrorBoundary } from '../ui/ErrorBoundary.jsx';

<ErrorBoundary fallback={<ErrorFallback />}>
    <ComponentThatMightFail />
</ErrorBoundary>
```

---

## 5. State Management

### GameContext Usage

```javascript
import { useGame } from '../../context/GameContext.jsx';

function MyComponent() {
    const { 
        gameState,      // Current state
        actions         // State modifiers
    } = useGame();
    
    // Access state
    const { focus, rapport, currentPatient } = gameState;
    
    // Modify state
    actions.spendFocus(15);
    actions.addToken(newToken);
}
```

### Local vs Global State

| Use Case | State Type |
|----------|------------|
| Component animation state | Local (`useState`) |
| Form input values | Local (`useState`) |
| Focus/Rapport values | Global (`GameContext`) |
| Current patient | Global (`GameContext`) |
| Collected tokens | Global (`GameContext`) |
| Modal open/closed | Depends on scope |

---

## 6. SDNS Dialogue Files

### File Organization

```
src/patients/{patientId}/
├── dialogue/
│   ├── {patientId}_1.session    # Turn 1 dialogue
│   ├── {patientId}_2.session    # Turn 2 dialogue
│   ├── {patientId}_3.session    # Turn 3 dialogue
│   └── {patientId}_4.session    # Turn 4 dialogue
├── patient_config.json
└── {patientId}.keys
```

### Session File Template

```sdns
// ============================================================================
// Patient: {Patient Name} - {Role/Type}
// Diagnosis: {Expected Diagnosis}
// Phase: Turn {N} - {Phase Description}
// 
// {Brief character description and context}
//
// Key Characteristics:
// - Characteristic 1
// - Characteristic 2
//
// Key Symptoms to Discover:
// - Symptom 1
// - Symptom 2
// ============================================================================

=== START ===
NARRATOR
*Opening narration describing the scene.*

PATIENT (mood)
"Opening dialogue line."

-> next_block

=== next_block ===
// Continue dialogue...
```

---

## 7. Testing Guidelines

### Manual Testing Checklist

- [ ] Dialogue flows correctly through all branches
- [ ] Keywords are clickable and collectible
- [ ] Focus costs deduct properly
- [ ] Rapport changes affect dialogue options
- [ ] Synthesis produces correct results
- [ ] UI scales on different screen sizes
- [ ] No console errors during gameplay

### Dev Console Commands

Use the in-game dev console (~ key) for testing:

```
help            - List all commands
focus [amount]  - Set focus level
rapport [amt]   - Set rapport level
screen [name]   - Switch screens
patient [id]    - Load patient
```

---

## 8. Performance Considerations

### Best Practices

| Do | Don't |
|----|-------|
| Memoize expensive calculations | Recalculate on every render |
| Use `key` props in lists | Use array index as key |
| Lazy load large components | Import everything at start |
| Debounce rapid events | Fire events on every keystroke |
| Clean up effects | Leave subscriptions open |

### Example Optimization

```javascript
import React, { useMemo, useCallback } from 'react';

function OptimizedComponent({ items, onSelect }) {
    // Memoize expensive computation
    const processedItems = useMemo(() => {
        return items.map(item => expensiveProcess(item));
    }, [items]);
    
    // Memoize callback
    const handleSelect = useCallback((id) => {
        onSelect(id);
    }, [onSelect]);
    
    return (
        <ul>
            {processedItems.map(item => (
                <li key={item.id} onClick={() => handleSelect(item.id)}>
                    {item.name}
                </li>
            ))}
        </ul>
    );
}
```

---

## 9. Documentation Requirements

### When to Document

- New systems or features
- Complex logic that isn't self-explanatory
- API contracts between modules
- Breaking changes
- Setup/configuration requirements

### Documentation Locations

| Type | Location |
|------|----------|
| Feature overview | `Documents/design/` |
| Technical specs | `Documents/technical/` |
| Content guidelines | `Documents/content/` |
| API reference | JSDoc in source files |
| Quick reference | `README.md` in relevant folder |

---

## 10. Git Workflow

### Branch Naming

```
feature/description    - New features
fix/description        - Bug fixes
refactor/description   - Code improvements
docs/description       - Documentation updates
```

### Commit Message Format

```
type: Brief description (50 chars max)

- Detail 1
- Detail 2

Refs: #issue-number (if applicable)
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

---

## Related Documents

- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Copilot Instructions](../../.github/instructions/copilot-instructions.md)
