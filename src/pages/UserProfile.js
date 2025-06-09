import React, { useState, useEffect } from 'react';
import api from '../api/index.js';
import { useAuth } from '../auth/AuthContext.js';

const UserProfile = () => {
    const { user, isLoggedIn, setUser } = useAuth(); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn && user) {
            setName(user.name || '');
            setEmail(user.email || ''); 
            setLoading(false);
        } else if (!isLoggedIn && !user) {
            setError('Anda harus login untuk melihat profil.');
            setLoading(false);
        }
    }, [isLoggedIn, user, setUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Hanya izinkan jika pengguna sudah login
        if (!isLoggedIn) {
            setError('Anda harus login untuk memperbarui profil Anda.');
            return;
        }

        if (!name.trim()) {
            setError('Nama tidak boleh kosong.');
            return;
        }

        try {
            const response = await api.patch('/users/editProfile', { name });
            setSuccess(response.data.message);
            // Perbarui data pengguna di AuthContext dan localStorage
            if (response.data.user) {
                setUser(response.data.user); 
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (err) {
            console.error('Gagal memperbarui profil:', err.response?.data?.message || err.message);
            setError('Gagal memperbarui profil: ' + (err.response?.data?.message || 'Silakan coba lagi.'));
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Memuat profil...</div>;
    if (error && !isLoggedIn) return <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Profil Saya</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            
            {/* Tampilkan form hanya jika pengguna sudah login */}
            {user && isLoggedIn ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            disabled // Email tidak dapat diedit
                            style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%', background: '#f0f0f0' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nama:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px', width: '100%' }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ padding: '1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem', marginTop: '1rem' }}
                    >
                        Update Profil
                    </button>
                </form>
            ) : (
                <p style={{ textAlign: 'center' }}>Silakan login untuk mengelola profil Anda.</p>
            )}
        </div>
    );
};

export default UserProfile;
