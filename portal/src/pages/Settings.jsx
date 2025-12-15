import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
    const { changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newHash, setNewHash] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        const result = await changePassword(currentPassword, newPassword);

        if (result.success) {
            setNewHash(result.newHash);
            setMessage({
                type: 'success',
                text: 'Password verified! Update the GitHub secret with the new hash below.'
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: 'Current password is incorrect' });
        }
    };

    const copyHash = () => {
        navigator.clipboard.writeText(newHash);
        setMessage({ type: 'success', text: 'Hash copied to clipboard!' });
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>⚙️ Settings</h1>
                <p>Portal configuration and password management</p>
            </header>

            <div className="settings-grid">
                <div className="card password-card">
                    <h2>🔐 Change Password</h2>
                    <p className="card-description">
                        Since this is a static site, password changes require updating a GitHub secret.
                    </p>

                    <form onSubmit={handlePasswordChange} className="password-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            Generate New Hash
                        </button>
                    </form>

                    {newHash && (
                        <div className="hash-result">
                            <h3>New Password Hash</h3>
                            <p>Update this value in your GitHub repository secrets:</p>
                            <div className="hash-display">
                                <code>{newHash}</code>
                                <button onClick={copyHash} className="copy-btn">📋 Copy</button>
                            </div>
                            <div className="hash-instructions">
                                <h4>How to update:</h4>
                                <ol>
                                    <li>Go to your repository on GitHub</li>
                                    <li>Navigate to Settings → Secrets and variables → Actions</li>
                                    <li>Find or create <code>DEV_PASSWORD_HASH</code></li>
                                    <li>Update it with the hash above</li>
                                    <li>The change takes effect on next deployment</li>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2>🔗 Quick Links</h2>
                    <div className="settings-links">
                        <a
                            href={`https://github.com/${import.meta.env.VITE_REPO_OWNER}/${import.meta.env.VITE_REPO_NAME}/settings/secrets/actions`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="settings-link"
                        >
                            🔐 Repository Secrets
                        </a>
                        <a
                            href={`https://github.com/${import.meta.env.VITE_REPO_OWNER}/${import.meta.env.VITE_REPO_NAME}/settings/pages`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="settings-link"
                        >
                            📄 GitHub Pages Settings
                        </a>
                        <a
                            href={`https://github.com/${import.meta.env.VITE_REPO_OWNER}/${import.meta.env.VITE_REPO_NAME}/actions`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="settings-link"
                        >
                            ⚙️ GitHub Actions
                        </a>
                    </div>
                </div>

                <div className="card">
                    <h2>📋 Initial Setup</h2>
                    <p>To set up authentication for the first time:</p>
                    <ol>
                        <li>Choose a password</li>
                        <li>Generate its SHA-256 hash using the form above (or online tool)</li>
                        <li>Add the hash as <code>DEV_PASSWORD_HASH</code> in GitHub Secrets</li>
                        <li>Push changes to trigger deployment</li>
                    </ol>

                    <div className="hash-generator">
                        <h4>Quick Hash Generator</h4>
                        <p>Enter a password to see its hash:</p>
                        <HashGenerator />
                    </div>
                </div>

                <div className="card">
                    <h2>🎨 Portal Info</h2>
                    <dl className="info-list">
                        <dt>Version</dt>
                        <dd>1.0.0</dd>
                        <dt>Repository</dt>
                        <dd>{import.meta.env.VITE_REPO_OWNER}/{import.meta.env.VITE_REPO_NAME}</dd>
                        <dt>Built with</dt>
                        <dd>React + Vite + GitHub Pages</dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}

function HashGenerator() {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');

    const generateHash = async () => {
        if (!input) return;
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
    };

    return (
        <div className="hash-gen">
            <input
                type="text"
                placeholder="Enter password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={generateHash} className="btn btn-small">Generate</button>
            {hash && (
                <div className="hash-output">
                    <code>{hash}</code>
                </div>
            )}
        </div>
    );
}
