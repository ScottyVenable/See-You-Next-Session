# Keyword TODO
Things to implement or improve regarding keywords in the game.

1. Allow keywords to reference CSS classes for animations or effects, enabling modders or expansion packs to define custom styles.
2. Improve SDNS language system to allow VSCode dropdowns or autocomplete for patient-specific keywords using a formatted ID system (e.g., "gregory.anxious_about_health"). So typing "gregory." would show all of Gregory's keywords. Expand this to be when referencing a word, we follow the format hierarchy of "patient.keyword_name" OR "patient.category.keyword_name" for more specific filtering!
3. **LOW PRIORITY** Ensure that the SDNS system is not copying other systems too closely and has unique features tailored to the game's needs or potential use in other projects? (this is more of a general consideration than a specific TODO- the todo here is to review the system for uniqueness and create an assessment document)
4. Test and confirm that keywords with contradiction markers (e.g., `<contradicts:bags-under-eyes>`) are functioning correctly in dialogue and triggering appropriate game logic.
5. Add visual indicators or effects for keywords based on their importance level (low, medium, high, critical) to enhance player awareness during sessions but without spoiling the game. This could connect to a perk later that flags critical keywords more obviously.
6. Implement and test dropdown tooltip menu support for keywords in dialogue, allowing players to see additional information or options when interacting with keywords.
7. Allow a feature in the tooltip menu for "Analyse Context" that gives players hints about how the keyword relates to the patient and information the player already has? Costs some focus to use based on keyword importance/complexity.
8. Move these todo items to the main TODO document once completed under it's own section because I always just add ideas as they come to me.
9. Test keyword dragging functionality from dialogue box/notebook to clinical handbook to ensure it works as intended.
10. Add an animation effect when clicking on an animation that shows a particle effect travel from the keyword to the Clipboard entry when dragging/dropping keywords.
11. Turn the clipboard into a sidebar/drawer that can be toggled open/closed during sessions to allow easier access to keywords without needing to pause or open a separate menu.