import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import { getSymptomById } from '../../data/symptoms.js';
import { GAME_CONFIG } from '../../data/config.js';
import '../../styles/patient-view.css';

// Animation variants
const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

const hotspotVariants = {
    idle: { scale: 1, opacity: 0.7 },
    hover: {
        scale: 1.1,
        opacity: 1,
        transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
};

const hintVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.3 }
    }
};

function PatientView({ patient, isFocusMode, onSymptomFound, onDragStart, onDragEnd }) {
    const { gameState, actions } = useGame();
    const [hoveredHotspot, setHoveredHotspot] = useState(null);

    const handleHotspotClick = (symptomId) => {
        if (!isFocusMode) return;
        if (gameState.revealedSymptoms.includes(symptomId)) return;

        // Check if player has enough focus
        const symptom = getSymptomById(symptomId);
        const cost = symptom?.focusCost || GAME_CONFIG.FOCUS_COST_LOOK;

        if (gameState.focus < cost) {
            // Not enough focus - show feedback
            console.log('Not enough focus!');
            return;
        }

        // Spend focus and reveal symptom
        actions.spendFocus(cost);
        onSymptomFound(symptomId);

        // Create visual token
        const token = {
            id: `visual-${symptomId}`,
            type: 'visual',
            content: symptom?.name || symptomId,
            symptomRef: symptomId,
        };
        actions.collectToken(token);
        actions.addToClipboard(token);
    };

    const handleDragStartVisual = (e, symptomId) => {
        const symptom = getSymptomById(symptomId);
        const token = {
            id: `visual-${symptomId}`,
            type: 'visual',
            content: symptom?.name || symptomId,
            symptomRef: symptomId,
        };

        e.dataTransfer.setData('application/json', JSON.stringify(token));
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(token);
    };

    return (
        <motion.div
            className={`patient-view ${isFocusMode ? 'focus-active' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Patient Sprite Container */}
            <div className="patient-sprite-container">
                {/* Base Sprite - Replace with actual image */}
                <motion.div
                    className="patient-base-sprite"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <div className="placeholder-character">
                        <div className="head">
                            <div className="face">
                                {patient.name.charAt(0)}
                            </div>
                        </div>
                        <div className="body"></div>
                    </div>
                </motion.div>

                {/* Symptom Overlays */}
                {patient.appearance?.symptomOverlays &&
                    Object.entries(patient.appearance.symptomOverlays).map(([symptomId, overlay]) => {
                        const isRevealed = gameState.revealedSymptoms.includes(symptomId);

                        return (
                            <React.Fragment key={symptomId}>
                                {/* Overlay Sprite (shown when revealed) */}
                                <AnimatePresence>
                                    {isRevealed && (
                                        <motion.div
                                            className="symptom-overlay revealed"
                                            style={{
                                                position: 'absolute',
                                                left: overlay.position.x,
                                                top: overlay.position.y,
                                            }}
                                            draggable={true}
                                            onDragStart={(e) => handleDragStartVisual(e, symptomId)}
                                            onDragEnd={onDragEnd}
                                            variants={overlayVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {/* Replace with actual overlay sprite */}
                                            <div className="overlay-indicator">
                                                ✓ {getSymptomById(symptomId)?.name}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Focus Mode Hotspot (clickable area) */}
                                <AnimatePresence>
                                    {isFocusMode && !isRevealed && (
                                        <motion.div
                                            className={`symptom-hotspot ${hoveredHotspot === symptomId ? 'hovered' : ''}`}
                                            style={{
                                                position: 'absolute',
                                                left: overlay.hotspot.x,
                                                top: overlay.hotspot.y,
                                                width: overlay.hotspot.width,
                                                height: overlay.hotspot.height,
                                            }}
                                            onMouseEnter={() => setHoveredHotspot(symptomId)}
                                            onMouseLeave={() => setHoveredHotspot(null)}
                                            onClick={() => handleHotspotClick(symptomId)}
                                            variants={hotspotVariants}
                                            initial="idle"
                                            animate={hoveredHotspot === symptomId ? "hover" : "idle"}
                                            whileTap="tap"
                                            exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                            <motion.span
                                                className="hotspot-hint"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                ?
                                            </motion.span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        );
                    })
                }
            </div>

            {/* Focus Mode Indicator */}
            <AnimatePresence>
                {isFocusMode && (
                    <motion.div
                        className="focus-mode-hint"
                        variants={hintVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <motion.span
                            className="magnifying-icon"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            🔍
                        </motion.span>
                        <span>Click on areas of interest to observe</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Revealed Symptoms List (for accessibility) */}
            <AnimatePresence>
                {gameState.revealedSymptoms.length > 0 && (
                    <motion.div
                        className="revealed-symptoms-list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h4>Observed:</h4>
                        <ul>
                            {gameState.revealedSymptoms.map((symptomId, index) => {
                                const symptom = getSymptomById(symptomId);
                                return (
                                    <motion.li
                                        key={symptomId}
                                        className="revealed-symptom-item"
                                        draggable={true}
                                        onDragStart={(e) => handleDragStartVisual(e, symptomId)}
                                        onDragEnd={onDragEnd}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        👁️ {symptom?.name || symptomId}
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default PatientView;
