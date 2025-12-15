import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import * as GitHubAPI from '../services/github';

export default function Dashboard() {
    const { settings, discussions } = useFirebase();
    const [repoStats, setRepoStats] = useState(null);
    const [commits, setCommits] = useState([]);
    const [issues, setIssues] = useState([]);
    const [workflowRuns, setWorkflowRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchGitHubData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [stats, commitsData, issuesData, workflowData] = await Promise.all([
                    GitHubAPI.getRepoStats().catch(() => null),
                    GitHubAPI.getCommits('develop', 5).catch(() => []),
                    GitHubAPI.getIssues('open', 5).catch(() => []),
                    GitHubAPI.getWorkflowRuns(3).catch(() => []),
                ]);

                setRepoStats(stats);
                setCommits(commitsData);
                setIssues(issuesData);
                setWorkflowRuns(workflowData);
            } catch (err) {
                console.error('Error fetching GitHub data:', err);
                setErrors({ general: 'Failed to load GitHub data' });
            }
            setLoading(false);
        };

        fetchGitHubData();
        // Refresh data every 2 minutes
        const interval = setInterval(fetchGitHubData, 120000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeAgo = (date) => {
        if (!date) return '';
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getStatusColor = (conclusion) => {
        switch (conclusion) {
            case 'success': return 'status-success';
            case 'failure': return 'status-error';
            case 'pending': case null: return 'status-warning';
            default: return 'status-neutral';
        }
    };

    return (
        <div className="dashboard">
            <header className="page-header">
                <h1>📊 Dashboard</h1>
                <p>Welcome to the See You Next Session development portal</p>
            </header>

            {/* Google Drive Quick Access */}
            {settings.googleDriveUrl && (
                <div className="drive-banner card">
                    <div className="drive-info">
                        <span className="drive-icon">📁</span>
                        <div>
                            <strong>Shared Google Drive</strong>
                            <p>Access project files, art assets, and documents</p>
                        </div>
                    </div>
                    <a
                        href={settings.googleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Open Drive →
                    </a>
                </div>
            )}

            <div className="dashboard-grid">
                {/* Project Stats */}
                <div className="card stats-card">
                    <h2>📈 Project Stats</h2>
                    {loading ? (
                        <div className="loading-state"><div className="spinner small"></div></div>
                    ) : repoStats ? (
                        <div className="stats-grid">
                            <div className="stat">
                                <span className="stat-value">{repoStats.openIssues}</span>
                                <span className="stat-label">📋 Open Issues</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{repoStats.openPRs}</span>
                                <span className="stat-label">🔀 Open PRs</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{discussions.length}</span>
                                <span className="stat-label">💬 Discussions</span>
                            </div>
                        </div>
                    ) : (
                        <p className="error">Unable to load stats</p>
                    )}
                </div>

                {/* Quick Links */}
                <div className="card quick-links-card">
                    <h2>⚡ Quick Links</h2>
                    <div className="quick-links">
                        <Link to="/play" className="quick-link">🎮 Play Latest Build</Link>
                        <Link to="/documents" className="quick-link">📄 Project Docs</Link>
                        <Link to="/discussions" className="quick-link">💬 Discussions</Link>
                        <Link to="/settings" className="quick-link">⚙️ Settings</Link>
                    </div>
                </div>

                {/* Recent Commits */}
                <div className="card commits-card">
                    <h2>📝 Recent Commits</h2>
                    {commits.length > 0 ? (
                        <ul className="commit-list">
                            {commits.map((commit) => (
                                <li key={commit.sha} className="commit-item">
                                    <div className="commit-info">
                                        <span className="commit-sha">{commit.shortSha}</span>
                                        <span className="commit-message">{commit.message.split('\n')[0]}</span>
                                    </div>
                                    <div className="commit-meta">
                                        <span className="commit-author">{commit.author}</span>
                                        <span className="commit-time">{formatTimeAgo(commit.date)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No commits found</p>
                    )}
                </div>

                {/* Build Status */}
                <div className="card builds-card">
                    <h2>🔧 Build Status</h2>
                    {workflowRuns.length > 0 ? (
                        <ul className="workflow-list">
                            {workflowRuns.map((run) => (
                                <li key={run.id} className="workflow-item">
                                    <span className={`workflow-status ${getStatusColor(run.conclusion)}`}>
                                        {run.conclusion === 'success' ? '✅' : run.conclusion === 'failure' ? '❌' : '🔄'}
                                    </span>
                                    <div className="workflow-info">
                                        <span className="workflow-name">{run.name}</span>
                                        <span className="workflow-branch">{run.branch}</span>
                                    </div>
                                    <span className="workflow-time">{formatTimeAgo(run.createdAt)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No recent builds</p>
                    )}
                </div>

                {/* Open Issues */}
                <div className="card issues-card">
                    <h2>🐛 Open Issues</h2>
                    {issues.length > 0 ? (
                        <ul className="issue-list">
                            {issues.map((issue) => (
                                <li key={issue.number} className="issue-item">
                                    <span className="issue-number">#{issue.number}</span>
                                    <span className="issue-title">{issue.title}</span>
                                    <div className="issue-labels">
                                        {issue.labels.slice(0, 2).map((label) => (
                                            <span
                                                key={label.name}
                                                className="issue-label"
                                                style={{ backgroundColor: `#${label.color}` }}
                                            >
                                                {label.name}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No open issues 🎉</p>
                    )}
                </div>

                {/* Team */}
                <div className="card team-card">
                    <h2>👥 Development Team</h2>
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
