import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/index.js'; // Use the configured axios instance

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
            // Optionally, navigate to login page after successful registration
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
            background: 'url(https://i.imgur.com/your-abstract-register-background-image.jpg) no-repeat center center/cover', // Replace with your image
            color: 'white'
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '2rem',
                borderRadius: '10px',
                width: '300px',
                textAlign: 'center'
            }}>
                <h2>Register Your Account</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '5px', border: 'none' }}
                        required
                    />
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
                    <button type="submit" style={{ padding: '0.8rem', borderRadius: '5px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer' }}>Register</button>
                </form>
                <p style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none' }}>Login</Link></p>
            </div>
        </div>
    );
};

export default Register;