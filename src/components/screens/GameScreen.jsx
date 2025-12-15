import React, { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import PatientView from '../game/PatientView.jsx';
import DialogueBox from '../game/DialogueBox.jsx';
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

    const { currentPatient, currentTurn, focus, isFocusMode } = gameState;

    if (!currentPatient) {
        return <div className="loading">Loading patient data...</div>;
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

    return (
        <div className={`game-screen ${isFocusMode ? 'focus-mode' : ''}`}>
            {/* Focus Mode Overlay */}
            {isFocusMode && <div className="focus-vignette" />}

            {/* Main Game Area */}
            <div className="game-layout">
                {/* Left Panel: Patient */}
                <div className="patient-panel">
                    <PatientView
                        patient={currentPatient}
                        isFocusMode={isFocusMode}
                        onSymptomFound={(symptomId) => {
                            actions.revealSymptom(symptomId);
                        }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                </div>

                {/* Center Panel: Dialogue */}
                <div className="dialogue-panel">
                    <DialogueBox
                        dialogue={currentPhase?.dialogue || []}
                        isFocusMode={isFocusMode}
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
                        }}
                    />

                    <div className="turn-controls">
                        <button
                            className="end-turn-btn"
                            onClick={handleEndTurn}
                        >
                            {currentTurn >= gameState.maxTurns ? 'End Session' : 'Next Topic →'}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Workstation */}
                <div className="workstation-panel">
                    <div className="workstation-top">
                        <TurnClock
                            currentTurn={currentTurn}
                            maxTurns={gameState.maxTurns}
                        />
                        <FocusMeter
                            current={focus}
                            max={gameState.maxFocus}
                            onToggleFocus={actions.toggleFocusMode}
                            isFocusMode={isFocusMode}
                        />
                    </div>

                    <Clipboard
                        tokens={gameState.clipboardTokens}
                        onRemoveToken={actions.removeFromClipboard}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        clipboardTokens={gameState.clipboardTokens}
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

                    <button
                        className="handbook-btn"
                        onClick={() => setIsHandbookOpen(true)}
                    >
                        📖 Handbook
                    </button>
                </div>
            </div>

            {/* Handbook Modal */}
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

            {/* Breakthrough Dialogue Modal */}
            {breakthroughDialogue && (
                <div className="breakthrough-overlay" onClick={handleBreakthroughClose}>
                    <div className="breakthrough-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="breakthrough-header">
                            <span className="breakthrough-icon">💡</span>
                            <h3>Breakthrough!</h3>
                        </div>
                        <div className="breakthrough-content">
                            <div className="breakthrough-speaker">
                                <span className="mood-indicator">
                                    {breakthroughDialogue.dialogue.speakerMood === 'relieved' ? '😌' : '😔'}
                                </span>
                                <span className="speaker-name">{currentPatient.name}</span>
                            </div>
                            <p className="breakthrough-text">
                                {breakthroughDialogue.dialogue.text.replace(/\[([^\]]+)\]/g, '$1')}
                            </p>
                        </div>
                        <button className="breakthrough-close" onClick={handleBreakthroughClose}>
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameScreen;
