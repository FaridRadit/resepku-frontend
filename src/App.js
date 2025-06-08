import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.js'; 
import Navbar from './components/Navbar.js';
import PrivateRoute from './components/PrivateRoute.js';

// Pages
import Login from './pages/Login.js'; 
import Register from './pages/Register.js'; 
import RecipeList from './pages/RecipeList.js'; 
import RecipeDetail from './pages/RecipeDetail.js'; 
import AddRecipe from './pages/AddRecipe.js'; 
import EditRecipe from './pages/EditRecipe.js'; 
import MyBookmarks from './pages/MyBookmarks.js'; 
import MyRatings from './pages/MyRatings.js'; 
import UserProfile from './pages/UserProfile.js'; 

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div style={{ paddingTop: '20px' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
                            <Route path="/recipes" element={<RecipeList />} />
                            <Route path="/recipes/:id" element={<RecipeDetail />} /> 
                            <Route path="/bookmarks" element={<MyBookmarks />} />
                            <Route path="/ratings/my" element={<MyRatings />} />
                            <Route path="/profile" element={<UserProfile />} />
                        </Route>
                        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                            <Route path="/recipes/add" element={<AddRecipe />} />
                            <Route path="/recipes/edit/:id" element={<EditRecipe />} />
                        </Route>
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
