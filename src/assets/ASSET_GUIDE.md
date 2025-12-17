# See You Next Session - Asset Placement Guide

This document explains where to place your art and audio assets.

## Folder Structure

Create these folders in `src/assets/`:

```
src/assets/
├── characters/
│   ├── alex-base.png              # Tutorial patient base sprite
│   ├── bipolar-base-manic.png     # Bipolar patient manic state
│   ├── bipolar-base-depressed.png # Bipolar patient depressed state
│   └── overlays/
│       ├── bitten-nails.png
│       ├── bags-under-eyes.png
│       ├── chewed-lip.png
│       ├── dilated-pupils.png
│       ├── trembling-hands.png
│       └── ...
├── backgrounds/
│   ├── office.png                 # Main game background
│   └── menu-bg.png               # Menu background
├── ui/
│   ├── clipboard.png
│   ├── handbook-closed.png
│   ├── handbook-open.png
│   ├── token-text.png
│   ├── token-visual.png
│   └── focus-meter.png
└── audio/
    ├── sfx/
    │   ├── ui-hover.wav
    │   ├── ui-click.wav
    │   ├── token-pickup.wav
    │   ├── token-drop.wav
    │   ├── breakthrough.wav
    │   ├── error.wav
    │   └── scribble.wav
    └── music/
        ├── office-ambience.mp3
        └── tension.mp3
```

## Sprite Specifications

### Character Base Sprites
- **Dimensions:** 400x600 pixels (recommended)
- **Format:** PNG with transparency
- **Style:** Sitting pose, facing camera at slight angle

### Symptom Overlays
- **Dimensions:** Same as base sprite (400x600)
- **Format:** PNG with transparency
- **Important:** Only the symptom area should be visible, rest transparent
- **Naming:** Use kebab-case matching symptom IDs (e.g., `bitten-nails.png`)

### UI Elements
- **Format:** PNG with transparency
- **Scale:** Design at 1x, will be CSS scaled as needed

## Audio Specifications

### Sound Effects
- **Format:** WAV or MP3
- **Length:** 0.1-2 seconds
- **Quality:** 44.1kHz, 16-bit

### Music/Ambience
- **Format:** MP3 or OGG
- **Quality:** 128-320 kbps
- **Looping:** Ensure seamless loop points

## Connecting Assets to Code

After placing assets, update the paths in:

1. **Patient files** (`src/data/patients/*.js`):
```javascript
appearance: {
  baseSprite: '/assets/characters/patient-name.png',
  symptomOverlays: {
    'symptom-id': {
      sprite: '/assets/characters/overlays/symptom.png',
      // ...
    }
  }
}
```

2. **CSS files** for backgrounds and UI images

## Asset Checklist

### MVP Characters
- [ ] Alex (Tutorial Patient) - Base sprite
- [ ] Alex - Bitten nails overlay
- [ ] Alex - Bags under eyes overlay
- [ ] Alex - Chewed lip overlay
- [ ] Alex - Looking around animation/pose

### MVP UI
- [ ] Main menu background
- [ ] Office background
- [ ] Clipboard graphic
- [ ] Handbook graphic
- [ ] Token icons (text & visual)

### MVP Audio
- [ ] UI click sound
- [ ] Token pickup sound
- [ ] Breakthrough success chime
- [ ] Error/failure sound
- [ ] Office ambience loop
