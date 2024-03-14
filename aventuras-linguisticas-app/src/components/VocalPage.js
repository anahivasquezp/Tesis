// Importamos React y los hooks Link y useParams de react-router-dom
import React from 'react';
import { Link, useParams } from 'react-router-dom';

// Definimos un componente funcional llamado VocalPage
const VocalPage = () => {
  // Usamos el hook useParams para obtener el parámetro de la URL
  const { vocal } = useParams();

  // Renderizamos el contenido del componente
  return (
    <div>
      {/* Mostramos el título del componente con la vocal obtenida */}
      <h2>Vocal: {vocal}</h2>
      {/* Mostramos un mensaje relacionado con la vocal */}
      <p>Aquí se realizará un ejercicio con la vocal {vocal}.</p>
      {/* Creamos un enlace para dirigir al usuario a la página de conciencia fonémica de la vocal */}
      <Link to={`/vocal/${vocal}/conciencia-fonemica`}>
        {/* Renderizamos un botón para ir a la página de conciencia fonémica */}
        <button>Ir a conciencia fonémica de la vocal {vocal}</button>
      </Link>
    </div>
  );
};

// Exportamos el componente VocalPage para su uso en otros archivos
export default VocalPage;
