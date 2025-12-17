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

### CSS
- Use CSS variables from `main.css`
- Follow BEM-ish naming when not using styled-components
- Keep specificity low
- Mobile-first is nice but not required for MVP

### File Organization
- Components: PascalCase (e.g., `DialogueBox.jsx`)
- Utilities: camelCase (e.g., `helpers.js`)
- Styles: kebab-case (e.g., `main-menu.css`)
- Data: camelCase (e.g., `patients.js`)

---

## Questions?

- Open a GitHub Discussion
- Reach out to the maintainers

Thank you for helping make this game a reality!
