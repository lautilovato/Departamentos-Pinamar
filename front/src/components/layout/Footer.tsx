import React from 'react';
import '../../Home/Home.css'; // Corregir la ruta del import

const Footer: React.FC = () => {
  return (
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
        <p>&copy; 2025 Lautaro 225. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
