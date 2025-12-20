import React, { useState } from 'react';
import { getAllDisorders } from '../../data/disorders.js';
import { getSymptomById } from '../../data/symptoms.js';
import '../../styles/handbook.css';

function Handbook({ onClose, onTokenDrop, embedded = false }) {
    const [selectedDisorder, setSelectedDisorder] = useState(null);
    const disorders = getAllDisorders();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e, disorderId) => {
        e.preventDefault();
        try {
            const token = JSON.parse(e.dataTransfer.getData('application/json'));
            onTokenDrop(disorderId, token);
        } catch (err) {
            console.error('Invalid drop data');
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
                                onClick={() => setSelectedDisorder(disorder)}
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
                                                <span key={symptomId} className="symptom-tag">
                                                    {symptom?.name || symptomId}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="drop-zone">
                                    <p>Drag a token here to test if it matches this disorder</p>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Select a disorder from the list to view details.</p>
                                <p className="hint">
                                    Tip: Drag tokens from your clipboard onto disorder entries
                                    to check if they're related!
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
                                onClick={() => setSelectedDisorder(disorder)}
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
                                                <span key={symptomId} className="symptom-tag">
                                                    {symptom?.name || symptomId}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="drop-zone">
                                    <p>Drag a token here to test if it matches this disorder</p>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Select a disorder from the list to view details.</p>
                                <p className="hint">
                                    Tip: Drag tokens from your clipboard onto disorder entries
                                    to check if they're related!
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
