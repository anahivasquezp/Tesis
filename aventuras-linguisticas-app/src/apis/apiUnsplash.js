import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID gbtVJRxcMYkjn7Fn_QYSVUJS8Z_RuWt_uNR94zrIoa4'
  }
});

// Función para obtener una imagen por palabra clave
export const getPhotoByKeyword = async (keyword) => {
  try {
    const response = await api.get(`/search/photos`, {
      params: { query: keyword, per_page: 1 }
    });
    return response.data.results[0].urls.regular;  // Asegúrate de manejar el caso en que no hay resultados
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;  // Puedes manejar los errores de manera más específica si lo deseas
  }
};

export default api;
