import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Departamentos Pinamar</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><a href="#departamentos">Departamentos</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with Image */}
        <section className="hero-section">
          <div className="hero-image">
            <img 
              src="/images/hero-image.jpg"
              alt="Departamentos en Pinamar" 
              className="hero-img"
            />
            <div className="hero-overlay">
              <h1>Bienvenidos a Departamentos Pinamar</h1>
              <p>El lugar perfecto para tus vacaciones</p>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="info-section">
          <div className="container">
            <div className="info-grid">
              <div className="info-card">
                <h3>Ubicación Privilegiada</h3>
                <p>
                  Nuestros departamentos se encuentran en las mejores zonas de Pinamar, 
                  a pocas cuadras de la playa y cerca de todos los servicios que necesitas.
                </p>
              </div>
              <div className="info-card">
                <h3>Comodidad y Confort</h3>
                <p>
                  Departamentos totalmente equipados con aire acondicionado, WiFi, 
                  cocina completa y todas las comodidades para una estadía perfecta.
                </p>
              </div>
              <div className="info-card">
                <h3>Experiencia Única</h3>
                <p>
                  Disfruta de Pinamar con la tranquilidad de alojarte en un lugar 
                  seguro, limpio y con atención personalizada las 24 horas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📍 Pinamar, Buenos Aires</p>
            <p>📞 +54 9 11 1234-5678</p>
            <p>✉️ info@departamentospinamar.com</p>
          </div>
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="WhatsApp">WhatsApp</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Información</h4>
            <a href="#politicas">Políticas de cancelación</a>
            <a href="#terminos">Términos y condiciones</a>
            <a href="#preguntas">Preguntas frecuentes</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Departamentos Pinamar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;