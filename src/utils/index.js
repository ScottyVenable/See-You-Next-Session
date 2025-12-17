/**
 * Patient System Exports
 * Centralized exports for patient management, sessions, and data
 */

// Core utilities
export { patientLoader, default as PatientLoader } from './PatientLoader.js';
export { sessionSaveManager, default as SessionSaveManager } from './SessionSaveManager.js';
export { saveManager, default as SaveManager } from './SaveManager.js';

// Re-export for convenience
export { soundManager, default as SoundManager } from './SoundManager.js';

/**
 * Quick utility functions
 */

/**
 * Load a patient and start a new session
 */
export async function startPatientSession(patientId, turnNumber = 1) {
    const { patientLoader } = await import('./PatientLoader.js');
    const { sessionSaveManager } = await import('./SessionSaveManager.js');

    // Load patient config
    const patientConfig = await patientLoader.loadPatient(patientId);
    if (!patientConfig) {
        throw new Error(`Patient not found: ${patientId}`);
    }

    // Create new session
    const session = sessionSaveManager.createSession(patientId, turnNumber);

    // Initialize session with patient's starting values
    session.patient.rapport = patientConfig.presentation?.initialRapport || 25;
    session.patient.mood = patientConfig.presentation?.initialMood || 'neutral';
    session.patient.guardedness = patientConfig.presentation?.guardedness || 70;
    session.patient.openness = patientConfig.presentation?.openness || 30;

    sessionSaveManager.save();

    return {
        patient: patientConfig,
        session
    };
}

/**
 * Resume an existing patient session
 */
export async function resumePatientSession(patientId) {
    const { patientLoader } = await import('./PatientLoader.js');
    const { sessionSaveManager } = await import('./SessionSaveManager.js');

    // Load patient config
    const patientConfig = await patientLoader.loadPatient(patientId);
    if (!patientConfig) {
        throw new Error(`Patient not found: ${patientId}`);
    }

    // Try to load existing session
    const session = sessionSaveManager.loadPatientSession(patientId);

    if (!session) {
        // No existing session, create new one
        return startPatientSession(patientId);
    }

    return {
        patient: patientConfig,
        session
    };
}

/**
 * Get dialogue configuration for response UI
 */
export async function getDialogueConfig(patientId) {
    const { patientLoader } = await import('./PatientLoader.js');
    return patientLoader.loadDialogueConfig(patientId);
}

/**
 * Get available response topics based on current session state
 */
export async function getAvailableTopics(patientId, sessionState) {
    const { patientLoader } = await import('./PatientLoader.js');
    const { sessionSaveManager } = await import('./SessionSaveManager.js');

    const session = sessionSaveManager.getCurrentSession() || sessionState;
    const rapport = session?.patient?.rapport || 0;

    return patientLoader.getAvailableTopics(patientId, rapport, {
        reveals: session?.discoveries?.reveals || [],
        flags: session?.flags || {},
        topics: session?.topics || {}
    });
}

/**
 * Complete a session and calculate score
 */
export async function completeSession(patientId) {
    const { patientLoader } = await import('./PatientLoader.js');
    const { sessionSaveManager } = await import('./SessionSaveManager.js');
    const { saveManager } = await import('./SaveManager.js');

    // Get session summary
    const summary = sessionSaveManager.completeSession();
    if (!summary) return null;

    // Calculate score
    const session = sessionSaveManager.getCurrentSession();
    const scoreResult = await patientLoader.calculateScore(patientId, session);

    // Update global save with results
    saveManager.completePatient(patientId, scoreResult.rank, scoreResult.score);

    return {
        summary,
        score: scoreResult.score,
        rank: scoreResult.rank,
        maxScore: scoreResult.maxScore
    };
}
