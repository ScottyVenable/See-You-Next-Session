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
    const loadedRef = useRef(false);

    // Load SYNS dialogue on mount or when turn changes
    useEffect(() => {
        // Prevent double loading
        if (loadedRef.current) return;

        async function loadSynsDialogue() {
            try {
                const source = await loadPatientDialogue(patientId, turn);
                if (source) {
                    loadDialogue(source);
                    setIsLoaded(true);
                    setUseFallback(false);
                    loadedRef.current = true;
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

        // Reset on unmount for next load
        return () => {
            loadedRef.current = false;
        };
    }, [patientId, turn]); // Removed loadDialogue and startBlock to prevent re-runs

    // Get current display content
    const currentContent = useMemo(() => {
        console.log('[SynsDialogueBox] useFallback:', useFallback, 'currentSpeech:', currentSpeech);
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
        console.log('[SynsDialogueBox] handleClick - isTyping:', isTyping, 'useFallback:', useFallback);

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
            console.log('[SynsDialogueBox] Calling advance()');
            const result = advance();
            console.log('[SynsDialogueBox] advance() result:', result);
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
    const hasKeywords = currentContent.keywords?.length > 0;
    const totalKeywords = currentContent.keywords?.length || 0;
    const collectedCount = currentContent.keywords?.filter(k => collectedKeywords.has(k.id)).length || 0;
    const allCollected = collectedCount === totalKeywords && totalKeywords > 0;

    return (
        <motion.div
            ref={dialogueRef}
            className={`dialogue-box ${allCollected ? 'all-collected' : ''} ${isFocusMode ? 'focus-mode' : ''} ${isNarrator ? 'narrator' : ''}`}
            onClick={handleClick}
            variants={dialogueVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Speaker Header - matching original DialogueBox structure */}
            <div className="dialogue-speaker">
                <motion.div
                    className="speaker-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="speaker-avatar">{isNarrator ? '📖' : '👤'}</span>
                    <span className="speaker-name">{speakerDisplay || 'Narrator'}</span>
                </motion.div>

                <div className="speaker-meta">
                    {/* Mood indicator */}
                    {currentContent.mood && (
                        <motion.div
                            className={`mood-chip-wrapper ${isFocusMode ? 'focus-active' : ''}`}
                            onMouseEnter={() => setShowMoodTooltip(true)}
                            onMouseLeave={() => setShowMoodTooltip(false)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, type: "spring" }}
                        >
                            <span className={`mood-chip ${currentContent.mood}`}>
                                <span className="mood-emoji">{moodConfig.emoji}</span>
                                <span className="mood-label">{moodConfig.label}</span>
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
                                        <span className="tooltip-header">{isFocusMode ? 'Clinical Observation' : 'Your Impression'}</span>
                                        <span className="tooltip-text">Patient appears {moodConfig.label.toLowerCase()}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Keyword counter */}
                    {hasKeywords && (
                        <motion.div
                            className={`keyword-counter ${allCollected ? 'complete' : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <span className="counter-icon">🔑</span>
                            <span className="counter-text">{collectedCount}/{totalKeywords}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Dialogue Text */}
            <div className={`dialogue-text ${isAction ? 'action-text' : ''}`}>
                {isNarrator || isAction ? (
                    <>
                        <em>{displayedText}</em>
                    </>
                ) : (
                    <>
                        <span className="dialogue-quote">"</span>
                        {textSegments.map((segment, idx) => {
                            if (segment.type === 'keyword') {
                                const keyword = segment.keyword;
                                const isCollected = collectedKeywords.has(keyword.id);
                                const keywordType = getKeywordType(keyword);

                                return (
                                    <motion.span
                                        key={keyword.id || idx}
                                        className={`dialogue-keyword ${isCollected ? 'collected' : 'available'} keyword-type-${keywordType}`}
                                        onClick={(e) => handleKeywordClick(keyword, e)}
                                        variants={keywordPopVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={!isCollected ? { scale: 1.02 } : undefined}
                                        whileTap={!isCollected ? { scale: 0.98 } : undefined}
                                    >
                                        <span className="keyword-type-indicator" />
                                        {segment.content}
                                        {!isCollected && <span className="keyword-hint">+</span>}
                                        {keyword.contradicts && !isCollected && (
                                            <span className="contradiction-hint">!</span>
                                        )}
                                    </motion.span>
                                );
                            }
                            return <span key={idx}>{segment.content}</span>;
                        })}
                        <span className="dialogue-quote">"</span>
                    </>
                )}

                {/* Typing cursor */}
                {isTyping && <span className="typing-cursor">|</span>}
            </div>

            {/* Continue indicator */}
            {!isTyping && availableResponses.length === 0 && (
                <motion.div
                    className="continue-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span>Click to continue</span>
                    <span className="continue-arrow">▶</span>
                </motion.div>
            )}

            {/* Response Options Panel */}
            {!isTyping && availableResponses.length > 0 && (
                <ResponsePanel
                    responses={availableResponses}
                    onSelectResponse={(topic, subtopic) => {
                        handleResponse(topic, subtopic);
                    }}
                />
            )}
        </motion.div>
    );
}

// Response Panel Component
function ResponsePanel({ responses, onSelectResponse }) {
    // Group responses by topic
    const groupedResponses = useMemo(() => {
        const groups = {};
        responses.forEach(r => {
            if (!groups[r.topic]) {
                groups[r.topic] = [];
            }
            groups[r.topic].push(r);
        });
        return groups;
    }, [responses]);

    const topicLabels = {
        family: { label: 'Family', icon: '👨‍👩‍👧' },
        work: { label: 'Work', icon: '💼' },
        emotions: { label: 'Emotions', icon: '💭' },
        relationships: { label: 'Relationships', icon: '💕' },
        sleep: { label: 'Sleep', icon: '😴' },
        physical: { label: 'Physical Health', icon: '🏃' },
        self: { label: 'Self & Identity', icon: '🪞' },
        coping: { label: 'Coping', icon: '🛡️' },
        history: { label: 'History', icon: '📖' },
    };

    const subtopicLabels = {
        parents: 'Tell me about your parents',
        childhood: 'What was childhood like?',
        siblings: 'Do you have siblings?',
        job: 'What do you do for work?',
        stress: 'Work stress',
        performance: 'How are you performing?',
        colleagues: 'Your coworkers',
        anxiety: 'Tell me about your anxiety',
        mood: 'How has your mood been?',
        worry: 'What do you worry about?',
        fear: 'What are you afraid of?',
        sleep: 'How is your sleep?',
        routine: 'Your sleep routine',
        dreams: 'Do you dream?',
        friends: 'Tell me about your friends',
        partner: 'Are you in a relationship?',
        trust: 'Trust in relationships',
        symptoms: 'Physical symptoms',
        appetite: 'How is your appetite?',
        exercise: 'Do you exercise?',
        identity: 'How do you see yourself?',
        expectations: 'Others\' expectations',
    };

    const [expandedTopic, setExpandedTopic] = useState(null);

    return (
        <motion.div
            className="response-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="response-panel-header">
                <span className="response-icon">💬</span>
                <span>Choose a topic to explore:</span>
            </div>

            <div className="response-topics">
                {Object.entries(groupedResponses).map(([topic, subtopics]) => {
                    const topicInfo = topicLabels[topic] || { label: topic, icon: '❓' };
                    const isExpanded = expandedTopic === topic;

                    return (
                        <div key={topic} className="response-topic-group">
                            <motion.button
                                className={`response-topic-btn ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => setExpandedTopic(isExpanded ? null : topic)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="topic-icon">{topicInfo.icon}</span>
                                <span className="topic-label">{topicInfo.label}</span>
                                <span className="topic-count">{subtopics.length}</span>
                                <span className={`topic-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                            </motion.button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        className="subtopic-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {subtopics.map(({ subtopic, key }) => (
                                            <motion.button
                                                key={key}
                                                className="subtopic-btn"
                                                onClick={() => onSelectResponse(topic, subtopic)}
                                                whileHover={{ scale: 1.01, x: 4 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <span className="subtopic-bullet">•</span>
                                                <span className="subtopic-label">
                                                    {subtopicLabels[subtopic] || subtopic}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default SynsDialogueBox;
