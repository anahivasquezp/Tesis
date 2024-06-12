import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';
import '../../css/Exercises/PhonemicExerciseAmbulance.css';


function PhonemicExerciseAmbulance() {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      const url = await getPhotoByKeyword('ambulancia');
      setImageUrl(url);
    };

    loadImage();
  }, []);

  return (
    <div className="exercise-container">
      <h1 className="exercise-title">Conciencia Fonémica: Ambulancia</h1>
      <img src={imageUrl} alt="Ambulancia" className="exercise-image" />
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
        <button className="exercise-button next-button" onClick={() => navigate('/congratulations')}>
          <i className="fas fa-arrow-right"></i> Siguiente
        </button>
      </div>
    </div>
  );
}

export default PhonemicExerciseAmbulance;
