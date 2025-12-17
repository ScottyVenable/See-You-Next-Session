import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import '../../styles/focus-meter.css';

function FocusMeter({ current, max, onToggleFocus, isFocusMode }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const percentage = (current / max) * 100;

    const getFocusColor = () => {
        if (percentage > 60) return 'high';
        if (percentage > 30) return 'medium';
        return 'low';
    };

    const getFocusStatus = () => {
        if (percentage > 60) return { label: 'Sharp', icon: '[+]' };
        if (percentage > 30) return { label: 'Focused', icon: '[=]' };
        return { label: 'Fatigued', icon: '[-]' };
    };

    const status = getFocusStatus();

    return (
        <motion.div
            className={`focus-meter ${getFocusColor()} ${isFocusMode ? 'active' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="meter-header">
                <div className="meter-title-group">
                    <motion.span
                        className="meter-icon"
                        animate={isFocusMode ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        {status.icon}
                    </motion.span>
                    <span className="meter-label">Focus</span>
                </div>
                <div
                    className="meter-status"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <span className={`status-badge ${getFocusColor()}`}>{status.label}</span>
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                className="focus-tooltip"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                            >
                                Focus is consumed when observing the patient in Focus Mode.
                                Find contradictions to restore focus!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="meter-bar-container">
                <div className="meter-bar-bg">
                    <motion.div
                        className="meter-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    />
                    <div className="meter-bar-glow" style={{ width: `${percentage}%` }} />
                    {/* Tick marks */}
                    <div className="meter-ticks">
                        {[25, 50, 75].map(tick => (
                            <div key={tick} className="tick" style={{ left: `${tick}%` }} />
                        ))}
                    </div>
                </div>
                <span className="meter-value">{current} / {max}</span>
            </div>

            <motion.button
                className={`focus-toggle ${isFocusMode ? 'active' : ''}`}
                onClick={onToggleFocus}
                disabled={current <= 0 && !isFocusMode}
                whileHover={current > 0 || isFocusMode ? { scale: 1.02 } : {}}
                whileTap={current > 0 || isFocusMode ? { scale: 0.98 } : {}}
            >
                <span className="toggle-icon">{isFocusMode ? '✕' : '🔍'}</span>
                <span className="toggle-text">
                    {isFocusMode ? 'Exit Focus' : 'Enter Focus Mode'}
                </span>
                {!isFocusMode && current > 0 && (
                    <span className="toggle-cost">-10/look</span>
                )}
            </motion.button>

            <AnimatePresence>
                {isFocusMode && (
                    <motion.p
                        className="focus-hint"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <motion.span
                            className="hint-icon"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            🔍
                        </motion.span>
                        <span>Click on the patient to observe details</span>
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Low focus warning */}
            <AnimatePresence>
                {percentage <= 20 && percentage > 0 && !isFocusMode && (
                    <motion.div
                        className="low-focus-warning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <span className="warning-icon">⚠️</span>
                        <span>Focus running low</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default FocusMeter;
