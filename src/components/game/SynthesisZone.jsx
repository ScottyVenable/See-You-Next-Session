import React, { useState } from 'react';
import '../../styles/synthesis-zone.css';

function SynthesisZone({ draggedToken, clipboardTokens, onSynthesisAttempt }) {
    const [slot1, setSlot1] = useState(null);
    const [slot2, setSlot2] = useState(null);
    const [result, setResult] = useState(null);
    const [dragOverSlot, setDragOverSlot] = useState(null);

    const handleDragOver = (e, slotNumber) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setDragOverSlot(slotNumber);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOverSlot(null);
    };

    const handleDrop = (e, slotNumber) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverSlot(null);

        try {
            const data = e.dataTransfer.getData('application/json');
            if (!data) {
                console.error('No data in drop event');
                return;
            }
            const token = JSON.parse(data);

            if (slotNumber === 1) {
                setSlot1(token);
            } else {
                setSlot2(token);
            }

            setResult(null);
        } catch (err) {
            console.error('Invalid drop data');
        }
    };

    const clearSlot = (slotNumber) => {
        if (slotNumber === 1) {
            setSlot1(null);
        } else {
            setSlot2(null);
        }
        setResult(null);
    };

    const attemptSynthesis = () => {
        if (!slot1 || !slot2) return;

        // Determine which is text and which is visual
        const textToken = slot1.type === 'text' ? slot1 : (slot2.type === 'text' ? slot2 : null);
        const visualToken = slot1.type === 'visual' ? slot1 : (slot2.type === 'visual' ? slot2 : null);

        if (!textToken || !visualToken) {
            setResult({ success: false, message: 'Need one statement and one observation!' });
            return;
        }

        // Check for contradiction
        const isContradiction = textToken.contradicts === visualToken.symptomRef;

        if (isContradiction) {
            setResult({
                success: true,
                message: '💡 BREAKTHROUGH! You found a contradiction!'
            });
            onSynthesisAttempt(textToken, visualToken, true);
        } else {
            setResult({
                success: false,
                message: 'These don\'t seem to contradict each other...'
            });
            onSynthesisAttempt(textToken, visualToken, false);
        }
    };

    const clearAll = () => {
        setSlot1(null);
        setSlot2(null);
        setResult(null);
    };

    return (
        <div className="synthesis-zone">
            <h3 className="zone-title">Synthesis Zone</h3>
            <p className="zone-hint">Drag a statement and an observation to find contradictions</p>

            <div className="synthesis-slots">
                <div
                    className={`synthesis-slot ${slot1 ? 'filled' : 'empty'} ${slot1?.type || ''} ${dragOverSlot === 1 ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, 1)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 1)}
                >
                    {slot1 ? (
                        <>
                            <span className="slot-icon">{slot1.type === 'text' ? '[T]' : '[V]'}</span>
                            <span className="slot-content">{slot1.content}</span>
                            <button className="clear-slot" onClick={() => clearSlot(1)}>×</button>
                        </>
                    ) : (
                        <span className="slot-placeholder">Drop Token Here</span>
                    )}
                </div>

                <div className="synthesis-operator">
                    <span>+</span>
                </div>

                <div
                    className={`synthesis-slot ${slot2 ? 'filled' : 'empty'} ${slot2?.type || ''} ${dragOverSlot === 2 ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, 2)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 2)}
                >
                    {slot2 ? (
                        <>
                            <span className="slot-icon">{slot2.type === 'text' ? '[T]' : '[V]'}</span>
                            <span className="slot-content">{slot2.content}</span>
                            <button className="clear-slot" onClick={() => clearSlot(2)}>×</button>
                        </>
                    ) : (
                        <span className="slot-placeholder">
                            <span className="slot-placeholder-icon">[+]</span>
                            <span className="slot-placeholder-text">Drop Here</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="synthesis-actions">
                <button
                    className="synthesize-btn"
                    onClick={attemptSynthesis}
                    disabled={!slot1 || !slot2}
                >
                    <span className="btn-icon">🔬</span>
                    <span className="btn-text">Analyze</span>
                </button>
                <button
                    className="clear-btn"
                    onClick={clearAll}
                    disabled={!slot1 && !slot2}
                >
                    Clear
                </button>
            </div>

            {result && (
                <div className={`synthesis-result ${result.success ? 'success' : 'failure'}`}>
                    {result.success ? (
                        <>
                            <div className="result-icon">💡</div>
                            <div className="result-content">
                                <h4 className="result-title">BREAKTHROUGH!</h4>
                                <p className="result-message">You found a contradiction!</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="result-icon">[?]</div>
                            <div className="result-content">
                                <p className="result-message">{result.message}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SynthesisZone;
