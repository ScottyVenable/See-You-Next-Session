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
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/see-you-next-session.git
cd see-you-next-session

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── game/          # Game UI components
│   │   ├── Clipboard.jsx
│   │   ├── DialogueBox.jsx
│   │   ├── FocusMeter.jsx
│   │   ├── Handbook.jsx
│   │   ├── PatientView.jsx
│   │   ├── SynthesisZone.jsx
│   │   └── TurnClock.jsx
│   ├── screens/       # Main game screens
│   │   ├── GameScreen.jsx
│   │   ├── MainMenu.jsx
│   │   ├── PatientSelect.jsx
│   │   └── SessionReport.jsx
│   └── ui/            # Reusable styled-components
│       ├── MenuButton.jsx
│       └── index.js
├── context/
│   └── GameContext.jsx    # Global game state
├── data/
│   ├── config.js          # Game balance values
│   ├── disorders.js       # Disorder definitions
│   ├── symptoms.js        # Symptom definitions
│   └── patients/          # Patient data files
├── styles/                # CSS stylesheets
├── App.jsx
└── main.jsx
```

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

## 👥 Credits

- **Scott** - Programming & Design
- **Kiki** - Art Direction & Writing

## 🤝 Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details
