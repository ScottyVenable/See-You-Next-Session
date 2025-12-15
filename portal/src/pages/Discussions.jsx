import { useState, useEffect } from 'react';

export default function Discussions() {
    const [discussions, setDiscussions] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    const owner = import.meta.env.VITE_REPO_OWNER;
    const repo = import.meta.env.VITE_REPO_NAME;

    // Load discussions from localStorage (simple solution for static site)
    useEffect(() => {
        const stored = localStorage.getItem('syns_discussions');
        if (stored) {
            setDiscussions(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    // Save discussions to localStorage
    const saveDiscussions = (newDiscussions) => {
        localStorage.setItem('syns_discussions', JSON.stringify(newDiscussions));
        setDiscussions(newDiscussions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;

        const post = {
            id: crypto.randomUUID(),
            title: newPost.title,
            content: newPost.content,
            author: 'Team Member',
            date: new Date().toISOString(),
            replies: []
        };

        saveDiscussions([post, ...discussions]);
        setNewPost({ title: '', content: '' });
    };

    const addReply = (discussionId, replyText) => {
        const updated = discussions.map(d => {
            if (d.id === discussionId) {
                return {
                    ...d,
                    replies: [
                        ...d.replies,
                        {
                            id: crypto.randomUUID(),
                            content: replyText,
                            author: 'Team Member',
                            date: new Date().toISOString()
                        }
                    ]
                };
            }
            return d;
        });
        saveDiscussions(updated);
    };

    const deleteDiscussion = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            saveDiscussions(discussions.filter(d => d.id !== deleteModal.id));
        }
        setDeleteModal({ show: false, id: null });
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="discussions-page">
            <header className="page-header">
                <h1>💬 Team Discussions</h1>
                <p>Internal discussion board for Scott & Kiki</p>
            </header>

            <div className="info-banner card">
                <p>
                    <strong>📝 Note:</strong> Discussions are stored locally in your browser.
                    For persistent discussions, use{' '}
                    <a
                        href={`https://github.com/${owner}/${repo}/discussions`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub Discussions
                    </a>.
                </p>
            </div>

            <div className="new-post-form card">
                <h3>📝 Start a Discussion</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Discussion title..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="post-title-input"
                    />
                    <textarea
                        placeholder="What's on your mind? Share ideas, feedback, questions..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        className="post-content-input"
                        rows={4}
                    />
                    <button type="submit" className="btn btn-primary">
                        Post Discussion
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="loading-state">Loading discussions...</div>
            ) : discussions.length === 0 ? (
                <div className="empty-state card">
                    <h3>No discussions yet</h3>
                    <p>Start a conversation about the game, share ideas, or ask questions!</p>
                </div>
            ) : (
                <div className="discussions-list">
                    {discussions.map(discussion => (
                        <DiscussionCard
                            key={discussion.id}
                            discussion={discussion}
                            onAddReply={addReply}
                            onDelete={deleteDiscussion}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}

            <div className="github-discussions card">
                <h3>💬 GitHub Discussions</h3>
                <p>For more permanent discussions, use GitHub's built-in feature:</p>
                <a
                    href={`https://github.com/${owner}/${repo}/discussions`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    Open GitHub Discussions →
                </a>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={cancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Discussion?</h3>
                        <p>Are you sure you want to delete this discussion? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete} className="btn btn-danger">
                                Delete
                            </button>
                            <button onClick={cancelDelete} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DiscussionCard({ discussion, onAddReply, onDelete, formatDate }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onAddReply(discussion.id, replyText);
        setReplyText('');
        setShowReplyForm(false);
    };

    return (
        <div className="discussion-card card">
            <div className="discussion-header">
                <h3>{discussion.title}</h3>
                <button
                    onClick={() => onDelete(discussion.id)}
                    className="delete-btn"
                    title="Delete discussion"
                >
                    🗑️
                </button>
            </div>
            <div className="discussion-meta">
                <span>{discussion.author}</span>
                <span>•</span>
                <span>{formatDate(discussion.date)}</span>
            </div>
            <p className="discussion-content">{discussion.content}</p>

            {discussion.replies.length > 0 && (
                <div className="replies">
                    <h4>Replies ({discussion.replies.length})</h4>
                    {discussion.replies.map(reply => (
                        <div key={reply.id} className="reply">
                            <p>{reply.content}</p>
                            <span className="reply-meta">
                                {reply.author} • {formatDate(reply.date)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {showReplyForm ? (
                <form onSubmit={handleReply} className="reply-form">
                    <textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                    />
                    <div className="reply-actions">
                        <button type="submit" className="btn btn-small">Reply</button>
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="btn btn-small btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setShowReplyForm(true)}
                    className="reply-btn"
                >
                    💬 Reply
                </button>
            )}
        </div>
    );
}
