import React, { useState, useEffect } from 'react';
import api from '../api/index.js';
import { useAuth } from '../auth/AuthContext.js';

const RatingStars = ({ recipeId, initialRating, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating || 0);
    const [hover, setHover] = useState(0);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        setRating(initialRating || 0);
    }, [initialRating]);

    const handleRating = async (index) => {
        if (!isLoggedIn) {
            alert('Silakan login untuk memberi rating.');
            return;
        }
        try {
            const res = await api.post(`/ratings/recipe/${recipeId}`, { rating: index });
            setRating(index);
            onRatingChange(index); 
            alert(res.data.message);
        } catch (error) {
            console.error('Failed to rate recipe:', error.response?.data?.message || error.message);
            alert('Gagal memberi rating. ' + (error.response?.data?.message || 'Silakan coba lagi.'));
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, index) => {
                index += 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "on" : "off"}
                        onClick={() => handleRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: isLoggedIn ? 'pointer' : 'default',
                            color: index <= (hover || rating) ? '#ffc107' : '#e4e5e9',
                            fontSize: '2rem',
                            pointerEvents: isLoggedIn ? 'auto' : 'none' // Disable click if not logged in
                        }}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                );
            })}
        </div>
    );
};

export default RatingStars;