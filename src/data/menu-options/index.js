/**
 * Menu Options Database
 * Defines actions available in keyword tooltips/context menus
 * 
 * @module data/menu-options
 * @version 1.0.0
 */

// ============================================================================
// MENU OPTION SCHEMA
// ============================================================================

/**
 * @typedef {Object} MenuOption
 * @property {string} id - Unique identifier
 * @property {string} label - Display label
 * @property {string} [shortLabel] - Shorter label for compact display
 * @property {string} icon - Icon identifier
 * @property {string} type - Action type (note, reveal, queue-topic, etc.)
 * @property {string} [category] - Category for grouping
 * @property {string} [description] - Description of what this action does
 * @property {Object} [defaultParams] - Default parameters for the action
 * @property {MenuConditions} [conditions] - When this option should appear
 * @property {number} [priority] - Sort order (lower = higher priority)
 */

/**
 * @typedef {Object} MenuConditions
 * @property {number} [minRapport] - Minimum rapport required
 * @property {string[]} [requiresSymptoms] - Symptoms that must be revealed
 * @property {string[]} [requiresKeywords] - Keywords that must be collected
 * @property {number} [turn] - Specific turn number
 */

// ============================================================================
// BASE MENU OPTIONS
// ============================================================================

export const MENU_OPTIONS = {
    // ========================================================================
    // NOTE-TAKING ACTIONS
    // ========================================================================

    'note.add': {
        id: 'note.add',
        label: 'Add to Notes',
        shortLabel: 'Note',
        icon: 'edit-3',
        type: 'note',
        category: 'documentation',
        description: 'Add this keyword to your session notes',
        priority: 10
    },

    'note.template': {
        id: 'note.template',
        label: 'Add Note with Template',
        shortLabel: 'Template Note',
        icon: 'file-text',
        type: 'note-template',
        category: 'documentation',
        description: 'Add a pre-formatted note about this keyword',
        priority: 11
    },

    'note.highlight': {
        id: 'note.highlight',
        label: 'Highlight for Review',
        shortLabel: 'Highlight',
        icon: 'bookmark',
        type: 'highlight',
        category: 'documentation',
        description: 'Mark this for later review in session report',
        priority: 12
    },

    // ========================================================================
    // INQUIRY ACTIONS
    // ========================================================================

    'ask.follow-up': {
        id: 'ask.follow-up',
        label: 'Ask Follow-up Question',
        shortLabel: 'Follow Up',
        icon: 'message-circle',
        type: 'queue-topic',
        category: 'inquiry',
        description: 'Queue a follow-up question about this topic',
        priority: 20
    },

    'ask.clarify': {
        id: 'ask.clarify',
        label: 'Ask for Clarification',
        shortLabel: 'Clarify',
        icon: 'help-circle',
        type: 'queue-topic',
        category: 'inquiry',
        description: 'Ask the patient to clarify this statement',
        defaultParams: { type: 'clarification' },
        priority: 21
    },

    'ask.example': {
        id: 'ask.example',
        label: 'Ask for Example',
        shortLabel: 'Example',
        icon: 'list',
        type: 'queue-topic',
        category: 'inquiry',
        description: 'Ask the patient for a specific example',
        defaultParams: { type: 'example' },
        priority: 22
    },

    'ask.feeling': {
        id: 'ask.feeling',
        label: 'Ask About Feelings',
        shortLabel: 'Feelings',
        icon: 'heart',
        type: 'queue-topic',
        category: 'inquiry',
        description: 'Ask how this makes the patient feel',
        defaultParams: { type: 'emotion-exploration' },
        priority: 23
    },

    // ========================================================================
    // REVEAL ACTIONS
    // ========================================================================

    'reveal.symptom': {
        id: 'reveal.symptom',
        label: 'Mark as Symptom',
        shortLabel: 'Symptom',
        icon: 'alert-circle',
        type: 'reveal-symptom',
        category: 'clinical',
        description: 'Identify this as a clinical symptom',
        priority: 30
    },

    'reveal.pattern': {
        id: 'reveal.pattern',
        label: 'Note Pattern',
        shortLabel: 'Pattern',
        icon: 'repeat',
        type: 'reveal-pattern',
        category: 'clinical',
        description: 'Mark this as part of a behavioral pattern',
        priority: 31
    },

    'reveal.contradiction': {
        id: 'reveal.contradiction',
        label: 'Mark Contradiction',
        shortLabel: 'Contradiction',
        icon: 'x-circle',
        type: 'reveal-contradiction',
        category: 'clinical',
        description: 'Note this contradicts something else',
        priority: 32
    },

    // ========================================================================
    // CLINICAL ACTIONS
    // ========================================================================

    'clinical.safety': {
        id: 'clinical.safety',
        label: '⚠️ Safety Assessment',
        shortLabel: 'Safety',
        icon: 'shield',
        type: 'queue-topic',
        category: 'safety',
        description: 'Initiate a safety assessment',
        defaultParams: { topic: 'safety.assessment', priority: 'critical' },
        priority: 1 // Highest priority
    },

    'clinical.diagnosis': {
        id: 'clinical.diagnosis',
        label: 'Link to Diagnosis',
        shortLabel: 'Diagnosis',
        icon: 'clipboard',
        type: 'link-diagnosis',
        category: 'clinical',
        description: 'Connect this to a potential diagnosis',
        priority: 40
    },

    'clinical.dsm': {
        id: 'clinical.dsm',
        label: 'DSM Criteria',
        shortLabel: 'DSM',
        icon: 'book',
        type: 'show-dsm',
        category: 'clinical',
        description: 'View related DSM-5 criteria',
        priority: 41
    },

    // ========================================================================
    // THERAPEUTIC ACTIONS
    // ========================================================================

    'therapeutic.validate': {
        id: 'therapeutic.validate',
        label: 'Validate Experience',
        shortLabel: 'Validate',
        icon: 'check-circle',
        type: 'therapeutic-response',
        category: 'therapeutic',
        description: 'Acknowledge and validate this experience',
        defaultParams: { responseType: 'validation' },
        priority: 50
    },

    'therapeutic.normalize': {
        id: 'therapeutic.normalize',
        label: 'Normalize Experience',
        shortLabel: 'Normalize',
        icon: 'users',
        type: 'therapeutic-response',
        category: 'therapeutic',
        description: 'Help patient understand this is common',
        defaultParams: { responseType: 'normalization' },
        priority: 51
    },

    'therapeutic.reflect': {
        id: 'therapeutic.reflect',
        label: 'Reflect Back',
        shortLabel: 'Reflect',
        icon: 'rotate-ccw',
        type: 'therapeutic-response',
        category: 'therapeutic',
        description: 'Mirror this statement back to the patient',
        defaultParams: { responseType: 'reflection' },
        priority: 52
    },

    'therapeutic.empathy': {
        id: 'therapeutic.empathy',
        label: 'Express Empathy',
        shortLabel: 'Empathy',
        icon: 'heart',
        type: 'therapeutic-response',
        category: 'therapeutic',
        description: 'Express understanding and empathy',
        defaultParams: { responseType: 'empathy' },
        priority: 53
    },

    // ========================================================================
    // ANALYSIS ACTIONS
    // ========================================================================

    'analyze.cognitive': {
        id: 'analyze.cognitive',
        label: 'Cognitive Distortion?',
        shortLabel: 'Distortion',
        icon: 'brain',
        type: 'analyze',
        category: 'analysis',
        description: 'Check if this represents a cognitive distortion',
        defaultParams: { analysisType: 'cognitive-distortion' },
        priority: 60
    },

    'analyze.defense': {
        id: 'analyze.defense',
        label: 'Defense Mechanism?',
        shortLabel: 'Defense',
        icon: 'shield',
        type: 'analyze',
        category: 'analysis',
        description: 'Identify potential defense mechanism',
        defaultParams: { analysisType: 'defense-mechanism' },
        priority: 61
    },

    'analyze.trigger': {
        id: 'analyze.trigger',
        label: 'Identify Trigger',
        shortLabel: 'Trigger',
        icon: 'zap',
        type: 'analyze',
        category: 'analysis',
        description: 'Mark as potential symptom trigger',
        defaultParams: { analysisType: 'trigger' },
        priority: 62
    }
};

// ============================================================================
// MENU CATEGORIES
// ============================================================================

export const MENU_CATEGORIES = {
    safety: {
        id: 'safety',
        label: 'Safety',
        icon: 'shield',
        color: '#c0392b',
        priority: 0
    },
    documentation: {
        id: 'documentation',
        label: 'Documentation',
        icon: 'file-text',
        color: '#3498db',
        priority: 1
    },
    inquiry: {
        id: 'inquiry',
        label: 'Questions',
        icon: 'message-circle',
        color: '#27ae60',
        priority: 2
    },
    clinical: {
        id: 'clinical',
        label: 'Clinical',
        icon: 'clipboard',
        color: '#9b59b6',
        priority: 3
    },
    therapeutic: {
        id: 'therapeutic',
        label: 'Therapeutic',
        icon: 'heart',
        color: '#e74c3c',
        priority: 4
    },
    analysis: {
        id: 'analysis',
        label: 'Analysis',
        icon: 'brain',
        color: '#f39c12',
        priority: 5
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a menu option by ID
 * 
 * @param {string} optionId - Menu option ID
 * @returns {MenuOption | null}
 */
export function getMenuOption(optionId) {
    return MENU_OPTIONS[optionId] || null;
}

/**
 * Get all menu options for a category
 * 
 * @param {string} categoryId - Category ID
 * @returns {MenuOption[]}
 */
export function getMenuOptionsByCategory(categoryId) {
    return Object.values(MENU_OPTIONS)
        .filter(opt => opt.category === categoryId)
        .sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

/**
 * Get menu options that should appear for a keyword
 * 
 * @param {Object} keyword - The keyword object
 * @param {Object} gameState - Current game state
 * @returns {MenuOption[]}
 */
export function getMenuOptionsForKeyword(keyword, gameState) {
    // Start with keyword's own menu options
    const keywordOptions = (keyword.menuOptions || []).map(opt => {
        // If it's just a reference ID, look it up
        if (typeof opt === 'string') {
            return getMenuOption(opt);
        }
        // If it has an ID, merge with base option
        if (opt.id && MENU_OPTIONS[opt.id]) {
            return { ...MENU_OPTIONS[opt.id], ...opt };
        }
        return opt;
    }).filter(Boolean);

    // Add default options based on keyword properties
    const defaultOptions = [];

    // Always allow note-taking
    defaultOptions.push(MENU_OPTIONS['note.add']);

    // Add follow-up option if not critical
    if (keyword.style?.importance !== 'critical') {
        defaultOptions.push(MENU_OPTIONS['ask.follow-up']);
    }

    // Add safety option for critical keywords
    if (keyword.style?.importance === 'critical') {
        defaultOptions.unshift(MENU_OPTIONS['clinical.safety']);
    }

    // Combine and dedupe
    const allOptions = [...keywordOptions, ...defaultOptions];
    const seen = new Set();
    const uniqueOptions = allOptions.filter(opt => {
        if (seen.has(opt.id)) return false;
        seen.add(opt.id);
        return true;
    });

    // Sort by priority
    return uniqueOptions.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

/**
 * Create a custom menu option for a specific keyword
 * 
 * @param {Object} config - Option configuration
 * @returns {MenuOption}
 */
export function createMenuOption(config) {
    return {
        id: config.id || `custom-${Date.now()}`,
        label: config.label || 'Custom Action',
        icon: config.icon || 'circle',
        type: config.type || 'custom',
        category: config.category || 'documentation',
        description: config.description || '',
        defaultParams: config.params || {},
        priority: config.priority || 99
    };
}

export default MENU_OPTIONS;
