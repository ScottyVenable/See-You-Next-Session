# Visual Novel Integration Research
## "See You Next Session" Game Development

**Date:** January 2025  
**Purpose:** Evaluate potential visual novel engines and narrative tools for enhancing the game's storytelling capabilities

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current Architecture Overview](#current-architecture-overview)
3. [Tool Comparisons](#tool-comparisons)
   - [Monogatari](#1-monogatari)
   - [Ren'Py](#2-renpy)
   - [Ink/inkjs](#3-inkinkjs)
   - [Custom Implementation](#4-custom-implementation)
4. [Integration Approaches](#integration-approaches)
5. [Development Impact Analysis](#development-impact-analysis)
6. [Recommendations](#recommendations)

---

## Executive Summary

This document evaluates options for integrating visual novel (VN) capabilities into "See You Next Session," a React-based mental health diagnostic puzzle game. The analysis considers four main approaches: **Monogatari**, **Ren'Py**, **Ink/inkjs**, and **Custom Implementation**.

### Key Finding
**Ink/inkjs is the recommended solution** for this project due to its seamless React integration, focus on narrative scripting (rather than full VN engine features we don't need), and proven track record in narrative-heavy games.

---

## Current Architecture Overview

### Existing Tech Stack
- **Frontend Framework:** React 18.2.0 + Vite 5.0.10
- **Animation:** Motion for React (motion/react)
- **State Management:** React useState/useContext
- **Styling:** CSS modules with custom theming

### Current Narrative Features
- `DialogueBox.jsx` - Patient dialogue display with mood indicators
- `PatientView.jsx` - Symptom hotspots and patient interactions
- JSON-based dialogue data structure
- Simple linear dialogue progression

### What We Need
- Branching dialogue based on player choices
- Variable tracking (relationship stats, discovered symptoms)
- Conditional dialogue based on game state
- Save/load dialogue progress
- Easy content authoring for writers

---

## Tool Comparisons

### 1. Monogatari

**Overview:** Web-based visual novel engine built with JavaScript, designed to run in browsers.

#### Pros
| Aspect | Details |
|--------|---------|
| **Web Native** | Built for web; runs in any browser |
| **Simple Syntax** | Easy-to-learn scripting language |
| **Feature Rich** | Built-in save/load, auto-play, skip, go-back |
| **Multimedia** | Full support for images, video, music, SFX |
| **Multi-language** | Built-in internationalization |
| **PWA Support** | Offline play, installable as app |
| **Open Source** | MIT License, free for commercial use |
| **Customizable** | Full CSS/HTML customization |

#### Cons
| Aspect | Details |
|--------|---------|
| **Full Engine** | Brings entire VN engine; overkill for our needs |
| **Integration Complexity** | Designed as standalone; React integration non-trivial |
| **Different Paradigm** | Would require restructuring app architecture |
| **Asset Heavy** | Expects traditional VN asset pipeline |
| **Dual State Management** | Game state split between React and Monogatari |

#### Integration Difficulty: 🔴 HIGH
Would essentially require embedding Monogatari within React or running alongside it, creating two separate applications.

---

### 2. Ren'Py

**Overview:** The most popular visual novel engine, used by 8,000+ games including DDLC. Python-based with HTML5/WASM export (beta).

#### Pros
| Aspect | Details |
|--------|---------|
| **Industry Standard** | Massive community, extensive documentation |
| **Powerful** | Python scripting for complex game logic |
| **Mature** | Decades of development and refinement |
| **Multi-platform** | Windows, macOS, Linux, Android, iOS |
| **Free** | Open source, free for commercial use |
| **Full Featured** | Complete VN toolkit out of the box |

#### Cons
| Aspect | Details |
|--------|---------|
| **Python-based** | Completely different language/ecosystem |
| **HTML5 Beta** | Web export still experimental |
| **Separate App** | Cannot integrate into React; standalone only |
| **Complete Rewrite** | Would require rebuilding entire game |
| **Overkill** | Full game engine when we need narrative scripting |
| **Asset Format** | Different asset pipeline requirements |

#### Integration Difficulty: 🔴 IMPOSSIBLE
Ren'Py cannot be integrated into an existing React app. Would require complete game rewrite.

---

### 3. Ink/inkjs

**Overview:** Narrative scripting language by inkle (creators of 80 Days, Sorcery!). inkjs is the JavaScript port.

#### Pros
| Aspect | Details |
|--------|---------|
| **Perfect Fit** | Designed specifically for narrative scripting |
| **React Compatible** | Pure JavaScript; integrates seamlessly |
| **Simple Syntax** | Writers can learn in hours, not days |
| **Powerful Branching** | Sophisticated conditional logic |
| **Variable System** | Built-in state tracking |
| **Proven** | Used in major commercial games |
| **Lightweight** | Only adds ~50KB to bundle |
| **NPM Package** | `npm install inkjs` |
| **TypeScript Support** | Full type definitions |
| **Inky Editor** | Free visual editor for writers |

#### Cons
| Aspect | Details |
|--------|---------|
| **Text Only** | No built-in multimedia; we handle presentation |
| **Learning Curve** | Requires learning ink syntax |
| **Separate Compilation** | ink files must be compiled to JSON |
| **No Visual Preview** | Writers see text, not final game |

#### Integration Difficulty: 🟢 LOW
inkjs is a library, not a framework. It handles narrative logic while React handles everything else.

#### Sample Integration
```jsx
import { Story } from 'inkjs';

function DialogueEngine({ storyContent }) {
  const [story] = useState(() => new Story(storyContent));
  const [text, setText] = useState('');
  const [choices, setChoices] = useState([]);

  const continueStory = () => {
    if (story.canContinue) {
      setText(story.Continue());
      setChoices(story.currentChoices);
    }
  };

  const makeChoice = (index) => {
    story.ChooseChoiceIndex(index);
    continueStory();
  };

  // React handles rendering, ink handles narrative
}
```

---

### 4. Custom Implementation

**Overview:** Extend current JSON dialogue system with branching capabilities.

#### Pros
| Aspect | Details |
|--------|---------|
| **Full Control** | Exactly what we need, nothing more |
| **No Dependencies** | No external libraries |
| **Consistent** | Same patterns as existing code |
| **Tailored** | Built for our specific use case |

#### Cons
| Aspect | Details |
|--------|---------|
| **Development Time** | Must build everything ourselves |
| **Writer Unfriendly** | No dedicated editor tool |
| **Limited Features** | Only what we implement |
| **Maintenance** | Must maintain our own system |
| **Reinventing Wheel** | Solved problems that ink already solves |

#### Integration Difficulty: 🟡 MEDIUM
Technical implementation is straightforward but time-consuming.

---

## Integration Approaches

### Approach A: Full VN Engine (Monogatari/Ren'Py)
```
[Existing React App] ←──×──→ [VN Engine]
        ↑                          ↑
   Our game logic            VN scenes
```
**Verdict:** ❌ Not viable. Requires two separate apps.

### Approach B: Narrative Middleware (Ink)
```
[React App]
     │
     ├── Components (DialogueBox, etc.)
     ├── Game State (useContext)
     └── Ink Runtime ← Story JSON
           │
           └── Narrative Logic
```
**Verdict:** ✅ Clean separation of concerns.

### Approach C: Custom Solution
```
[React App]
     │
     ├── Components
     ├── Game State
     └── Custom Dialogue System ← Enhanced JSON
```
**Verdict:** ⚠️ Viable but time-consuming.

---

## Development Impact Analysis

### If We Choose Ink/inkjs

#### Files to Create/Modify
| File | Change |
|------|--------|
| `src/hooks/useInkStory.js` | New custom hook for ink integration |
| `src/components/DialogueBox.jsx` | Update to use ink story |
| `src/stories/*.ink` | New ink narrative files |
| `src/stories/*.json` | Compiled ink stories |
| `package.json` | Add inkjs dependency |

#### Development Workflow Change
```
CURRENT:
  1. Edit JSON dialogue
  2. Test in game

WITH INK:
  1. Write in Inky editor (live preview)
  2. Export to JSON
  3. Test in game
```

#### Learning Requirements
- **Writers:** 2-4 hours to learn ink basics
- **Developers:** 1-2 hours to integrate inkjs

#### Timeline Estimate
- Initial Integration: 4-8 hours
- Converting Existing Dialogue: 2-4 hours per patient
- Testing & Polish: 2-4 hours

---

## Feature Comparison Matrix

| Feature | Monogatari | Ren'Py | Ink | Custom |
|---------|------------|--------|-----|--------|
| React Integration | ⚠️ Hard | ❌ No | ✅ Easy | ✅ Native |
| Branching Dialogue | ✅ | ✅ | ✅ | 🔨 Build |
| Conditional Logic | ✅ | ✅ | ✅ | 🔨 Build |
| Variable Tracking | ✅ | ✅ | ✅ | 🔨 Build |
| Save/Load | ✅ | ✅ | ✅ | 🔨 Build |
| Writer-Friendly | ✅ | ✅ | ✅ | ❌ No |
| Visual Editor | ✅ | ✅ | ✅ (Inky) | ❌ No |
| Multimedia | ✅ | ✅ | ❌ Manual | ❌ Manual |
| Bundle Size Impact | 🔴 Large | N/A | 🟢 ~50KB | 🟢 None |
| Learning Curve | 🟡 Medium | 🔴 High | 🟢 Low | 🟡 Medium |
| Commercial License | ✅ MIT | ✅ Free | ✅ MIT | ✅ N/A |

---

## Recommendations

### Primary Recommendation: **Ink/inkjs**

#### Why Ink is Perfect for "See You Next Session"

1. **Narrative Focus**
   - We need branching dialogue, not a full VN engine
   - Ink is designed exactly for this use case
   - Used by professional game studios (inkle, Failbetter Games)

2. **React Harmony**
   - inkjs is pure JavaScript
   - Works as a library, not a framework
   - We control all rendering with our existing components
   - Motion animations stay intact

3. **Writer Experience**
   - Inky editor provides live preview
   - Syntax is intuitive for non-programmers
   - Can test dialogue without running the game

4. **Game Design Fit**
   - Track patient relationship/trust levels
   - Conditional dialogue based on discovered tokens
   - Different endings based on diagnosis accuracy
   - Complex branching without spaghetti code

### Sample Ink Script for Our Game
```ink
=== talk_to_patient ===
The patient fidgets in their seat.

* [Ask about sleep patterns]
    ~ trust += 1
    "I've been having trouble sleeping lately."
    -> sleep_discussion
    
* [Ask about relationships]
    ~ trust -= 1
    "I'd rather not talk about that yet."
    -> deflection
    
* {trust > 3} [Ask about the incident]
    "I suppose it's time I told you what happened..."
    -> breakthrough

=== sleep_discussion ===
{
    - discovered_insomnia:
        "We've talked about this before..."
    - else:
        ~ discovered_insomnia = true
        "I lie awake for hours. My mind won't stop racing."
        #token:insomnia
}
-> END
```

### Implementation Priority

1. **Phase 1:** Basic Integration (4 hours)
   - Install inkjs
   - Create useInkStory hook
   - Basic story loading/progression

2. **Phase 2:** Feature Integration (8 hours)
   - Connect to game state (tokens, trust)
   - Save/load story progress
   - Tags for game events (#token:xxx)

3. **Phase 3:** Content Migration (Variable)
   - Convert existing dialogue to ink format
   - Add branching paths
   - Write new content

### Alternative: Custom Solution

If simplicity is paramount and branching needs are minimal, extending the current JSON system is viable. However, this becomes increasingly painful as dialogue complexity grows.

---

## Conclusion

For "See You Next Session," **Ink/inkjs** provides the optimal balance of power and simplicity. It enhances our narrative capabilities without requiring architectural changes, keeps bundle size small, and provides writers with professional-grade tools.

The investment in learning ink (a few hours) pays dividends in:
- Cleaner dialogue code
- More complex patient interactions
- Better writer workflow
- Professional narrative features

**Next Steps:**
1. Install inkjs: `npm install inkjs`
2. Download Inky editor
3. Create proof-of-concept with one patient
4. Evaluate and proceed with full migration

---

## Resources

### Ink/inkjs
- [Ink Documentation](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [inkjs GitHub](https://github.com/y-lohse/inkjs)
- [Inky Editor](https://github.com/inkle/inky/releases)
- [Ink Discord](https://discord.gg/inkle)

### Monogatari
- [Monogatari Website](https://monogatari.io/)
- [Documentation](https://developers.monogatari.io/)

### Ren'Py
- [Ren'Py Website](https://www.renpy.org/)
- [Documentation](https://www.renpy.org/doc/html/)

---

*Document prepared for "See You Next Session" development team*
