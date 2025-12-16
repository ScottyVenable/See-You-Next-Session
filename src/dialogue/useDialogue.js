/**
 * useDialogue - React hook for the SYNS dialogue system
 * Provides easy integration with React components
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { DialogueEngine } from './engine.js';
import { parseDialogue } from './parser.js';

/**
 * Hook for managing dialogue in React components
 * @param {object} gameState - Current game state
 * @param {object} actions - Game actions
 * @returns {object} - Dialogue controls and state
 */
export function useDialogue(gameState, actions) {
    const engineRef = useRef(null);

    // Dialogue state
    const [currentSpeech, setCurrentSpeech] = useState(null);
    const [speechQueue, setSpeechQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentKeywords, setCurrentKeywords] = useState([]);
    const [availableResponses, setAvailableResponses] = useState([]);
    const [dialogueHistory, setDialogueHistory] = useState([]);

    // Initialize engine
    useEffect(() => {
        engineRef.current = new DialogueEngine(gameState, actions);

        // Set up event handlers
        engineRef.current.onSpeech = (speech) => {
            setSpeechQueue(prev => [...prev, speech]);
        };

        engineRef.current.onKeywordFound = (keyword) => {
            setCurrentKeywords(prev => [...prev, keyword]);
        };

        engineRef.current.onRapportChange = (amount) => {
            console.log(`Rapport changed by ${amount}`);
        };

        engineRef.current.onPause = (duration) => {
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), duration * 1000);
        };

        engineRef.current.onBlockEnd = (blockName) => {
            console.log(`Block "${blockName}" ended`);
        };

        return () => {
            engineRef.current = null;
        };
    }, []);

    // Update game state in engine when it changes
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.gameState = gameState;
        }
    }, [gameState]);

    /**
     * Load a dialogue source
     */
    const loadDialogue = useCallback((source) => {
        if (!engineRef.current) return;

        engineRef.current.loadDialogue(source);
        setAvailableResponses(engineRef.current.getAvailableResponses());
        setSpeechQueue([]);
        setCurrentSpeech(null);
        setDialogueHistory([]);
        setCurrentKeywords([]);
    }, []);

    /**
     * Load dialogue from a URL
     */
    const loadDialogueFromUrl = useCallback(async (url) => {
        try {
            const response = await fetch(url);
            const source = await response.text();
            loadDialogue(source);
        } catch (error) {
            console.error('Failed to load dialogue:', error);
        }
    }, [loadDialogue]);

    /**
     * Start playing from a block
     */
    const startBlock = useCallback((blockName = 'START') => {
        if (!engineRef.current) return;

        console.log('[useDialogue] startBlock called:', blockName);
        setIsPlaying(true);
        setSpeechQueue([]);

        // Execute until we hit a pause or speech
        let result = engineRef.current.startBlock(blockName);
        console.log('[useDialogue] startBlock initial result:', result);

        while (result && result.type !== 'speech' && result.type !== 'pause' && result.type !== 'end') {
            result = engineRef.current.executeNext();
            console.log('[useDialogue] executeNext result:', result);
        }

        // If we got a speech result, set it as current immediately
        if (result?.type === 'speech') {
            console.log('[useDialogue] Setting initial speech:', result);
            setCurrentSpeech(result);
            setDialogueHistory(prev => [...prev, result]);
        }
    }, []);

    /**
     * Advance to next speech
     */
    const advance = useCallback(() => {
        if (!engineRef.current || isPaused) return null;

        // If there's queued speech, show it
        if (speechQueue.length > 0) {
            const [next, ...rest] = speechQueue;
            setCurrentSpeech(next);
            setSpeechQueue(rest);
            setDialogueHistory(prev => [...prev, next]);
            return next;
        }

        // Otherwise execute next line
        let result = engineRef.current.executeNext();

        // Keep executing until we get speech, pause, or end
        while (result && result.type !== 'speech' && result.type !== 'pause' && result.type !== 'end') {
            result = engineRef.current.executeNext();
        }

        if (result?.type === 'speech') {
            setCurrentSpeech(result);
            setDialogueHistory(prev => [...prev, result]);
            return result;
        }

        if (result?.type === 'end') {
            setIsPlaying(false);
            return null;
        }

        return result;
    }, [speechQueue, isPaused]);

    /**
     * Handle player response (topic selection)
     */
    const handleResponse = useCallback((topic, subtopic = null) => {
        if (!engineRef.current) return [];

        const results = engineRef.current.handleResponse(topic, subtopic);

        if (results && results.length > 0) {
            // Queue up speech results
            const speeches = results.filter(r => r.type === 'speech');
            if (speeches.length > 0) {
                setSpeechQueue(prev => [...prev, ...speeches]);
                // Show first immediately
                advance();
            }
        }

        return results;
    }, [advance]);

    /**
     * Check and trigger breakthrough
     */
    const checkBreakthrough = useCallback((keywordId, symptomId) => {
        if (!engineRef.current) return null;

        const result = engineRef.current.checkBreakthrough(keywordId, symptomId);

        if (result) {
            const speeches = result.results.filter(r => r.type === 'speech');
            if (speeches.length > 0) {
                setSpeechQueue(prev => [...prev, ...speeches]);
            }
        }

        return result;
    }, []);

    /**
     * Get all collected keywords from dialogue
     */
    const getKeywords = useCallback(() => {
        return currentKeywords;
    }, [currentKeywords]);

    /**
     * Skip current pause
     */
    const skipPause = useCallback(() => {
        setIsPaused(false);
    }, []);

    /**
     * Reset dialogue state
     */
    const reset = useCallback(() => {
        if (engineRef.current) {
            engineRef.current.reset();
        }
        setCurrentSpeech(null);
        setSpeechQueue([]);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentKeywords([]);
        setDialogueHistory([]);
    }, []);

    /**
     * Get variable from engine
     */
    const getVariable = useCallback((name) => {
        if (!engineRef.current) return null;
        return engineRef.current.getVariable(name);
    }, []);

    /**
     * Set variable in engine
     */
    const setVariable = useCallback((name, value) => {
        if (!engineRef.current) return;
        engineRef.current.variables[name] = value;
    }, []);

    return {
        // State
        currentSpeech,
        speechQueue,
        isPlaying,
        isPaused,
        currentKeywords,
        availableResponses,
        dialogueHistory,

        // Actions
        loadDialogue,
        loadDialogueFromUrl,
        startBlock,
        advance,
        handleResponse,
        checkBreakthrough,
        getKeywords,
        skipPause,
        reset,
        getVariable,
        setVariable,

        // Engine ref for advanced use
        engine: engineRef.current,
    };
}

export default useDialogue;
