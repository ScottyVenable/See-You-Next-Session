// Rapport System Utilities
// Handles patient responses based on rapport level

import { GAME_CONFIG } from './config.js';

// Rapport thresholds for patient behavior
export const RAPPORT_THRESHOLDS = {
    GUARDED: GAME_CONFIG.RAPPORT_GUARDED || 25,
    CAUTIOUS: GAME_CONFIG.RAPPORT_CAUTIOUS || 50,
    COMFORTABLE: GAME_CONFIG.RAPPORT_COMFORTABLE || 75,
    TRUSTING: GAME_CONFIG.RAPPORT_TRUSTING || 90,
};

// Get rapport level name from value
export const getRapportLevelName = (rapport) => {
    if (rapport >= RAPPORT_THRESHOLDS.TRUSTING) return 'trusting';
    if (rapport >= RAPPORT_THRESHOLDS.COMFORTABLE) return 'comfortable';
    if (rapport >= RAPPORT_THRESHOLDS.CAUTIOUS) return 'cautious';
    return 'guarded';
};

// Rapport change amounts
export const RAPPORT_CHANGES = {
    empathetic: GAME_CONFIG.RAPPORT_EMPATHETIC || 8,
    neutral: GAME_CONFIG.RAPPORT_NEUTRAL || 0,
    probing: GAME_CONFIG.RAPPORT_PROBING || -3,
    challenging: GAME_CONFIG.RAPPORT_CHALLENGING || -8,
    breakthrough: GAME_CONFIG.RAPPORT_BREAKTHROUGH || 15,
    clumsyBreakthrough: GAME_CONFIG.RAPPORT_CLUMSY_BREAKTHROUGH || -5,
};

// Get rapport effect description
export const getRapportEffectDescription = (rapportLevel) => {
    switch (rapportLevel) {
        case 'trusting':
            return {
                label: 'Full Trust',
                description: 'Patient shares everything openly',
                effects: ['Full disclosure', 'Breakthrough possible', 'Hidden info revealed'],
                color: '#3b82f6',
            };
        case 'comfortable':
            return {
                label: 'Comfortable',
                description: 'Patient feels safe sharing',
                effects: ['Shares personal details', 'More forthcoming', 'Relaxed body language'],
                color: '#22c55e',
            };
        case 'cautious':
            return {
                label: 'Cautious',
                description: 'Patient is holding back',
                effects: ['Surface-level answers', 'Some evasion', 'Neutral body language'],
                color: '#eab308',
            };
        case 'guarded':
            return {
                label: 'Guarded',
                description: 'Patient is defensive',
                effects: ['Minimal information', 'Deflects questions', 'Closed body language'],
                color: '#ef4444',
            };
        default:
            return {
                label: 'Unknown',
                description: '',
                effects: [],
                color: '#94a3b8',
            };
    }
};

// Response modifiers based on rapport
export const getResponseModifier = (rapportLevel, questionType) => {
    const modifiers = {
        trusting: {
            empathetic: { openness: 1.0, detail: 'full', mood: 'grateful' },
            neutral: { openness: 0.9, detail: 'detailed', mood: 'open' },
            probing: { openness: 0.8, detail: 'honest', mood: 'thoughtful' },
            challenging: { openness: 0.6, detail: 'moderate', mood: 'understanding' },
        },
        comfortable: {
            empathetic: { openness: 0.85, detail: 'detailed', mood: 'appreciative' },
            neutral: { openness: 0.7, detail: 'moderate', mood: 'neutral' },
            probing: { openness: 0.5, detail: 'guarded', mood: 'hesitant' },
            challenging: { openness: 0.3, detail: 'minimal', mood: 'defensive' },
        },
        cautious: {
            empathetic: { openness: 0.6, detail: 'moderate', mood: 'warming' },
            neutral: { openness: 0.5, detail: 'surface', mood: 'neutral' },
            probing: { openness: 0.3, detail: 'deflecting', mood: 'uncomfortable' },
            challenging: { openness: 0.1, detail: 'evasive', mood: 'defensive' },
        },
        guarded: {
            empathetic: { openness: 0.4, detail: 'guarded', mood: 'skeptical' },
            neutral: { openness: 0.3, detail: 'minimal', mood: 'closed' },
            probing: { openness: 0.1, detail: 'deflecting', mood: 'hostile' },
            challenging: { openness: 0.0, detail: 'refusing', mood: 'angry' },
        },
    };

    return modifiers[rapportLevel]?.[questionType] || modifiers.cautious.neutral;
};

// Calculate if patient will reveal hidden info
export const willRevealHiddenInfo = (rapport, infoSensitivity = 'medium') => {
    const thresholds = {
        low: RAPPORT_THRESHOLDS.CAUTIOUS,      // 50+ for low sensitivity
        medium: RAPPORT_THRESHOLDS.COMFORTABLE, // 75+ for medium
        high: RAPPORT_THRESHOLDS.TRUSTING,      // 90+ for high sensitivity
    };

    return rapport >= thresholds[infoSensitivity];
};

// Get patient body language based on rapport
export const getBodyLanguage = (rapport) => {
    if (rapport >= RAPPORT_THRESHOLDS.TRUSTING) {
        return {
            posture: 'open',
            eyeContact: 'consistent',
            gestures: 'relaxed',
            description: 'Open posture, maintaining eye contact, relaxed gestures',
        };
    }
    if (rapport >= RAPPORT_THRESHOLDS.COMFORTABLE) {
        return {
            posture: 'relaxed',
            eyeContact: 'normal',
            gestures: 'occasional',
            description: 'Relaxed posture, normal eye contact',
        };
    }
    if (rapport >= RAPPORT_THRESHOLDS.CAUTIOUS) {
        return {
            posture: 'neutral',
            eyeContact: 'intermittent',
            gestures: 'minimal',
            description: 'Neutral posture, looking away occasionally',
        };
    }
    return {
        posture: 'closed',
        eyeContact: 'avoiding',
        gestures: 'protective',
        description: 'Arms crossed, avoiding eye contact, leaning back',
    };
};

// Generate dialogue variations based on rapport
export const getDialogueVariation = (baseDialogue, rapportLevel) => {
    // If patient data includes rapport-specific variations, use them
    if (baseDialogue.variations && baseDialogue.variations[rapportLevel]) {
        return baseDialogue.variations[rapportLevel];
    }

    // Otherwise return base dialogue with mood modifier
    return {
        ...baseDialogue,
        rapportModifiedMood: getMoodFromRapport(baseDialogue.speakerMood, rapportLevel),
    };
};

// Modify mood based on rapport
const getMoodFromRapport = (baseMood, rapportLevel) => {
    const moodModifiers = {
        trusting: {
            nervous: 'calmer',
            defensive: 'open',
            anxious: 'composed',
            dismissive: 'thoughtful',
        },
        comfortable: {
            nervous: 'slightly-nervous',
            defensive: 'neutral',
            anxious: 'uneasy',
            dismissive: 'neutral',
        },
        cautious: {
            nervous: 'nervous',
            defensive: 'guarded',
            anxious: 'anxious',
            dismissive: 'dismissive',
        },
        guarded: {
            nervous: 'very-nervous',
            defensive: 'hostile',
            anxious: 'panicked',
            dismissive: 'cold',
        },
    };

    return moodModifiers[rapportLevel]?.[baseMood] || baseMood;
};

export default {
    RAPPORT_THRESHOLDS,
    RAPPORT_CHANGES,
    getRapportLevelName,
    getRapportEffectDescription,
    getResponseModifier,
    willRevealHiddenInfo,
    getBodyLanguage,
    getDialogueVariation,
};
