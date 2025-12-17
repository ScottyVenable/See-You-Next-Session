// Patient Loader - Loads and manages patient data from config files
// Handles dynamic loading of patient configs, dialogue files, and topics

const isDev = import.meta.env?.DEV ?? false;

/**
 * PatientLoader handles loading patient configurations and dialogue data.
 * Uses Vite's import.meta.glob for efficient lazy loading.
 */
class PatientLoader {
    constructor() {
        this.loadedPatients = new Map();
        this.loadedDialogueConfigs = new Map();
        this.patientList = null;
    }

    /**
     * Clear all caches - useful for development/HMR
     */
    clearCache() {
        this.loadedPatients.clear();
        this.loadedDialogueConfigs.clear();
        this.patientList = null;
        console.log('[PatientLoader] Cache cleared');
    }

    /**
     * Get all available patient configs using Vite's glob import
     */
    async getPatientList() {
        // In dev mode, always refresh to catch changes
        if (isDev) {
            this.patientList = null;
        }

        if (this.patientList) {
            return this.patientList;
        }

        try {
            // Use Vite's glob import to find all patient configs
            const patientConfigs = import.meta.glob('/src/patients/*/patient_config.json');

            const patients = [];

            for (const path in patientConfigs) {
                // Extract patient ID from path: /src/patients/gregory/patient_config.json -> gregory
                const match = path.match(/\/src\/patients\/([^/]+)\/patient_config\.json/);
                if (match) {
                    const patientId = match[1];
                    const config = await patientConfigs[path]();

                    patients.push({
                        id: patientId,
                        name: config.default?.profile?.name || config.profile?.name || patientId,
                        avatar: config.default?.profile?.avatar || config.profile?.avatar,
                        occupation: config.default?.profile?.occupation || config.profile?.occupation,
                        primaryDiagnosis: config.default?.clinical?.primaryDiagnosis || config.clinical?.primaryDiagnosis,
                        unlockRequirements: config.default?.unlockRequirements || config.unlockRequirements,
                        phase: config.default?.clinical?.phase || config.clinical?.phase,
                    });

                    // Cache the full config
                    this.loadedPatients.set(patientId, config.default || config);
                }
            }

            this.patientList = patients;
            return patients;
        } catch (err) {
            console.error('Failed to load patient list:', err);
            return [];
        }
    }

    /**
     * Load a specific patient's full configuration
     */
    async loadPatient(patientId) {
        // Check cache first
        if (this.loadedPatients.has(patientId)) {
            return this.loadedPatients.get(patientId);
        }

        try {
            const config = await import(`/src/patients/${patientId}/patient_config.json`);
            const patientConfig = config.default || config;

            this.loadedPatients.set(patientId, patientConfig);
            return patientConfig;
        } catch (err) {
            console.error(`Failed to load patient ${patientId}:`, err);
            return null;
        }
    }

    /**
     * Load a patient's dialogue configuration
     */
    async loadDialogueConfig(patientId) {
        // Check cache first (skip in dev mode for HMR)
        if (!isDev && this.loadedDialogueConfigs.has(patientId)) {
            return this.loadedDialogueConfigs.get(patientId);
        }

        try {
            const config = await import(`/src/patients/${patientId}/dialogue/config.json`);
            const dialogueConfig = config.default || config;

            this.loadedDialogueConfigs.set(patientId, dialogueConfig);
            return dialogueConfig;
        } catch (err) {
            console.warn(`No dialogue config found for ${patientId}, using defaults`);
            return null;
        }
    }

    /**
     * Load a specific turn's dialogue file
     * Loads from canonical location: /src/patients/{patientId}/dialogue/
     * In dev mode, always fetches fresh content for HMR support
     */
    async loadTurnDialogue(patientId, turnNumber) {
        try {
            // Canonical location: /src/patients/{patientId}/dialogue/
            const sessionFiles = import.meta.glob('/src/patients/*/dialogue/*.session', {
                query: '?raw',
                import: 'default',
            });
            const filePath = `/src/patients/${patientId}/dialogue/turn${turnNumber}.session`;

            if (sessionFiles[filePath]) {
                const content = await sessionFiles[filePath]();
                console.log(`[PatientLoader] Loaded ${patientId}/dialogue/turn${turnNumber}.session (${content.length} chars)`);
                return content;
            }

            console.warn(`Turn ${turnNumber} dialogue not found for ${patientId} at: ${filePath}`);
            return null;
        } catch (err) {
            console.error(`Failed to load turn ${turnNumber} for ${patientId}:`, err);
            return null;
        }
    }

    /**
     * Get available topics for a patient based on current rapport
     */
    async getAvailableTopics(patientId, currentRapport = 0, sessionState = {}) {
        const dialogueConfig = await this.loadDialogueConfig(patientId);
        if (!dialogueConfig) return [];

        const availableTopics = [];

        for (const [topicId, topic] of Object.entries(dialogueConfig.topics || {})) {
            // Check if topic is unlocked
            const unlockCondition = topic.unlockCondition;
            let isUnlocked = true;

            if (unlockCondition) {
                if (unlockCondition.rapport && currentRapport < unlockCondition.rapport) {
                    isUnlocked = false;
                }
                if (unlockCondition.reveal && !sessionState.reveals?.includes(unlockCondition.reveal)) {
                    isUnlocked = false;
                }
                if (unlockCondition.flag && !sessionState.flags?.[unlockCondition.flag]) {
                    isUnlocked = false;
                }
            }

            if (!isUnlocked) continue;

            // Process subtopics
            const availableSubtopics = [];

            for (const [subtopicId, subtopic] of Object.entries(topic.subtopics || {})) {
                const subtopicState = sessionState.topics?.[`${topicId}.${subtopicId}`] || { timesAsked: 0 };

                // Check rapport requirement
                if (subtopic.rapportRequired && currentRapport < subtopic.rapportRequired) {
                    continue;
                }

                // Check max asks
                if (subtopic.maxAsks && subtopicState.timesAsked >= subtopic.maxAsks) {
                    continue;
                }

                // Check cooldown (simplified - would need turn tracking for full implementation)

                availableSubtopics.push({
                    id: subtopicId,
                    key: `${topicId}.${subtopicId}`,
                    label: subtopic.label,
                    shortLabel: subtopic.shortLabel,
                    timesAsked: subtopicState.timesAsked,
                    maxAsks: subtopic.maxAsks || 999,
                    tags: subtopic.tags || [],
                });
            }

            if (availableSubtopics.length > 0) {
                availableTopics.push({
                    id: topicId,
                    label: topic.label,
                    icon: topic.icon,
                    description: topic.description,
                    subtopics: availableSubtopics,
                    subtopicCount: availableSubtopics.length,
                });
            }
        }

        return availableTopics;
    }

    /**
     * Get special response options (reflect, validate, etc.)
     */
    async getSpecialResponses(patientId) {
        const dialogueConfig = await this.loadDialogueConfig(patientId);
        if (!dialogueConfig) return [];

        return Object.entries(dialogueConfig.specialResponses || {}).map(([id, response]) => ({
            id,
            ...response,
        }));
    }

    /**
     * Get response modifiers (push gently, back off, etc.)
     */
    async getResponseModifiers(patientId) {
        const dialogueConfig = await this.loadDialogueConfig(patientId);
        if (!dialogueConfig) return [];

        return Object.entries(dialogueConfig.responseModifiers || {}).map(([id, modifier]) => ({
            id,
            ...modifier,
        }));
    }

    /**
     * Check if a patient meets unlock requirements
     */
    async isPatientUnlocked(patientId, gameProgress) {
        const patientConfig = await this.loadPatient(patientId);
        if (!patientConfig) return false;

        const requirements = patientConfig.unlockRequirements;
        if (!requirements || requirements.type === 'none') {
            return true;
        }

        switch (requirements.type) {
            case 'complete_patient':
                return gameProgress.completedPatients?.includes(requirements.patientId);

            case 'knowledge_points':
                return (gameProgress.knowledgePoints || 0) >= requirements.amount;

            case 'rank':
                const score = gameProgress.patientScores?.[requirements.patientId];
                return score && this.rankMeetsRequirement(score.rank, requirements.minRank);

            default:
                return true;
        }
    }

    rankMeetsRequirement(playerRank, requiredRank) {
        const rankOrder = ['S', 'A', 'B', 'C', 'D', 'F'];
        return rankOrder.indexOf(playerRank) <= rankOrder.indexOf(requiredRank);
    }

    /**
     * Get patient's observable symptoms based on current state
     */
    async getObservableSymptoms(patientId, currentRapport = 0, currentTurn = 1) {
        const patientConfig = await this.loadPatient(patientId);
        if (!patientConfig) return [];

        const symptoms = [];

        for (const symptom of patientConfig.appearance?.observableSymptoms || []) {
            const condition = symptom.revealCondition || {};
            let isVisible = true;

            if (condition.rapport !== undefined && currentRapport < condition.rapport) {
                isVisible = false;
            }
            if (condition.turn !== undefined && currentTurn < condition.turn) {
                isVisible = false;
            }

            if (isVisible) {
                symptoms.push({
                    id: symptom.id,
                    label: symptom.label,
                    category: symptom.category,
                    contradictsClaimOf: symptom.contradictsClaimOf,
                });
            }
        }

        return symptoms;
    }

    /**
     * Check if a breakthrough has been achieved
     */
    async checkBreakthroughs(patientId, reveals) {
        const patientConfig = await this.loadPatient(patientId);
        if (!patientConfig) return [];

        const achieved = [];

        for (const breakthrough of patientConfig.breakthroughs || []) {
            const hasAllReveals = breakthrough.requiredReveals.every(r => reveals.includes(r));

            if (hasAllReveals) {
                achieved.push(breakthrough);
            }
        }

        return achieved;
    }

    /**
     * Calculate session score
     */
    async calculateScore(patientId, sessionData) {
        const patientConfig = await this.loadPatient(patientId);
        if (!patientConfig) return { score: 0, rank: 'F' };

        const scoring = patientConfig.scoring || {};
        let score = 0;

        // Base score from discoveries
        score += sessionData.discoveries?.symptoms?.length * 50 || 0;
        score += sessionData.discoveries?.reveals?.length * 25 || 0;
        score += sessionData.discoveries?.contradictions?.length * 75 || 0;
        score += sessionData.discoveries?.keywords?.length * 10 || 0;

        // Rapport bonus
        score += Math.floor(sessionData.patient?.rapport * 2) || 0;

        // Breakthrough bonus
        score += sessionData.discoveries?.breakthroughs?.length * 100 || 0;

        // Apply bonuses from config
        if (scoring.bonuses) {
            // Check if all symptoms found
            const totalSymptoms = patientConfig.symptoms?.core?.length + patientConfig.symptoms?.hidden?.length || 0;
            if (sessionData.discoveries?.symptoms?.length >= totalSymptoms) {
                score += scoring.bonuses.allSymptomsFound || 0;
            }

            // Check all breakthroughs
            const totalBreakthroughs = patientConfig.breakthroughs?.length || 0;
            if (sessionData.discoveries?.breakthroughs?.length >= totalBreakthroughs) {
                score += scoring.bonuses.allBreakthroughs || 0;
            }

            // No rapport loss bonus
            if (sessionData.metrics?.rapportLost === 0) {
                score += scoring.bonuses.noRapportLoss || 0;
            }
        }

        // Determine rank
        const thresholds = scoring.rankThresholds || { S: 900, A: 750, B: 600, C: 450, D: 300 };
        let rank = 'F';

        if (score >= thresholds.S) rank = 'S';
        else if (score >= thresholds.A) rank = 'A';
        else if (score >= thresholds.B) rank = 'B';
        else if (score >= thresholds.C) rank = 'C';
        else if (score >= thresholds.D) rank = 'D';

        return { score, rank, maxScore: scoring.maxScore || 1000 };
    }
}

// Export singleton instance
export const patientLoader = new PatientLoader();
export default patientLoader;

// Hot Module Replacement support
if (import.meta.hot) {
    import.meta.hot.accept();
    // Clear cache on any file change for fresh content
    import.meta.hot.on('vite:beforeUpdate', () => {
        patientLoader.clearCache();
        console.log('[PatientLoader] HMR: Cache cleared');
    });
}
