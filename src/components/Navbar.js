import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>ResepAmba</Link>
            <div>
                
                {isLoggedIn ? (
                    <>
                        <Link to="/recipes" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Resep</Link>
                        {user?.role === 'admin' && ( //
                            <Link to="/recipes/add" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Tambah Resep</Link>
                        )}
                        <Link to="/bookmarks" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Bookmark Saya</Link>
                        <Link to="/ratings/my" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Rating Saya</Link>
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Profil</Link>
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Login</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none', marginLeft: '1rem' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;