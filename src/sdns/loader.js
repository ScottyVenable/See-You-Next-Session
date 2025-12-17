/**
 * SDNS Session Loader
 * Session Dialogue and Narration System - File Loader
 * 
 * Handles loading .session files from patient directories
 * Uses Vite's import.meta.glob for efficient lazy loading with HMR support
 * 
 * @module sdns/loader
 * @version 1.0.0
 */

const isDev = import.meta.env?.DEV ?? false;

// Cache for loaded session files
const sessionCache = new Map();

/**
 * Clear the session cache - useful for development/HMR
 */
export function clearSessionCache() {
    sessionCache.clear();
    console.log('[SDNS Loader] Session cache cleared');
}

/**
 * Load a patient's session dialogue file
 * @param {string} patientId - Patient folder name (e.g., 'gregory')
 * @param {number} turnNumber - Turn number to load (e.g., 1, 2, 3)
 * @param {boolean} forceReload - Skip cache and force reload
 * @returns {Promise<string|null>} - Raw session file content or null
 */
export async function loadSessionDialogue(patientId, turnNumber, forceReload = false) {
    const cacheKey = `${patientId}/turn${turnNumber}`;

    // Check cache (skip in dev mode for HMR support)
    if (!isDev && !forceReload && sessionCache.has(cacheKey)) {
        console.log(`[SDNS Loader] Cache hit: ${cacheKey}`);
        return sessionCache.get(cacheKey);
    }

    try {
        // Use Vite's glob import to find all .session files
        const sessionFiles = import.meta.glob('/src/patients/*/dialogue/*.session', {
            query: '?raw',
            import: 'default',
        });

        const filePath = `/src/patients/${patientId}/dialogue/turn${turnNumber}.session`;

        if (sessionFiles[filePath]) {
            const content = await sessionFiles[filePath]();
            sessionCache.set(cacheKey, content);
            console.log(`[SDNS Loader] Loaded: ${filePath} (${content.length} chars)`);
            return content;
        }

        console.warn(`[SDNS Loader] File not found: ${filePath}`);
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load turn ${turnNumber} for ${patientId}:`, err);
        return null;
    }
}

/**
 * Load a patient's dialogue configuration
 * @param {string} patientId - Patient folder name
 * @returns {Promise<object|null>} - Dialogue config object or null
 */
export async function loadDialogueConfig(patientId) {
    try {
        const configFiles = import.meta.glob('/src/patients/*/dialogue/config.json');
        const configPath = `/src/patients/${patientId}/dialogue/config.json`;

        if (configFiles[configPath]) {
            const config = await configFiles[configPath]();
            console.log(`[SDNS Loader] Loaded config for ${patientId}`);
            return config.default || config;
        }

        console.warn(`[SDNS Loader] No config found for ${patientId}`);
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load config for ${patientId}:`, err);
        return null;
    }
}

/**
 * Load a patient's full configuration
 * @param {string} patientId - Patient folder name
 * @returns {Promise<object|null>} - Patient config object or null
 */
export async function loadPatientConfig(patientId) {
    try {
        const patientFiles = import.meta.glob('/src/patients/*/patient_config.json');
        const configPath = `/src/patients/${patientId}/patient_config.json`;

        if (patientFiles[configPath]) {
            const config = await patientFiles[configPath]();
            console.log(`[SDNS Loader] Loaded patient config for ${patientId}`);
            return config.default || config;
        }

        console.warn(`[SDNS Loader] No patient config found for ${patientId}`);
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load patient config for ${patientId}:`, err);
        return null;
    }
}

/**
 * Get list of all available patients
 * @returns {Promise<array>} - Array of patient info objects
 */
export async function getPatientList() {
    try {
        const patientConfigs = import.meta.glob('/src/patients/*/patient_config.json');
        const patients = [];

        for (const path in patientConfigs) {
            // Extract patient ID from path: /src/patients/gregory/patient_config.json -> gregory
            const match = path.match(/\/src\/patients\/([^/]+)\/patient_config\.json/);
            if (match) {
                const patientId = match[1];
                const config = await patientConfigs[path]();
                const data = config.default || config;

                patients.push({
                    id: patientId,
                    name: data.profile?.name || patientId,
                    avatar: data.profile?.avatar,
                    occupation: data.profile?.occupation,
                    primaryDiagnosis: data.clinical?.primaryDiagnosis,
                    unlockRequirements: data.unlockRequirements,
                    phase: data.clinical?.phase,
                });
            }
        }

        console.log(`[SDNS Loader] Found ${patients.length} patients`);
        return patients;
    } catch (err) {
        console.error('[SDNS Loader] Failed to load patient list:', err);
        return [];
    }
}

/**
 * Preload all turns for a patient
 * @param {string} patientId - Patient folder name
 * @param {number} maxTurns - Maximum turns to load (default: 4)
 * @returns {Promise<object>} - Object with turn number keys and content values
 */
export async function preloadPatientDialogue(patientId, maxTurns = 4) {
    const dialogues = {};

    for (let turn = 1; turn <= maxTurns; turn++) {
        const source = await loadSessionDialogue(patientId, turn);
        if (source) {
            dialogues[turn] = source;
        }
    }

    console.log(`[SDNS Loader] Preloaded ${Object.keys(dialogues).length} turns for ${patientId}`);
    return dialogues;
}

// HMR support - clear cache when files change
if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
        clearSessionCache();
    });
}

export default {
    loadSessionDialogue,
    loadDialogueConfig,
    loadPatientConfig,
    getPatientList,
    preloadPatientDialogue,
    clearSessionCache,
};
