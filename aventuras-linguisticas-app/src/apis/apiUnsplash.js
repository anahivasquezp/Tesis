// Importamos axios para realizar solicitudes HTTP
import axios from 'axios';

// Definimos una instancia de axios con la configuración base para acceder a la API de Unsplash
const api = axios.create({
  baseURL: 'https://api.unsplash.com',  // URL base de la API de Unsplash
  headers: {
    Authorization: 'Client-ID gbtVJRxcMYkjn7Fn_QYSVUJS8Z_RuWt_uNR94zrIoa4'  // Clave de acceso de cliente para autenticación
  }
});

// Exportamos la instancia de axios configurada para que esté disponible para su uso en otros archivos
export default api;
