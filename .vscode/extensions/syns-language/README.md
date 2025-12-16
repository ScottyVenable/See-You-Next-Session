# SYNS Language Extension

Syntax highlighting and snippets for the **SYNS Dialogue Language** used in "See You Next Session".

## Features

- **Syntax Highlighting** for `.syns` files
- **Code Snippets** for common dialogue patterns
- **Bracket Matching** and auto-closing
- **Folding** for dialogue blocks

## Installation

### Method 1: Workspace Extension (Recommended for Development)

1. Copy the entire `syns-language` folder to your VS Code extensions folder:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\`
   - **macOS/Linux**: `~/.vscode/extensions/`

2. Restart VS Code

### Method 2: Manual VSIX Package

1. Install `vsce`: `npm install -g @vscode/vsce`
2. Navigate to this folder
3. Run: `vsce package`
4. Install the generated `.vsix` file via VS Code

## Syntax Overview

### Blocks
```syns
=== block-name ===
```

### Speakers
```syns
PATIENT (nervous)
"Dialogue text with [keywords] highlighted"

THERAPIST
"Response text"

NARRATOR
*Action or description*
```

### Directives
```syns
@if rapport >= 60
@elseif has_symptom("anxiety")
@else
@endif

@reveal symptom-id
@unlock topic-id
@rapport +5
@focus -10
```

### Flow Control
```syns
-> goto-block
@when breakthrough:topic
@end
```

### Metadata
```syns
<contradicts:previous-statement>
<reveals:hidden-symptom>
```

## Snippets

| Prefix | Description |
|--------|-------------|
| `block` | Create a new dialogue block |
| `patient` | Patient dialogue line with mood |
| `therapist` | Therapist dialogue line |
| `narrator` | Narrator description |
| `response` | Response handler block |
| `ifrapport` | Conditional based on rapport |
| `if` | Basic conditional block |
| `ifelse` | Conditional with else |
| `reveal` | Reveal a symptom |
| `unlock` | Unlock a topic |
| `rapport` | Change rapport value |
| `focus` | Change focus value |
| `goto` | Go to another block |
| `when` | Event trigger block |
| `breakthrough` | Breakthrough moment |
| `dialoguefile` | Full file template |

## Color Scheme

The extension uses semantic highlighting:

- **Blocks** (`=== name ===`): Section headers
- **Speakers**: Type colors (PATIENT=class, THERAPIST=interface, NARRATOR=namespace)
- **Moods**: Parameter/constant colors
- **Directives**: Keyword colors
- **Keywords** (`[text]`): Attribute colors
- **Goto** (`-> target`): Tag colors
- **Variables** (`$var`, `rapport`): Variable colors
- **Strings**: String colors
- **Numbers**: Numeric constant colors
- **Comments**: Comment colors

## License

MIT - Part of "See You Next Session" game project.
