import React, { useState } from 'react';
import './ImageGallery.css';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const ImageGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Aquí puedes agregar las imágenes de tu establecimiento
  const images: GalleryImage[] = [
    {
      id: 1,
      src: '/images/gallery/departamento-1.jpg',
      alt: 'Vista del departamento',
      title: 'Departamento Principal'
    },
    {
      id: 2,
      src: '/images/gallery/departamento-2.jpg',
      alt: 'Cocina equipada',
      title: 'Cocina Completa'
    },
    {
      id: 3,
      src: '/images/gallery/departamento-3.jpg',
      alt: 'Dormitorio',
      title: 'Cama Confortable'
    },
    {
      id: 4,
      src: '/images/gallery/departamento-4.jpg',
      alt: 'Baño',
      title: 'Baño Moderno'
    },
    {
      id: 5,
      src: '/images/gallery/departamento-5.jpg',
      alt: 'Parque',
      title: 'Parque y Áreas Verdes'
    },
    {
      id: 6,
      src: '/images/gallery/departamento-6.jpg',
      alt: 'Estacionamiento',
      title: 'Estacionamiento Seguro'
    }
  ];

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <section className="gallery-section">
      <div className="container">
        <h2 className="gallery-title">Conoce Nuestras Instalaciones</h2>
        <p className="gallery-subtitle">
          Explora nuestros cómodos departamentos y todas las comodidades que ofrecemos
        </p>
        
        <div className="gallery-grid">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => openModal(image)}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="gallery-image"
                onError={(e) => {
                  // Imagen de placeholder si no se encuentra la imagen
                  e.currentTarget.src = '/images/hero-image.jpg';
                }}
              />
              <div className="gallery-overlay">
                <h3 className="gallery-item-title">{image.title}</h3>
                <span className="gallery-view-icon">👁️ Ver más</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para ver imagen en tamaño completo */}
      {selectedImage && (
        <div className="gallery-modal" onClick={handleBackdropClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="modal-image"
            />
            <h3 className="modal-title">{selectedImage.title}</h3>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGallery;
