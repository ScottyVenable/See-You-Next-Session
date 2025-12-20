/**
 * DevContextMenu - Context menu for development/debugging
 * Shows contextual options based on what element was clicked
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import './DevContextMenu.css';

const menuVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1 } },
};

// Context types that determine which menu options to show
const CONTEXT_TYPES = {
    GENERAL: 'general',
    DIALOGUE: 'dialogue',
    PATIENT: 'patient',
    SYMPTOM: 'symptom',
    DRAWER: 'drawer',
    METER: 'meter',
};

function DevContextMenu({ enabled = true }) {
    const { gameState, actions } = useGame();
    const { settings, toggleSetting } = useUI();
    const [menu, setMenu] = useState({ show: false, x: 0, y: 0, context: null, contextType: CONTEXT_TYPES.GENERAL });
    const menuRef = useRef(null);

    // Detect what element was right-clicked and determine context
    const detectContext = useCallback((target) => {
        // Check for specific elements and return context info
        const dialogueBox = target.closest('.dialogue-floating, .floating-dialogue, .dialogue-box');
        if (dialogueBox) {
            return { type: CONTEXT_TYPES.DIALOGUE, element: dialogueBox };
        }

        const patientView = target.closest('.patient-view, .patient-fullscreen');
        if (patientView) {
            return { type: CONTEXT_TYPES.PATIENT, element: patientView };
        }

        const symptomElement = target.closest('[data-symptom-id], .symptom-marker');
        if (symptomElement) {
            const symptomId = symptomElement.dataset?.symptomId;
            return { type: CONTEXT_TYPES.SYMPTOM, element: symptomElement, symptomId };
        }

        const drawer = target.closest('.drawer, .sidebar-btn');
        if (drawer) {
            return { type: CONTEXT_TYPES.DRAWER, element: drawer };
        }

        const meter = target.closest('.focus-meter, .rapport-meter, .tray-meter');
        if (meter) {
            return { type: CONTEXT_TYPES.METER, element: meter };
        }

        return { type: CONTEXT_TYPES.GENERAL, element: target };
    }, []);

    // Handle right-click
    const handleContextMenu = useCallback((e) => {
        // Only show dev menu in dev mode or when enabled
        if (!enabled || !settings?.devMode) {
            return; // Let browser handle it normally
        }

        e.preventDefault();
        e.stopPropagation();

        const context = detectContext(e.target);

        // Calculate position, ensuring menu stays on screen
        let x = e.clientX;
        let y = e.clientY;

        // Will adjust after render to fit on screen
        setMenu({
            show: true,
            x,
            y,
            context,
            contextType: context.type,
        });
    }, [enabled, settings?.devMode, detectContext]);

    // Adjust menu position after render to stay on screen
    useEffect(() => {
        if (menu.show && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            let { x, y } = menu;

            if (x + rect.width > window.innerWidth - 20) {
                x = window.innerWidth - rect.width - 20;
            }
            if (y + rect.height > window.innerHeight - 20) {
                y = window.innerHeight - rect.height - 20;
            }

            if (x !== menu.x || y !== menu.y) {
                setMenu(prev => ({ ...prev, x, y }));
            }
        }
    }, [menu.show]);

    // Close menu on click outside or escape
    useEffect(() => {
        if (!menu.show) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenu(prev => ({ ...prev, show: false }));
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setMenu(prev => ({ ...prev, show: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menu.show]);

    // Set up global context menu handler
    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, [handleContextMenu]);

    // Menu action handlers
    const executeAction = useCallback((action, closeMenu = true) => {
        action();
        if (closeMenu) {
            setMenu(prev => ({ ...prev, show: false }));
        }
    }, []);

    // Build menu items based on context
    const getMenuItems = useCallback(() => {
        const items = [];
        const { contextType, context } = menu;

        // General dev options (always available)
        items.push({ type: 'header', label: 'Dev Tools' });

        items.push({
            label: 'Toggle DevConsole',
            shortcut: '~',
            action: () => {
                // Dispatch tilde key event to toggle dev console
                window.dispatchEvent(new KeyboardEvent('keydown', { key: '`', code: 'Backquote' }));
            }
        });

        items.push({
            label: settings?.showDimensionOverlay ? 'Hide Debug Overlay' : 'Show Debug Overlay',
            action: () => toggleSetting?.('showDimensionOverlay'),
        });

        items.push({ type: 'separator' });

        // Context-specific options
        switch (contextType) {
            case CONTEXT_TYPES.DIALOGUE:
                items.push({ type: 'header', label: 'Dialogue' });
                items.push({
                    label: 'Skip to End',
                    action: () => console.log('[Dev] Skip dialogue - not implemented'),
                });
                items.push({
                    label: 'Reset Dialogue',
                    action: () => console.log('[Dev] Reset dialogue - not implemented'),
                });
                items.push({
                    label: 'Log Current State',
                    action: () => {
                        console.log('[Dev] Current dialogue state:', {
                            turn: gameState.currentTurn,
                            patient: gameState.currentPatient?.id,
                        });
                    },
                });
                break;

            case CONTEXT_TYPES.PATIENT:
                items.push({ type: 'header', label: 'Patient' });
                items.push({
                    label: 'Reveal All Symptoms',
                    action: () => {
                        const patient = gameState.currentPatient;
                        if (patient?.visualSymptoms) {
                            patient.visualSymptoms.forEach(s => actions.revealSymptom(s.id));
                        }
                        console.log('[Dev] Revealed all symptoms');
                    },
                });
                items.push({
                    label: 'Log Patient Data',
                    action: () => console.log('[Dev] Patient:', gameState.currentPatient),
                });
                break;

            case CONTEXT_TYPES.SYMPTOM:
                items.push({ type: 'header', label: 'Symptom' });
                items.push({
                    label: `Reveal: ${context?.symptomId || 'Unknown'}`,
                    action: () => {
                        if (context?.symptomId) {
                            actions.revealSymptom(context.symptomId);
                            console.log(`[Dev] Revealed symptom: ${context.symptomId}`);
                        }
                    },
                });
                break;

            case CONTEXT_TYPES.METER:
                items.push({ type: 'header', label: 'Meters' });
                items.push({
                    label: 'Restore Full Focus',
                    action: () => {
                        actions.restoreFocus(100);
                        console.log('[Dev] Focus restored');
                    },
                });
                items.push({
                    label: 'Max Rapport',
                    action: () => {
                        actions.changeRapport(100 - gameState.rapport, 'dev_cheat');
                        console.log('[Dev] Rapport maxed');
                    },
                });
                items.push({
                    label: 'Min Rapport',
                    action: () => {
                        actions.changeRapport(-gameState.rapport, 'dev_cheat');
                        console.log('[Dev] Rapport minimized');
                    },
                });
                break;

            default:
                // General context
                break;
        }

        // Always add game state options at the end
        items.push({ type: 'separator' });
        items.push({ type: 'header', label: 'Game State' });
        items.push({
            label: 'Log Game State',
            action: () => console.log('[Dev] Game State:', gameState),
        });
        items.push({
            label: 'Advance Turn',
            action: () => {
                actions.advanceTurn();
                console.log(`[Dev] Advanced to turn ${gameState.currentTurn + 1}`);
            },
        });
        items.push({
            label: 'Go to Main Menu',
            action: () => actions.setScreen('menu'),
        });

        return items;
    }, [menu, gameState, actions, settings, toggleSetting]);

    // Don't render if dev mode is not enabled
    if (!enabled || !settings?.devMode) return null;

    return (
        <AnimatePresence>
            {menu.show && (
                <motion.div
                    ref={menuRef}
                    className="dev-context-menu"
                    style={{ left: menu.x, top: menu.y }}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="dev-menu-content">
                        {getMenuItems().map((item, index) => {
                            if (item.type === 'separator') {
                                return <div key={index} className="dev-menu-separator" />;
                            }
                            if (item.type === 'header') {
                                return (
                                    <div key={index} className="dev-menu-header">
                                        {item.label}
                                    </div>
                                );
                            }
                            return (
                                <button
                                    key={index}
                                    className="dev-menu-item"
                                    onClick={() => executeAction(item.action)}
                                >
                                    <span className="item-label">{item.label}</span>
                                    {item.shortcut && (
                                        <span className="item-shortcut">{item.shortcut}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="dev-menu-footer">
                        <span className="context-indicator">
                            Context: {menu.contextType}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DevContextMenu;
