// Game Configuration Constants
export const GAME_CONFIG = {
    // Version (auto-generated from git branch + commit)
    VERSION: typeof __GAME_VERSION__ !== 'undefined' ? __GAME_VERSION__ : 'unknown-build',

    // Focus System
    MAX_FOCUS: 100,
    FOCUS_COST_LOOK: 15,
    FOCUS_COST_INCORRECT_MATCH: 10,
    FOCUS_RESTORE_BREAKTHROUGH: 40,

    // Rapport System
    STARTING_RAPPORT: 50,
    MAX_RAPPORT: 100,
    MIN_RAPPORT: 0,

    // Rapport Changes
    RAPPORT_EMPATHETIC: 8,      // Empathetic response
    RAPPORT_NEUTRAL: 0,         // Neutral response
    RAPPORT_PROBING: -3,        // Probing question (slight negative)
    RAPPORT_CHALLENGING: -8,    // Challenging/confrontational
    RAPPORT_BREAKTHROUGH: 15,   // Finding a contradiction gently
    RAPPORT_CLUMSY_BREAKTHROUGH: -5, // Finding contradiction aggressively

    // Rapport Thresholds (affect patient behavior)
    RAPPORT_GUARDED: 25,        // Below this, patient is defensive
    RAPPORT_CAUTIOUS: 50,       // Below this, patient holds back
    RAPPORT_COMFORTABLE: 75,    // Above this, patient opens up
    RAPPORT_TRUSTING: 90,       // Above this, full disclosure possible

    // Turns
    MAX_TURNS: 4,
    TURN_DURATION_MINUTES: 15,

    // Scoring
    SCORE_CORRECT_DIAGNOSIS: 100,
    SCORE_BREAKTHROUGH: 25, // per breakthrough achieved (either from a client, or from analysing a client)
    SCORE_SYMPTOM_FOUND: 10,
    SCORE_PENALTY_WRONG_DIAGNOSIS: -50,

    // Knowledge Points
    KP_PER_CORRECT_DIAGNOSIS: 50,
    KP_PER_BREAKTHROUGH: 10,
    KP_PER_RANK_S: 100,
    KP_PER_RANK_A: 50,
    KP_PER_RANK_B: 25,
    KP_PER_RANK_C: 10,
};

// Rank Thresholds (percentage of max score)
export const RANK_THRESHOLDS = {
    S: 95, // 95%+ = S Rank
    A: 80, // 80-94% = A Rank
    B: 60, // 60-79% = B Rank
    C: 40, // 40-59% = C Rank
    F: 0,  // Below 40% = F Rank
};

// Difficulty Modifiers
export const DIFFICULTY_MODIFIERS = {
    easy: {
        focusCostMultiplier: 0.8,
        hintFrequency: 'high',
        timeLimit: false,
    },
    medium: {
        focusCostMultiplier: 1.0,
        hintFrequency: 'medium',
        timeLimit: false,
    },
    hard: {
        focusCostMultiplier: 1.2,
        hintFrequency: 'low',
        timeLimit: true,
    },
};

