// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

const PrivateRoute = ({ allowedRoles }) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh', 
                fontSize: '1.5rem', 
                color: '#555' 
            }}>
                Loading authentication...
            </div>
        ); 
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the allowed role
        return <Navigate to="/" replace />; // Redirect to home or an unauthorized page
    }

    return <Outlet />;
};

export default PrivateRoute;