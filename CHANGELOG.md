# Changelog

All notable changes to "See You Next Session" will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project uses Git commit hashes as version identifiers.

## Version Numbering

This project uses the format: `branch-shortHash` (e.g., `main-1a2b3c4`)

- **branch**: Current branch name (main, stable, dev, etc.)
- **shortHash**: First 7 characters of the Git commit hash
- **Date**: Date of the commit

---

## [Unreleased]

### Documentation
- Removed all emojis from code comments and documentation files for better compatibility
- Archived legacy planning notes to `Documents/archive/`
- Created comprehensive CHANGELOG.md

---

## [0.2.0] - 2025-12-17

### Added
- SDNS (See You Next Session) dialogue scripting system
- Keyword extraction and classification system
- Context menu for keywords with multiple actions
- Keyword dragging functionality to clipboard/handbook
- Dialogue progress dots indicator
- Typewriter effect with intelligent bracket handling
- Mood chip display with clinical vs casual descriptions
- Focus Mode cursor (magnifying glass)
- Dev Console with ~ key toggle

### Completed Features
- DialogueSelector with 3D layered buttons
- Topic categories (Family, Work, Relationships, Emotions, Self)
- Sub-option prompts with spring animations
- Keyboard shortcuts (1-5 for topics, Escape to close)
- Focus cost system with lightning badge display
- Keyword pop-in spring animation
- Keyword counter per segment
- Selected prompt indicator

### Documentation
- Created comprehensive documentation structure in `Documents/`
- Added INDEX.md with navigation
- Technical Architecture documentation
- UI Components reference
- Development Roadmap
- Game Design Document

---

## [0.1.0] - 2025-12-14

### Added
- Initial React + Vite project setup
- Tauri configuration for desktop builds
- Firebase hosting setup
- GameContext state management
- Screen navigation system (Main Menu → Patient Select → Game → Report)
- Core UI components:
  - Main Menu
  - Patient Select
  - Game Screen layout
  - Session Report (placeholder)
- Patient View component with hotspots
- Focus Meter component
- Rapport Meter component
- Turn Clock component
- Clipboard component
- Synthesis Zone component
- Handbook component
- DialogueBox component

### Infrastructure
- ESLint configuration
- Build and deployment scripts
- Project structure and file organization

---

## Version History by Commit Hash

### Format
Each version can be referenced by its commit hash for precise tracking:

```
[branch-hash] YYYY-MM-DD - Brief description
```

### Recent Commits
- `copilot/improve-documentation-and-organization-51e4ffd` 2025-12-17 - Remove emojis from documentation
- `copilot/improve-documentation-and-organization-3b1ea1c` 2025-12-17 - Initial documentation improvements

---

## Types of Changes

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes
- **Documentation** - Documentation only changes
- **Performance** - Performance improvements

---

## Tracking Guidelines

When making changes:

1. **Document all changes** in this file under [Unreleased]
2. **Use descriptive commit messages** following conventional commits:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `style:` Code style/formatting
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

3. **Create version tags** for releases:
   ```bash
   git tag -a v0.2.0 -m "Version 0.2.0 - SDNS System Complete"
   git push origin v0.2.0
   ```

4. **Reference issues/PRs** in commit messages when applicable:
   - `Fixes #123` - Closes issue 123
   - `Related to #456` - References issue 456

---

## Future Automation

Potential improvements to changelog management:

1. **Automated Changelog Generation**
   - Script to parse git commit messages
   - Auto-generate changelog entries from commits
   - Filter by conventional commit types

2. **In-Game Changelog Viewer**
   - Display changelog in game menu
   - Filter by category (UI, Dialogue, Audio, etc.)
   - Search functionality
   - Significance levels (Major, Minor, Patch)

3. **Release Notes Generator**
   - Auto-generate release notes from changelog
   - Format for different platforms (GitHub, Itch.io, Discord)
   - Include screenshots/GIFs for visual changes

---

## Links

- [Development Roadmap](Documents/planning/DEVELOPMENT_ROADMAP.md)
- [TODO Tracker](Documents/planning/TODO.md)
- [Contributing Guidelines](.github/CONTRIBUTING.md)
- [Game Design Document](Documents/design/GAME_DESIGN_DOCUMENT.md)
