import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import { useUI, DRAWERS } from '../../context/UIContext.jsx';
import PatientView from '../game/PatientView.jsx';
import DialogueBox from '../game/DialogueBox.jsx';
import SynsDialogueBox from '../game/SynsDialogueBox.jsx';
import DialogueSelector from '../game/DialogueSelector.jsx';
import Clipboard from '../game/Clipboard.jsx';
import FocusMeter from '../game/FocusMeter.jsx';
import TurnClock from '../game/TurnClock.jsx';
import Handbook from '../game/Handbook.jsx';
import RapportMeter from '../game/RapportMeter.jsx';
import { getRapportLevelName, getBodyLanguage } from '../../data/rapport.js';
import '../../styles/game-screen.css';

function GameScreen() {
    const { gameState, actions } = useGame();
    const {
        settings,
        openDrawers,
        toggleDrawer,
        closeDrawer,
        dialogueVisible,
        toggleDialogue,
        drawers,
        currentDialoguePosition,
    } = useUI();

    const [draggedToken, setDraggedToken] = useState(null);
    const [breakthroughDialogue, setBreakthroughDialogue] = useState(null);
    const [showTutorialHint, setShowTutorialHint] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [useSynsDialogue, setUseSynsDialogue] = useState(true);

    const { currentPatient, currentTurn, focus, isFocusMode, rapport } = gameState;

    // Get rapport-based patient state
    const rapportLevel = getRapportLevelName(rapport);
    const bodyLanguage = getBodyLanguage(rapport);

    // Handle dialogue prompt selection from selector
    const handleSelectPrompt = useCallback((prompt) => {
        setSelectedPrompt(prompt);
        console.log('Selected dialogue prompt:', prompt);

        if (prompt.focusCost && prompt.focusCost > 0) {
            actions.spendFocus(prompt.focusCost);
        }

        if (prompt.rapportValue && prompt.rapportValue !== 0) {
            actions.changeRapport(prompt.rapportValue, `dialogue_${prompt.rapportImpact}`);
        }
    }, [actions]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case 'd':
                    toggleDialogue();
                    break;
                case 'h':
                    toggleDrawer('handbook');
                    break;
                case 'e':
                    toggleDrawer('clipboard');
                    break;
                case 'escape':
                    closeDrawer('left');
                    closeDrawer('right');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDialogue, toggleDrawer, closeDrawer]);

    if (!currentPatient) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <span className="loading-text">Preparing session...</span>
            </div>
        );
    }

    const currentPhase = currentPatient.phases.find(p => p.turn === currentTurn);

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

    const sessionProgress = (currentTurn / gameState.maxTurns) * 100;

    // Get drawers by side for the sidebar buttons
    const leftDrawers = Object.values(drawers).filter(d => d.side === 'left');
    const rightDrawers = Object.values(drawers).filter(d => d.side === 'right');

    // Render drawer content based on which drawer is open
    const renderDrawerContent = (drawerId) => {
        switch (drawerId) {
            case 'handbook':
                return (
                    <Handbook
                        embedded={true}
                        onTokenDrop={(disorderId) => {
                            if (draggedToken) {
                                console.log(`Testing ${draggedToken.id} against ${disorderId}`);
                            }
                        }}
                    />
                );
            case 'clipboard':
                return (
                    <Clipboard
                        tokens={gameState.clipboardTokens}
                        onRemoveToken={actions.removeFromClipboard}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        clipboardTokens={gameState.clipboardTokens}
                        showTutorialHint={showTutorialHint && gameState.clipboardTokens.length === 0}
                        onSynthesisAttempt={(textToken, visualToken, isSuccess) => {
                            if (isSuccess) {
                                actions.recordBreakthrough({
                                    textToken: textToken.id,
                                    visualToken: visualToken.id,
                                    timestamp: Date.now(),
                                });
                                actions.restoreFocus(40);
                                actions.changeRapport(15, 'breakthrough_success');

                                const btDialogue = findBreakthroughDialogue(textToken.id, visualToken.symptomRef);
                                if (btDialogue) {
                                    actions.unlockDialogue(btDialogue.key);
                                    setBreakthroughDialogue(btDialogue);
                                }
                            } else {
                                actions.spendFocus(10);
                                actions.changeRapport(-5, 'synthesis_failed');
                            }
                        }}
                    />
                );
            case 'synthesis':
                return (
                    <div className="drawer-placeholder">
                        <span className="placeholder-icon">🧩</span>
                        <span className="placeholder-text">Synthesis Zone</span>
                        <span className="placeholder-hint">Coming soon...</span>
                    </div>
                );
            case 'notes':
                return (
                    <div className="drawer-placeholder">
                        <span className="placeholder-icon">[N]</span>
                        <span className="placeholder-text">Session Notes</span>
                        <span className="placeholder-hint">Coming soon...</span>
                    </div>
                );
            case 'stats':
                return (
                    <div className="drawer-content-stats">
                        <h3 className="drawer-section-title">Session Progress</h3>
                        <TurnClock currentTurn={currentTurn} maxTurns={gameState.maxTurns} />
                        <FocusMeter
                            current={focus}
                            max={gameState.maxFocus}
                            onToggleFocus={actions.toggleFocusMode}
                            isFocusMode={isFocusMode}
                        />
                        <RapportMeter
                            value={rapport}
                            maxValue={gameState.maxRapport || 100}
                            showEffects={false}
                            compact={false}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`game-screen drawer-layout ${isFocusMode ? 'focus-mode' : ''}`}>
            {/* Focus Mode Overlay */}
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

            {/* Left Sidebar - Vertical buttons */}
            <div className="sidebar sidebar-left">
                {leftDrawers.map(drawer => (
                    <button
                        key={drawer.id}
                        className={`sidebar-btn ${openDrawers.left === drawer.id ? 'active' : ''}`}
                        onClick={() => toggleDrawer(drawer.id)}
                        title={`${drawer.label} (${drawer.id === 'handbook' ? 'H' : drawer.id[0].toUpperCase()})`}
                    >
                        <span className="sidebar-btn-icon">{drawer.icon}</span>
                        <span className="sidebar-btn-label">{drawer.label}</span>
                    </button>
                ))}
            </div>

            {/* Left Drawer Panel */}
            <AnimatePresence>
                {openDrawers.left && (
                    <motion.div
                        className="drawer drawer-left"
                        initial={{ x: -400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -400, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{ width: drawers[openDrawers.left]?.width || 360 }}
                    >
                        <div className="drawer-header">
                            <span className="drawer-icon">{drawers[openDrawers.left]?.icon}</span>
                            <h3 className="drawer-title">{drawers[openDrawers.left]?.label}</h3>
                            <button className="drawer-close" onClick={() => closeDrawer('left')}>×</button>
                        </div>
                        <div className="drawer-content">
                            {renderDrawerContent(openDrawers.left)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area - Full screen patient */}
            <div className="main-content">
                {/* Patient View - Full screen background */}
                <div className="patient-fullscreen">
                    <PatientView
                        patient={currentPatient}
                        isFocusMode={isFocusMode}
                        fullscreen={true}
                        onSymptomFound={(symptomId) => {
                            actions.revealSymptom(symptomId);
                        }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />

                    {/* Patient name overlay */}
                    <div className="patient-name-overlay">
                        <span className="patient-name">{currentPatient.name || 'Patient'}</span>
                    </div>
                </div>

                {/* Dialogue Drawer - slides up from bottom */}
                <AnimatePresence>
                    {dialogueVisible && (
                        <motion.div
                            className={`dialogue-floating draggable position-${settings.dialoguePosition}`}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            dragConstraints={{ left: -400, right: 400, top: -300, bottom: 50 }}
                            whileDrag={{ scale: 1.02, boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5)' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="dialogue-header">
                                <span className="dialogue-speaker">{currentPatient.name}</span>
                                <button
                                    className="dialogue-hide-btn"
                                    onClick={toggleDialogue}
                                    title="Hide dialogue (D)"
                                >
                                    ▼
                                </button>
                            </div>
                            {useSynsDialogue ? (
                                <SynsDialogueBox
                                    patientId={currentPatient.id}
                                    turn={currentTurn}
                                    isFocusMode={isFocusMode}
                                    patientName={currentPatient.name}
                                    fallbackDialogue={currentPhase?.dialogue || []}
                                    compact={true}
                                    onKeywordCollected={(token) => {
                                        actions.collectToken(token);
                                        actions.addToClipboard(token);
                                        setShowTutorialHint(false);
                                    }}
                                    onSpeechChange={(speech) => {
                                        console.log('Current speech:', speech);
                                    }}
                                    onDialogueEnd={() => {
                                        console.log('Dialogue block ended');
                                    }}
                                    onAskAbout={(keyword) => {
                                        console.log('Ask about keyword:', keyword);
                                    }}
                                    onHighlightInHandbook={(keyword) => {
                                        toggleDrawer('handbook');
                                    }}
                                    onExploreBackground={(keyword) => {
                                        console.log('Explore background:', keyword);
                                    }}
                                />
                            ) : (
                                <DialogueBox
                                    dialogue={currentPhase?.dialogue || []}
                                    isFocusMode={isFocusMode}
                                    patientName={currentPatient.name}
                                    compact={true}
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
                                    onAskAbout={(keyword) => {
                                        console.log('Ask about keyword:', keyword);
                                    }}
                                    onHighlightInHandbook={(keyword) => {
                                        toggleDrawer('handbook');
                                    }}
                                    onExploreBackground={(keyword) => {
                                        console.log('Explore background:', keyword);
                                    }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Show dialogue button when hidden - fixed position */}
            <AnimatePresence>
                {!dialogueVisible && (
                    <motion.button
                        className="dialogue-show-btn"
                        onClick={toggleDialogue}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        title="Show dialogue (D)"
                    >
                        <span className="show-btn-icon">[D]</span>
                        <span className="show-btn-text">Show Dialogue</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Right Sidebar - Vertical buttons */}
            <div className="sidebar sidebar-right">
                {rightDrawers.map(drawer => (
                    <button
                        key={drawer.id}
                        className={`sidebar-btn ${openDrawers.right === drawer.id ? 'active' : ''}`}
                        onClick={() => toggleDrawer(drawer.id)}
                        title={`${drawer.label} (${drawer.id === 'clipboard' ? 'E' : drawer.id[0].toUpperCase()})`}
                    >
                        <span className="sidebar-btn-icon">{drawer.icon}</span>
                        <span className="sidebar-btn-label">{drawer.label}</span>
                    </button>
                ))}
            </div>

            {/* Right Drawer Panel */}
            <AnimatePresence>
                {openDrawers.right && (
                    <motion.div
                        className="drawer drawer-right"
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{ width: drawers[openDrawers.right]?.width || 340 }}
                    >
                        <div className="drawer-header">
                            <span className="drawer-icon">{drawers[openDrawers.right]?.icon}</span>
                            <h3 className="drawer-title">{drawers[openDrawers.right]?.label}</h3>
                            <button className="drawer-close" onClick={() => closeDrawer('right')}>×</button>
                        </div>
                        <div className="drawer-content">
                            {renderDrawerContent(openDrawers.right)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Interaction Tray */}
            <div className="interaction-tray">
                <div className="tray-left">
                    <div className="tray-meters">
                        <div className="tray-meter focus-mini">
                            <span className="meter-icon">🔍</span>
                            <div className="meter-bar">
                                <div
                                    className="meter-fill focus-fill"
                                    style={{ width: `${(focus.current / gameState.maxFocus) * 100}%` }}
                                />
                            </div>
                            <span className="meter-value">{focus.current}</span>
                        </div>
                        <div className="tray-meter rapport-mini">
                            <span className="meter-icon">[R]</span>
                            <div className="meter-bar">
                                <div
                                    className="meter-fill rapport-fill"
                                    style={{ width: `${(rapport / (gameState.maxRapport || 100)) * 100}%` }}
                                />
                            </div>
                            <span className="meter-value">{rapport}</span>
                        </div>
                    </div>
                    <button
                        className={`focus-toggle-btn ${isFocusMode ? 'active' : ''}`}
                        onClick={actions.toggleFocusMode}
                        title="Toggle Focus Mode"
                    >
                        <span className="focus-icon">{isFocusMode ? '[O]' : '[F]'}</span>
                        <span className="focus-label">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
                    </button>
                </div>

                <div className="tray-center">
                    <DialogueSelector
                        onSelectPrompt={handleSelectPrompt}
                        disabledTopics={[]}
                        currentFocus={focus.current}
                        compact={true}
                    />
                </div>

                <div className="tray-right">
                    <div className="turn-indicator">
                        <span className="turn-label">Turn</span>
                        <span className="turn-current">{currentTurn}</span>
                        <span className="turn-divider">/</span>
                        <span className="turn-max">{gameState.maxTurns}</span>
                    </div>
                    <motion.button
                        className="end-turn-btn"
                        onClick={handleEndTurn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {currentTurn >= gameState.maxTurns ? 'End Session' : 'Next →'}
                    </motion.button>
                </div>
            </div>

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
                                        {breakthroughDialogue.dialogue.speakerMood === 'relieved' ? '[R]' : '[-]'}
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
                                <span className="reward-icon">[+]</span>
                                <span className="reward-text">+40 Focus Restored</span>
                                <span className="reward-divider">•</span>
                                <span className="reward-icon">[R]</span>
                                <span className="reward-text">+15 Rapport</span>
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

            {/* Debug Dimension Overlay */}
            {settings.showDimensionOverlay && (
                <div className="debug-dimensions-overlay">
                    <div className="debug-info">
                        <span className="debug-label">Layout:</span> Drawer-based
                    </div>
                    <div className="debug-info">
                        <span className="debug-label">Left Drawer:</span> {openDrawers.left || 'closed'}
                    </div>
                    <div className="debug-info">
                        <span className="debug-label">Right Drawer:</span> {openDrawers.right || 'closed'}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameScreen;
