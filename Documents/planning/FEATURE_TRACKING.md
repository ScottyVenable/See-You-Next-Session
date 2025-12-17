# Feature Tracking System

> **Document Type:** Planning & Process  
> **Created:** December 17, 2025  
> **Last Updated:** December 17, 2025  
> **Purpose:** Guidelines for tracking feature development and their impact

---

## Overview

This document outlines how we track features, changes, and their impact on gameplay balance and user experience for "See You Next Session."

---

## Feature Lifecycle

Every feature goes through these stages:

```
[Concept] → [Design] → [Development] → [Testing] → [Released] → [Monitored]
```

### Stage Definitions

| Stage | Description | Documents Required | Responsible |
|-------|-------------|-------------------|-------------|
| **Concept** | Initial idea, rough scope | TODO entry | Anyone |
| **Design** | Detailed specification | Design doc or TODO details | Scott + Kiki |
| **Development** | Implementation | Code + comments | Scott (or contributors) |
| **Testing** | Validation and balance | Test notes | Scott |
| **Released** | Merged to main branch | CHANGELOG entry | Scott |
| **Monitored** | Observing impact | Playtesting notes | Scott + Kiki |

---

## Feature Categories

Features are categorized to help track their scope and impact:

### Core Systems
Major game systems that affect everything else.

**Examples:**
- Dialogue system (SDNS)
- Focus meter mechanics
- Synthesis system
- Rapport system

**Impact:** High - Changes affect multiple areas
**Testing Required:** Extensive
**Documentation:** Detailed design doc required

### UI/UX Features
Visual and interaction improvements.

**Examples:**
- Menu layouts
- Button animations
- Panel transitions
- Visual feedback

**Impact:** Medium - Affects user experience
**Testing Required:** Visual and usability testing
**Documentation:** Screenshots/mockups helpful

### Content Features
New patients, dialogue, disorders.

**Examples:**
- New patient characters
- Additional dialogue trees
- New disorders in handbook

**Impact:** Medium - Adds variety, doesn't change core mechanics
**Testing Required:** Balance and accuracy
**Documentation:** Content spec required

### Quality of Life
Small improvements that make the game better to play.

**Examples:**
- Keyboard shortcuts
- Better tooltips
- Save/load improvements
- Settings options

**Impact:** Low to Medium
**Testing Required:** Functional testing
**Documentation:** Brief description in TODO

### Bug Fixes
Corrections to existing functionality.

**Impact:** Varies
**Testing Required:** Verify fix doesn't break anything else
**Documentation:** Issue tracker + CHANGELOG

---

## Tracking Features

### 1. Planning Phase

**Location:** `Documents/planning/TODO.md`

Add feature to appropriate section:
- [IN PROGRESS] - Currently being worked on
- [TODO] - Planned, not started
- [COMPLETED] - Finished

**Required Information:**
```markdown
- [ ] Feature Name - Brief description
    - Purpose: Why we need this
    - Scope: What it includes/excludes
    - Depends on: Other features needed first
    - Estimated effort: Small/Medium/Large
```

**Example:**
```markdown
- [ ] Skill Tree System - Progression system with knowledge points
    - Purpose: Long-term progression and replayability
    - Scope: 3 specialization branches, 15 skills total
    - Depends on: Session scoring system
    - Estimated effort: Large (2 weeks)
```

### 2. Design Phase

For **Core Systems** and major features:

**Create Design Document:** `Documents/design/[FEATURE_NAME].md`

**Template:**
```markdown
# [Feature Name]

> **Status:** Design  
> **Owner:** [Name]  
> **Created:** [Date]

## Purpose
Why does this feature exist?

## User Stories
- As a [user], I want to [action] so that [benefit]

## Mechanics
How does it work?

## UI/UX
What does it look like?

## Technical Implementation
How will we build it?

## Balance Considerations
How does it affect difficulty/gameplay?

## Testing Plan
How will we validate it works?
```

For **smaller features**, detailed TODO entry is sufficient.

### 3. Development Phase

**Branch Naming:**
```
feature/skill-tree-system
fix/synthesis-slot-bug
refactor/dialogue-parser
```

**Commit Messages:**
```
feat(progression): add skill tree base structure
feat(progression): implement skill point allocation
feat(progression): add skill tree UI component
```

**Code Documentation:**
- Add comments for complex logic
- Document public APIs with JSDoc
- Keep inline TODOs to minimum
- Reference design doc in component header

### 4. Testing Phase

**Test Checklist:**
- [ ] Functional - Does it work as designed?
- [ ] Edge cases - What if user does unexpected things?
- [ ] Balance - Is it too easy/hard/boring?
- [ ] Performance - Does it cause lag?
- [ ] Integration - Does it break other features?
- [ ] Accessibility - Can all users interact with it?

**Document Results:**
- Create issue if bugs found
- Note in TODO if balance needs adjustment
- Add to "Known Issues" if deferring fix

### 5. Release Phase

**Update Documentation:**

1. **CHANGELOG.md**
   ```markdown
   ### Added
   - Skill Tree progression system with 15 unlockable abilities
   ```

2. **TODO.md**
   - Move from [TODO] to [COMPLETED]
   - Add completion date

3. **Git Tag** (for major features)
   ```bash
   git tag -a v0.3.0 -m "Add skill tree system"
   ```

### 6. Monitoring Phase

**Track Impact:**
- Playtesting feedback
- Balance issues discovered
- User confusion points
- Performance issues

**Document in:**
- TODO.md (if needs adjustment)
- GitHub Issues (if bugs found)
- Design doc (update with lessons learned)

---

## Balance Tracking

### What to Monitor

For each new feature, track:

1. **Difficulty Impact**
   - Does it make the game easier or harder?
   - By how much? (estimate percentage)
   
2. **Player Engagement**
   - Do players use this feature?
   - Do they understand it?
   - Do they find it fun?

3. **Pacing Impact**
   - Does it slow down or speed up gameplay?
   - Does it interrupt flow?

4. **Accessibility Impact**
   - Can all players use it?
   - Are there barriers?

### Balance Log Format

Keep notes in `Documents/planning/BALANCE_LOG.md`:

```markdown
## [Feature Name] - [Date]

**Intended Difficulty:** Medium
**Actual Difficulty:** Easy (Players completing 80% faster than expected)

**Changes Made:**
- Increased focus cost by 20%
- Reduced starting focus from 100 to 80
- Added cooldown to breakthrough rewards

**Result:** Players now completing at expected pace
```

---

## Impact Analysis

Before implementing major features, complete an impact analysis:

### Template

```markdown
## [Feature Name] Impact Analysis

### Positive Impacts
- What improves?
- What becomes possible?
- What becomes more fun?

### Negative Impacts
- What becomes harder?
- What might break?
- What might confuse players?

### Mitigation Strategies
- How do we address negative impacts?
- What's our backup plan?

### Success Metrics
- How do we know it's working?
- What are we measuring?
```

### Example

```markdown
## Timed Dialogue Impact Analysis

### Positive Impacts
- Adds tension and realism
- Prevents overthinking
- Makes game more challenging

### Negative Impacts
- May frustrate players who read slowly
- Could disadvantage accessibility needs
- Adds development complexity

### Mitigation Strategies
- Make timer optional (difficulty setting)
- Extend timer in accessibility mode
- Provide visual warning before timer expires
- Allow pausing during first playthrough

### Success Metrics
- Player completion rates don't drop >10%
- Accessibility feedback is positive
- Players report feeling engaged, not frustrated
```

---

## Automated Tracking (Future)

### Goals

1. **In-Game Changelog Viewer**
   - Display recent changes in game menu
   - Filter by category (UI, Dialogue, Content, etc.)
   - Show commit hash and date

2. **Feature Flag System**
   - Enable/disable features without code changes
   - A/B testing for balance changes
   - Gradual rollout of experimental features

3. **Analytics Dashboard** (if implemented)
   - Track feature usage
   - Monitor difficulty metrics
   - Identify pain points

### Implementation Plan

**Phase 1: Basic Tracking**
- [ ] Structured commit messages (already doing)
- [ ] Consistent CHANGELOG format (done)
- [ ] Feature tags in TODO (done)

**Phase 2: Automation**
- [ ] Script to generate changelog from commits
- [ ] Automated version numbering
- [ ] Release notes generator

**Phase 3: In-Game System**
- [ ] Changelog viewer in game menu
- [ ] Version info display
- [ ] "What's new" popup on first launch

**Phase 4: Advanced Analytics** (Post-MVP)
- [ ] Feature usage tracking (opt-in)
- [ ] Anonymous difficulty metrics
- [ ] Crash reporting

---

## Best Practices

### DO:
- Track all features, even small ones
- Update documentation as you work
- Test thoroughly before marking complete
- Monitor impact after release
- Learn from issues that arise

### DON'T:
- Add features without planning
- Skip documentation "for later"
- Assume balance is correct without testing
- Ignore user feedback
- Make breaking changes lightly

---

## Review Cycle

### Weekly Review
- Check in-progress features
- Update TODO priorities
- Address blocking issues

### Monthly Review
- Assess completed features
- Update balance as needed
- Archive outdated documentation
- Plan next month's features

### Release Review (Before MVP, v1.0, etc.)
- Complete feature freeze
- Final balance pass
- Documentation review
- Changelog finalization
- Playtesting sprint

---

## Related Documents

- [TODO.md](./TODO.md) - Current task tracking
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Long-term planning
- [CHANGELOG.md](../../CHANGELOG.md) - Version history
- [DIRECTORY_STRUCTURE.md](../../DIRECTORY_STRUCTURE.md) - Where to put things

---

## Questions?

When unsure about tracking:
1. Check this document
2. Look at previous features
3. Ask in GitHub Discussions
4. Over-document rather than under-document
