import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/index.js';
import { useAuth } from '../auth/AuthContext';
import CommentSection from '../components/CommentSection';
import RatingStars from '../components/RatingStars';

const RecipeDetail = () => {
    const { id } = useParams();
    const { isLoggedIn, user } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0); // Untuk rating pengguna sendiri
    const [isBookmarked, setIsBookmarked] = useState(false); // Untuk melacak status bookmark

    const fetchRecipeAndData = async () => {
        setLoading(true);
        setError(''); // Reset pesan kesalahan

        try {
            // Ambil data resep utama
            const recipeRes = await api.get(`/recipes/${id}`);
            setRecipe(recipeRes.data);
            console.log('Resep berhasil dimuat:', recipeRes.data);

            // Ambil rating rata-rata
            const avgRatingRes = await api.get(`/ratings/recipe/${id}`);
            setAverageRating(avgRatingRes.data.average);
            console.log('Rating rata-rata berhasil dimuat:', avgRatingRes.data);

            if (isLoggedIn) {
                // Periksa apakah pengguna telah memberi rating resep ini
                try {
                    const userRatingsRes = await api.get('/ratings/my');
                    const foundUserRating = userRatingsRes.data.find(r => r.recipeId === parseInt(id));
                    setUserRating(foundUserRating ? foundUserRating.rating : 0);
                    console.log('Rating pengguna berhasil dimuat:', userRatingsRes.data);
                } catch (err) {
                    console.error('Gagal memuat rating pengguna:', err.response?.data || err.message);
                    // Lanjutkan eksekusi meskipun rating pengguna gagal dimuat
                }

                // Periksa apakah pengguna telah membookmark resep ini
                try {
                    const userBookmarksRes = await api.get('/bookmarks');
                    const foundBookmark = userBookmarksRes.data.some(b => b.recipeId === parseInt(id));
                    setIsBookmarked(foundBookmark);
                    console.log('Bookmark pengguna berhasil dimuat:', userBookmarksRes.data);
                } catch (err) {
                    console.error('Gagal memuat bookmark pengguna:', err.response?.data || err.message);
                    // Lanjutkan eksekusi meskipun bookmark pengguna gagal dimuat
                }
            } else {
                setUserRating(0);
                setIsBookmarked(false);
            }

        } catch (err) {
            // Tangani error secara umum dan log objek error lengkap
            console.error('Terjadi kesalahan saat memuat data resep:', err);
            if (err.response) {
                // Error dari server (misalnya, status code 4xx, 5xx)
                console.error('Data Respons Error:', err.response.data);
                console.error('Status Error:', err.response.status);
                console.error('Headers Error:', err.response.headers);
                setError(`Gagal memuat resep: ${err.response.data.message || err.message}. Mohon periksa backend.`);
            } else if (err.request) {
                // Permintaan dibuat tetapi tidak ada respons yang diterima
                console.error('Permintaan Error:', err.request);
                setError('Tidak ada respons dari server. Server mungkin tidak berjalan atau ada masalah jaringan.');
            } else {
                // Sesuatu terjadi dalam penyiapan permintaan yang memicu Error
                console.error('Pesan Error:', err.message);
                setError(`Terjadi kesalahan saat memuat resep: ${err.message}.`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipeAndData();
    }, [id, isLoggedIn]); // Muat ulang jika id atau status login berubah

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
        // Penundaan kecil dan pengambilan ulang rating rata-rata untuk mencerminkan perubahan
        setTimeout(async () => {
            try {
                const avgRatingRes = await api.get(`/ratings/recipe/${id}`);
                setAverageRating(avgRatingRes.data.average);
            } catch (err) {
                console.error('Gagal me-refresh rating rata-rata:', err);
            }
        }, 500);
    };

    const handleBookmark = async () => {
        if (!isLoggedIn) {
            alert('Silakan login untuk bookmark resep.');
            return;
        }
        try {
            await api.post('/bookmarks', { recipeId: parseInt(id) });
            setIsBookmarked(true);
            alert('Resep berhasil dibookmark!');
        } catch (err) {
            console.error('Gagal menambahkan bookmark:', err.response?.data?.message || err.message);
            alert('Gagal bookmark resep: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
        }
    };

    const handleRemoveBookmark = async () => {
        if (!isLoggedIn) {
            alert('Silakan login untuk menghapus bookmark.');
            return;
        }
        if (window.confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
            try {
                await api.delete(`/bookmarks/${id}`);
                setIsBookmarked(false);
                alert('Bookmark berhasil dihapus!');
            } catch (err) {
                console.error('Gagal menghapus bookmark:', err.response?.data?.message || err.message);
                alert('Gagal menghapus bookmark: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
            }
        }
    };

    // Fungsi untuk merender bintang rata-rata dengan dukungan nilai desimal
    const renderAverageStars = (avg) => {
        const fullStars = Math.floor(avg);
        const halfStar = avg % 1 !== 0; // Cek apakah ada desimal
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} style={{ color: '#ffc107', fontSize: '1.5rem' }}>&#9733;</span> // Bintang penuh
                ))}
                {halfStar && (
                    <span key="half" style={{
                        position: 'relative',
                        width: '1.5rem', // Ukuran bintang
                        height: '1.5rem',
                        overflow: 'hidden',
                        display: 'inline-block'
                    }}>
                        <span style={{ color: '#ffc107', fontSize: '1.5rem', position: 'absolute', left: 0, width: '50%', overflow: 'hidden' }}>&#9733;</span> {/* Setengah bintang kuning */}
                        <span style={{ color: '#e4e5e9', fontSize: '1.5rem', position: 'absolute', left: 0 }}>&#9733;</span> {/* Bintang kosong di bawah */}
                    </span>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} style={{ color: '#e4e5e9', fontSize: '1.5rem' }}>&#9733;</span> // Bintang kosong
                ))}
            </div>
        );
    };


    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat resep...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;
    if (!recipe) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Resep tidak ditemukan.</div>;

    const isAdmin = isLoggedIn && user?.role === 'admin';

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>{recipe.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <img src={recipe.image} alt={recipe.title} style={{ maxWidth: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' }} />
            </div>

            <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1rem' }}>{recipe.description}</p>
            <p style={{ fontWeight: 'bold', color: '#666' }}>Waktu Persiapan: {recipe.time}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0 }}>Rating Rata-rata: {averageRating.toFixed(1)} / 5</p>
                {renderAverageStars(averageRating)} {/* Menampilkan bintang rata-rata */}
                {/* Komponen RatingStars di bawah ini adalah untuk pengguna memberi/mengubah rating mereka sendiri */}
                <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Rating Anda:</span>
                <RatingStars recipeId={recipe.id} initialRating={userRating} onRatingChange={handleRatingChange} />
                {isLoggedIn && ( // Hanya tampilkan tombol bookmark jika pengguna sudah login
                    <>
                        {!isBookmarked ? (
                            <button onClick={handleBookmark} style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Bookmark</button>
                        ) : (
                            <button onClick={handleRemoveBookmark} style={{ padding: '0.5rem 1rem', background: '#ffc107', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Hapus Bookmark</button>
                        )}
                    </>
                )}
                {isAdmin && (
                    <Link to={`/recipes/edit/${recipe.id}`} style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', marginLeft: 'auto' }}>Edit Resep</Link>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#333' }}>Bahan-bahan</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem', borderBottom: '1px dotted #eee', paddingBottom: '0.5rem' }}>
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#333' }}>Instruksi</h2>
                <ol style={{ paddingLeft: '1.5rem' }}>
                    {recipe.instructions
                        .sort((a, b) => a.order - b.order) // Memastikan instruksi dalam urutan
                        .map((instruction, index) => (
                            <li key={index} style={{ marginBottom: '0.8rem' }}>
                                {instruction.description}
                            </li>
                        ))}
                </ol>
            </div>

            <CommentSection recipeId={recipe.id} />
        </div>
    );
};

export default RecipeDetail;
