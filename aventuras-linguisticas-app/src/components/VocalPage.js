// VocalPage.js  
  
import React from 'react';  
import { Link, useParams } from 'react-router-dom';  
  
const VocalPage = () => {  
  const { vocal } = useParams();  
  return (  
    <div>  
      <h2>Vocal: {vocal}</h2>  
      <p>Aquí se realizará un ejercicio con la vocal {vocal}.</p>  
      <Link to={`/vocal/${vocal}/conciencia-fonemica`}>  
        <button>Ir a conciencia fonémica de la vocal {vocal}</button>  
      </Link>  
    </div>  
  );  
};  
  
export default VocalPage;  
