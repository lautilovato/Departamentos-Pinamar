import React from 'react';
import { Link } from 'react-router-dom';
import '../../Home.css'; // reutiliza estilos existentes

const Header: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Lautaro 225</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><a href="#departamentos">Departamentos</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Header;
