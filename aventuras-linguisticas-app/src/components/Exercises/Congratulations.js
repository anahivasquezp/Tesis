import React from 'react';
import { useNavigate } from 'react-router-dom';

function Congratulations() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Felicitaciones, has completado los ejercicios!</h1>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
}

export default Congratulations;
