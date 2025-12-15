import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { getDisorderById, getAllDisorders } from '../../data/disorders.js';
import { GAME_CONFIG, RANK_THRESHOLDS } from '../../data/config.js';
import '../../styles/session-report.css';

function SessionReport() {
    const { gameState, actions } = useGame();
    const { currentPatient, sessionNotes, breakthroughs, revealedSymptoms } = gameState;

    // Calculate score
    const score = useMemo(() => {
        let total = 0;

        // Points for symptoms found
        total += revealedSymptoms.length * GAME_CONFIG.SCORE_SYMPTOM_FOUND;

        // Points for breakthroughs
        total += breakthroughs.length * GAME_CONFIG.SCORE_BREAKTHROUGH;

        // Points for correct diagnosis
        if (sessionNotes.finalDiagnosis === currentPatient?.correctDiagnosis) {
            total += GAME_CONFIG.SCORE_CORRECT_DIAGNOSIS;
        } else if (sessionNotes.finalDiagnosis) {
            total += GAME_CONFIG.SCORE_PENALTY_WRONG_DIAGNOSIS;
        }

        return Math.max(0, total);
    }, [revealedSymptoms, breakthroughs, sessionNotes, currentPatient]);

    // Calculate max possible score
    const maxScore = useMemo(() => {
        if (!currentPatient) return 100;
        const symptomsMax = currentPatient.hiddenSymptoms.length * GAME_CONFIG.SCORE_SYMPTOM_FOUND;
        const breakthroughsMax = Object.keys(currentPatient.breakthroughDialogue || {}).length * GAME_CONFIG.SCORE_BREAKTHROUGH;
        return symptomsMax + breakthroughsMax + GAME_CONFIG.SCORE_CORRECT_DIAGNOSIS;
    }, [currentPatient]);

    // Calculate rank
    const rank = useMemo(() => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= RANK_THRESHOLDS.S) return 'S';
        if (percentage >= RANK_THRESHOLDS.A) return 'A';
        if (percentage >= RANK_THRESHOLDS.B) return 'B';
        if (percentage >= RANK_THRESHOLDS.C) return 'C';
        return 'F';
    }, [score, maxScore]);

    // Rank messages
    const rankMessages = {
        S: "Excellent work. Your insight is invaluable to your patients.",
        A: "Solid assessment. You've demonstrated strong clinical judgment.",
        B: "Good effort. There's room for improvement, but you're on the right track.",
        C: "Review the symptoms more carefully next time.",
        F: "We need to discuss this case immediately.",
    };

    const isCorrectDiagnosis = sessionNotes.finalDiagnosis === currentPatient?.correctDiagnosis;
    const correctDisorder = currentPatient ? getDisorderById(currentPatient.correctDiagnosis) : null;
    const selectedDisorder = sessionNotes.finalDiagnosis ? getDisorderById(sessionNotes.finalDiagnosis) : null;

    // Handle diagnosis selection (if not yet submitted)
    const [selectedDiagnosis, setSelectedDiagnosis] = React.useState(sessionNotes.finalDiagnosis);
    const [isSubmitted, setIsSubmitted] = React.useState(!!sessionNotes.finalDiagnosis);

    const handleSubmitDiagnosis = () => {
        if (selectedDiagnosis) {
            actions.setDiagnosis(selectedDiagnosis);
            setIsSubmitted(true);

            // Award knowledge points based on rank
            let kp = 0;
            if (selectedDiagnosis === currentPatient?.correctDiagnosis) {
                kp += GAME_CONFIG.KP_PER_CORRECT_DIAGNOSIS;
            }
            kp += breakthroughs.length * GAME_CONFIG.KP_PER_BREAKTHROUGH;
            actions.addKnowledgePoints(kp);
        }
    };

    return (
        <div className="session-report">
            <header className="report-header">
                <h1>Session Complete</h1>
                <p className="patient-name">Patient: {currentPatient?.name}</p>
            </header>

            {!isSubmitted ? (
                // Diagnosis Selection Phase
                <div className="diagnosis-phase">
                    <h2>Final Diagnosis</h2>
                    <p>Based on your observations, select the most likely diagnosis:</p>

                    <div className="diagnosis-options">
                        {getAllDisorders().map((disorder) => (
                            <button
                                key={disorder.id}
                                className={`diagnosis-option ${selectedDiagnosis === disorder.id ? 'selected' : ''}`}
                                onClick={() => setSelectedDiagnosis(disorder.id)}
                            >
                                <h3>{disorder.name}</h3>
                                <p>{disorder.description}</p>
                            </button>
                        ))}
                    </div>

                    <button
                        className="submit-diagnosis-btn"
                        onClick={handleSubmitDiagnosis}
                        disabled={!selectedDiagnosis}
                    >
                        Submit Diagnosis
                    </button>
                </div>
            ) : (
                // Results Phase
                <div className="results-phase">
                    <div className="rank-display">
                        <div className={`rank-badge rank-${rank}`}>
                            {rank}
                        </div>
                        <p className="rank-message">{rankMessages[rank]}</p>
                    </div>

                    <div className="diagnosis-result">
                        <h2>Diagnosis Review</h2>
                        <div className={`result-card ${isCorrectDiagnosis ? 'correct' : 'incorrect'}`}>
                            <p className="your-diagnosis">
                                <strong>Your Diagnosis:</strong> {selectedDisorder?.name || 'None'}
                            </p>
                            {!isCorrectDiagnosis && (
                                <p className="correct-diagnosis">
                                    <strong>Correct Diagnosis:</strong> {correctDisorder?.name}
                                </p>
                            )}
                            <p className={isCorrectDiagnosis ? 'correct-text' : 'incorrect-text'}>
                                {isCorrectDiagnosis ? '✓ Correct!' : '✗ Incorrect'}
                            </p>
                        </div>
                    </div>

                    <div className="score-breakdown">
                        <h2>Score Breakdown</h2>
                        <ul>
                            <li>
                                <span>Symptoms Identified:</span>
                                <span>{revealedSymptoms.length} × {GAME_CONFIG.SCORE_SYMPTOM_FOUND} = {revealedSymptoms.length * GAME_CONFIG.SCORE_SYMPTOM_FOUND}</span>
                            </li>
                            <li>
                                <span>Breakthroughs:</span>
                                <span>{breakthroughs.length} × {GAME_CONFIG.SCORE_BREAKTHROUGH} = {breakthroughs.length * GAME_CONFIG.SCORE_BREAKTHROUGH}</span>
                            </li>
                            <li>
                                <span>Diagnosis:</span>
                                <span>{isCorrectDiagnosis ? `+${GAME_CONFIG.SCORE_CORRECT_DIAGNOSIS}` : (sessionNotes.finalDiagnosis ? GAME_CONFIG.SCORE_PENALTY_WRONG_DIAGNOSIS : '0')}</span>
                            </li>
                            <li className="total">
                                <span>Total:</span>
                                <span>{score} / {maxScore}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="session-summary">
                        <h2>Observed Symptoms</h2>
                        <ul className="symptom-list">
                            {revealedSymptoms.map((symptomId) => (
                                <li key={symptomId}>{symptomId.replace(/-/g, ' ')}</li>
                            ))}
                            {revealedSymptoms.length === 0 && (
                                <li className="none">No symptoms observed</li>
                            )}
                        </ul>
                    </div>

                    <div className="report-actions">
                        <button
                            className="action-btn"
                            onClick={() => actions.setScreen('patient-select')}
                        >
                            Next Patient
                        </button>
                        <button
                            className="action-btn secondary"
                            onClick={() => actions.setScreen('menu')}
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SessionReport;
