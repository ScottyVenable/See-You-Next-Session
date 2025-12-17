# Art & Audio Asset List

> **Document Type:** Asset Reference  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Status:** MVP Requirements

---

## Overview

This document tracks all required art and audio assets for the game.

---

## 1. Art Assets

### 1.1 Character: Gregory (Tutorial Patient)

#### Base Sprite
| Asset | Description | Status |
|-------|-------------|--------|
| Base Body | Seated pose, guarded expression | Needed |
| Black Clothing | Professional but dark aesthetic | Needed |
| Orange/Red Hair | Styled, maintained | Needed |

#### Symptom Overlays (Transparent PNGs)
| Asset | Location | Status |
|-------|----------|--------|
| Bags under eyes | Face | Needed |
| Bitten nails | Hands | Needed |
| Chewed lip | Face | Needed |
| Shaky hands effect | Hands | Needed |
| Erratic eye animation | Eyes | Needed |
| Fidgeting fingers | Hands | Needed |
| Bouncing leg | Legs | Needed |

### 1.2 Character: Patient 2 (Bipolar)

#### Base Sprites
| Asset | Description | Status |
|-------|-------------|--------|
| Base Body (Manic) | Energetic pose | Needed |
| Base Body (Depressed) | Slumped pose | Needed |
| Flashy Clothing | Manic phase outfit | Needed |
| Casual Clothing | Depressed phase outfit | Needed |

#### Symptom Overlays
| Asset | Location | Phase | Status |
|-------|----------|-------|--------|
| Dilated pupils | Eyes | Manic | Needed |
| Flashy jewelry | Body | Manic | Needed |
| Flat expression | Face | Depressed | Needed |
| Messy hair | Head | Depressed | Needed |

### 1.3 Environment: Therapy Office

| Asset | Description | Status |
|-------|-------------|--------|
| Office Background | First-person desk view | Needed |
| Bookshelf | Background element | Needed |
| Diploma/Certificate | Wall decoration | Needed |
| Plant | Office ambience | Needed |
| Warm lighting | Overall atmosphere | Needed |

### 1.4 User Interface

| Asset | Description | Status |
|-------|-------------|--------|
| Dialogue Box | Paper/medical aesthetic | Needed |
| Clipboard | Physical clipboard sprite | Needed |
| Text Token Icon | Paper slip | Needed |
| Visual Token Icon | Eye/polaroid frame | Needed |
| Focus Meter | Glass tube/vertical bar | Needed |
| Focus Fill | Teal liquid texture | Needed |
| Handbook Closed | Book icon | Needed |
| Handbook Open | Open book overlay | Needed |
| Clock Face | Analog clock | Needed |
| Magnifying Glass | Focus Mode cursor | Using icon |

---

## 2. Audio Assets

### 2.1 UI Sound Effects

| Asset | Description | Status |
|-------|-------------|--------|
| UI_Hover | Soft paper rustle | Needed |
| UI_Click | Pen click / stamp | Needed |
| Token_Pickup | Paper lifting | Needed |
| Token_Drop | Paper slap on wood | Needed |
| Scribble_Short | Quick pencil writing | Needed |
| Scribble_Long | Extended writing | Needed |

### 2.2 Gameplay Sound Effects

| Asset | Description | Status |
|-------|-------------|--------|
| Focus_Enter | Deep breath / low hum | Needed |
| Focus_Exit | Exhale | Needed |
| Breakthrough_Success | Positive chime / ding | Needed |
| Synthesis_Fail | Dull thud | Needed |
| Keyword_Collect | Soft ping | Needed |
| Turn_Advance | Clock tick / chime | Needed |

### 2.3 Music & Ambience

| Asset | Description | Duration | Status |
|-------|-------------|----------|--------|
| Office_Ambience | Quiet AC, distant clock | Loop | Needed |
| Tension_Track | Low synth drone (low focus) | Loop | Needed |
| Menu_Theme | Calm, professional | Loop | Needed |
| Success_Sting | Diagnosis correct | 3-5 sec | Needed |
| Failure_Sting | Diagnosis wrong | 3-5 sec | Needed |

---

## 3. Fonts

### Required Font Families

| Use | Font | Status |
|-----|------|--------|
| Headers/Title | Session Header font | In `assets/fonts/header/` |
| Body/Dialogue | Body font | In `assets/fonts/body/` |
| UI Labels | System/Body font | Available |

---

## 4. Asset Specifications

### Image Formats
- **Sprites:** PNG with transparency
- **Backgrounds:** PNG or JPEG
- **Icons:** SVG preferred, PNG fallback

### Resolutions
- **Target:** 1920x1080 (scale down for smaller)
- **Sprites:** 2x scale for crisp rendering
- **Icons:** 32x32 base, provide 64x64

### Audio Formats
- **SFX:** WAV or OGG
- **Music:** OGG (smaller size, good quality)
- **Sample Rate:** 44.1kHz

---

## 5. Asset Organization

```
src/assets/
├── fonts/
│   ├── body/
│   └── header/
├── images/
│   ├── backgrounds/
│   ├── characters/
│   │   ├── gregory/
│   │   │   ├── base.png
│   │   │   └── overlays/
│   │   └── patient2/
│   ├── ui/
│   │   ├── clipboard.png
│   │   ├── handbook.png
│   │   └── tokens/
│   └── icons/
└── audio/
    ├── sfx/
    ├── music/
    └── ambience/
```

---

## 6. Priority Order

### MVP Critical
1. Gregory base sprite
2. Gregory symptom overlays
3. Office background
4. Core UI elements (clipboard, handbook)
5. Basic SFX (click, hover)

### MVP Nice-to-Have
1. Focus Mode effects
2. Office ambience
3. Tension music

### Post-MVP
1. Patient 2 assets
2. Full music suite
3. Additional environments

---

## Related Documents

- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Patient Roster](../content/PATIENT_ROSTER.md)
- [Gregory Character Sheet](../content/patients/gregory.md)
