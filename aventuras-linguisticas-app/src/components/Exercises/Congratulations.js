import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChildContext } from '../Access/ChildContext';
import '../../css/Exercises/Congratulations.css'; // Importamos los estilos CSS

function Congratulations() {
  const navigate = useNavigate();
  const { fonema } = useParams();  // Aquí obtienes la letra
  const { selectedChild } = useContext(ChildContext); // Usa el contexto del niño seleccionado

  // Verifica si selectedChild está definido
  if (!selectedChild) {
    return (
      <div className="main-container">
        <div className="content-container">
          <h1>No se ha seleccionado ningún niño</h1>
          <button onClick={() => navigate('/chooseChild')} className="action-button">Volver a seleccionar niño</button>
        </div>
      </div>
    );
  }

  const score = selectedChild.scores?.[fonema] || 0; // Obtén el puntaje del fonema actual

  return (
    <div className="main-container">
      <div className="content-container">
        <h1>Felicitaciones, has completado los ejercicios de la letra {fonema.toUpperCase()}!</h1>
        <p>Tu puntaje: {score}</p> {/* Muestra el puntaje */}
        <button onClick={() => navigate('/')} className="action-button">Volver al inicio</button>
      </div>
    </div>
  );
}

export default Congratulations;
