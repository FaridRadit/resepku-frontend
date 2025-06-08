import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onDelete, isAdmin }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '8px', width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                <h3 style={{ marginTop: '0.8rem', marginBottom: '0.2rem', fontSize: '1.2rem', textAlign: 'center' }}>{recipe.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>Waktu: {recipe.time}</p>
            </Link>
            {isAdmin && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/recipes/edit/${recipe.id}`} style={{ textDecoration: 'none', padding: '0.4rem 0.8rem', background: '#007bff', color: 'white', borderRadius: '4px', fontSize: '0.9rem' }}>Edit</Link>
                    <button onClick={() => onDelete(recipe.id)} style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;