# Keyword System Implementation Plan

**Version:** 1.0.0  
**Date:** December 20, 2025  
**Status:** Active Development

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: CSS Class System](#phase-1-css-class-system)
3. [Phase 2: VSCode Extension Enhancements](#phase-2-vscode-extension-enhancements)
4. [Phase 3: Visual Indicators & Effects](#phase-3-visual-indicators--effects)
5. [Phase 4: Tooltip Menu System](#phase-4-tooltip-menu-system)
6. [Phase 5: Documentation & Testing](#phase-5-documentation--testing)
7. [Technical Architecture](#technical-architecture)
8. [File Modifications Summary](#file-modifications-summary)

---

## Overview

This document outlines the implementation plan for enhancing the SDNS (Session Dialogue and Narration System) keyword system. The goal is to create a modular, extensible system that supports:

- CSS class referencing for keyword styling
- Patient-specific dropdown autocomplete in VSCode
- Visual indicators for keyword importance without spoiling gameplay
- Interactive tooltip menus with context actions
- Drag-and-drop functionality with particle effects

### Target Syntax

```
[I had a really hard time sleeping last night.] <keyword:gregory.sleep_difficulty><anim:highlight><style:behavior.red>
```

### Priority Order

1. **CSS Class System** - Foundation for all visual features
2. **VSCode Extension** - Developer experience and productivity
3. **Visual Indicators** - Player-facing importance system
4. **Tooltip Menus** - Interactive keyword actions
5. **Documentation** - Keep everything up to date

---

## Phase 1: CSS Class System

### 1.1 Create CSS Preset Files

**Location:** `src/styles/keywords/`

Create modular CSS files for keyword styling:

```
src/styles/keywords/
  index.css              # Imports all keyword styles
  importance.css         # low, medium, high, critical
  categories.css         # behavior, emotion, cognition, etc.
  animations.css         # pulse, glow, shake, highlight
  themes/
    default.css          # Default theme
    high-contrast.css    # Accessibility theme
```

#### importance.css Structure

```css
/* Importance Levels - Subtle visual hierarchy */
.keyword-importance-low {
    --keyword-border-width: 1px;
    --keyword-glow-intensity: 0;
}

.keyword-importance-medium {
    --keyword-border-width: 1px;
    --keyword-glow-intensity: 0.1;
}

.keyword-importance-high {
    --keyword-border-width: 2px;
    --keyword-glow-intensity: 0.2;
}

.keyword-importance-critical {
    --keyword-border-width: 2px;
    --keyword-glow-intensity: 0.3;
    --keyword-pulse: true;
}
```

#### categories.css Structure

```css
/* Category Colors - CSS custom properties */
.keyword-category-behavior {
    --keyword-color: #e74c3c;
    --keyword-bg: rgba(231, 76, 60, 0.15);
}

.keyword-category-emotion {
    --keyword-color: #9b59b6;
    --keyword-bg: rgba(155, 89, 182, 0.15);
}

.keyword-category-cognition {
    --keyword-color: #3498db;
    --keyword-bg: rgba(52, 152, 219, 0.15);
}

.keyword-category-symptom {
    --keyword-color: #e67e22;
    --keyword-bg: rgba(230, 126, 34, 0.15);
}

.keyword-category-relationship {
    --keyword-color: #1abc9c;
    --keyword-bg: rgba(26, 188, 156, 0.15);
}

.keyword-category-time {
    --keyword-color: #95a5a6;
    --keyword-bg: rgba(149, 165, 166, 0.15);
}
```

### 1.2 Update Keyword Schema

Add `styleClass` and `animationClass` properties to keyword-schema.json:

```json
{
    "style": {
        "type": "object",
        "properties": {
            "color": { "type": "string" },
            "bgColor": { "type": "string" },
            "icon": { "type": "string" },
            "animation": { "type": "string" },
            "cssClass": {
                "type": "string",
                "description": "CSS class name from presets (e.g., 'behavior.red')"
            },
            "animationClass": {
                "type": "string",
                "description": "Animation class (e.g., 'pulse', 'glow', 'shake')"
            }
        }
    }
}
```

### 1.3 Create Style Registry

**File:** `src/data/keywords/styles/keyword-styles.json`

```json
{
    "categories": {
        "behavior": {
            "red": { "color": "#e74c3c", "bgColor": "rgba(231,76,60,0.15)" },
            "warning": { "color": "#f39c12", "bgColor": "rgba(243,156,18,0.15)" }
        },
        "emotion": {
            "purple": { "color": "#9b59b6", "bgColor": "rgba(155,89,182,0.15)" },
            "sad": { "color": "#34495e", "bgColor": "rgba(52,73,94,0.15)" }
        },
        "cognition": {
            "blue": { "color": "#3498db", "bgColor": "rgba(52,152,219,0.15)" }
        },
        "symptom": {
            "orange": { "color": "#e67e22", "bgColor": "rgba(230,126,34,0.15)" },
            "critical": { "color": "#c0392b", "bgColor": "rgba(192,57,43,0.2)" }
        }
    },
    "animations": {
        "highlight": { "animation": "none", "transition": "all 0.2s ease" },
        "pulse": { "animation": "keyword-pulse 2s infinite" },
        "glow": { "animation": "keyword-glow 1.5s ease-in-out infinite" },
        "shake": { "animation": "keyword-shake 0.5s ease-in-out" }
    },
    "importance": {
        "low": { "borderWidth": "1px", "opacity": 0.8 },
        "medium": { "borderWidth": "1px", "opacity": 0.9 },
        "high": { "borderWidth": "2px", "opacity": 1 },
        "critical": { "borderWidth": "2px", "opacity": 1, "animation": "pulse" }
    }
}
```

### 1.4 Update DialogueBox Component

Modify `src/components/game/DialogueBox.jsx` to:

1. Import keyword style registry
2. Parse `<style:category.preset>` syntax
3. Apply CSS classes dynamically
4. Handle animation classes

---

## Phase 2: VSCode Extension Enhancements

### 2.1 Keyword Autocomplete Enhancement

Update `src/sdns/vscode-extension/src/extension.ts`:

**Trigger Sequence:**
1. User types `<keyword:` -> show all sources (generic, gregory, etc.)
2. After `<keyword:gregory.` -> show categories for gregory
3. After `<keyword:gregory.behavior.` -> show keywords in that category

**Implementation:**

```typescript
// Enhanced completion for keyword references
function provideKeywordCompletions(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const lineText = document.lineAt(position).text;
    const textBefore = lineText.substring(0, position.character);
    
    // Match <keyword: pattern
    const keywordMatch = textBefore.match(/<keyword:([a-z_-]*)\.?([a-z_-]*)\.?$/i);
    
    if (!keywordMatch) return [];
    
    const [, source, category] = keywordMatch;
    
    if (!source) {
        // Show all sources
        return getKeywordSources().map(s => ({
            label: s,
            kind: vscode.CompletionItemKind.Module,
            detail: `Keyword source: ${s}`,
            insertText: s + '.'
        }));
    }
    
    if (!category) {
        // Show categories for this source
        return getCategoriesForSource(source).map(c => ({
            label: c,
            kind: vscode.CompletionItemKind.Class,
            detail: `Category in ${source}`,
            insertText: c + '.'
        }));
    }
    
    // Show keywords for this source.category
    return getKeywordsForCategory(source, category).map(kw => ({
        label: kw.id.split('.').pop() || kw.id,
        kind: vscode.CompletionItemKind.Value,
        detail: kw.description,
        documentation: new vscode.MarkdownString(`**${kw.displayText}**\n\n${kw.description}\n\nImportance: ${kw.importance}`),
        insertText: kw.id.split('.').pop() || kw.id
    }));
}
```

### 2.2 Style Autocomplete

Add completions for `<style:` and `<anim:` tags:

```typescript
// Style completions
function provideStyleCompletions(textBefore: string): vscode.CompletionItem[] {
    const styleMatch = textBefore.match(/<style:([a-z_-]*)\.?$/i);
    
    if (!styleMatch) return [];
    
    const [, category] = styleMatch;
    
    if (!category) {
        // Show categories
        return ['behavior', 'emotion', 'cognition', 'symptom', 'relationship', 'time'].map(c => ({
            label: c,
            kind: vscode.CompletionItemKind.Color,
            insertText: c + '.'
        }));
    }
    
    // Show presets for category
    const presets = getStylePresets(category);
    return presets.map(p => ({
        label: p.name,
        kind: vscode.CompletionItemKind.Color,
        detail: `Color: ${p.color}`,
        insertText: p.name
    }));
}

// Animation completions
function provideAnimationCompletions(): vscode.CompletionItem[] {
    return ['highlight', 'pulse', 'glow', 'shake', 'none'].map(a => ({
        label: a,
        kind: vscode.CompletionItemKind.Event,
        detail: `Animation: ${a}`,
        insertText: a
    }));
}
```

### 2.3 Hover Provider Enhancement

Show style preview on hover:

```typescript
class SDNSHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
        const range = document.getWordRangeAtPosition(position, /<style:[a-z._-]+>/i);
        if (range) {
            const text = document.getText(range);
            const style = parseStyleReference(text);
            return new vscode.Hover([
                `**Style Preview**`,
                `Color: ${style.color}`,
                `Background: ${style.bgColor}`,
                // Could add color swatch preview
            ].join('\n\n'));
        }
        return null;
    }
}
```

---

## Phase 3: Visual Indicators & Effects

### 3.1 Importance System (Non-Spoiling)

Design principle: **Indicate something is important without revealing WHY**

**Implementation Strategy:**
- All keywords have subtle visual treatment
- Higher importance = slightly more noticeable (but not obvious)
- Player learns to pay attention through gameplay, not visual cues
- Optional "trained eye" perk could enhance visual indicators later

**Visual Hierarchy:**
| Importance | Border | Glow | Animation | Player Perception |
|------------|--------|------|-----------|-------------------|
| low | 1px subtle | none | none | "Normal dialogue" |
| medium | 1px | very subtle | none | "Hmm, noted" |
| high | 2px | subtle | none | "This feels important" |
| critical | 2px | noticeable | subtle pulse | "I should pay attention" |

### 3.2 Keyword Animations

**File:** `src/styles/keywords/animations.css`

```css
@keyframes keyword-pulse {
    0%, 100% { 
        box-shadow: 0 0 0 0 var(--keyword-glow-color, rgba(108, 92, 231, 0.4));
    }
    50% { 
        box-shadow: 0 0 8px 2px var(--keyword-glow-color, rgba(108, 92, 231, 0.2));
    }
}

@keyframes keyword-glow {
    0%, 100% { 
        filter: brightness(1);
    }
    50% { 
        filter: brightness(1.1);
    }
}

@keyframes keyword-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
}

@keyframes keyword-collect {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 0.8; }
}
```

### 3.3 Particle Effect System

**File:** `src/components/ui/ParticleEffect.jsx`

Create a reusable particle system for:
- Keyword collection (particles flow to clipboard)
- Keyword drag-drop visual feedback
- Breakthrough moments

```jsx
// Simplified particle system for keyword collection
function useKeywordParticles() {
    const emitParticles = useCallback((startPos, endPos, options = {}) => {
        const {
            count = 5,
            color = '#6c5ce7',
            duration = 800,
            spread = 20
        } = options;
        
        // Create particle elements
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'keyword-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${startPos.x + Math.random() * spread - spread/2}px;
                top: ${startPos.y + Math.random() * spread - spread/2}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(particle);
            
            // Animate to clipboard
            particle.animate([
                { transform: 'scale(1)', opacity: 1 },
                { 
                    transform: `translate(${endPos.x - startPos.x}px, ${endPos.y - startPos.y}px) scale(0.5)`,
                    opacity: 0
                }
            ], {
                duration: duration + Math.random() * 200,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => particle.remove();
        }
    }, []);
    
    return { emitParticles };
}
```

---

## Phase 4: Tooltip Menu System

### 4.1 Enhanced Context Menu

Update the existing context menu with:

**Menu Options:**
1. **Collect** - Add to clipboard (default click action)
2. **Add Note** - Personal annotation
3. **Highlight in Handbook** - Cross-reference clinical info
4. **Ask About** - Queue as conversation topic
5. **Explore Further** - Deep-dive option
6. **Analyze Context** (Focus cost) - Get hint about keyword significance

### 4.2 Menu Option Configuration

Menu options are defined per-keyword in the JSON files:

```json
{
    "menuOptions": [
        {
            "id": "collect",
            "label": "Collect Evidence",
            "icon": "clipboard",
            "action": "collect"
        },
        {
            "id": "ask-about",
            "label": "Ask About This",
            "icon": "message-circle",
            "action": "ask-about",
            "params": { "topic": "sleep.quality" }
        },
        {
            "id": "analyze",
            "label": "Analyze Context",
            "icon": "search",
            "action": "explore",
            "cost": { "focus": 10 },
            "hint": "This might relate to their sleep patterns..."
        }
    ]
}
```

### 4.3 Analyze Context Feature

**Focus Cost:** Based on keyword importance
- Low: 5 focus
- Medium: 10 focus  
- High: 15 focus
- Critical: 20 focus

**Hint System:** Provides contextual clues without direct answers

```javascript
// Example hint generation
function getKeywordHint(keyword, gameState) {
    if (keyword.effects?.reveals?.length > 0) {
        return "This might reveal something about the patient's condition...";
    }
    if (keyword.effects?.contradicts?.length > 0) {
        return "Something about this doesn't quite add up...";
    }
    if (keyword.effects?.triggers?.length > 0) {
        return "This could lead to an important moment...";
    }
    return "This seems significant, but I'm not sure why yet...";
}
```

---

## Phase 5: Documentation & Testing

### 5.1 Documentation Updates

Files to update:
- `src/sdns/SDNS_REFERENCE.md` - Add style/animation syntax
- `README.md` - Project overview
- `Documents/technical/TECHNICAL_ARCHITECTURE.md` - System changes
- `src/data/keywords/KEYWORD_TODO.md` - Mark completed items

### 5.2 Testing Checklist

**Unit Tests:**
- [ ] Style parser correctly extracts `<style:category.preset>`
- [ ] Animation parser handles `<anim:type>`
- [ ] Keyword ID resolution (source.category.keyword)
- [ ] Menu option action handlers

**Integration Tests:**
- [ ] DialogueBox renders styled keywords
- [ ] Context menu appears on right-click
- [ ] Keyword collection triggers particle effect
- [ ] VSCode extension autocomplete works

**Manual Testing:**
- [ ] Visual review of all importance levels
- [ ] Accessibility check (color contrast)
- [ ] Performance with many keywords
- [ ] Mobile/touch interaction

---

## Technical Architecture

### Data Flow

```
.session file
    |
    v
SDNS Parser (parser.js)
    |-- Extracts [keyword] text
    |-- Parses <keyword:id><style:preset><anim:type>
    |
    v
Dialogue Engine (engine.js)
    |-- Resolves keyword definitions from JSON
    |-- Applies style overrides
    |
    v
DialogueBox Component
    |-- Renders styled keyword spans
    |-- Handles click/right-click
    |-- Manages context menu
    |
    v
Game State
    |-- Collected keywords
    |-- Revealed symptoms
    |-- Player progress
```

### Style Resolution Order

1. Inline style (`<style:behavior.red>`)
2. Keyword definition style (from JSON)
3. Category default style
4. Importance-based style
5. Base keyword style

---

## File Modifications Summary

### New Files

| File | Purpose |
|------|---------|
| `src/styles/keywords/index.css` | Main keyword styles entry point |
| `src/styles/keywords/importance.css` | Importance level styles |
| `src/styles/keywords/categories.css` | Category color presets |
| `src/styles/keywords/animations.css` | Keyword animations |
| `src/data/keywords/styles/keyword-styles.json` | Style preset registry |
| `src/components/ui/ParticleEffect.jsx` | Particle system for effects |
| `Documents/technical/KEYWORD_SYSTEM_IMPLEMENTATION_PLAN.md` | This document |
| `Documents/reference/SDNS_UNIQUENESS_ASSESSMENT.md` | System comparison |

### Modified Files

| File | Changes |
|------|---------|
| `src/data/keywords/definitions/keyword-schema.json` | Add cssClass, animationClass |
| `src/components/game/DialogueBox.jsx` | Style resolution, particles |
| `src/sdns/parser.js` | Parse style/anim tags |
| `src/sdns/vscode-extension/src/extension.ts` | Enhanced autocomplete |
| `src/styles/dialogue-box.css` | Import keyword styles |
| `src/sdns/SDNS_REFERENCE.md` | Document new syntax |

---

## Progress Tracking

### Phase 1: CSS Class System
- [ ] Create `src/styles/keywords/` directory structure
- [ ] Create `importance.css`
- [ ] Create `categories.css`  
- [ ] Create `animations.css`
- [ ] Create `keyword-styles.json` registry
- [ ] Update keyword-schema.json
- [ ] Update DialogueBox.jsx for style resolution

### Phase 2: VSCode Extension
- [ ] Enhance keyword autocomplete with source.category.keyword
- [ ] Add style autocomplete
- [ ] Add animation autocomplete
- [ ] Update hover provider for style preview
- [ ] Rebuild VSIX

### Phase 3: Visual Indicators
- [ ] Implement importance-based styling
- [ ] Add CSS animations
- [ ] Create particle effect system
- [ ] Test visual hierarchy

### Phase 4: Tooltip Menu
- [ ] Enhance context menu component
- [ ] Implement "Analyze Context" feature
- [ ] Add focus cost calculation
- [ ] Connect menu actions to game state

### Phase 5: Documentation
- [ ] Update SDNS_REFERENCE.md
- [ ] Create uniqueness assessment
- [ ] Update TODO documents
- [ ] Testing and validation

---

*Last Updated: December 20, 2025*
