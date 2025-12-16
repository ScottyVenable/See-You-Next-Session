import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import PatientView from '../game/PatientView.jsx';
import DialogueBox from '../game/DialogueBox.jsx';
import DialogueRadial from '../game/DialogueRadial.jsx';
import Clipboard from '../game/Clipboard.jsx';
import FocusMeter from '../game/FocusMeter.jsx';
import TurnClock from '../game/TurnClock.jsx';
import Handbook from '../game/Handbook.jsx';
import '../../styles/game-screen.css';

function GameScreen() {
    const { gameState, actions } = useGame();
    const [isHandbookOpen, setIsHandbookOpen] = useState(false);
    const [draggedToken, setDraggedToken] = useState(null);
    const [breakthroughDialogue, setBreakthroughDialogue] = useState(null);
    const [showTutorialHint, setShowTutorialHint] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const { currentPatient, currentTurn, focus, isFocusMode } = gameState;

    // Handle dialogue prompt selection from radial menu
    const handleSelectPrompt = useCallback((prompt) => {
        setSelectedPrompt(prompt);
        console.log('Selected dialogue prompt:', prompt);
        // TODO: Integrate with dialogue system to generate response
        // This could trigger a new dialogue entry or advance conversation
    }, []);

    if (!currentPatient) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <span className="loading-text">Preparing session...</span>
            </div>
        );
    }

    // Get current phase dialogue + any unlocked breakthrough dialogue
    const currentPhase = currentPatient.phases.find(p => p.turn === currentTurn);

    // Find breakthrough dialogue for a given text/visual pair
    const findBreakthroughDialogue = (textTokenId, visualSymptomId) => {
        if (!currentPatient.breakthroughDialogue) return null;

        for (const [key, btData] of Object.entries(currentPatient.breakthroughDialogue)) {
            if (btData.triggerContradiction.textKeyword === textTokenId &&
                btData.triggerContradiction.visualSymptom === visualSymptomId) {
                return { key, ...btData };
            }
        }
        return null;
    };

    const handleDragStart = useCallback((token) => {
        setDraggedToken(token);
        setShowTutorialHint(false);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedToken(null);
    }, []);

    const handleEndTurn = () => {
        if (currentTurn >= gameState.maxTurns) {
            actions.endSession();
        } else {
            actions.advanceTurn();
        }
    };

    const handleBreakthroughClose = () => {
        setBreakthroughDialogue(null);
    };

    // Calculate session progress
    const sessionProgress = (currentTurn / gameState.maxTurns) * 100;
    const breakthroughCount = gameState.breakthroughs?.length || 0;

    return (
        <div className={`game-screen ${isFocusMode ? 'focus-mode' : ''}`}>
            {/* Focus Mode Overlay with enhanced effect */}
            <AnimatePresence>
                {isFocusMode && (
                    <motion.div
                        className="focus-vignette"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </AnimatePresence>

            {/* Session Progress Bar (top) */}
            <div className="session-progress-bar">
                <motion.div
                    className="session-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${sessionProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Main Game Area */}
            <div className="game-layout">
                {/* Left Panel: Patient */}
                <motion.div
                    className="patient-panel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="panel-header">
                        <span className="panel-icon">👤</span>
                        <h2 className="panel-title">{currentPatient.name || 'Patient'}</h2>
                    </div>
                    <PatientView
                        patient={currentPatient}
                        isFocusMode={isFocusMode}
                        onSymptomFound={(symptomId) => {
                            actions.revealSymptom(symptomId);
                        }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                </motion.div>

                {/* Center Panel: Dialogue */}
                <motion.div
                    className="dialogue-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <DialogueBox
                        dialogue={currentPhase?.dialogue || []}
                        isFocusMode={isFocusMode}
                        patientName={currentPatient.name}
                        onKeywordCollected={(keyword) => {
                            const token = {
                                id: keyword.id,
                                type: 'text',
                                content: keyword.text,
                                contradicts: keyword.contradicts,
                                relatedSymptom: keyword.relatedSymptom,
                            };
                            actions.collectToken(token);
                            actions.addToClipboard(token);
                            setShowTutorialHint(false);
                        }}
                    />

                    <DialogueRadial
                        onSelectPrompt={handleSelectPrompt}
                        disabledTopics={[]}
                    />

                    <div className="turn-controls">
                        <div className="turn-info-inline">
                            <span className="turn-label-inline">Session Progress</span>
                            <div className="turn-dots">
                                {Array.from({ length: gameState.maxTurns }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`turn-dot ${i < currentTurn ? 'completed' : ''} ${i === currentTurn - 1 ? 'current' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <motion.button
                            className="end-turn-btn"
                            onClick={handleEndTurn}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="btn-text">
                                {currentTurn >= gameState.maxTurns ? 'Complete Session' : 'Next Topic'}
                            </span>
                            <span className="btn-icon">→</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Right Panel: Workstation */}
                <motion.div
                    className="workstation-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <div className="workstation-header">
                        <TurnClock
                            currentTurn={currentTurn}
                            maxTurns={gameState.maxTurns}
                        />
                    </div>

                    <FocusMeter
                        current={focus}
                        max={gameState.maxFocus}
                        onToggleFocus={actions.toggleFocusMode}
                        isFocusMode={isFocusMode}
                    />

                    <Clipboard
                        tokens={gameState.clipboardTokens}
                        onRemoveToken={actions.removeFromClipboard}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        clipboardTokens={gameState.clipboardTokens}
                        showTutorialHint={showTutorialHint && gameState.clipboardTokens.length === 0}
                        onSynthesisAttempt={(textToken, visualToken, isSuccess) => {
                            if (isSuccess) {
                                // Successful breakthrough!
                                actions.recordBreakthrough({
                                    textToken: textToken.id,
                                    visualToken: visualToken.id,
                                    timestamp: Date.now(),
                                });
                                actions.restoreFocus(40);

                                // Find and show breakthrough dialogue
                                const btDialogue = findBreakthroughDialogue(textToken.id, visualToken.symptomRef);
                                if (btDialogue) {
                                    actions.unlockDialogue(btDialogue.key);
                                    setBreakthroughDialogue(btDialogue);
                                }
                            } else {
                                // Failed match - penalize focus
                                actions.spendFocus(10);
                            }
                        }}
                    />

                    <motion.button
                        className="handbook-btn"
                        onClick={() => setIsHandbookOpen(true)}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="handbook-icon">📖</span>
                        <span className="handbook-text">Handbook</span>
                        <span className="handbook-shortcut">H</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Handbook Modal */}
            <AnimatePresence>
                {isHandbookOpen && (
                    <Handbook
                        onClose={() => setIsHandbookOpen(false)}
                        onTokenDrop={(disorderId) => {
                            // Handle dragging tokens to handbook entries
                            if (draggedToken) {
                                console.log(`Testing ${draggedToken.id} against ${disorderId}`);
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Breakthrough Dialogue Modal */}
            <AnimatePresence>
                {breakthroughDialogue && (
                    <motion.div
                        className="breakthrough-overlay"
                        onClick={handleBreakthroughClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="breakthrough-modal"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -10 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        >
                            <div className="breakthrough-particles">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="particle"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 1.5],
                                            x: Math.random() * 100 - 50,
                                            y: Math.random() * -80 - 20
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.1,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="breakthrough-header">
                                <motion.span
                                    className="breakthrough-icon"
                                    initial={{ rotate: -180, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                >
                                    💡
                                </motion.span>
                                <h3>Breakthrough!</h3>
                            </div>
                            <div className="breakthrough-content">
                                <div className="breakthrough-insight">
                                    <span className="insight-label">You discovered a contradiction</span>
                                </div>
                                <div className="breakthrough-speaker">
                                    <span className="mood-indicator">
                                        {breakthroughDialogue.dialogue.speakerMood === 'relieved' ? '😌' : '😔'}
                                    </span>
                                    <span className="speaker-name">{currentPatient.name}</span>
                                </div>
                                <motion.p
                                    className="breakthrough-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    "{breakthroughDialogue.dialogue.text.replace(/\[([^\]]+)\]/g, '$1')}"
                                </motion.p>
                            </div>
                            <div className="breakthrough-reward">
                                <span className="reward-icon">✨</span>
                                <span className="reward-text">+40 Focus Restored</span>
                            </div>
                            <motion.button
                                className="breakthrough-close"
                                onClick={handleBreakthroughClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Continue Session
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcut Handler */}
            {/* Add keyboard event listener for handbook shortcut */}
        </div>
    );
}

export default GameScreen;
