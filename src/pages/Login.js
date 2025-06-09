import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/index.js';
import cookingBg from '../asset/backgroundlogin.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            navigate('/recipes');
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
      
            background: `url(${cookingBg}) no-repeat center center/cover`,
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                padding: '2.5rem',
                borderRadius: '12px',
                width: '320px',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
            }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Login ke Akun Anda</h2>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
                            background: '#7cb342',
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