/**
 * SynsDialogueBox - Dialogue component powered by the SYNS dialogue engine
 * Integrates .syns files with the game's dialogue display
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialogue, loadPatientDialogue } from '../../dialogue/index.js';
import { useGame } from '../../context/GameContext.jsx';
import '../../styles/dialogue-box.css';

// Animation variants
const dialogueVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
    }
};

const keywordVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    collected: {
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
    }
};

const keywordPopVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 5
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
            delay: 0.1
        }
    }
};

const tooltipVariants = {
    hidden: { opacity: 0, y: 5, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
    }
};

// Mood display configurations
const MOOD_CONFIG = {
    nervous: { emoji: '😰', color: '#ffd93d', label: 'Nervous' },
    anxious: { emoji: '😟', color: '#ff6b6b', label: 'Anxious' },
    defensive: { emoji: '🛡️', color: '#4ecdc4', label: 'Defensive' },
    guarded: { emoji: '😐', color: '#95a5a6', label: 'Guarded' },
    hesitant: { emoji: '🤔', color: '#a29bfe', label: 'Hesitant' },
    vulnerable: { emoji: '💔', color: '#fd79a8', label: 'Vulnerable' },
    relieved: { emoji: '😌', color: '#55efc4', label: 'Relieved' },
    hopeful: { emoji: '🌟', color: '#ffeaa7', label: 'Hopeful' },
    angry: { emoji: '😠', color: '#e74c3c', label: 'Angry' },
    sad: { emoji: '😢', color: '#74b9ff', label: 'Sad' },
    contemplative: { emoji: '🤔', color: '#6c5ce7', label: 'Contemplative' },
    defeated: { emoji: '😔', color: '#636e72', label: 'Defeated' },
    opening_up: { emoji: '🌱', color: '#00b894', label: 'Opening Up' },
    trusting: { emoji: '🤝', color: '#00cec9', label: 'Trusting' },
    neutral: { emoji: '😐', color: '#dfe6e9', label: 'Neutral' },
};

// Helper function to get keyword type
function getKeywordType(keyword) {
    if (keyword.contradicts) return 'contradiction';
    if (keyword.reveals) return 'reveal';

    const text = (keyword.text || '').toLowerCase();

    if (/\b(always|never|constantly|weeks?|months?|years?|lately|recently)\b/.test(text)) {
        return 'duration';
    }
    if (/\b(very|extremely|really|so much|intense|severe|overwhelming)\b/.test(text)) {
        return 'intensity';
    }
    if (/\b(worried|anxious|scared|nervous|stressed|depressed|hopeful)\b/.test(text)) {
        return 'emotion';
    }
    if (/\b(can't|cannot|avoid|stop|sleep|eat|work|focus)\b/.test(text)) {
        return 'behavior';
    }
    if (/\b(job|work|family|relationship|friend|home)\b/.test(text)) {
        return 'background';
    }

    return 'general';
}

// Parse text with keywords into renderable segments
function parseDialogueText(text, keywords = []) {
    if (!keywords || keywords.length === 0) {
        return [{ type: 'text', content: text }];
    }

    const segments = [];
    let remaining = text;

    // Sort keywords by their position in text (first occurrence)
    const sortedKeywords = [...keywords].sort((a, b) => {
        const posA = text.indexOf(a.text);
        const posB = text.indexOf(b.text);
        return posA - posB;
    });

    for (const keyword of sortedKeywords) {
        const index = remaining.indexOf(keyword.text);
        if (index === -1) continue;

        // Add text before keyword
        if (index > 0) {
            segments.push({ type: 'text', content: remaining.slice(0, index) });
        }

        // Add keyword
        segments.push({ type: 'keyword', keyword, content: keyword.text });

        // Continue with remaining text
        remaining = remaining.slice(index + keyword.text.length);
    }

    // Add any remaining text
    if (remaining) {
        segments.push({ type: 'text', content: remaining });
    }

    return segments;
}

function SynsDialogueBox({
    patientId,
    turn,
    onKeywordCollected,
    onAskAbout,
    onHighlightInHandbook,
    onExploreBackground,
    onSpeechChange,
    onDialogueEnd,
    isFocusMode = false,
    patientName = 'Patient',
    // Fallback to old dialogue format if SYNS file not found
    fallbackDialogue = []
}) {
    const { gameState, actions } = useGame();
    const dialogueState = useDialogue(gameState, actions);

    const {
        currentSpeech,
        isPlaying,
        loadDialogue,
        startBlock,
        advance,
        handleResponse,
        availableResponses,
        dialogueHistory
    } = dialogueState;

    // Local state
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [collectedKeywords, setCollectedKeywords] = useState(new Set());
    const [showMoodTooltip, setShowMoodTooltip] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const [fallbackIndex, setFallbackIndex] = useState(0);

    const dialogueRef = useRef(null);
    const typingRef = useRef(null);

    // Load SYNS dialogue on mount or when turn changes
    useEffect(() => {
        async function loadSynsDialogue() {
            try {
                const source = await loadPatientDialogue(patientId, turn);
                if (source) {
                    loadDialogue(source);
                    setIsLoaded(true);
                    setUseFallback(false);
                    // Auto-start from START block
                    startBlock('START');
                } else {
                    console.warn(`No SYNS file found for ${patientId} turn ${turn}, using fallback`);
                    setUseFallback(true);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Error loading SYNS dialogue:', error);
                setUseFallback(true);
                setIsLoaded(true);
            }
        }

        if (patientId && turn) {
            loadSynsDialogue();
        }
    }, [patientId, turn, loadDialogue, startBlock]);

    // Get current display content
    const currentContent = useMemo(() => {
        if (useFallback) {
            return fallbackDialogue[fallbackIndex] || null;
        }
        return currentSpeech;
    }, [useFallback, fallbackDialogue, fallbackIndex, currentSpeech]);

    // Typewriter effect
    useEffect(() => {
        if (!currentContent?.text) {
            setDisplayedText('');
            return;
        }

        const fullText = currentContent.text;
        setDisplayedText('');
        setIsTyping(true);

        let index = 0;
        const speed = 30; // ms per character

        typingRef.current = setInterval(() => {
            if (index < fullText.length) {
                setDisplayedText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typingRef.current);
                setIsTyping(false);
            }
        }, speed);

        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [currentContent?.text, currentContent?.id]);

    // Notify parent of speech changes
    useEffect(() => {
        if (onSpeechChange && currentContent) {
            onSpeechChange(currentContent);
        }
    }, [currentContent, onSpeechChange]);

    // Handle click to advance dialogue
    const handleClick = useCallback(() => {
        if (isTyping) {
            // Skip typing animation
            if (typingRef.current) clearInterval(typingRef.current);
            setDisplayedText(currentContent?.text || '');
            setIsTyping(false);
            return;
        }

        if (useFallback) {
            if (fallbackIndex < fallbackDialogue.length - 1) {
                setFallbackIndex(prev => prev + 1);
            } else if (onDialogueEnd) {
                onDialogueEnd();
            }
        } else {
            const result = advance();
            if (!result || result.type === 'end') {
                if (onDialogueEnd) {
                    onDialogueEnd();
                }
            }
        }
    }, [isTyping, useFallback, fallbackIndex, fallbackDialogue.length, advance, currentContent, onDialogueEnd]);

    // Handle keyword collection
    const handleKeywordClick = useCallback((keyword, event) => {
        event.stopPropagation();

        if (collectedKeywords.has(keyword.id)) return;

        setCollectedKeywords(prev => new Set([...prev, keyword.id]));

        const token = {
            id: keyword.id,
            type: 'text',
            content: keyword.text,
            contradicts: keyword.contradicts,
            reveals: keyword.reveals,
            relatedSymptom: keyword.relatedSymptom,
        };

        if (onKeywordCollected) {
            onKeywordCollected(token);
        }

        // If keyword contradicts something, notify game
        if (keyword.contradicts) {
            actions.collectToken(token);
            actions.addToClipboard(token);
        }
    }, [collectedKeywords, onKeywordCollected, actions]);

    // Get mood config
    const moodConfig = currentContent?.mood
        ? MOOD_CONFIG[currentContent.mood] || MOOD_CONFIG.neutral
        : MOOD_CONFIG.neutral;

    // Parse text segments
    const textSegments = useMemo(() => {
        if (!currentContent?.text) return [];
        return parseDialogueText(displayedText, currentContent.keywords || []);
    }, [displayedText, currentContent?.keywords]);

    // Render loading state
    if (!isLoaded) {
        return (
            <div className="dialogue-box loading">
                <div className="loading-spinner" />
                <span>Loading dialogue...</span>
            </div>
        );
    }

    // Render empty state
    if (!currentContent) {
        return (
            <div className="dialogue-box empty">
                <span className="empty-message">Waiting for patient...</span>
            </div>
        );
    }

    // Determine speaker display
    const speakerDisplay = currentContent.speaker === 'PATIENT'
        ? patientName
        : currentContent.speaker === 'NARRATOR'
            ? null // Narrator text is styled differently
            : currentContent.speaker || patientName;

    const isNarrator = currentContent.speaker === 'NARRATOR';
    const isAction = currentContent.isAction;

    return (
        <motion.div
            ref={dialogueRef}
            className={`dialogue-box ${isFocusMode ? 'focus-mode' : ''} ${isNarrator ? 'narrator' : ''}`}
            onClick={handleClick}
            variants={dialogueVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Speaker Header */}
            {speakerDisplay && (
                <div className="dialogue-header">
                    <span className="speaker-name">{speakerDisplay}</span>

                    {/* Mood indicator */}
                    {currentContent.mood && (
                        <motion.div
                            className="mood-indicator"
                            style={{ backgroundColor: `${moodConfig.color}20`, borderColor: moodConfig.color }}
                            onMouseEnter={() => setShowMoodTooltip(true)}
                            onMouseLeave={() => setShowMoodTooltip(false)}
                        >
                            <span className="mood-emoji">{moodConfig.emoji}</span>
                            <span className="mood-label" style={{ color: moodConfig.color }}>
                                {moodConfig.label}
                            </span>

                            <AnimatePresence>
                                {showMoodTooltip && (
                                    <motion.div
                                        className="mood-tooltip"
                                        variants={tooltipVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        Patient appears {moodConfig.label.toLowerCase()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Dialogue Text */}
            <div className={`dialogue-text ${isAction ? 'action-text' : ''}`}>
                {isNarrator || isAction ? (
                    <p className="narrator-text">
                        <em>{displayedText}</em>
                    </p>
                ) : (
                    <p>
                        {textSegments.map((segment, idx) => {
                            if (segment.type === 'keyword') {
                                const keyword = segment.keyword;
                                const isCollected = collectedKeywords.has(keyword.id);
                                const keywordType = getKeywordType(keyword);

                                return (
                                    <motion.span
                                        key={keyword.id || idx}
                                        className={`keyword ${keywordType} ${isCollected ? 'collected' : ''}`}
                                        onClick={(e) => handleKeywordClick(keyword, e)}
                                        variants={keywordVariants}
                                        initial="idle"
                                        whileHover={!isCollected ? "hover" : undefined}
                                        whileTap={!isCollected ? "tap" : undefined}
                                        animate={isCollected ? "collected" : "idle"}
                                        data-type={keywordType}
                                    >
                                        {segment.content}
                                        {keyword.contradicts && !isCollected && (
                                            <span className="contradiction-hint">!</span>
                                        )}
                                    </motion.span>
                                );
                            }
                            return <span key={idx}>{segment.content}</span>;
                        })}
                    </p>
                )}

                {/* Typing cursor */}
                {isTyping && <span className="typing-cursor">|</span>}
            </div>

            {/* Continue indicator */}
            {!isTyping && (
                <motion.div
                    className="continue-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span>Click to continue</span>
                    <span className="continue-arrow">▼</span>
                </motion.div>
            )}

            {/* Keyword counter */}
            {currentContent.keywords?.length > 0 && (
                <div className="keyword-counter">
                    <span className="counter-icon">🔑</span>
                    <span className="counter-text">
                        {collectedKeywords.size} / {currentContent.keywords.length} collected
                    </span>
                </div>
            )}
        </motion.div>
    );
}

export default SynsDialogueBox;
