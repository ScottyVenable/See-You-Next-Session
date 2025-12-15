import { useState, useEffect } from 'react';

export default function Releases() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const owner = import.meta.env.VITE_REPO_OWNER;
    const repo = import.meta.env.VITE_REPO_NAME;

    useEffect(() => {
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch releases: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                setReleases(Array.isArray(data) ? data : []);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || 'Failed to load releases. Please try again later.');
                setLoading(false);
            });
    }, [owner, repo]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAssetIcon = (name) => {
        if (name.endsWith('.msi') || name.endsWith('.exe')) return '🪟';
        if (name.endsWith('.dmg') || name.endsWith('.app')) return '🍎';
        if (name.endsWith('.deb') || name.endsWith('.AppImage') || name.endsWith('.rpm')) return '🐧';
        if (name.endsWith('.zip') || name.endsWith('.tar.gz')) return '📦';
        return '📄';
    };

    return (
        <div className="releases-page">
            <header className="page-header">
                <h1>📦 Releases & Downloads</h1>
                <p>Download the latest builds for Windows, macOS, and Linux</p>
            </header>

            {loading ? (
                <div className="loading-state">Loading releases...</div>
            ) : error ? (
                <div className="error-state card">
                    <h2>⚠️ Error Loading Releases</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-primary"
                    >
                        Retry
                    </button>
                </div>
            ) : releases.length === 0 ? (
                <div className="empty-state card">
                    <h2>No Releases Yet</h2>
                    <p>Releases will appear here once they're published on GitHub.</p>
                    <p>To create a release:</p>
                    <ol>
                        <li>Run <code>npm run tauri:build</code> to create installers</li>
                        <li>Go to GitHub → Releases → Draft new release</li>
                        <li>Upload the build artifacts from <code>src-tauri/target/release/bundle/</code></li>
                    </ol>
                </div>
            ) : (
                <div className="releases-list">
                    {releases.map((release, index) => (
                        <div key={release.id} className={`release-card card ${index === 0 ? 'latest' : ''}`}>
                            {index === 0 && <span className="badge">Latest</span>}

                            <div className="release-header">
                                <h2>{release.tag_name}</h2>
                                <span className="release-date">{formatDate(release.published_at)}</span>
                            </div>

                            <h3>{release.name || 'Release'}</h3>

                            {release.body && (
                                <div className="release-notes">
                                    <h4>Release Notes</h4>
                                    <pre>{release.body}</pre>
                                </div>
                            )}

                            {release.assets && release.assets.length > 0 && (
                                <div className="release-assets">
                                    <h4>Downloads</h4>
                                    <div className="asset-grid">
                                        {release.assets.map(asset => (
                                            <a
                                                key={asset.id}
                                                href={asset.browser_download_url}
                                                className="asset-link"
                                                download
                                            >
                                                <span className="asset-icon">{getAssetIcon(asset.name)}</span>
                                                <span className="asset-name">{asset.name}</span>
                                                <span className="asset-size">
                                                    {(asset.size / 1024 / 1024).toFixed(1)} MB
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="release-links">
                                <a href={release.html_url} target="_blank" rel="noopener noreferrer">
                                    View on GitHub →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
