# Directory Structure Guide

> **Version:** 0.2.0  
> **Last Updated:** December 17, 2025  
> **Purpose:** Guide for understanding and maintaining project organization

---

## Overview

This document describes the directory structure of "See You Next Session," explains the purpose of each directory, and provides best practices for adding new features or content.

---

## Root Directory Structure

```
See-You-Next-Session/
├── .github/                    # GitHub-specific files
├── .vscode/                    # VS Code settings and extensions
├── Documents/                  # Project documentation
├── portal/                     # Admin/developer portal (separate app)
├── src/                        # Main game source code
├── src-tauri/                  # Tauri desktop build configuration
├── tools/                      # Development utilities
├── CHANGELOG.md                # Version history
├── DIRECTORY_STRUCTURE.md      # This file
├── FIREBASE_SETUP.md           # Firebase deployment guide
├── LICENSE                     # MIT License
├── README.md                   # Project overview
├── firebase.json               # Firebase hosting config
├── package.json                # NPM dependencies and scripts
└── vite.config.js              # Vite build configuration
```

---

## Detailed Directory Descriptions

### `.github/`
GitHub-specific configuration and templates.

```
.github/
├── CONTRIBUTING.md             # Contributor guidelines
├── PULL_REQUEST_TEMPLATE.md    # PR template
├── instructions/               # GitHub Copilot instructions
└── prompts/                    # AI assistant prompts
```

**Best Practices:**
- Keep GitHub-specific workflows and templates here
- Update CONTRIBUTING.md when adding new development practices
- Keep instructions concise and up-to-date

---

### `.vscode/`
VS Code workspace settings and extensions.

```
.vscode/
├── extensions/                 # Custom VS Code extensions
│   └── syns-language/          # SDNS syntax highlighting
├── extensions.json             # Recommended extensions
├── settings.json               # Workspace settings
├── tasks.json                  # Build tasks
└── launch.json                 # Debug configurations
```

**Best Practices:**
- Add recommended extensions to `extensions.json`
- Keep settings minimal - don't enforce personal preferences
- Document custom extensions in their own README

---

### `Documents/`
All project documentation organized by purpose.

```
Documents/
├── INDEX.md                    # Documentation navigation
├── archive/                    # Legacy documents
├── content/                    # Game content specs
│   ├── PATIENT_ROSTER.md
│   └── patients/               # Individual patient docs
├── design/                     # Game design docs
│   └── GAME_DESIGN_DOCUMENT.md
├── planning/                   # Project planning
│   ├── TODO.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── LAYOUT_OPTIMIZATION_TODO.md
├── reference/                  # Reference materials
│   ├── ASSET_LIST.md
│   ├── SDNS_FUTURE_FEATURES.md
│   ├── UI_SKELETON.md
│   └── VISUAL_NOVEL_RESEARCH.md
└── technical/                  # Technical documentation
    ├── TECHNICAL_ARCHITECTURE.md
    └── UI_COMPONENTS.md
```

**Best Practices:**
- Keep documentation close to the features they describe
- Use consistent markdown formatting
- Add new documents to INDEX.md
- Archive obsolete docs instead of deleting them
- Include "Last Updated" date in document headers

**When to Add New Documents:**
- **content/** - New patient character sheets, story content
- **design/** - Major game system designs, mechanics
- **planning/** - Roadmaps, feature planning, task tracking
- **reference/** - Research, external references, asset specs
- **technical/** - Architecture changes, API documentation

---

### `src/`
Main game source code - React application.

```
src/
├── assets/                     # Static assets
│   ├── fonts/
│   └── ASSET_GUIDE.md
├── components/                 # React components
│   ├── game/                   # In-game UI components
│   ├── screens/                # Main screen components
│   └── ui/                     # Reusable UI components
├── context/                    # React Context providers
│   ├── GameContext.jsx         # Game state management
│   └── UIContext.jsx           # UI state management
├── data/                       # Game data and configuration
│   ├── keywords/               # Keyword definitions
│   ├── menu-options/           # Menu configuration
│   ├── patients/               # Patient data files
│   ├── config.js               # Game balance values
│   ├── disorders.js            # Disorder definitions
│   ├── rapport.js              # Rapport system config
│   └── symptoms.js             # Symptom definitions
├── dialogue/                   # Legacy dialogue system
├── patients/                   # Patient session files
│   └── gregory/                # Patient-specific content
├── sdns/                       # SDNS dialogue system
│   ├── vscode-extension/       # Syntax highlighting
│   ├── SDNS_REFERENCE.md       # Language documentation
│   ├── engine.js               # SDNS interpreter
│   ├── parser.js               # SDNS parser
│   └── loader.js               # Session file loader
├── styles/                     # CSS stylesheets
├── utils/                      # Utility functions
│   ├── ErrorHandler.js
│   ├── PatientLoader.js
│   ├── SaveManager.js
│   └── SoundManager.js
├── App.jsx                     # Root component
├── index.html                  # HTML template
└── main.jsx                    # Entry point
```

**Best Practices:**

#### **components/**
- **game/** - Game-specific UI (Clipboard, Handbook, PatientView, etc.)
- **screens/** - Full screen views (MainMenu, GameScreen, etc.)
- **ui/** - Reusable, generic UI components (buttons, modals, etc.)

**Naming Convention:**
- Components: PascalCase (e.g., `DialogueBox.jsx`)
- Utilities: camelCase (e.g., `helpers.js`)
- Styles: kebab-case (e.g., `main-menu.css`)

**When Adding Components:**
1. Is it game-specific? → `game/`
2. Is it a full screen? → `screens/`
3. Is it reusable UI? → `ui/`

#### **data/**
Configuration and static game data.

**File Types:**
- `.js` files export JavaScript objects
- Keep data separate from logic
- Use clear, descriptive object structures

**When to Add Data Files:**
- New game systems → New config file
- Patient content → `patients/` directory
- System configuration → `config.js`

#### **sdns/**
SDNS (See You Next Session) dialogue scripting system.

**Key Files:**
- `engine.js` - Interprets SDNS scripts
- `parser.js` - Parses SDNS syntax
- `loader.js` - Loads .session files
- `SDNS_REFERENCE.md` - Language documentation

**When to Modify:**
- Adding SDNS features → Update engine, parser, and docs
- New dialogue syntax → Update parser and reference
- Bug fixes → Test with existing session files

#### **styles/**
CSS stylesheets organized by component.

**Naming Convention:**
- One stylesheet per major component
- Use kebab-case for filenames
- `main.css` contains global styles and CSS variables

**Best Practices:**
- Use CSS variables from `main.css` for theming
- Keep component styles scoped
- Avoid !important unless absolutely necessary
- Use BEM-ish naming when not using styled-components

#### **utils/**
Utility functions and helper classes.

**When to Add Utils:**
- Cross-cutting concerns (error handling, saving, etc.)
- Reusable helper functions
- Integration with external services

**Keep Utils Pure:**
- Avoid side effects when possible
- Document function signatures
- Add JSDoc comments for complex functions

---

### `src-tauri/`
Tauri configuration for desktop builds.

```
src-tauri/
├── capabilities/               # Tauri security capabilities
├── icons/                      # Application icons
├── src/                        # Rust backend code
├── Cargo.toml                  # Rust dependencies
└── tauri.conf.json             # Tauri configuration
```

**Best Practices:**
- Only modify when adding desktop-specific features
- Test desktop builds before committing changes
- Update icons when branding changes

---

### `portal/`
Separate admin/developer portal application.

```
portal/
├── src/                        # Portal source code
├── index.html                  # Portal HTML
├── package.json                # Portal dependencies
└── vite.config.js              # Portal build config
```

**Purpose:**
- Content management tools
- Development utilities
- Analytics dashboard (future)

**Best Practices:**
- Keep portal independent from main game
- Can have different dependencies than main app
- Useful for non-technical team members

---

### `tools/`
Development utilities and scripts.

```
tools/
├── open-todo.bat               # Windows script to open TODO
└── todo-manager.html           # TODO management UI
```

**Best Practices:**
- Add scripts that improve development workflow
- Document what each script does
- Make scripts cross-platform when possible

---

## Scalability Guidelines

### Adding New Features

1. **Plan the Structure First**
   - Will this need new data files?
   - New components?
   - New documentation?

2. **Follow Existing Patterns**
   - Look at similar features
   - Use consistent naming
   - Match the organization style

3. **Document as You Go**
   - Update relevant markdown files
   - Add comments to complex code
   - Update CHANGELOG.md

### Keeping Things Organized

**DO:**
- Keep related files together
- Use clear, descriptive names
- Group by feature/purpose
- Delete unused code
- Archive old docs instead of deleting

**DON'T:**
- Create "misc" or "utils" dumping grounds
- Mix concerns (data with components, etc.)
- Leave TODO comments indefinitely
- Commit temporary/test files
- Create deeply nested directories without reason

### File Size Guidelines

**When to Split Files:**
- JavaScript files > 500 lines → Consider splitting
- React components > 300 lines → Extract sub-components
- CSS files > 1000 lines → Split by section
- Data files > 1000 lines → Split by category

**Exceptions:**
- Complex state machines may be longer
- Generated files (icons, etc.)
- Configuration that should stay together

---

## Adding New Patients

Patients require files in multiple locations:

1. **Content Spec:** `Documents/content/patients/[name].md`
2. **Data File:** `src/data/patients/[name].js`
3. **Session Files:** `src/patients/[name]/[session].session`
4. **Assets:** `src/assets/patients/[name]/`

**Template:**
```
Documents/content/patients/jane-doe.md
src/data/patients/janeDoe.js
src/patients/jane-doe/
  ├── session-1.session
  ├── session-2.session
  └── README.md
```

---

## Adding New Game Systems

For major new systems (e.g., skill tree, minigames):

1. **Design Doc:** `Documents/design/[SYSTEM_NAME].md`
2. **Components:** `src/components/game/[SystemName]/`
3. **Data:** `src/data/[system-name]/`
4. **Styles:** `src/styles/[system-name].css`
5. **Context (if needed):** `src/context/[System]Context.jsx`

**Keep Systems Modular:**
- Separate data from logic
- Use Context for complex state
- Document the system's API
- Make it testable

---

## Version Control Best Practices

### What to Commit
- Source code and configuration
- Documentation
- Asset source files (if small)
- Package manifests

### What NOT to Commit
- `node_modules/`
- `dist/` or `build/`
- `.env` files (use `.env.example` instead)
- IDE-specific files (except `.vscode/`)
- Large binary assets (link to external storage)
- Temporary or test files

### .gitignore Sections
```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment
.env
.env.local

# IDE
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

---

## Maintenance Checklist

### Weekly
- [ ] Review open TODOs in code
- [ ] Update TODO.md with completed items
- [ ] Check for unused imports/files

### Monthly
- [ ] Update documentation dates
- [ ] Review and archive old docs
- [ ] Clean up test code
- [ ] Update dependencies (carefully)

### Before Major Releases
- [ ] Update CHANGELOG.md
- [ ] Verify all documentation is current
- [ ] Clean up console.log statements
- [ ] Review and optimize file structure
- [ ] Update README.md if needed

---

## Questions?

If you're unsure where something should go:

1. Check this document
2. Look for similar existing files
3. Ask in GitHub Discussions
4. Reference [CONTRIBUTING.md](.github/CONTRIBUTING.md)

---

## Related Documents

- [CHANGELOG.md](CHANGELOG.md) - Version history
- [CONTRIBUTING.md](.github/CONTRIBUTING.md) - Contribution guidelines
- [README.md](README.md) - Project overview
- [Documents/INDEX.md](Documents/INDEX.md) - Documentation index
- [Documents/technical/TECHNICAL_ARCHITECTURE.md](Documents/technical/TECHNICAL_ARCHITECTURE.md) - Technical details
