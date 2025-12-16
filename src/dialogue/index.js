/**
 * SYNS Dialogue System
 * See You Next Session - Custom Dialogue Language
 */

// Core modules
export { parseDialogue, parseDialogueFile, Lexer, Parser, TokenType } from './parser.js';
export { DialogueEngine, createDialogueEngine } from './engine.js';
export { useDialogue } from './useDialogue.js';

// Patient ID to folder mapping
const PATIENT_FOLDERS = {
    'patient-tutorial': 'alex',
    'alex': 'alex',
    // Add more patients here as they're created
    // 'patient-id': 'folder-name',
};

// Utility to load patient dialogue
export async function loadPatientDialogue(patientId, turn) {
    // Resolve folder name from patient ID
    const folderName = PATIENT_FOLDERS[patientId] || patientId;
    const path = `/src/dialogue/patients/${folderName}/turn${turn}.syns`;

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load: ${path}`);
        return await response.text();
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
