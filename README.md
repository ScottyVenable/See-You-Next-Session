# See You Next Session

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.0.10-646cff)

*A narrative puzzle game where you play as a mental health professional*

**Diagnose patients by spotting contradictions between their dialogue and physical presentation.**

</div>

---

## Game Features

- **Token System**: Collect dialogue keywords and visual observations
- **Focus Mode**: Use limited mental energy to observe patient details
- **Synthesis Zone**: Combine tokens to find contradictions and unlock breakthroughs
- **Handbook**: Reference disorders and their diagnostic criteria
- **Scoring System**: Get ranked based on accurate diagnosis

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ScottyVenable/See-You-Next-Session.git
cd See-You-Next-Session

# Install dependencies (this may take a few minutes)
npm install

# Start development server
npm run dev
```

The game will automatically open in your browser at `http://localhost:5173`

**First time?** The dev server may take 10-15 seconds to start. Watch the terminal for "ready in" message.

### Development Commands

```bash
npm run dev          # Start dev server (hot reload enabled)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint to check code quality
npm run tauri:dev    # Run desktop version (requires Rust)
npm run tauri:build  # Build desktop application
```

### Desktop Build (Optional)

To build the desktop version:

1. **Install Rust** (required for Tauri)
   ```bash
   # Visit https://rustup.rs/ for installation
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Build desktop app**
   ```bash
   npm run tauri:build
   ```

The desktop build will be in `src-tauri/target/release/`

### Troubleshooting

**Port 5173 already in use?**
```bash
# Kill the process using the port
# Windows: 
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

**Dependencies not installing?**
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Need help?** Check [CONTRIBUTING.md](.github/CONTRIBUTING.md#common-issues-and-solutions) for more solutions.

## Project Structure

```
See-You-Next-Session/
├── src/                        # Main game source code
│   ├── components/             # React components
│   │   ├── game/               # Game UI (Clipboard, Handbook, etc.)
│   │   ├── screens/            # Main screens (Menu, Game, Report)
│   │   └── ui/                 # Reusable UI components
│   ├── context/                # State management (GameContext, UIContext)
│   ├── data/                   # Game data (config, disorders, patients)
│   ├── sdns/                   # Dialogue scripting system
│   ├── patients/               # Patient session files
│   ├── styles/                 # CSS stylesheets
│   └── utils/                  # Helper functions
│
├── Documents/                  # Project documentation
│   ├── design/                 # Game design docs
│   ├── technical/              # Technical architecture
│   ├── planning/               # Roadmap and TODO
│   └── content/                # Patient and story content
│
├── .github/                    # GitHub config and templates
├── src-tauri/                  # Desktop build configuration
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
├── DIRECTORY_STRUCTURE.md      # Detailed structure guide
└── SECURITY.md                 # Security policies

```

**For detailed information:** See [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Motion** | Animations (motion/react) |
| **Styled-Components** | Component-level styling |
| **CSS Variables** | Theming & Design Tokens |

## Adding Content

### Adding a New Patient

1. Create a new file in `src/data/patients/`:

```javascript
export const NEW_PATIENT = {
  id: 'patient-new',
  name: 'Name',
  difficulty: 'easy', // 'easy', 'medium', 'hard'
  correctDiagnosis: 'disorder-id',
  hiddenSymptoms: ['symptom-id-1', 'symptom-id-2'],
  phases: [/* dialogue phases */],
};
```

2. Import and add to `src/data/patients/index.js`

### Adding Art Assets

Replace placeholder sprites by updating paths in patient data files:
- `appearance.baseSprite` - Main character image
- `appearance.symptomOverlays` - Transparent PNG overlays for symptoms

## Disclaimer

The developers are not mental health professionals. All information in this game is for entertainment purposes only. If you or someone you know is struggling, please contact a professional.

**Resources:**
- [988 Suicide & Crisis Lifeline](https://988lifeline.org/)
- [NAMI](https://www.nami.org/)

## Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes
- **[CONTRIBUTING.md](.github/CONTRIBUTING.md)** - How to contribute
- **[DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)** - Project organization guide
- **[SECURITY.md](SECURITY.md)** - Security policies and best practices
- **[Documents/INDEX.md](Documents/INDEX.md)** - Documentation index

## Credits

- **Scott** - Programming & Design
- **Kiki** - Art Direction & Writing

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for:
- Development setup
- Coding standards
- Pull request process
- Style guides

## License

MIT License - See [LICENSE](LICENSE) file for details

---

**Version:** 0.2.0 | **Status:** In Active Development | **Target:** MVP February 2025
