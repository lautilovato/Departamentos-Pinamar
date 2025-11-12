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

  // Función para hacer scroll suave al footer
  const scrollToFooter = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    
    const footer = document.getElementById('footer') || document.querySelector('footer');
    if (footer) {
      const footerPosition = footer.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = footerPosition - startPosition;
      const duration = 1000; // 1 segundo de duración
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      // Función de easing para un movimiento más suave
      function ease(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  }, [closeMenu]);

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
        <li><a href="#galeria" onClick={closeMenu}>Galería</a></li>
        <li><Link to="/reservas" onClick={closeMenu}>Reservas</Link></li>
        <li><a href="#contacto" onClick={scrollToFooter}>Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Header;
