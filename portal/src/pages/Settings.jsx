import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';

export default function Settings() {
    const { changePassword } = useAuth();
    const { settings, updateSettings, sharedFiles, addSharedFile, deleteSharedFile } = useFirebase();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [newHash, setNewHash] = useState('');

    // Google Drive settings
    const [driveUrl, setDriveUrl] = useState(settings.googleDriveUrl || '');
    const [driveSaving, setDriveSaving] = useState(false);

    // Shared link form
    const [newLink, setNewLink] = useState({ name: '', url: '', type: 'link' });
    const [linkSaving, setLinkSaving] = useState(false);

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

    const handleDriveSave = async () => {
        setDriveSaving(true);
        try {
            await updateSettings({ googleDriveUrl: driveUrl });
            setMessage({ type: 'success', text: 'Google Drive link saved!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save Google Drive link' });
        }
        setDriveSaving(false);
    };

    const handleAddLink = async (e) => {
        e.preventDefault();
        if (!newLink.name || !newLink.url) return;

        setLinkSaving(true);
        try {
            await addSharedFile({
                name: newLink.name,
                url: newLink.url,
                type: newLink.type,
                addedBy: 'Team Member',
            });
            setNewLink({ name: '', url: '', type: 'link' });
            setMessage({ type: 'success', text: 'Link added!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add link' });
        }
        setLinkSaving(false);
    };

    const handleDeleteLink = async (id) => {
        if (!confirm('Delete this shared link?')) return;
        try {
            await deleteSharedFile(id);
        } catch (err) {
            alert('Failed to delete link');
        }
    };

    const copyHash = async () => {
        try {
            await navigator.clipboard.writeText(newHash);
            setMessage({ type: 'success', text: 'Hash copied to clipboard!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to copy hash. Please copy manually.' });
        }
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>⚙️ Settings</h1>
                <p>Portal configuration, shared links, and Firebase-synced settings</p>
            </header>

            <div className="settings-grid">
                {/* Google Drive Settings */}
                <div className="card drive-settings-card">
                    <h2>📁 Google Drive</h2>
                    <p className="card-description">
                        Set the shared Google Drive folder URL. This syncs across all team members!
                    </p>

                    <div className="form-group">
                        <label>Google Drive Folder URL</label>
                        <input
                            type="url"
                            value={driveUrl}
                            onChange={(e) => setDriveUrl(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                        />
                    </div>
                    <button
                        onClick={handleDriveSave}
                        className="btn btn-primary"
                        disabled={driveSaving}
                    >
                        {driveSaving ? '⏳ Saving...' : '💾 Save Drive Link'}
                    </button>

                    {settings.googleDriveUrl && (
                        <div className="current-drive">
                            <p>Current link:</p>
                            <a
                                href={settings.googleDriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {settings.googleDriveUrl}
                            </a>
                        </div>
                    )}
                </div>

                {/* Shared Links */}
                <div className="card shared-links-card">
                    <h2>🔗 Shared Links</h2>
                    <p className="card-description">
                        Add important links that both Scott and Kiki can access.
                    </p>

                    <form onSubmit={handleAddLink} className="add-link-form">
                        <input
                            type="text"
                            placeholder="Link name..."
                            value={newLink.name}
                            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                            disabled={linkSaving}
                        />
                        <input
                            type="url"
                            placeholder="https://..."
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            disabled={linkSaving}
                        />
                        <select
                            value={newLink.type}
                            onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}
                            disabled={linkSaving}
                        >
                            <option value="link">🔗 Link</option>
                            <option value="doc">📄 Document</option>
                            <option value="design">🎨 Design</option>
                            <option value="audio">🎵 Audio</option>
                            <option value="reference">📚 Reference</option>
                        </select>
                        <button type="submit" className="btn btn-primary" disabled={linkSaving}>
                            {linkSaving ? '⏳' : '➕'} Add
                        </button>
                    </form>

                    {sharedFiles.length > 0 ? (
                        <ul className="shared-links-list">
                            {sharedFiles.map((file) => (
                                <li key={file.id} className="shared-link-item">
                                    <span className="link-type">
                                        {file.type === 'doc' && '📄'}
                                        {file.type === 'design' && '🎨'}
                                        {file.type === 'audio' && '🎵'}
                                        {file.type === 'reference' && '📚'}
                                        {file.type === 'link' && '🔗'}
                                    </span>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                        {file.name}
                                    </a>
                                    <span className="link-meta">by {file.addedBy}</span>
                                    <button
                                        onClick={() => handleDeleteLink(file.id)}
                                        className="delete-link-btn"
                                        title="Delete link"
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty">No shared links yet</p>
                    )}
                </div>

                {/* Password Change */}
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
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="card">
                    <h2>🔗 GitHub Settings</h2>
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

                {/* Portal Info */}
                <div className="card">
                    <h2>🎨 Portal Info</h2>
                    <dl className="info-list">
                        <dt>Version</dt>
                        <dd>1.1.0</dd>
                        <dt>Repository</dt>
                        <dd>{import.meta.env.VITE_REPO_OWNER}/{import.meta.env.VITE_REPO_NAME}</dd>
                        <dt>Built with</dt>
                        <dd>React + Vite + Firebase</dd>
                        <dt>Real-time Sync</dt>
                        <dd>✅ Enabled</dd>
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
