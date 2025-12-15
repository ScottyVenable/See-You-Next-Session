import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GAME_CONFIG } from '../data/config.js';

// Initial State
const initialState = {
    currentScreen: 'menu', // 'menu', 'patient-select', 'game', 'report'

    // Session State
    currentPatient: null,
    currentTurn: 1,
    maxTurns: 4,

    // Focus System
    focus: GAME_CONFIG.MAX_FOCUS,
    maxFocus: GAME_CONFIG.MAX_FOCUS,
    isFocusMode: false,

    // Token System
    collectedTokens: [], // { id, type: 'text'|'visual', content, symptomRef, source }
    clipboardTokens: [],

    // Dialogue State
    currentDialogueIndex: 0,
    revealedSymptoms: [], // IDs of symptoms the player has discovered

    // Breakthroughs & Progress
    breakthroughs: [],
    unlockedDialogue: [],

    // End of Session
    sessionNotes: {
        observedSymptoms: [],
        patientStatements: [],
        finalDiagnosis: null,
    },

    // Game Progress
    completedPatients: [],
    knowledgePoints: 0,
    upgrades: [],
};

// Action Types
const ACTIONS = {
    SET_SCREEN: 'SET_SCREEN',
    START_SESSION: 'START_SESSION',
    END_SESSION: 'END_SESSION',
    ADVANCE_TURN: 'ADVANCE_TURN',

    // Focus
    TOGGLE_FOCUS_MODE: 'TOGGLE_FOCUS_MODE',
    SPEND_FOCUS: 'SPEND_FOCUS',
    RESTORE_FOCUS: 'RESTORE_FOCUS',

    // Tokens
    COLLECT_TOKEN: 'COLLECT_TOKEN',
    ADD_TO_CLIPBOARD: 'ADD_TO_CLIPBOARD',
    REMOVE_FROM_CLIPBOARD: 'REMOVE_FROM_CLIPBOARD',

    // Dialogue
    ADVANCE_DIALOGUE: 'ADVANCE_DIALOGUE',
    UNLOCK_DIALOGUE: 'UNLOCK_DIALOGUE',

    // Symptoms
    REVEAL_SYMPTOM: 'REVEAL_SYMPTOM',

    // Synthesis
    RECORD_BREAKTHROUGH: 'RECORD_BREAKTHROUGH',

    // Session Notes
    UPDATE_SESSION_NOTES: 'UPDATE_SESSION_NOTES',
    SET_DIAGNOSIS: 'SET_DIAGNOSIS',

    // Progress
    ADD_KNOWLEDGE_POINTS: 'ADD_KNOWLEDGE_POINTS',
    UNLOCK_UPGRADE: 'UNLOCK_UPGRADE',
};

// Reducer
function gameReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_SCREEN:
            return { ...state, currentScreen: action.payload };

        case ACTIONS.START_SESSION:
            return {
                ...state,
                currentScreen: 'game',
                currentPatient: action.payload,
                currentTurn: 1,
                focus: state.maxFocus,
                isFocusMode: false,
                collectedTokens: [],
                clipboardTokens: [],
                currentDialogueIndex: 0,
                revealedSymptoms: [],
                breakthroughs: [],
                unlockedDialogue: [],
                sessionNotes: {
                    observedSymptoms: [],
                    patientStatements: [],
                    finalDiagnosis: null,
                },
            };

        case ACTIONS.END_SESSION:
            return {
                ...state,
                currentScreen: 'report',
            };

        case ACTIONS.ADVANCE_TURN:
            const nextTurn = state.currentTurn + 1;
            if (nextTurn > state.maxTurns) {
                return { ...state, currentScreen: 'report' };
            }
            return { ...state, currentTurn: nextTurn };

        case ACTIONS.TOGGLE_FOCUS_MODE:
            return { ...state, isFocusMode: !state.isFocusMode };

        case ACTIONS.SPEND_FOCUS:
            return {
                ...state,
                focus: Math.max(0, state.focus - action.payload)
            };

        case ACTIONS.RESTORE_FOCUS:
            return {
                ...state,
                focus: Math.min(state.maxFocus, state.focus + action.payload)
            };

        case ACTIONS.COLLECT_TOKEN:
            // Prevent duplicate tokens
            if (state.collectedTokens.find(t => t.id === action.payload.id)) {
                return state;
            }
            return {
                ...state,
                collectedTokens: [...state.collectedTokens, action.payload]
            };

        case ACTIONS.ADD_TO_CLIPBOARD:
            if (state.clipboardTokens.find(t => t.id === action.payload.id)) {
                return state;
            }
            return {
                ...state,
                clipboardTokens: [...state.clipboardTokens, action.payload]
            };

        case ACTIONS.REMOVE_FROM_CLIPBOARD:
            return {
                ...state,
                clipboardTokens: state.clipboardTokens.filter(t => t.id !== action.payload)
            };

        case ACTIONS.ADVANCE_DIALOGUE:
            return { ...state, currentDialogueIndex: state.currentDialogueIndex + 1 };

        case ACTIONS.UNLOCK_DIALOGUE:
            if (state.unlockedDialogue.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                unlockedDialogue: [...state.unlockedDialogue, action.payload]
            };

        case ACTIONS.REVEAL_SYMPTOM:
            if (state.revealedSymptoms.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                revealedSymptoms: [...state.revealedSymptoms, action.payload]
            };

        case ACTIONS.RECORD_BREAKTHROUGH:
            return {
                ...state,
                breakthroughs: [...state.breakthroughs, action.payload]
            };

        case ACTIONS.UPDATE_SESSION_NOTES:
            return {
                ...state,
                sessionNotes: { ...state.sessionNotes, ...action.payload }
            };

        case ACTIONS.SET_DIAGNOSIS:
            return {
                ...state,
                sessionNotes: { ...state.sessionNotes, finalDiagnosis: action.payload }
            };

        case ACTIONS.ADD_KNOWLEDGE_POINTS:
            return {
                ...state,
                knowledgePoints: state.knowledgePoints + action.payload
            };

        case ACTIONS.UNLOCK_UPGRADE:
            if (state.upgrades.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                upgrades: [...state.upgrades, action.payload]
            };

        default:
            return state;
    }
}

// Context
const GameContext = createContext(null);

// Provider Component
export function GameProvider({ children }) {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    // Action Creators
    const actions = {
        setScreen: useCallback((screen) => {
            dispatch({ type: ACTIONS.SET_SCREEN, payload: screen });
        }, []),

        startSession: useCallback((patient) => {
            dispatch({ type: ACTIONS.START_SESSION, payload: patient });
        }, []),

        endSession: useCallback(() => {
            dispatch({ type: ACTIONS.END_SESSION });
        }, []),

        advanceTurn: useCallback(() => {
            dispatch({ type: ACTIONS.ADVANCE_TURN });
        }, []),

        toggleFocusMode: useCallback(() => {
            dispatch({ type: ACTIONS.TOGGLE_FOCUS_MODE });
        }, []),

        spendFocus: useCallback((amount) => {
            dispatch({ type: ACTIONS.SPEND_FOCUS, payload: amount });
        }, []),

        restoreFocus: useCallback((amount) => {
            dispatch({ type: ACTIONS.RESTORE_FOCUS, payload: amount });
        }, []),

        collectToken: useCallback((token) => {
            dispatch({ type: ACTIONS.COLLECT_TOKEN, payload: token });
        }, []),

        addToClipboard: useCallback((token) => {
            dispatch({ type: ACTIONS.ADD_TO_CLIPBOARD, payload: token });
        }, []),

        removeFromClipboard: useCallback((tokenId) => {
            dispatch({ type: ACTIONS.REMOVE_FROM_CLIPBOARD, payload: tokenId });
        }, []),

        advanceDialogue: useCallback(() => {
            dispatch({ type: ACTIONS.ADVANCE_DIALOGUE });
        }, []),

        unlockDialogue: useCallback((dialogueId) => {
            dispatch({ type: ACTIONS.UNLOCK_DIALOGUE, payload: dialogueId });
        }, []),

        revealSymptom: useCallback((symptomId) => {
            dispatch({ type: ACTIONS.REVEAL_SYMPTOM, payload: symptomId });
        }, []),

        recordBreakthrough: useCallback((breakthrough) => {
            dispatch({ type: ACTIONS.RECORD_BREAKTHROUGH, payload: breakthrough });
        }, []),

        updateSessionNotes: useCallback((notes) => {
            dispatch({ type: ACTIONS.UPDATE_SESSION_NOTES, payload: notes });
        }, []),

        setDiagnosis: useCallback((diagnosis) => {
            dispatch({ type: ACTIONS.SET_DIAGNOSIS, payload: diagnosis });
        }, []),

        addKnowledgePoints: useCallback((points) => {
            dispatch({ type: ACTIONS.ADD_KNOWLEDGE_POINTS, payload: points });
        }, []),

        unlockUpgrade: useCallback((upgradeId) => {
            dispatch({ type: ACTIONS.UNLOCK_UPGRADE, payload: upgradeId });
        }, []),
    };

    return (
        <GameContext.Provider value={{ gameState, actions }}>
            {children}
        </GameContext.Provider>
    );
}

// Hook
export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export { ACTIONS };
