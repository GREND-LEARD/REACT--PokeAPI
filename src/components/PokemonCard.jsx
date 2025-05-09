import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import './PokemonCard.css'; // Crearemos este archivo para estilos

// Recibe isFavorite y toggleFavorite como props
const PokemonCard = ({ pokemon, isFavorite, toggleFavorite }) => {
  if (!pokemon || !pokemon.sprites) {
    // Podríamos mostrar un placeholder o simplemente no renderizar nada
    // si los datos aún no están completos.
    return <div className="pokemon-card loading">Loading...</div>;
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que el Link se active al hacer clic en el botón
    e.preventDefault(); // Previene cualquier comportamiento por defecto extra del botón dentro de un link
    toggleFavorite(pokemon.id);
  };

  // Determina si este Pokémon es favorito
  const favoriteStatus = isFavorite(pokemon.id);

  return (
    // Envolvemos todo en Link, excepto el botón
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card-link">
      <div className={`pokemon-card ${favoriteStatus ? 'favorite' : ''}`}>
        <button 
          className={`favorite-button ${favoriteStatus ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={favoriteStatus ? 'Quitar de favoritos' : 'Añadir a favoritos'} // Traducido
        >
          {/* Usamos un simple ★ por ahora, podría ser un icono SVG */}
          ★ 
        </button>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <h3>{pokemon.name}</h3>
        <p className="pokemon-id">#{pokemon.id}</p> {/* Mostramos el ID */}
      </div>
    </Link>
  );
};

export default PokemonCard; 