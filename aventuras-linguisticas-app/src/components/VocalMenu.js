// Importamos React, useEffect y useState desde la biblioteca 'react'
import React, { useEffect, useState } from 'react';
// Importamos el archivo apiUnsplash que contiene la instancia de axios configurada para acceder a la API de Unsplash
import apiUnsplash from '../apis/apiUnsplash';
// Importamos el componente VocalButton
import VocalButton from '../components/VocalButton';
// Importamos los estilos CSS para el menú vocal
import '../css/VocalMenu.css';

// Definimos un componente funcional llamado App
function App() {
  // Definimos un estado para almacenar las URLs de las imágenes de cada vocal
  const [imagenes, setImagenes] = useState({ a: '', e: '', i: '', o: '', u: '' });

  // Definimos listas de palabras para cada vocal
  const palabrasConA = ['abeja', 'araña', 'avión', 'ancla', 'auto'];
  const palabrasConE = ['elefante', 'escoba', 'espejo', 'estrella', 'escarabajo'];
  const palabrasConI = ['iglesia', 'isla', 'iglú', 'imán', 'insecto'];
  const palabrasConO = ['oso', 'olla', 'ojo', 'oso', 'oruga'];
  const palabrasConU = ['uva', 'unicornio', 'universo', 'utensilio', 'uniforme'];

  // Seleccionamos una palabra aleatoria para cada vocal
  const palabraAleatoriaA = palabrasConA[Math.floor(Math.random() * palabrasConA.length)];
  const palabraAleatoriaE = palabrasConE[Math.floor(Math.random() * palabrasConE.length)];
  const palabraAleatoriaI = palabrasConI[Math.floor(Math.random() * palabrasConI.length)];
  const palabraAleatoriaO = palabrasConO[Math.floor(Math.random() * palabrasConO.length)];
  const palabraAleatoriaU = palabrasConU[Math.floor(Math.random() * palabrasConU.length)];

  // Utilizamos useEffect para ejecutar la lógica de obtener imágenes al cargar el componente
  useEffect(() => {
    // Definimos una función asincrónica para obtener las imágenes de cada vocal
    const fetchImagenes = async () => {
      try {
        // Realizamos solicitudes para obtener imágenes de cada vocal utilizando la API de Unsplash
        const responseA = await apiUnsplash.get('/search/photos', {
          params: {
            query: palabraAleatoriaA,
            per_page: 1
          }
        });
        const responseE = await apiUnsplash.get('/search/photos', {
          params: {
            query: palabraAleatoriaE,
            per_page: 1
          }
        });
        const responseI = await apiUnsplash.get('/search/photos', {
          params: {
            query: palabraAleatoriaI,
            per_page: 1
          }
        });
        const responseO = await apiUnsplash.get('/search/photos', {
          params: {
            query: palabraAleatoriaO,
            per_page: 1
          }
        });
        const responseU = await apiUnsplash.get('/search/photos', {
          params: {
            query: palabraAleatoriaU,
            per_page: 1
          }
        });

        // Actualizamos el estado con las URLs de las imágenes obtenidas
        setImagenes({
          a: responseA.data.results[0].urls.small,
          e: responseE.data.results[0].urls.small,
          i: responseI.data.results[0].urls.small,
          o: responseO.data.results[0].urls.small,
          u: responseU.data.results[0].urls.small
        });
      } catch (error) {
        console.log(error);
      }
    };

    // Llamamos a la función fetchImagenes al cargar el componente
    fetchImagenes();
  }, []); // Especificamos un arreglo vacío como dependencia para que useEffect solo se ejecute una vez al montar el componente

  // Renderizamos el contenido del componente
  return (
    <div className="vocal-menu">
      <div>
        <h1>Ejercicios con Vocales</h1>
      </div>
      <div className='vocal-container'>
        {/* Renderizamos el componente VocalButton para cada vocal con sus respectivas imágenes */}
        <VocalButton vocal="a" imagen={imagenes.a} />
        <VocalButton vocal="e" imagen={imagenes.e} />
        <VocalButton vocal="i" imagen={imagenes.i} />
        <VocalButton vocal="o" imagen={imagenes.o} />
        <VocalButton vocal="u" imagen={imagenes.u} />
      </div>
    </div>
  );
}

// Exportamos el componente App para su uso en otros archivos
export default App;
