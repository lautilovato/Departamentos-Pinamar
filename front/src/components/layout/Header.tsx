import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // FIX: reintroducir Link
import '../../Home.css'; // estilos generales primero
import './layout.css'; // overrides específicos después

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 820 && open) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <nav className={`navbar ${open ? 'nav-open' : ''}`}>
      <div className="nav-inner">
        <div className="nav-brand">
          <h2>Lautaro 225</h2>
        </div>
        <button
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(o => !o)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
      <ul
        id="primary-navigation"
        className={`nav-links ${open ? 'open' : ''}`}
        aria-hidden={!open}
      >
        <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
        <li><a href="#departamentos" onClick={closeMenu}>Departamentos</a></li>
        <li><a href="#servicios" onClick={closeMenu}>Servicios</a></li>
        <li><a href="#contacto" onClick={closeMenu}>Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Header;
