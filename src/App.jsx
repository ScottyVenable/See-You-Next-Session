import React, { useEffect } from 'react';
import { useGame } from './context/GameContext.jsx';
import { useUI } from './context/UIContext.jsx';
import MainMenu from './components/screens/MainMenu.jsx';
import GameScreen from './components/screens/GameScreen.jsx';
import SessionReport from './components/screens/SessionReport.jsx';
import PatientSelect from './components/screens/PatientSelect.jsx';
import DevConsole from './components/ui/DevConsole.jsx';
import DevContextMenu from './components/ui/DevContextMenu.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import ErrorOverlay from './components/ui/ErrorOverlay.jsx';

function App() {
    const { gameState } = useGame();
    const { settings } = useUI();

    // Prevent default context menu when in game (unless dev mode)
    useEffect(() => {
        const handleContextMenu = (e) => {
            // Only block default menu when in game screens and NOT in dev mode
            // Dev mode has its own context menu handler
            if (gameState.currentScreen === 'game' && !settings?.devMode) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, [gameState.currentScreen, settings?.devMode]);

    const renderScreen = () => {
        switch (gameState.currentScreen) {
            case 'menu':
                return <MainMenu />;
            case 'patient-select':
                return <PatientSelect />;
            case 'game':
                return <GameScreen />;
            case 'report':
                return <SessionReport />;
            default:
                return <MainMenu />;
        }
    };

    return (
        <ErrorBoundary name="App">
            <div className="app">
                <ErrorBoundary name="Screen" category="ui">
                    {renderScreen()}
                </ErrorBoundary>
                {/* Dev console - toggle with ~ key */}
                <DevConsole />
                {/* Dev context menu - right-click in dev mode */}
                <DevContextMenu enabled={true} />
                {/* Error overlay - dev mode only */}
                <ErrorOverlay />
            </div>
        </ErrorBoundary>
    );
}

export default App;
