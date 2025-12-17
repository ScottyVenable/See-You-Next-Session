# Contributing to See You Next Session

Thank you for your interest in contributing to "See You Next Session"!

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)

## Code of Conduct

This project is built with respect and sensitivity toward mental health topics. All contributors must:
- Treat mental health subjects with care and accuracy
- Avoid stigmatizing language or stereotypes
- Be open to feedback on sensitive content
- Maintain a supportive community environment

## How Can I Contribute?

### Reporting Bugs
1. Check existing issues first
2. Use the bug report template
3. Include reproduction steps
4. Attach screenshots if relevant

### Suggesting Features
1. Open a discussion first for major features
2. Describe the use case and expected behavior
3. Consider the scope (we're aiming for MVP!)

### Art Contributions
- Contact Kiki (Art Director) before starting work
- Follow the established art style guide
- Submit work in the required formats (PNG for sprites)

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git
- A code editor (VS Code recommended)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/see-you-next-session.git

# Navigate to project
cd see-you-next-session

# Install dependencies
npm install

# Start dev server
npm run dev
```

The game will open at `http://localhost:5173`

### Project Structure

See [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) for detailed information about the project organization.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run tauri:dev    # Start Tauri development
npm run tauri:build  # Build desktop application
```

### First Time Contributors

If this is your first contribution:

1. **Read the documentation**
   - [README.md](../README.md) - Project overview
   - [DIRECTORY_STRUCTURE.md](../DIRECTORY_STRUCTURE.md) - File organization
   - [Game Design Document](../Documents/design/GAME_DESIGN_DOCUMENT.md) - Game mechanics

2. **Explore the codebase**
   - Run the game and play through a session
   - Look at existing components in `src/components/`
   - Check out the SDNS scripting in `src/patients/gregory/`

3. **Look for "good first issue" labels**
   - These are beginner-friendly tasks
   - Ask questions if anything is unclear

4. **Join the discussion**
   - Comment on the issue you want to work on
   - Get feedback before starting major work

## Branch Naming

Use these prefixes for branches:

| Prefix | Purpose |
|--------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code improvements |
| `docs/` | Documentation |
| `art/` | Art assets |
| `experiment/` | Experimental features |

Examples:
- `feature/ink-integration`
- `fix/synthesis-slot-layout`
- `art/patient-sprites`

## Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, CSS
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(dialogue): add branching conversation support
fix(ui): correct synthesis slot alignment
docs: update README with tech stack
```

## Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** locally
3. **Link related issues** using keywords (`Fixes #123`)
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Checklist
- [ ] Code follows project style
- [ ] Self-reviewed my changes
- [ ] Added comments for complex logic
- [ ] No console.log or debug code
- [ ] Tested on different browsers (if UI)

## Style Guides

### JavaScript/React
- Use functional components with hooks
- Prefer named exports for components
- Use descriptive variable names
- Add JSDoc comments for complex functions
- No emojis in code comments or documentation
- Use `const` by default, `let` only when reassignment is needed
- Destructure props at the top of components
- Keep components focused and single-purpose

**Example:**
```jsx
// Good
export const DialogueBox = ({ text, speaker, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    
    return (
        <div className="dialogue-box">
            <span className="speaker">{speaker}</span>
            <p>{text}</p>
        </div>
    );
};

// Avoid
export default function DialogueBox(props) {
    // Accessing props.text repeatedly
    // No destructuring
}
```

### CSS
- Use CSS variables from `main.css` for colors and spacing
- Follow BEM-ish naming when not using styled-components
- Keep specificity low
- Mobile-first is nice but not required for MVP
- Group related properties together
- Use meaningful class names

**Example:**
```css
/* Good - Uses CSS variables and clear naming */
.dialogue-box {
    background: var(--panel-bg);
    border: 1px solid var(--border-color);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}

/* Avoid - Magic numbers and unclear naming */
.box {
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 16px;
}
```

### File Organization
- Components: PascalCase (e.g., `DialogueBox.jsx`)
- Utilities: camelCase (e.g., `helpers.js`)
- Styles: kebab-case (e.g., `main-menu.css`)
- Data: camelCase (e.g., `patients.js`)
- Session files: kebab-case (e.g., `session-1.session`)

### Documentation
- Use Markdown for all documentation
- Include "Last Updated" date in document headers
- Keep line length reasonable (80-100 characters when possible)
- Use code blocks with language identifiers
- No emojis - use text alternatives
- Update [CHANGELOG.md](../CHANGELOG.md) when making changes

### SDNS Scripting
If contributing dialogue content:
- Follow the [SDNS Reference](../src/sdns/SDNS_REFERENCE.md)
- Test session files in the game before committing
- Use consistent indentation (4 spaces)
- Add comments for complex dialogue flows

---

## Testing Your Changes

### Manual Testing
1. **Run the game locally**
   ```bash
   npm run dev
   ```

2. **Test your specific feature**
   - Follow the user flow
   - Check for console errors
   - Verify UI updates correctly

3. **Test edge cases**
   - What happens with missing data?
   - What if the user clicks rapidly?
   - Does it work at different screen sizes?

### Browser Testing
Test in at least:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if possible)

### Desktop Build Testing
If you modified Tauri-specific code:
```bash
npm run tauri:dev
```

---

## Common Issues and Solutions

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

### ESLint errors
```bash
# Auto-fix what's possible
npm run lint -- --fix
```

---

## Security Guidelines

### Do NOT commit:
- API keys or tokens
- Database credentials
- Personal information
- `.env` files (use `.env.example` as template)

### Mental Health Content Guidelines
When creating content involving mental health:
- Research thoroughly - consult the DSM-5
- Avoid stereotypes and stigmatizing language
- Present symptoms accurately
- Include appropriate disclaimers
- Be sensitive to lived experiences

### Reporting Security Issues
If you find a security vulnerability:
1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Include details about the vulnerability
4. Wait for confirmation before disclosing

---

## Getting Help

### Resources
- [Documentation Index](../Documents/INDEX.md)
- [Technical Architecture](../Documents/technical/TECHNICAL_ARCHITECTURE.md)
- [Directory Structure Guide](../DIRECTORY_STRUCTURE.md)
- [SDNS Reference](../src/sdns/SDNS_REFERENCE.md)

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Pull Request Comments** - Code review feedback

### Response Times
- Bug reports: Usually within 48 hours
- Feature requests: May take longer, be patient!
- Pull requests: Reviewed within a week

---

## Recognition

Contributors will be:
- Listed in [CHANGELOG.md](../CHANGELOG.md) for their contributions
- Mentioned in release notes for significant features
- Added to project credits (with permission)

---

## Questions?

- Open a GitHub Discussion
- Comment on related issues
- Reach out to the maintainers

Thank you for helping make this game a reality!
