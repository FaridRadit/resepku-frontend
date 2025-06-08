import React, { useEffect, useState } from 'react';
import api from '../api'; // Use the configured axios instance
import { useAuth } from '../auth/AuthContext';
import RecipeCard from '../components/RecipeCard'; // Assuming RecipeCard is in components folder

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isLoggedIn } = useAuth(); // Get user and isLoggedIn status

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await api.get('/recipes');
                setRecipes(response.data);
            } catch (err) {
                setError('Gagal memuat resep.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
            try {
                await api.delete(`/recipes/${id}`);
                setRecipes(recipes.filter(recipe => recipe.id !== id));
                alert('Resep berhasil dihapus!');
            } catch (err) {
                setError('Gagal menghapus resep.');
                console.error(err);
                alert('Gagal menghapus resep: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat resep...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;

    const isAdmin = isLoggedIn && user?.role === 'admin';

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Menu Resep</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} isAdmin={isAdmin} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center' }}>Belum ada resep yang tersedia.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeList;
