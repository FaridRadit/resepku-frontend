import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

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
            background: 'url(https://i.imgur.com/your-abstract-background-image.jpg) no-repeat center center/cover', // Replace with your image
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '2rem',
                borderRadius: '10px',
                width: '300px',
                textAlign: 'center'
            }}>
                <h2>Login to your Account</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '5px', border: 'none' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '5px', border: 'none' }}
                        required
                    />
                    <button type="submit" style={{ padding: '0.8rem', borderRadius: '5px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer' }}>Login</button>
                </form>
                <p style={{ marginTop: '1rem' }}>Don't have an account? <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none' }}>Register</Link></p>
            </div>
        </div>
    );
};

export default Login;