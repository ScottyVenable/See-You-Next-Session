import React from 'react';
import '../../styles/turn-clock.css';

function TurnClock({ currentTurn, maxTurns }) {
    const turnLabels = ['0:00', '0:15', '0:30', '0:45', '1:00'];
    const progress = (currentTurn / maxTurns) * 100;

    return (
        <div className="turn-clock">
            <div className="clock-display">
                <div className="clock-face">
                    <div
                        className="clock-hand"
                        style={{
                            transform: `rotate(${(currentTurn / maxTurns) * 360}deg)`
                        }}
                    />
                    <div className="clock-center" />
                </div>
            </div>

            <div className="turn-info">
                <span className="turn-label">Turn</span>
                <span className="turn-number">{currentTurn} / {maxTurns}</span>
            </div>

            <div className="turn-progress">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
                <div className="progress-markers">
                    {turnLabels.map((label, i) => (
                        <span
                            key={i}
                            className={`marker ${i < currentTurn ? 'passed' : ''}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TurnClock;
