# See You Next Session - Unity Codebase

This folder contains the Unity port of the See You Next Session game, converted from the React/Tauri web application.

## Project Structure

```
Unity Codebase/
├── Assets/
│   ├── Scripts/
│   │   ├── Core/              # Core game systems (GameManager, GameState)
│   │   ├── SDNS/              # Dialogue system (parser, engine)
│   │   ├── Data/              # ScriptableObjects and data classes
│   │   ├── UI/                # UI controllers and components
│   │   ├── Utils/             # Utility classes (SaveManager, ErrorHandler)
│   │   └── Managers/          # System managers (AudioManager, etc.)
│   ├── Prefabs/
│   │   ├── UI/                # UI prefabs
│   │   └── Game/              # Game object prefabs
│   ├── Scenes/
│   │   ├── MainMenu.unity
│   │   ├── PatientSelect.unity
│   │   ├── GameSession.unity
│   │   └── SessionReport.unity
│   ├── Resources/
│   │   ├── Dialogue/          # .session dialogue files
│   │   ├── Patients/          # Patient ScriptableObjects
│   │   └── Disorders/         # Disorder ScriptableObjects
│   └── Art/
│       ├── UI/
│       └── Characters/
├── ProjectSettings/
└── Packages/
```

## Architecture Overview

### Core Systems

- **GameManager**: Singleton managing game state and scene transitions
- **GameState**: Serializable state container (replaces React's GameContext)
- **SessionManager**: Manages active therapy sessions

### SDNS (Session Dialogue and Narration System)

The custom dialogue system has been ported to C#:
- **SDNSParser**: Converts .session files to dialogue AST
- **SDNSEngine**: Executes dialogue with game state integration
- **SDNSLoader**: Loads and caches dialogue files

### Data

Uses ScriptableObjects for:
- Patient configurations
- Disorder definitions
- Symptom definitions
- Game configuration

### UI

Uses Unity UI Toolkit or UGUI for:
- Main menu
- Dialogue boxes
- Clipboard/evidence system
- Clinical handbook
- Focus and rapport meters

## Setup Instructions

1. Open Unity Hub
2. Add this folder as a Unity project
3. Open with Unity 2022.3 LTS or newer
4. Install required packages:
   - TextMeshPro
   - Unity UI
   - (Optional) DOTween for animations

## Migration Notes

### Key Differences from React Version

| React | Unity |
|-------|-------|
| GameContext (useReducer) | GameManager singleton + GameState |
| JSX Components | MonoBehaviour + UI Toolkit/UGUI |
| Framer Motion | DOTween or native animations |
| CSS Styles | Unity StyleSheets or UI components |
| localStorage | PlayerPrefs or JSON serialization |
| ES6 async/await | Coroutines or async/await |

### Preserved Features

- Full SDNS dialogue syntax support
- Focus/Rapport systems
- Token collection mechanics
- Clinical handbook
- Save/Load system
