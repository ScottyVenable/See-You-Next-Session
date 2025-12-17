# See You Next Session - TODO

---

## [COMPLETED] Dialogue System

- [x] **Dialogue Tree System** - DialogueSelector with 3D layered buttons, topic categories (Family, Work, Relationships, Emotions, Self), and sub-option prompts with spring animations
- [x] **Keyboard Shortcuts** - Press 1-5 to select topics, Escape to close panel
- [x] **Focus Cost System** - Dialogue options now have focus costs displayed with lightning badge, grayed out if insufficient focus
- [x] **Keyword Context Menu** - Right-click on keywords shows animated dropdown with "Create Text Token," "Ask About This," "Highlight in Handbook," and "Explore Further" (for background keywords)
- [x] **Context Menu Actions** - onAskAbout, onHighlightInHandbook, onExploreBackground callbacks now wired up
- [x] **Keyword Type Classification** - Auto-detects keyword types: duration, intensity, behavior, emotion, background, contradiction, general
- [x] **Keyword Pop Animation** - Spring-based pop-in animation when keywords appear in dialogue
- [x] **Keyword Counter** - Shows collected/total keywords per dialogue segment (key icon 2/5 style)
- [x] **Mood Chip Display** - Shows "Appears [mood]" text chip with emoji and tooltip
- [x] **Clinical vs Casual Descriptions** - Mood tooltip shows different text based on Focus Mode (casual impressions vs clinical observations)
- [x] **Typewriter Effect** - Text types out with intelligent bracket handling to hide keyword markers during animation
- [x] **Dialogue Progress Dots** - Visual indicator showing current position in multi-part dialogue
- [x] **Draggable Keywords** - Collected keywords can be dragged to clipboard/handbook
- [x] **Keyword Hint Bar** - Shows "Click highlighted words to collect them as evidence" when uncollected keywords exist
- [x] **Selected Prompt Indicator** - Shows "You asked: [question]" after selecting a dialogue option
- [x] **Smaller Dialogue Font** - Reduced from 1.1rem to 0.95rem for cleaner look

---

## [COMPLETED] UI/UX

- [x] **Focus Mode Cursor** - Magnifying glass cursor when in Focus Mode
- [x] **Keyword Font Styles** - Different visual styles for keyword types (duration, intensity, behavior, etc.)
- [x] **Dev Console** - Toggle with ~ key, shows game state, supports cheat commands
- [x] **Disclaimer Popup** - Shows on new game start with "Don't show again" checkbox

---

## [IN PROGRESS] Dialogue System

- [ ] **Background Keywords** - Keywords like "recent breakup," "lost job" that unlock special dialogue options or handbook insights
- [ ] **Missed Keyword Consequences** - Determine penalty for missing keywords (focus drain? mood change? just no token?)
- [ ] **Ask About Symptom** - Pre-written questions for each symptom with patient responses

---

## [TODO] UI/UX Features

1. Have the "Synthesis Zone" be contained inside the Clipboard expanded view, rather than a separate area
2. When expanding a section, instead of modal panel, expand to fill full right side panel
3. Less "flash game" looking, more "professional indie game" aesthetic overall
4. Reformat Patient Select to email inbox style - emails from clients requesting sessions with subject line (name) and body (intro + context)
5. ~~Make dialogue text 12pt font instead of current size~~ [DONE] (reduced to 0.95rem)
6. Main Menu buttons spacing - too close together currently

---

## [TODO] Handbook Features

7. Drag observations/keywords onto disorder entries to highlight relevant sections
8. Symptom tooltips with "Ask about this symptom" option - pre-written questions and patient responses
9. [IDEA] Disorder progress bar showing observed symptoms vs total, creating "Confidence Level" metric
10. Knowledge progress bar based on correct diagnoses in previous sessions, upgradeable with knowledge points

---

## [TODO] Progression System

11. Create detailed "Skill Tree" document:
    - Knowledge points from successful sessions
    - Abilities: Reduced Focus Cost, Increased Starting Focus, Bonus Diagnosis Points
    - Multiple tiers with increasing costs/benefits
    - Specialization branches (Anxiety Specialist, Mood Disorder Specialist, etc.)
    - Example: Anxiety Specialist → bonus diagnosing anxiety → unlock specific skills

---

## [TODO] Audio

12. Different sound effects for text tokens vs visual tokens
13. Focus Mode ambient sounds (heartbeat, breathing) for immersion

---

## [TODO] Documentation

14. Create detailed post-MVP expansion document:
    - New patient types and disorders
    - Multiplayer/co-op modes
    - VR support possibilities
    - Modding capabilities
    - Include: descriptions, gameplay mechanics, estimated dev time

---

## [DEV] Console Features

- [ ] Markdown and multiline support for output
- [ ] "Detach" icon to drag console around
- [ ] Separate menu tabs: buttons, quick cheats, testing features, diagnostics
- [ ] More robust command implementations
- [ ] Error handling with automatic adjustments for code changes

---

## [BUGS]

1. Can't drag keywords to clinical handbook from dialogue box/notebook
2. ~~Typewriter animation shows brackets [keyword] before fully displayed~~ [FIXED]
3. ===TAG=== blocks not recognized in .session files or just not styled correctly.
4. -> goto tag not recognized in .session files or just not styled correctly.
5. 

---

## SLOPPY TODO AND NOTES
*These are todo items and notes that need to be organized to the above sections later.*

1. Implement some form of preview mode for this todo list that shows which items are completed/in-progress/pending and allows me to check them off easily and add more items quickly and efficiently. I like markdown checklists but they are a bit clunky for this purpose and don't allow easy checking off items when completed (I hate having to add an x to the brackets manually). Maybe a simple web app todo (in one file preferibly) that reads/writes markdown files with checklists and has a nice UI for managing them along with a easy console command to open it from the game dev console directly/or from a script in the project folder.
2. Ensure that all completed items are added to a version history log somewhere for reference later on. Remember that versions are numbered by their commit hash in git so I need to keep a changelog that maps version numbers to commit hashes and dates along with a brief description of changes made in that version for reference later on.
3. We could find a better way to establish version numbers, but github hash numbers are the easiest way to do it for now and automatic. The format right now is to use the branch name followed by the first 7 characters of the commit hash (e.g., stable-1a2b3c4). A good idea could be to have a script that automatically generates a changelog file from git commit messages and tags/releases?!
4. Update instruction prompt file to be up to date and more expansive while also efficient.
5. Find a way to make this project more contributor friendly for developers/volunteers.
6. Create a detailed assessment of vulnerabilities with this project and its codebase to ensure security and stability for future use cases or potential open sourcing. Also assess the code for potential refactoring or improvements to make it more modular and reusable for other projects or open source contributions.
7. Assess the directory structure and organization of files to ensure scalability and maintainability as the project grows. Create a document outlining best practices for adding new features or modules to keep the codebase clean and organized.
8. Ensure a system where if we add features to the game or change existing ones, we have a way to track these changes and their impact on gameplay balance and user experience. This could be in the form of a feature log or change impact analysis document. We need to also make sure that the game does not break or become unbalanced with new additions. Automatic testing could help with this as well as auto adjustments in the codebase???
9. Add to the instruction prompt file to not use any commands in the "DEV SERVER" terminal because that is only used for running the game's development server and not for actual game code or logic. This is important to avoid confusion and potential errors when running the game or testing features.
10. **CRITICAL** -- Remove ALL emojis from code comments and documentation files because they can cause encoding issues or confusion when reading the files in different environments or text editors. Stick to plain text for clarity and compatibility. Add instructions in the prompt file to avoid using emojis in any code comments or documentation files.
11. Make a plan for implementing various aspect ratios and screen sizes for the game to ensure compatibility across different devices and resolutions. This could include responsive UI design, scalable graphics, and adaptable layouts.
12. Come up with a plan in case we move from React to another framework or engine in the future. This could include modularizing code, separating game logic from UI components, and using standard data formats for game assets and configurations. Unity is our most likely candidate if we move away from React. This needs to be planned carefully to avoid major rewrites later on (some may be unavoidable though due to Unity being in C# and React in mostly Javascript, CSS).
13. Work on the Wiki in the GitHub repository to ensure that all documentation is up to date and comprehensive for future contributors or team members. This could include setup instructions, coding standards, feature overviews, and troubleshooting guides as well as game information for players (lore, characters, disorders, etc.) and anything else relevant to the project. This would be most helpful for Kiki to reference when writing and designing the game content.

## [BUILD] Requirements

- Must be uploadable to Itch.io
- Frequent testing with real-time preview
