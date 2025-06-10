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
        // Jika belum login, tampilkan pesan dan hentikan proses
        if (!isLoggedIn) {
            setError('Anda harus login untuk melihat bookmark Anda.');
            setLoading(false);
            return;
        }

        const fetchBookmarks = async () => {
            setLoading(true);
            setError(''); // Reset error setiap kali fetch dimulai
            try {
                const response = await api.get('/bookmarks/bookmarks');
                setBookmarks(response.data);
                console.log('Bookmark berhasil dimuat:', response.data); // Log data yang berhasil dimuat
            } catch (err) {
                console.error('Gagal memuat bookmark:', err); // Log error asli untuk debugging

                if (err.response) {
                    // Respons dari server (misal: 401, 403, 500)
                    console.error('Respons Error Backend:', err.response.data);
                    console.error('Status Error Backend:', err.response.status);

                    if (err.response.status === 401 || err.response.status === 403) {
                        setError('Sesi Anda telah berakhir atau Anda tidak diizinkan. Silakan login kembali.');
                        // Opsi: Anda mungkin ingin memicu logout di sini jika token benar-benar tidak valid
                        // atau biarkan interceptor Axios yang menanganinya.
                    } else if (err.response.data && err.response.data.message) {
                        setError(`Gagal memuat bookmark Anda: ${err.response.data.message}`);
                    } else {
                        setError(`Gagal memuat bookmark Anda: Terjadi kesalahan server (${err.response.status}).`);
                    }
                } else if (err.request) {
                    // Permintaan dibuat tetapi tidak ada respons
                    setError('Tidak ada respons dari server. Periksa koneksi internet atau status backend.');
                } else {
                    // Kesalahan lain saat menyiapkan permintaan
                    setError('Terjadi kesalahan saat menyiapkan permintaan. Silakan coba lagi.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [isLoggedIn]); // Bergantung pada isLoggedIn, agar fetch ulang saat status login berubah

    const handleRemoveBookmark = async (recipeId) => {
        if (!isLoggedIn) {
            alert('Anda harus login untuk menghapus bookmark.');
            return;
        }
        if (window.confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
            try {
                const response = await api.delete(`/bookmarks/bookmarks/${recipeId}`);
                // Perbarui state secara optimis atau fetch ulang jika perlu
                setBookmarks(bookmarks.filter(b => b.recipeId !== recipeId));
                alert(response.data.message || 'Bookmark berhasil dihapus!');
            } catch (err) {
                console.error('Gagal menghapus bookmark:', err.response?.data?.message || err.message);
                const errorMessage = err.response?.data?.message || 'Silakan coba lagi.';
                alert('Gagal menghapus bookmark: ' + errorMessage);
                // Opsi: Jika penghapusan gagal karena alasan tertentu (misal: token kedaluwarsa),
                // Anda mungkin ingin me-refresh daftar bookmark.
            }
        }
    };

    // Tampilan kondisi loading dan error
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat bookmark...</div>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem', padding: '1rem', border: '1px solid #ffdddd', backgroundColor: '#fff0f0', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Terjadi Kesalahan:</p>
                <p style={{ margin: '0.5rem 0 0' }}>{error}</p>
                {/* Opsi: Tampilkan tombol coba lagi jika error memungkinkan */}
                {/* <button onClick={fetchBookmarks} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Coba Lagi</button> */}
            </div>
        );
    }

    // Tampilan jika belum login
    if (!isLoggedIn) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f0f0f0' }}>
                Silakan login untuk melihat bookmark Anda.
                <Link to="/login" style={{ display: 'block', marginTop: '1rem', color: '#007bff', textDecoration: 'none' }}>Pergi ke Halaman Login</Link>
            </div>
        );
    }


    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Bookmark Saya</h1>
            {bookmarks.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#555' }}>Anda belum memiliki bookmark.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f9f9f9', transition: 'box-shadow 0.2s ease-in-out', ':hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } }}>
                            {/* Pastikan bookmark.recipe ada sebelum mencoba mengakses propertinya */}
                            {bookmark.recipe ? (
                                <Link to={`/recipes/${bookmark.recipe.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                                    {/* Handle jika image tidak ada */}
                                    <img src={bookmark.recipe.image || 'https://via.placeholder.com/80?text=No+Image'} alt={bookmark.recipe.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '1rem' }} />
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{bookmark.recipe.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Disimpan pada: {new Date(bookmark.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ) : (
                                // Tampilan untuk bookmark tanpa data resep (misal: resep sudah dihapus)
                                <div style={{ flexGrow: 1, color: '#999', fontStyle: 'italic' }}>
                                    Resep tidak tersedia atau telah dihapus.
                                    <p style={{ fontSize: '0.8rem', margin: '0.2rem 0' }}>Disimpan pada: {new Date(bookmark.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}
                            <button
                                onClick={() => handleRemoveBookmark(bookmark.recipe?.id)} // Gunakan optional chaining untuk keamanan
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    marginLeft: '1rem',
                                    flexShrink: 0 // Agar tidak menyusut
                                }}
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