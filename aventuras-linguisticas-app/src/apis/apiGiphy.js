// API KEY : czF3sSpY8KYHphSZ35KM0Z6ogoYWvEvE
  
import axios from 'axios';  
  
const getGifUrl = async (searchQuery) => {  
  const apiKey = 'czF3sSpY8KYHphSZ35KM0Z6ogoYWvEvE'; // Reemplaza 'TU_API_KEY' con tu clave de API de Giphy  
  
  try {  
    const response = await axios.get('http://api.giphy.com/v1/gifs/search?', {  
      params: {  
        api_key: apiKey,  
        q: searchQuery,  
        limit: 1  
      }  
    });  
  
    if (response.data.data.length > 0) {  
      return response.data.data[0].images.original.url;  
    } else {  
      return null;  
    }  
  } catch (error) {  
    console.error(error);  
    return null;  
  }  
};  
  
export default getGifUrl;  
