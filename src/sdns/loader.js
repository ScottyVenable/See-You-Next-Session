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

// Lazy import error handler to avoid circular deps
let errorHandler = null;
async function getErrorHandler() {
    if (!errorHandler) {
        try {
            const module = await import('../utils/ErrorHandler.js');
            errorHandler = module.errorHandler;
        } catch (e) {
            // Fallback if error handler not available
            errorHandler = {
                sdns: (msg, level, details) => console.warn('[SDNS]', msg, details),
                patient: (msg, level, details) => console.warn('[Patient]', msg, details),
            };
        }
    }
    return errorHandler;
}

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
        const sessionFiles = {
            ...import.meta.glob('/src/patients/**/dialogue/*.session', { query: '?raw', import: 'default' }),
            ...import.meta.glob('../patients/**/dialogue/*.session', { query: '?raw', import: 'default' }),
            ...import.meta.glob('./patients/**/dialogue/*.session', { query: '?raw', import: 'default' }),
        };

        const filePath = `/src/patients/${patientId}/dialogue/turn${turnNumber}.session`;

        // Direct hit first
        let loaderPath = filePath;
        if (!sessionFiles[loaderPath]) {
            // Fallback: search for any path that contains patientId/turnX (helps with nested folders/aliases)
            loaderPath = Object.keys(sessionFiles).find((p) =>
                p.endsWith(`/patients/${patientId}/dialogue/turn${turnNumber}.session`) ||
                p.includes(`/patients/${patientId}/dialogue/turn${turnNumber}.session`)
            );
        }

        if (loaderPath && sessionFiles[loaderPath]) {
            const content = await sessionFiles[loaderPath]();
            sessionCache.set(cacheKey, content);
            console.log(`[SDNS Loader] Loaded: ${loaderPath} (${content.length} chars)`);
            return content;
        }

        // If still missing, log available keys to aid debugging
        const available = Object.keys(sessionFiles);
        console.warn(`[SDNS Loader] File not found: ${filePath}. Available:`, available);
        const eh = await getErrorHandler();
        eh.sdns(`Session file not found: ${filePath}`, 'warn', { patientId, turnNumber, available });
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load turn ${turnNumber} for ${patientId}:`, err);
        const eh = await getErrorHandler();
        eh.sdns(`Failed to load session: ${err.message}`, 'error', {
            patientId,
            turnNumber,
            stack: err.stack
        });
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
        const configFiles = {
            ...import.meta.glob('/src/patients/**/dialogue/config.json'),
            ...import.meta.glob('../patients/**/dialogue/config.json'),
            ...import.meta.glob('./patients/**/dialogue/config.json'),
        };
        const configPath = `/src/patients/${patientId}/dialogue/config.json`;

        if (configFiles[configPath]) {
            const config = await configFiles[configPath]();
            console.log(`[SDNS Loader] Loaded config for ${patientId}`);
            return config.default || config;
        }

        console.warn(`[SDNS Loader] No config found for ${patientId}`);
        const eh = await getErrorHandler();
        eh.sdns(`Dialogue config not found for patient: ${patientId}`, 'warn', { patientId });
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load config for ${patientId}:`, err);
        const eh = await getErrorHandler();
        eh.sdns(`Failed to load dialogue config: ${err.message}`, 'error', {
            patientId,
            stack: err.stack
        });
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
        const patientFiles = {
            ...import.meta.glob('/src/patients/**/patient_config.json'),
            ...import.meta.glob('../patients/**/patient_config.json'),
            ...import.meta.glob('./patients/**/patient_config.json'),
        };
        const configPath = `/src/patients/${patientId}/patient_config.json`;

        if (patientFiles[configPath]) {
            const config = await patientFiles[configPath]();
            console.log(`[SDNS Loader] Loaded patient config for ${patientId}`);
            return config.default || config;
        }

        console.warn(`[SDNS Loader] No patient config found for ${patientId}`);
        const eh = await getErrorHandler();
        eh.patient(`Patient config not found: ${patientId}`, 'warn', { patientId });
        return null;
    } catch (err) {
        console.error(`[SDNS Loader] Failed to load patient config for ${patientId}:`, err);
        const eh = await getErrorHandler();
        eh.patient(`Failed to load patient config: ${err.message}`, 'error', {
            patientId,
            stack: err.stack
        });
        return null;
    }
}

/**
 * Get list of all available patients
 * @returns {Promise<array>} - Array of patient info objects
 */
export async function getPatientList() {
    try {
        const patientConfigs = {
            ...import.meta.glob('/src/patients/**/patient_config.json'),
            ...import.meta.glob('../patients/**/patient_config.json'),
            ...import.meta.glob('./patients/**/patient_config.json'),
        };
        const patients = [];

        for (const path in patientConfigs) {
            // Extract patient ID from various path formats:
            // /src/patients/gregory/patient_config.json -> gregory
            // ../patients/gregory/patient_config.json -> gregory
            const match = path.match(/patients\/([^/]+)\/patient_config\.json$/);
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
        const eh = await getErrorHandler();
        eh.patient(`Failed to load patient list: ${err.message}`, 'error', {
            stack: err.stack
        });
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
