import React from 'react';
import { useParams, Link } from 'react-router-dom';

function AgeFonemas() {
  const { age } = useParams();

  const loadFonemasByAge = (age) => {
    const fonemas = {
      '3': ['m', 'ch', 'k', 'n', 'enie', 'p', 't', 'f', 'y', 'l', 'j'],
      '4': ['b', 'd', 'g', 'bl', 'pl'],
      '5': ['r', 'fl', 'kl', 'br', 'kr', 'gr'],
      '6': ['rr', 's', 'gl', 'fr', 'pr', 'tr', 'dr']
    };
    return fonemas[age] || [];
  };
  

  // Asumiendo que tienes un método para cargar fonemas por edad
  const fonemas = loadFonemasByAge(age);

  return (
    <div>
      <h1>Fonemas para {age} años</h1>
      {fonemas.map(fonema => (
        <button key={fonema}>
          <Link to={`/exercise/${fonema}`}>{fonema.toUpperCase()}</Link>
        </button>
      ))}
    </div>
  );
}

export default AgeFonemas;
