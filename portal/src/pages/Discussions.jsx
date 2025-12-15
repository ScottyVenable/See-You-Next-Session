import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useAuth } from '../context/AuthContext';

export default function Discussions() {
    const { discussions, loading, error, addDiscussion, addReply, deleteDiscussion } = useFirebase();
    const { user } = useAuth();
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;

        setSubmitting(true);
        try {
            await addDiscussion(newPost.title, newPost.content, user || 'Team Member');
            setNewPost({ title: '', content: '' });
        } catch (err) {
            console.error('Error posting discussion:', err);
            alert('Failed to post discussion. Please try again.');
        }
        setSubmitting(false);
    };

    const handleAddReply = async (discussionId, replyText) => {
        try {
            await addReply(discussionId, replyText, user || 'Team Member');
        } catch (err) {
            console.error('Error adding reply:', err);
            alert('Failed to add reply. Please try again.');
        }
    };

    const handleDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async () => {
        if (deleteModal.id) {
            try {
                await deleteDiscussion(deleteModal.id);
            } catch (err) {
                console.error('Error deleting discussion:', err);
                alert('Failed to delete discussion.');
            }
        }
        setDeleteModal({ show: false, id: null });
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null });
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="discussions-page">
            <header className="page-header">
                <h1>💬 Team Discussions</h1>
                <p>Real-time discussion board for Scott & Kiki — changes sync instantly!</p>
            </header>

            <div className="sync-banner card">
                <div className="sync-indicator">
                    <span className={`sync-dot ${loading ? 'syncing' : 'synced'}`}></span>
                    <span>{loading ? 'Syncing...' : '🔄 Real-time sync enabled'}</span>
                </div>
                <p className="sync-info">
                    Discussions are stored in Firebase and sync across all devices instantly.
                    When you post, Kiki sees it immediately!
                </p>
            </div>

            {error && (
                <div className="error-banner card">
                    <p>⚠️ Connection error: {error}</p>
                    <p>Discussions may not sync properly. Please refresh the page.</p>
                </div>
            )}

            <div className="new-post-form card">
                <h3>📝 Start a Discussion</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Discussion title..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="post-title-input"
                        disabled={submitting}
                    />
                    <textarea
                        placeholder="What's on your mind? Share ideas, feedback, questions..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        className="post-content-input"
                        rows={4}
                        disabled={submitting}
                    />
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? '⏳ Posting...' : '📤 Post Discussion'}
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading discussions...</p>
                </div>
            ) : discussions.length === 0 ? (
                <div className="empty-state card">
                    <h3>No discussions yet</h3>
                    <p>Start a conversation about the game, share ideas, or ask questions!</p>
                </div>
            ) : (
                <div className="discussions-list">
                    {discussions.map((discussion) => (
                        <DiscussionCard
                            key={discussion.id}
                            discussion={discussion}
                            onAddReply={handleAddReply}
                            onDelete={handleDelete}
                            formatDate={formatDate}
                            currentUser={user}
                        />
                    ))}
                </div>
            )}

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

function DiscussionCard({ discussion, onAddReply, onDelete, formatDate, currentUser }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSubmitting(true);
        await onAddReply(discussion.id, replyText);
        setReplyText('');
        setShowReplyForm(false);
        setSubmitting(false);
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
                <span className="author-badge">{discussion.author}</span>
                <span>•</span>
                <span>{formatDate(discussion.createdAt)}</span>
            </div>
            <p className="discussion-content">{discussion.content}</p>

            {discussion.replies && discussion.replies.length > 0 && (
                <div className="replies">
                    <h4>💬 Replies ({discussion.replies.length})</h4>
                    {discussion.replies.map((reply) => (
                        <div key={reply.id} className="reply">
                            <p>{reply.content}</p>
                            <span className="reply-meta">
                                <span className="author-badge small">{reply.author}</span> •{' '}
                                {formatDate(reply.createdAt)}
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
                        disabled={submitting}
                    />
                    <div className="reply-actions">
                        <button type="submit" className="btn btn-small" disabled={submitting}>
                            {submitting ? '⏳' : '📤'} Reply
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="btn btn-small btn-secondary"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowReplyForm(true)} className="reply-btn">
                    💬 Reply
                </button>
            )}
        </div>
    );
}
