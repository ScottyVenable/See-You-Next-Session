/**
 * SYNS Dialogue System
 * See You Next Session - Custom Dialogue Language
 */

// Core modules - import for re-export and local use
import { parseDialogue, parseDialogueFile, Lexer, Parser, TokenType } from './parser.js';
import { DialogueEngine, createDialogueEngine } from './engine.js';
import { useDialogue } from './useDialogue.js';

// Re-export all
export { parseDialogue, parseDialogueFile, Lexer, Parser, TokenType };
export { DialogueEngine, createDialogueEngine };
export { useDialogue };

// Patient ID to folder mapping
const PATIENT_FOLDERS = {
    'patient-tutorial': 'alex',
    'alex': 'alex',
    // Add more patients here as they're created
    // 'patient-id': 'folder-name',
};

// Cache for loaded dialogue files
const dialogueCache = new Map();

// Utility to load patient dialogue using Vite's glob import
export async function loadPatientDialogue(patientId, turn) {
    // Resolve folder name from patient ID
    const folderName = PATIENT_FOLDERS[patientId] || patientId;
    const cacheKey = `${folderName}/turn${turn}`;

    // Check cache first
    if (dialogueCache.has(cacheKey)) {
        return dialogueCache.get(cacheKey);
    }

    try {
        // Use dynamic import with Vite's ?raw suffix to get file as string
        const modules = import.meta.glob('./patients/**/*.syns', { query: '?raw', import: 'default' });
        const modulePath = `./patients/${folderName}/turn${turn}.syns`;

        if (modules[modulePath]) {
            const source = await modules[modulePath]();
            dialogueCache.set(cacheKey, source);
            console.log(`[DialogueLoader] Loaded ${modulePath}, length: ${source.length}`);
            return source;
        } else {
            console.warn(`[DialogueLoader] File not found: ${modulePath}`);
            console.log('[DialogueLoader] Available modules:', Object.keys(modules));
            return null;
        }
    } catch (error) {
        console.error(`Error loading dialogue for ${patientId} (folder: ${folderName}) turn ${turn}:`, error);
        return null;
    }
}

// Preload all turns for a patient
export async function preloadPatientDialogue(patientId, maxTurns = 4) {
    const dialogues = {};

    for (let turn = 1; turn <= maxTurns; turn++) {
        const source = await loadPatientDialogue(patientId, turn);
        if (source) {
            dialogues[turn] = source;
        }
    }

    return dialogues;
}

// Default export
export default {
    parseDialogue,
    DialogueEngine,
    createDialogueEngine,
    useDialogue,
    loadPatientDialogue,
    preloadPatientDialogue,
};
