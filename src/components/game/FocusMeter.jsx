import React from 'react';
import '../../styles/focus-meter.css';

function FocusMeter({ current, max, onToggleFocus, isFocusMode }) {
    const percentage = (current / max) * 100;

    const getFocusColor = () => {
        if (percentage > 60) return 'high';
        if (percentage > 30) return 'medium';
        return 'low';
    };

    return (
        <div className={`focus-meter ${getFocusColor()} ${isFocusMode ? 'active' : ''}`}>
            <div className="meter-header">
                <span className="meter-icon">🧠</span>
                <span className="meter-label">FOCUS</span>
            </div>

            <div className="meter-bar-container">
                <div className="meter-bar-bg">
                    <div
                        className="meter-bar-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="meter-value">{current} / {max}</span>
            </div>

            <button
                className={`focus-toggle ${isFocusMode ? 'active' : ''}`}
                onClick={onToggleFocus}
                disabled={current <= 0 && !isFocusMode}
            >
                <span className="toggle-icon">{isFocusMode ? '✕' : '👁️'}</span>
                <span className="toggle-text">
                    {isFocusMode ? 'Exit Focus' : 'Enter Focus Mode'}
                </span>
            </button>

            {isFocusMode && (
                <p className="focus-hint">
                    <span className="hint-icon">🔍</span>
                    Click on the patient to observe details
                </p>
            )}
        </div>
    );
}

export default FocusMeter;
