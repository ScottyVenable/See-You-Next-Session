import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../styles/clipboard.css';

// Animation variants
const tokenVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        x: 20,
        scale: 0.9,
        transition: { duration: 0.2 }
    }
};

const slotVariants = {
    empty: { scale: 1 },
    dragOver: {
        scale: 1.02,
        borderColor: "var(--color-accent)",
        transition: { type: "spring", stiffness: 400 }
    },
    filled: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
    }
};

const resultVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 }
    }
};

const panelVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 }
    }
};

function Clipboard({
    tokens,
    onRemoveToken,
    onDragStart,
    onDragEnd,
    // Synthesis props
    onSynthesisAttempt,
    clipboardTokens,
    showTutorialHint = false
}) {
    const [draggingId, setDraggingId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Synthesis state
    const [textSlot, setTextSlot] = useState(null);
    const [visualSlot, setVisualSlot] = useState(null);
    const [synthesisResult, setSynthesisResult] = useState(null);
    const [textSlotDragOver, setTextSlotDragOver] = useState(false);
    const [visualSlotDragOver, setVisualSlotDragOver] = useState(false);

    const textTokens = tokens.filter(t => t.type === 'text');
    const visualTokens = tokens.filter(t => t.type === 'visual');
    const totalTokens = tokens.length;

    const handleDragStartToken = (e, token) => {
        e.stopPropagation();
        setDraggingId(token.id);
        e.dataTransfer.setData('application/json', JSON.stringify(token));
        e.dataTransfer.effectAllowed = 'copy';

        const dragElement = e.target.cloneNode(true);
        dragElement.style.position = 'absolute';
        dragElement.style.top = '-1000px';
        document.body.appendChild(dragElement);
        e.dataTransfer.setDragImage(dragElement, 0, 0);
        setTimeout(() => document.body.removeChild(dragElement), 0);

        if (onDragStart) onDragStart(token);
    };

    const handleDragEndToken = () => {
        setDraggingId(null);
        if (onDragEnd) onDragEnd();
    };

    // Synthesis handlers
    const handleSlotDrop = (e, slotType) => {
        e.preventDefault();
        setTextSlotDragOver(false);
        setVisualSlotDragOver(false);

        try {
            const token = JSON.parse(e.dataTransfer.getData('application/json'));
            if (slotType === 'text' && token.type === 'text') {
                setTextSlot(token);
                setSynthesisResult(null);
            } else if (slotType === 'visual' && token.type === 'visual') {
                setVisualSlot(token);
                setSynthesisResult(null);
            }
        } catch (err) {
            console.error('Drop parse error:', err);
        }
    };

    const handleSynthesize = () => {
        if (!textSlot || !visualSlot) return;

        // Check if they form a valid contradiction
        const isContradiction = textSlot.contradicts === true &&
            textSlot.relatedSymptom === visualSlot.symptomRef;

        setSynthesisResult(isContradiction ? 'success' : 'failure');

        if (onSynthesisAttempt) {
            onSynthesisAttempt(textSlot, visualSlot, isContradiction);
        }

        // Clear after showing result
        setTimeout(() => {
            if (isContradiction) {
                setTextSlot(null);
                setVisualSlot(null);
            }
            setSynthesisResult(null);
        }, isContradiction ? 2000 : 1500);
    };

    const handleClearSlots = () => {
        setTextSlot(null);
        setVisualSlot(null);
        setSynthesisResult(null);
    };

    const canSynthesize = textSlot && visualSlot && !synthesisResult;

    // Render synthesis section (used in both compact and expanded views)
    const renderSynthesisSection = (isExpandedView = false) => (
        <motion.div
            className={`synthesis-section ${isExpandedView ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="synthesis-header">
                <span className="synthesis-icon">⚗️</span>
                <span className="synthesis-title">Synthesis</span>
                <span className="synthesis-hint">Combine evidence to find contradictions</span>
            </div>

            <div className="synthesis-slots-inline">
                {/* Text Slot */}
                <motion.div
                    className={`synthesis-slot-inline ${textSlot ? 'filled text' : 'empty'} ${textSlotDragOver ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setTextSlotDragOver(true); }}
                    onDragLeave={() => setTextSlotDragOver(false)}
                    onDrop={(e) => handleSlotDrop(e, 'text')}
                    variants={slotVariants}
                    animate={textSlotDragOver ? 'dragOver' : textSlot ? 'filled' : 'empty'}
                >
                    <AnimatePresence mode="wait">
                        {textSlot ? (
                            <motion.div
                                key="filled"
                                className="slot-filled-content"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <span className="slot-type-indicator text">💬</span>
                                <span className="slot-content" title={textSlot.content}>"{textSlot.content}"</span>
                                <motion.button
                                    className="clear-slot"
                                    onClick={() => setTextSlot(null)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Remove"
                                >
                                    ×
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                className="slot-empty-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="slot-drop-icon">📝</span>
                                <span className="slot-placeholder">Drop Statement</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="synthesis-connector">
                    <span className="connector-icon">+</span>
                </div>

                {/* Visual Slot */}
                <motion.div
                    className={`synthesis-slot-inline ${visualSlot ? 'filled visual' : 'empty'} ${visualSlotDragOver ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setVisualSlotDragOver(true); }}
                    onDragLeave={() => setVisualSlotDragOver(false)}
                    onDrop={(e) => handleSlotDrop(e, 'visual')}
                    variants={slotVariants}
                    animate={visualSlotDragOver ? 'dragOver' : visualSlot ? 'filled' : 'empty'}
                >
                    <AnimatePresence mode="wait">
                        {visualSlot ? (
                            <motion.div
                                key="filled"
                                className="slot-filled-content"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <span className="slot-type-indicator visual">👁️</span>
                                <span className="slot-content" title={visualSlot.content}>{visualSlot.content}</span>
                                <motion.button
                                    className="clear-slot"
                                    onClick={() => setVisualSlot(null)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Remove"
                                >
                                    ×
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                className="slot-empty-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="slot-drop-icon">🔍</span>
                                <span className="slot-placeholder">Drop Observation</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Synthesis Actions */}
            <div className="synthesis-actions-inline">
                <motion.button
                    className={`analyze-btn ${canSynthesize ? 'ready' : ''}`}
                    onClick={handleSynthesize}
                    disabled={!canSynthesize}
                    whileHover={canSynthesize ? { scale: 1.02, y: -1 } : {}}
                    whileTap={canSynthesize ? { scale: 0.98 } : {}}
                >
                    <span className="analyze-icon">✨</span>
                    <span className="analyze-text">Analyze</span>
                </motion.button>
                <AnimatePresence>
                    {(textSlot || visualSlot) && (
                        <motion.button
                            className="clear-all-btn"
                            onClick={handleClearSlots}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Clear
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Result */}
            <AnimatePresence>
                {synthesisResult && (
                    <motion.div
                        className={`synthesis-result-inline ${synthesisResult}`}
                        variants={resultVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {synthesisResult === 'success' ? (
                            <>
                                <motion.span
                                    className="result-icon"
                                    initial={{ rotate: -180, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", delay: 0.1 }}
                                >
                                    💡
                                </motion.span>
                                <span className="result-text">Contradiction discovered!</span>
                            </>
                        ) : (
                            <>
                                <motion.span
                                    className="result-icon"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    🤔
                                </motion.span>
                                <span className="result-text">No connection found. Try another combination.</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <>
            {/* Tutorial Hint */}
            <AnimatePresence>
                {showTutorialHint && (
                    <motion.div
                        className="clipboard-tutorial-hint"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <span className="hint-icon">💡</span>
                        <span>Click highlighted text in dialogue to collect evidence</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Expanded Panel (takes full workstation space) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="clipboard-expanded-panel"
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="clipboard-expanded-header">
                            <h3>📋 Clipboard & Synthesis</h3>
                            <motion.button
                                className="collapse-btn"
                                onClick={() => setIsExpanded(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Collapse ▼
                            </motion.button>
                        </div>

                        <div className="clipboard-expanded-body">
                            {/* Token Sections Side by Side */}
                            <div className="token-columns">
                                <div className="token-column">
                                    <h4>💬 Statements ({textTokens.length})</h4>
                                    <div className="token-list-expanded">
                                        {textTokens.length === 0 ? (
                                            <p className="empty-hint">Click highlighted dialogue to collect</p>
                                        ) : (
                                            <AnimatePresence>
                                                {textTokens.map((token, index) => (
                                                    <motion.div
                                                        key={token.id}
                                                        className={`token-expanded text-token ${draggingId === token.id ? 'dragging' : ''}`}
                                                        draggable={true}
                                                        onDragStart={(e) => handleDragStartToken(e, token)}
                                                        onDragEnd={handleDragEndToken}
                                                        variants={tokenVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        layout
                                                        whileHover={{ x: 4 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <span className="token-icon">📝</span>
                                                        <span className="token-content-expanded">"{token.content}"</span>
                                                        {token.contradicts && <span className="token-badge">!</span>}
                                                        <motion.button
                                                            className="remove-token"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRemoveToken(token.id);
                                                            }}
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            ×
                                                        </motion.button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </div>

                                <div className="token-column">
                                    <h4>👁️ Observations ({visualTokens.length})</h4>
                                    <div className="token-list-expanded">
                                        {visualTokens.length === 0 ? (
                                            <p className="empty-hint">Use Focus Mode to observe the patient</p>
                                        ) : (
                                            <AnimatePresence>
                                                {visualTokens.map((token, index) => (
                                                    <motion.div
                                                        key={token.id}
                                                        className={`token-expanded visual-token ${draggingId === token.id ? 'dragging' : ''}`}
                                                        draggable={true}
                                                        onDragStart={(e) => handleDragStartToken(e, token)}
                                                        onDragEnd={handleDragEndToken}
                                                        variants={tokenVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        layout
                                                        whileHover={{ x: 4 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <span className="token-icon">🔍</span>
                                                        <span className="token-content-expanded">{token.content}</span>
                                                        <motion.button
                                                            className="remove-token"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onRemoveToken(token.id);
                                                            }}
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            ×
                                                        </motion.button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Synthesis Section in Expanded View */}
                            {renderSynthesisSection(true)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Compact Clipboard */}
            <AnimatePresence>
                {!isExpanded && (
                    <motion.div
                        className={`clipboard ${totalTokens > 4 ? 'has-many' : ''}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="clipboard-header">
                            <h3 className="clipboard-title">📋 Clipboard</h3>
                            <motion.button
                                className="expand-btn"
                                onClick={() => setIsExpanded(true)}
                                title="Expand clipboard"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ⛶
                            </motion.button>
                        </div>

                        <div className="token-section">
                            <h4>💬 Statements</h4>
                            <div className="token-list text-tokens">
                                {textTokens.length === 0 ? (
                                    <p className="empty-hint">Click dialogue keywords</p>
                                ) : (
                                    <AnimatePresence>
                                        {textTokens.map((token, index) => (
                                            <motion.div
                                                key={token.id}
                                                className={`token text-token ${draggingId === token.id ? 'dragging' : ''}`}
                                                draggable={true}
                                                onDragStart={(e) => handleDragStartToken(e, token)}
                                                onDragEnd={handleDragEndToken}
                                                variants={tokenVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                whileHover={{ scale: 1.02, x: 3 }}
                                            >
                                                <span className="token-icon">📝</span>
                                                <span className="token-content">"{token.content}"</span>
                                                <motion.button
                                                    className="remove-token"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveToken(token.id);
                                                    }}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    ×
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        <div className="token-section">
                            <h4>👁️ Observations</h4>
                            <div className="token-list visual-tokens">
                                {visualTokens.length === 0 ? (
                                    <p className="empty-hint">Use Focus Mode</p>
                                ) : (
                                    <AnimatePresence>
                                        {visualTokens.map((token, index) => (
                                            <motion.div
                                                key={token.id}
                                                className={`token visual-token ${draggingId === token.id ? 'dragging' : ''}`}
                                                draggable={true}
                                                onDragStart={(e) => handleDragStartToken(e, token)}
                                                onDragEnd={handleDragEndToken}
                                                variants={tokenVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                whileHover={{ scale: 1.02, x: 3 }}
                                            >
                                                <span className="token-icon">🔍</span>
                                                <span className="token-content">{token.content}</span>
                                                <motion.button
                                                    className="remove-token"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveToken(token.id);
                                                    }}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    ×
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        {/* Integrated Synthesis Section */}
                        {renderSynthesisSection(false)}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Clipboard;
