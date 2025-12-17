/**
 * SDNS Keyword Parser
 * Parses keyword references in dialogue text
 * 
 * Supports multiple formats:
 * 1. Simple:     [keyword text]
 * 2. Reference:  [keyword text](category.identifier)
 * 3. Patient:    [keyword text](patient.category.identifier)
 * 4. Override:   [keyword text](category.identifier, {overrides})
 * 5. Inline:     [keyword text](@keyword{...definition...})
 * 6. Legacy:     [keyword text]<metadata>
 * 
 * @module sdns/keyword-parser
 * @version 1.0.0
 */

import { getKeyword, getKeywordWithText, DEFAULT_KEYWORD, validateKeyword } from '../data/keywords/index.js';
import { getMenuOption } from '../data/menu-options/index.js';

// ============================================================================
// REGEX PATTERNS
// ============================================================================

const PATTERNS = {
    // Match [text](reference) - standard markdown-like format
    REFERENCE: /\[([^\]]+)\]\(([^)]+)\)/g,

    // Match [text]<metadata> - legacy format
    LEGACY_META: /\[([^\]]+)\]<([^>]+)>/g,

    // Match [text] alone - simple keyword
    SIMPLE: /\[([^\]]+)\](?![(<])/g,

    // Match inline definition: @keyword{...}
    INLINE_DEF: /@keyword\{([^}]+)\}/,

    // Match reference with overrides: (ref, {...})
    REF_WITH_OVERRIDE: /^([^,]+),\s*(\{.+\})$/,

    // Match simple reference: category.name
    SIMPLE_REF: /^([a-z_-]+)\.([a-z_-]+)$/i,

    // Match patient reference: patient.category.name
    PATIENT_REF: /^([a-z_-]+)\.([a-z_-]+)\.([a-z_-]+)$/i,

    // Legacy metadata patterns
    LEGACY_CONTRADICTS: /contradicts:([a-z0-9_-]+)/i,
    LEGACY_REVEALS: /reveals:([a-z0-9_-]+)/i
};

// ============================================================================
// PARSED KEYWORD STRUCTURE
// ============================================================================

/**
 * @typedef {Object} ParsedKeyword
 * @property {string} displayText - Text to show in dialogue
 * @property {string} referenceId - Full keyword reference ID
 * @property {Object} keyword - Resolved keyword object
 * @property {Object} [overrides] - Any overrides applied
 * @property {boolean} isInline - Whether defined inline
 * @property {boolean} isDefault - Whether using fallback
 * @property {number} startIndex - Start position in original text
 * @property {number} endIndex - End position in original text
 * @property {string} originalMatch - Original matched text
 */

// ============================================================================
// MAIN PARSER
// ============================================================================

/**
 * Parse all keywords in a text string
 * 
 * @param {string} text - Text containing keywords
 * @param {Object} [context] - Context for resolving keywords
 * @param {string} [context.patientId] - Current patient ID
 * @returns {ParsedKeyword[]}
 */
export function parseKeywords(text, context = {}) {
    const keywords = [];
    const { patientId } = context;

    // Reset regex lastIndex
    PATTERNS.REFERENCE.lastIndex = 0;
    PATTERNS.LEGACY_META.lastIndex = 0;
    PATTERNS.SIMPLE.lastIndex = 0;

    // Track positions to avoid double-matching
    const matchedRanges = [];

    // 1. Parse [text](reference) format
    let match;
    while ((match = PATTERNS.REFERENCE.exec(text)) !== null) {
        const [fullMatch, displayText, reference] = match;
        const parsed = parseReference(reference, displayText, patientId);

        keywords.push({
            ...parsed,
            startIndex: match.index,
            endIndex: match.index + fullMatch.length,
            originalMatch: fullMatch
        });

        matchedRanges.push([match.index, match.index + fullMatch.length]);
    }

    // 2. Parse [text]<metadata> legacy format
    while ((match = PATTERNS.LEGACY_META.exec(text)) !== null) {
        // Skip if already matched
        if (isInRange(match.index, matchedRanges)) continue;

        const [fullMatch, displayText, metadata] = match;
        const parsed = parseLegacyMetadata(displayText, metadata, patientId);

        keywords.push({
            ...parsed,
            startIndex: match.index,
            endIndex: match.index + fullMatch.length,
            originalMatch: fullMatch
        });

        matchedRanges.push([match.index, match.index + fullMatch.length]);
    }

    // 3. Parse [text] simple format
    while ((match = PATTERNS.SIMPLE.exec(text)) !== null) {
        // Skip if already matched
        if (isInRange(match.index, matchedRanges)) continue;

        const [fullMatch, displayText] = match;
        const parsed = parseSimpleKeyword(displayText, patientId);

        keywords.push({
            ...parsed,
            startIndex: match.index,
            endIndex: match.index + fullMatch.length,
            originalMatch: fullMatch
        });
    }

    // Sort by position
    keywords.sort((a, b) => a.startIndex - b.startIndex);

    return keywords;
}

/**
 * Parse a keyword reference string
 * 
 * @param {string} reference - Reference part (inside parentheses)
 * @param {string} displayText - Display text
 * @param {string} [patientId] - Current patient ID
 * @returns {Object} Parsed keyword info
 */
function parseReference(reference, displayText, patientId) {
    // Check for inline definition
    const inlineMatch = reference.match(PATTERNS.INLINE_DEF);
    if (inlineMatch) {
        return parseInlineDefinition(displayText, inlineMatch[1]);
    }

    // Check for reference with overrides
    const overrideMatch = reference.match(PATTERNS.REF_WITH_OVERRIDE);
    if (overrideMatch) {
        const [, ref, overridesJson] = overrideMatch;
        try {
            const overrides = JSON.parse(overridesJson);
            return resolveReference(ref.trim(), displayText, patientId, overrides);
        } catch (e) {
            console.warn(`[SDNS] Invalid override JSON: ${overridesJson}`);
            return resolveReference(ref.trim(), displayText, patientId);
        }
    }

    // Simple reference
    return resolveReference(reference.trim(), displayText, patientId);
}

/**
 * Resolve a keyword reference to a keyword object
 * 
 * @param {string} reference - Reference string (e.g., "time.months")
 * @param {string} displayText - Display text
 * @param {string} [patientId] - Current patient ID
 * @param {Object} [overrides] - Property overrides
 * @returns {Object} Resolved keyword info
 */
function resolveReference(reference, displayText, patientId, overrides = {}) {
    let resolvedId = reference;

    // Try patient-specific first
    if (patientId) {
        const patientRef = `${patientId}.${reference}`;
        const patientKeyword = getKeyword(patientRef);
        if (!patientKeyword._isDefault) {
            return {
                displayText,
                referenceId: patientRef,
                keyword: { ...patientKeyword, displayText, ...overrides },
                overrides: Object.keys(overrides).length > 0 ? overrides : null,
                isInline: false,
                isDefault: false
            };
        }
    }

    // Try direct reference
    const keyword = getKeywordWithText(resolvedId, displayText, overrides);

    return {
        displayText,
        referenceId: resolvedId,
        keyword,
        overrides: Object.keys(overrides).length > 0 ? overrides : null,
        isInline: false,
        isDefault: keyword._isDefault === true
    };
}

/**
 * Parse an inline keyword definition
 * 
 * @param {string} displayText - Display text
 * @param {string} definitionStr - Definition string (JSON-like)
 * @returns {Object} Parsed keyword info
 */
function parseInlineDefinition(displayText, definitionStr) {
    try {
        // Support both strict JSON and relaxed JS object notation
        let definition;
        try {
            definition = JSON.parse(definitionStr);
        } catch {
            // Try eval for JS object notation (be careful with this in production)
            // In production, use a proper parser
            definition = parseRelaxedJSON(definitionStr);
        }

        // Build keyword from definition
        const keyword = buildInlineKeyword(displayText, definition);

        return {
            displayText,
            referenceId: `_inline_${Date.now()}`,
            keyword,
            overrides: null,
            isInline: true,
            isDefault: false
        };
    } catch (e) {
        console.warn(`[SDNS] Invalid inline keyword definition: ${definitionStr}`);
        return {
            displayText,
            referenceId: '_invalid',
            keyword: { ...DEFAULT_KEYWORD, displayText },
            overrides: null,
            isInline: true,
            isDefault: true
        };
    }
}

/**
 * Build a keyword object from inline definition
 * 
 * @param {string} displayText - Display text
 * @param {Object} definition - Parsed definition
 * @returns {Object} Keyword object
 */
function buildInlineKeyword(displayText, definition) {
    const keyword = {
        id: definition.id || `_inline_${Date.now()}`,
        category: definition.category || 'custom',
        displayText,
        description: definition.description || definition.note || 'Custom keyword',
        style: {
            color: definition.style?.color || '#6b7fd7',
            bgColor: definition.style?.bgColor || 'rgba(107, 127, 215, 0.15)',
            icon: definition.style?.icon || 'circle',
            importance: definition.style?.importance || 'medium',
            ...(definition.style || {})
        },
        effects: {
            focusCost: definition.effects?.focusCost ?? definition.focusCost ?? 5,
            rapportChange: definition.effects?.rapportChange ?? 0,
            reveals: definition.effects?.reveals || definition.reveals || [],
            contradicts: definition.effects?.contradicts || definition.contradicts || [],
            triggers: definition.effects?.triggers || definition.triggers || [],
            unlocks: definition.effects?.unlocks || definition.unlocks || [],
            setVars: definition.effects?.setVars || definition.setVars || {},
            ...(definition.effects || {})
        },
        conditions: definition.conditions || null,
        menuOptions: parseMenuOptions(definition.menuOptions || definition.menu_options || []),
        note: definition.note || null,
        _isInline: true
    };

    // Validate
    const { valid, errors } = validateKeyword(keyword);
    if (!valid) {
        console.warn(`[SDNS] Inline keyword validation errors:`, errors);
    }

    return keyword;
}

/**
 * Parse menu options from definition
 * 
 * @param {Array} options - Menu options from definition
 * @returns {Array} Resolved menu options
 */
function parseMenuOptions(options) {
    if (!Array.isArray(options)) return [];

    return options.map(opt => {
        // If string, treat as reference to base option
        if (typeof opt === 'string') {
            const baseOpt = getMenuOption(opt);
            return baseOpt || { id: opt, label: opt, icon: 'circle', type: 'custom' };
        }

        // If object with id, merge with base
        if (opt.id) {
            const baseOpt = getMenuOption(opt.id);
            if (baseOpt) {
                return { ...baseOpt, ...opt };
            }
        }

        // Custom option
        return {
            id: opt.id || `custom-${Date.now()}`,
            label: opt.label || 'Action',
            icon: opt.icon || 'circle',
            action: opt.action || opt.type || 'note',
            params: opt.params || {}
        };
    });
}

/**
 * Parse legacy metadata format
 * 
 * @param {string} displayText - Display text
 * @param {string} metadata - Metadata string
 * @param {string} [patientId] - Current patient ID
 * @returns {Object} Parsed keyword info
 */
function parseLegacyMetadata(displayText, metadata, patientId) {
    // Start with a simple keyword
    const baseKeyword = generateKeywordFromText(displayText, patientId);

    // Parse contradicts
    const contradictsMatch = metadata.match(PATTERNS.LEGACY_CONTRADICTS);
    if (contradictsMatch) {
        baseKeyword.effects = baseKeyword.effects || {};
        baseKeyword.effects.contradicts = [contradictsMatch[1]];
    }

    // Parse reveals
    const revealsMatch = metadata.match(PATTERNS.LEGACY_REVEALS);
    if (revealsMatch) {
        baseKeyword.effects = baseKeyword.effects || {};
        baseKeyword.effects.reveals = baseKeyword.effects.reveals || [];
        baseKeyword.effects.reveals.push(revealsMatch[1]);
    }

    return {
        displayText,
        referenceId: baseKeyword.id,
        keyword: baseKeyword,
        overrides: null,
        isInline: false,
        isDefault: false
    };
}

/**
 * Parse a simple [keyword] with no reference
 * Attempts to find a matching keyword or creates a default
 * 
 * @param {string} displayText - The keyword text
 * @param {string} [patientId] - Current patient ID
 * @returns {Object} Parsed keyword info
 */
function parseSimpleKeyword(displayText, patientId) {
    // Try to find a keyword by display text or alias
    const keyword = findKeywordByText(displayText, patientId);

    if (keyword) {
        return {
            displayText,
            referenceId: keyword.id,
            keyword: { ...keyword, displayText },
            overrides: null,
            isInline: false,
            isDefault: false
        };
    }

    // Generate a keyword on the fly
    const generated = generateKeywordFromText(displayText, patientId);

    return {
        displayText,
        referenceId: generated.id,
        keyword: generated,
        overrides: null,
        isInline: false,
        isDefault: true // Mark as auto-generated
    };
}

/**
 * Find a keyword by its display text or aliases
 * 
 * @param {string} text - Text to search for
 * @param {string} [patientId] - Current patient ID
 * @returns {Object|null} Keyword or null
 */
function findKeywordByText(text, patientId) {
    // This would search through KEYWORDS for matching displayText or aliases
    // For now, return null to use generated keyword
    // In a full implementation, this would do fuzzy matching
    return null;
}

/**
 * Generate a keyword from text when no definition exists
 * 
 * @param {string} text - Keyword text
 * @param {string} [patientId] - Current patient ID
 * @returns {Object} Generated keyword
 */
function generateKeywordFromText(text, patientId) {
    const normalized = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = patientId ? `${patientId}.auto.${normalized}` : `auto.${normalized}`;

    return {
        id,
        category: 'auto',
        displayText: text,
        description: `Auto-generated keyword: "${text}"`,
        style: {
            color: '#6b7fd7',
            bgColor: 'rgba(107, 127, 215, 0.1)',
            icon: 'circle',
            importance: 'low'
        },
        effects: {
            focusCost: 3,
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
        _isGenerated: true
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a position is within any matched range
 * 
 * @param {number} pos - Position to check
 * @param {Array} ranges - Array of [start, end] ranges
 * @returns {boolean}
 */
function isInRange(pos, ranges) {
    return ranges.some(([start, end]) => pos >= start && pos < end);
}

/**
 * Parse relaxed JSON notation (allows unquoted keys, single quotes)
 * 
 * @param {string} str - String to parse
 * @returns {Object} Parsed object
 */
function parseRelaxedJSON(str) {
    // Add quotes around unquoted keys
    let normalized = str
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');

    return JSON.parse(normalized);
}

/**
 * Replace keywords in text with rendered versions
 * 
 * @param {string} text - Original text
 * @param {ParsedKeyword[]} keywords - Parsed keywords
 * @param {Function} renderer - Function to render each keyword
 * @returns {string} Text with keywords replaced
 */
export function renderKeywords(text, keywords, renderer) {
    // Sort by position descending to replace from end
    const sorted = [...keywords].sort((a, b) => b.startIndex - a.startIndex);

    let result = text;
    for (const kw of sorted) {
        const rendered = renderer(kw);
        result = result.slice(0, kw.startIndex) + rendered + result.slice(kw.endIndex);
    }

    return result;
}

/**
 * Extract just the display text from keywords
 * 
 * @param {string} text - Text with keyword markup
 * @returns {string} Plain text with just keyword display text
 */
export function stripKeywordMarkup(text) {
    return text
        .replace(PATTERNS.REFERENCE, '$1')
        .replace(PATTERNS.LEGACY_META, '$1')
        .replace(PATTERNS.SIMPLE, '$1');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    parseKeywords,
    renderKeywords,
    stripKeywordMarkup,
    PATTERNS
};
