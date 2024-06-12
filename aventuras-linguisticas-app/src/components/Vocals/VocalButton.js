import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Vocals/VocalButton.css'; // Importamos los estilos CSS para el componente

const VocalButton = ({ vocal, imagen }) => {
  return (
    <div className="vocal-button-container">
      <Link to={`/vocal/${vocal}`}>
        <button className="vocal-button">{vocal}</button>
      </Link>
      <div className="image-container">
        <img src={imagen} alt={`Imagen de ${vocal}`} className="vocal-image"/>
      </div>
    </div>
  );
};

export default VocalButton;
