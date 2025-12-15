// Game Configuration Constants
export const GAME_CONFIG = {
    // Focus System
    MAX_FOCUS: 100,
    FOCUS_COST_LOOK: 15,
    FOCUS_COST_INCORRECT_MATCH: 10,
    FOCUS_RESTORE_BREAKTHROUGH: 40,

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

