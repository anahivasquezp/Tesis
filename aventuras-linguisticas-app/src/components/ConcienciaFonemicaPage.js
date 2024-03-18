// Importamos React y hooks de react-router-dom y apiGiphy
import React, { useEffect, useState } from 'react';
import getGifUrl from '../apis/apiGiphy'; // Importamos la función getGifUrl desde apiGiphy
import { Link, useParams } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import '../css/ConcienciaFonemicaPage.css'; // Importamos los estilos CSS para el componente

// Definimos un componente funcional llamado PhonemicAwarenessPage
const ConcienciaFonemicaPage = () => {
  // Usamos el hook useParams para obtener el parámetro de la URL
  const { vocal } = useParams();

  // Definimos un estado para almacenar la URL del gif
  const [gifUrl, setGifUrl] = useState(null);

  // Utilizamos useEffect para ejecutar la lógica de obtención del gif cuando cambia el parámetro vocal
  useEffect(() => {
    // Definimos una función asincrónica para buscar el gif
    const fetchGif = async () => {
      // Construimos la consulta de búsqueda utilizando la vocal obtenida de los parámetros de la URL

      //const searchQuery = `Conciencia Fonemica ${vocal}`;
      const searchQuery = `${vocal}`;
      // Llamamos a la función getGifUrl para obtener la URL del gif
      const url = await getGifUrl(searchQuery);
      // Actualizamos el estado con la URL del gif obtenido
      setGifUrl(url);
    };

    // Llamamos a la función fetchGif cuando cambia el parámetro vocal
    fetchGif();
  }, [vocal]); // Especificamos que este efecto depende del valor de vocal

  // Renderizamos el contenido del componente
  return (
    <div className='main-container'>
      <div className="button-container">
        <button className="button-left"><FaHome size={50} /></button>
        <Link to={`/vocal/${vocal}`}>
          <button className="button-right"><FaArrowLeft size={50} /></button>
        </Link>
      </div>
      <div>
        {/* Mostramos el título del componente con la vocal obtenida */}
        <h2>Conciencia fonémica de la vocal: {vocal}</h2>
        {/* Mostramos la imagen del gif si la URL del gif está disponible */}
        {gifUrl && <img src={gifUrl} alt={`GIF de la vocal ${vocal}`} />}

        {/* Añadir los botones de "visto" y "equis" */}
        <div className="action-buttons">
          <button className="button-check"><FaCheck size={50} /></button>
          <button className="button-times"><FaTimes size={50} /></button>
        </div>
        <button className='reproducir-sonido' >Reproducir sonido</button>
      </div>
    </div>
  );
};

export default ConcienciaFonemicaPage;
