import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importar useParams y Link
import './PokemonDetail.css'; // Crearemos este archivo para estilos

// Recibe props de favoritos
const PokemonDetail = ({ isFavorite, toggleFavorite }) => {
  const { pokemonId } = useParams(); // Obtener el ID de la URL
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (response.status === 404) {
          throw new Error(`Pokémon con ID ${pokemonId} no encontrado.`);
        }
        if (!response.ok) {
          throw new Error(`Error al obtener datos del Pokémon ID: ${pokemonId}. Estado: ${response.status}`);
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (e) {
        console.error("Error fetching Pokémon details:", e);
        setError(e.message || "No se pudieron cargar los detalles del Pokémon.");
        setPokemonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]); // Re-ejecutar si el ID en la URL cambia

  // --- Renderizado ---
  if (loading) {
    return <div className="detail-container loading">Cargando detalles del Pokémon...</div>;
  }

  if (error) {
    return <div className="detail-container error">Error: {error}</div>;
  }

  if (!pokemonData) {
    // Esto no debería pasar si no hay error y no está cargando, pero por si acaso
    return <div className="detail-container">No se encontraron datos del Pokémon.</div>;
  }

  // Función para el botón de favorito (similar a PokemonCard)
  const handleFavoriteClick = () => {
    toggleFavorite(pokemonData.id);
  };
  const favoriteStatus = isFavorite(pokemonData.id);

  // Mapeo simple para traducir nombres de stats (puedes expandir)
  const statTranslations = {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    speed: 'Velocidad'
  };

  return (
    <div className="detail-container">
      <Link to="/pokedex" className="back-link">← Volver a la Pokedex</Link>
      
      <div className="pokemon-header">
        <h2 className="pokemon-name">
          {pokemonData.name} 
          <span className="pokemon-id">#{pokemonData.id}</span>
        </h2>
        <button 
          className={`favorite-button ${favoriteStatus ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favoriteStatus ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          ★
        </button>
      </div>

      <div className="pokemon-main-info">
        <img 
          src={pokemonData.sprites.other?.['official-artwork']?.front_default || pokemonData.sprites.front_default} 
          alt={pokemonData.name} 
          className="pokemon-image-large"
        />
        <div className="pokemon-attributes">
          <p><strong>Altura:</strong> {pokemonData.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemonData.weight / 10} kg</p>
          <div className="pokemon-types">
            <strong>Tipos:</strong>
            {pokemonData.types.map(typeInfo => (
              <span key={typeInfo.type.name} className={`type-badge type-${typeInfo.type.name}`}>
                {typeInfo.type.name}
              </span>
            ))}
          </div>
          <div className="pokemon-abilities">
             <strong>Habilidades:</strong>
             <ul>
               {pokemonData.abilities.map(abilityInfo => (
                 <li key={abilityInfo.ability.name}>{abilityInfo.ability.name}</li>
               ))}
             </ul>
           </div>
        </div>
      </div>

      <div className="pokemon-stats">
        <h3>Estadísticas Base:</h3>
        <ul>
          {pokemonData.stats.map(statInfo => (
            <li key={statInfo.stat.name}>
              <span className="stat-name">{statTranslations[statInfo.stat.name] || statInfo.stat.name}:</span> 
              <span className="stat-value">{statInfo.base_stat}</span>
              <div className="stat-bar-container">
                 <div 
                   className="stat-bar" 
                   style={{ width: `${Math.min(statInfo.base_stat, 150)}px` }}
                 ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Aquí podríamos añadir la sección de evoluciones más adelante */}
    </div>
  );
};

export default PokemonDetail; 