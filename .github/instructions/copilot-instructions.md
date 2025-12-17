---
applyTo: "**"
---

# See You Next Session - Development Instructions

This document provides comprehensive guidelines for AI assistants and contributors working on this project.

## Project Overview

**See You Next Session** is a narrative simulation/puzzle game where players act as mental health professionals diagnosing patients by identifying contradictions between dialogue and physical presentation.

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Native App | Tauri 2 (Windows/macOS/Linux) |
| Styling | CSS modules + custom styles |
| Animation | Framer Motion |
| Dialogue System | SDNS (Session Dialogue and Narration System) |
| Art | Clip Studio Paint (2D sprites) |
| Audio | FL Studio |

---

## Critical Rules

### Terminal Usage

**NEVER run commands in the "DEV SERVER" terminal.**

The "DEV SERVER" terminal is exclusively reserved for running the game's development server (`npm run dev` or `npm run tauri dev`). It should not be used for:
- Installing packages
- Running scripts
- Git commands
- Any other terminal operations

Always use a separate terminal instance (PowerShell, bash, etc.) for all other commands.

### No Emojis in Code Comments

**Do NOT use emojis in code comments or documentation files.**

Emojis can cause:
- Encoding issues across different environments
- Display problems in various text editors
- Parsing issues in some build tools

**Allowed:** Emojis in UI display strings (JSX content rendered to users)
**Forbidden:** Emojis in code comments, JSDoc, variable names, or markdown documentation

```javascript
// BAD - emoji in comment
// TODO: Fix this bug 🐛

// GOOD - plain text comment
// TODO: Fix this bug

// ALLOWED - emoji in UI display (user-facing content)
<span className="icon">{'🔧'}</span>
```

---

## Project Structure

```
src/
  components/
    game/          - Game-specific components (DialogueBox, Clipboard, etc.)
    screens/       - Full-screen views (MainMenu, GameScreen, etc.)
    ui/            - Reusable UI components (DevConsole, ErrorBoundary, etc.)
  context/         - React contexts (GameContext)
  data/            - Static game data (patients, disorders, keywords)
  dialogue/        - Legacy dialogue system (being replaced by SDNS)
  patients/        - Patient-specific content (dialogue files, configs)
  sdns/            - Session Dialogue and Narration System
  styles/          - CSS stylesheets
  utils/           - Utility modules (ErrorHandler, SaveManager, etc.)
```

---

## Coding Standards

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use the GameContext for global state management
- Follow existing patterns in `/src/components`

```javascript
// Component template
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';

function ComponentName({ prop1, prop2 }) {
    const { gameState, actions } = useGame();
    
    // Component logic...
    
    return (
        <div className="component-name">
            {/* JSX content */}
        </div>
    );
}

export default ComponentName;
```

### File Naming

- Components: `PascalCase.jsx`
- Utilities: `camelCase.js` or `PascalCase.js` for classes
- Styles: `kebab-case.css`
- Data files: `kebab-case.js`
- SDNS files: `turnN.session`

### Imports

- Use relative imports within the same module
- Use absolute imports from `src/` for cross-module imports
- Group imports: React, external libs, internal modules, styles

```javascript
// Import order
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { useGame } from '../../context/GameContext.jsx';
import { errorHandler, ErrorCategory } from '../../utils/ErrorHandler.js';

import './component-styles.css';
```

---

## SDNS (Session Dialogue and Narration System)

The game uses a custom dialogue scripting language. Key files:
- `src/sdns/parser.js` - Parses .session files
- `src/sdns/engine.js` - Executes dialogue logic
- `src/sdns/loader.js` - Loads dialogue files
- `src/sdns/SDNS_REFERENCE.md` - Full language specification

### Basic SDNS Syntax

```sdns
===START===
GREGORY: "Hello, doctor."
@mood nervous
-> RESPONSE_OPTIONS

===RESPONSE_OPTIONS===
? "How are you feeling?"
    -> FEELING_RESPONSE
? "Tell me about yourself."
    -> INTRO_RESPONSE
```

---

## Error Handling

Use the centralized error handler for all error logging:

```javascript
import { errorHandler, ErrorLevel, ErrorCategory } from '../utils/ErrorHandler.js';

// Log errors by category
errorHandler.sdns('Block not found', ErrorLevel.WARN, { blockName });
errorHandler.patient('Config missing', ErrorLevel.ERROR, { patientId });
errorHandler.ui('Render failed', ErrorLevel.CRITICAL, { component });
```

Categories: `DIALOGUE`, `SDNS`, `PATIENT`, `SAVE`, `AUDIO`, `UI`, `GAME_STATE`, `NETWORK`, `GENERAL`

---

## Testing and Development

### Running the Game

```bash
# Development (web)
npm run dev

# Development (Tauri desktop app)
npm run tauri dev

# Build for production
npm run build
npm run tauri build
```

### Dev Console

Press `~` (tilde) in-game to open the developer console. Available commands:
- `help` - List all commands
- `focus [amount]` - Set focus level
- `rapport [amount]` - Set rapport level
- `screen [name]` - Switch screens
- `patient [id]` - Load patient

---

## Key Documents

Reference these files for project context:
- `Documents/Game_Design_Document.md` - Core mechanics and UI design
- `Documents/Technical_Architecture.md` - System architecture
- `Documents/TODO.md` - Current tasks and roadmap
- `src/sdns/SDNS_REFERENCE.md` - Dialogue system documentation

---

## MVP Mindset

This is an indie project with limited resources. When implementing features:

1. **Simplest solution first** - Get it working before optimizing
2. **Minimize art requirements** - Suggest reusable sprite layers
3. **Stay in scope** - Check if features fit MVP before implementing
4. **Sensitivity matters** - Mental health topics require respectful, clinical language

---

## Git Workflow

- Branch naming: `feature/description`, `fix/description`, `refactor/description`
- Commit messages: Clear, concise descriptions of changes
- Version format: `branch-name-XXXXXXX` (first 7 chars of commit hash)

---

## Contact

- **Scott** - Programmer/Designer (React/JavaScript)
- **Kiki** - Art Director/Writer (Clip Studio Paint, FL Studio)
