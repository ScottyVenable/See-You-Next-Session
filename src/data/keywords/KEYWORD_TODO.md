# Keyword TODO
Things to implement or improve regarding keywords in the game.

## Completed (December 20, 2025)

1. [x] ~~Allow keywords to reference CSS classes for animations or effects, enabling modders or expansion packs to define custom styles.~~
   - Created `src/styles/keywords/` with modular CSS files (index.css, importance.css, categories.css, animations.css)
   - Created `src/data/keywords/styles/keyword-styles.json` style preset registry
   - Updated keyword-schema.json with cssClass and animationClass properties

2. [x] ~~Improve SDNS language system to allow VSCode dropdowns or autocomplete for patient-specific keywords using a formatted ID system~~
   - VSCode extension now supports `<keyword:source.category.id>` autocomplete
   - Added `<style:category.preset>` autocomplete
   - Added `<anim:type>` autocomplete

3. [x] ~~Ensure that the SDNS system is not copying other systems too closely and has unique features~~
   - Created `Documents/reference/SDNS_UNIQUENESS_ASSESSMENT.md` with detailed comparison

5. [x] ~~Add visual indicators or effects for keywords based on their importance level (low, medium, high, critical)~~
   - Created importance.css with subtle visual hierarchy
   - Added "trained eye" perk support for enhanced visibility
   - Added dev mode importance labels

## In Progress

4. [ ] Test and confirm that keywords with contradiction markers (e.g., `<contradicts:bags-under-eyes>`) are functioning correctly in dialogue and triggering appropriate game logic.
6. [ ] Implement and test dropdown tooltip menu support for keywords in dialogue, allowing players to see additional information or options when interacting with keywords.
   - Basic context menu exists in DialogueBox.jsx, needs enhancement
7. [ ] Allow a feature in the tooltip menu for "Analyse Context" that gives players hints about how the keyword relates to the patient and information the player already has? Costs some focus to use based on keyword importance/complexity.
9. [ ] Test keyword dragging functionality from dialogue box/notebook to clinical handbook to ensure it works as intended.
10. [ ] Add an animation effect when clicking on an animation that shows a particle effect travel from the keyword to the Clipboard entry when dragging/dropping keywords.

## Backlog

8. [ ] Move these todo items to the main TODO document once completed under it's own section because I always just add ideas as they come to me.
11. [ ] Turn the clipboard into a sidebar/drawer that can be toggled open/closed during sessions to allow easier access to keywords without needing to pause or open a separate menu.


## System Tasks

### Completed
- [x] Review and document uniqueness of SDNS keyword system compared to other dialogue systems.
  - See: `Documents/reference/SDNS_UNIQUENESS_ASSESSMENT.md`
- [x] Implement CSS class referencing for keyword styles
  - Syntax: `<style:category.preset>` e.g., `<style:behavior.red>`
- [x] Create CSS class presets for reference in keywords
  - See: `src/styles/keywords/` and `src/data/keywords/styles/keyword-styles.json`
- [x] Implement dropdown/autocomplete for patient-specific keywords in VSCode extension
  - Supports: `<keyword:source.category.id>`, `<style:>`, `<anim:>`
- [x] Implement visual indicators/effects for keyword importance levels
  - See: `src/styles/keywords/importance.css`
- [x] Update VSCode extension to support new keyword formats and features
  - Added style/anim completions and validation
- [x] Update all documentation and README files to reflect completed features
  - Updated SDNS_REFERENCE.md with style/animation documentation

### In Progress
- [ ] Solidify the SDNS system and make sure it is universally applied across all dialogue and narration in the game.
- [ ] Test and confirm contradiction markers in keywords function correctly.
- [ ] Implement dropdown tooltip menu support for keywords in dialogue (non-dev and dev modes).
- [ ] Implement "Analyse Context" feature in tooltip menu for keywords.
- [ ] Test keyword dragging functionality from dialogue box/notebook to clinical handbook.
- [ ] Add a special animation/particle effect when dragging/dropping keywords to clipboard

### Backlog
- [ ] Move completed items to main TODO document under their own section and organize the TODOs properly.
- [ ] Work on creating the behavior code for "responses" that align with the options of responses for the player to select
- [ ] Create the dialogue creation system UI for writers to easily create dialogue nodes
- [ ] Test and debug the entire keyword system thoroughly to ensure stability and usability.
- [ ] After these, create a document outlining potential future improvements or expansions for the keyword system
- [ ] Ensure no bugs or errors exist in the current implementation of keywords in the game
- [ ] When fully finished, create a document for this build version outlining all features, changes, and improvements

---

## Target Syntax Reference

Example of complete keyword markup:
```
[I had a really hard time sleeping last night.] <keyword:gregory.behavior.sleep_difficulty><anim:highlight><style:behavior.red>
```

Components:
- `[text]` - The display text
- `<keyword:source.category.id>` - Link to keyword definition
- `<anim:type>` - Animation preset (pulse, glow, shake, shimmer, highlight, pop, float, none)
- `<style:category.preset>` - CSS style preset (e.g., behavior.red, emotion.sad)

Optional future tags:
- `<onhover:behavior_id>` - Hover behavior
- `<sfx:sound_id>` - Sound effect on interaction