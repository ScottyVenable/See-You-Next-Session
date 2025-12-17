/**
 * SDNS - Session Dialogue and Narration System
 * Main Entry Point
 * 
 * A custom dialogue scripting language designed for therapy simulation games.
 * Provides branching narrative, dynamic responses, and game state integration.
 * 
 * @module sdns
 * @version 1.0.0
 * 
 * @example
 * // Import the system
 * import { useDialogue, loadSessionDialogue, parseDialogue } from '../sdns';
 * 
 * // In a React component
 * function DialogueBox({ gameState, actions }) {
 *     const dialogue = useDialogue(gameState, actions);
 *     
 *     useEffect(() => {
 *         async function loadDialogue() {
 *             const source = await loadSessionDialogue('gregory', 1);
 *             if (source) {
 *                 dialogue.loadDialogue(source);
 *                 dialogue.startBlock('START');
 *             }
 *         }
 *         loadDialogue();
 *     }, []);
 *     
 *     return <div>{dialogue.currentSpeech?.text}</div>;
 * }
 */

// Core modules - import for local use AND re-export
import { parseDialogue, parseDialogueFile, Lexer, Parser, TokenType } from './parser.js';
import { DialogueEngine, createDialogueEngine } from './engine.js';
import { useDialogue } from './useDialogue.js';
import {
    loadSessionDialogue,
    loadDialogueConfig,
    loadPatientConfig,
    getPatientList,
    preloadPatientDialogue,
    clearSessionCache,
} from './loader.js';

// Re-export all modules
export { parseDialogue, parseDialogueFile, Lexer, Parser, TokenType };
export { DialogueEngine, createDialogueEngine };
export { useDialogue };
export {
    loadSessionDialogue,
    loadDialogueConfig,
    loadPatientConfig,
    getPatientList,
    preloadPatientDialogue,
    clearSessionCache,
};

// Patient ID to folder mapping (for backwards compatibility)
const PATIENT_ALIASES = {
    'patient-tutorial': 'gregory',
    'tutorial': 'gregory',
    // Add more aliases as needed
};

/**
 * Resolve a patient ID to folder name
 * @param {string} patientId - Patient ID or alias
 * @returns {string} - Resolved folder name
 */
export function resolvePatientId(patientId) {
    return PATIENT_ALIASES[patientId] || patientId;
}

/**
 * Load patient dialogue with alias resolution
 * Convenience function that handles patient ID resolution
 * 
 * @param {string} patientId - Patient ID or alias
 * @param {number} turn - Turn number to load
 * @param {boolean} forceReload - Skip cache
 * @returns {Promise<string|null>} - Raw dialogue content
 */
export async function loadPatientDialogue(patientId, turn, forceReload = false) {
    const { loadSessionDialogue } = await import('./loader.js');
    const resolvedId = resolvePatientId(patientId);
    return loadSessionDialogue(resolvedId, turn, forceReload);
}

// Version info
export const SDNS_VERSION = '1.0.0';
export const SDNS_NAME = 'Session Dialogue and Narration System';

// Default export
export default {
    parseDialogue,
    DialogueEngine,
    createDialogueEngine,
    useDialogue,
    loadSessionDialogue: loadPatientDialogue,
    loadPatientDialogue,
    resolvePatientId,
    SDNS_VERSION,
    SDNS_NAME,
};
