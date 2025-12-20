import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GameProvider } from './context/GameContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import './styles/fonts.css';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GameProvider>
            <UIProvider>
                <App />
            </UIProvider>
        </GameProvider>
    </React.StrictMode>
);
