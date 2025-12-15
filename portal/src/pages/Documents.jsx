import { useState } from 'react';

// Document links configuration
// Update these with your actual Google Docs links
const documents = {
    design: [
        {
            title: 'Game Design Document (GDD)',
            description: 'Complete game design specifications and mechanics',
            url: '', // Add Google Docs link
            icon: '📋',
            local: '/Documents/Game_Design_Document.md'
        },
        {
            title: 'Technical Architecture',
            description: 'Data structures, systems, and code organization',
            url: '',
            icon: '🔧',
            local: '/Documents/Technical_Architecture.md'
        },
        {
            title: 'Development Roadmap',
            description: 'Sprint planning and milestone tracking',
            url: '',
            icon: '🗺️',
            local: '/Documents/Development_Roadmap.md'
        },
        {
            title: 'Patient Roster',
            description: 'Character profiles and patient data',
            url: '',
            icon: '🧑‍⚕️',
            local: '/Documents/Patient_Roster.md'
        },
    ],
    art: [
        {
            title: 'Asset List',
            description: 'Required sprites, UI elements, and audio',
            url: '',
            icon: '🎨',
            local: '/Documents/Asset_List.md'
        },
        {
            title: 'Style Guide',
            description: 'Visual style, color palette, typography',
            url: '',
            icon: '🖌️'
        },
        {
            title: 'Character Designs',
            description: 'Patient character concepts and expressions',
            url: '',
            icon: '👤'
        },
    ],
    writing: [
        {
            title: 'Dialogue Script',
            description: 'Patient dialogue and narrative content',
            url: '',
            icon: '💬'
        },
        {
            title: 'Sensitivity Guidelines',
            description: 'Mental health representation standards',
            url: '',
            icon: '💚'
        },
    ]
};

export default function Documents() {
    const [activeTab, setActiveTab] = useState('design');

    const tabs = [
        { id: 'design', label: '📋 Design', docs: documents.design },
        { id: 'art', label: '🎨 Art', docs: documents.art },
        { id: 'writing', label: '✍️ Writing', docs: documents.writing },
    ];

    const owner = import.meta.env.VITE_REPO_OWNER;
    const repo = import.meta.env.VITE_REPO_NAME;

    return (
        <div className="documents-page">
            <header className="page-header">
                <h1>📄 Documents</h1>
                <p>Project documentation and Google Docs links</p>
            </header>

            <div className="info-banner card">
                <p>
                    <strong>💡 Tip:</strong> Add your Google Docs links by editing{' '}
                    <code>portal/src/pages/Documents.jsx</code>
                </p>
            </div>

            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="documents-grid">
                {tabs.find(t => t.id === activeTab)?.docs.map((doc, index) => (
                    <div key={index} className="document-card card">
                        <div className="document-icon">{doc.icon}</div>
                        <div className="document-info">
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>
                        </div>
                        <div className="document-links">
                            {doc.url ? (
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    📝 Open in Google Docs
                                </a>
                            ) : (
                                <span className="btn btn-disabled">No link set</span>
                            )}
                            {doc.local && (
                                <a
                                    href={`https://github.com/${owner}/${repo}/blob/main${doc.local}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                >
                                    📂 View on GitHub
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-document card">
                <h3>📎 Add a Document</h3>
                <p>To add new document links:</p>
                <ol>
                    <li>Edit <code>portal/src/pages/Documents.jsx</code></li>
                    <li>Add your Google Docs sharing link to the appropriate category</li>
                    <li>Commit and push to trigger a new deployment</li>
                </ol>
            </div>
        </div>
    );
}
