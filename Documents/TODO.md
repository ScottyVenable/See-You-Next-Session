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

## [TODO] Dialogue Timer System (Future Feature)

15. **Dialogue Response Timer** - A countdown timer for each dialogue turn that creates pressure to respond
    - Visual: Small ring/arc showing time remaining before needing to say something
    - Makes gameplay more realistic (therapists don't stare silently at clients for 3 minutes)
    - Toggleable in difficulty settings
    - **Consequences when timer runs out:**
      - Patient becomes more nervous (mood shift)
      - Rapport depletes slightly
      - After multiple silences: progressive dialogue changes ("Are you listening?" -> "Is everything okay?" -> patient becomes frustrated/leaves session)
    - Timer duration should vary by difficulty level

16. **Silence Penalty Progression** - Chain of events when player is repeatedly silent
    - First silence: Patient fidgets, slight rapport loss
    - Second silence: Patient asks if you're listening, moderate rapport loss
    - Third silence: Patient becomes visibly uncomfortable, significant rapport loss
    - Fourth+ silence: Patient considers leaving early, major rapport loss
    - Ultimate consequence: Patient ends session prematurely (fail state)

17. **Timer-Related Skill Upgrades** (part of Skill Tree system)
    - "Patient Patience" - Increases base timer duration
    - "Thoughtful Pause" - Ability to pause timer briefly using focus points
    - "Comfortable Silence" - Reduces rapport penalty from silence
    - "Recovery" - First silence per session has no penalty
    - Specialization: "Mindfulness Expert" - Timer pauses automatically during focus mode

---

## [TODO] UI/UX Features

1. Have the "Synthesis Zone" be contained inside the Clipboard expanded view, rather than a separate area
2. When expanding a section, instead of modal panel, expand to fill full right side panel
3. Less "flash game" looking, more "professional indie game" aesthetic overall
4. Reformat Patient Select to email inbox style - emails from clients requesting sessions with subject line (name) and body (intro + context)
5. ~~Make dialogue text 12pt font instead of current size~~ [DONE] (reduced to 0.95rem)
6. ~~Main Menu buttons spacing - too close together currently~~ [DONE]

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
- [ ] Make the contents and background opacity allowed to be adjusted with a slider.
- [ ] 

---

## [BUGS]

1. ~~Can't drag keywords to clinical handbook from dialogue box/notebook~~ [FIXED]
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
14. An automated system for version tracking/changelog in game which would automatically pull the data from the most recent commit hash and display it in the game menu or dev console for reference. This would help with debugging and tracking changes over time without manually creating change logs. We would need to make a changelog screen in the game menu that displays this information pulled from git and display it as a list of changes made in each version along with the commit hash and date, with the ability to filter by version or date range and search for specific changes or keywords as well as export the changelog to a text file for reference outside the game. Additionally in the filters, there should be chips for "Completed", "In Progress", and "Planned" to categorize changes based on their status. As well as a "chip selector" for different areas of the game (UI, Dialogue System, Audio, Progression, etc.) to filter changes by specific features or modules. This would be very useful for tracking the development progress and understanding the evolution of the game over time. Especially for players who might be looking for big UI changes for example or someone else interested in dialogue system improvements. We could then have the option to filter based on it's "significance" to the user (e.g., major changes, minor tweaks, bug fixes, etc.) to help users quickly find relevant updates based on their interests or needs. We would then need to make sure we have a very structured commit message format to ensure consistency and clarity in the changelog entries and come up with how we are able to parse the data from git commit messages to extract this information accurately and efficiently for display in the game menu which would be in CSS and Javascript/React.
15. **CRITICAL** rename most of the panels as follows:
    PatientView = the main panel containing the game view, showing the patient sprite (no container but the outline shows up with a "wireframe" debug setting), the office space, etc.
    
    BottomPanel = the bottom panel containing the InteractionPanel, DialoguePanel, Next Topic button, Turn counter. --THIS MUST BE A FIXED HEIGHT IN RELITIVITY TO THE GAME-- SHOULD NOT EXPAND AND THEREBY SHRINK THE ABOVE PATIENTVIEWPANEL

    InteractionPanel = the bottom area containing dialogue options and actions.

    RightSidePanel = the right side panel containing the clipboard, handbook, synthesis zone, etc
    
    RightSideButtonPanel = the right side panel containing the buttons for opening the rightsidepanel and loading it's contents.
    
    LeftSidePanel = the left side panel containing patient info, session history, mood tracker, Notes, etc.
16. The PatientView panel should take up the entire screen minus the fixed height BottomPanel and the variable width LeftSidePanel and RightSidePanel. The PatientView should NOT resize dynamically based on the size of these other panels. Other panels should appear OVER the Patient View panel (if that makes sense).
17. Transition from emojis to Phospher/Material icons but make sure they are still viewable


## Layout Optimizations
- [x] Optimize layout for 16:9 and mobile devices.
- [x] Ensure all UI elements scale properly with different resolutions.
- [x] Make the `draggable-dialogue` component FIXED while resizing. It must stay in the same position and adjusts size accordingly when adjustde (like windows dialogues)
- [x] Ensure dialogue box does not overlap important UI elements when expanded.
- [ ] Create a `viewable-game-window` component that contains the main game view and ensures all other panels expand/contract around it without overlapping. The bottom bar is seperate and the left and right side panels are on top of it.
- [x] Fix the `focus-mode-hint` components position inside of the `viewable game window`
- [x] Add 8px left and right padding to the `dialogue-text` component inside of the `draggable-dialogue` component to prevent text from touching the edges when resized to small widths.
- [x] Ensure the `draggable-dialogue` component cannot be dragged offscreen or overlap the bottom interaction tray when expanded or moved.
- [x] Ensure the `draggable-dialogue` component resizes properly without breaking layout or overflowing content.
- [x] Turn off dragging when resizing the `draggable-dialogue` component to prevent accidental movement.
- [x] Improve padding for dialogue text.
- [x] Remove justified text alignment for better readability.
- [x] Add markdown support for dialogue text (bold, italics, etc.) and make sure keywords with `[brackets]` are not rendered with the brackets.
- [x] Markdown formatting does not wait until typewriter effect is finished to render properly.
- [ ] add an animation popup for a keyword when it shows up in dialogue using the animation plugin for react that we have.
- [ ] add an animation dev menu tab to preview various animations used in the game for testing and tweaking purposes and also adjust animation settings like speed, easing, etc. It should also contain many "examples" of animations used in the game for reference and choosing an example element to preview the animation on.
- [ ] add a full menu for a dialogue creator tool that allows easy creation of dialogue trees with branching options, conditions, and effects. This would be a major feature but would greatly improve the workflow for creating dialogue content for the game. It should allow exporting to the .session file format used by the game. The player can choose which patient to create dialogue for and then create the dialogue tree visually with nodes and connections. Each node represents a piece of dialogue or an option, and connections represent the flow of conversation. The tool should also allow adding keywords, mood changes, focus costs, and other effects to each dialogue option. Once the dialogue tree is complete, it can be exported to a .session file that can be imported into the game for testing and use. Markdown support should also be included for formatting dialogue text within the tool and should render properly in that editor when typed in real time.
- [x] Speaker labels used in the dialogue system should change based on the person currently speaking. For example, when the patient is speaking, it should show "Patient" or their name, and when the therapist (player) is speaking, it should show "You" or "Therapist". This will help clarify who is speaking during dialogue exchanges.

### Bugs
- [x] Resizing the dialogue box from the bottom or left side causes it to resize from the opposite side instead of the intended side.
- [x] The "click to continue" overflows when dialogue box is resized to small widths. It should not be hidden when we switch to the scrolling mode.
- [x] The end quote mark is showing up before the dialogue text is finished typing. It should only appear after the full text is displayed.
- [x] Somewhere the context menu/tooltip for keywords was removed. It needs to be re-added so that right-clicking keywords shows the context menu again based on the type of keyword from the keyword code we worked on.
- [x] "no patients found" message in the Dialogue Dev Tools tab. 

## Debug Optimizations
- [x] Rename the Dev Errors tab to "Debug Logs"
- [x] Add an option to "copy all" in the debug logs based on current filters.
- [ ] Expand on the functionality of the Debug Logs to include more detailed information about game state, errors, warnings, and other useful debugging information.

## SDNS Extension Features
- [ ] Added other file types like `.sdns` and `.turn` to the VSCode extension for syntax highlighting and support. Then we can link `.turn` files to specific turns in a `.session` file for easier dialogue management if the turns are more complex and need their own files. (what could we use `.sdns` for??? maybe for standalone dialogue snippets that are not part of a full session???)
- [ ] Implement a `.keys` file type for defining keywords separately from dialogue files. This would allow easier management and reuse of keywords across multiple sessions or dialogues. The `.keys` file could contain definitions for various keywords, their types, descriptions, and any associated effects or actions. The VSCode extension would provide syntax highlighting and validation for these files as well. Instead of using JSON., we could use a custom syntax similar to the `.session` files for consistency. For example:

```===KEYWORD===
[keyword_id] {
    type: behavior
    description: "A behavior keyword representing a specific action or habit."
    onCollect: "Adds to clipboard"
}
```
or similar structure that is easy to read and write in the SDNS language.

- [ ] Add a place to store actions to link to .session files for onAskAbout, onHighlightInHandbook, onExploreBackground, etc. This could include data for storing pre-written dialogue options for the player to say, what actions it does, and if any effects it has on the game state (mood changes, focus costs, unlocks dialogues, etc.).
- [ ] Implement a way to link keywords defined in `.keys` files to specific dialogue options in `.session` files. This would allow for easier management of keywords and their associated actions across multiple dialogue sessions. Turn the JSON files into this .keys file format for consistency with the other custom file types.
- [ ] Create a documentation section within the VSCode extension that provides guidelines and examples for using the new file types and features. This would help users understand how to effectively utilize the extension for dialogue creation and management.
- [ ] Add validation and error checking for the new file types to ensure proper syntax and structure. This would help prevent issues when importing dialogue files into the game.
- [ ] Store the keywords file for a specific patient in the path `patients/{patientId}/{patientId}.keys` to keep things organized by patient.
- [ ] Update the SDNSParser to recognize and parse the new `.keys` file format, extracting keyword definitions and their associated actions for use in dialogue sessions and interactions.
- [ ] Update the VSCode extension's language server to provide autocomplete and IntelliSense features for the new file types, making it easier for users to write and manage dialogue content.
- [ ] Make sure that markdown formatting is supported in the dialogue text within the VSCode extension for all relevant file types and does not show the markdown syntax (e.g., **bold**, *italics*) during the typewriter effect in the game. It just renders in the syntax.
- [ ] Allow linking preset text animations to certain words in the dialogue text via the SDNS syntax, such as shaking for emphasis, fading in/out, or color changes. This could be done with a special markup like `[word]<anim:shake>` or similar and a place where we can define these animations in the VSCode extension for easy reference and use. This should also have a dev console tab to edit and create animations with a preview for testing and tweaking purposes.
- [ ] Edit the KEYWORD_SYSTEM.md documentation to reflect these new changes and features for the keyword system and SDNS extension.


## General Bugs
- [ ] Right clicking anywhere shows the chrome context menu instead of the custom game context menu. We need to prevent the default context menu from showing up and only show our custom one when right clicking in the game window.


## Quick TODO's
(todos without organized sections yet. Put these where they go if you notice they fit somewhere above)
- [ ] Create a detailed context menu system activated on right click and populate it with useful options for debugging and testing based on the current game state and selected elements. This could include options for manipulating focus, mood, rapport, keywords, dialogue options, etc. (when dev mode is activated and should be a green context menu button/text. When clicked it opens the dev options with their respective folders of options) The context menu should be dynamic and change based on what is currently selected or hovered over in the game window. It should also have sub-menus for more specific actions or settings related to the selected element. This would greatly improve the workflow for testing and debugging various game features without needing to navigate through multiple menus or panels.
- [ ] Add VSCode extension formatting for syntax when editing in VSCode for the new keyword system and other SDNS features. Like `[keyword text]<type:source.category.ID>` formatting and highlighting. Where "type" is keyword, anim, symptom, observation, etc but are displayed differently in the VSCode syntax/theme since it's a type (this probably doesnt make sense but I think you know what I mean)
## [BUILD] Requirements

- Must be uploadable to Itch.io
- Frequent testing with real-time preview
