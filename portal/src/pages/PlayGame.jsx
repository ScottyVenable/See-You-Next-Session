export default function PlayGame() {
    // The game will be built and deployed separately
    // This iframe points to the game build
    const gameUrl = `https://${import.meta.env.VITE_REPO_OWNER}.github.io/${import.meta.env.VITE_REPO_NAME}/game/`;

    return (
        <div className="play-game-page">
            <header className="page-header">
                <h1>🎮 Play Game</h1>
                <p>Test the latest development build in your browser</p>
            </header>

            <div className="game-controls">
                <button onClick={() => window.location.reload()} className="btn">
                    🔄 Refresh Game
                </button>
                <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="btn">
                    🔗 Open in New Tab
                </a>
            </div>

            <div className="game-container">
                <iframe
                    src={gameUrl}
                    title="See You Next Session - Dev Build"
                    className="game-iframe"
                    allow="fullscreen"
                />
                <div className="game-fallback">
                    <p>⚠️ Game not loading?</p>
                    <p>The game build may not be deployed yet. Run <code>npm run build</code> and push to main branch.</p>
                </div>
            </div>

            <div className="game-info card">
                <h2>Controls</h2>
                <ul>
                    <li><strong>Left Click</strong> - Select / Interact</li>
                    <li><strong>Right Click (Hold)</strong> - Enter Focus Mode</li>
                    <li><strong>Drag</strong> - Move tokens to clipboard or synthesize</li>
                    <li><strong>ESC</strong> - Open menu / Cancel action</li>
                </ul>
            </div>

            <div className="feedback card">
                <h2>Found a Bug?</h2>
                <p>Report issues directly to the repository:</p>
                <a
                    href={`https://github.com/${import.meta.env.VITE_REPO_OWNER}/${import.meta.env.VITE_REPO_NAME}/issues/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    🐛 Report Bug
                </a>
            </div>
        </div>
    );
}
