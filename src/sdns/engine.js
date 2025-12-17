/**
 * SDNS Dialogue Engine
 * Session Dialogue and Narration System - Runtime Execution Engine
 * 
 * Executes parsed dialogue ASTs with game state integration
 * 
 * @module sdns/engine
 * @version 1.0.0
 */

import { parseDialogue } from './parser.js';

/**
 * DialogueEngine - Runs dialogue scripts with game state
 * 
 * The engine takes parsed dialogue ASTs and executes them line by line,
 * handling conditional branching, game state modifications, and callbacks.
 */
export class DialogueEngine {
    constructor(gameState, actions) {
        this.gameState = gameState;
        this.actions = actions;

        // Loaded dialogue data
        this.dialogueData = null;

        // Current execution state
        this.currentBlock = null;
        this.currentLineIndex = 0;
        this.executionStack = [];

        // Custom variables set by @set
        this.variables = {};

        // Response handlers
        this.responseHandlers = new Map();

        // Event callbacks
        this.onSpeech = null;
        this.onAction = null;
        this.onKeywordFound = null;
        this.onRapportChange = null;
        this.onFocusChange = null;
        this.onReveal = null;
        this.onBreakthrough = null;
        this.onPause = null;
        this.onBlockEnd = null;
    }

    /**
     * Load dialogue from a source string
     * @param {string} source - Raw .session file content
     * @returns {DialogueEngine} - This engine for chaining
     */
    loadDialogue(source) {
        console.log('[SDNS Engine] Loading dialogue, source length:', source?.length);
        this.dialogueData = parseDialogue(source);
        console.log('[SDNS Engine] Parsed dialogue:', this.dialogueData);
        console.log('[SDNS Engine] Available blocks:', Object.keys(this.dialogueData?.blocks || {}));
        this.variables = {};
        this.currentBlock = null;
        this.currentLineIndex = 0;
        this.executionStack = [];
        return this;
    }

    /**
     * Load dialogue from pre-parsed AST
     * @param {object} ast - Parsed dialogue AST
     * @returns {DialogueEngine} - This engine for chaining
     */
    loadAST(ast) {
        this.dialogueData = ast;
        this.variables = {};
        this.currentBlock = null;
        this.currentLineIndex = 0;
        this.executionStack = [];
        return this;
    }

    /**
     * Start execution from a named block
     * @param {string} blockName - Name of block to start (default: 'START')
     * @returns {object|null} - First execution result or null
     */
    startBlock(blockName = 'START') {
        console.log('[SDNS Engine] startBlock called with:', blockName);
        if (!this.dialogueData) {
            throw new Error('No dialogue loaded');
        }

        const block = this.dialogueData.blocks[blockName];
        if (!block) {
            console.warn(`Block "${blockName}" not found`);
            return null;
        }

        console.log('[SDNS Engine] Block found, lines:', block.lines?.length);
        this.currentBlock = blockName;
        this.currentLineIndex = 0;
        const result = this.executeNext();
        console.log('[SDNS Engine] startBlock result:', result);
        return result;
    }

    /**
     * Execute the next line in current block
     * @returns {object|null} - Execution result or null if block ended
     */
    executeNext() {
        console.log('[SDNS Engine] executeNext, block:', this.currentBlock, 'index:', this.currentLineIndex);
        if (!this.currentBlock || !this.dialogueData) {
            return null;
        }

        const block = this.dialogueData.blocks[this.currentBlock];
        if (!block || this.currentLineIndex >= block.lines.length) {
            // Block finished
            console.log('[SDNS Engine] Block finished');
            if (this.onBlockEnd) {
                this.onBlockEnd(this.currentBlock);
            }
            return { type: 'end', block: this.currentBlock };
        }

        const line = block.lines[this.currentLineIndex];
        console.log('[SDNS Engine] Executing line:', line);
        this.currentLineIndex++;

        return this.executeLine(line);
    }

    /**
     * Execute a single line/node
     * @param {object} node - AST node to execute
     * @returns {object|null} - Execution result
     */
    executeLine(node) {
        if (!node) return null;

        switch (node.type) {
            case 'speech':
                return this.executeSpeech(node);
            case 'if':
                return this.executeIf(node);
            case 'when':
                return this.executeWhen(node);
            case 'goto':
                return this.executeGoto(node);
            case 'reveal':
                return this.executeReveal(node);
            case 'rapport':
                return this.executeRapport(node);
            case 'focus':
                return this.executeFocus(node);
            case 'unlock':
                return this.executeUnlock(node);
            case 'set':
                return this.executeSet(node);
            case 'pause':
                return this.executePause(node);
            case 'trigger':
                return this.executeTrigger(node);
            default:
                console.warn('Unknown node type:', node.type);
                return this.executeNext();
        }
    }

    /**
     * Execute speech line
     */
    executeSpeech(node) {
        console.log('[SDNS Engine] executeSpeech node:', node);
        const result = {
            type: 'speech',
            speaker: node.speaker,
            mood: node.mood,
            text: node.text,
            keywords: node.keywords,
            isAction: node.isAction,
        };

        if (this.onSpeech) {
            this.onSpeech(result);
        }

        // Notify about keywords
        if (node.keywords && node.keywords.length > 0 && this.onKeywordFound) {
            node.keywords.forEach(kw => this.onKeywordFound(kw));
        }

        return result;
    }

    /**
     * Execute conditional
     */
    executeIf(node) {
        const conditionMet = this.evaluateCondition(node.condition);

        const branch = conditionMet ? node.then : node.else;
        if (branch && branch.length > 0) {
            // Execute all lines of branch
            const results = [];
            for (const line of branch) {
                const result = this.executeLine(line);
                if (result) results.push(result);
            }
            // Return first speech result if any, or continue
            const speechResult = results.find(r => r.type === 'speech');
            if (speechResult) return speechResult;
        }

        return this.executeNext();
    }

    /**
     * Execute when handler (response to player action)
     */
    executeWhen(node) {
        // Store as response handler for later invocation
        const conditionStr = this.conditionToString(node.condition);
        this.responseHandlers.set(conditionStr, node.lines);

        // Continue to next line
        return this.executeNext();
    }

    /**
     * Execute goto (jump to another block)
     */
    executeGoto(node) {
        this.currentBlock = node.target;
        this.currentLineIndex = 0;
        return this.executeNext();
    }

    /**
     * Execute reveal symptom
     */
    executeReveal(node) {
        if (this.actions?.revealSymptom) {
            this.actions.revealSymptom(node.symptomId);
        }
        if (this.onReveal) {
            this.onReveal(node.symptomId);
        }
        return this.executeNext();
    }

    /**
     * Execute rapport change
     */
    executeRapport(node) {
        if (this.actions?.changeRapport) {
            this.actions.changeRapport(node.amount, 'dialogue_script');
        }
        if (this.onRapportChange) {
            this.onRapportChange(node.amount);
        }
        return this.executeNext();
    }

    /**
     * Execute focus change
     */
    executeFocus(node) {
        if (node.amount > 0) {
            if (this.actions?.restoreFocus) {
                this.actions.restoreFocus(node.amount);
            }
        } else {
            if (this.actions?.spendFocus) {
                this.actions.spendFocus(Math.abs(node.amount));
            }
        }
        if (this.onFocusChange) {
            this.onFocusChange(node.amount);
        }
        return this.executeNext();
    }

    /**
     * Execute unlock
     */
    executeUnlock(node) {
        if (this.actions?.unlockDialogue) {
            this.actions.unlockDialogue(node.blockId);
        }
        return this.executeNext();
    }

    /**
     * Execute set variable
     */
    executeSet(node) {
        this.variables[node.variable] = node.value;
        return this.executeNext();
    }

    /**
     * Execute pause - skip pauses and continue to next line
     */
    executePause(node) {
        // In continuous mode, skip pauses
        return this.executeNext();
    }

    /**
     * Execute trigger (for breakthroughs)
     */
    executeTrigger(node) {
        return {
            type: 'trigger',
            keyword: node.keyword,
            symptom: node.symptom,
        };
    }

    /**
     * Evaluate a condition against current state
     * @param {array} conditionTokens - Condition tokens from parser
     * @returns {boolean} - Whether condition is met
     */
    evaluateCondition(conditionTokens) {
        if (!conditionTokens || conditionTokens.length === 0) {
            return true;
        }

        // Build expression string and evaluate
        let expr = '';
        let i = 0;

        while (i < conditionTokens.length) {
            const token = conditionTokens[i];

            if (token.isFunction) {
                // Handle function calls
                const value = this.evaluateFunction(token.value, token.args);
                expr += value ? 'true' : 'false';
            } else if (token.type === 'IDENTIFIER') {
                // Variable reference
                const value = this.getVariable(token.value);
                expr += typeof value === 'string' ? `"${value}"` : value;
            } else if (token.type === 'NUMBER') {
                expr += token.value;
            } else if (token.type === 'COMPARISON') {
                expr += ` ${token.value} `;
            } else if (token.type === 'LOGICAL') {
                expr += ` ${token.value} `;
            }

            i++;
        }

        try {
            // Safe evaluation using Function constructor
            return new Function(`return ${expr}`)();
        } catch (e) {
            console.warn('Condition evaluation failed:', expr, e);
            return false;
        }
    }

    /**
     * Evaluate a condition function
     * @param {string} name - Function name
     * @param {array} args - Function arguments
     * @returns {boolean} - Function result
     */
    evaluateFunction(name, args) {
        const state = this.gameState;

        switch (name) {
            case 'has_symptom':
                return state.revealedSymptoms?.includes(args[0]);
            case 'has_keyword':
                return state.collectedTokens?.some(t => t.id === args[0]);
            case 'has_breakthrough':
                return state.breakthroughs?.some(b => b.id === args[0]);
            case 'asked_about':
                return this.variables[`asked_${args[0]}`] === true;
            default:
                console.warn('Unknown function:', name);
                return false;
        }
    }

    /**
     * Get a variable value (from game state or custom vars)
     * @param {string} name - Variable name
     * @returns {any} - Variable value
     */
    getVariable(name) {
        // Check custom variables first (prefixed with $)
        if (name.startsWith('$')) {
            return this.variables[name.substring(1)];
        }

        // Check game state
        const state = this.gameState;
        switch (name) {
            case 'rapport':
                return state.rapport ?? 50;
            case 'focus':
                return state.focus ?? 100;
            case 'turn':
                return state.currentTurn ?? 1;
            case 'breakthroughs':
                return state.breakthroughs?.length ?? 0;
            default:
                // Check custom variables
                if (name in this.variables) {
                    return this.variables[name];
                }
                return 0;
        }
    }

    /**
     * Convert condition tokens to string (for response handler key)
     */
    conditionToString(tokens) {
        return tokens.map(t => t.value || t.args?.join(',')).join('');
    }

    /**
     * Handle a player response (topic selection)
     * @param {string} topic - Topic identifier
     * @param {string} subtopic - Optional subtopic
     * @returns {array|null} - Execution results
     */
    handleResponse(topic, subtopic = null) {
        // Mark that we asked about this topic
        this.variables[`asked_${topic}`] = true;
        if (subtopic) {
            this.variables[`asked_${topic}.${subtopic}`] = true;
        }

        // Look for response handler
        const responseKey = subtopic ? `${topic}.${subtopic}` : topic;

        // Check dialogue responses
        const response = this.dialogueData?.responses[responseKey];
        if (response) {
            const results = [];
            for (const line of response.lines) {
                const result = this.executeLine(line);
                if (result) results.push(result);
            }
            return results;
        }

        return null;
    }

    /**
     * Check if a breakthrough can be triggered
     * @param {string} keywordId - Keyword that was collected
     * @param {string} symptomId - Symptom that was revealed
     * @returns {object|null} - Breakthrough result or null
     */
    checkBreakthrough(keywordId, symptomId) {
        if (!this.dialogueData?.breakthroughs) return null;

        for (const [name, bt] of Object.entries(this.dialogueData.breakthroughs)) {
            // Look for trigger in the lines
            const triggerLine = bt.lines.find(l => l.type === 'trigger');
            if (triggerLine) {
                if (triggerLine.keyword === keywordId && triggerLine.symptom === symptomId) {
                    // Execute breakthrough dialogue
                    const results = [];
                    for (const line of bt.lines) {
                        if (line.type !== 'trigger') {
                            const result = this.executeLine(line);
                            if (result) results.push(result);
                        }
                    }

                    if (this.onBreakthrough) {
                        this.onBreakthrough(name, results);
                    }

                    return { name, results };
                }
            }
        }

        return null;
    }

    /**
     * Get all speech lines for a block (for preview)
     * @param {string} blockName - Block to preview
     * @returns {array} - Speech lines
     */
    getBlockSpeechLines(blockName) {
        const block = this.dialogueData?.blocks[blockName];
        if (!block) return [];

        return block.lines
            .filter(l => l.type === 'speech')
            .map(l => ({
                speaker: l.speaker,
                mood: l.mood,
                text: l.text,
                keywords: l.keywords,
            }));
    }

    /**
     * Get available responses for current state
     * @returns {array} - Available response options
     */
    getAvailableResponses() {
        if (!this.dialogueData?.responses) return [];

        return Object.keys(this.dialogueData.responses).map(key => {
            const [topic, subtopic] = key.split('.');
            return { topic, subtopic, key };
        });
    }

    /**
     * Reset engine state
     */
    reset() {
        this.currentBlock = null;
        this.currentLineIndex = 0;
        this.executionStack = [];
        this.variables = {};
        this.responseHandlers.clear();
    }
}

/**
 * Create a dialogue engine instance
 * @param {object} gameState - Game state object
 * @param {object} actions - Game action callbacks
 * @returns {DialogueEngine} - New engine instance
 */
export function createDialogueEngine(gameState, actions) {
    return new DialogueEngine(gameState, actions);
}

export default DialogueEngine;
