import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js'; 
import api from '../api/index.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth(); // Dapatkan status isLoggedIn

    // Efek untuk mengalihkan jika sudah login
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/recipes', { replace: true }); // Arahkan ke /recipes dan ganti entri riwayat
        }
    }, [isLoggedIn, navigate]); // Bergantung pada isLoggedIn dan navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            // Setelah login berhasil, useEffect akan menangani pengalihan
            // ke halaman daftar resep secara otomatis.
            // Tidak perlu navigate di sini karena useEffect sudah ada
        } else {
            setError('Login gagal. Periksa email dan password Anda.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            // Gambar latar belakang bertema masak-masak dari Unsplash (contoh URL gambar langsung)
            // Anda HARUS mengganti ini dengan URL gambar langsung yang valid dari Unsplash atau sumber lain.
            background: 'url(https://images.unsplash.com/photo-1543336440-a35b1d9b3b5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) no-repeat center center/cover', 
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
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Login ke Akun Anda</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>} {/* Warna error lebih cerah */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid #555', // Border lebih jelas
                            background: '#333', // Background input gelap
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
                            background: '#7cb342', // Warna hijau yang lebih 'fresh'
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
                        Login
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>Belum punya akun? <Link to="/register" style={{ color: '#7cb342', textDecoration: 'none', fontWeight: 'bold' }}>Daftar</Link></p>
            </div>
        </div>
    );
};

export default Login;
