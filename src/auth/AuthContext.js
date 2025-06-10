import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/index.js'; 


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedUser && storedAccessToken) {
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Gagal mengurai pengguna dari localStorage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, user: userData } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsLoggedIn(true);
            return true;
        } catch (error) {
            console.error('Login gagal:', error.response?.data?.message || error.message);
            setIsLoggedIn(false);
            setUser(null);
            return false;
        }
    };

    const logout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await api.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true 
            });
        } catch (error) {
            console.error('Logout gagal (backend):', error.response?.data?.message || error.message);
            
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
