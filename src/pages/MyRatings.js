import React, { useEffect, useState } from 'react';
import api from '../api/index.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';
import RatingStars from '../components/RatingStars.js'; // Reusing the RatingStars component

const MyRatings = () => {
    const { isLoggedIn } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Cek langsung status login saat komponen dimuat
        if (!isLoggedIn) {
            setError('Anda harus login untuk melihat rating Anda.');
            setLoading(false);
            return;
        }

        const fetchRatings = async () => {
            try {
                const response = await api.get('/ratings/my');
                setRatings(response.data);
            } catch (err) {
                console.error('Gagal memuat rating pengguna:', err);
                setError('Gagal memuat rating Anda. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [isLoggedIn]); // Bergantung pada status login

    const handleDeleteRating = async (recipeId) => {
        if (!isLoggedIn) { // Pengecekan keamanan tambahan
            alert('Anda harus login untuk menghapus rating.');
            return;
        }
        if (window.confirm('Apakah Anda yakin ingin menghapus rating ini?')) {
            try {
                await api.delete(`/ratings/recipe/${recipeId}`);
                setRatings(ratings.filter(r => r.recipeId !== recipeId));
                alert('Rating berhasil dihapus!');
            } catch (err) {
                console.error('Gagal menghapus rating:', err.response?.data?.message || err.message);
                alert('Gagal menghapus rating: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat rating...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;
    // Tampilkan pesan khusus jika tidak login
    if (!isLoggedIn) return <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' }}>Silakan login untuk melihat rating Anda.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Rating Saya</h1>
            {ratings.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Anda belum memberi rating pada resep apa pun.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {ratings.map((rating) => (
                        <div key={rating.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f9f9f9' }}>
                            <Link to={`/recipes/${rating.recipe.id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                                <img src={rating.recipe.image} alt={rating.recipe.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', marginRight: '1rem' }} />
                                <div>
                                    <h3 style={{ margin: 0 }}>{rating.recipe.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0' }}>Rating Anda:</p>
                                    <RatingStars recipeId={rating.recipe.id} initialRating={rating.rating} onRatingChange={() => { /* no-op for display */ }} />
                                </div>
                            </Link>
                            <button
                                onClick={() => handleDeleteRating(rating.recipe.id)}
                                style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Hapus Rating
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRatings;
