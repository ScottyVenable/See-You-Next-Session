/**
 * SDNS Keyword Database - Main Index
 * 
 * Central registry for all keywords used in dialogue files.
 * Keywords are interactive text elements that players can collect as evidence.
 * 
 * @module data/keywords
 * @version 1.0.0
 */

// Import keyword categories
import { TIME_KEYWORDS } from './categories/time.js';
import { EMOTION_KEYWORDS } from './categories/emotions.js';
import { BEHAVIOR_KEYWORDS } from './categories/behaviors.js';
import { SYMPTOM_KEYWORDS } from './categories/symptoms.js';
import { RELATIONSHIP_KEYWORDS } from './categories/relationships.js';
import { COGNITION_KEYWORDS } from './categories/cognition.js';

// Import patient-specific keywords
import { GREGORY_KEYWORDS } from './patients/gregory.js';

// ============================================================================
// KEYWORD SCHEMA
// ============================================================================

/**
 * @typedef {Object} Keyword
 * @property {string} id - Unique identifier (category.name format) -- UPDATE TO IMPLEMENT: make it formatted id as "gregory-anxious_about_health" or "gregory-family_conflict_about_dog" to make it easy to reference patient-specific keywords.
 * @property {string} category - Category for organization (time, emotion, etc.)
 * @property {string} displayText - Default display text (can be overridden)
 * @property {string} description - Tooltip description for players
 * @property {string[]} [aliases] - Alternative text matches
 * @property {KeywordStyle} style - Visual styling options
 * @property {KeywordEffects} effects - Game effects when collected
 * @property {KeywordConditions} [conditions] - Display/unlock conditions
 * @property {MenuOption[]} [menuOptions] - Tooltip menu actions
 * @property {string} [note] - Writer's note (not shown to player)
 */

/**
 * @typedef {Object} KeywordStyle
 * @property {string} color - Primary highlight color
 * @property {string} [bgColor] - Background color
 * @property {string} [icon] - Icon identifier
 * @property {string} [animation] - Animation effect (pulse, glow, shake) -- TODO: allow references to CSS classes in a dedicated file/module (especially for modders or expansion packs?)
 * @property {string} [importance] - low | medium | high | critical
 */

/**
 * @typedef {Object} KeywordEffects
 * @property {string[]} [reveals] - Symptoms/info to reveal
 * @property {string[]} [contradicts] - Contradicting observations
 * @property {number} [rapportChange] - Rapport modifier
 * @property {number} [focusCost] - Focus cost to collect
 * @property {string[]} [unlocks] - Topics/blocks to unlock
 * @property {string[]} [triggers] - Breakthroughs to potentially trigger
 * @property {Object} [setVars] - Variables to set
 */

/**
 * @typedef {Object} KeywordConditions
 * @property {number} [minRapport] - Minimum rapport to show
 * @property {number} [maxRapport] - Maximum rapport to show
 * @property {string[]} [requiresKeywords] - Required collected keywords
 * @property {string[]} [requiresSymptoms] - Required revealed symptoms
 * @property {number} [turnMin] - Minimum turn number
 * @property {number} [turnMax] - Maximum turn number
 */

/**
 * @typedef {Object} MenuOption
 * @property {string} id - Option identifier
 * @property {string} label - Display label
 * @property {string} [icon] - Icon identifier
 * @property {string} action - Action type (note, reveal, ask, analyze)
 * @property {Object} [params] - Action parameters
 */

// ============================================================================
// DEFAULT KEYWORD (Fallback)
// ============================================================================

/**
 * Default keyword used when a reference is not found or malformed.
 * Ensures the game never breaks due to missing keywords.
 */
export const DEFAULT_KEYWORD = {
    id: '_default',
    category: 'system',
    displayText: '???',
    description: 'Unknown keyword - please check the reference',
    style: {
        color: '#888888',
        bgColor: 'rgba(128, 128, 128, 0.1)',
        icon: 'question',
        importance: 'low'
    },
    effects: {
        focusCost: 0,
        rapportChange: 0
    },
    menuOptions: [
        {
            id: 'add-note',
            label: 'Add to Notes',
            icon: 'note',
            action: 'note'
        }
    ],
    _isDefault: true
};

// ============================================================================
// MERGED KEYWORD REGISTRY
// ============================================================================

/**
 * Merge all keyword categories into a single registry
 * Patient-specific keywords can override category keywords
 */
export const KEYWORDS = {
    // Category keywords
    ...TIME_KEYWORDS,
    ...EMOTION_KEYWORDS,
    ...BEHAVIOR_KEYWORDS,
    ...SYMPTOM_KEYWORDS,
    ...RELATIONSHIP_KEYWORDS,
    ...COGNITION_KEYWORDS,

    // Patient-specific overrides (higher priority)
    ...GREGORY_KEYWORDS
};

// ============================================================================
// KEYWORD LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get a keyword by its full ID (category.name)
 * Returns DEFAULT_KEYWORD if not found
 * 
 * @param {string} keywordId - Full keyword ID (e.g., "time.months")
 * @returns {Keyword}
 */
export function getKeyword(keywordId) {
    if (!keywordId) return { ...DEFAULT_KEYWORD };

    const keyword = KEYWORDS[keywordId];
    if (keyword) return keyword;

    // Try patient.category.name format
    const parts = keywordId.split('.');
    if (parts.length === 3) {
        const [patient, category, name] = parts;
        const patientKeyword = KEYWORDS[`${patient}.${category}.${name}`];
        if (patientKeyword) return patientKeyword;

        // Fallback to category.name
        const categoryKeyword = KEYWORDS[`${category}.${name}`];
        if (categoryKeyword) return categoryKeyword;
    }

    console.warn(`[SDNS] Keyword not found: "${keywordId}" - using default`);
    return { ...DEFAULT_KEYWORD, id: keywordId };
}

/**
 * Get a keyword with custom display text
 * 
 * @param {string} keywordId - Full keyword ID
 * @param {string} displayText - Custom display text
 * @param {Object} [overrides] - Additional property overrides
 * @returns {Keyword}
 */
export function getKeywordWithText(keywordId, displayText, overrides = {}) {
    const keyword = getKeyword(keywordId);
    return {
        ...keyword,
        displayText,
        ...overrides
    };
}

/**
 * Get all keywords in a category
 * 
 * @param {string} category - Category name
 * @returns {Keyword[]}
 */
export function getKeywordsByCategory(category) {
    return Object.values(KEYWORDS).filter(kw => kw.category === category);
}

/**
 * Get all keywords for a specific patient
 * 
 * @param {string} patientId - Patient identifier
 * @returns {Keyword[]}
 */
export function getKeywordsForPatient(patientId) {
    return Object.values(KEYWORDS).filter(kw =>
        kw.id.startsWith(`${patientId}.`) || kw.patientId === patientId
    );
}

/**
 * Check if a keyword should be shown based on conditions
 * 
 * @param {Keyword} keyword - The keyword to check
 * @param {Object} gameState - Current game state
 * @returns {boolean}
 */
export function shouldShowKeyword(keyword, gameState) {
    const { conditions } = keyword;
    if (!conditions) return true;

    const { rapport = 0, turn = 1, collectedKeywords = [], revealedSymptoms = [] } = gameState;

    if (conditions.minRapport !== undefined && rapport < conditions.minRapport) return false;
    if (conditions.maxRapport !== undefined && rapport > conditions.maxRapport) return false;
    if (conditions.turnMin !== undefined && turn < conditions.turnMin) return false;
    if (conditions.turnMax !== undefined && turn > conditions.turnMax) return false;

    if (conditions.requiresKeywords?.length) {
        if (!conditions.requiresKeywords.every(kw => collectedKeywords.includes(kw))) return false;
    }

    if (conditions.requiresSymptoms?.length) {
        if (!conditions.requiresSymptoms.every(s => revealedSymptoms.includes(s))) return false;
    }

    return true;
}

/**
 * Validate a keyword definition
 * 
 * @param {Object} keyword - Keyword to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateKeyword(keyword) {
    const errors = [];

    if (!keyword.id) errors.push('Missing required field: id');
    if (!keyword.category) errors.push('Missing required field: category');
    if (!keyword.displayText) errors.push('Missing required field: displayText');
    if (!keyword.style) errors.push('Missing required field: style');

    if (keyword.style && !keyword.style.color) {
        errors.push('Missing required style field: color');
    }

    if (keyword.effects) {
        if (keyword.effects.focusCost !== undefined && typeof keyword.effects.focusCost !== 'number') {
            errors.push('effects.focusCost must be a number');
        }
        if (keyword.effects.rapportChange !== undefined && typeof keyword.effects.rapportChange !== 'number') {
            errors.push('effects.rapportChange must be a number');
        }
    }

    return { valid: errors.length === 0, errors };
}

// ============================================================================
// KEYWORD CATEGORIES
// ============================================================================

export const KEYWORD_CATEGORIES = {
    time: {
        id: 'time',
        label: 'Time & Duration',
        description: 'Keywords related to time, duration, and frequency',
        color: '#6b7fd7',
        icon: 'clock'
    },
    emotion: {
        id: 'emotion',
        label: 'Emotions & Feelings',
        description: 'Keywords related to emotional states',
        color: '#e74c3c',
        icon: 'heart'
    },
    behavior: {
        id: 'behavior',
        label: 'Behaviors & Actions',
        description: 'Keywords related to actions and behaviors',
        color: '#27ae60',
        icon: 'activity'
    },
    symptom: {
        id: 'symptom',
        label: 'Symptoms & Signs',
        description: 'Keywords related to clinical symptoms',
        color: '#9b59b6',
        icon: 'alert-circle'
    },
    relationship: {
        id: 'relationship',
        label: 'Relationships & Social',
        description: 'Keywords related to social connections',
        color: '#f39c12',
        icon: 'users'
    },
    cognition: {
        id: 'cognition',
        label: 'Thoughts & Beliefs',
        description: 'Keywords related to thinking patterns',
        color: '#3498db',
        icon: 'brain'
    }
};

export default KEYWORDS;
