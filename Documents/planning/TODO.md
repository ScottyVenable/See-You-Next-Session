# TODO & Development Tracker

> **Document Type:** Planning & Tracking  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Status:** Active

---

## [COMPLETED] Features

### Dialogue System
- [x] DialogueSelector with 3D layered buttons
- [x] Topic categories (Family, Work, Relationships, Emotions, Self)
- [x] Sub-option prompts with spring animations
- [x] Keyboard shortcuts (1-5 for topics, Escape to close)
- [x] Focus cost system with lightning badge display
- [x] Grayed out options when insufficient focus
- [x] Keyword context menu (right-click)
- [x] Context menu actions (onAskAbout, onHighlightInHandbook, onExploreBackground)
- [x] Keyword type auto-classification
- [x] Keyword pop-in spring animation
- [x] Keyword counter per segment (key icon 2/5 style)
- [x] Mood chip display with emoji and tooltip
- [x] Clinical vs casual descriptions (Focus Mode toggle)
- [x] Typewriter effect with bracket handling
- [x] Dialogue progress dots
- [x] Draggable keywords to clipboard/handbook
- [x] Keyword hint bar
- [x] Selected prompt indicator ("You asked: [question]")
- [x] Optimized dialogue font size (0.95rem)

### UI/UX
- [x] Focus mode cursor (magnifying glass)
- [x] Keyword font styles by type
- [x] Dev console (~key toggle)
- [x] Disclaimer popup with "Don't show again"

### Core Systems
- [x] SDNS dialogue scripting system
- [x] SDNS parser and engine
- [x] Session file loading
- [x] Game context state management
- [x] Focus meter component
- [x] Rapport meter component
- [x] Turn clock component
- [x] Clipboard component
- [x] Synthesis zone component
- [x] Handbook component
- [x] Patient view with hotspots

---

## [IN PROGRESS]

### Dialogue System
- [ ] Background keywords unlocking special dialogue
- [ ] Missed keyword consequences
- [ ] "Ask About Symptom" pre-written questions

---

## [TODO] High Priority

### UI Layout Optimization (Art Production Blocker)
See [LAYOUT_OPTIMIZATION_TODO.md](./LAYOUT_OPTIMIZATION_TODO.md) for detailed specs.

1. [ ] **CRITICAL:** Lock Patient View dimensions for Kiki's art production
   - Define exact pixel dimensions for patient sprite area
   - Ensure dimensions stay consistent regardless of other UI changes
2. [ ] Implement drawer system for workstation panel
3. [ ] Move Synthesis Zone inside Clipboard expanded view
4. [ ] Expand sections to fill right panel (not modal overlays)

### UI/UX Improvements
5. [ ] Polish visual aesthetic (less "flash game")
6. [ ] Patient Select → Email inbox style
7. [ ] Main Menu button spacing fix

### Handbook Features
6. [ ] Drag observations onto disorder entries
7. [ ] Symptom tooltips with "Ask about this" option
8. [ ] Disorder progress/confidence meter
9. [ ] Knowledge progress from past sessions

---

## [TODO] Medium Priority

### Progression System
10. [ ] Skill tree design document
    - Knowledge points from successful sessions
    - Abilities: Reduced Focus Cost, Increased Starting Focus
    - Specialization branches (Anxiety, Mood Disorders, etc.)

### Audio
11. [ ] Different SFX for text vs visual tokens
12. [ ] Focus Mode ambient sounds (heartbeat, breathing)

### Dev Console Enhancements
13. [ ] Markdown/multiline output support
14. [ ] Detachable/draggable window
15. [ ] Tabbed interface (buttons, cheats, testing, diagnostics)
16. [ ] More robust command system

---

## [TODO] Low Priority / Future

### Post-MVP Features
17. [ ] Create expansion document:
    - New patient types and disorders
    - Multiplayer/co-op modes
    - VR support possibilities
    - Modding capabilities

### SDNS Enhancements (see SDNS_Future_Features.md)
18. [ ] Session Creator GUI Tool
19. [ ] Dynamic dialogue conditions
20. [ ] Emotional state machine
21. [ ] VS Code extension improvements

---

## [BUGS]

| # | Bug Description | Status | Priority |
|---|-----------------|--------|----------|
| 1 | Can't drag keywords to handbook from dialogue box | Open | High |
| 2 | ~~Typewriter shows brackets before text~~ | Fixed | - |
| 3 | ===TAG=== blocks not recognized/styled in .session | Open | Medium |
| 4 | -> goto tag not recognized/styled in .session | Open | Medium |

---

## [BUILD] Requirements

- [ ] Uploadable to Itch.io
- [ ] Frequent testing with real-time preview
- [ ] Tauri build for desktop distribution
- [ ] Firebase hosting for web version

---

## 📅 Development History

### December 2025
- **Dec 14:** Initial GDD and documentation
- **Dec 15:** Dialogue system major update, keyword system
- **Dec 16:** SDNS system refinement, UI polish
- **Dec 17:** Documentation reorganization and update

---

## Related Documents

- [Development Roadmap](./DEVELOPMENT_ROADMAP.md)
- [SDNS Future Features](../reference/SDNS_FUTURE_FEATURES.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
