import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';

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
    <div>
      <h1>Conciencia Fonémica: Piano</h1>
      <img src={imageUrl} alt="Piano" />
      <button>Escuchar Sonido</button>
      <button>Correcto</button>
      <button>Incorrecto</button>
      <button onClick={() => navigate('/phonemic-awareness-dog')}>Siguiente</button>
    </div>
  );
}

export default PhonemicExercisePiano;
