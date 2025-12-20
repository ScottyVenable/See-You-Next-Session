/**
 * KeywordLoader - Loads and manages keyword definitions from JSON and .keys files
 * 
 * This module provides a unified interface for loading keyword definitions
 * that can be used by both the game runtime and the VS Code extension.
 * 
 * Supports two file formats:
 * 1. JSON format: .keywords.json files (structured JSON)
 * 2. SDNS format: .keys files (SDNS-native syntax)
 * 
 * Keywords use the format: [display text]<keyword:source.category.keywordId>
 * - source: The keyword source (e.g., 'generic', 'gregory')
 * - category: The category within the source (e.g., 'time', 'emotion', 'cognition')
 * - keywordId: The specific keyword identifier
 */

import { KeysFileParser } from './KeysFileParser.js';

// ============================================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================================

/**
 * @typedef {Object} KeywordStyle
 * @property {string} [color] - Text color
 * @property {string} [bgColor] - Background color
 * @property {string} [icon] - Icon identifier
 * @property {string} [animation] - Animation type (pulse, shake, glow)
 */

/**
 * @typedef {Object} KeywordEffects
 * @property {number} [focusCost] - Focus points consumed
 * @property {string[]} [reveals] - Things revealed when collected
 * @property {number} [rapportChange] - Rapport modification
 * @property {string[]} [triggers] - Events triggered
 * @property {Object} [setVars] - Variables to set
 * @property {string[]} [contradicts] - Observations this contradicts
 * @property {string[]} [unlocks] - Topics/features unlocked
 */

/**
 * @typedef {Object} MenuOption
 * @property {string} id - Option identifier
 * @property {string} label - Display label
 * @property {string} [icon] - Icon identifier
 * @property {string} action - Action type (collect, note, highlight-handbook, explore, ask-about)
 * @property {Object} [params] - Action parameters
 */

/**
 * @typedef {Object} KeywordDefinition
 * @property {string} id - Full keyword ID (source.category.keywordId)
 * @property {string} displayText - Default display text
 * @property {string[]} [aliases] - Alternative phrasings
 * @property {string} description - Clinical/contextual description
 * @property {'low'|'medium'|'high'|'critical'} importance - Importance level
 * @property {KeywordStyle} [style] - Visual styling
 * @property {KeywordEffects} [effects] - Game effects
 * @property {MenuOption[]} [menuOptions] - Context menu options
 * @property {string} [note] - Author notes
 * @property {boolean} [safety] - Safety-related flag
 */

/**
 * @typedef {Object} ActionDefinition
 * @property {string} id - Action identifier
 * @property {string} label - Display label
 * @property {string} [description] - Action description
 * @property {Object[]} [dialogueOptions] - Dialogue options for this action
 */

/**
 * @typedef {Object} AnimationDefinition
 * @property {string} id - Animation identifier
 * @property {string} type - Animation type (shake, pulse, glow, etc.)
 * @property {number} [duration] - Duration in ms
 * @property {number} [intensity] - Animation intensity
 * @property {string} [easing] - Easing function
 * @property {string} [description] - Animation description
 */

/**
 * @typedef {Object} KeywordFile
 * @property {string} source - Source identifier (patient ID or 'generic')
 * @property {string} displayName - Human-readable name
 * @property {string} [description] - File description
 * @property {string} [version] - Version string
 * @property {Object} [patientInfo] - Patient metadata (for patient-specific files)
 * @property {Object} keywords - Keywords organized by category
 * @property {Object} [menuOptions] - Default menu options by type
 * @property {Object} [actions] - Actions defined in this file
 * @property {Object} [animations] - Animations defined in this file
 */

// ============================================================================
// KEYWORD LOADER CLASS
// ============================================================================

class KeywordLoader {
    constructor() {
        /** @type {Map<string, KeywordFile>} */
        this.sources = new Map();

        /** @type {Map<string, KeywordDefinition>} */
        this.keywordsById = new Map();

        /** @type {Map<string, ActionDefinition>} */
        this.actionsById = new Map();

        /** @type {Map<string, AnimationDefinition>} */
        this.animationsById = new Map();

        /** @type {KeysFileParser} */
        this.keysParser = new KeysFileParser();

        /** @type {boolean} */
        this.loaded = false;
    }

    /**
     * Load keyword files from the definitions directory
     * This uses dynamic imports for the game runtime
     * Supports both .keywords.json and .keys file formats
     */
    async loadAll() {
        try {
            // Import all keyword JSON files from definitions directory
            const genericModule = await import('./definitions/generic.keywords.json');
            const gregoryModule = await import('./definitions/gregory.keywords.json');

            this.processKeywordFile(genericModule.default || genericModule);
            this.processKeywordFile(gregoryModule.default || gregoryModule);

            // Try to load .keys files from patients directory
            try {
                const gregoryKeysResponse = await fetch('/src/patients/gregory/gregory.keys');
                if (gregoryKeysResponse.ok) {
                    const keysContent = await gregoryKeysResponse.text();
                    await this.loadKeysFile(keysContent, 'gregory.keys');
                }
            } catch (keysError) {
                // .keys files are optional, don't fail if not found
                console.log('[KeywordLoader] No .keys files found (this is OK)');
            }

            this.loaded = true;
            console.log(`[KeywordLoader] Loaded ${this.sources.size} sources, ${this.keywordsById.size} keywords, ${this.actionsById.size} actions, ${this.animationsById.size} animations`);

            return true;
        } catch (error) {
            console.error('[KeywordLoader] Failed to load keyword files:', error);
            return false;
        }
    }

    /**
     * Load and parse a .keys file
     * @param {string} content - The .keys file content
     * @param {string} [filename] - Filename for error messages
     */
    async loadKeysFile(content, filename = 'unknown.keys') {
        const parsed = this.keysParser.parse(content, filename);

        if (parsed.errors.length > 0) {
            console.warn(`[KeywordLoader] Parse errors in ${filename}:`, parsed.errors);
        }

        // Convert to JSON format and process
        const jsonFormat = this.keysParser.toJsonFormat(parsed);
        this.processKeywordFile(jsonFormat);

        // Index actions
        for (const [id, action] of Object.entries(parsed.actions)) {
            this.actionsById.set(id, { id, ...action });
        }

        // Index animations
        for (const [id, animation] of Object.entries(parsed.animations)) {
            this.animationsById.set(id, { id, ...animation });
        }
    }

    /**
     * Process a keyword file and index all keywords
     * @param {KeywordFile} keywordFile - The keyword file to process
     */
    processKeywordFile(keywordFile) {
        if (!keywordFile || !keywordFile.source) {
            console.warn('[KeywordLoader] Invalid keyword file:', keywordFile);
            return;
        }

        this.sources.set(keywordFile.source, keywordFile);

        // Index all keywords by their full ID
        for (const [categoryId, category] of Object.entries(keywordFile.keywords)) {
            if (!category || typeof category !== 'object') continue;

            for (const [keywordId, keyword] of Object.entries(category)) {
                // Skip the category metadata
                if (keywordId === '_category') continue;

                if (keyword && keyword.id) {
                    this.keywordsById.set(keyword.id, keyword);
                }
            }
        }
    }

    /**
     * Get all available keyword sources
     * @returns {string[]} Array of source IDs
     */
    getSources() {
        return Array.from(this.sources.keys());
    }

    /**
     * Get source metadata
     * @param {string} sourceId - The source ID
     * @returns {KeywordFile|undefined}
     */
    getSource(sourceId) {
        return this.sources.get(sourceId);
    }

    /**
     * Get categories available for a source
     * @param {string} sourceId - The source ID
     * @returns {string[]} Array of category IDs
     */
    getCategoriesForSource(sourceId) {
        const file = this.sources.get(sourceId);
        if (!file) return [];
        return Object.keys(file.keywords);
    }

    /**
     * Get keywords for a specific source and category
     * @param {string} sourceId - The source ID
     * @param {string} categoryId - The category ID
     * @returns {KeywordDefinition[]} Array of keywords
     */
    getKeywordsForCategory(sourceId, categoryId) {
        const file = this.sources.get(sourceId);
        if (!file || !file.keywords[categoryId]) return [];

        const keywords = [];
        for (const [id, kw] of Object.entries(file.keywords[categoryId])) {
            if (id !== '_category' && kw.id) {
                keywords.push(kw);
            }
        }
        return keywords;
    }

    /**
     * Get a keyword by its full ID
     * @param {string} fullId - Full keyword ID (source.category.keywordId)
     * @returns {KeywordDefinition|undefined}
     */
    getKeywordById(fullId) {
        return this.keywordsById.get(fullId);
    }

    /**
     * Search keywords by display text or alias
     * @param {string} searchText - Text to search for
     * @returns {KeywordDefinition[]} Matching keywords
     */
    searchByText(searchText) {
        const normalizedSearch = searchText.toLowerCase().trim();
        const matches = [];

        for (const keyword of this.keywordsById.values()) {
            // Check display text
            if (keyword.displayText.toLowerCase().includes(normalizedSearch)) {
                matches.push(keyword);
                continue;
            }

            // Check aliases
            if (keyword.aliases) {
                for (const alias of keyword.aliases) {
                    if (alias.toLowerCase().includes(normalizedSearch)) {
                        matches.push(keyword);
                        break;
                    }
                }
            }
        }

        return matches;
    }

    /**
     * Get keywords by importance level
     * @param {'low'|'medium'|'high'|'critical'} importance - Importance level
     * @returns {KeywordDefinition[]} Matching keywords
     */
    getByImportance(importance) {
        const matches = [];
        for (const keyword of this.keywordsById.values()) {
            if (keyword.importance === importance) {
                matches.push(keyword);
            }
        }
        return matches;
    }

    /**
     * Get all safety-flagged keywords
     * @returns {KeywordDefinition[]} Safety-related keywords
     */
    getSafetyKeywords() {
        const matches = [];
        for (const keyword of this.keywordsById.values()) {
            if (keyword.safety) {
                matches.push(keyword);
            }
        }
        return matches;
    }

    /**
     * Get default menu options for a keyword type
     * @param {string} sourceId - The source ID
     * @param {'default'|'contradiction'|'breakthrough'} type - Menu type
     * @returns {MenuOption[]} Menu options
     */
    getMenuOptions(sourceId, type = 'default') {
        const file = this.sources.get(sourceId);
        if (!file || !file.menuOptions) {
            // Fall back to generic menu options
            const generic = this.sources.get('generic');
            return generic?.menuOptions?.[type] || [];
        }
        return file.menuOptions[type] || file.menuOptions.default || [];
    }

    /**
     * Parse a keyword reference from dialogue text
     * Format: [display text]<keyword:source.category.keywordId>
     * 
     * @param {string} text - Text containing keyword reference
     * @returns {Object|null} Parsed keyword reference or null
     */
    parseKeywordReference(text) {
        const match = text.match(/\[([^\]]+)\]<keyword:([^>]+)>/);
        if (!match) return null;

        const [fullMatch, displayText, keywordId] = match;
        const keyword = this.getKeywordById(keywordId);

        return {
            fullMatch,
            displayText,
            keywordId,
            keyword,
            parts: keywordId.split('.')
        };
    }

    /**
     * Find all keyword references in a text block
     * @param {string} text - Text to search
     * @returns {Array<Object>} Array of parsed keyword references
     */
    findAllKeywordReferences(text) {
        const regex = /\[([^\]]+)\]<keyword:([^>]+)>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [fullMatch, displayText, keywordId] = match;
            const keyword = this.getKeywordById(keywordId);

            matches.push({
                fullMatch,
                displayText,
                keywordId,
                keyword,
                index: match.index,
                parts: keywordId.split('.')
            });
        }

        return matches;
    }

    /**
     * Replace keyword references with styled elements (for rendering)
     * @param {string} text - Text with keyword references
     * @param {Function} renderer - Function to render a keyword (keyword, displayText) => string
     * @returns {string} Text with rendered keywords
     */
    renderKeywords(text, renderer) {
        return text.replace(/\[([^\]]+)\]<keyword:([^>]+)>/g, (match, displayText, keywordId) => {
            const keyword = this.getKeywordById(keywordId);
            return renderer(keyword, displayText, keywordId);
        });
    }

    // ========================================================================
    // ACTION METHODS
    // ========================================================================

    /**
     * Get an action by its ID
     * @param {string} actionId - The action ID
     * @returns {ActionDefinition|undefined}
     */
    getActionById(actionId) {
        return this.actionsById.get(actionId);
    }

    /**
     * Get all actions
     * @returns {ActionDefinition[]} All registered actions
     */
    getAllActions() {
        return Array.from(this.actionsById.values());
    }

    /**
     * Get actions for a specific source
     * @param {string} sourceId - The source ID (e.g., 'gregory')
     * @returns {ActionDefinition[]} Actions for that source
     */
    getActionsForSource(sourceId) {
        return Array.from(this.actionsById.values()).filter(action =>
            action.id.startsWith(`askAbout.${sourceId}`) ||
            action.id.startsWith(`explore.${sourceId}`) ||
            action.id.includes(sourceId)
        );
    }

    /**
     * Execute an action's dialogue option
     * @param {string} actionId - The action ID
     * @param {number} optionIndex - Index of the dialogue option to use
     * @returns {Object|null} The dialogue option data or null
     */
    getActionDialogue(actionId, optionIndex = 0) {
        const action = this.getActionById(actionId);
        if (!action || !action.dialogueOptions) return null;
        return action.dialogueOptions[optionIndex] || null;
    }

    // ========================================================================
    // ANIMATION METHODS
    // ========================================================================

    /**
     * Get an animation by its ID
     * @param {string} animId - The animation ID
     * @returns {AnimationDefinition|undefined}
     */
    getAnimationById(animId) {
        return this.animationsById.get(animId);
    }

    /**
     * Get all animations
     * @returns {AnimationDefinition[]} All registered animations
     */
    getAllAnimations() {
        return Array.from(this.animationsById.values());
    }

    /**
     * Parse animation references from text
     * Format: [text]<anim:animId>
     * @param {string} text - Text to parse
     * @returns {Array<Object>} Animation references found
     */
    findAnimationReferences(text) {
        const regex = /\[([^\]]+)\]<anim:([^>]+)>/g;
        const matches = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            const [fullMatch, displayText, animId] = match;
            const animation = this.getAnimationById(animId);

            matches.push({
                fullMatch,
                displayText,
                animId,
                animation,
                index: match.index
            });
        }

        return matches;
    }

    /**
     * Render text with animation wrappers
     * @param {string} text - Text with animation references
     * @param {Function} renderer - Function to render animated text
     * @returns {string} Text with rendered animations
     */
    renderAnimations(text, renderer) {
        return text.replace(/\[([^\]]+)\]<anim:([^>]+)>/g, (match, displayText, animId) => {
            const animation = this.getAnimationById(animId);
            return renderer(animation, displayText, animId);
        });
    }

    /**
     * Render both keywords and animations in text
     * @param {string} text - Text with keyword and animation references
     * @param {Function} keywordRenderer - Function to render keywords
     * @param {Function} animRenderer - Function to render animations
     * @returns {string} Fully rendered text
     */
    renderAll(text, keywordRenderer, animRenderer) {
        let result = this.renderKeywords(text, keywordRenderer);
        result = this.renderAnimations(result, animRenderer);
        return result;
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/** @type {KeywordLoader} */
const keywordLoader = new KeywordLoader();

export { KeywordLoader, keywordLoader };
export default keywordLoader;