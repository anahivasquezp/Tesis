import React, { useEffect, useState } from 'react';    
import apiUnsplash from '../apis/apiUnsplash';  
import VocalButton from '../components/VocalButton'; 
import '../css/VocalMenu.css';
    
function App() {    
  const [imagenes, setImagenes] = useState({ a: '', e: '', i: '', o: '', u: '' });    
  
  const palabrasConA = ['abeja', 'araña', 'avión', 'ancla', 'auto'];    
  const palabrasConE = ['elefante', 'escoba', 'espejo', 'estrella', 'escarabajo'];  
  const palabrasConI = ['iglesia', 'isla', 'iglú', 'imán', 'insecto'];  
  const palabrasConO = ['oso', 'olla', 'ojo', 'oso', 'oruga'];  
  const palabrasConU = ['uva', 'unicornio', 'universo', 'utensilio', 'uniforme'];  
  
  const palabraAleatoriaA = palabrasConA[Math.floor(Math.random() * palabrasConA.length)];  
  const palabraAleatoriaE = palabrasConE[Math.floor(Math.random() * palabrasConE.length)];  
  const palabraAleatoriaI = palabrasConI[Math.floor(Math.random() * palabrasConI.length)];  
  const palabraAleatoriaO = palabrasConO[Math.floor(Math.random() * palabrasConO.length)];  
  const palabraAleatoriaU = palabrasConU[Math.floor(Math.random() * palabrasConU.length)];  
  
  useEffect(() => {    
    const fetchImagenes = async () => {    
      try {    
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
    
    fetchImagenes();    
  }, []);    
    
  
  return (
     
    <div className="vocal-menu"> 
      <div>
        <h1>Ejercicios con Vocales</h1> 
      </div> 
      <div className='vocal-container'>
        <VocalButton vocal="a" imagen={imagenes.a} />  
        <VocalButton vocal="e" imagen={imagenes.e} />  
        <VocalButton vocal="i" imagen={imagenes.i} />  
        <VocalButton vocal="o" imagen={imagenes.o} />  
        <VocalButton vocal="u" imagen={imagenes.u} /> 
      </div>
       
    </div>  
  );  
}  
  
export default App;  
