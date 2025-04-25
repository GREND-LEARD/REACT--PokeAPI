import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css'; // Crearemos este archivo para los estilos

const BottomNav = () => {
  // Función para determinar la clase del NavLink (activa o no)
  const navLinkClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={navLinkClass}>Home</NavLink>
      <NavLink to="/pokedex" className={navLinkClass}>Pokedex</NavLink>
      <NavLink to="/search" className={navLinkClass}>Search</NavLink>
      <NavLink to="/filter" className={navLinkClass}>Filter</NavLink>
      <NavLink to="/favorites" className={navLinkClass}>Favs</NavLink>
      <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
    </nav>
  );
};

export default BottomNav; 