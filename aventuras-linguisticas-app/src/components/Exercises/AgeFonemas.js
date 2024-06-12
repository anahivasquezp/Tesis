import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../css/Exercises/AgeFonemas.css';

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

  const fonemas = loadFonemasByAge(age);

  return (
    <div className="main-container">
      <h1 className="title">Fonemas para {age} años</h1>
      <div className="fonemas-container">
        {fonemas.map(fonema => (
          <button key={fonema} className="fonema-button">
            <Link to={`/exercise/${fonema}`}>{fonema.toUpperCase()}</Link>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AgeFonemas;
