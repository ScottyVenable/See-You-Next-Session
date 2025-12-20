# SDNS Uniqueness Assessment

**Document Version:** 1.0.0  
**Date:** December 20, 2025  
**Purpose:** Review and document the unique features of the SDNS keyword system compared to other dialogue systems

---

## Executive Summary

The **Session Dialogue and Narration System (SDNS)** is a purpose-built scripting language for therapy simulation games. While it shares foundational concepts with other dialogue systems (branching narrative, conditional logic), SDNS has several unique features specifically designed for clinical simulation and evidence-based gameplay mechanics.

**Key Differentiators:**
1. Clinical evidence collection through keyword extraction
2. Contradiction detection and verification mechanics
3. Therapeutic rapport/focus resource management
4. Breakthrough moments tied to symptom revelation
5. Hierarchical keyword classification (source.category.keyword)
6. Interactive keyword context menus with clinical actions

---

## Comparison with Other Dialogue Systems

### 1. Ink (Inkle Studios)

**Ink** is a narrative scripting language used in 80 Days, Heaven's Vault, and many other games.

| Feature | Ink | SDNS | Notes |
|---------|-----|------|-------|
| Branching dialogue | Yes | Yes | Similar conditional branching |
| Variables/state | Yes | Yes | Both support game state |
| Knots/diverts | Yes | Blocks/gotos | Different naming, same concept |
| Weave/gather | Yes | No | Ink has more complex nesting |
| Keyword extraction | No | **Yes** | SDNS unique |
| Evidence collection | No | **Yes** | SDNS unique |
| Contradiction detection | No | **Yes** | SDNS unique |
| Resource management | No | **Yes** | Rapport/focus system |
| Speaker moods | Limited | **Yes** | Rich mood indicators |
| Inline styling | No | **Yes** | `<style:>` syntax |

**Verdict:** Ink is more flexible for general narrative games. SDNS is specialized for clinical/investigative gameplay.

### 2. Yarn Spinner

**Yarn Spinner** is an open-source dialogue system popular with Unity developers.

| Feature | Yarn Spinner | SDNS | Notes |
|---------|--------------|------|-------|
| Node-based dialogue | Yes | Yes (Blocks) | Similar structure |
| Conditional branching | Yes | Yes | Comparable |
| Custom commands | Yes | Yes (@directives) | Both extensible |
| Character names | Yes | Yes (Speakers) | Similar |
| Rich text markup | Limited | **Yes** | SDNS keyword syntax |
| Evidence mechanics | No | **Yes** | SDNS unique |
| VSCode extension | Community | **Custom** | Purpose-built for SDNS |

**Verdict:** Yarn Spinner is general-purpose; SDNS is domain-specific with clinical features.

### 3. Ren'Py

**Ren'Py** is a visual novel engine with its own scripting language.

| Feature | Ren'Py | SDNS | Notes |
|---------|--------|------|-------|
| Visual novel support | **Yes** | Limited | Ren'Py is VN-focused |
| Character expressions | **Yes** | Via moods | Different approach |
| Scene management | **Yes** | No | SDNS is dialogue-only |
| Keyword highlighting | No | **Yes** | SDNS unique |
| Clinical mechanics | No | **Yes** | SDNS unique |
| Save/load | **Yes** | Via game | Ren'Py built-in |

**Verdict:** Ren'Py is a full VN engine; SDNS is a dialogue scripting layer.

### 4. Twine (Twee/Harlowe/Sugarcube)

**Twine** is a hypertext interactive fiction tool.

| Feature | Twine | SDNS | Notes |
|---------|-------|------|-------|
| Hypertext links | **Yes** | Keyword links | Different purpose |
| Passage structure | Yes | Block structure | Similar |
| Variables | Yes | Yes | Comparable |
| CSS styling | **Yes** | Via presets | Twine more flexible |
| Evidence collection | No | **Yes** | SDNS unique |
| Game integration | Limited | **Yes** | SDNS designed for it |

**Verdict:** Twine is for standalone IF; SDNS integrates with game systems.

---

## Unique SDNS Features

### 1. Keyword Extraction System

**What makes it unique:**
- Keywords are marked inline with `[brackets]` 
- Each keyword can reference a definition: `[text](source.category.keyword)`
- Keywords are collectible evidence pieces
- Players interact with keywords via context menus

**No other system has this:** The ability to mark specific phrases as collectible evidence that contributes to diagnosis/investigation mechanics.

```session
PATIENT (nervous)
"I've been [having trouble sleeping](gregory.behavior.sleep-trouble) for [months](time.months) now."
```

### 2. Contradiction Detection

**What makes it unique:**
- Keywords can mark contradictions: `<contradicts:other-keyword>`
- System tracks when patient statements conflict
- Creates investigation/detective-style gameplay

**Example:**
```session
PATIENT
"I [sleep fine](behavior.sleep-fine)<contradicts:bags-under-eyes>."
// The visual observation of bags under eyes contradicts this claim
```

### 3. Clinical Resource Management

**What makes it unique:**
- **Rapport:** Relationship quality with patient
- **Focus:** Mental resources for investigation
- Directives modify these: `@rapport +5`, `@focus -10`
- Keywords can cost focus to collect or reveal symptoms

**No other dialogue system** has built-in resource management tied to therapeutic relationship dynamics.

### 4. Breakthrough System

**What makes it unique:**
- Special moments when patient makes significant revelations
- Triggered by keyword + symptom combinations
- Unlocks new dialogue paths and therapeutic progress

```session
=== @breakthrough:insomnia-reveal ===
PATIENT (vulnerable)
"I... I haven't slept more than two hours a night in months."

@reveal symptom:chronic-insomnia
@unlock topic:sleep.deep-dive
```

### 5. Hierarchical Keyword Classification

**What makes it unique:**
- Three-level hierarchy: `source.category.keyword`
- Sources: `generic` (universal) or patient-specific (`gregory`)
- Categories: `behavior`, `emotion`, `cognition`, `symptom`, etc.
- Enables both universal and patient-specific keywords

**Example Structure:**
```
generic.time.months          # Universal time reference
generic.emotion.worried      # Universal emotion
gregory.behavior.sleep-fine  # Gregory-specific (potential lie)
gregory.cognition.not-sick   # Gregory's denial pattern
```

### 6. Inline Styling Syntax

**What makes it unique:**
- Style keywords directly in dialogue: `<style:category.preset>`
- Animation tags: `<anim:pulse>`
- Enables visual customization without code changes

```session
PATIENT
"[I'm totally fine.](gregory.denial.im-fine)<style:behavior.red><anim:shake>"
```

### 7. Integrated Menu Actions

**What makes it unique:**
- Keywords have context menus with clinical actions
- Actions defined in JSON: `collect`, `ask-about`, `explore`, `safety-assessment`
- Deep integration with game mechanics

---

## Domain-Specific Advantages

### For Therapy Simulation Games

1. **Clinical Accuracy:** System models therapeutic sessions with appropriate mechanics
2. **Evidence Building:** Players construct understanding through collected keywords
3. **Relationship Dynamics:** Rapport system reflects real therapeutic relationships
4. **Non-Verbal Cues:** Mood indicators and contradictions model patient behavior
5. **Sensitive Content:** Safety flags for critical mental health topics

### For Writers

1. **Clean Syntax:** Easy to read and write for non-programmers
2. **Contextual Keywords:** Writers can mark exactly what should be collectible
3. **Mood System:** Rich emotional expression without complex code
4. **Block Structure:** Logical organization of dialogue segments

### For Modders/Expansion

1. **JSON-based Keywords:** Easy to add new keyword definitions
2. **CSS Presets:** Visual customization without touching code
3. **Extensible Actions:** Add custom menu actions for keywords

---

## Potential Future Uniqueness

Features that could further differentiate SDNS:

1. **AI-Assisted Dialogue Generation** - Train on keyword patterns
2. **Analytics Dashboard** - Track which keywords players collect most
3. **Adaptive Difficulty** - Adjust keyword visibility based on player skill
4. **Multiplayer Sessions** - Multiple therapists discuss same patient
5. **Voice Integration** - Keywords triggered by speech recognition

---

## Conclusion

SDNS is **not** trying to be a general-purpose dialogue system. It is specifically designed for:

- Therapy/clinical simulation games
- Investigative gameplay with evidence collection
- Character analysis through dialogue examination
- Resource-managed conversation mechanics

**Unique Value Proposition:** SDNS transforms dialogue from passive reading into active investigation, where every word could be evidence and every contradiction could be a breakthrough.

**Recommendation:** Continue developing SDNS as a specialized tool. Do not dilute its focus by adding features better served by general-purpose systems. Instead, double down on the clinical simulation and evidence mechanics that make it unique.

---

*Assessment completed December 20, 2025*
