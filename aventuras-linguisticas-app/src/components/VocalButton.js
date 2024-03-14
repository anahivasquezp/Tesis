import React from 'react';  
import '../css/VocalButton.css';

  
const VocalButton = ({ vocal, imagen }) => {  
  return (  
    <div className='VocalButton'>  
      <button>{vocal}</button>  
      <div className='image-container'>
      <img src={imagen} alt={`Imagen de ${vocal}`} />  
      </div>
    </div>  
  );  
};  
  
export default VocalButton;  
