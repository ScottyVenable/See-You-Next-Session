# SDNS Extension Icon Design Document

## Overview

This document defines the visual identity and icon specifications for the **SDNS (Session Dialogue and Narration System)** VS Code extension. The icons should communicate the extension's purpose—dialogue/conversation scripting for narrative games—while maintaining visual consistency with VS Code's design language.

---

## Brand Identity

### Core Concept
The SDNS extension enables writers to create therapeutic dialogue for the game "See You Next Session." The visual identity should evoke:

- **Conversation/Dialogue** - Speech bubbles, chat interfaces
- **Psychology/Therapy** - Professional, calm, trustworthy
- **Narrative/Storytelling** - Script pages, branching paths
- **Session/Meeting** - Clock elements, scheduled encounters

### Color Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Deep Navy** | `#1a1a2e` | 26, 26, 46 | Primary background |
| **Twilight Blue** | `#16213e` | 22, 33, 62 | Secondary background |
| **Soft Blue** | `#60a5fa` | 96, 165, 250 | Speaker highlights, dialogue |
| **Pink Accent** | `#f472b6` | 244, 114, 182 | Primary accent, blocks |
| **Purple Glow** | `#a78bfa` | 167, 139, 250 | Moods, secondary accent |
| **Mint Green** | `#86efac` | 134, 239, 172 | Strings, positive actions |
| **Amber** | `#fbbf24` | 251, 191, 36 | Numbers, warnings |
| **Coral Red** | `#f87171` | 248, 113, 113 | Keywords, important items |

### Typography
- **Icon Text**: Bold, sans-serif (Arial, Helvetica, or system font)
- **Letterforms**: Single letters should be bold and centered

---

## Icon Specifications

### 1. Extension Marketplace Icon

**Purpose**: Displayed in VS Code Extensions sidebar, marketplace, and search results.

**Requirements**:
- **Size**: 128×128 pixels (PNG format required)
- **Format**: PNG with transparency
- **Safe Area**: Keep important elements within 100×100px center

**Design Concept**: "Dialogue Session"

```
┌─────────────────────────────────┐
│                                 │
│         ┌───────────────┐       │
│         │  Chat Bubble  │       │
│         │  with "S"     │──┐    │
│         │  badge        │  │    │
│         └───────────────┘  │    │
│              │             │    │
│              └─────────────┘    │
│           (conversation tail)   │
│                                 │
│    Background: Gradient         │
│    Deep Navy → Twilight Blue    │
│                                 │
└─────────────────────────────────┘
```

**Elements**:
1. **Background**: Rounded rectangle (20px radius), gradient from `#1a1a2e` to `#16213e`
2. **Chat Bubble**: Stylized speech bubble outline in Pink Accent (`#f472b6`) with Purple Glow (`#a78bfa`) gradient stroke
3. **Text Lines**: Two horizontal lines inside bubble representing dialogue:
   - Top line: Soft Blue (`#60a5fa`) - 60% width
   - Bottom line: Mint Green (`#86efac`) - 40% width
4. **"S" Badge**: Small circle (16px) in Pink Accent with bold "S" in Deep Navy

**Visual Reference**:
```
    ╭──────────────────────╮
    │  ════════════════    │   ← Blue line (dialogue)
    │  ══════════         │   ← Green line (action)
    ╰──────────╮           │
               ╰───────────╯
                        [S]    ← Pink badge with "S"
```

---

### 2. File Icon (Dark Theme)

**Purpose**: Shown next to `.session` files in the Explorer sidebar (dark theme).

**Requirements**:
- **Size**: 16×16 pixels (display), provide 32×32 for retina
- **Format**: SVG (scalable)
- **Style**: Outline/stroke-based, 2px stroke weight

**Design Concept**: "Dialogue Document"

```svg
<!-- Simplified visual representation -->
┌─────────┐
│ ═══     │   ← Text line
│ ═══     │   ← Text line  
│    ◇    │   ← Small diamond (branching indicator)
└─────────┘
    └── Rounded speech bubble shape
```

**Colors**:
- Stroke: Soft Blue (`#60a5fa`)
- Optional fill: None (transparent)

**Current Implementation** (in `sdns-file-dark.svg`):
```svg
<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  <line x1="9" y1="9" x2="15" y2="9"/>
  <line x1="9" y1="13" x2="13" y2="13"/>
</svg>
```

---

### 3. File Icon (Light Theme)

**Purpose**: Shown next to `.session` files in the Explorer sidebar (light theme).

**Requirements**: Same as dark theme, adjusted colors.

**Colors**:
- Stroke: Deep Blue (`#1d4ed8`) - darker for contrast on light backgrounds

---

### 4. Activity Bar Icon (Optional)

**Purpose**: If the extension adds a custom view to the Activity Bar (sidebar).

**Requirements**:
- **Size**: 24×24 pixels
- **Format**: SVG
- **Style**: Monochrome, single color that adapts to theme

**Design**: Simplified chat bubble with branching arrow

```
  ┌────┐
  │ ≡  │ →
  └──┬─┘
     │
```

---

## Icon Variations

### Size Matrix

| Context | Size | Format | Notes |
|---------|------|--------|-------|
| Marketplace | 128×128 | PNG | Main extension icon |
| Extension detail | 256×256 | PNG | High-res for detail page |
| File explorer | 16×16 | SVG | File type icon |
| File explorer @2x | 32×32 | SVG | Retina displays |
| Activity bar | 24×24 | SVG | Sidebar icon |
| Command palette | 16×16 | SVG | Next to commands |

### State Variations

For file icons that need state indication:

| State | Modification |
|-------|--------------|
| Normal | Base colors |
| Modified | Add small dot indicator |
| Error | Red tint or exclamation |
| Disabled | 50% opacity |

---

## Design Mockups

### Main Extension Icon (128×128)

```
┌────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░╭────────────────────╮░░░░░░░░░░ │
│ ░░░░░░│                    │░░░░░░░░░░ │
│ ░░░░░░│  ━━━━━━━━━━━━━━━   │░░░░░░░░░░ │  ← Soft Blue line
│ ░░░░░░│                    │░░░░░░░░░░ │
│ ░░░░░░│  ━━━━━━━━━━        │░░░░░░░░░░ │  ← Mint Green line
│ ░░░░░░│                    │░░░░░░░░░░ │
│ ░░░░░░╰────────────╮       │░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░╰───────╯░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░(S)░░░░░ │  ← Pink badge
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────────┘

Background: Gradient #1a1a2e → #16213e
Border radius: 20px
Chat bubble stroke: #f472b6 → #a78bfa gradient
Lines: #60a5fa (top), #86efac (bottom)
Badge: #f472b6 circle with "S" in #1a1a2e
```

### Alternative Concepts

**Concept A: "Branching Dialogue"**
```
    ╱───
───●
    ╲───
```
A node with branching paths, representing choice-driven narrative.

**Concept B: "Therapy Session"**
```
  ┌─────┐
  │ 🛋️  │
  │     │
  └─────┘
```
Stylized therapy couch or two chairs facing each other.

**Concept C: "Script Page"**
```
  ┌─────┐
  │≡≡≡≡≡│
  │ > ≡ │
  │ > ≡ │
  └─────┘
```
Document with response markers (`>`).

---

## Implementation Checklist

### Required Icons

- [ ] `images/sdns-icon.png` (128x128) - Marketplace icon
- [ ] `images/sdns-icon@2x.png` (256x256) - High-res marketplace
- [x] `images/sdns-file-dark.svg` - File icon (dark theme) - Created
- [x] `images/sdns-file-light.svg` - File icon (light theme) - Created

### Optional Icons

- [ ] `images/sdns-activity-bar.svg` - Activity bar icon
- [ ] `images/sdns-command.svg` - Command palette icon

---

## Production Notes

### Creating the PNG Icon

1. Design in vector software (Figma, Illustrator, Inkscape) at 512×512
2. Export as PNG at:
   - 128×128 for `sdns-icon.png`
   - 256×256 for high-res variant
3. Optimize with tools like TinyPNG or ImageOptim
4. Ensure transparency is preserved

### SVG Best Practices

1. Use `viewBox` for scalability
2. Keep paths simple and optimized
3. Use `currentColor` for theme-adaptive icons
4. Remove unnecessary metadata
5. Test at multiple sizes (16, 24, 32, 48px)

### Accessibility

- Ensure sufficient contrast (4.5:1 minimum)
- Icons should be recognizable at small sizes
- Avoid relying solely on color to convey meaning

---

## Figma/Design Tool Specifications

For designers creating these assets:

```
Frame: 128×128px
Background: 
  - Type: Linear Gradient
  - Angle: 135°
  - Stop 1: #1a1a2e at 0%
  - Stop 2: #16213e at 100%
  - Corner Radius: 20px

Chat Bubble:
  - Stroke: 4px
  - Stroke Style: Gradient (#f472b6 → #a78bfa)
  - Fill: None
  - Drop Shadow: 0 4px 12px rgba(244, 114, 182, 0.3)

Text Lines:
  - Height: 4px
  - Corner Radius: 2px
  - Colors: #60a5fa, #86efac

Badge:
  - Size: 24×24px
  - Position: Bottom-right, 12px from edges
  - Background: #f472b6
  - Text: "S" in #1a1a2e, 14px bold
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial design document |

---

*This document should be updated whenever icon designs are modified or new icons are added to the extension.*
