import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css'
import BottomNav from './components/BottomNav';
import Home from './components/pages/Home';
import Pokedex from './components/pages/Pokedex';
import Search from './components/pages/Search';
import Filter from './components/pages/Filter';
import Favorites from './components/pages/Favorites';
import Settings from './components/pages/Settings';

// // Placeholder para componentes de pestañas (los crearemos después)
// const Home = () => <div>Home Page</div>;
// const Pokedex = () => <div>Pokedex Page</div>;
// const Search = () => <div>Search Page</div>;
// const Filter = () => <div>Filter Page</div>;
// const Favorites = () => <div>Favorites Page</div>;
// const Settings = () => <div>Settings Page</div>;

function App() {
  const [favorites, setFavorites] = useState(() => {
    // Cargar favoritos iniciales desde localStorage
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Guardar favoritos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemonId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(pokemonId)) {
        // Si ya es favorito, quitarlo
        return prevFavorites.filter(id => id !== pokemonId);
      } else {
        // Si no es favorito, añadirlo
        return [...prevFavorites, pokemonId];
      }
    });
  };

  // Función para comprobar si un Pokémon es favorito
  const isFavorite = (pokemonId) => favorites.includes(pokemonId);

  return (
    <div className="app-container">
      <main className="content">
        <Routes>
          <Route 
            path="/" 
            element={<Home isFavorite={isFavorite} toggleFavorite={toggleFavorite} />} 
          />
          <Route 
            path="/pokedex" 
            element={<Pokedex isFavorite={isFavorite} toggleFavorite={toggleFavorite} />} 
          />
          <Route 
            path="/search" 
            element={<Search isFavorite={isFavorite} toggleFavorite={toggleFavorite} />} 
          />
          <Route path="/filter" element={<Filter />} />
          <Route 
            path="/favorites" 
            element={<Favorites favoriteIds={favorites} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />} 
          />
          <Route path="/settings" element={<Settings />} />
          {/* Ruta por defecto o Not Found podrías añadirla aquí */}
        </Routes>
      </main>
      {/* Aquí iría el menú inferior */}
      <BottomNav />
    </div>
  )
}

export default App
