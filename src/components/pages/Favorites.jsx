import React, { useState, useEffect } from 'react';
import PokemonCard from '../PokemonCard';
import './Pokedex.css'; // Reutilizamos el CSS de la grid

// Recibe favoriteIds, isFavorite, toggleFavorite de App.jsx
const Favorites = ({ favoriteIds, isFavorite, toggleFavorite }) => {
  const [favoritePokemonDetails, setFavoritePokemonDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo buscar si hay IDs favoritos
    if (favoriteIds.length === 0) {
      setFavoritePokemonDetails([]); // Limpiar si no hay favoritos
      setLoading(false);
      setError(null);
      return; // Salir si no hay nada que buscar
    }

    const fetchFavoriteDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Crear array de promesas para obtener detalles de cada ID favorito
        const detailPromises = favoriteIds.map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          if (!response.ok) {
            console.error(`Failed to fetch details for favorite Pokémon ID: ${id}`);
            return null;
          }
          return await response.json();
        });

        const detailedData = await Promise.all(detailPromises);
        setFavoritePokemonDetails(detailedData.filter(p => p !== null)); // Filtrar posibles nulos
      } catch (e) {
        console.error("Error fetching favorite Pokémon details:", e);
        setError("Failed to load favorite Pokémon details.");
        setFavoritePokemonDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDetails();
    // Volver a ejecutar si la lista de favoriteIds cambia
  }, [favoriteIds]); 

  return (
    <div>
      <h2>Favorites Page</h2>
      {loading && <p>Loading favorites...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && favoriteIds.length === 0 && (
        <p>You haven't added any Pokémon to your favorites yet.</p>
      )}
      {!loading && !error && favoriteIds.length > 0 && (
        <div className="pokedex-grid"> {/* Reutilizamos la clase para el layout */}
          {favoritePokemonDetails.map((pokemon) => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon} 
              isFavorite={isFavorite} 
              toggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 