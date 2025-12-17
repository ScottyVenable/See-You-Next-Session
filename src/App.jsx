import React from 'react';
import { useGame } from './context/GameContext.jsx';
import MainMenu from './components/screens/MainMenu.jsx';
import GameScreen from './components/screens/GameScreen.jsx';
import SessionReport from './components/screens/SessionReport.jsx';
import PatientSelect from './components/screens/PatientSelect.jsx';
import DevConsole from './components/ui/DevConsole.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import ErrorOverlay from './components/ui/ErrorOverlay.jsx';

function App() {
    const { gameState } = useGame();

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
                {/* Error overlay - dev mode only */}
                <ErrorOverlay />
            </div>
        </ErrorBoundary>
    );
}

export default App;
