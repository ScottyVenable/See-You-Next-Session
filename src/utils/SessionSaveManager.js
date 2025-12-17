// Session Save Manager - Handles in-progress session state
// Works alongside SaveManager for persistent progress

const SESSION_SAVE_KEY = 'syns_session_data';
const SESSION_VERSION = 1;

/**
 * SessionSaveManager handles the state of an active therapy session.
 * This includes all dialogue progress, reveals, rapport changes, etc.
 * Separate from the global SaveManager which tracks overall game progress.
 */
class SessionSaveManager {
    constructor() {
        this.session = null;
        this.autoSaveInterval = null;
        this.isDirty = false;
    }

    /**
     * Create a new session for a patient
     */
    createSession(patientId, turnNumber = 1) {
        this.session = {
            version: SESSION_VERSION,
            sessionId: this.generateSessionId(),
            patientId,
            turnNumber,
            createdAt: Date.now(),
            lastSavedAt: Date.now(),

            // Dialogue state
            dialogue: {
                currentBlock: 'START',
                currentLine: 0,
                visitedBlocks: ['START'],
                completedBlocks: [],
                responseHistory: [], // { topic, subtopic, timestamp, rapportChange }
            },

            // Patient state
            patient: {
                rapport: 25, // Starting rapport
                mood: 'nervous',
                guardedness: 70,
                openness: 30,
                trustLevel: 0,
            },

            // Discovery tracking
            discoveries: {
                reveals: [], // IDs of revealed information
                symptoms: [], // Discovered symptoms
                contradictions: [], // Noted contradictions
                keywords: [], // Collected keywords from dialogue
                breakthroughs: [], // Achieved breakthroughs
            },

            // Topic interaction tracking
            topics: {}, // { 'family.parents': { timesAsked: 1, lastAsked: timestamp, responses: [] } }

            // Session metrics
            metrics: {
                totalInteractions: 0,
                rapportGained: 0,
                rapportLost: 0,
                timeSpent: 0, // seconds
                turnsUsed: 0,
            },

            // Unlocked content
            unlocks: [], // Content IDs unlocked during session

            // Game state variables set by @set commands
            variables: {},

            // Flags for conditional logic
            flags: {},
        };

        this.startAutoSave();
        this.save();

        return this.session;
    }

    /**
     * Load an existing session
     */
    loadSession(sessionId = null) {
        try {
            const savedSessions = this.getAllSessions();

            if (sessionId) {
                // Load specific session
                const session = savedSessions.find(s => s.sessionId === sessionId);
                if (session) {
                    this.session = session;
                    this.startAutoSave();
                    return this.session;
                }
            } else {
                // Load most recent session
                if (savedSessions.length > 0) {
                    this.session = savedSessions[savedSessions.length - 1];
                    this.startAutoSave();
                    return this.session;
                }
            }
        } catch (err) {
            console.error('Failed to load session:', err);
        }

        return null;
    }

    /**
     * Load session for a specific patient (most recent)
     */
    loadPatientSession(patientId) {
        try {
            const savedSessions = this.getAllSessions();
            const patientSessions = savedSessions.filter(s => s.patientId === patientId);

            if (patientSessions.length > 0) {
                // Get most recent
                this.session = patientSessions[patientSessions.length - 1];
                this.startAutoSave();
                return this.session;
            }
        } catch (err) {
            console.error('Failed to load patient session:', err);
        }

        return null;
    }

    /**
     * Get all saved sessions
     */
    getAllSessions() {
        try {
            const saved = localStorage.getItem(SESSION_SAVE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (err) {
            console.error('Failed to get sessions:', err);
        }
        return [];
    }

    /**
     * Save current session
     */
    save() {
        if (!this.session) return false;

        try {
            this.session.lastSavedAt = Date.now();

            const sessions = this.getAllSessions();
            const existingIndex = sessions.findIndex(s => s.sessionId === this.session.sessionId);

            if (existingIndex >= 0) {
                sessions[existingIndex] = this.session;
            } else {
                sessions.push(this.session);
            }

            // Keep only last 10 sessions per patient
            const byPatient = {};
            sessions.forEach(s => {
                if (!byPatient[s.patientId]) byPatient[s.patientId] = [];
                byPatient[s.patientId].push(s);
            });

            const trimmed = [];
            Object.values(byPatient).forEach(patientSessions => {
                // Sort by lastSavedAt and keep last 10
                patientSessions.sort((a, b) => a.lastSavedAt - b.lastSavedAt);
                trimmed.push(...patientSessions.slice(-10));
            });

            localStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(trimmed));
            this.isDirty = false;
            return true;
        } catch (err) {
            console.error('Failed to save session:', err);
            return false;
        }
    }

    /**
     * Auto-save every 30 seconds if dirty
     */
    startAutoSave() {
        this.stopAutoSave();
        this.autoSaveInterval = setInterval(() => {
            if (this.isDirty) {
                this.save();
            }
        }, 30000);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    /**
     * Mark session as needing save
     */
    markDirty() {
        this.isDirty = true;
    }

    // ==========================================
    // Dialogue State Methods
    // ==========================================

    setCurrentBlock(blockName, lineNumber = 0) {
        if (!this.session) return;

        this.session.dialogue.currentBlock = blockName;
        this.session.dialogue.currentLine = lineNumber;

        if (!this.session.dialogue.visitedBlocks.includes(blockName)) {
            this.session.dialogue.visitedBlocks.push(blockName);
        }

        this.markDirty();
    }

    markBlockCompleted(blockName) {
        if (!this.session) return;

        if (!this.session.dialogue.completedBlocks.includes(blockName)) {
            this.session.dialogue.completedBlocks.push(blockName);
        }

        this.markDirty();
    }

    hasVisitedBlock(blockName) {
        return this.session?.dialogue.visitedBlocks.includes(blockName) || false;
    }

    hasCompletedBlock(blockName) {
        return this.session?.dialogue.completedBlocks.includes(blockName) || false;
    }

    // ==========================================
    // Response & Topic Tracking
    // ==========================================

    recordResponse(topic, subtopic, rapportChange = 0) {
        if (!this.session) return;

        const key = `${topic}.${subtopic}`;
        const record = {
            topic,
            subtopic,
            timestamp: Date.now(),
            rapportChange,
        };

        this.session.dialogue.responseHistory.push(record);

        // Update topic tracking
        if (!this.session.topics[key]) {
            this.session.topics[key] = {
                timesAsked: 0,
                lastAsked: null,
                responses: [],
            };
        }

        this.session.topics[key].timesAsked++;
        this.session.topics[key].lastAsked = Date.now();
        this.session.topics[key].responses.push(record);

        // Update metrics
        this.session.metrics.totalInteractions++;
        if (rapportChange > 0) {
            this.session.metrics.rapportGained += rapportChange;
        } else if (rapportChange < 0) {
            this.session.metrics.rapportLost += Math.abs(rapportChange);
        }

        this.markDirty();
    }

    getTopicState(topic, subtopic) {
        const key = `${topic}.${subtopic}`;
        return this.session?.topics[key] || { timesAsked: 0, lastAsked: null, responses: [] };
    }

    canAskTopic(topic, subtopic, maxAsks = 3, cooldownTurns = 0) {
        const state = this.getTopicState(topic, subtopic);

        if (state.timesAsked >= maxAsks) {
            return { allowed: false, reason: 'max_asks_reached' };
        }

        // TODO: Implement cooldown based on turn count

        return { allowed: true };
    }

    // ==========================================
    // Patient State Methods
    // ==========================================

    getRapport() {
        return this.session?.patient.rapport || 0;
    }

    modifyRapport(amount, reason = '') {
        if (!this.session) return;

        const oldRapport = this.session.patient.rapport;
        this.session.patient.rapport = Math.max(0, Math.min(100, oldRapport + amount));

        // Adjust openness based on rapport thresholds
        if (this.session.patient.rapport >= 75 && oldRapport < 75) {
            this.session.patient.openness = Math.min(100, this.session.patient.openness + 15);
            this.session.patient.guardedness = Math.max(0, this.session.patient.guardedness - 15);
        } else if (this.session.patient.rapport >= 50 && oldRapport < 50) {
            this.session.patient.openness = Math.min(100, this.session.patient.openness + 10);
            this.session.patient.guardedness = Math.max(0, this.session.patient.guardedness - 10);
        }

        if (amount > 0) {
            this.session.metrics.rapportGained += amount;
        } else {
            this.session.metrics.rapportLost += Math.abs(amount);
        }

        this.markDirty();

        return this.session.patient.rapport;
    }

    setMood(mood) {
        if (!this.session) return;
        this.session.patient.mood = mood;
        this.markDirty();
    }

    getMood() {
        return this.session?.patient.mood || 'neutral';
    }

    // ==========================================
    // Discovery Methods
    // ==========================================

    addReveal(revealId) {
        if (!this.session) return false;

        if (!this.session.discoveries.reveals.includes(revealId)) {
            this.session.discoveries.reveals.push(revealId);
            this.markDirty();
            return true;
        }
        return false;
    }

    hasReveal(revealId) {
        return this.session?.discoveries.reveals.includes(revealId) || false;
    }

    addSymptom(symptomId) {
        if (!this.session) return false;

        if (!this.session.discoveries.symptoms.includes(symptomId)) {
            this.session.discoveries.symptoms.push(symptomId);
            this.markDirty();
            return true;
        }
        return false;
    }

    addContradiction(contradictionId, evidence) {
        if (!this.session) return;

        const existing = this.session.discoveries.contradictions.find(c => c.id === contradictionId);
        if (!existing) {
            this.session.discoveries.contradictions.push({
                id: contradictionId,
                evidence,
                discoveredAt: Date.now(),
            });
            this.markDirty();
        }
    }

    addKeyword(keyword, context = '') {
        if (!this.session) return;

        const existing = this.session.discoveries.keywords.find(k => k.word === keyword);
        if (!existing) {
            this.session.discoveries.keywords.push({
                word: keyword,
                context,
                collectedAt: Date.now(),
            });
            this.markDirty();
        }
    }

    addBreakthrough(breakthroughId) {
        if (!this.session) return false;

        if (!this.session.discoveries.breakthroughs.includes(breakthroughId)) {
            this.session.discoveries.breakthroughs.push(breakthroughId);
            this.markDirty();
            return true;
        }
        return false;
    }

    // ==========================================
    // Variable & Flag Methods
    // ==========================================

    setVariable(name, value) {
        if (!this.session) return;
        this.session.variables[name] = value;
        this.markDirty();
    }

    getVariable(name, defaultValue = null) {
        return this.session?.variables[name] ?? defaultValue;
    }

    setFlag(name, value = true) {
        if (!this.session) return;
        this.session.flags[name] = value;
        this.markDirty();
    }

    hasFlag(name) {
        return this.session?.flags[name] === true;
    }

    // ==========================================
    // Unlock Methods
    // ==========================================

    addUnlock(unlockId) {
        if (!this.session) return;

        if (!this.session.unlocks.includes(unlockId)) {
            this.session.unlocks.push(unlockId);
            this.markDirty();
        }
    }

    hasUnlock(unlockId) {
        return this.session?.unlocks.includes(unlockId) || false;
    }

    // ==========================================
    // Metrics Methods
    // ==========================================

    addTimeSpent(seconds) {
        if (!this.session) return;
        this.session.metrics.timeSpent += seconds;
        this.markDirty();
    }

    incrementTurn() {
        if (!this.session) return;
        this.session.metrics.turnsUsed++;
        this.markDirty();
    }

    getMetrics() {
        return this.session?.metrics || {};
    }

    // ==========================================
    // Session Completion
    // ==========================================

    /**
     * End session and calculate final score
     */
    completeSession() {
        if (!this.session) return null;

        this.stopAutoSave();

        const summary = {
            sessionId: this.session.sessionId,
            patientId: this.session.patientId,
            turnNumber: this.session.turnNumber,
            completedAt: Date.now(),
            duration: this.session.metrics.timeSpent,

            finalRapport: this.session.patient.rapport,

            discoveries: {
                reveals: this.session.discoveries.reveals.length,
                symptoms: this.session.discoveries.symptoms.length,
                contradictions: this.session.discoveries.contradictions.length,
                keywords: this.session.discoveries.keywords.length,
                breakthroughs: this.session.discoveries.breakthroughs.length,
            },

            interactions: this.session.metrics.totalInteractions,
            rapportGained: this.session.metrics.rapportGained,
            rapportLost: this.session.metrics.rapportLost,
        };

        this.save();

        return summary;
    }

    /**
     * Delete a session
     */
    deleteSession(sessionId) {
        try {
            const sessions = this.getAllSessions();
            const filtered = sessions.filter(s => s.sessionId !== sessionId);
            localStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(filtered));

            if (this.session?.sessionId === sessionId) {
                this.session = null;
                this.stopAutoSave();
            }

            return true;
        } catch (err) {
            console.error('Failed to delete session:', err);
            return false;
        }
    }

    /**
     * Delete all sessions for a patient
     */
    deletePatientSessions(patientId) {
        try {
            const sessions = this.getAllSessions();
            const filtered = sessions.filter(s => s.patientId !== patientId);
            localStorage.setItem(SESSION_SAVE_KEY, JSON.stringify(filtered));

            if (this.session?.patientId === patientId) {
                this.session = null;
                this.stopAutoSave();
            }

            return true;
        } catch (err) {
            console.error('Failed to delete patient sessions:', err);
            return false;
        }
    }

    // ==========================================
    // Utility Methods
    // ==========================================

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getCurrentSession() {
        return this.session;
    }

    hasActiveSession() {
        return this.session !== null;
    }

    /**
     * Export session for debugging
     */
    exportSession() {
        return JSON.stringify(this.session, null, 2);
    }
}

// Export singleton instance
export const sessionSaveManager = new SessionSaveManager();
export default sessionSaveManager;
