# See You Next Session - TODO

---

## ✅ COMPLETED - Dialogue System

- [x] **Dialogue Tree System** - DialogueSelector with 3D layered buttons, topic categories (Family, Work, Relationships, Emotions, Self), and sub-option prompts with spring animations
- [x] **Keyboard Shortcuts** - Press 1-5 to select topics, Escape to close panel
- [x] **Focus Cost System** - Dialogue options now have focus costs displayed with ⚡ badge, grayed out if insufficient focus
- [x] **Keyword Context Menu** - Right-click on keywords shows animated dropdown with "Create Text Token," "Ask About This," "Highlight in Handbook," and "Explore Further" (for background keywords)
- [x] **Context Menu Actions** - onAskAbout, onHighlightInHandbook, onExploreBackground callbacks now wired up
- [x] **Keyword Type Classification** - Auto-detects keyword types: duration, intensity, behavior, emotion, background, contradiction, general
- [x] **Keyword Pop Animation** - Spring-based pop-in animation when keywords appear in dialogue
- [x] **Keyword Counter** - Shows collected/total keywords per dialogue segment (🔑 2/5 style)
- [x] **Mood Chip Display** - Shows "Appears [mood]" text chip with emoji and tooltip
- [x] **Clinical vs Casual Descriptions** - Mood tooltip shows different text based on Focus Mode (casual impressions vs clinical observations)
- [x] **Typewriter Effect** - Text types out with intelligent bracket handling to hide keyword markers during animation
- [x] **Dialogue Progress Dots** - Visual indicator showing current position in multi-part dialogue
- [x] **Draggable Keywords** - Collected keywords can be dragged to clipboard/handbook
- [x] **Keyword Hint Bar** - Shows "Click highlighted words to collect them as evidence" when uncollected keywords exist
- [x] **Selected Prompt Indicator** - Shows "You asked: [question]" after selecting a dialogue option
- [x] **Smaller Dialogue Font** - Reduced from 1.1rem to 0.95rem for cleaner look

---

## ✅ COMPLETED - UI/UX

- [x] **Focus Mode Cursor** - Magnifying glass cursor when in Focus Mode
- [x] **Keyword Font Styles** - Different visual styles for keyword types (duration, intensity, behavior, etc.)
- [x] **Dev Console** - Toggle with ~ key, shows game state, supports cheat commands
- [x] **Disclaimer Popup** - Shows on new game start with "Don't show again" checkbox

---

## 🔧 IN PROGRESS - Dialogue System

- [ ] **Background Keywords** - Keywords like "recent breakup," "lost job" that unlock special dialogue options or handbook insights
- [ ] **Missed Keyword Consequences** - Determine penalty for missing keywords (focus drain? mood change? just no token?)
- [ ] **Ask About Symptom** - Pre-written questions for each symptom with patient responses

---

## 📋 TODO - UI/UX Features

1. Have the "Synthesis Zone" be contained inside the Clipboard expanded view, rather than a separate area
2. When expanding a section, instead of modal panel, expand to fill full right side panel
3. Less "flash game" looking, more "professional indie game" aesthetic overall
4. Reformat Patient Select to email inbox style - emails from clients requesting sessions with subject line (name) and body (intro + context)
5. ~~Make dialogue text 12pt font instead of current size~~ ✅ Done (reduced to 0.95rem)
6. Main Menu buttons spacing - too close together currently

---

## 📋 TODO - Handbook Features

7. Drag observations/keywords onto disorder entries to highlight relevant sections
8. Symptom tooltips with "Ask about this symptom" option - pre-written questions and patient responses
9. [IDEA] Disorder progress bar showing observed symptoms vs total, creating "Confidence Level" metric
10. Knowledge progress bar based on correct diagnoses in previous sessions, upgradeable with knowledge points

---

## 📋 TODO - Progression System

11. Create detailed "Skill Tree" document:
    - Knowledge points from successful sessions
    - Abilities: Reduced Focus Cost, Increased Starting Focus, Bonus Diagnosis Points
    - Multiple tiers with increasing costs/benefits
    - Specialization branches (Anxiety Specialist, Mood Disorder Specialist, etc.)
    - Example: Anxiety Specialist → bonus diagnosing anxiety → unlock specific skills

---

## 📋 TODO - Audio

12. Different sound effects for text tokens vs visual tokens
13. Focus Mode ambient sounds (heartbeat, breathing) for immersion

---

## 📋 TODO - Documentation

14. Create detailed post-MVP expansion document:
    - New patient types and disorders
    - Multiplayer/co-op modes
    - VR support possibilities
    - Modding capabilities
    - Include: descriptions, gameplay mechanics, estimated dev time

---

## 🛠️ Dev Console Features

- [ ] Markdown and multiline support for output
- [ ] "Detach" icon to drag console around
- [ ] Separate menu tabs: buttons, quick cheats, testing features, diagnostics
- [ ] More robust command implementations
- [ ] Error handling with automatic adjustments for code changes

---

## 🐛 BUGS

1. Can't drag keywords to clinical handbook from dialogue box/notebook
2. ~~Typewriter animation shows brackets [keyword] before fully displayed~~ ✅ Fixed

---

## 🚀 Build Requirements

- Must be uploadable to Itch.io
- Frequent testing with real-time preview
