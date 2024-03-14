import React from 'react';  
import { Link } from 'react-router-dom';
import '../css/VocalButton.css';

  
const VocalButton = ({ vocal, imagen }) => {  
  return (  
    <div className='VocalButton'>  
        <Link to={`/vocal/${vocal}`}>
            <button>{vocal}</button>  
        </Link>        
      <div className='image-container'>
        <img src={imagen} alt={`Imagen de ${vocal}`} />  
      </div>
    </div>  
  );  
};  
  
export default VocalButton;  
