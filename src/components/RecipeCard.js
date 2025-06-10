// RecipeCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onDelete, isAdmin }) => {
    return (
        <div style={{ 
            border: '1px solid #e0e0e0', // Lighter border
            padding: '1.2rem', // Slightly more padding
            margin: '1rem', 
            borderRadius: '10px', // More rounded corners
            width: '280px', // Slightly wider cards
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // More pronounced shadow
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth transition for hover effects
            backgroundColor: '#ffffff', // White background
            overflow: 'hidden' // Ensures rounded corners on image
        }}
        onMouseOver={(e) => { 
            e.currentTarget.style.transform = 'translateY(-5px)'; 
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'; 
        }}
        onMouseOut={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; 
        }}>
            <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <img src={recipe.image || 'https://via.placeholder.com/280x180?text=No+Image'} alt={recipe.title} style={{ 
                    width: '100%', 
                    height: '180px', // Taller image
                    objectFit: 'cover', 
                    borderRadius: '8px', // Rounded image corners
                    marginBottom: '0.8rem' // Space between image and title
                }} />
                <h3 style={{ 
                    marginTop: '0.5rem', 
                    marginBottom: '0.4rem', 
                    fontSize: '1.3rem', // Larger title font
                    textAlign: 'center',
                    color: '#333', // Darker title color
                    minHeight: '3em', // Ensure consistent height for titles
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Limit title to 2 lines
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{recipe.title}</h3>
                <p style={{ 
                    fontSize: '1rem', // Slightly larger font for time
                    color: '#777', // Softer color for time
                    textAlign: 'center',
                    marginBottom: '0.5rem' // Space before buttons if they exist
                }}>Waktu: {recipe.time}</p>
            </Link>
            {isAdmin && (
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.8rem' }}>
                    <Link to={`/recipes/edit/${recipe.id}`} style={{ 
                        textDecoration: 'none', 
                        padding: '0.6rem 1rem', // Larger padding
                        background: '#3498db', // Blue for edit
                        color: 'white', 
                        borderRadius: '5px', // More rounded buttons
                        fontSize: '1rem', // Larger font for buttons
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >Edit</Link>
                    <button onClick={() => onDelete(recipe.id)} style={{ 
                        padding: '0.6rem 1rem', 
                        background: '#e74c3c', // Red for delete
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                    >Delete</button>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;