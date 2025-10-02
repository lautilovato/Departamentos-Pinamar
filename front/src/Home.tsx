import React, { useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  return (
    <div className="home-container">
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
    </div>
  );
};

export default Home;