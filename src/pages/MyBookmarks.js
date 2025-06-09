import React, { useEffect, useState } from 'react';
import api from '../api/index.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

const MyBookmarks = () => {
    const { isLoggedIn } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            setError('Anda harus login untuk melihat bookmark Anda.');
            setLoading(false);
            return;
        }

        const fetchBookmarks = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get('/bookmarks');
                setBookmarks(response.data);
                console.log('Bookmark berhasil dimuat:', response.data); // Log data yang berhasil dimuat
            } catch (err) {
                console.error('Gagal memuat bookmark:', err);
                if (err.response) {
                    console.error('Respons Error Backend:', err.response.data);
                    console.error('Status Error Backend:', err.response.status);
                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Sesi Anda telah berakhir atau Anda tidak diizinkan. Silakan login kembali.');
                    } else {
                        setError(`Gagal memuat bookmark Anda: ${err.response.data.message || 'Terjadi kesalahan server.'}`);
                    }
                } else if (err.request) {
                    setError('Tidak ada respons dari server. Periksa koneksi atau status backend.');
                } else {
                    setError('Terjadi kesalahan saat menyiapkan permintaan. Silakan coba lagi.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarks();
    }, [isLoggedIn]);

    const handleRemoveBookmark = async (recipeId) => {
        if (!isLoggedIn) {
            alert('Anda harus login untuk menghapus bookmark.');
            return;
        }
        if (window.confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
            try {
                const response = await api.delete(`/bookmarks/${recipeId}`);
                setBookmarks(bookmarks.filter(b => b.recipeId !== recipeId));
                alert(response.data.message || 'Bookmark berhasil dihapus!');
            } catch (err) {
                console.error('Gagal menghapus bookmark:', err.response?.data?.message || err.message);
                alert('Gagal menghapus bookmark: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat bookmark...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;
    if (!isLoggedIn) return <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>Silakan login untuk melihat bookmark Anda.</div>;


    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Bookmark Saya</h1>
            {bookmarks.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Anda belum memiliki bookmark.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f9f9f9' }}>
                            {/* Pastikan bookmark.recipe ada sebelum mencoba mengakses propertinya */}
                            {bookmark.recipe ? (
                                <Link to={`/recipes/${bookmark.recipe.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                                    <img src={bookmark.recipe.image} alt={bookmark.recipe.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '1rem' }} />
                                    <div>
                                        <h3 style={{ margin: 0 }}>{bookmark.recipe.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Disimpan pada: {new Date(bookmark.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ) : (
                                <div style={{ flexGrow: 1 }}>Resep tidak tersedia</div>
                            )}
                            <button
                                onClick={() => handleRemoveBookmark(bookmark.recipe.id)}
                                style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookmarks;
