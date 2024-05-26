import React from 'react';  
import { useParams, useNavigate } from 'react-router-dom';   
import { useDocumentData } from 'react-firebase-hooks/firestore';  
import { db } from "../../firebase";  // Importa tu instancia de Firestore
import { collection, doc } from 'firebase/firestore'; 


function FraseExercise() {  
  const { fonema } = useParams();  
  const navigate = useNavigate(); 
  const [value, loading, error] = useDocumentData(  
    doc(collection(db, 'exercises'), fonema) 
  );  

  const handleNextPage = () => {
    navigate(`/Congratulations/${fonema}`); // Asegúrate de que la ruta sea correcta
  }
  
  return (  
    <div>  
      {loading && <p>Cargando...</p>}  
      {error && <p>Error :(</p>}  
      {value && (  
        <div>  
          <h1>Frase de la {fonema.toUpperCase()}</h1>  
          <p>{value.frase.frase}</p>  
          <img src={value.frase.imagen} alt="" />  
          <audio src={value.frase.audio} controls /> 
          <button onClick={() => alert('Visto!')}>Visto</button>  
          <button onClick={() => alert('X!')}>X</button>  
          <button onClick={handleNextPage}>Siguiente</button>   
    
        </div>  
      )}  
    </div>  
  );  
}  
  
export default FraseExercise;  
