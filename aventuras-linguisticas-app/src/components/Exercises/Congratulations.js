import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Congratulations() {
  const navigate = useNavigate();
  const { fonema } = useParams();  // Aquí obtienes la letra

  return (
    <div>
      <h1>Felicitaciones, has completado los ejercicios de la letra {fonema}!</h1>
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
}

export default Congratulations;
