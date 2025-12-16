# SYNS Language Extension

Full language support for the **SYNS Dialogue Language** used in "See You Next Session".

## Features

### 🎨 Syntax Highlighting
Full TextMate grammar with semantic coloring for:
- Block headers (`=== name ===`)
- Speakers (PATIENT, THERAPIST, NARRATOR, SYSTEM)
- Moods (`(nervous)`, `(vulnerable)`, etc.)
- Directives (`@if`, `@reveal`, `@rapport`, etc.)
- Keywords (`[highlighted text]`)
- Strings, comments, numbers, and operators

### 🧠 IntelliSense
Smart completions for:
- **Directives** - Type `@` for directive suggestions with snippets
- **Speakers** - Full dialogue line templates
- **Moods** - Context-aware mood suggestions after speaker names
- **Blocks** - Auto-complete block names in goto statements
- **Variables** - `$variable` suggestions from document
- **Conditions** - Built-in functions and variables for `@if` blocks
- **Topics** - Response handler topic suggestions
- **Symptoms** - `@reveal`/`@unlock` target suggestions

### 🔍 Diagnostics
Real-time error checking for:
- ❌ Undefined goto targets
- ❌ Duplicate block definitions
- ❌ Unclosed `@if`/`@endif` blocks
- ❌ Orphan `@else`/`@elseif` without `@if`
- ❌ Invalid directive syntax
- ❌ Malformed `@rapport`/`@focus`/`@pause` values
- ⚠️ Unused blocks (configurable severity)
- ⚠️ Unclosed string literals
- 💡 Potentially undefined variables

### 📖 Hover Documentation
Hover over any element for documentation:
- Directive syntax and examples
- Speaker usage patterns
- Mood descriptions
- Block reference counts
- Variable definition locations

### 🔗 Go to Definition
- **F12** or **Ctrl+Click** on goto targets to jump to block definitions
- Works on `-> blockname` statements
- Jump to variable definitions (`$varname`)

### 📋 Outline View
Document structure in the Explorer sidebar:
- **Dialogue Blocks** - Normal flow blocks
- **Response Handlers** - `@response:` blocks
- **Breakthroughs** - `@breakthrough:` blocks  
- **Variables** - All `@set` definitions
- Nested goto references within blocks

### ⌨️ Snippets
16+ code snippets for rapid development:

| Prefix | Description |
|--------|-------------|
| `block` | New dialogue block |
| `patient` | Patient line with mood |
| `therapist` | Therapist dialogue |
| `narrator` | Narrator description |
| `response` | Response handler block |
| `breakthrough` | Breakthrough moment |
| `if` / `ifelse` | Conditional blocks |
| `ifrapport` | Rapport-based condition |
| `reveal` / `unlock` | State actions |
| `rapport` / `focus` | Meter changes |
| `goto` | Goto statement |
| `when` | Event trigger |
| `dialoguefile` | Full file template |

### ⚙️ Commands
- **SYNS: Validate Document** - Manual validation
- **SYNS: Go to Block** - Jump to block under cursor
- **SYNS: List All Blocks** - Quick pick navigation
- **SYNS: Show Output Log** - View extension logs

## Installation

### Method 1: Copy to Extensions Folder

1. Copy the `syns-language` folder to:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\`
   - **macOS/Linux**: `~/.vscode/extensions/`

2. Restart VS Code

### Method 2: Build from Source

```bash
cd .vscode/extensions/syns-language
npm install
npm run compile
```

Then copy to extensions folder and restart VS Code.

### Method 3: VSIX Package

```bash
npm install -g @vscode/vsce
cd .vscode/extensions/syns-language
vsce package
```

Then install the `.vsix` via VS Code's "Install from VSIX" command.

## Configuration

All settings are under `syns.*` in VS Code settings:

```json
{
    // Enable/disable diagnostics
    "syns.diagnostics.enabled": true,
    
    // Severity levels (error, warning, information, hint)
    "syns.diagnostics.severity.unusedBlock": "warning",
    "syns.diagnostics.severity.undefinedGoto": "error",
    "syns.diagnostics.severity.unclosedConditional": "error",
    
    // IntelliSense options
    "syns.intellisense.suggestMoods": true,
    "syns.intellisense.suggestBlocks": true,
    
    // Logging
    "syns.logging.enabled": false,
    "syns.logging.level": "info"  // debug, info, warn, error
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Go to block definition |
| `Ctrl+Shift+O` | List all blocks |
| `Ctrl+Space` | Trigger suggestions |

## Language Syntax Reference

### Blocks
```syns
=== block-name ===
=== @response:topic.subtopic ===
=== @breakthrough:topic ===
```

### Speakers & Dialogue
```syns
PATIENT (mood)
"Dialogue with [keywords] highlighted"

THERAPIST
"Response"

NARRATOR
*Action or description*
```

### Directives
```syns
@if rapport >= 60
@elseif has_symptom("insomnia")
@else
@endif

@reveal symptom-id
@unlock topic-id
@set variable = value
@rapport +10
@focus -5
@pause 1.5
```

### Flow Control
```syns
-> target-block

@when symptom_revealed:id
    // triggered content
@end
```

### Conditions
```syns
rapport >= 60
has_symptom("bags-under-eyes")
has_keyword("sleep")
has_breakthrough("sleep")
asked_about("family.parents")
$variable_name
```

## Troubleshooting

### Extension not activating
- Ensure file has `.syns` extension
- Check that extension is installed in correct location
- Restart VS Code

### No syntax highlighting
- Verify `syns.tmLanguage.json` exists in `syntaxes/`
- Check VS Code Developer Tools (Help > Toggle Developer Tools) for errors

### IntelliSense not working
- Ensure extension is compiled (`npm run compile`)
- Check Output panel (View > Output > SYNS Dialogue) for errors
- Enable logging: `"syns.logging.enabled": true`

### Diagnostics not showing
- Check `"syns.diagnostics.enabled": true` in settings
- Verify document is saved (some checks run on save)

## Contributing

This extension is part of the "See You Next Session" game project.

## License

MIT
