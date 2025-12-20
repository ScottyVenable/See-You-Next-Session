# MVP Scope Document

> **Document Type:** Project Scope Definition  
> **Created:** December 20, 2025  
> **Authors:** Scott & Kiki  
> **Status:** Active Reference  
> **Target:** Itch.io Release (Web + Desktop)

---

## 1. MVP Definition

### What is the MVP?

The Minimum Viable Product (MVP) for "See You Next Session" is a **complete, polished experience** with one tutorial patient (Gregory) that demonstrates all core mechanics and provides 15-30 minutes of gameplay.

### MVP Goal

> A player should be able to:
> 1. Start a new game
> 2. Select Gregory as their patient
> 3. Complete a full 4-turn therapy session
> 4. Successfully diagnose Gregory with GAD
> 5. Receive a session grade
> 6. Feel they've played a complete game loop

---

## 2. In Scope (MVP Features)

### Core Mechanics - MUST HAVE

| Feature | Status | Priority |
|---------|--------|----------|
| Dialogue system with SDNS | Done | Critical |
| Keyword collection (text tokens) | Done | Critical |
| Focus Mode + visual symptoms | Partial | Critical |
| Synthesis/contradiction matching | Partial | Critical |
| Focus meter resource | Done | Critical |
| Rapport meter | Done | Critical |
| Turn-based session (4 turns) | Done | Critical |
| Diagnosis submission | Planned | Critical |
| Session grading (S/A/C/F) | Planned | Critical |

### Patient Content - MUST HAVE

| Feature | Status | Priority |
|---------|--------|----------|
| Gregory: Complete character | Partial | Critical |
| Gregory: Turn 1 dialogue | Done | Critical |
| Gregory: Turn 2 dialogue | Planned | Critical |
| Gregory: Turn 3 dialogue | Planned | Critical |
| Gregory: Turn 4 dialogue | Planned | Critical |
| Gregory: All keywords defined | Partial | Critical |
| Gregory: Visual symptoms | Partial | Critical |
| Gregory: Contradictions working | Partial | Critical |

### UI/UX - MUST HAVE

| Feature | Status | Priority |
|---------|--------|----------|
| Main menu | Done | Critical |
| Patient selection screen | Done | Critical |
| Game screen layout | Done | Critical |
| Dialogue box | Done | Critical |
| Clipboard (token storage) | Done | Critical |
| Clinical handbook | Done | Critical |
| Focus meter UI | Done | Critical |
| Dev console (for testing) | Done | High |
| Session report screen | Partial | Critical |
| Content disclaimer | Done | High |

### Quality of Life - SHOULD HAVE

| Feature | Status | Priority |
|---------|--------|----------|
| Save/load game state | Partial | High |
| Keyboard shortcuts | Done | Medium |
| Typewriter effect | Done | Medium |
| Mood indicators | Done | Medium |
| Keyword animations | Done | Medium |
| Focus mode cursor | Done | Low |
| Sound effects | Planned | Low |

---

## 3. Out of Scope (NOT for MVP)

### Deferred to Post-MVP

| Feature | Reason | Future Priority |
|---------|--------|-----------------|
| Additional patients | Gregory must be complete first | High |
| Skill tree/progression | Adds complexity | Medium |
| Multiple disorders per patient | Increases difficulty | Medium |
| Multiplayer/co-op | Major feature | Low |
| VR support | Platform expansion | Low |
| Mobile touch controls | Platform expansion | Medium |
| Modding support | Community feature | Low |
| Steam achievements | Platform-specific | Low |
| Voice acting | Cost/time prohibitive | Low |
| Advanced animations | Art time expensive | Low |

### Explicitly NOT Building

- No tutorial popups (learn by playing Gregory)
- No difficulty settings (Gregory IS easy mode)
- No multiple save slots (one save is fine)
- No settings menu (beyond basic volume if audio exists)
- No credits screen (add post-MVP)
- No achievements system
- No analytics/telemetry
- No account system/login
- No online features

---

## 4. Technical Scope

### Supported Platforms

| Platform | Priority | Build Method |
|----------|----------|--------------|
| Web (itch.io) | Primary | Vite build |
| Windows | Secondary | Tauri |
| macOS | Tertiary | Tauri |
| Linux | Tertiary | Tauri |

### Browser Support

| Browser | Support Level |
|---------|---------------|
| Chrome 90+ | Full |
| Firefox 90+ | Full |
| Safari 14+ | Full |
| Edge 90+ | Full |
| IE11 | None |
| Mobile browsers | Basic (not optimized) |

### Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 3 seconds |
| Dialogue transition | < 100ms |
| Focus mode toggle | < 50ms |
| Save/load | < 500ms |
| Memory usage | < 200MB |

---

## 5. Content Requirements

### Gregory's Complete Content

**Dialogue Volume:**
- Turn 1: ~50-100 dialogue nodes
- Turn 2: ~50-100 dialogue nodes
- Turn 3: ~75-125 dialogue nodes
- Turn 4: ~30-50 dialogue nodes
- Total: ~200-400 nodes

**Keywords:**
- Minimum: 15 unique keywords
- Target: 25-30 keywords
- Categories: Sleep, emotion, behavior, minimizing, perfectionism

**Contradictions:**
- Minimum: 3 working contradictions
- Target: 5-6 contradictions
- Each must trigger breakthrough dialogue

**Visual Symptoms:**
- Minimum: 4 observable symptoms
- Target: 7 symptoms (as defined in character sheet)

### Art Assets

| Asset | Status | Priority |
|-------|--------|----------|
| Gregory base sprite | Needed | Critical |
| Gregory mood variations (5) | Needed | Critical |
| Gregory symptom highlights | Needed | High |
| Office background | Needed | Medium |
| UI elements | Partial | Medium |
| Logo/title art | Needed | Low |

---

## 6. Quality Standards

### Must Pass Before Release

- [ ] Complete playthrough with no crashes
- [ ] All dialogue branches accessible
- [ ] All contradictions functional
- [ ] Correct diagnosis achievable
- [ ] Grading system works
- [ ] Save/load works
- [ ] No console errors during normal play
- [ ] Content warning displays
- [ ] UI readable at 1080p and 720p

### Nice to Have

- [ ] Smooth animations throughout
- [ ] Sound effects for key actions
- [ ] Polished visual design
- [ ] Keyboard fully navigable

---

## 7. Release Criteria

### Definition of Done

The MVP is complete when:

1. **Playable:** A new player can complete Gregory's session
2. **Winnable:** Correct diagnosis is achievable and satisfying
3. **Stable:** No game-breaking bugs
4. **Polished:** Core UX feels intentional, not placeholder
5. **Packaged:** Builds work for web and at least Windows

### Launch Checklist

- [ ] All MVP features implemented
- [ ] All critical bugs fixed
- [ ] Performance targets met
- [ ] Content warning implemented
- [ ] Itch.io page created
- [ ] Build uploaded and tested
- [ ] README with controls/how to play
- [ ] Screenshots/trailer (if possible)

---

## 8. What Success Looks Like

### MVP Success Metrics

| Metric | Target |
|--------|--------|
| Completion rate | >70% of players finish Gregory |
| Play time | 15-30 minutes average |
| Crash rate | <5% of sessions |
| Positive feedback | >60% positive reviews |

### Feedback to Gather

- Is the core loop fun?
- Is Gregory's story engaging?
- Are mechanics clear without tutorial?
- What features do players want next?
- Any confusion points?

---

## 9. Post-MVP Roadmap Preview

### Phase 2: Second Patient

- Add medium-difficulty patient
- New disorder (Depression or Social Anxiety)
- Expand handbook content
- Basic skill progression

### Phase 3: Polish & Expand

- Additional patients
- Sound design
- Visual polish
- Settings menu
- Multiple save slots

### Phase 4: Full Release

- 5+ patients
- Complete skill tree
- All planned UI features
- Steam release consideration

---

## 10. Decision Framework

### When in Doubt, Ask:

1. **Does Gregory need this to be playable?** No = Defer
2. **Can we ship without this?** Yes = Defer
3. **Will this take >1 day to implement?** Consider deferring
4. **Does this add complexity for users?** Probably defer
5. **Is this a "wouldn't it be cool if..."?** Definitely defer

### Red Flags (Stop and Reconsider)

- Adding new systems not in this document
- Scope creeping into "nice to have"
- Spending >2 days on non-critical features
- Building for patients that don't exist yet
- Optimizing before it works

---

## Related Documents

- [Gregory MVP Checklist](./GREGORY_MVP_CHECKLIST.md)
- [Game Design Document](../design/GAME_DESIGN_DOCUMENT.md)
- [Development Roadmap](./DEVELOPMENT_ROADMAP.md)
- [Technical Architecture](../technical/TECHNICAL_ARCHITECTURE.md)
