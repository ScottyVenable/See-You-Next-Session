/**
 * KeysFileParser - Parses .keys files into structured keyword/action/animation data
 * 
 * This parser handles the SDNS-native .keys file format which uses a syntax
 * similar to .session files for consistency across the SDNS system.
 * 
 * File Structure:
 * ===META===
 * source: "patient-id"
 * displayName: "Display Name"
 * 
 * ===KEYWORDS===
 * [category.keywordId] {
 *     displayText: "text"
 *     ...properties
 * }
 * 
 * ===ACTIONS===
 * @actionId {
 *     label: "Action Label"
 *     ...properties
 * }
 * 
 * ===ANIMATIONS===
 * @animId {
 *     type: "shake"
 *     ...properties
 * }
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @typedef {Object} ParsedKeysFile
 * @property {Object} meta - File metadata
 * @property {Object} keywords - Keywords by category.id
 * @property {Object} actions - Actions by id
 * @property {Object} animations - Animations by id
 * @property {string[]} errors - Parse errors
 * @property {string[]} warnings - Parse warnings
 */

/**
 * @typedef {Object} ParsedKeyword
 * @property {string} id - Full keyword ID
 * @property {string} category - Category from the ID
 * @property {string} keywordId - Keyword ID within category
 * @property {Object} properties - All parsed properties
 */

// ============================================================================
// KEYS FILE PARSER
// ============================================================================

class KeysFileParser {
    constructor() {
        this.currentSection = null;
        this.lineNumber = 0;
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Parse a .keys file content string
     * @param {string} content - The .keys file content
     * @param {string} [filename] - Optional filename for error messages
     * @returns {ParsedKeysFile} Parsed result
     */
    parse(content, filename = 'unknown.keys') {
        this.errors = [];
        this.warnings = [];
        this.currentSection = null;
        this.lineNumber = 0;

        const result = {
            meta: {},
            keywords: {},
            actions: {},
            animations: {},
            errors: this.errors,
            warnings: this.warnings
        };

        const lines = content.split('\n');
        let currentBlock = null;
        let currentBlockType = null;
        let currentBlockId = null;
        let braceDepth = 0;
        let blockContent = '';

        for (let i = 0; i < lines.length; i++) {
            this.lineNumber = i + 1;
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (trimmed === '' || trimmed.startsWith('//')) {
                continue;
            }

            // Check for section headers
            const sectionMatch = trimmed.match(/^===\s*(\w+)\s*===$/);
            if (sectionMatch) {
                this.currentSection = sectionMatch[1].toUpperCase();
                continue;
            }

            // If we're inside a block, accumulate content
            if (currentBlock !== null) {
                blockContent += line + '\n';
                braceDepth += (line.match(/{/g) || []).length;
                braceDepth -= (line.match(/}/g) || []).length;

                // Block is complete when braces are balanced
                if (braceDepth === 0) {
                    try {
                        const parsed = this.parseBlockContent(blockContent, currentBlockType, currentBlockId);

                        if (currentBlockType === 'keyword') {
                            result.keywords[currentBlockId] = parsed;
                        } else if (currentBlockType === 'action') {
                            result.actions[currentBlockId] = parsed;
                        } else if (currentBlockType === 'animation') {
                            result.animations[currentBlockId] = parsed;
                        }
                    } catch (err) {
                        this.errors.push(`Line ${this.lineNumber}: ${err.message}`);
                    }

                    currentBlock = null;
                    currentBlockType = null;
                    currentBlockId = null;
                    blockContent = '';
                }
                continue;
            }

            // Handle section-specific content
            if (this.currentSection === 'META') {
                this.parseMetaLine(trimmed, result.meta);
            } else if (this.currentSection === 'KEYWORDS') {
                // Check for keyword definition start: [category.keywordId] {
                const keywordMatch = trimmed.match(/^\[([^\]]+)\]\s*\{?\s*$/);
                if (keywordMatch) {
                    currentBlock = 'keyword';
                    currentBlockType = 'keyword';
                    currentBlockId = keywordMatch[1];
                    blockContent = line + '\n';
                    braceDepth = (line.match(/{/g) || []).length;
                    braceDepth -= (line.match(/}/g) || []).length;
                }
            } else if (this.currentSection === 'ACTIONS') {
                // Check for action definition start: @actionId {
                const actionMatch = trimmed.match(/^@([a-zA-Z0-9_.]+)\s*\{?\s*$/);
                if (actionMatch) {
                    currentBlock = 'action';
                    currentBlockType = 'action';
                    currentBlockId = actionMatch[1];
                    blockContent = line + '\n';
                    braceDepth = (line.match(/{/g) || []).length;
                    braceDepth -= (line.match(/}/g) || []).length;
                }
            } else if (this.currentSection === 'ANIMATIONS') {
                // Check for animation definition start: @animId {
                const animMatch = trimmed.match(/^@([a-zA-Z0-9_]+)\s*\{?\s*$/);
                if (animMatch) {
                    currentBlock = 'animation';
                    currentBlockType = 'animation';
                    currentBlockId = animMatch[1];
                    blockContent = line + '\n';
                    braceDepth = (line.match(/{/g) || []).length;
                    braceDepth -= (line.match(/}/g) || []).length;
                }
            }
        }

        // Check for unclosed blocks
        if (currentBlock !== null) {
            this.errors.push(`Unclosed ${currentBlockType} block: ${currentBlockId}`);
        }

        return result;
    }

    /**
     * Parse a meta section line
     * @param {string} line - The line to parse
     * @param {Object} meta - The meta object to populate
     */
    parseMetaLine(line, meta) {
        // Handle simple key: value
        const simpleMatch = line.match(/^(\w+):\s*"?([^"{}]+)"?\s*$/);
        if (simpleMatch) {
            const [, key, value] = simpleMatch;
            // Try to parse as JSON-like value
            meta[key] = this.parseValue(value.trim());
            return;
        }

        // Handle object start: key: {
        const objectMatch = line.match(/^(\w+):\s*\{\s*$/);
        if (objectMatch) {
            // Object parsing would need multi-line handling
            // For now, simple key-value is supported in meta
            this.warnings.push(`Line ${this.lineNumber}: Nested objects in META not fully supported yet`);
        }
    }

    /**
     * Parse a block's content into an object
     * @param {string} content - The block content including braces
     * @param {string} blockType - The type of block (keyword, action, animation)
     * @param {string} blockId - The block's ID
     * @returns {Object} Parsed block data
     */
    parseBlockContent(content, blockType, blockId) {
        const result = { id: blockId };

        // For keywords, parse the category from the ID
        if (blockType === 'keyword') {
            const parts = blockId.split('.');
            if (parts.length >= 2) {
                result.category = parts[0];
                result.keywordId = parts.slice(1).join('.');
            } else {
                result.category = 'uncategorized';
                result.keywordId = blockId;
            }
        }

        // Extract content between first { and last }
        const braceStart = content.indexOf('{');
        const braceEnd = content.lastIndexOf('}');
        if (braceStart === -1 || braceEnd === -1 || braceEnd <= braceStart) {
            throw new Error('Invalid block structure');
        }

        const innerContent = content.slice(braceStart + 1, braceEnd);

        // Parse the inner content as properties
        this.parseProperties(innerContent, result);

        return result;
    }

    /**
     * Parse properties from content
     * @param {string} content - Content string
     * @param {Object} target - Object to populate with properties
     */
    parseProperties(content, target) {
        const lines = content.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            i++;

            // Skip empty lines and comments
            if (line === '' || line.startsWith('//')) {
                continue;
            }

            // Property with nested object: key: {
            const objectMatch = line.match(/^(\w+):\s*\{\s*$/);
            if (objectMatch) {
                const key = objectMatch[1];
                const nestedContent = [];
                let depth = 1;

                while (i < lines.length && depth > 0) {
                    const nestedLine = lines[i];
                    depth += (nestedLine.match(/{/g) || []).length;
                    depth -= (nestedLine.match(/}/g) || []).length;
                    if (depth > 0) {
                        nestedContent.push(nestedLine);
                    }
                    i++;
                }

                target[key] = {};
                this.parseProperties(nestedContent.join('\n'), target[key]);
                continue;
            }

            // Property with array: key: [
            const arrayMatch = line.match(/^(\w+):\s*\[\s*$/);
            if (arrayMatch) {
                const key = arrayMatch[1];
                const arrayItems = [];
                let depth = 1;
                let currentItem = [];

                while (i < lines.length && depth > 0) {
                    const arrayLine = lines[i].trim();
                    i++;

                    if (arrayLine.startsWith('{')) {
                        depth++;
                        currentItem.push(arrayLine);
                    } else if (arrayLine.startsWith('}') || arrayLine === '},') {
                        depth--;
                        if (depth === 1) {
                            // Complete item
                            currentItem.push('}');
                            const itemObj = {};
                            this.parseProperties(currentItem.join('\n').replace(/^\{|\}$/g, ''), itemObj);
                            arrayItems.push(itemObj);
                            currentItem = [];
                        } else if (depth === 0) {
                            // End of array
                            break;
                        } else {
                            currentItem.push(arrayLine);
                        }
                    } else if (arrayLine === ']') {
                        depth = 0;
                    } else if (depth > 1) {
                        currentItem.push(arrayLine);
                    } else if (arrayLine && !arrayLine.startsWith('//')) {
                        // Simple array item (string)
                        const valueMatch = arrayLine.match(/^"([^"]+)"[,]?\s*$/);
                        if (valueMatch) {
                            arrayItems.push(valueMatch[1]);
                        }
                    }
                }

                target[key] = arrayItems;
                continue;
            }

            // Simple property: key: value or key: "value"
            const simpleMatch = line.match(/^(\w+):\s*(.+?)\s*$/);
            if (simpleMatch) {
                const [, key, rawValue] = simpleMatch;
                target[key] = this.parseValue(rawValue);
            }
        }
    }

    /**
     * Parse a value string into appropriate type
     * @param {string} value - Raw value string
     * @returns {*} Parsed value
     */
    parseValue(value) {
        // Remove trailing comma if present
        value = value.replace(/,\s*$/, '');

        // String in quotes
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }

        // Boolean
        if (value === 'true') return true;
        if (value === 'false') return false;

        // Number
        if (/^-?\d+\.?\d*$/.test(value)) {
            return parseFloat(value);
        }

        // Array inline: ["a", "b", "c"]
        if (value.startsWith('[') && value.endsWith(']')) {
            try {
                return JSON.parse(value);
            } catch {
                // Not valid JSON, return as string
                return value;
            }
        }

        // Object inline: { key: value }
        if (value.startsWith('{') && value.endsWith('}')) {
            try {
                // Try parsing as JSON
                return JSON.parse(value);
            } catch {
                // Not valid JSON, try custom parse
                const obj = {};
                const inner = value.slice(1, -1).trim();
                const pairs = inner.split(',');
                for (const pair of pairs) {
                    const colonIdx = pair.indexOf(':');
                    if (colonIdx !== -1) {
                        const k = pair.slice(0, colonIdx).trim();
                        const v = pair.slice(colonIdx + 1).trim();
                        obj[k] = this.parseValue(v);
                    }
                }
                return obj;
            }
        }

        // Default: return as string
        return value;
    }

    /**
     * Convert parsed .keys data to JSON keyword format
     * @param {ParsedKeysFile} parsed - Parsed .keys file data
     * @returns {Object} JSON keyword file format
     */
    toJsonFormat(parsed) {
        const source = parsed.meta.source || 'unknown';

        const result = {
            source: source,
            displayName: parsed.meta.displayName || source,
            description: parsed.meta.description || '',
            version: parsed.meta.version || '1.0.0',
            patientInfo: parsed.meta.patientInfo || null,
            keywords: {},
            actions: parsed.actions,
            animations: parsed.animations
        };

        // Organize keywords by category
        for (const [id, keyword] of Object.entries(parsed.keywords)) {
            const category = keyword.category || 'uncategorized';

            if (!result.keywords[category]) {
                result.keywords[category] = {
                    _category: {
                        name: this.formatCategoryName(category),
                        description: ''
                    }
                };
            }

            // Build full ID
            const fullId = `${source}.${id}`;

            result.keywords[category][keyword.keywordId] = {
                id: fullId,
                displayText: keyword.displayText || keyword.keywordId,
                aliases: keyword.aliases || [],
                description: keyword.description || '',
                importance: keyword.importance || 'medium',
                note: keyword.note || null,
                style: keyword.style || {},
                effects: keyword.effects || {},
                menuOptions: keyword.menuOptions || []
            };
        }

        return result;
    }

    /**
     * Format a category ID into a display name
     * @param {string} category - Category ID
     * @returns {string} Formatted name
     */
    formatCategoryName(category) {
        return category
            .replace(/([A-Z])/g, ' $1')
            .replace(/[-_]/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export for both ES modules and CommonJS
export { KeysFileParser };
export default KeysFileParser;
