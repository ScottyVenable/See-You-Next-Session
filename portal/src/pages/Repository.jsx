export default function Repository() {
    const owner = import.meta.env.VITE_REPO_OWNER;
    const repo = import.meta.env.VITE_REPO_NAME;
    const repoUrl = `https://github.com/${owner}/${repo}`;

    const quickLinks = [
        { label: '📂 Browse Code', url: repoUrl },
        { label: '🔀 Pull Requests', url: `${repoUrl}/pulls` },
        { label: '📋 Issues', url: `${repoUrl}/issues` },
        { label: '⚙️ Actions', url: `${repoUrl}/actions` },
        { label: '📊 Insights', url: `${repoUrl}/pulse` },
        { label: '⚡ Projects', url: `${repoUrl}/projects` },
    ];

    return (
        <div className="repository-page">
            <header className="page-header">
                <h1>💻 Repository</h1>
                <p>Embedded view of the GitHub repository</p>
            </header>

            <div className="quick-links-bar">
                {quickLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quick-link-btn"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="repo-embed-container">
                <iframe
                    src={`${repoUrl}?tab=readme-ov-file`}
                    title="GitHub Repository"
                    className="repo-iframe"
                />
                <div className="iframe-overlay">
                    <p>GitHub doesn't allow embedding in iframes.</p>
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        🔗 Open Repository in New Tab
                    </a>
                </div>
            </div>

            <div className="repo-info-grid">
                <div className="card">
                    <h3>🔧 Common Git Commands</h3>
                    <div className="command-list">
                        <div className="command">
                            <code>git pull origin main</code>
                            <span>Get latest changes</span>
                        </div>
                        <div className="command">
                            <code>git checkout -b feature/name</code>
                            <span>Create new branch</span>
                        </div>
                        <div className="command">
                            <code>git add . && git commit -m "msg"</code>
                            <span>Stage and commit</span>
                        </div>
                        <div className="command">
                            <code>git push origin branch-name</code>
                            <span>Push to remote</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>📁 Project Structure</h3>
                    <pre className="structure-tree">
                        {`See-You-Next-Session/
├── src/           # Game source code
│   ├── components/  # React components
│   ├── context/     # Game state
│   ├── data/        # Patients, symptoms
│   └── styles/      # CSS files
├── src-tauri/     # Native app (Tauri)
├── portal/        # This dev portal
└── Documents/     # Design docs`}
                    </pre>
                </div>

                <div className="card">
                    <h3>🚀 Development Commands</h3>
                    <div className="command-list">
                        <div className="command">
                            <code>npm run dev</code>
                            <span>Start web dev server</span>
                        </div>
                        <div className="command">
                            <code>npm run tauri:dev</code>
                            <span>Start native app dev</span>
                        </div>
                        <div className="command">
                            <code>npm run build</code>
                            <span>Build for production</span>
                        </div>
                        <div className="command">
                            <code>npm run tauri:build</code>
                            <span>Build native installers</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
