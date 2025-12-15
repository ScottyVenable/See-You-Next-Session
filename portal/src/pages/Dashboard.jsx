import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [repoData, setRepoData] = useState(null);
    const [releases, setReleases] = useState([]);
    const [issues, setIssues] = useState([]);
    const [errors, setErrors] = useState({
        repo: null,
        releases: null,
        issues: null
    });

    const owner = import.meta.env.VITE_REPO_OWNER;
    const repo = import.meta.env.VITE_REPO_NAME;

    useEffect(() => {
        // Fetch repo info
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch repository data');
                return res.json();
            })
            .then(setRepoData)
            .catch(err => {
                console.error(err);
                setErrors(prev => ({ ...prev, repo: 'Unable to load repository stats' }));
            });

        // Fetch latest releases
        fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch releases');
                return res.json();
            })
            .then(data => setReleases(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setErrors(prev => ({ ...prev, releases: 'Unable to load releases' }));
            });

        // Fetch open issues
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch issues');
                return res.json();
            })
            .then(data => setIssues(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error(err);
                setErrors(prev => ({ ...prev, issues: 'Unable to load issues' }));
            });
    }, [owner, repo]);

    return (
        <div className="dashboard">
            <header className="page-header">
                <h1>📊 Dashboard</h1>
                <p>Welcome to the See You Next Session development portal</p>
            </header>

            <div className="dashboard-grid">
                {/* Project Stats */}
                <div className="card stats-card">
                    <h2>Project Stats</h2>
                    {errors.repo ? (
                        <p className="error">{errors.repo}</p>
                    ) : repoData ? (
                        <div className="stats-grid">
                            <div className="stat">
                                <span className="stat-value">{repoData.stargazers_count}</span>
                                <span className="stat-label">⭐ Stars</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{repoData.forks_count}</span>
                                <span className="stat-label">🍴 Forks</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{repoData.open_issues_count}</span>
                                <span className="stat-label">📋 Open Issues</span>
                            </div>
                        </div>
                    ) : (
                        <p className="loading">Loading stats...</p>
                    )}
                </div>

                {/* Quick Links */}
                <div className="card quick-links-card">
                    <h2>Quick Links</h2>
                    <div className="quick-links">
                        <a href="#/play" className="quick-link">🎮 Play Latest Build</a>
                        <a href="#/releases" className="quick-link">📦 View Releases</a>
                        <a href="#/documents" className="quick-link">📄 Project Docs</a>
                        <a href="#/assets" className="quick-link">🎨 Asset Library</a>
                    </div>
                </div>

                {/* Recent Releases */}
                <div className="card releases-card">
                    <h2>Recent Releases</h2>
                    {errors.releases ? (
                        <p className="error">{errors.releases}</p>
                    ) : releases.length > 0 ? (
                        <ul className="release-list">
                            {releases.map(release => (
                                <li key={release.id} className="release-item">
                                    <a href={release.html_url} target="_blank" rel="noopener noreferrer">
                                        <strong>{release.tag_name}</strong>
                                        <span>{release.name || 'No title'}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No releases yet</p>
                    )}
                </div>

                {/* Open Issues */}
                <div className="card issues-card">
                    <h2>Open Issues</h2>
                    {errors.issues ? (
                        <p className="error">{errors.issues}</p>
                    ) : issues.length > 0 ? (
                        <ul className="issue-list">
                            {issues.map(issue => (
                                <li key={issue.id} className="issue-item">
                                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                                        <span className="issue-number">#{issue.number}</span>
                                        <span className="issue-title">{issue.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No open issues 🎉</p>
                    )}
                </div>

                {/* Team */}
                <div className="card team-card">
                    <h2>Development Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <span className="avatar">👨‍💻</span>
                            <div>
                                <strong>Scott</strong>
                                <p>Programmer / Designer</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <span className="avatar">👩‍🎨</span>
                            <div>
                                <strong>Kiki</strong>
                                <p>Art Director / Writer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
