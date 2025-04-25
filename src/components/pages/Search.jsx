import React, { useState } from 'react';
import PokemonCard from '../PokemonCard';

const Search = ({ isFavorite, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm) return; // No buscar si el término está vacío

    setLoading(true);
    setError(null);
    setPokemonData(null);

    try {
      // Convertimos a minúsculas porque la API es case-sensitive para nombres
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);

      if (response.status === 404) {
        throw new Error(`Pokémon not found: ${searchTerm}`);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPokemonData(data);
    } catch (e) {
      console.error("Error searching Pokémon:", e);
      setError(e.message || "Failed to search Pokémon.");
      setPokemonData(null);
    } finally {
      setLoading(false);
    }
  };

  // Permitir buscar también con Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <h2>Search Page</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Pokémon name or ID"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Añadido para buscar con Enter
          style={{ marginRight: '10px', padding: '8px' }} // Estilos básicos
        />
        <button onClick={handleSearch} disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p style={{ marginTop: '20px' }}>Loading...</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {pokemonData && (
        <div style={{ marginTop: '20px' }}>
          <PokemonCard 
            pokemon={pokemonData} 
            isFavorite={isFavorite} 
            toggleFavorite={toggleFavorite} 
          />
        </div>
      )}
    </div>
  );
};

export default Search; 