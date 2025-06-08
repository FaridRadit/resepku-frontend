import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/index.js';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState(null); // For new image file
    const [currentImageUrl, setCurrentImageUrl] = useState(''); // To display current image
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                const recipeData = response.data;
                setTitle(recipeData.title);
                setDescription(recipeData.description);
                setTime(recipeData.time);
                setCurrentImageUrl(recipeData.image);
                setIngredients(recipeData.ingredients || []);
                setInstructions(recipeData.instructions || []);
            } catch (err) {
                console.error('Failed to fetch recipe for editing:', err);
                setError('Gagal memuat resep untuk diedit.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '', recipeId: parseInt(id) }]);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = async (index, ingredientId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
            const newIngredients = ingredients.filter((_, i) => i !== index);
            setIngredients(newIngredients);
            // If the ingredient already existed in DB, you might want to send a DELETE request for it
            // This backend doesn't seem to have a dedicated ingredient DELETE endpoint,
            // so we rely on the PATCH request to update the list of ingredients.
            // If a dedicated endpoint exists, call it here.
        }
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, { description: '', recipeId: parseInt(id) }]);
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index].description = value;
        setInstructions(newInstructions);
    };

    const handleRemoveInstruction = async (index, instructionId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus instruksi ini?')) {
            const newInstructions = instructions.filter((_, i) => i !== index);
            setInstructions(newInstructions);
            // Same as ingredients, rely on PATCH or call dedicated DELETE endpoint if available
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('time', time);
        if (image) { // Only append if a new image is selected
            formData.append('image', image);
        }

        // Backend currently only updates title, description, time, and image.
        // It doesn't have an endpoint to update ingredients and instructions directly via PATCH recipe/:id.
        // For a full update, you'd need separate PATCH/PUT endpoints for ingredients and instructions
        // or a more complex recipe update logic in your backend controller.
        // For this example, we'll only send the main recipe details.
        // To update ingredients/instructions, you'd need to send them as separate API calls
        // or modify your backend's updateRecipe to handle nested updates.

        // If your backend `updateRecipe` controller was modified to accept
        // `ingredients` and `instructions` arrays, you'd include them like this:
        // const validIngredients = ingredients.filter(ing => ing.name && ing.quantity && ing.unit);
        // const validInstructions = instructions.filter(inst => inst.description).map((inst, idx) => ({
        //     ...inst,
        //     order: idx + 1
        // }));
        // formData.append('ingredients', JSON.stringify(validIngredients));
        // formData.append('instructions', JSON.stringify(validInstructions));


        try {
            const response = await api.patch(`/recipes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigate(`/recipes/${id}`); // Go back to recipe detail
        } catch (err) {
            console.error('Failed to update recipe:', err.response?.data?.message || err.message);
            setError('Gagal memperbarui resep: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat resep untuk diedit...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Update Resep</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Foto Resep Saat Ini:</label>
                    {currentImageUrl && <img src={currentImageUrl} alt="Current Recipe" style={{ maxWidth: '200px', height: 'auto', marginBottom: '1rem', borderRadius: '5px' }} />}
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Ganti Foto Resep (opsional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                    />
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
                        <div key={ingredient.id || `new-${index}`} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'center' }}>
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
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index, ingredient.id)}
                                style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 0.8rem', cursor: 'pointer' }}
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.8rem 1.2rem', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                        Tambah Bahan Baru
                    </button>
                </div>

                <div style={{ border: '1px dashed #ddd', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>Instruksi</h3>
                    {instructions.map((instruction, index) => (
                        <div key={instruction.id || `new-${index}`} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', alignItems: 'center' }}>
                            <textarea
                                placeholder={`Langkah ${index + 1}`}
                                value={instruction.description}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                rows="2"
                                style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveInstruction(index, instruction.id)}
                                style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.6rem 0.8rem', cursor: 'pointer' }}
                            >
                                Hapus
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddInstruction}
                        style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.8rem 1.2rem', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                        Tambah Instruksi Baru
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: '1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', marginTop: '1.5rem' }}
                >
                    {submitting ? 'Memperbarui...' : 'Update Resep'}
                </button>
            </form>
        </div>
    );
};

export default EditRecipe;