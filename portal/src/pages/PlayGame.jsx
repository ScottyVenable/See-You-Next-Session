import { useState, useEffect } from 'react';

// Build configurations mapped to branches
const BUILD_CONFIGS = {
    develop: {
        name: 'Development',
        branch: 'develop',
        description: 'Latest development features, may be unstable',
        color: 'warning',
        icon: '🔧'
    },
    stable: {
        name: 'Stable',
        branch: 'stable',
        description: 'Tested and stable release build',
        color: 'success',
        icon: '✅'
    },
    experimental: {
        name: 'Experimental',
        branch: 'experimental',
        description: 'Cutting-edge features, expect bugs',
        color: 'error',
        icon: '🧪'
    }
};

export default function PlayGame() {
    const [selectedBuild, setSelectedBuild] = useState('develop');
    const [buildStatus, setBuildStatus] = useState('checking');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const repoOwner = import.meta.env.VITE_REPO_OWNER || 'ScottyVenable';
    const repoName = import.meta.env.VITE_REPO_NAME || 'See-You-Next-Session';

    // Game URL based on selected branch
    const getGameUrl = (branch) => {
        // Each branch deploys to a different path
        return `https://${repoOwner}.github.io/${repoName}/builds/${branch}/`;
    };

    const gameUrl = getGameUrl(BUILD_CONFIGS[selectedBuild].branch);

    // Check if the build exists
    useEffect(() => {
        const checkBuildStatus = async () => {
            setBuildStatus('checking');
            try {
                const response = await fetch(gameUrl, { method: 'HEAD', mode: 'no-cors' });
                setBuildStatus('ready');
            } catch (error) {
                setBuildStatus('unavailable');
            }
        };

        checkBuildStatus();

        // Fetch last commit info for selected branch
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${repoOwner}/${repoName}/branches/${BUILD_CONFIGS[selectedBuild].branch}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setLastUpdated(new Date(data.commit.commit.committer.date));
                }
            } catch (error) {
                console.log('Could not fetch branch info');
            }
        };

        fetchLastUpdate();
    }, [selectedBuild, gameUrl, repoOwner, repoName]);

    const handleBuildChange = (e) => {
        setIsLoading(true);
        setSelectedBuild(e.target.value);
        setTimeout(() => setIsLoading(false), 500);
    };

    const refreshGame = () => {
        setIsLoading(true);
        const iframe = document.querySelector('.game-iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
        setTimeout(() => setIsLoading(false), 1000);
    };

    const currentBuild = BUILD_CONFIGS[selectedBuild];

    return (
        <div className="play-game-page">
            <header className="page-header">
                <h1>🎮 Play Game</h1>
                <p>Test builds directly in your browser</p>
            </header>

            {/* Build Selector */}
            <div className="build-selector">
                <div className="build-select-group">
                    <label htmlFor="build-select" className="build-label">
                        Select Build:
                    </label>
                    <select
                        id="build-select"
                        value={selectedBuild}
                        onChange={handleBuildChange}
                        className="build-dropdown"
                    >
                        {Object.entries(BUILD_CONFIGS).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.icon} {config.name} ({config.branch})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="build-info">
                    <div className={`build-status status-${currentBuild.color}`}>
                        <span className={`status-dot ${buildStatus}`}></span>
                        <span className="status-text">
                            {buildStatus === 'checking' && 'Checking...'}
                            {buildStatus === 'ready' && 'Ready'}
                            {buildStatus === 'unavailable' && 'Build Not Available'}
                        </span>
                    </div>
                    <p className="build-description">{currentBuild.description}</p>
                    {lastUpdated && (
                        <p className="build-updated">
                            Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Game Controls */}
            <div className="game-controls">
                <button onClick={refreshGame} className="btn" disabled={isLoading}>
                    {isLoading ? '⏳ Loading...' : '🔄 Refresh Game'}
                </button>
                <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="btn">
                    🔗 Open in New Tab
                </a>
                <a
                    href={`https://github.com/${repoOwner}/${repoName}/tree/${currentBuild.branch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                >
                    📂 View Source ({currentBuild.branch})
                </a>
            </div>

            {/* Game Container */}
            <div className={`game-container ${isLoading ? 'loading' : ''}`}>
                {buildStatus === 'unavailable' ? (
                    <div className="game-fallback">
                        <div className="fallback-icon">🚧</div>
                        <h3>Build Not Available</h3>
                        <p>The <strong>{currentBuild.name}</strong> build hasn't been deployed yet.</p>
                        <p className="fallback-hint">
                            To deploy this build, push changes to the <code>{currentBuild.branch}</code> branch
                            and ensure GitHub Actions is configured.
                        </p>
                        <a
                            href={`https://github.com/${repoOwner}/${repoName}/actions`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            View GitHub Actions
                        </a>
                    </div>
                ) : (
                    <iframe
                        src={gameUrl}
                        title={`See You Next Session - ${currentBuild.name} Build`}
                        className="game-iframe"
                        allow="fullscreen"
                    />
                )}
                {isLoading && (
                    <div className="game-loading-overlay">
                        <div className="spinner"></div>
                        <p>Loading {currentBuild.name} build...</p>
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="game-info-grid">
                <div className="card">
                    <h2>🎮 Controls</h2>
                    <ul className="controls-list">
                        <li><kbd>Left Click</kbd> Select / Interact</li>
                        <li><kbd>Right Click (Hold)</kbd> Enter Focus Mode</li>
                        <li><kbd>Drag</kbd> Move tokens to clipboard</li>
                        <li><kbd>ESC</kbd> Open menu / Cancel</li>
                    </ul>
                </div>

                <div className="card">
                    <h2>📊 Build Info</h2>
                    <dl className="build-details">
                        <dt>Branch:</dt>
                        <dd><code>{currentBuild.branch}</code></dd>
                        <dt>Type:</dt>
                        <dd>{currentBuild.name}</dd>
                        <dt>Status:</dt>
                        <dd className={`status-badge status-${currentBuild.color}`}>
                            {currentBuild.icon} {buildStatus === 'ready' ? 'Deployed' : 'Pending'}
                        </dd>
                    </dl>
                </div>

                <div className="card">
                    <h2>🐛 Found a Bug?</h2>
                    <p>Report issues directly to the repository:</p>
                    <a
                        href={`https://github.com/${repoOwner}/${repoName}/issues/new?labels=bug&title=[${currentBuild.branch}]%20Bug%20Report`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Report Bug
                    </a>
                </div>
            </div>
        </div>
    );
}
