// Save Manager - Handles game progress persistence
// Uses localStorage for web builds

const SAVE_KEY = 'syns_save_data';
const SAVE_VERSION = 1;

class SaveManager {
    constructor() {
        this.data = this.loadOrCreate();
    }

    // Default save structure
    getDefaultSave() {
        return {
            version: SAVE_VERSION,
            createdAt: Date.now(),
            lastPlayedAt: Date.now(),

            // Progress
            completedPatients: [],
            patientScores: {}, // { patientId: { rank, score, date } }

            // Currency
            knowledgePoints: 0,

            // Unlocks
            upgrades: [],
            officeDecor: [],

            // Settings
            settings: {
                musicVolume: 0.5,
                sfxVolume: 0.7,
                textSpeed: 'normal', // 'slow', 'normal', 'fast', 'instant'
                triggerWarnings: true,
                disabledContent: [], // Content tags to hide
            },

            // Statistics
            stats: {
                totalSessions: 0,
                correctDiagnoses: 0,
                breakthroughsFound: 0,
                totalPlayTime: 0, // in seconds
            },
        };
    }

    // Load save data or create new
    loadOrCreate() {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const data = JSON.parse(saved);

                // Version migration if needed
                if (data.version < SAVE_VERSION) {
                    return this.migrate(data);
                }

                return data;
            }
        } catch (err) {
            console.warn('Failed to load save data:', err);
        }

        return this.getDefaultSave();
    }

    // Save current data
    save() {
        try {
            this.data.lastPlayedAt = Date.now();
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
            return true;
        } catch (err) {
            console.error('Failed to save data:', err);
            return false;
        }
    }

    // Migrate old save versions
    migrate(oldData) {
        // Add migration logic here as save format changes
        const newData = {
            ...this.getDefaultSave(),
            ...oldData,
            version: SAVE_VERSION,
        };
        return newData;
    }

    // Progress methods
    completePatient(patientId, rank, score) {
        if (!this.data.completedPatients.includes(patientId)) {
            this.data.completedPatients.push(patientId);
        }

        // Store best score
        const existing = this.data.patientScores[patientId];
        if (!existing || score > existing.score) {
            this.data.patientScores[patientId] = {
                rank,
                score,
                date: Date.now(),
            };
        }

        this.data.stats.totalSessions++;
        if (rank !== 'F') {
            this.data.stats.correctDiagnoses++;
        }

        this.save();
    }

    // Knowledge points
    addKnowledgePoints(amount) {
        this.data.knowledgePoints += amount;
        this.save();
    }

    spendKnowledgePoints(amount) {
        if (this.data.knowledgePoints >= amount) {
            this.data.knowledgePoints -= amount;
            this.save();
            return true;
        }
        return false;
    }

    // Upgrades
    unlockUpgrade(upgradeId) {
        if (!this.data.upgrades.includes(upgradeId)) {
            this.data.upgrades.push(upgradeId);
            this.save();
        }
    }

    hasUpgrade(upgradeId) {
        return this.data.upgrades.includes(upgradeId);
    }

    // Settings
    updateSetting(key, value) {
        this.data.settings[key] = value;
        this.save();
    }

    getSetting(key) {
        return this.data.settings[key];
    }

    // Statistics
    recordBreakthrough() {
        this.data.stats.breakthroughsFound++;
        this.save();
    }

    addPlayTime(seconds) {
        this.data.stats.totalPlayTime += seconds;
        this.save();
    }

    // Reset save (with confirmation)
    resetSave() {
        this.data = this.getDefaultSave();
        this.save();
    }

    // Export/Import for backup
    exportSave() {
        return JSON.stringify(this.data);
    }

    importSave(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (imported.version) {
                this.data = imported;
                this.save();
                return true;
            }
        } catch (err) {
            console.error('Failed to import save:', err);
        }
        return false;
    }
}

// Export singleton instance
export const saveManager = new SaveManager();
export default saveManager;
