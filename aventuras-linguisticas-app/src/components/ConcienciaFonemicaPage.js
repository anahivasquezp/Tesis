// PhonemicAwarenessPage.js  
  
import React, { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';  
import getGifUrl from '../apis/apiGiphy';  
  
const ConcienciaFonemicaPage = () => {  
  const { vocal } = useParams();  
  const [gifUrl, setGifUrl] = useState(null);  
  
  useEffect(() => {  
    const fetchGif = async () => {  
      //const searchQuery = `Conciencia fonemica ${vocal}`;  
      const searchQuery = `${vocal}`;  
      const url = await getGifUrl(searchQuery);  
      setGifUrl(url);  
    };  
  
    fetchGif();  
  }, [vocal]);  
  
  return (  
    <div>  
      <h2>Conciencia fonémica de la vocal: {vocal}</h2>  
      {gifUrl && <img src={gifUrl} alt={`GIF de la vocal ${vocal}`} />}  
    </div>  
  );  
};  
  
export default ConcienciaFonemicaPage; 