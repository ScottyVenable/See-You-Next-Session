# Ink Stories

This folder contains narrative scripts written in [Ink](https://www.inklestudios.com/ink/) for "See You Next Session."

## 📁 Structure

```
stories/
├── README.md           # This file
├── compiled/           # Compiled JSON files (auto-generated)
│   └── *.json
└── source/             # Source .ink files
    ├── tutorial.ink    # Tutorial patient (Anxiety)
    └── *.ink
```

## 🛠️ Workflow

### Writing Stories

1. **Download Inky**: [Get the editor](https://github.com/inkle/inky/releases)
2. **Write in Ink**: Create/edit `.ink` files in the `source/` folder
3. **Export JSON**: Use Inky to export to `compiled/` folder
4. **Import in React**: Load the JSON in your component

### Ink Syntax Quick Reference

```ink
// Basic text
Hello, I'm your patient today.

// Choices
* [Ask about sleep]
    "I haven't been sleeping well..."
    -> sleep_discussion
* [Ask about mood]
    "I've been feeling anxious..."
    -> mood_discussion

// Variables
VAR trust = 0
VAR discovered_insomnia = false

// Conditional text
{ trust > 3:
    "I feel like I can trust you..."
}

// Tags (we use these for game events!)
# token:insomnia
# mood:anxious
# animation:fidget
```

## 🏷️ Tag Conventions

We use tags to communicate with the game engine:

| Tag | Purpose | Example |
|-----|---------|---------|
| `token:xxx` | Award a token to player | `# token:insomnia` |
| `mood:xxx` | Change patient mood display | `# mood:anxious` |
| `animation:xxx` | Trigger patient animation | `# animation:fidget` |
| `sound:xxx` | Play a sound effect | `# sound:sigh` |
| `focus:+N` | Restore focus points | `# focus:+10` |
| `focus:-N` | Consume focus points | `# focus:-5` |
| `symptom:xxx` | Mark symptom as discovered | `# symptom:nail_biting` |

## 📝 Story Structure

Each patient story should have these knots:

```ink
=== start ===
// Initial greeting and setup

=== phase_1 ===
// First turn of dialogue

=== phase_2 ===
// Second turn

=== phase_3 ===
// Third turn

=== phase_4 ===
// Final turn / wrap-up

=== breakthrough ===
// When player finds contradiction

=== end_session ===
// Session conclusion
```

## 🔗 Resources

- [Ink Documentation](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md)
- [Inky Editor](https://github.com/inkle/inky/releases)
- [inkjs (JavaScript runtime)](https://github.com/y-lohse/inkjs)
