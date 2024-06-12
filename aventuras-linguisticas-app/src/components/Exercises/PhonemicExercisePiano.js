import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';
import '../../css/Exercises/PhonemicExercisePiano.css';

function PhonemicExercisePiano() {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      const url = await getPhotoByKeyword('piano');
      setImageUrl(url);
    };

    loadImage();
  }, []);

  return (
    <div className="exercise-container">
      <h1 className="exercise-title">Conciencia Fonémica: Piano</h1>
      <img src={imageUrl} alt="Piano" className="exercise-image" />
      <div className="button-container">
        <button className="exercise-button">
          <i className="fas fa-volume-up"></i> Escuchar Sonido
        </button>
        <button className="exercise-button correct-button">
          <i className="fas fa-check"></i> Correcto
        </button>
        <button className="exercise-button incorrect-button">
          <i className="fas fa-times"></i> Incorrecto
        </button>
        <button className="exercise-button next-button" onClick={() => navigate('/phonemic-awareness-dog')}>
          <i className="fas fa-arrow-right"></i> Siguiente
        </button>
      </div>
    </div>
  );
}

export default PhonemicExercisePiano;
