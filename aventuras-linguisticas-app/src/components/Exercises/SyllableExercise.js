import React from 'react';  
import { useParams, useNavigate } from 'react-router-dom';   
import { useDocumentData } from 'react-firebase-hooks/firestore';  
import { db } from "../../firebase";  // Importa tu instancia de Firestore
import { collection, doc } from 'firebase/firestore'; 

function SyllableExercise() {  
  const { fonema } = useParams();  
  const navigate = useNavigate(); 
  const [value, loading, error] = useDocumentData(  
    doc(collection(db, 'exercises'), fonema)  
  );  

  const handleNextPage = () => {
    navigate(`/PhraseExercise/${fonema}`); // Asegúrate de que la ruta sea correcta
  }

  return (  
    <div>  
      {loading && <p>Cargando...</p>}  
      {error && <p>Error :(</p>}  
      {value && (  
        <div>  
          <h1>Sílabas de la {fonema.toUpperCase()}</h1>  
          {value.silabas.map((item, index) => (  
            <div key={index}>  
              {item.palabras && <p>{item.palabras.join(', ')}</p>}  
              {item.imagenes && item.imagenes.map((img, i) => (  
                <img key={i} src={img} alt="" />  
              ))}  
              {item.audios && item.audios.map((audio, i) => (  
                <audio key={i} src={audio} controls />  
              ))}  
            </div>  
            
          ))}  
        </div> 
         
      )}  

              <button onClick={() => alert('Visto!')}>Visto</button>  
              <button onClick={() => alert('X!')}>X</button>  
              <button onClick={handleNextPage}>Siguiente</button>   
    </div> 
     
  );  
}  

export default SyllableExercise;