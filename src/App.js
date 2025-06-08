import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe'; // Admin only
import EditRecipe from './pages/EditRecipe'; // Admin only
import MyBookmarks from './pages/MyBookmarks'; // User only
import MyRatings from './pages/MyRatings'; // User only
import UserProfile from './pages/UserProfile'; // User only

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div style={{ paddingTop: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/recipes" element={<RecipeList />} /> {/* Ubah dari '/' ke '/recipes' */}
                        <Route path="/recipes/:id" element={<RecipeDetail />} />

                        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                            <Route path="/recipes/add" element={<AddRecipe />} />
                            <Route path="/recipes/edit/:id" element={<EditRecipe />} />
                        </Route>

                        <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
                            <Route path="/bookmarks" element={<MyBookmarks />} />
                            <Route path="/ratings/my" element={<MyRatings />} />
                            <Route path="/profile" element={<UserProfile />} />
                        </Route>

                        {/* Rute cadangan untuk jalur yang tidak terdefinisi */}
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
