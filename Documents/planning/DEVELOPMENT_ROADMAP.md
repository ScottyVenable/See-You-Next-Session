# Development Roadmap

> **Document Type:** Planning  
> **Created:** December 14, 2025  
> **Last Updated:** December 17, 2025  
> **Team:** Scott (Lead Developer) + Kiki (Art Director/Writer)  
> **Goal:** Playable MVP with Tutorial Patient + Challenge Patient

---

## Current Status

**Phase:** MVP Development  
**Version:** 0.2.0  
**Engine:** React + Vite + Tauri (migrated from original Unity plan)

---

## Phase 1: Core Framework [COMPLETE]

**Goal:** Functional UI framework and state management

- [x] Set up React + Vite project
- [x] Configure Tauri for desktop builds
- [x] Set up Firebase for web hosting
- [x] Implement GameContext state management
- [x] Build screen navigation (Main Menu → Patient Select → Game → Report)
- [x] Create component architecture

---

## Phase 2: Dialogue System [COMPLETE]

**Goal:** Fully functional dialogue engine

- [x] Design SDNS scripting language
- [x] Build SDNS parser
- [x] Build SDNS engine
- [x] Implement keyword extraction
- [x] Create DialogueBox component
- [x] Implement DialogueSelector (topic selection)
- [x] Add typewriter effect
- [x] Implement mood indicators
- [x] Add keyword context menus
- [x] Implement keyword dragging

---

## Phase 3: Game Mechanics [IN PROGRESS]

**Goal:** Focus System, Synthesis, and Breakthroughs

- [x] Implement Focus Meter (UI)
- [x] Implement Rapport Meter (UI)
- [x] Implement Turn Clock (UI)
- [x] Build Clipboard (token storage)
- [x] Build Synthesis Zone (UI)
- [ ] Implement synthesis logic (contradiction matching)
- [ ] Implement breakthrough triggers
- [ ] Connect game state to SDNS conditionals
- [ ] Focus cost deductions working
- [ ] Rapport changes from dialogue

---

## Phase 4: Patient Content [TODO]

**Goal:** Complete content for Gregory (Tutorial)

- [x] Gregory character design document
- [x] Gregory appearance and symptoms defined
- [ ] Write all 4 turns of dialogue (SDNS)
- [ ] Define all keywords and categories
- [ ] Create breakthrough conditions
- [ ] Design contradiction puzzles
- [ ] Patient sprite placeholders
- [ ] Symptom overlay sprites

---

## Phase 5: UI Polish [TODO]

**Goal:** Professional visual aesthetic

- [ ] Finalize color palette and typography
- [ ] Improve game screen layout
- [ ] Patient Select → Email inbox redesign
- [ ] Synthesis Zone inside Clipboard
- [ ] Focus Mode visual effects
- [ ] Animation polish
- [ ] Sound effect integration

---

## Phase 6: Session Report [TODO]

**Goal:** End-of-session grading system

- [ ] Design report card UI
- [ ] Implement diagnosis submission
- [ ] Calculate session score
- [ ] Display grading (S/A/C/F)
- [ ] Show supervisor feedback
- [ ] Save progress

---

## Phase 7: Second Patient [STRETCH]

**Goal:** Add Patient 2 (Bipolar - Medium difficulty)

- [ ] Character design
- [ ] Write 4 turns of dialogue
- [ ] Manic/Depressed phase switching
- [ ] Complex breakthrough puzzles
- [ ] Unlock condition (complete Gregory)

---

## Phase 8: MVP Release [TODO]

**Goal:** Polished, playable build

- [ ] Comprehensive playtesting
- [ ] Bug fixes
- [ ] Balance tuning (Focus costs, difficulty)
- [ ] Build for web (Itch.io)
- [ ] Build for desktop (Windows)
- [ ] Create store page assets

---

## Timeline Estimate

| Phase | Duration | Target |
|-------|----------|--------|
| Phase 1-2 | Complete | Done |
| Phase 3 | 1-2 weeks | Early Jan 2025 |
| Phase 4 | 2 weeks | Mid Jan 2025 |
| Phase 5 | 1 week | Late Jan 2025 |
| Phase 6 | 1 week | Late Jan 2025 |
| Phase 7 | 2 weeks | Feb 2025 |
| Phase 8 | 1 week | Feb 2025 |

**MVP Target:** February 2025

---

## Risk Factors

| Risk | Mitigation |
|------|------------|
| Art asset delays | Use placeholder sprites, prioritize functionality |
| SDNS complexity | Keep initial content simple, expand later |
| Scope creep | Strict MVP feature set, defer nice-to-haves |
| Balance issues | Early playtesting, adjustable config values |

---

## Post-MVP Considerations

- Additional patients (3-5 total)
- Skill tree / progression system
- Sound design and music
- Advanced SDNS features
- Handbook completion rewards
- Achievement system
- Accessibility options

---

## Related Documents

- [TODO Tracker](./TODO.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Patient Roster](../content/PATIENT_ROSTER.md)
