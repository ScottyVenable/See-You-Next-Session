# SDNS Language Support for VS Code

**Session Dialogue and Narration System** - Complete language support for `.session` dialogue files used in "See You Next Session".

## Features

### 🎨 Syntax Highlighting

Full syntax highlighting for SDNS dialogue files including:

- **Speakers** - `PATIENT`, `THERAPIST`, `NARRATOR`, `SYSTEM`
- **Moods** - `(nervous)`, `(confident)`, `(angry)`, etc.
- **Blocks** - `=== block-name ===`
- **Directives** - `@if`, `@reveal`, `@rapport`, `@focus`, etc.
- **Keywords** - `[tagged keywords]`
- **Actions** - `*action descriptions*`
- **Goto statements** - `-> target-block`
- **Comments** - `// single line` and `/* multi-line */`

### 💡 IntelliSense

Smart completions for:

- **Speakers** - Auto-complete speaker names at line start
- **Moods** - Mood suggestions after speaker names
- **Directives** - All `@` directives with descriptions
- **Functions** - Built-in condition functions (`has_keyword`, `has_symptom`, etc.)
- **Variables** - Game state variables (`rapport`, `focus`, `turn`)
- **Block References** - Auto-complete block names after `->`
- **Metadata Types** - Suggestions for keyword metadata

### 📝 Code Snippets

50+ snippets for rapid development:

| Prefix | Description |
|--------|-------------|
| `block` | New dialogue block |
| `response` | Response handler block |
| `breakthrough` | Breakthrough moment |
| `patient` | Patient dialogue with mood |
| `narrator` | Narrator action |
| `if` / `ifelse` | Conditional statements |
| `reveal` | Reveal directive |
| `rapport` | Rapport modifier |
| `choice` | Response choice |
| `header` | File header template |

Type the prefix and press `Tab` to expand!

### 🎭 Color Themes

Two beautiful themes optimized for SDNS:

- **SDNS Dark** - Dark theme with vibrant syntax colors
- **SDNS Light** - Light theme for daytime coding

### 🔍 Navigation

- **Go to Definition** - `Ctrl+Click` on `-> block-name` to jump to that block
- **Document Outline** - See all blocks in the Outline view
- **Folding** - Collapse blocks and conditional sections

### ✅ Editor Features

- Bracket matching and auto-closing
- Comment toggling (`Ctrl+/`)
- Smart folding for blocks
- Auto-indentation
- Word wrap enabled by default

## Installation

### From VSIX (Recommended)

1. Download the latest `.vsix` file from Releases
2. Open VS Code
3. Go to Extensions (`Ctrl+Shift+X`)
4. Click `...` menu → "Install from VSIX..."
5. Select the downloaded file

### From Source (Development)

1. Clone or copy the extension folder
2. Install dependencies:
   ```bash
   cd src/sdns/vscode-extension
   npm install
   ```
3. Compile TypeScript:
   ```bash
   npm run compile
   ```
4. Package the extension:
   ```bash
   npm run package
   ```
5. Install the generated `.vsix` file

### Quick Development Symlink

**Windows (PowerShell as Admin):**
```powershell
cmd /c mklink /D "$env:USERPROFILE\.vscode\extensions\sdns-lang" "C:\path\to\src\sdns\vscode-extension"
```

**Mac/Linux:**
```bash
ln -s /path/to/src/sdns/vscode-extension ~/.vscode/extensions/sdns-lang
```

Then reload VS Code (`Ctrl+Shift+P` → "Developer: Reload Window").

## Configuration

The extension provides several settings:

```json
{
    "sdns.validation.enabled": true,
    "sdns.validation.checkBlockReferences": true,
    "sdns.validation.checkKeywordUsage": true,
    "sdns.suggestions.showMoods": true,
    "sdns.suggestions.showDirectives": true
}
```

## Example Syntax

```sdns
// Patient greeting block
=== greeting ===

PATIENT (nervous)
"Um, hello. I'm not really sure how this works."

NARRATOR
*Gregory fidgets with his sleeve, avoiding eye contact.*

@if rapport >= 50
    PATIENT (opening up)
    "I've been meaning to talk to someone about this for [a while now]."
    
    @rapport +5
    @reveal symptom:hesitation-to-seek-help
@else
    PATIENT (guarded)
    "I'm not sure how much I should say."
@endif

// Response options for therapist
> "Welcome, Gregory. Let's take things at your pace."
    @rapport +5
    PATIENT (relieved)
    "Thank you. That's... that's good to hear."
    -> introduction

> "Tell me what brought you here today."
    @reveal symptom:social-anxiety
    -> presenting_problem
```

## Snippet Examples

### Quick Patient Dialogue
Type `patient` + Tab:
```sdns
PATIENT (nervous)
"dialogue here"
```

### Response Handler
Type `response` + Tab:
```sdns
=== @response:topic.subtopic ===
@if rapport >= 50
    PATIENT (vulnerable)
    "High rapport response"
    
    @rapport +5
@else
    PATIENT (guarded)
    "Low rapport response"
    
    @rapport +2
@endif
```

### Multiple Choices
Type `choices` + Tab:
```sdns
> "First option"
    @rapport +3
    -> block1

> "Second option"
    @rapport +5
    -> block2

> "Third option"
    @rapport +2
    -> block3
```

## Language Reference

For complete documentation of the SDNS language syntax and features, see the `SDNS_REFERENCE.md` file in the project's `src/sdns/` folder.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+/` | Toggle line comment |
| `Ctrl+Shift+/` | Toggle block comment |
| `Ctrl+Click` | Go to block definition |
| `Ctrl+Space` | Trigger suggestions |
| `Ctrl+Shift+O` | Go to symbol (block) |

## Changelog

### 1.0.0 (December 2024)
- Initial release
- Full syntax highlighting with TextMate grammar
- IntelliSense with smart completions
- 50+ code snippets
- SDNS Dark and Light themes
- Document outline and navigation
- Folding support
- Go to definition for blocks

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - See the main project license.
