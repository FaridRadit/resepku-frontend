import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';

const PrivateRoute = ({ allowedRoles }) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // Or a spinner
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