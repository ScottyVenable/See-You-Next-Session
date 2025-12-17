import React, { createContext, useContext, useState, useCallback } from 'react';

// Drawer definitions - what drawers exist and their default states
export const DRAWERS = {
    // Left side drawers
    handbook: { id: 'handbook', side: 'left', label: 'Handbook', icon: '[H]', width: 360 },
    notes: { id: 'notes', side: 'left', label: 'Notes', icon: '[N]', width: 320 },
    // Right side drawers
    clipboard: { id: 'clipboard', side: 'right', label: 'Evidence', icon: '[E]', width: 340 },
    synthesis: { id: 'synthesis', side: 'right', label: 'Synthesis', icon: '[S]', width: 360 },
    stats: { id: 'stats', side: 'right', label: 'Session Stats', icon: '[I]', width: 300 },
};

// Dialogue position presets for the drawer layout
export const DIALOGUE_POSITIONS = {
    'center-float': {
        id: 'center-float',
        name: 'Center Float',
        description: 'Floating dialogue box centered above the tray',
    },
    'left-inline': {
        id: 'left-inline',
        name: 'Left Inline',
        description: 'Dialogue inline with interaction tray on the left',
    },
    'bottom-wide': {
        id: 'bottom-wide',
        name: 'Bottom Wide',
        description: 'Wide dialogue bar at the bottom of the screen',
    },
};

// UI Layout Presets for the drawer-based layout
export const UI_LAYOUTS = {
    'fullscreen-center': {
        id: 'fullscreen-center',
        name: 'Fullscreen + Center Dialogue',
        description: 'Patient fills screen, dialogue floats center-bottom',
        dialoguePosition: 'center-float',
    },
    'fullscreen-inline': {
        id: 'fullscreen-inline',
        name: 'Fullscreen + Inline Dialogue',
        description: 'Patient fills screen, dialogue in bottom tray',
        dialoguePosition: 'left-inline',
    },
    'fullscreen-wide': {
        id: 'fullscreen-wide',
        name: 'Fullscreen + Wide Dialogue',
        description: 'Patient fills screen, wide dialogue bar',
        dialoguePosition: 'bottom-wide',
    },
};

// Sprite aspect ratio presets
export const SPRITE_RATIOS = {
    '3:4': { id: '3:4', name: '3:4 (Portrait)', ratio: 3 / 4, description: 'Standard portrait' },
    '2:3': { id: '2:3', name: '2:3 (Tall Portrait)', ratio: 2 / 3, description: 'Taller, slimmer' },
    '9:16': { id: '9:16', name: '9:16 (Phone)', ratio: 9 / 16, description: 'Very tall' },
    '4:5': { id: '4:5', name: '4:5 (Square-ish)', ratio: 4 / 5, description: 'More square' },
    '1:2': { id: '1:2', name: '1:2 (Full Body)', ratio: 1 / 2, description: 'Full body tall' },
};

const UI_STORAGE_KEY = 'syns_ui_settings';

// Context
const UIContext = createContext(null);

export function UIProvider({ children }) {
    // Load saved settings
    const loadSavedSettings = () => {
        try {
            const saved = localStorage.getItem(UI_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load UI settings:', e);
        }
        return {
            currentLayout: 'fullscreen-center',
            dialoguePosition: 'center-float',
            spriteRatio: '3:4',
            showDimensionOverlay: false,
            showGridLines: false,
        };
    };

    const [settings, setSettings] = useState(loadSavedSettings);

    // Drawer state management (not persisted - resets each session)
    const [openDrawers, setOpenDrawers] = useState({
        left: null,  // Only one drawer open per side at a time
        right: null,
    });

    // Dialogue box visibility
    const [dialogueVisible, setDialogueVisible] = useState(true);

    // Save settings whenever they change
    const updateSettings = useCallback((updates) => {
        setSettings(prev => {
            const newSettings = { ...prev, ...updates };
            localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(newSettings));
            return newSettings;
        });
    }, []);

    // Drawer controls
    const openDrawer = useCallback((drawerId) => {
        const drawer = DRAWERS[drawerId];
        if (!drawer) return;

        setOpenDrawers(prev => ({
            ...prev,
            [drawer.side]: drawerId,
        }));
    }, []);

    const closeDrawer = useCallback((side) => {
        setOpenDrawers(prev => ({
            ...prev,
            [side]: null,
        }));
    }, []);

    const toggleDrawer = useCallback((drawerId) => {
        const drawer = DRAWERS[drawerId];
        if (!drawer) return;

        setOpenDrawers(prev => ({
            ...prev,
            [drawer.side]: prev[drawer.side] === drawerId ? null : drawerId,
        }));
    }, []);

    const closeAllDrawers = useCallback(() => {
        setOpenDrawers({ left: null, right: null });
    }, []);

    // Dialogue visibility
    const toggleDialogue = useCallback(() => {
        setDialogueVisible(prev => !prev);
    }, []);

    const showDialogue = useCallback(() => setDialogueVisible(true), []);
    const hideDialogue = useCallback(() => setDialogueVisible(false), []);

    const setLayout = useCallback((layoutId) => {
        if (UI_LAYOUTS[layoutId]) {
            const layout = UI_LAYOUTS[layoutId];
            updateSettings({
                currentLayout: layoutId,
                dialoguePosition: layout.dialoguePosition || 'center-float',
            });
        }
    }, [updateSettings]);

    const setDialoguePosition = useCallback((positionId) => {
        if (DIALOGUE_POSITIONS[positionId]) {
            updateSettings({ dialoguePosition: positionId });
        }
    }, [updateSettings]);

    const setSpriteRatio = useCallback((ratioId) => {
        if (SPRITE_RATIOS[ratioId]) {
            updateSettings({ spriteRatio: ratioId });
        }
    }, [updateSettings]);

    const toggleDimensionOverlay = useCallback(() => {
        updateSettings({ showDimensionOverlay: !settings.showDimensionOverlay });
    }, [settings.showDimensionOverlay, updateSettings]);

    const toggleGridLines = useCallback(() => {
        updateSettings({ showGridLines: !settings.showGridLines });
    }, [settings.showGridLines, updateSettings]);

    const currentLayout = UI_LAYOUTS[settings.currentLayout] || UI_LAYOUTS['fullscreen-center'];
    const currentSpriteRatio = SPRITE_RATIOS[settings.spriteRatio] || SPRITE_RATIOS['3:4'];
    const currentDialoguePosition = DIALOGUE_POSITIONS[settings.dialoguePosition] || DIALOGUE_POSITIONS['center-float'];

    const value = {
        // Settings (persisted)
        settings,
        currentLayout,
        currentSpriteRatio,
        currentDialoguePosition,
        layouts: UI_LAYOUTS,
        spriteRatios: SPRITE_RATIOS,
        dialoguePositions: DIALOGUE_POSITIONS,
        setLayout,
        setDialoguePosition,
        setSpriteRatio,
        toggleDimensionOverlay,
        toggleGridLines,
        updateSettings,
        // Drawers (session state)
        drawers: DRAWERS,
        openDrawers,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        closeAllDrawers,
        // Dialogue visibility
        dialogueVisible,
        toggleDialogue,
        showDialogue,
        hideDialogue,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
