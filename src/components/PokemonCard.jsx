import React from 'react';
import './PokemonCard.css'; // Crearemos este archivo para estilos

// Recibe isFavorite y toggleFavorite como props
const PokemonCard = ({ pokemon, isFavorite, toggleFavorite }) => {
  if (!pokemon || !pokemon.sprites) {
    // Podríamos mostrar un placeholder o simplemente no renderizar nada
    // si los datos aún no están completos.
    return <div className="pokemon-card loading">Loading...</div>;
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que otros eventos de clic se disparen si la tarjeta es clickeable
    toggleFavorite(pokemon.id);
  };

  // Determina si este Pokémon es favorito
  const favoriteStatus = isFavorite(pokemon.id);

  return (
    <div className={`pokemon-card ${favoriteStatus ? 'favorite' : ''}`}>
      <button 
        className={`favorite-button ${favoriteStatus ? 'is-favorite' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={favoriteStatus ? 'Remove from favorites' : 'Add to favorites'}
      >
        {/* Usamos un simple ★ por ahora, podría ser un icono SVG */}
        ★ 
      </button>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      <p className="pokemon-id">#{pokemon.id}</p> {/* Mostramos el ID */}
    </div>
  );
};

export default PokemonCard; 