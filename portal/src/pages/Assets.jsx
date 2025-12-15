import { useState } from 'react';

// Asset folders configuration
// Update these with your actual Google Drive folder links
const assetFolders = [
    {
        title: 'Character Sprites',
        description: 'Patient base sprites, expressions, and symptom overlays',
        icon: '👤',
        driveUrl: '', // Add Google Drive folder link
        items: [
            { name: 'Base Sprites', status: 'in-progress' },
            { name: 'Expressions', status: 'pending' },
            { name: 'Symptom Overlays', status: 'pending' },
        ]
    },
    {
        title: 'UI Elements',
        description: 'Buttons, frames, icons, and interface components',
        icon: '🖼️',
        driveUrl: '',
        items: [
            { name: 'Clipboard UI', status: 'pending' },
            { name: 'Focus Meter', status: 'pending' },
            { name: 'Turn Clock', status: 'pending' },
            { name: 'Token Icons', status: 'pending' },
        ]
    },
    {
        title: 'Backgrounds',
        description: 'Office scenes, menu backgrounds, transitions',
        icon: '🏢',
        driveUrl: '',
        items: [
            { name: 'Therapy Office', status: 'pending' },
            { name: 'Main Menu BG', status: 'pending' },
        ]
    },
    {
        title: 'Audio - Music',
        description: 'Background music and ambient tracks',
        icon: '🎵',
        driveUrl: '',
        items: [
            { name: 'Menu Theme', status: 'pending' },
            { name: 'Session BGM', status: 'pending' },
            { name: 'Focus Mode Ambience', status: 'pending' },
        ]
    },
    {
        title: 'Audio - SFX',
        description: 'Sound effects for UI and gameplay',
        icon: '🔊',
        driveUrl: '',
        items: [
            { name: 'Token Pickup', status: 'pending' },
            { name: 'Token Drop', status: 'pending' },
            { name: 'Breakthrough Chime', status: 'pending' },
            { name: 'Error Buzz', status: 'pending' },
            { name: 'Clock Tick', status: 'pending' },
        ]
    },
    {
        title: 'Fonts',
        description: 'Typography for UI and dialogue',
        icon: '🔤',
        driveUrl: '',
        items: [
            { name: 'Header Font', status: 'pending' },
            { name: 'Body Font', status: 'pending' },
        ]
    },
];

const statusColors = {
    'complete': '#22c55e',
    'in-progress': '#eab308',
    'pending': '#6b7280'
};

const statusLabels = {
    'complete': '✅ Complete',
    'in-progress': '🔄 In Progress',
    'pending': '⏳ Pending'
};

export default function Assets() {
    const [expandedFolder, setExpandedFolder] = useState(null);

    const toggleFolder = (index) => {
        setExpandedFolder(expandedFolder === index ? null : index);
    };

    return (
        <div className="assets-page">
            <header className="page-header">
                <h1>🎨 Asset Library</h1>
                <p>Google Drive links to art and audio assets</p>
            </header>

            <div className="info-banner card">
                <p>
                    <strong>💡 For Kiki:</strong> Add your Google Drive folder links by editing{' '}
                    <code>portal/src/pages/Assets.jsx</code> and updating the <code>driveUrl</code> fields.
                </p>
            </div>

            <div className="asset-folders">
                {assetFolders.map((folder, index) => (
                    <div key={index} className="asset-folder card">
                        <div
                            className="folder-header"
                            onClick={() => toggleFolder(index)}
                        >
                            <span className="folder-icon">{folder.icon}</span>
                            <div className="folder-info">
                                <h3>{folder.title}</h3>
                                <p>{folder.description}</p>
                            </div>
                            <div className="folder-stats">
                                <span className="item-count">{folder.items.length} items</span>
                                <span className="expand-icon">
                                    {expandedFolder === index ? '▼' : '▶'}
                                </span>
                            </div>
                        </div>

                        {expandedFolder === index && (
                            <div className="folder-content">
                                <div className="folder-actions">
                                    {folder.driveUrl ? (
                                        <a
                                            href={folder.driveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                        >
                                            📁 Open in Google Drive
                                        </a>
                                    ) : (
                                        <span className="btn btn-disabled">No Drive link set</span>
                                    )}
                                </div>

                                <div className="asset-checklist">
                                    <h4>Asset Checklist</h4>
                                    <ul>
                                        {folder.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className={`checklist-item ${item.status}`}>
                                                <span
                                                    className="status-dot"
                                                    style={{ backgroundColor: statusColors[item.status] }}
                                                />
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-status">{statusLabels[item.status]}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="upload-guide card">
                <h3>📤 Uploading Assets</h3>
                <ol>
                    <li>Create folders in Google Drive matching the categories above</li>
                    <li>Upload your assets to the appropriate folder</li>
                    <li>Copy the folder's sharing link (set to "Anyone with link can view")</li>
                    <li>Update the <code>driveUrl</code> in <code>portal/src/pages/Assets.jsx</code></li>
                </ol>
            </div>
        </div>
    );
}
