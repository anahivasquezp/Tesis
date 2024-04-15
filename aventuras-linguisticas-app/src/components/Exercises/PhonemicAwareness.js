import React from 'react';
import { Link } from 'react-router-dom';

function PhonemicAwareness() {
  // Supongamos que cargas imágenes y sonidos desde un API o assets locales
  return (
    <div>
      <h1>Conciencia Fonémica: Piano</h1>
      <img src="piano.jpg" alt="Piano" />
      <button>Escuchar Sonido</button>
      <button>Correcto</button>
      <button>Incorrecto</button>
      <Link to="/congratulations">Siguiente</Link>
    </div>
  );
}

export default PhonemicAwareness;
