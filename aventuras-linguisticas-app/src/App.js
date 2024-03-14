import React, { useEffect, useState } from 'react';  
import apiUnsplash from './apis/apiUnsplash';
import VocalButton from './components/VocalButton';  
  
function App() {  
  const [imagenes, setImagenes] = useState({ a: '', e: '', i: '', o: '', u: '' });  
  
  useEffect(() => {  
    const fetchImagenes = async () => {  
      try {  
        const response = await apiUnsplash.get('/search/photos', {  
          params: {  
            query: 'abeja',  
            per_page: 1  
          }  
        });  
        setImagenes(prevState => ({  
          ...prevState,  
          a: response.data.results[0].urls.small  
        }));  
      } catch (error) {  
        console.log(error);  
      }  
    };  
  
    fetchImagenes();  
  }, []);  
  
  return (  
    <div>  
      <VocalButton vocal="a" imagen={imagenes.a} />  
      <VocalButton vocal="e" imagen={imagenes.e} />  
      <VocalButton vocal="i" imagen={imagenes.i} />  
      <VocalButton vocal="o" imagen={imagenes.o} />  
      <VocalButton vocal="u" imagen={imagenes.u} />  
    </div>  
  );  
}  
  
export default App;  
