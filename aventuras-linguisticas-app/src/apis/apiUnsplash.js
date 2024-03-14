import axios from 'axios';  

// Application ID: 578641
// Acces Key: gbtVJRxcMYkjn7Fn_QYSVUJS8Z_RuWt_uNR94zrIoa4
// Secret key: bLXGz8E_zmrKsVIGmDj5GV-OtP9BEkDtAnjwcnmM-og
  
const api = axios.create({  
  baseURL: 'https://api.unsplash.com',  
  headers: {  
    Authorization: 'Client-ID gbtVJRxcMYkjn7Fn_QYSVUJS8Z_RuWt_uNR94zrIoa4'  
  }  
});  
  
export default api;  
