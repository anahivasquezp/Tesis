import React from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import { useDocumentData } from 'react-firebase-hooks/firestore';  
import { db } from "../../firebase";  // Importa tu instancia de Firestore
import { collection, doc } from 'firebase/firestore';  
  
function ConcienciaFonemicaExerciseFull() {  
  const { fonema } = useParams(); 
  const navigate = useNavigate(); 
  const [value, loading, error] = useDocumentData(  
    doc(collection(db, 'exercises'), fonema)  
  ); 

  const handleNextPage = () => {
    navigate(`/SyllableExercise/${fonema}`); // Asegúrate de que la ruta sea correcta
  }
  
  return (  
    <div>  
      {loading && <p>Cargando...</p>}  
      {error && <p>Error :(</p>}  
      {value && (  
        <div>  
          <h1>Conciencia Fonémica de la {fonema.toUpperCase()}</h1>  
          {value.concienciaFonemica.map((item, index) => (  
            <div key={index}>  
              <video src={item.video} controls />  
              <audio src={item.audio} controls />  
              <button onClick={() => alert('Visto!')}>Visto</button>  
              <button onClick={() => alert('X!')}>X</button>  
              <button onClick={handleNextPage}>Siguiente</button>  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
}  
  
export default ConcienciaFonemicaExerciseFull;  
