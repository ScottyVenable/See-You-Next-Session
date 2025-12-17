# Technical Architecture

> **Document Type:** Technical Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Authors:** Scott (Lead Developer)  
> **Status:** Active Development

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.10 |
| **Desktop Runtime** | Tauri | 2.x |
| **Animation** | Motion (Framer Motion) | 12.23.26 |
| **Icons** | Phosphor Icons | 2.1.10 |
| **Styling** | Styled Components + CSS | 6.1.19 |
| **Language** | JavaScript/JSX | ES2022 |

---

## 2. Project Structure

```
src/
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point
├── index.html                 # HTML template
│
├── assets/                    # Static assets
│   ├── fonts/
│   │   ├── body/
│   │   └── header/
│   └── ASSET_GUIDE.md
│
├── components/
│   ├── game/                  # Gameplay components
│   │   ├── Clipboard.jsx      # Token storage UI
│   │   ├── DialogueBox.jsx    # Patient dialogue display
│   │   ├── DialogueController.jsx
│   │   ├── DialogueSelector.jsx  # Topic selection UI
│   │   ├── FocusMeter.jsx     # Focus resource display
│   │   ├── Handbook.jsx       # Disorder reference book
│   │   ├── PatientView.jsx    # Patient sprite + hotspots
│   │   ├── RapportMeter.jsx   # Relationship meter
│   │   ├── SynsDialogueBox.jsx # SDNS-powered dialogue
│   │   ├── SynthesisZone.jsx  # Contradiction matching
│   │   └── TurnClock.jsx      # Session timer
│   │
│   ├── screens/               # Full-screen views
│   │   ├── GameScreen.jsx     # Main gameplay
│   │   ├── MainMenu.jsx       # Title screen
│   │   ├── PatientSelect.jsx  # Case selection
│   │   └── SessionReport.jsx  # End-of-session results
│   │
│   └── ui/                    # Reusable UI elements
│       ├── DevConsole.jsx     # Debug console
│       ├── ErrorBoundary.jsx  # Error handling
│       ├── ErrorOverlay.jsx   # Error display
│       ├── MenuButton.jsx     # Styled buttons
│       └── index.js           # UI exports
│
├── context/
│   └── GameContext.jsx        # Global game state
│
├── data/
│   ├── config.js              # Game configuration
│   ├── disorders.js           # Disorder definitions
│   ├── rapport.js             # Rapport system data
│   ├── symptoms.js            # Symptom definitions
│   ├── keywords/              # Keyword database
│   ├── menu-options/          # Dialogue options
│   └── patients/              # Patient data
│
├── dialogue/                  # Legacy dialogue system
│   ├── DIALOGUE_SPEC.md
│   ├── engine.js
│   ├── index.js
│   ├── parser.js
│   └── useDialogue.js
│
├── patients/                  # Patient content files
│   └── gregory/               # Gregory's session data
│
├── sdns/                      # Session Dialogue System
│   ├── SDNS_REFERENCE.md      # Language specification
│   ├── engine.js              # SDNS runtime engine
│   ├── index.js               # SDNS exports
│   ├── keyword-parser.js      # Keyword extraction
│   ├── loader.js              # Session file loader
│   ├── parser.js              # SDNS syntax parser
│   ├── useDialogue.js         # React hook interface
│   └── vscode-extension/      # Editor support
│
├── styles/                    # CSS stylesheets
│   ├── main.css               # Global styles
│   ├── clipboard.css
│   ├── dev-console.css
│   ├── dialogue-box.css
│   ├── focus-meter.css
│   ├── fonts.css
│   ├── game-screen.css
│   ├── handbook.css
│   ├── main-menu.css
│   ├── patient-select.css
│   ├── patient-view.css
│   ├── session-report.css
│   ├── synthesis-zone.css
│   └── turn-clock.css
│
└── utils/                     # Utility functions
    ├── index.js
    ├── ErrorHandler.js
    ├── PatientLoader.js
    ├── SaveManager.js
    ├── SessionSaveManager.js
    └── SoundManager.js
```

---

## 3. Core Systems Architecture

### 3.1 Game State (GameContext)

The central state management for the entire game.

```javascript
// GameContext provides:
{
  // Session State
  currentPatient: Patient,
  currentTurn: 1-4,
  sessionPhase: 'intro' | 'dialogue' | 'synthesis' | 'report',
  
  // Resources
  focus: 0-100,
  rapport: 0-100,
  
  // Collections
  textTokens: Token[],
  visualTokens: Token[],
  breakthroughs: Breakthrough[],
  
  // Progress
  discoveredKeywords: string[],
  completedSyntheses: Synthesis[],
  
  // Actions
  spendFocus: (amount) => void,
  addToken: (token) => void,
  attemptSynthesis: (text, visual) => Result,
  advanceTurn: () => void
}
```

### 3.2 SDNS Dialogue Engine

The custom scripting system for patient conversations.

**Key Components:**

| Module | Purpose |
|--------|---------|
| `parser.js` | Converts .session files to AST |
| `engine.js` | Executes parsed dialogue |
| `loader.js` | Loads session files |
| `keyword-parser.js` | Extracts interactive keywords |
| `useDialogue.js` | React hook interface |

**SDNS Flow:**
```
.session file → Parser → AST → Engine → React State → UI
```

### 3.3 Token System

```javascript
// Token structure
{
  id: string,
  type: 'text' | 'visual',
  content: string,
  source: string,          // Dialogue line or hotspot ID
  category: string,        // Keyword type
  contradicts: string[],   // Potential matches
  collected: boolean,
  position: { x, y }
}
```

### 3.4 Focus System

```javascript
// FocusMeter manages:
- Current focus value
- Maximum focus
- Drain animations
- Restore animations
- Focus mode toggle state
```

---

## 4. Data Schemas

### 4.1 Patient Definition

```javascript
{
  id: string,
  name: string,
  age: number,
  difficulty: 'easy' | 'medium' | 'hard',
  disorder: Disorder,
  
  // Visual
  portrait: string,        // Path to sprite
  symptoms: Symptom[],     // Visual observations
  
  // Content
  sessions: Session[],     // SDNS session files
  breakthroughs: {
    condition: string,
    result: string,
    dialogue: string
  }[],
  
  // Metadata
  unlockCondition: string,
  email: EmailContent
}
```

### 4.2 Disorder Definition

```javascript
{
  id: string,
  name: string,
  category: string,
  description: string,
  
  symptoms: {
    required: string[],
    common: string[],
    rare: string[]
  },
  
  differentialDiagnosis: string[],
  handbookEntry: string
}
```

### 4.3 Keyword Types

| Type | Visual Style | Example |
|------|-------------|---------|
| `duration` | Blue, clock icon | "months", "years" |
| `intensity` | Orange, flame icon | "constantly", "severe" |
| `behavior` | Green, activity icon | "avoiding", "pacing" |
| `emotion` | Purple, heart icon | "worried", "hopeless" |
| `background` | Gray, document icon | "job loss", "breakup" |
| `contradiction` | Red, alert icon | Direct conflicts |
| `general` | Default style | Other keywords |

---

## 5. Build & Deployment

### 5.1 Development

```bash
# Start development server
npm run dev

# With Tauri (desktop)
npm run tauri:dev
```

### 5.2 Production Build

```bash
# Web build
npm run build

# Desktop build
npm run tauri:build
```

### 5.3 Deployment Targets

| Target | Command | Platform |
|--------|---------|----------|
| Firebase (stable) | `npm run deploy:stable` | Web |
| Firebase (staging) | `npm run deploy:staging` | Web |
| Firebase (dev) | `npm run deploy:dev` | Web |
| Tauri | `npm run tauri:build` | Windows/Mac/Linux |

---

## 6. Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, screen routing |
| `src/context/GameContext.jsx` | Global state provider |
| `src/sdns/engine.js` | Dialogue execution engine |
| `src/components/game/DialogueBox.jsx` | Main dialogue display |
| `src/components/screens/GameScreen.jsx` | Core gameplay layout |
| `src/data/disorders.js` | Disorder database |
| `src/utils/SaveManager.js` | Progress persistence |

---

## 7. External Integrations

### 7.1 Firebase (Web Hosting)

- Production, staging, and development environments
- Configured in `firebase.json`

### 7.2 Tauri (Desktop)

- Native desktop wrapper
- Configured in `src-tauri/tauri.conf.json`
- Rust backend in `src-tauri/src/`

---

## 8. Related Documents

- [SDNS Reference](../../src/sdns/SDNS_REFERENCE.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [UI Components](./UI_COMPONENTS.md)
