import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/index.js';
import { useAuth } from '../auth/AuthContext'; // Import useAuth

const AddRecipe = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth(); // Dapatkan status login dan pengguna
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [instructions, setInstructions] = useState([{ description: '' }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, { description: '' }]);
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index].description = value;
        setInstructions(newInstructions);
    };

    const handleRemoveInstruction = (index) => {
        const newInstructions = instructions.filter((_, i) => i !== index);
        setInstructions(newInstructions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Hanya izinkan jika pengguna sudah login dan merupakan admin (cek tambahan)
        if (!isLoggedIn || user?.role !== 'admin') {
            setError('Anda tidak diizinkan untuk menambahkan resep.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('time', time);
        if (image) {
            formData.append('image', image);
        } else {
            setError('Foto wajib diisi.');
            setLoading(false);
            return;
        }

        const validIngredients = ingredients.filter(ing => ing.name && ing.quantity && ing.unit);
        const validInstructions = instructions.filter(inst => inst.description).map((inst, idx) => ({
            ...inst,
            order: idx + 1
        }));

        formData.append('ingredients', JSON.stringify(validIngredients));
        formData.append('instructions', JSON.stringify(validInstructions));

        try {
            const response = await api.post('/recipes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigate('/recipes'); // Navigasi ke daftar resep setelah berhasil
        } catch (err) {
            console.error('Gagal menambahkan resep:', err.response?.data?.message || err.message);
            setError('Gagal menambahkan resep: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Input Resep</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Foto Resep:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                    />
                    {image && <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>File dipilih: {image.name}</p>}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Judul:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masukkan judul resep"
                        style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Deskripsi:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Masukkan deskripsi resep"
                        rows="4"
                        style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%', resize: 'vertical' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Waktu Persiapan (Contoh: 45 Menit):</label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Misal: 30 menit"
                        style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                        required
                    />
                </div>

                <div style={{ border: '1px dashed #ddd', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>Bahan-bahan</h3>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Nama Bahan (ex: Tepung)"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                style={{ flex: 3, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder="Jumlah (ex: 200)"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder="Unit (ex: gram)"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            {ingredients.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngredient(index)}
                                    style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 0.8rem', cursor: 'pointer' }}
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.8rem 1.2rem', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                        Tambah Bahan
                    </button>
                </div>

                <div style={{ border: '1px dashed #ddd', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>Instruksi</h3>
                    {instructions.map((instruction, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                            <textarea
                                placeholder={`Langkah ${index + 1}`}
                                value={instruction.description}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                rows="2"
                                style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                            />
                            {instructions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInstruction(index)}
                                    style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 0.8rem', cursor: 'pointer' }}
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddInstruction}
                        style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.8rem 1.2rem', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                        Tambah Instruksi
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', marginTop: '1.5rem' }}
                >
                    {loading ? 'Menambahkan...' : 'Tambah Resep'}
                </button>
            </form>
        </div>
    );
};

export default AddRecipe;
