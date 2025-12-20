import React, { useState } from 'react';
import { getAllDisorders } from '../../data/disorders.js';
import { getSymptomById } from '../../data/symptoms.js';
import '../../styles/handbook.css';

function Handbook({ onClose, onTokenDrop, embedded = false }) {
    const [selectedDisorder, setSelectedDisorder] = useState(null);
    const [dropFeedback, setDropFeedback] = useState(null);
    const [highlightedSymptom, setHighlightedSymptom] = useState(null);
    const disorders = getAllDisorders();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e, disorderId) => {
        e.preventDefault();
        if (!disorderId) return;

        try {
            const token = JSON.parse(e.dataTransfer.getData('application/json'));
            const disorder = disorders.find((d) => d.id === disorderId);
            const related = disorder?.relatedSymptoms || [];
            const symptomId = token.relatedSymptom || token.symptomRef;
            const symptomMatch = symptomId ? related.includes(symptomId) : false;
            const symptom = symptomId ? getSymptomById(symptomId) : null;

            setHighlightedSymptom(symptomMatch ? symptomId : null);
            setDropFeedback({
                disorderId,
                symptomId,
                matches: symptomMatch,
                message: symptomMatch
                    ? `Matches symptom: ${symptom?.name || symptomId}`
                    : 'No direct symptom match found in this disorder.',
                tokenLabel: token.content || token.id,
            });

            if (onTokenDrop) {
                onTokenDrop(disorderId, token, symptomMatch);
            }
        } catch (err) {
            console.error('Invalid drop data');
            setDropFeedback({ disorderId, matches: false, message: 'Could not read dropped token.' });
        }
    };

    // Embedded mode - render just the content without modal wrapper
    if (embedded) {
        return (
            <div className="handbook-embedded">
                <div className="handbook-content">
                    <nav className="disorder-list">
                        <h3>Disorders</h3>
                        {disorders.map((disorder) => (
                            <button
                                key={disorder.id}
                                className={`disorder-tab ${selectedDisorder?.id === disorder.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedDisorder(disorder);
                                    setDropFeedback(null);
                                    setHighlightedSymptom(null);
                                }}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, disorder.id)}
                            >
                                {disorder.name}
                            </button>
                        ))}
                    </nav>

                    <div className="disorder-details">
                        {selectedDisorder ? (
                            <>
                                <h3>{selectedDisorder.name}</h3>
                                <p className="disorder-description">{selectedDisorder.description}</p>

                                <div className="criteria-section">
                                    <h4>Diagnostic Criteria</h4>
                                    <ul>
                                        {selectedDisorder.criteria.map((criterion, i) => (
                                            <li key={i}>{criterion}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="related-symptoms">
                                    <h4>Related Symptoms</h4>
                                    <div className="symptom-tags">
                                        {selectedDisorder.relatedSymptoms.map((symptomId) => {
                                            const symptom = getSymptomById(symptomId);
                                            return (
                                                <span
                                                    key={symptomId}
                                                    className={`symptom-tag ${highlightedSymptom === symptomId ? 'matched' : ''}`}
                                                >
                                                    {symptom?.name || symptomId}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div
                                    className={`drop-zone ${dropFeedback?.disorderId === selectedDisorder.id ? (dropFeedback?.matches ? 'success' : 'fail') : ''}`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, selectedDisorder.id)}
                                >
                                    <p>Drag a token here to test if it matches this disorder</p>
                                    {dropFeedback?.disorderId === selectedDisorder.id && (
                                        <p className="drop-feedback">{dropFeedback.message}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Select a disorder from the list to view details.</p>
                                <p className="hint">
                                    Tip: Drag tokens from your clipboard onto disorder entries
                                    to check if they&apos;re related!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Modal mode - original behavior
    return (
        <div className="handbook-overlay" onClick={onClose}>
            <div className="handbook-modal" onClick={(e) => e.stopPropagation()}>
                <header className="handbook-header">
                    <h2>Clinical Handbook</h2>
                    <button className="close-btn" onClick={onClose}>x</button>
                </header>

                <div className="handbook-content">
                    <nav className="disorder-list">
                        <h3>Disorders</h3>
                        {disorders.map((disorder) => (
                            <button
                                key={disorder.id}
                                className={`disorder-tab ${selectedDisorder?.id === disorder.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedDisorder(disorder);
                                    setDropFeedback(null);
                                    setHighlightedSymptom(null);
                                }}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, disorder.id)}
                            >
                                {disorder.name}
                            </button>
                        ))}
                    </nav>

                    <div className="disorder-details">
                        {selectedDisorder ? (
                            <>
                                <h3>{selectedDisorder.name}</h3>
                                <p className="disorder-description">{selectedDisorder.description}</p>

                                <div className="criteria-section">
                                    <h4>Diagnostic Criteria</h4>
                                    <ul>
                                        {selectedDisorder.criteria.map((criterion, i) => (
                                            <li key={i}>{criterion}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="related-symptoms">
                                    <h4>Related Symptoms</h4>
                                    <div className="symptom-tags">
                                        {selectedDisorder.relatedSymptoms.map((symptomId) => {
                                            const symptom = getSymptomById(symptomId);
                                            return (
                                                <span
                                                    key={symptomId}
                                                    className={`symptom-tag ${highlightedSymptom === symptomId ? 'matched' : ''}`}
                                                >
                                                    {symptom?.name || symptomId}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div
                                    className={`drop-zone ${dropFeedback?.disorderId === selectedDisorder.id ? (dropFeedback?.matches ? 'success' : 'fail') : ''}`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, selectedDisorder.id)}
                                >
                                    <p>Drag a token here to test if it matches this disorder</p>
                                    {dropFeedback?.disorderId === selectedDisorder.id && (
                                        <p className="drop-feedback">{dropFeedback.message}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Select a disorder from the list to view details.</p>
                                <p className="hint">
                                    Tip: Drag tokens from your clipboard onto disorder entries
                                    to check if they&apos;re related!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Handbook;
