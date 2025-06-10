// CommentSection.js
import React, { useState, useEffect, useCallback } from 'react'; 
import api from '../api/index.js';
import { useAuth } from '../auth/AuthContext.js';

const CommentSection = ({ recipeId }) => {
    const { user, isLoggedIn } = useAuth();
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [replyToParentId, setReplyToParentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetchComments = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/comments/recipe/${recipeId}?page=${pageNumber}&limit=5`); // Fetch 5 comments per page
            setComments(response.data.comments);
            setTotalPages(response.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            console.error('Gagal memuat komentar:', err);
            setError('Gagal memuat komentar.');
        } finally {
            setLoading(false);
        }
    }, [recipeId]); 

    useEffect(() => {
        fetchComments();
    }, [recipeId, fetchComments]); // Menambahkan fetchComments ke dependensi useEffect

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Silakan login untuk berkomentar.');
            return;
        }
        if (!newCommentContent.trim()) {
            alert('Komentar tidak boleh kosong.');
            return;
        }
        try {
            const payload = {
                content: newCommentContent.trim(),
                parentId: replyToParentId,
            };
            const response = await api.post(`/comments/recipe/${recipeId}`, payload);
            alert(response.data.message);
            setNewCommentContent('');
            setReplyToParentId(null); // Reset reply state
            fetchComments(); // Re-fetch comments to update the list
        } catch (err) {
            console.error('Gagal memposting komentar:', err.response?.data?.message || err.message);
            alert('Gagal menambahkan komentar: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!isLoggedIn) {
            alert('Anda tidak diizinkan menghapus komentar.');
            return;
        }
        if (window.confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
            try {
                await api.delete(`/comments/${commentId}`);
                alert('Komentar berhasil dihapus.');
                fetchComments(); // Re-fetch comments
            } catch (err) {
                console.error('Gagal menghapus komentar:', err.response?.data?.message || err.message);
                alert('Gagal menghapus komentar: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
            }
        }
    };

    if (loading) return <div>Memuat komentar...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h3>Komentar</h3>
            {isLoggedIn && (
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <textarea
                        placeholder={replyToParentId ? `Balas komentar...` : "Tulis komentar Anda..."}
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        rows="3"
                        maxLength="300"
                        style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {replyToParentId && (
                            <button
                                type="button"
                                onClick={() => { setNewCommentContent(''); setReplyToParentId(null); }}
                                style={{ padding: '0.6rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Batal Balas
                            </button>
                        )}
                        <button
                            type="submit"
                            style={{ padding: '0.6rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Kirim Komentar
                        </button>
                    </div>
                </form>
            )}

            {comments.length === 0 && <p>Belum ada komentar.</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map(comment => (
                    <div key={comment.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f9f9f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{comment.user?.name || 'Pengguna Tidak Dikenal'}</p>
                            <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <p style={{ margin: '0.5rem 0' }}>{comment.content}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem' }}>
                            {isLoggedIn && !comment.parentId && ( // Hanya izinkan membalas komentar tingkat atas
                                <button
                                    onClick={() => { setReplyToParentId(comment.id); setNewCommentContent(''); }}
                                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
                                >
                                    Balas
                                </button>
                            )}
                            {(isLoggedIn && (user.id === comment.userId || user.role === 'admin')) && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}
                                >
                                    Hapus
                                </button>
                            )}
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                            <div style={{ marginLeft: '2rem', marginTop: '1rem', borderLeft: '2px solid #ddd', paddingLeft: '1rem' }}>
                                {comment.replies.map(reply => (
                                    <div key={reply.id} style={{ border: '1px solid #eee', padding: '0.8rem', borderRadius: '8px', background: '#f0f0f0', marginBottom: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.9rem' }}>{reply.user?.name || 'Pengguna Tidak Dikenal'}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>
                                                {new Date(reply.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <p style={{ margin: '0.3rem 0', fontSize: '0.9rem' }}>{reply.content}</p>
                                        {(isLoggedIn && (user.id === reply.userId || user.role === 'admin')) && (
                                            <button
                                                onClick={() => handleDeleteComment(reply.id)}
                                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                    <button
                        key={pNum}
                        onClick={() => fetchComments(pNum)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: page === pNum ? '#007bff' : '#f0f0f0',
                            color: page === pNum ? 'white' : '#333',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {pNum}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;