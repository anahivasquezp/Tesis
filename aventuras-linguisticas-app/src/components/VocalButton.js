import React from 'react';  
  
const VocalButton = ({ vocal, imagen }) => {  
  return (  
    <div>  
      <button>{vocal}</button>  
      <img src={imagen} alt={vocal} />  
    </div>  
  );  
};  
  
export default VocalButton;  
