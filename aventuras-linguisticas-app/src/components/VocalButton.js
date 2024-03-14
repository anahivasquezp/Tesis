// Importamos React y el componente Link de react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/VocalButton.css'; // Importamos los estilos CSS para el componente

// Definimos un componente funcional llamado VocalButton que recibe dos propiedades: vocal e imagen
const VocalButton = ({ vocal, imagen }) => {
  return (
    <div className='VocalButton'>
      {/* Utilizamos el componente Link para crear un enlace a la ruta correspondiente a la vocal */}
      <Link to={`/vocal/${vocal}`}>
        {/* Renderizamos un botón con el valor de la vocal */}
        <button>{vocal}</button>
      </Link>
      {/* Creamos un contenedor para la imagen y la mostramos si la URL de la imagen está disponible */}
      <div className='image-container'>
        <img src={imagen} alt={`Imagen de ${vocal}`} />
      </div>
    </div>
  );
};

// Exportamos el componente VocalButton para su uso en otros archivos
export default VocalButton;
