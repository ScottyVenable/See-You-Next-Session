import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import '../../styles/main-menu.css';

const VERSION = 'v0.1.0';
const DISCLAIMER_KEY = 'syns_disclaimer_dismissed';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
};

const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 120, damping: 14 }
    }
};

const popupVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2 }
    }
};

function MainMenu() {
    const { actions, gameState } = useGame();
    const hasSaveData = gameState?.completedPatients?.length > 0;
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleNewGame = () => {
        // Check if user has dismissed disclaimer permanently
        const dismissed = localStorage.getItem(DISCLAIMER_KEY);
        if (dismissed === 'true') {
            actions.setScreen('patient-select');
        } else {
            setShowDisclaimer(true);
        }
    };

    const handleDisclaimerContinue = () => {
        if (dontShowAgain) {
            localStorage.setItem(DISCLAIMER_KEY, 'true');
        }
        setShowDisclaimer(false);
        actions.setScreen('patient-select');
    };

    return (
        <div className="main-menu">
            <div className="menu-background">
                <motion.div
                    className="bg-pattern"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                />
            </div>

            <motion.div
                className="menu-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="title-card" variants={titleVariants}>
                    <div className="game-title">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            See You Next
                        </motion.h1>
                        <motion.h1
                            className="title-accent"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, type: "spring" }}
                        >
                            Session
                        </motion.h1>
                    </div>
                    <motion.p
                        className="subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        "A diagnostic narrative game"
                    </motion.p>
                </motion.div>

                <nav className="menu-buttons">
                    <motion.button
                        className="menu-btn primary"
                        onClick={handleNewGame}
                        variants={buttonVariants}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="btn-icon">▶</span>
                        <span className="btn-text">New Game</span>
                    </motion.button>

                    <motion.button
                        className={`menu-btn ${hasSaveData ? '' : 'disabled'}`}
                        disabled={!hasSaveData}
                        variants={buttonVariants}
                        whileHover={hasSaveData ? { scale: 1.03, x: 5 } : {}}
                        whileTap={hasSaveData ? { scale: 0.98 } : {}}
                    >
                        <span className="btn-text">Continue</span>
                    </motion.button>

                    <motion.button
                        className="menu-btn"
                        variants={buttonVariants}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="btn-text">Settings</span>
                    </motion.button>
                </nav>

                <motion.div
                    className="version-badge"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {VERSION}
                </motion.div>
            </motion.div>

            {/* Disclaimer Popup */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        className="disclaimer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="disclaimer-popup"
                            variants={popupVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div
                                className="disclaimer-icon"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                            >
                                ⚕️
                            </motion.div>
                            <h3>Before You Begin</h3>
                            <p>
                                This game is for <strong>entertainment purposes only</strong> and is
                                not a substitute for professional mental health training or diagnosis.
                            </p>
                            <p className="disclaimer-secondary">
                                The developers are not mental health professionals. If you or someone
                                you know is struggling, please contact a qualified professional.
                            </p>
                            <label className="dont-show-again">
                                <input
                                    type="checkbox"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                />
                                <span>Don't show this again</span>
                            </label>
                            <motion.button
                                className="disclaimer-continue-btn"
                                onClick={handleDisclaimerContinue}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                I Understand
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MainMenu;
