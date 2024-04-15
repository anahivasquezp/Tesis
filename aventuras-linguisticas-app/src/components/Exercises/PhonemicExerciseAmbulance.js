import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';

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
    <div>
      <h1>Conciencia Fonémica: Ambulancia</h1>
      <img src={imageUrl} alt="Ambulancia" />
      <button>Escuchar Sonido</button>
      <button>Correcto</button>
      <button>Incorrecto</button>
      <button onClick={() => navigate('/congratulations')}>Siguiente</button>
    </div>
  );
}

export default PhonemicExerciseAmbulance;
