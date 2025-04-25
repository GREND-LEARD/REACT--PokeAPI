import React, { useState, useEffect } from 'react';
import PokemonCard from '../PokemonCard';
import './Home.css'; // Añadiremos un CSS específico

// Recibe props de favoritos desde App.jsx
const Home = ({ isFavorite, toggleFavorite }) => {
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [isFetching, setIsFetching] = useState(false); // Para evitar clics múltiples

  // Función para obtener un Pokémon aleatorio
  const fetchRandomPokemon = async () => {
    // Evitar múltiples fetches simultáneos
    if (isFetching) return;
    setIsFetching(true);

    setLoading(true);
    setError(null);
    // No reseteamos randomPokemon aquí para que el anterior se siga mostrando mientras carga

    try {
      let currentTotal = totalPokemon;
      if (currentTotal === 0) {
        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon-species/?limit=1');
        // Mantenemos el error en inglés ya que es técnico
        if (!countResponse.ok) throw new Error('Failed to fetch Pokémon count');
        const countData = await countResponse.json();
        currentTotal = countData.count;
        setTotalPokemon(currentTotal);
      }

      // Generar un ID aleatorio
      const randomId = Math.floor(Math.random() * currentTotal) + 1;

      // Obtener los datos del Pokémon
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      if (!pokemonResponse.ok) {
        // Traducimos el mensaje de error para el usuario
        throw new Error(`Error al obtener datos del Pokémon ID: ${randomId}. Estado: ${pokemonResponse.status}`);
      }
      const pokemonData = await pokemonResponse.json();
      setRandomPokemon(pokemonData); // Actualizar el estado con el nuevo Pokémon

    } catch (e) {
      console.error("Error fetching random Pokémon:", e);
      // Traducimos el mensaje de error genérico
      setError(e.message || "No se pudo cargar un Pokémon aleatorio. Por favor, inténtalo de nuevo.");
      setRandomPokemon(null); // Limpiar el pokemon si hay error
    } finally {
      setLoading(false); // Indicar que la carga terminó
      setIsFetching(false); // Permitir nuevos clics
    }
  };

  // Obtener el primer Pokémon aleatorio al montar
  useEffect(() => {
    fetchRandomPokemon();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío para que solo se ejecute al montar

  return (
    <div className="home-container">
      {/* Textos traducidos */}
      <h2>¡Bienvenido/a a la PokéApp!</h2>
      <p>Descubre Pokémon, gestiona tus favoritos y más.</p>
      
      <div className="random-pokemon-section">
        <h3>Pokémon Aleatorio del Día:</h3>
        {/* Muestra el pokemon actual mientras carga el siguiente */}
        {randomPokemon && !loading && (
           <PokemonCard
              pokemon={randomPokemon}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
        )}
        {/* Muestra loading solo si no hay pokemon previo */}
        {loading && !randomPokemon && <p>Buscando un Pokémon...</p>}
        {/* Muestra loading encima si SI hay pokemon previo */}
        {loading && randomPokemon && <p>Buscando otro Pokémon...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Botón siempre visible si no hay error grave inicial */}
        {!error && (
          <button onClick={fetchRandomPokemon} disabled={loading || isFetching} className="random-button">
            {loading ? 'Cargando...' : 'Mostrar Otro Pokémon Aleatorio'}
          </button>
        )}
        {/* Botón de reintento si hubo error */}
        {error && (
           <button onClick={fetchRandomPokemon} disabled={loading || isFetching} className="random-button">
            Intentar de Nuevo
           </button>
        )}
      </div>
    </div>
  );
};

export default Home; 