// API KEY : czF3sSpY8KYHphSZ35KM0Z6ogoYWvEvE

// Importamos axios para hacer solicitudes HTTP
import axios from 'axios';

// Definimos una función asincrónica que recibe una consulta de búsqueda
const getGifUrl = async (searchQuery) => {
  // Clave de API para acceder a Giphy
  const apiKey = 'czF3sSpY8KYHphSZ35KM0Z6ogoYWvEvE'; // Reemplazar con la clave de API de Giphy

  try {
    // Realizamos una solicitud GET a la API de Giphy para buscar gifs
    const response = await axios.get('http://api.giphy.com/v1/gifs/search?', {
      // Parámetros de la solicitud: clave de API, consulta de búsqueda y límite de resultados
      params: {
        api_key: apiKey,
        q: searchQuery,
        limit: 1
      }
    });

    // Verificamos si se encontraron resultados
    if (response.data.data.length > 0) {
      // Devolvemos la URL del gif encontrado
      return response.data.data[0].images.original.url;
    } else {
      // Si no se encontraron resultados, devolvemos null
      return null;
    }
  } catch (error) {
    // Manejamos cualquier error que ocurra durante la solicitud
    console.error(error);
    return null;
  }
};

// Exportamos la función para que esté disponible para su uso en otros archivos
export default getGifUrl;
