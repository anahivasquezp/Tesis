import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';

function PhonemicExerciseDog() {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      const url = await getPhotoByKeyword('perro');
      setImageUrl(url);
    };

    loadImage();
  }, []);

  return (
    <div>
      <h1>Conciencia Fonémica: Perro</h1>
      <img src={imageUrl} alt="Perro" />
      <button>Escuchar Sonido</button>
      <button>Correcto</button>
      <button>Incorrecto</button>
      <button onClick={() => navigate('/phonemic-awareness-ambulance')}>Siguiente</button>
    </div>
  );
}

export default PhonemicExerciseDog;
