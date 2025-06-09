import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/index.js'; 
import background from '../asset/backgroundregister.jpg';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/auth/register', { name, email, password });
            setSuccess(response.data.message);
            // Opsional, arahkan ke halaman login setelah registrasi berhasil
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            // Gambar latar belakang bertema masak-masak yang berbeda dari Login
           background: `url(${background}) no-repeat center center/cover`,
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.8)', // Sedikit lebih gelap untuk kontras
                padding: '2.5rem', // Sedikit lebih banyak padding
                borderRadius: '12px', // Sedikit lebih bulat
                width: '320px', // Sedikit lebih lebar
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)' // Tambah shadow
            }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Daftarkan Akun Anda</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                {success && <p style={{ color: '#7cb342', marginBottom: '1rem' }}>{success}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <input
                        type="text"
                        placeholder="Nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #555', 
                            background: '#333', 
                            color: 'white',
                            fontSize: '1rem'
                        }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #555', 
                            background: '#333', 
                            color: 'white',
                            fontSize: '1rem'
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #555', 
                            background: '#333', 
                            color: 'white',
                            fontSize: '1rem'
                        }}
                        required
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: 'none', 
                            background: '#7cb342', // Warna hijau yang sama dengan Login
                            color: 'white', 
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#689f38'}
                        onMouseOut={(e) => e.target.style.background = '#7cb342'}
                    >
                        Daftar
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>Sudah punya akun? <Link to="/login" style={{ color: '#7cb342', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
