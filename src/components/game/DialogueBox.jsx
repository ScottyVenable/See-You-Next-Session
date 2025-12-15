import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const tooltipVariants = {
    hidden: { opacity: 0, y: 5, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
    }
};

function DialogueBox({ dialogue, onKeywordCollected, isFocusMode = false }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [collectedKeywords, setCollectedKeywords] = useState(new Set());
    const [showMoodTooltip, setShowMoodTooltip] = useState(false);

    const currentDialogue = dialogue[currentIndex];

    // Reset index when dialogue changes (new turn)
    useEffect(() => {
        setCurrentIndex(0);
        setCollectedKeywords(new Set());
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
        }, 30); // Typing speed

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

    const handleKeywordClick = useCallback((keyword) => {
        if (collectedKeywords.has(keyword.id)) return;

        setCollectedKeywords(prev => new Set([...prev, keyword.id]));
        onKeywordCollected(keyword);
    }, [collectedKeywords, onKeywordCollected]);

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
                parts.push(
                    <span
                        key={`keyword-${keyword.id}`}
                        className={`dialogue-keyword ${isCollected ? 'collected' : 'available'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isCollected) handleKeywordClick(keyword);
                        }}
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
                    >
                        {keywordText}
                        {!isCollected && <span className="keyword-hint">+</span>}
                    </span>
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
                <p>The patient sits quietly...</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="dialogue-box"
            onClick={handleAdvance}
            key={currentIndex}
            variants={dialogueVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="dialogue-speaker">
                <motion.span
                    className="speaker-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Patient
                </motion.span>
                <motion.div
                    className={`mood-chip-wrapper ${isFocusMode ? 'focus-active' : ''}`}
                    onMouseEnter={() => setShowMoodTooltip(true)}
                    onMouseLeave={() => setShowMoodTooltip(false)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, type: "spring" }}
                >
                    <span className={`mood-chip ${currentDialogue.speakerMood}`}>
                        Appears {getMoodTag(currentDialogue.speakerMood).toLowerCase()}
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
                                {getMoodDescription(currentDialogue.speakerMood, isFocusMode)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <div className="dialogue-text">
                {renderDialogueText()}
                {isTyping && <span className="typing-cursor">|</span>}
            </div>

            <motion.div
                className="dialogue-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <span className="dialogue-progress">
                    {currentIndex + 1} / {dialogue.length}
                </span>
                <AnimatePresence>
                    {!isTyping && currentIndex < dialogue.length - 1 && (
                        <motion.span
                            className="continue-hint"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            Click to continue ▶
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
