import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import { useUI, UI_LAYOUTS, SPRITE_RATIOS } from '../../context/UIContext.jsx';
import { GAME_CONFIG } from '../../data/config.js';
import '../../styles/dev-console.css';

const CONSOLE_HISTORY_KEY = 'syns_dev_console_history';

// Tab definitions
const TABS = {
    console: { id: 'console', label: 'Console', icon: '>' },
    ui: { id: 'ui', label: 'UI', icon: 'UI' },
    state: { id: 'state', label: 'State', icon: '{.}' },
    cheats: { id: 'cheats', label: 'Cheats', icon: '*' },
    dialogue: { id: 'dialogue', label: 'Dialogue', icon: '"' },
};

function DevConsole() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('console');
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
        if (isOpen && inputRef.current && activeTab === 'console') {
            inputRef.current.focus();
        }
    }, [isOpen, activeTab]);

    // Auto-scroll output
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const log = useCallback((message, type = 'info') => {
        setOutput(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
    }, []);

    const getDialogueDebug = () => window.__synsDialogueDebug;

    const executeCommand = useCallback((cmd) => {
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
                log('version           - Show game version');
                log('state             - Show current game state');
                log('focus [amount]    - Set focus to amount (or show current)');
                log('addfocus [n]      - Add n focus points');
                log('rapport [n]       - Set rapport to n');
                log('turn [n]          - Set current turn');
                log('tokens            - List collected tokens');
                log('symptoms          - List revealed symptoms');
                log('screen [name]     - Switch to screen (menu/game/report)');
                log('reveal [id]       - Reveal a symptom');
                log('layout [id]       - Switch UI layout');
                log('layouts           - List available layouts');
                log('dialogue [...]    - Dialogue debug (state, skip, speed)');
                log('typewriter [ms]   - Set or show typewriter speed');
                log('todo              - Open TODO manager');
                log('errors            - Show error log');
                log('clear             - Clear console output');
                break;

            case 'version':
                log(`Version: ${GAME_CONFIG.VERSION}`, 'success');
                break;

            case 'state':
                log('=== Current Game State ===', 'header');
                log(`Screen: ${gameState.currentScreen}`);
                log(`Patient: ${gameState.currentPatient?.name || 'None'}`);
                log(`Turn: ${gameState.currentTurn}/${gameState.maxTurns}`);
                log(`Focus: ${gameState.focus}/${gameState.maxFocus}`);
                log(`Rapport: ${gameState.rapport}/${gameState.maxRapport}`);
                log(`Focus Mode: ${gameState.isFocusMode ? 'ON' : 'OFF'}`);
                log(`Tokens: ${gameState.collectedTokens.length}`);
                log(`Clipboard: ${gameState.clipboardTokens.length}`);
                log(`Revealed Symptoms: ${gameState.revealedSymptoms.length}`);
                break;

            case 'focus':
                if (args[0]) {
                    const amount = parseInt(args[0]);
                    if (!isNaN(amount)) {
                        const diff = amount - gameState.focus;
                        if (diff > 0) actions.restoreFocus(diff);
                        else if (diff < 0) actions.spendFocus(-diff);
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

            case 'rapport':
                if (args[0]) {
                    const amount = parseInt(args[0]);
                    if (!isNaN(amount)) {
                        actions.setRapport(amount);
                        log(`Rapport set to ${amount}`, 'success');
                    } else {
                        log('Invalid amount', 'error');
                    }
                } else {
                    log(`Current rapport: ${gameState.rapport}/${gameState.maxRapport}`);
                }
                break;

            case 'turn':
                if (args[0]) {
                    log(`Turn setting not yet implemented`, 'warning');
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

            case 'layouts':
                log('=== Available UI Layouts ===', 'header');
                Object.values(UI_LAYOUTS).forEach(layout => {
                    log(`${layout.id}: ${layout.name}`);
                });
                break;

            case 'layout':
                if (args[0]) {
                    if (UI_LAYOUTS[args[0]]) {
                        log(`Switch to UI tab to change layouts`, 'info');
                        setActiveTab('ui');
                    } else {
                        log(`Unknown layout: ${args[0]}. Type 'layouts' to see options.`, 'error');
                    }
                } else {
                    log('Usage: layout <layout-id>', 'error');
                }
                break;

            case 'todo':
                log('Opening TODO Manager...', 'success');
                window.open('/tools/todo-manager.html', '_blank', 'width=900,height=700');
                break;

            case 'typewriter': {
                const api = getDialogueDebug();
                if (!api?.setTypewriterSpeed) {
                    log('Dialogue debug API unavailable. Open a dialogue first.', 'error');
                    break;
                }

                if (!args[0]) {
                    const current = api.getTypewriterSpeed?.();
                    if (current) {
                        log(`Typewriter speed: ${current} ms/char`, 'info');
                    } else {
                        log('Typewriter speed unavailable', 'error');
                    }
                    break;
                }

                const speed = parseInt(args[0], 10);
                if (!Number.isFinite(speed) || speed <= 0) {
                    log('Usage: typewriter <ms-per-char>', 'error');
                    break;
                }

                const ok = api.setTypewriterSpeed(speed);
                if (ok) log(`Typewriter speed set to ${speed} ms/char`, 'success');
                else log('Failed to set typewriter speed', 'error');
                break;
            }

            case 'dialogue': {
                const api = getDialogueDebug();
                const sub = args[0];
                if (!api) {
                    log('Dialogue debug API unavailable. Open a dialogue first.', 'error');
                    break;
                }

                if (!sub || sub === 'help') {
                    log('dialogue commands:', 'header');
                    log('dialogue state       - show dialogue debug state');
                    log('dialogue skip        - finish current typewriter');
                    log('dialogue speed <ms>  - set ms per char');
                    break;
                }

                if (sub === 'state') {
                    const state = api.logState?.();
                    log(`Typing: ${state?.isTyping ? 'yes' : 'no'}`);
                    log(`Speed: ${api.getTypewriterSpeed?.() || 'n/a'} ms/char`);
                    log(`Speaker: ${state?.speaker || 'n/a'}`);
                    log(`Keywords: ${state?.keywords ?? 0}`);
                    log(`Fallback: ${state?.fallback ? 'yes' : 'no'} (index ${state?.fallbackIndex ?? '-'})`);
                    log(`Displayed: "${state?.displayedText || ''}"`);
                    break;
                }

                if (sub === 'skip') {
                    api.skipTypewriter?.();
                    log('Skipped typing', 'success');
                    break;
                }

                if (sub === 'speed') {
                    const speedArg = parseInt(args[1], 10);
                    if (!Number.isFinite(speedArg) || speedArg <= 0) {
                        log('Usage: dialogue speed <ms>', 'error');
                        break;
                    }
                    const ok = api.setTypewriterSpeed?.(speedArg);
                    if (ok) log(`Dialogue speed set to ${speedArg} ms/char`, 'success');
                    else log('Failed to set dialogue speed', 'error');
                    break;
                }

                log(`Unknown dialogue subcommand: ${sub}`, 'error');
                break;
            }

            case 'errors':
                log('=== Error Log ===', 'header');
                import('../../utils/ErrorHandler.js').then(({ errorHandler }) => {
                    const errors = errorHandler.getErrors();
                    if (errors.length === 0) {
                        log('No errors recorded', 'success');
                    } else {
                        const stats = errorHandler.getStats();
                        log(`Total: ${stats.total} | Recent (1min): ${stats.recentCount}`);
                        errors.slice(-10).forEach(e => {
                            log(`[${e.level}] ${e.category}: ${e.message}`, e.level);
                        });
                    }
                }).catch(() => log('Error handler not available', 'error'));
                break;

            case 'clear':
                setOutput([]);
                break;

            case '':
                break;

            default:
                log(`Unknown command: ${command}. Type 'help' for commands.`, 'error');
        }
    }, [commandHistory, gameState, actions, log]);

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
                        <span className="console-title">Dev Console</span>
                        <div className="console-tabs">
                            {Object.values(TABS).map(tab => (
                                <button
                                    key={tab.id}
                                    className={`console-tab ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="tab-icon">{tab.icon}</span>
                                    <span className="tab-label">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="console-header-right">
                            <span className="console-hint">Press ` to toggle</span>
                            <button
                                className="console-close"
                                onClick={() => setIsOpen(false)}
                            >
                                x
                            </button>
                        </div>
                    </div>

                    <div className="dev-console-content">
                        {activeTab === 'console' && (
                            <ConsoleTab
                                output={output}
                                outputRef={outputRef}
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                handleSubmit={handleSubmit}
                                handleKeyDown={handleKeyDown}
                                inputRef={inputRef}
                            />
                        )}
                        {activeTab === 'ui' && <UITab />}
                        {activeTab === 'state' && <StateTab />}
                        {activeTab === 'cheats' && <CheatsTab log={log} />}
                        {activeTab === 'dialogue' && <DialogueTab log={log} />}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Console Tab - command line interface
function ConsoleTab({ output, outputRef, inputValue, setInputValue, handleSubmit, handleKeyDown, inputRef }) {
    return (
        <>
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
                    placeholder="Enter command... (type 'help' for commands)"
                    autoComplete="off"
                    spellCheck="false"
                />
            </form>
        </>
    );
}

// UI Tab - layout prototyping controls
function UITab() {
    const {
        settings,
        currentLayout,
        currentSpriteRatio,
        currentDialoguePosition,
        layouts,
        spriteRatios,
        dialoguePositions,
        setLayout,
        setSpriteRatio,
        setDialoguePosition,
        toggleDimensionOverlay,
        toggleGridLines
    } = useUI();

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Get current window dimensions
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Calculate patient panel dimensions based on current layout
    const calcPatientPanelWidth = () => {
        if (currentLayout.patientPanelFixed) {
            return parseInt(currentLayout.patientPanelWidth);
        }
        // Estimate for responsive layouts
        return Math.round(dimensions.width * 0.28);
    };

    const patientWidth = calcPatientPanelWidth();
    const patientHeight = dimensions.height - 40; // minus padding
    const spriteHeight = Math.round((patientWidth - 40) / currentSpriteRatio.ratio);

    return (
        <div className="ui-tab-content">
            <div className="ui-section">
                <h3 className="ui-section-title">Layout Presets</h3>
                <div className="ui-layout-grid">
                    {Object.values(layouts).map(layout => (
                        <button
                            key={layout.id}
                            className={`ui-layout-option ${currentLayout.id === layout.id ? 'active' : ''}`}
                            onClick={() => setLayout(layout.id)}
                        >
                            <span className="layout-name">{layout.name}</span>
                            <span className="layout-desc">{layout.description}</span>
                            {currentLayout.id === layout.id && <span className="layout-active-badge">Active</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ui-section">
                <h3 className="ui-section-title">Sprite Aspect Ratio</h3>
                <div className="ui-ratio-grid">
                    {Object.values(spriteRatios).map(ratio => (
                        <button
                            key={ratio.id}
                            className={`ui-ratio-option ${currentSpriteRatio.id === ratio.id ? 'active' : ''}`}
                            onClick={() => setSpriteRatio(ratio.id)}
                        >
                            <span className="ratio-preview" style={{ aspectRatio: ratio.ratio }}></span>
                            <span className="ratio-name">{ratio.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="ui-section">
                <h3 className="ui-section-title">Dialogue Position</h3>
                <div className="ui-layout-grid">
                    {Object.values(dialoguePositions).map(pos => (
                        <button
                            key={pos.id}
                            className={`ui-layout-option ${currentDialoguePosition.id === pos.id ? 'active' : ''}`}
                            onClick={() => setDialoguePosition(pos.id)}
                        >
                            <span className="layout-name">{pos.name}</span>
                            <span className="layout-desc">{pos.description}</span>
                            {currentDialoguePosition.id === pos.id && <span className="layout-active-badge">Active</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ui-section">
                <h3 className="ui-section-title">Debug Overlays</h3>
                <div className="ui-toggles">
                    <label className="ui-toggle">
                        <input
                            type="checkbox"
                            checked={settings.showDimensionOverlay}
                            onChange={toggleDimensionOverlay}
                        />
                        <span>Show Dimension Overlay</span>
                    </label>
                    <label className="ui-toggle">
                        <input
                            type="checkbox"
                            checked={settings.showGridLines}
                            onChange={toggleGridLines}
                        />
                        <span>Show Grid Lines</span>
                    </label>
                </div>
            </div>

            <div className="ui-section">
                <h3 className="ui-section-title">Current Dimensions</h3>
                <div className="ui-dimensions">
                    <div className="dimension-row">
                        <span className="dim-label">Viewport:</span>
                        <span className="dim-value">{dimensions.width} x {dimensions.height}px</span>
                    </div>
                    <div className="dimension-row">
                        <span className="dim-label">Patient Panel:</span>
                        <span className="dim-value">{patientWidth}px wide</span>
                    </div>
                    <div className="dimension-row">
                        <span className="dim-label">Sprite Container:</span>
                        <span className="dim-value">{patientWidth - 40} x {spriteHeight}px</span>
                    </div>
                    <div className="dimension-row">
                        <span className="dim-label">Aspect Ratio:</span>
                        <span className="dim-value">{currentSpriteRatio.name}</span>
                    </div>
                </div>
            </div>

            <div className="ui-section">
                <h3 className="ui-section-title">Current Layout CSS</h3>
                <pre className="ui-code-preview">
                    {`.game-layout {
  grid-template-columns: ${currentLayout.gridColumns};
}

.patient-panel {
  width: ${currentLayout.patientPanelFixed ? currentLayout.patientPanelWidth : 'auto'};
  ${currentLayout.patientPanelFixed ? `min-width: ${currentLayout.patientPanelWidth};
  max-width: ${currentLayout.patientPanelWidth};` : '/* responsive */'}
}`}
                </pre>
            </div>
        </div >
    );
}

// State Tab - game state inspector
function StateTab() {
    const { gameState } = useGame();
    const [expandedSections, setExpandedSections] = useState(['basic']);

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const sections = [
        {
            id: 'basic', label: 'Basic State', data: {
                currentScreen: gameState.currentScreen,
                currentPatient: gameState.currentPatient?.name || 'None',
                currentTurn: `${gameState.currentTurn}/${gameState.maxTurns}`,
                focus: `${gameState.focus}/${gameState.maxFocus}`,
                rapport: `${gameState.rapport}/${gameState.maxRapport}`,
                isFocusMode: gameState.isFocusMode,
            }
        },
        { id: 'tokens', label: `Tokens (${gameState.collectedTokens.length})`, data: gameState.collectedTokens },
        { id: 'clipboard', label: `Clipboard (${gameState.clipboardTokens.length})`, data: gameState.clipboardTokens },
        { id: 'symptoms', label: `Symptoms (${gameState.revealedSymptoms.length})`, data: gameState.revealedSymptoms },
        { id: 'breakthroughs', label: `Breakthroughs (${gameState.breakthroughs.length})`, data: gameState.breakthroughs },
        { id: 'notes', label: 'Session Notes', data: gameState.sessionNotes },
    ];

    return (
        <div className="state-tab-content">
            {sections.map(section => (
                <div key={section.id} className="state-section">
                    <button
                        className="state-section-header"
                        onClick={() => toggleSection(section.id)}
                    >
                        <span className="state-expand-icon">
                            {expandedSections.includes(section.id) ? '-' : '+'}
                        </span>
                        <span>{section.label}</span>
                    </button>
                    {expandedSections.includes(section.id) && (
                        <pre className="state-section-content">
                            {JSON.stringify(section.data, null, 2)}
                        </pre>
                    )}
                </div>
            ))}
        </div>
    );
}

// Cheats Tab - quick action buttons
function CheatsTab({ log }) {
    const { actions, gameState } = useGame();

    const cheats = [
        { label: 'Max Focus', action: () => { actions.restoreFocus(100); log('Focus maxed!', 'success'); } },
        { label: 'Max Rapport', action: () => { actions.setRapport(100); log('Rapport maxed!', 'success'); } },
        { label: '+25 Focus', action: () => { actions.restoreFocus(25); log('+25 Focus', 'success'); } },
        { label: '+25 Rapport', action: () => { actions.changeRapport(25, 'cheat'); log('+25 Rapport', 'success'); } },
        { label: '-25 Focus', action: () => { actions.spendFocus(25); log('-25 Focus', 'warning'); } },
        { label: '-25 Rapport', action: () => { actions.changeRapport(-25, 'cheat'); log('-25 Rapport', 'warning'); } },
        { label: 'Toggle Focus Mode', action: () => { actions.toggleFocusMode(); log('Focus Mode toggled', 'success'); } },
        { label: 'Next Turn', action: () => { actions.advanceTurn(); log('Advanced turn', 'success'); } },
        { label: 'Go to Menu', action: () => { actions.setScreen('menu'); log('Switched to menu', 'success'); } },
        { label: 'Go to Game', action: () => { actions.setScreen('game'); log('Switched to game', 'success'); } },
        { label: 'Go to Report', action: () => { actions.setScreen('report'); log('Switched to report', 'success'); } },
    ];

    return (
        <div className="cheats-tab-content">
            <div className="cheats-grid">
                {cheats.map((cheat, i) => (
                    <button
                        key={i}
                        className="cheat-button"
                        onClick={cheat.action}
                    >
                        {cheat.label}
                    </button>
                ))}
            </div>
            <div className="cheats-info">
                <p>Current Screen: <strong>{gameState.currentScreen}</strong></p>
                <p>Focus: <strong>{gameState.focus}/{gameState.maxFocus}</strong></p>
                <p>Rapport: <strong>{gameState.rapport}/{gameState.maxRapport}</strong></p>
                <p>Turn: <strong>{gameState.currentTurn}/{gameState.maxTurns}</strong></p>
            </div>
        </div>
    );
}

// Dialogue Tab - live dialogue debugger
function DialogueTab({ log }) {
    const [debugState, setDebugState] = useState(null);
    const [speedInput, setSpeedInput] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const api = window.__synsDialogueDebug;
            if (api?.logState) {
                setDebugState(api.logState());
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const applySpeed = () => {
        const api = window.__synsDialogueDebug;
        const speed = parseInt(speedInput, 10);
        if (!api?.setTypewriterSpeed) {
            log('Dialogue debug API unavailable. Open a dialogue first.', 'error');
            return;
        }
        if (!Number.isFinite(speed) || speed <= 0) {
            log('Enter a positive number for ms/char', 'error');
            return;
        }
        const ok = api.setTypewriterSpeed(speed);
        if (ok) log(`Typewriter speed set to ${speed} ms/char`, 'success');
        else log('Failed to set typewriter speed', 'error');
    };

    const skipTyping = () => {
        const api = window.__synsDialogueDebug;
        if (!api?.skipTypewriter) {
            log('Dialogue debug API unavailable. Open a dialogue first.', 'error');
            return;
        }
        api.skipTypewriter();
        log('Skipped typing', 'success');
    };

    const state = debugState || {};
    const speed = window.__synsDialogueDebug?.getTypewriterSpeed?.();

    return (
        <div className="dialogue-tab-content">
            <div className="dialogue-section">
                <h3 className="dialogue-section-title">Controls</h3>
                <div className="dialogue-control-row">
                    <label className="dialogue-label">Typewriter speed (ms/char)</label>
                    <div className="dialogue-control-inline">
                        <input
                            type="number"
                            min="1"
                            placeholder={speed ? `${speed}` : '30'}
                            value={speedInput}
                            onChange={(e) => setSpeedInput(e.target.value)}
                        />
                        <button onClick={applySpeed}>Apply</button>
                    </div>
                </div>
                <div className="dialogue-control-row">
                    <button onClick={skipTyping}>Skip current typing</button>
                </div>
            </div>

            <div className="dialogue-section">
                <h3 className="dialogue-section-title">Live State</h3>
                <div className="dialogue-state-grid">
                    <div><span className="dialogue-label">Typing:</span> {state.isTyping ? 'Yes' : 'No'}</div>
                    <div><span className="dialogue-label">Speed:</span> {speed ? `${speed} ms/char` : 'n/a'}</div>
                    <div><span className="dialogue-label">Speaker:</span> {state.speaker || 'n/a'}</div>
                    <div><span className="dialogue-label">Keywords:</span> {state.keywords ?? 0}</div>
                    <div><span className="dialogue-label">Fallback:</span> {state.fallback ? 'Yes' : 'No'} (idx {state.fallbackIndex ?? '-'})</div>
                </div>
                <div className="dialogue-mono-box">
                    <div className="dialogue-label">Displayed</div>
                    <pre>{state.displayedText || '—'}</pre>
                </div>
                <div className="dialogue-mono-box">
                    <div className="dialogue-label">Full</div>
                    <pre>{state.fullText || '—'}</pre>
                </div>
            </div>
        </div>
    );
}

export default DevConsole;
