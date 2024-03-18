// Importamos React y los hooks Link y useParams de react-router-dom
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import '../../css/Vocals/VocalPage.css';  

// Definimos un componente funcional llamado VocalPage
const VocalPage = () => {
  // Usamos el hook useParams para obtener el parámetro de la URL
  const { vocal } = useParams();

  // Renderizamos el contenido del componente
  return (
    <div className='main-container'>
      <div className="button-container">
        <button className="button-left"><FaHome size={50} /></button>
        <Link to={`/`}>
          <button className="button-right"><FaArrowLeft size={50} /></button>
        </Link>
        <Link to={`/vocal/${vocal}/conciencia-fonemica`}>
          <button className="button-right"><FaArrowRight size={50} /></button>
        </Link>
      </div>
      <div>
        {/* Mostramos el título del componente con la vocal obtenida */}
        <h2>Vocal: {vocal}</h2>
        {/* Mostramos un mensaje relacionado con la vocal */}
        <div className='speech-bubble'>
        <p>Aquí se realizará un ejercicio con la vocal {vocal}.</p>
        </div>
        
      </div>
    </div>

  );
};

// Exportamos el componente VocalPage para su uso en otros archivos
export default VocalPage;
