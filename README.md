# See You Next Session

A narrative puzzle game where you play as a mental health professional. Diagnose patients by spotting contradictions between their dialogue and physical presentation.

## 🎮 Game Features

- **Token System**: Collect dialogue keywords and visual observations
- **Focus Mode**: Use limited mental energy to observe patient details
- **Synthesis Zone**: Combine tokens to find contradictions and unlock breakthroughs
- **Handbook**: Reference disorders and their diagnostic criteria
- **Scoring System**: Get ranked based on accurate diagnosis

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

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
│   └── screens/       # Main game screens
│       ├── GameScreen.jsx
│       ├── MainMenu.jsx
│       ├── PatientSelect.jsx
│       └── SessionReport.jsx
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

## 🎨 Adding Content

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

## 📝 Disclaimer

The developers are not mental health professionals. All information in this game is for entertainment purposes only. If you or someone you know is struggling, please contact a professional.

**Resources:**
- [988 Suicide & Crisis Lifeline](https://988lifeline.org/)
- [NAMI](https://www.nami.org/)

## 👥 Credits

- **Scott** - Programming & Design
- **Kiki** - Art Direction & Writing

## 📄 License

MIT License - See LICENSE file for details
