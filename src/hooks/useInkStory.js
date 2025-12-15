import { useState, useCallback, useEffect, useRef } from 'react';
import { Story } from 'inkjs';

/**
 * useInkStory - Custom React hook for managing Ink narrative stories
 * 
 * @param {string} storyContent - Compiled Ink story JSON content
 * @param {Object} options - Configuration options
 * @param {Object} options.initialVariables - Variables to set at story start
 * @param {Function} options.onTag - Callback when a tag is encountered
 * @param {Function} options.onVariableChange - Callback when a variable changes
 * 
 * @returns {Object} Story state and control functions
 * 
 * @example
 * const { 
 *   text, 
 *   choices, 
 *   canContinue, 
 *   makeChoice, 
 *   continueStory,
 *   getVariable,
 *   setVariable 
 * } = useInkStory(compiledStoryJson);
 */
export function useInkStory(storyContent, options = {}) {
    const {
        initialVariables = {},
        onTag,
        onVariableChange,
    } = options;

    const storyRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Story output state
    const [currentText, setCurrentText] = useState('');
    const [currentTags, setCurrentTags] = useState([]);
    const [choices, setChoices] = useState([]);
    const [canContinue, setCanContinue] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    // History for displaying conversation
    const [history, setHistory] = useState([]);

    // Initialize story
    useEffect(() => {
        if (!storyContent) return;

        try {
            const story = new Story(storyContent);
            storyRef.current = story;

            // Set initial variables
            Object.entries(initialVariables).forEach(([key, value]) => {
                story.variablesState[key] = value;
            });

            // Set up variable observer
            if (onVariableChange) {
                story.ObserveVariable('*', (variableName, newValue) => {
                    onVariableChange(variableName, newValue);
                });
            }

            setIsLoaded(true);
            setError(null);

            // Auto-continue to first content
            updateStoryState();
        } catch (err) {
            console.error('Failed to load Ink story:', err);
            setError(err.message);
            setIsLoaded(false);
        }
    }, [storyContent]);

    // Update state from story
    const updateStoryState = useCallback(() => {
        const story = storyRef.current;
        if (!story) return;

        setCanContinue(story.canContinue);
        setChoices(story.currentChoices.map((choice, index) => ({
            index,
            text: choice.text,
            tags: choice.tags || [],
        })));
        setIsEnded(!story.canContinue && story.currentChoices.length === 0);
    }, []);

    // Continue the story
    const continueStory = useCallback(() => {
        const story = storyRef.current;
        if (!story || !story.canContinue) return null;

        const text = story.Continue();
        const tags = story.currentTags || [];

        // Process tags
        if (onTag && tags.length > 0) {
            tags.forEach(tag => onTag(tag));
        }

        // Add to history
        const entry = {
            type: 'text',
            content: text.trim(),
            tags,
            timestamp: Date.now()
        };
        setHistory(prev => [...prev, entry]);

        setCurrentText(text.trim());
        setCurrentTags(tags);
        updateStoryState();

        return { text: text.trim(), tags };
    }, [onTag, updateStoryState]);

    // Continue story until a choice or end
    const continueUntilChoice = useCallback(() => {
        const story = storyRef.current;
        if (!story) return [];

        const paragraphs = [];

        while (story.canContinue) {
            const text = story.Continue();
            const tags = story.currentTags || [];

            if (text.trim()) {
                paragraphs.push({ text: text.trim(), tags });

                // Process tags
                if (onTag && tags.length > 0) {
                    tags.forEach(tag => onTag(tag));
                }

                // Add to history
                setHistory(prev => [...prev, {
                    type: 'text',
                    content: text.trim(),
                    tags,
                    timestamp: Date.now()
                }]);
            }
        }

        if (paragraphs.length > 0) {
            const last = paragraphs[paragraphs.length - 1];
            setCurrentText(last.text);
            setCurrentTags(last.tags);
        }

        updateStoryState();
        return paragraphs;
    }, [onTag, updateStoryState]);

    // Make a choice
    const makeChoice = useCallback((choiceIndex) => {
        const story = storyRef.current;
        if (!story) return;

        const choiceText = story.currentChoices[choiceIndex]?.text;

        // Add choice to history
        setHistory(prev => [...prev, {
            type: 'choice',
            content: choiceText,
            index: choiceIndex,
            timestamp: Date.now()
        }]);

        story.ChooseChoiceIndex(choiceIndex);
        updateStoryState();

        // Auto-continue after choice
        return continueUntilChoice();
    }, [continueUntilChoice, updateStoryState]);

    // Get variable value
    const getVariable = useCallback((name) => {
        const story = storyRef.current;
        if (!story) return undefined;
        return story.variablesState[name];
    }, []);

    // Set variable value
    const setVariable = useCallback((name, value) => {
        const story = storyRef.current;
        if (!story) return;
        story.variablesState[name] = value;
    }, []);

    // Jump to a knot/stitch
    const jumpTo = useCallback((path) => {
        const story = storyRef.current;
        if (!story) return;

        story.ChoosePathString(path);
        setHistory(prev => [...prev, {
            type: 'jump',
            content: path,
            timestamp: Date.now()
        }]);
        updateStoryState();
        return continueUntilChoice();
    }, [continueUntilChoice, updateStoryState]);

    // Save story state
    const saveState = useCallback(() => {
        const story = storyRef.current;
        if (!story) return null;
        return story.state.ToJson();
    }, []);

    // Load story state
    const loadState = useCallback((stateJson) => {
        const story = storyRef.current;
        if (!story || !stateJson) return;

        story.state.LoadJson(stateJson);
        updateStoryState();
    }, [updateStoryState]);

    // Reset story to beginning
    const resetStory = useCallback(() => {
        const story = storyRef.current;
        if (!story) return;

        story.ResetState();
        setHistory([]);
        setCurrentText('');
        setCurrentTags([]);

        // Restore initial variables
        Object.entries(initialVariables).forEach(([key, value]) => {
            story.variablesState[key] = value;
        });

        updateStoryState();
    }, [initialVariables, updateStoryState]);

    // Parse tags into structured data
    // Supports formats: "key:value" and "key"
    const parseTags = useCallback((tags) => {
        const parsed = {};
        tags.forEach(tag => {
            if (tag.includes(':')) {
                const [key, ...valueParts] = tag.split(':');
                parsed[key.trim()] = valueParts.join(':').trim();
            } else {
                parsed[tag.trim()] = true;
            }
        });
        return parsed;
    }, []);

    return {
        // State
        isLoaded,
        error,
        currentText,
        currentTags,
        parsedTags: parseTags(currentTags),
        choices,
        canContinue,
        isEnded,
        history,

        // Actions
        continueStory,
        continueUntilChoice,
        makeChoice,
        jumpTo,
        resetStory,

        // Variables
        getVariable,
        setVariable,

        // Persistence
        saveState,
        loadState,

        // Utilities
        parseTags,
    };
}

export default useInkStory;
