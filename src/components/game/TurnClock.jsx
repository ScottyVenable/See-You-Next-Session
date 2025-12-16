import React from 'react';
import { motion } from 'motion/react';
import '../../styles/turn-clock.css';

function TurnClock({ currentTurn, maxTurns }) {
    const progress = (currentTurn / maxTurns) * 100;
    const rotation = (currentTurn / maxTurns) * 360;

    // Generate topic labels based on turn count
    const getTopicLabel = (turn) => {
        const topics = ['Intro', 'History', 'Concerns', 'Goals', 'Wrap-up'];
        return topics[turn - 1] || `Topic ${turn}`;
    };

    return (
        <motion.div
            className="turn-clock"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="clock-visual">
                <div className="clock-face">
                    {/* Clock dial markings */}
                    <div className="clock-markings">
                        {Array.from({ length: maxTurns }, (_, i) => (
                            <div
                                key={i}
                                className={`clock-marking ${i < currentTurn ? 'passed' : ''}`}
                                style={{
                                    transform: `rotate(${(i / maxTurns) * 360}deg) translateY(-14px)`
                                }}
                            />
                        ))}
                    </div>
                    <motion.div
                        className="clock-hand"
                        animate={{ rotate: rotation }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    />
                    <div className="clock-center">
                        <span className="clock-turn-number">{currentTurn}</span>
                    </div>
                </div>
            </div>

            <div className="turn-details">
                <div className="turn-header">
                    <span className="turn-label">Turn</span>
                    <span className="turn-fraction">{currentTurn} / {maxTurns}</span>
                </div>
                <div className="turn-topic">
                    <span className="topic-label">{getTopicLabel(currentTurn)}</span>
                </div>
                <div className="turn-progress-bar">
                    <motion.div
                        className="turn-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default TurnClock;
