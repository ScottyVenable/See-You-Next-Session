import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../styles/dialogue-box.css';
import '../../styles/keywords/index.css';

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

// Keyword pop-in animation
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

// Context menu animation
const contextMenuVariants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: -5
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.15 }
    }
};

// Helper function to determine keyword type from content/context
function getKeywordType(keyword) {
    // If keyword has explicit category, use it
    if (keyword.category) {
        return keyword.category;
    }

    const text = keyword.text.toLowerCase();

    // Duration keywords (time-related)
    if (/\b(always|never|constantly|recently|lately|sometimes|often|weeks?|months?|years?|days?|hours?|morning|night|every|since|ago)\b/.test(text)) {
        return 'time';
    }

    // Intensity keywords (severity/degree)
    if (/\b(very|extremely|slightly|barely|completely|totally|really|so much|a lot|intense|severe|mild|terrible|awful|overwhelming)\b/.test(text)) {
        return 'intensity';
    }

    // Behavior keywords (actions/habits)
    if (/\b(can't|cannot|won't|don't|avoid|stop|keep|started|trying|habit|feel|feeling|sleep|eat|work|focus|concentrate)\b/.test(text)) {
        return 'behavior';
    }

    // Emotion keywords
    if (/\b(worried|anxious|scared|afraid|happy|sad|angry|frustrated|nervous|stressed|depressed|hopeless|hopeful)\b/.test(text)) {
        return 'emotion';
    }

    // Background keywords (personal info)
    if (/\b(job|work|family|relationship|friend|home|school|money|health|breakup|divorce|loss|death)\b/.test(text)) {
        return 'background';
    }

    // If keyword has contradicts property, it's a contradiction type
    if (keyword.contradicts) {
        return 'contradiction';
    }

    // Default to general
    return 'generic';
}

// Helper function to build keyword CSS classes
function getKeywordClasses(keyword, isCollected, keywordType) {
    const classes = ['keyword', 'dialogue-keyword'];

    // Collection state
    classes.push(isCollected ? 'collected' : 'available');

    // Category class
    classes.push(`keyword-category-${keywordType}`);

    // Importance class
    if (keyword.importance) {
        classes.push(`keyword-importance-${keyword.importance}`);
    }

    // Custom CSS class from style preset (e.g., 'behavior.red')
    if (keyword.style?.cssClass) {
        const parts = keyword.style.cssClass.split('.');
        if (parts.length === 2) {
            classes.push(`keyword-style-${parts[0]}-${parts[1]}`);
        }
    }

    // Animation class
    if (keyword.style?.animation || keyword.style?.animationClass) {
        const anim = keyword.style.animationClass || keyword.style.animation;
        if (anim && anim !== 'none') {
            classes.push(`keyword-anim-${anim}`);
        }
    }

    // Special states
    if (keyword.contradicts || keyword.effects?.contradicts?.length > 0) {
        classes.push('contradiction');
    }

    if (keyword.safetyFlag || keyword.safety) {
        classes.push('safety-flag');
    }

    return classes.join(' ');
}

function DialogueBox({
    dialogue,
    onKeywordCollected,
    onAskAbout,
    onHighlightInHandbook,
    onExploreBackground,
    isFocusMode = false,
    patientName = 'Patient'
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [collectedKeywords, setCollectedKeywords] = useState(new Set());
    const [showMoodTooltip, setShowMoodTooltip] = useState(false);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, keyword: null });
    const [animatedKeywords, setAnimatedKeywords] = useState(new Set());
    const dialogueRef = useRef(null);

    const currentDialogue = dialogue[currentIndex];
    const totalKeywords = currentDialogue?.keywords?.length || 0;
    const collectedCount = currentDialogue?.keywords?.filter(k => collectedKeywords.has(k.id)).length || 0;

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenu.show && !e.target.closest('.keyword-context-menu')) {
                setContextMenu({ show: false, x: 0, y: 0, keyword: null });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu.show]);

    // Reset index when dialogue changes (new turn)
    useEffect(() => {
        setCurrentIndex(0);
        setCollectedKeywords(new Set());
        setAnimatedKeywords(new Set());
    }, [dialogue]);

    // Typewriter effect - processes text to hide brackets during animation
    useEffect(() => {
        if (!currentDialogue) return;

        setIsTyping(true);
        setDisplayedText('');

        const fullText = currentDialogue.text;
        // Create display text without brackets for clean typing animation
        // We'll add brackets back when rendering to identify keywords
        const displayVersion = fullText;
        let index = 0;

        // Calculate visible character positions (skip bracket characters during typing)
        const visibleChars = [];
        let inBracket = false;
        let bracketStart = -1;

        for (let i = 0; i < fullText.length; i++) {
            if (fullText[i] === '[') {
                inBracket = true;
                bracketStart = i;
            } else if (fullText[i] === ']') {
                inBracket = false;
                // Add the keyword content (was inside brackets)
                visibleChars.push({ end: i + 1, isBracketEnd: true });
            } else if (!inBracket || fullText[i] !== '[') {
                visibleChars.push({ end: i + 1, isBracketEnd: false });
            }
        }

        const typeInterval = setInterval(() => {
            if (index < fullText.length) {
                // Find next non-bracket stopping point
                let nextEnd = index + 1;

                // Skip opening brackets entirely
                while (nextEnd < fullText.length && fullText[nextEnd - 1] === '[') {
                    nextEnd++;
                }

                // If we're inside brackets, continue until we hit the closing bracket
                let depth = 0;
                for (let i = 0; i < nextEnd; i++) {
                    if (fullText[i] === '[') depth++;
                    if (fullText[i] === ']') depth--;
                }

                // If we're in a bracket, fast-forward to include the whole keyword
                if (depth > 0) {
                    while (nextEnd < fullText.length && fullText[nextEnd] !== ']') {
                        nextEnd++;
                    }
                    if (nextEnd < fullText.length) nextEnd++; // Include the ]
                }

                setDisplayedText(fullText.substring(0, nextEnd));
                index = nextEnd;
            } else {
                setIsTyping(false);
                clearInterval(typeInterval);
            }
        }, 25); // Slightly faster typing speed

        return () => clearInterval(typeInterval);
    }, [currentDialogue]);

    const handleAdvance = () => {
        if (isTyping) {
            // Skip typing animation
            setDisplayedText(currentDialogue.text);
            setIsTyping(false);
        } else if (currentIndex < dialogue.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleKeywordClick = useCallback((keyword, e) => {
        if (collectedKeywords.has(keyword.id)) return;
        e.stopPropagation();
        setCollectedKeywords(prev => new Set([...prev, keyword.id]));
        onKeywordCollected(keyword);
        // Close context menu if open
        setContextMenu({ show: false, x: 0, y: 0, keyword: null });
    }, [collectedKeywords, onKeywordCollected]);

    // Handle right-click context menu
    const handleKeywordRightClick = useCallback((e, keyword) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = dialogueRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setContextMenu({
            show: true,
            x,
            y,
            keyword
        });
    }, []);

    // Context menu actions
    const handleContextMenuAction = useCallback((action, keyword) => {
        switch (action) {
            case 'collect':
                if (!collectedKeywords.has(keyword.id)) {
                    setCollectedKeywords(prev => new Set([...prev, keyword.id]));
                    onKeywordCollected(keyword);
                }
                break;
            case 'highlight':
                if (onHighlightInHandbook) {
                    onHighlightInHandbook(keyword);
                } else {
                    console.log('Highlight in handbook:', keyword.text);
                }
                break;
            case 'ask':
                if (onAskAbout) {
                    onAskAbout(keyword);
                } else {
                    console.log('Ask about:', keyword.text);
                }
                break;
            case 'explore':
                if (onExploreBackground) {
                    onExploreBackground(keyword);
                } else {
                    console.log('Explore further:', keyword.text);
                }
                break;
            default:
                break;
        }
        setContextMenu({ show: false, x: 0, y: 0, keyword: null });
    }, [collectedKeywords, onKeywordCollected, onAskAbout, onHighlightInHandbook, onExploreBackground]);

    // Parse text to highlight keywords
    const renderDialogueText = () => {
        if (!currentDialogue) return null;

        const text = displayedText;
        const keywords = currentDialogue.keywords || [];

        if (keywords.length === 0) {
            return <span>{text}</span>;
        }

        // Build regex pattern from keywords
        const pattern = keywords.map(k =>
            k.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        ).join('|');
        const regex = new RegExp(`\\[(${pattern})\\]`, 'g');

        const parts = [];
        let lastIndex = 0;
        let match;

        // Create a copy for iteration
        const textWithBrackets = text;
        const regexGlobal = new RegExp(`\\[([^\\]]+)\\]`, 'g');

        while ((match = regexGlobal.exec(textWithBrackets)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {textWithBrackets.substring(lastIndex, match.index)}
                    </span>
                );
            }

            // Find the keyword definition
            const keywordText = match[1];
            const keyword = keywords.find(k => k.text === keywordText);

            if (keyword) {
                const isCollected = collectedKeywords.has(keyword.id);
                const keywordType = getKeywordType(keyword);
                const shouldAnimate = !animatedKeywords.has(keyword.id);
                const keywordClasses = getKeywordClasses(keyword, isCollected, keywordType);

                // Mark as animated
                if (shouldAnimate && !isTyping) {
                    setTimeout(() => {
                        setAnimatedKeywords(prev => new Set([...prev, keyword.id]));
                    }, 100);
                }

                // Build inline styles from keyword definition
                const keywordStyle = {};
                if (keyword.style?.color) {
                    keywordStyle['--keyword-color'] = keyword.style.color;
                }
                if (keyword.style?.bgColor) {
                    keywordStyle['--keyword-bg'] = keyword.style.bgColor;
                }

                parts.push(
                    <motion.span
                        key={`keyword-${keyword.id}`}
                        className={keywordClasses}
                        style={keywordStyle}
                        variants={shouldAnimate && !isTyping ? keywordPopVariants : undefined}
                        initial={shouldAnimate && !isTyping ? "hidden" : false}
                        animate="visible"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isCollected) handleKeywordClick(keyword, e);
                        }}
                        onContextMenu={(e) => handleKeywordRightClick(e, keyword)}
                        draggable={isCollected}
                        onDragStart={(e) => {
                            if (!isCollected) return;
                            const token = {
                                id: keyword.id,
                                type: 'text',
                                content: keyword.text,
                                contradicts: keyword.contradicts,
                                relatedSymptom: keyword.relatedSymptom,
                            };
                            e.dataTransfer.setData('application/json', JSON.stringify(token));
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="keyword-type-indicator" />
                        {keywordText}
                        {!isCollected && <span className="keyword-hint">+</span>}
                    </motion.span>
                );
            } else {
                parts.push(
                    <span key={`bracket-${match.index}`}>
                        {keywordText}
                    </span>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < textWithBrackets.length) {
            parts.push(
                <span key={`text-end`}>
                    {textWithBrackets.substring(lastIndex)}
                </span>
            );
        }

        return parts;
    };

    if (!currentDialogue) {
        return (
            <motion.div
                className="dialogue-box empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="empty-dialogue-content">
                    <span className="empty-icon">💭</span>
                    <p>The patient sits quietly, gathering their thoughts...</p>
                </div>
            </motion.div>
        );
    }

    const hasKeywords = totalKeywords > 0;
    const allCollected = collectedCount === totalKeywords && totalKeywords > 0;
    const showClosingQuote = !isTyping || displayedText.length >= (currentDialogue?.text?.length || 0);

    return (
        <motion.div
            ref={dialogueRef}
            className={`dialogue-box ${allCollected ? 'all-collected' : ''}`}
            onClick={handleAdvance}
            key={currentIndex}
            variants={dialogueVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="dialogue-speaker">
                <motion.div
                    className="speaker-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="speaker-avatar">👤</span>
                    <span className="speaker-name">{patientName}</span>
                </motion.div>

                <div className="speaker-meta">
                    <motion.div
                        className={`mood-chip-wrapper ${isFocusMode ? 'focus-active' : ''}`}
                        onMouseEnter={() => setShowMoodTooltip(true)}
                        onMouseLeave={() => setShowMoodTooltip(false)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, type: "spring" }}
                    >
                        <span className={`mood-chip ${currentDialogue.speakerMood}`}>
                            <span className="mood-emoji">{getMoodEmoji(currentDialogue.speakerMood)}</span>
                            <span className="mood-label">{getMoodTag(currentDialogue.speakerMood)}</span>
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
                                    <span className="tooltip-text">{getMoodDescription(currentDialogue.speakerMood, isFocusMode)}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

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

            <div className="dialogue-text">
                <span className="dialogue-quote">&ldquo;</span>
                {renderDialogueText()}
                {isTyping && <span className="typing-cursor">|</span>}
                {showClosingQuote && <span className="dialogue-quote">&rdquo;</span>}
            </div>

            {/* Keyword Context Menu */}
            <AnimatePresence>
                {contextMenu.show && contextMenu.keyword && (
                    <motion.div
                        className="keyword-context-menu"
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                        }}
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
                                        onClick={() => handleContextMenuAction('collect', contextMenu.keyword)}
                                    >
                                        <span className="menu-icon">📝</span>
                                        <span className="menu-label">Create Text Token</span>
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    className="context-menu-item"
                                    onClick={() => handleContextMenuAction('ask', contextMenu.keyword)}
                                >
                                    <span className="menu-icon">💬</span>
                                    <span className="menu-label">Ask About This</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="context-menu-item"
                                    onClick={() => handleContextMenuAction('highlight', contextMenu.keyword)}
                                >
                                    <span className="menu-icon">📖</span>
                                    <span className="menu-label">Highlight in Handbook</span>
                                </button>
                            </li>
                            {getKeywordType(contextMenu.keyword) === 'background' && (
                                <li>
                                    <button
                                        className="context-menu-item"
                                        onClick={() => handleContextMenuAction('explore', contextMenu.keyword)}
                                    >
                                        <span className="menu-icon">🔍</span>
                                        <span className="menu-label">Explore Further</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {hasKeywords && !allCollected && !isTyping && (
                <motion.div
                    className="keyword-hint-bar"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="hint-icon">💡</span>
                    <span className="hint-text">Click highlighted words to collect them as evidence</span>
                </motion.div>
            )}

            <motion.div
                className="dialogue-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="progress-dots">
                    {dialogue.map((_, idx) => (
                        <span
                            key={idx}
                            className={`progress-dot ${idx === currentIndex ? 'active' : ''} ${idx < currentIndex ? 'passed' : ''}`}
                        />
                    ))}
                </div>
                <AnimatePresence>
                    {!isTyping && currentIndex < dialogue.length - 1 && (
                        <motion.span
                            className="continue-hint"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { repeat: Infinity, duration: 1.5 },
                                x: { duration: 0.2 }
                            }}
                        >
                            Continue <span className="continue-arrow">→</span>
                        </motion.span>
                    )}
                    {!isTyping && currentIndex === dialogue.length - 1 && (
                        <motion.span
                            className="end-hint"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            End of dialogue
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

function getMoodEmoji(mood) {
    const moods = {
        nervous: '😰',
        anxious: '😟',
        defensive: '😤',
        stressed: '😣',
        frustrated: '😠',
        dismissive: '🙄',
        sad: '😢',
        vulnerable: '🥺',
        hopeful: '🙂',
        relieved: '😌',
        neutral: '😐',
    };
    return moods[mood] || moods.neutral;
}

// Get detailed mood description - changes based on focus mode
function getMoodDescription(mood, isFocusMode) {
    const casualDescriptions = {
        nervous: 'Seems a bit on edge',
        anxious: 'Looks worried',
        defensive: 'Getting defensive',
        stressed: 'Under pressure',
        frustrated: 'Showing frustration',
        dismissive: 'Being dismissive',
        sad: 'Appears sad',
        vulnerable: 'Opening up',
        hopeful: 'Showing hope',
        relieved: 'Seems relieved',
        neutral: 'Neutral expression',
    };

    const clinicalDescriptions = {
        nervous: 'Exhibits signs of acute nervousness: fidgeting, avoiding eye contact',
        anxious: 'Displays anxious behavior: rapid speech, tension in shoulders',
        defensive: 'Defensive posture observed: crossed arms, guarded responses',
        stressed: 'Physical stress markers: tight jaw, shallow breathing',
        frustrated: 'Frustration evident: furrowed brow, clipped tone',
        dismissive: 'Minimizing behavior: eye rolling, deflection',
        sad: 'Depressive presentation: downcast eyes, slowed speech',
        vulnerable: 'Emotional openness emerging: softened voice, seeking connection',
        hopeful: 'Positive affect: lifted expression, forward engagement',
        relieved: 'Visible relief: relaxed posture, deeper breathing',
        neutral: 'Flat affect: minimal emotional expression',
    };

    return isFocusMode
        ? clinicalDescriptions[mood] || clinicalDescriptions.neutral
        : casualDescriptions[mood] || casualDescriptions.neutral;
}

// Short tag for mood - shown in focus mode
function getMoodTag(mood) {
    const tags = {
        nervous: 'Nervous',
        anxious: 'Anxious',
        defensive: 'Defensive',
        stressed: 'Stressed',
        frustrated: 'Frustrated',
        dismissive: 'Dismissive',
        sad: 'Sad',
        vulnerable: 'Vulnerable',
        hopeful: 'Hopeful',
        relieved: 'Relieved',
        neutral: 'Neutral',
    };
    return tags[mood] || tags.neutral;
}

export default DialogueBox;
