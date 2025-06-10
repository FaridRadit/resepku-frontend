// Navbar.js
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
        <nav style={{ 
            padding: '1rem 2rem', 
            background: '#2c3e50', // Darker, modern background
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Subtle shadow for depth
            position: 'sticky', // Make it sticky
            top: 0,
            zIndex: 1000 // Ensure it stays on top
        }}>
            <Link to="/recipes" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '1.8rem', // Larger title
                fontWeight: 'bold' 
            }}>ResepAmba</Link>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/recipes" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            marginLeft: '1.5rem', // Increased spacing
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease' // Smooth transition for hover
                        }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Resep</Link>
                        {user?.role === 'admin' && (
                            <Link to="/recipes/add" style={{ 
                                color: 'white', 
                                textDecoration: 'none', 
                                marginLeft: '1.5rem', 
                                fontSize: '1.1rem',
                                transition: 'color 0.3s ease' 
                            }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Tambah Resep</Link>
                        )}
                        {user?.role !== 'admin' && ( 
                            <Link to="/bookmarks" style={{ 
                                color: 'white', 
                                textDecoration: 'none', 
                                marginLeft: '1.5rem', 
                                fontSize: '1.1rem',
                                transition: 'color 0.3s ease' 
                            }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Bookmark Saya</Link>
                        )}
                        <Link to="/ratings/my" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            marginLeft: '1.5rem', 
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease' 
                        }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Rating Saya</Link>
                        <Link to="/profile" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            marginLeft: '1.5rem', 
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease' 
                        }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Profil</Link>
                        <button onClick={handleLogout} style={{ 
                            background: 'none', 
                            border: '1px solid #f39c12', // Orange border
                            color: '#f39c12', // Orange text
                            padding: '0.6rem 1.2rem', 
                            borderRadius: '5px', 
                            cursor: 'pointer', 
                            marginLeft: '1.5rem',
                            fontSize: '1.1rem',
                            transition: 'all 0.3s ease', // Smooth transition for hover
                        }}
                        onMouseOver={(e) => { e.target.style.background = '#f39c12'; e.target.style.color = '#2c3e50'; }}
                        onMouseOut={(e) => { e.target.style.background = 'none'; e.target.style.color = '#f39c12'; }}
                        >Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            marginLeft: '1.5rem', 
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease' 
                        }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Login</Link>
                        <Link to="/register" style={{ 
                            color: 'white', 
                            textDecoration: 'none', 
                            marginLeft: '1.5rem', 
                            fontSize: '1.1rem',
                            transition: 'color 0.3s ease' 
                        }} onMouseOver={(e) => e.target.style.color = '#f39c12'} onMouseOut={(e) => e.target.style.color = 'white'}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;