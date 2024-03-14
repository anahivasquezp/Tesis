// Importamos React y hooks de react-router-dom y apiGiphy
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getGifUrl from '../apis/apiGiphy'; // Importamos la función getGifUrl desde apiGiphy

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
    <div>
      {/* Mostramos el título del componente con la vocal obtenida */}
      <h2>Conciencia fonémica de la vocal: {vocal}</h2>
      {/* Mostramos la imagen del gif si la URL del gif está disponible */}
      {gifUrl && <img src={gifUrl} alt={`GIF de la vocal ${vocal}`} />}
    </div>
  );
};

export default ConcienciaFonemicaPage;
