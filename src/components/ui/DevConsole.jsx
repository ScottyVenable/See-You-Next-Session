import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import '../../styles/dev-console.css';

const CONSOLE_HISTORY_KEY = 'syns_dev_console_history';

function DevConsole() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [output, setOutput] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    const { gameState, actions } = useGame();

    // Load command history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(CONSOLE_HISTORY_KEY);
        if (saved) {
            setCommandHistory(JSON.parse(saved));
        }
    }, []);

    // Toggle console with backtick key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Auto-scroll output
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const log = (message, type = 'info') => {
        setOutput(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
    };

    const executeCommand = (cmd) => {
        const parts = cmd.trim().toLowerCase().split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        log(`> ${cmd}`, 'command');

        // Save to history
        const newHistory = [cmd, ...commandHistory.filter(c => c !== cmd)].slice(0, 50);
        setCommandHistory(newHistory);
        localStorage.setItem(CONSOLE_HISTORY_KEY, JSON.stringify(newHistory));

        switch (command) {
            case 'help':
                log('=== Dev Console Commands ===', 'header');
                log('help              - Show this help message');
                log('state             - Show current game state');
                log('focus [amount]    - Set focus to amount (or show current)');
                log('addfocus [n]      - Add n focus points');
                log('turn [n]          - Set current turn');
                log('tokens            - List collected tokens');
                log('symptoms          - List revealed symptoms');
                log('screen [name]     - Switch to screen (menu/game/report)');
                log('unlock [id]       - Unlock a dialogue option');
                log('reveal [id]       - Reveal a symptom');
                log('clear             - Clear console output');
                log('reset             - Reset game state');
                break;

            case 'state':
                log('=== Current Game State ===', 'header');
                log(`Screen: ${gameState.currentScreen}`);
                log(`Patient: ${gameState.currentPatient?.name || 'None'}`);
                log(`Turn: ${gameState.currentTurn}/${gameState.maxTurns}`);
                log(`Focus: ${gameState.focus}/${gameState.maxFocus}`);
                log(`Focus Mode: ${gameState.isFocusMode ? 'ON' : 'OFF'}`);
                log(`Tokens: ${gameState.collectedTokens.length}`);
                log(`Clipboard: ${gameState.clipboardTokens.length}`);
                log(`Revealed Symptoms: ${gameState.revealedSymptoms.length}`);
                log(`Breakthroughs: ${gameState.breakthroughs.length}`);
                break;

            case 'focus':
                if (args[0]) {
                    const amount = parseInt(args[0]);
                    if (!isNaN(amount)) {
                        // Direct state manipulation via action
                        actions.setFocus?.(amount) || log('setFocus action not available', 'error');
                        log(`Focus set to ${amount}`, 'success');
                    } else {
                        log('Invalid amount', 'error');
                    }
                } else {
                    log(`Current focus: ${gameState.focus}/${gameState.maxFocus}`);
                }
                break;

            case 'addfocus':
                const addAmount = parseInt(args[0]) || 10;
                actions.restoreFocus(addAmount);
                log(`Added ${addAmount} focus`, 'success');
                break;

            case 'turn':
                if (args[0]) {
                    const turn = parseInt(args[0]);
                    if (!isNaN(turn) && turn >= 1 && turn <= gameState.maxTurns) {
                        // Would need a SET_TURN action to be added
                        log(`Turn setting not yet implemented`, 'warning');
                    } else {
                        log('Invalid turn number', 'error');
                    }
                } else {
                    log(`Current turn: ${gameState.currentTurn}/${gameState.maxTurns}`);
                }
                break;

            case 'tokens':
                log('=== Collected Tokens ===', 'header');
                if (gameState.collectedTokens.length === 0) {
                    log('No tokens collected');
                } else {
                    gameState.collectedTokens.forEach((t, i) => {
                        log(`${i + 1}. [${t.type}] ${t.content}`);
                    });
                }
                break;

            case 'symptoms':
                log('=== Revealed Symptoms ===', 'header');
                if (gameState.revealedSymptoms.length === 0) {
                    log('No symptoms revealed');
                } else {
                    gameState.revealedSymptoms.forEach((s, i) => {
                        log(`${i + 1}. ${s}`);
                    });
                }
                break;

            case 'screen':
                if (args[0]) {
                    const validScreens = ['menu', 'patient-select', 'game', 'report'];
                    if (validScreens.includes(args[0])) {
                        actions.setScreen(args[0]);
                        log(`Switched to ${args[0]}`, 'success');
                    } else {
                        log(`Invalid screen. Valid: ${validScreens.join(', ')}`, 'error');
                    }
                } else {
                    log(`Current screen: ${gameState.currentScreen}`);
                }
                break;

            case 'reveal':
                if (args[0]) {
                    actions.revealSymptom(args[0]);
                    log(`Revealed symptom: ${args[0]}`, 'success');
                } else {
                    log('Usage: reveal <symptom-id>', 'error');
                }
                break;

            case 'clear':
                setOutput([]);
                break;

            case 'reset':
                log('Game reset not yet implemented', 'warning');
                break;

            case '':
                break;

            default:
                log(`Unknown command: ${command}. Type 'help' for commands.`, 'error');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            executeCommand(inputValue);
            setInputValue('');
            setHistoryIndex(-1);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInputValue(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInputValue(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInputValue('');
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="dev-console"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <div className="dev-console-header">
                        <span className="console-title">🔧 Dev Console</span>
                        <span className="console-hint">Press ` to toggle | Type 'help' for commands</span>
                        <button
                            className="console-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="dev-console-output" ref={outputRef}>
                        {output.map((entry, i) => (
                            <div key={i} className={`console-entry ${entry.type}`}>
                                <span className="entry-time">[{entry.timestamp}]</span>
                                <span className="entry-message">{entry.message}</span>
                            </div>
                        ))}
                    </div>

                    <form className="dev-console-input" onSubmit={handleSubmit}>
                        <span className="input-prompt">&gt;</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter command..."
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DevConsole;
