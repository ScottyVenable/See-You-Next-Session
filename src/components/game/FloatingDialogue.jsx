/**
 * FloatingDialogue - Clean, minimal dialogue display for the floating panel
 * Shows just the essential: quoted text and continue hint
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialogue, loadPatientDialogue } from '../../sdns/index.js';
import { useGame } from '../../context/GameContext.jsx';
import '../../styles/dialogue-box.css';

const contextMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -4 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -4 },
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

// Remove bracket and observation markers so the UI never shows [keyword] or %observation%
function sanitizeDialogueText(rawText = '') {
    return rawText
        .replace(/\[([^\]]+)\](<[^>]+>)?/g, '$1')
        .replace(/%([^%<>]+)(<[^>]+>)?%/g, '$1');
}

// Minimal inline markdown renderer (bold, italics, code, newlines)
function renderInlineMarkdown(text, keyPrefix = 'md') {
    const nodes = [];
    const pattern = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3|(`)(.+?)\5|(\n)/gs;
    let lastIndex = 0;
    let match;
    let partIndex = 0;

    try {
        while ((match = pattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                nodes.push(text.slice(lastIndex, match.index));
            }

            if (match[1]) {
                nodes.push(
                    <strong key={`${keyPrefix}-b-${partIndex}`}>
                        {renderInlineMarkdown(match[2], `${keyPrefix}-b-${partIndex}`)}
                    </strong>
                );
            } else if (match[3]) {
                nodes.push(
                    <em key={`${keyPrefix}-i-${partIndex}`}>
                        {renderInlineMarkdown(match[4], `${keyPrefix}-i-${partIndex}`)}
                    </em>
                );
            } else if (match[5]) {
                nodes.push(
                    <code key={`${keyPrefix}-c-${partIndex}`}>
                        {match[6]}
                    </code>
                );
            } else if (match[7]) {
                nodes.push(<br key={`${keyPrefix}-br-${partIndex}`} />);
            }

            partIndex += 1;
            lastIndex = pattern.lastIndex;
        }
    } catch (error) {
        console.error('Failed to render markdown inline:', error);
        return [text];
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

// Parse text with keywords and observations into renderable segments
function parseDialogueText(text, keywords = [], observations = []) {
    if ((!keywords || keywords.length === 0) && (!observations || observations.length === 0)) {
        return [{ type: 'text', content: text }];
    }

    const segments = [];
    let remaining = text;

    const tokens = [
        ...(keywords || []).map((keyword) => ({ kind: 'keyword', item: keyword })),
        ...(observations || []).map((observation) => ({ kind: 'observation', item: observation })),
    ];

    const sortedTokens = tokens.sort((a, b) => {
        const posA = text.indexOf(a.item.text);
        const posB = text.indexOf(b.item.text);
        return posA - posB;
    });

    for (const token of sortedTokens) {
        const needle = token.item.text;
        const index = remaining.indexOf(needle);
        if (index === -1) continue;

        if (index > 0) {
            segments.push({ type: 'text', content: remaining.slice(0, index) });
        }

        if (token.kind === 'keyword') {
            segments.push({ type: 'keyword', keyword: token.item, content: needle });
        } else {
            segments.push({ type: 'observation', observation: token.item, content: needle });
        }

        remaining = remaining.slice(index + needle.length);
    }

    if (remaining) {
        segments.push({ type: 'text', content: remaining });
    }

    return segments;
}

function FloatingDialogue({
    patientId,
    turn,
    onKeywordCollected,
    onDialogueEnd,
    fallbackDialogue = []
}) {
    const { gameState, actions } = useGame();
    const dialogueState = useDialogue(gameState, actions);

    const {
        currentSpeech,
        loadDialogue,
        startBlock,
        advance,
    } = dialogueState;

    // Local state
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typewriterSpeed, setTypewriterSpeed] = useState(30);
    const [collectedKeywords, setCollectedKeywords] = useState(new Set());
    const [collectedObservations, setCollectedObservations] = useState(new Set());
    const [isLoaded, setIsLoaded] = useState(false);
    const [useFallback, setUseFallback] = useState(false);
    const [fallbackIndex, setFallbackIndex] = useState(0);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, keyword: null });

    const typingRef = useRef(null);
    const loadedRef = useRef(false);

    // Load SYNS dialogue on mount or when turn changes
    useEffect(() => {
        if (loadedRef.current) return;

        async function loadSynsDialogue() {
            try {
                const forceReload = import.meta.env?.DEV ?? false;
                const source = await loadPatientDialogue(patientId, turn, forceReload);
                if (source) {
                    loadDialogue(source);
                    setIsLoaded(true);
                    setUseFallback(false);
                    loadedRef.current = true;
                    startBlock('START');
                } else {
                    setUseFallback(true);
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Error loading dialogue:', error);
                setUseFallback(true);
                setIsLoaded(true);
            }
        }

        if (patientId && turn) {
            loadSynsDialogue();
        }

        return () => {
            loadedRef.current = false;
        };
    }, [patientId, turn]);

    // Get current display content
    const currentContent = useMemo(() => {
        if (useFallback) {
            return fallbackDialogue[fallbackIndex] || null;
        }
        return currentSpeech;
    }, [useFallback, fallbackDialogue, fallbackIndex, currentSpeech]);

    const sanitizedContentText = useMemo(
        () => sanitizeDialogueText(currentContent?.text || ''),
        [currentContent?.text]
    );

    const finishTyping = useCallback(() => {
        if (typingRef.current) clearInterval(typingRef.current);
        setDisplayedText(sanitizedContentText || '');
        setIsTyping(false);
    }, [sanitizedContentText]);

    // Expose debug controls for dev console
    useEffect(() => {
        const api = window.__synsDialogueDebug || {};
        api.setTypewriterSpeed = (ms) => {
            const parsed = Number(ms);
            if (!Number.isFinite(parsed) || parsed <= 0) return false;
            setTypewriterSpeed(parsed);
            return true;
        };
        api.getTypewriterSpeed = () => typewriterSpeed;
        api.skipTypewriter = () => finishTyping();
        api.logState = () => ({
            isTyping,
            displayedText,
            fullText: sanitizedContentText,
            hasCurrentContent: Boolean(currentContent),
            speaker: currentContent?.speaker,
            keywords: currentContent?.keywords?.length || 0,
            fallback: useFallback,
            fallbackIndex,
            patientId,
            turn,
        });
        api.loadRawDialogue = async (rawText) => {
            if (!rawText || typeof rawText !== 'string') return false;
            try {
                loadDialogue(rawText);
                setUseFallback(false);
                setFallbackIndex(0);
                setIsLoaded(true);
                loadedRef.current = true;
                startBlock('START');
                return true;
            } catch (error) {
                console.error('Failed to load raw dialogue', error);
                return false;
            }
        };
        api.loadSession = async (id, sessionTurn, forceReload = false) => {
            try {
                const source = await loadPatientDialogue(id, sessionTurn, forceReload);
                if (!source) return false;
                loadDialogue(source);
                setUseFallback(false);
                setFallbackIndex(0);
                setIsLoaded(true);
                loadedRef.current = true;
                startBlock('START');
                return true;
            } catch (error) {
                console.error('Failed to load session dialogue', error);
                return false;
            }
        };
        window.__synsDialogueDebug = api;
        return () => {
            // Do not delete outright to avoid breaking other listeners; just remove our setters
            if (window.__synsDialogueDebug) {
                delete window.__synsDialogueDebug.setTypewriterSpeed;
                delete window.__synsDialogueDebug.getTypewriterSpeed;
                delete window.__synsDialogueDebug.skipTypewriter;
                delete window.__synsDialogueDebug.logState;
                delete window.__synsDialogueDebug.loadRawDialogue;
                delete window.__synsDialogueDebug.loadSession;
            }
        };
    }, [typewriterSpeed, finishTyping, isTyping, displayedText, sanitizedContentText, currentContent, useFallback, fallbackIndex, patientId, turn, loadDialogue, startBlock]);

    // Typewriter effect
    useEffect(() => {
        if (!sanitizedContentText) {
            setDisplayedText('');
            return;
        }

        const fullText = sanitizedContentText;
        setDisplayedText('');
        setIsTyping(true);

        let index = 0;
        const speed = typewriterSpeed;

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
    }, [sanitizedContentText, currentContent?.id, typewriterSpeed]);

    // Handle click to advance dialogue
    const handleClick = useCallback(() => {
        if (isTyping) {
            finishTyping();
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
    }, [isTyping, useFallback, fallbackIndex, fallbackDialogue.length, advance, currentContent, onDialogueEnd, sanitizedContentText, finishTyping]);

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

        if (keyword.contradicts) {
            actions.collectToken(token);
            actions.addToClipboard(token);
        }
    }, [collectedKeywords, onKeywordCollected, actions]);

    const handleObservationClick = useCallback((observation, event) => {
        event?.stopPropagation?.();

        if (collectedObservations.has(observation.id)) return;

        setCollectedObservations((prev) => new Set([...prev, observation.id]));

        const token = {
            id: observation.id,
            type: 'visual',
            content: observation.label || observation.text,
            symptomRef: observation.symptom || observation.symptomRef,
            source: 'observation',
        };

        actions.collectToken(token);
        actions.addToClipboard(token);
    }, [collectedObservations, actions]);

    // Parse text segments
    const textSegments = useMemo(() => {
        if (!sanitizedContentText) return [];
        return parseDialogueText(
            displayedText,
            currentContent?.keywords || [],
            currentContent?.observations || [],
        );
    }, [displayedText, currentContent?.keywords, currentContent?.observations, sanitizedContentText]);

    // Close context menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.keyword-context-menu')) {
                setContextMenu((prev) => prev.show ? { ...prev, show: false } : prev);
            }
        };
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, []);

    const handleKeywordContextMenu = useCallback((keyword, event) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({
            show: true,
            x: event.clientX,
            y: event.clientY,
            keyword,
        });
    }, []);

    const handleContextAction = useCallback((actionId) => {
        const keyword = contextMenu.keyword;
        if (!keyword) return;

        if (actionId === 'collect') {
            if (!collectedKeywords.has(keyword.id)) {
                handleKeywordClick(keyword, new Event('click'));
            }
        }
        if (actionId === 'clipboard') {
            actions.addToClipboard({ id: keyword.id, type: 'text', content: keyword.text });
        }
        if (actionId === 'note') {
            actions.addToClipboard({ id: `${keyword.id}-note`, type: 'text', content: `Note: ${keyword.text}` });
        }
        setContextMenu({ show: false, x: 0, y: 0, keyword: null });
    }, [contextMenu.keyword, collectedKeywords, handleKeywordClick, actions]);

    // Loading state
    if (!isLoaded) {
        return (
            <div className="dialogue-content-container" onClick={handleClick}>
                <div className="dialogue-text">
                    <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Loading...</span>
                </div>
            </div>
        );
    }

    // Empty state
    if (!currentContent) {
        return (
            <div className="dialogue-content-container" onClick={handleClick}>
                <div className="dialogue-text">
                    <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Waiting for patient...</span>
                </div>
            </div>
        );
    }

    const isNarrator = currentContent.speaker === 'NARRATOR';
    const isAction = currentContent.isAction;

    const showClosingQuote = !isTyping || displayedText.length >= sanitizedContentText.length;

    const renderSegment = (segment, idx) => {
        if (segment.type === 'keyword') {
            const keyword = segment.keyword;
            const isCollected = collectedKeywords.has(keyword.id);
            const keywordType = getKeywordType(keyword);

            return (
                <motion.span
                    key={keyword.id || `kw-${idx}`}
                    className={`dialogue-keyword ${isCollected ? 'collected' : 'available'} keyword-type-${keywordType}`}
                    onClick={(e) => handleKeywordClick(keyword, e)}
                    onContextMenu={(e) => handleKeywordContextMenu(keyword, e)}
                    whileHover={!isCollected ? { scale: 1.02 } : undefined}
                    whileTap={!isCollected ? { scale: 0.98 } : undefined}
                >
                    {renderInlineMarkdown(segment.content, `kw-${keyword.id || idx}`)}
                    {!isCollected && <span className="keyword-hint">+</span>}
                </motion.span>
            );
        }

        if (segment.type === 'observation') {
            const observation = segment.observation;
            const isCollected = collectedObservations.has(observation.id);
            return (
                <motion.span
                    key={observation.id || `obs-${idx}`}
                    className={`dialogue-observation ${isCollected ? 'collected' : 'available'}`}
                    onClick={(e) => handleObservationClick(observation, e)}
                    whileHover={!isCollected ? { scale: 1.02 } : undefined}
                    whileTap={!isCollected ? { scale: 0.98 } : undefined}
                >
                    <span className="observation-icon">👁️</span>
                    {renderInlineMarkdown(segment.content, `obs-${observation.id || idx}`)}
                    {!isCollected && <span className="observation-hint">+</span>}
                </motion.span>
            );
        }

        return (
            <span key={`txt-${idx}`}>
                {renderInlineMarkdown(segment.content, `txt-${idx}`)}
            </span>
        );
    };

    return (
        <div className="dialogue-content-container" onClick={handleClick}>
            <div className="dialogue-text">
                {isNarrator || isAction ? (
                    <em className="narration-text">
                        {textSegments.map((segment, idx) => renderSegment(segment, idx))}
                    </em>
                ) : (
                    <>
                        <span className="dialogue-quote">&ldquo;</span>
                        {textSegments.map((segment, idx) => renderSegment(segment, idx))}
                        {showClosingQuote && <span className="dialogue-quote">&rdquo;</span>}
                    </>
                )}
                {isTyping && <span className="typing-cursor">|</span>}
            </div>

            <AnimatePresence>
                {!isTyping && (
                    <motion.div
                        className="continue-hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span>Click to continue</span>
                        <span className="continue-arrow">▶</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {contextMenu.show && contextMenu.keyword && (
                    <motion.div
                        className="keyword-context-menu"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        variants={contextMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="context-menu-header">
                            <span className="context-keyword-text">&ldquo;{contextMenu.keyword.text}&rdquo;</span>
                            <span className={`context-keyword-type type-${getKeywordType(contextMenu.keyword)}`}>
                                {getKeywordType(contextMenu.keyword)}
                            </span>
                        </div>
                        <div className="context-menu-divider" />
                        <ul className="context-menu-list">
                            {!collectedKeywords.has(contextMenu.keyword.id) && (
                                <li>
                                    <button
                                        className="context-menu-item"
                                        onClick={() => handleContextAction('collect')}
                                    >
                                        <span className="menu-icon">📝</span>
                                        <span className="menu-label">Collect token</span>
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    className="context-menu-item"
                                    onClick={() => handleContextAction('clipboard')}
                                >
                                    <span className="menu-icon">📋</span>
                                    <span className="menu-label">Copy text</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="context-menu-item"
                                    onClick={() => handleContextAction('note')}
                                >
                                    <span className="menu-icon">🗒️</span>
                                    <span className="menu-label">Add note</span>
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FloatingDialogue;
