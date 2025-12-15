import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import { getAllPatients } from '../../data/patients/index.js';
import '../../styles/patient-select.css';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 200, damping: 20 }
    }
};

function PatientSelect() {
    const { actions, gameState } = useGame();
    const patients = getAllPatients();

    const getDifficultyStars = (difficulty) => {
        const stars = {
            easy: '⭐',
            medium: '⭐⭐',
            hard: '⭐⭐⭐',
        };
        return stars[difficulty] || '⭐';
    };

    const getDifficultyLabel = (difficulty) => {
        const labels = {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
        };
        return labels[difficulty] || difficulty;
    };

    const isUnlocked = (patient) => {
        // Tutorial is always unlocked
        if (patient.difficulty === 'easy') return true;
        // Check if previous patients are completed
        return gameState.completedPatients.includes(patient.id);
    };

    return (
        <div className="patient-select">
            <motion.header
                className="select-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                <motion.button
                    className="back-btn"
                    onClick={() => actions.setScreen('menu')}
                    whileHover={{ scale: 1.05, x: -3 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="back-icon">◀</span>
                    <span>Back</span>
                </motion.button>
                <h1>Select Patient</h1>
                <div className="header-spacer"></div>
            </motion.header>

            <motion.div
                className="patient-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {patients.map((patient, index) => {
                    const unlocked = isUnlocked(patient);
                    const completed = gameState.completedPatients.includes(patient.id);

                    return (
                        <motion.div
                            key={patient.id}
                            className={`patient-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                            onClick={() => unlocked && actions.startSession(patient)}
                            variants={cardVariants}
                            whileHover={unlocked ? {
                                scale: 1.03,
                                y: -5,
                                transition: { type: "spring", stiffness: 400 }
                            } : {}}
                            whileTap={unlocked ? { scale: 0.98 } : {}}
                        >
                            <div className="card-portrait">
                                <div className="portrait-frame">
                                    {unlocked ? (
                                        <div className="portrait-placeholder unlocked">
                                            <span className="portrait-initial">{patient.name.charAt(0)}</span>
                                        </div>
                                    ) : (
                                        <div className="portrait-placeholder locked">
                                            <span className="portrait-mystery">?</span>
                                        </div>
                                    )}
                                </div>
                                {completed && (
                                    <div className="completed-badge" title="Completed">
                                        <span>✓</span>
                                    </div>
                                )}
                                {!unlocked && (
                                    <div className="locked-badge" title="Locked">
                                        <span>🔒</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-info">
                                <h2 className="patient-name">
                                    {unlocked ? patient.name : '???'}
                                </h2>
                                {unlocked && patient.age && (
                                    <p className="patient-age">Age: {patient.age}</p>
                                )}
                                <div className="divider"></div>
                                <div className={`difficulty-badge ${patient.difficulty}`}>
                                    <span className="difficulty-stars">{getDifficultyStars(patient.difficulty)}</span>
                                    <span className="difficulty-label">{getDifficultyLabel(patient.difficulty)}</span>
                                </div>
                                {!unlocked && (
                                    <p className="unlock-hint">Complete previous patient to unlock</p>
                                )}
                                {completed && (
                                    <p className="replay-hint">Click to replay</p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {/* Placeholder cards for future patients */}
                <motion.div
                    className="patient-card locked coming-soon"
                    variants={cardVariants}
                >
                    <div className="card-portrait">
                        <div className="portrait-frame">
                            <div className="portrait-placeholder locked">
                                <span className="portrait-mystery">?</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-info">
                        <h2 className="patient-name">Patient 2</h2>
                        <div className="divider"></div>
                        <div className="difficulty-badge medium">
                            <span className="difficulty-stars">⭐⭐</span>
                            <span className="difficulty-label">Medium</span>
                        </div>
                        <p className="unlock-hint">Coming Soon</p>
                    </div>
                </motion.div>

                <motion.div
                    className="patient-card locked coming-soon"
                    variants={cardVariants}
                >
                    <div className="card-portrait">
                        <div className="portrait-frame">
                            <div className="portrait-placeholder locked">
                                <span className="portrait-mystery">?</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-info">
                        <h2 className="patient-name">Patient 3</h2>
                        <div className="divider"></div>
                        <div className="difficulty-badge hard">
                            <span className="difficulty-stars">⭐⭐⭐</span>
                            <span className="difficulty-label">Hard</span>
                        </div>
                        <p className="unlock-hint">Coming Soon</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default PatientSelect;
