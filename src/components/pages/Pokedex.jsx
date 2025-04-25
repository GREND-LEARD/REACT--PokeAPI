import React, { useState, useEffect } from 'react';
import PokemonCard from '../PokemonCard'; // Importamos el nuevo componente
import './Pokedex.css'; // Podemos añadir un CSS específico para la página si es necesario

// Recibe isFavorite y toggleFavorite desde App.jsx
const Pokedex = ({ isFavorite, toggleFavorite }) => {
  const [pokemonDetails, setPokemonDetails] = useState([]); // Estado para guardar detalles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]); // Estado para guardar los tipos
  const [selectedType, setSelectedType] = useState('all'); // Estado para el tipo seleccionado

  // Efecto para obtener la lista de tipos al montar
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        if (!response.ok) throw new Error('Failed to fetch types');
        const data = await response.json();
        // Guardamos solo los nombres de los tipos y excluimos tipos raros sin pokemon listado (shadow, unknown)
        setTypes(data.results.filter(type => type.name !== 'shadow' && type.name !== 'unknown')); 
      } catch (e) {
        console.error("Error fetching types:", e);
        // Podríamos mostrar un error al usuario si falla la carga de tipos
      }
    };
    fetchTypes();
  }, []);

  // Efecto para obtener los Pokémon (depende del tipo seleccionado)
  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      setError(null);
      setPokemonDetails([]); // Limpiar detalles anteriores
      let pokemonUrls = [];

      try {
        if (selectedType === 'all') {
          // Obtener la lista inicial si 'all' está seleccionado
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20'); // Mantener límite o ajustar
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const listData = await response.json();
          pokemonUrls = listData.results.map(p => p.url); // Guardamos las URLs
        } else {
          // Obtener Pokémon por el tipo seleccionado
          const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          if (!response.ok) throw new Error(`Failed to fetch Pokémon for type: ${selectedType}`);
          const typeData = await response.json();
          // Extraemos las URLs de los Pokémon de este tipo
          pokemonUrls = typeData.pokemon.map(pInfo => pInfo.pokemon.url);
          // Podríamos añadir un límite aquí también si la lista es muy larga
          // pokemonUrls = pokemonUrls.slice(0, 20); 
        }

        if (pokemonUrls.length === 0) {
           setPokemonDetails([]);
           setLoading(false);
           return; // No hay pokémon que buscar
        }

        // Obtener los detalles de cada Pokémon usando las URLs
        const detailPromises = pokemonUrls.map(async (url) => {
          const detailResponse = await fetch(url);
          if (!detailResponse.ok) {
            console.error(`Failed to fetch details for ${url}`);
            return null;
          }
          return await detailResponse.json();
        });

        const detailedPokemonData = await Promise.all(detailPromises);
        setPokemonDetails(detailedPokemonData.filter(p => p !== null));
        setError(null);
      } catch (e) {
        console.error("Error fetching Pokémon data:", e);
        setError("Failed to load Pokémon data.");
        setPokemonDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
    // Este efecto se re-ejecuta si selectedType cambia
  }, [selectedType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div>
      <h2>Pokedex Page</h2>

      {/* Selector de Tipo */}
      <div className="filter-container">
        <label htmlFor="type-select">Filter by Type: </label>
        <select id="type-select" value={selectedType} onChange={handleTypeChange}>
          <option value="all">All</option>
          {types.map(type => (
            <option key={type.name} value={type.name}>
              {/* Capitalizar nombre del tipo */}
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading Pokémon...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && pokemonDetails.length === 0 && selectedType !== 'all' && (
         <p>No Pokémon found for the selected type.</p>
      )}
      {!loading && !error && (
        <div className="pokedex-grid"> {/* Contenedor para las tarjetas */}
          {pokemonDetails.map((pokemon) => (
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

export default Pokedex; 