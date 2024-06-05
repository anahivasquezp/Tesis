import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from "../../firebase";  // Importa tu instancia de Firestore
import { collection, doc } from 'firebase/firestore';
import { getPhotoByKeyword } from '../../apis/apiUnsplash';


const syllableTypes = ['silaba_inicial', 'silaba_media', 'silaba_final', 'silaba_inversa'];

function SyllableExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [syllableIndex, setSyllableIndex] = useState(0);
  const [images, setImages] = useState({});
  const [imageLoading, setImageLoading] = useState(true);

  const currentSyllableType = syllableTypes[syllableIndex];

  useEffect(() => {
    const loadImages = async () => {
      if (value && value[currentSyllableType]) {
        const newImages = {};
        for (const word of value[currentSyllableType]) {
          const imageUrl = await getPhotoByKeyword(word);
          newImages[word] = imageUrl;
        }
        setImages(newImages);
        setImageLoading(false);
      }
    };
    setImageLoading(true);
    loadImages();
  }, [value, currentSyllableType]);

  const handleNextPage = () => {
    if (syllableIndex < syllableTypes.length - 1) {
      setSyllableIndex(syllableIndex + 1);
      setImageLoading(true);
      setImages({});
    } else {
      navigate(`/PhraseExercise/${fonema}`);
    }
  }

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error :(</p>}
      {value && (
        <div>
          <h1>Sílabas de la {fonema.toUpperCase()}</h1>
          <h2>{currentSyllableType.replace('silaba_', 'Sílabas ').toUpperCase()}</h2>
          {value[currentSyllableType] && value[currentSyllableType].map((word, index) => (
            <div key={index}>
              <p>{word}</p>
              {imageLoading ? (
                <p>Cargando imagen...</p>
              ) : images[word] ? (
                <img src={images[word]} alt={word} />
              ) : (
                <p>No se pudo cargar la imagen.</p>
              )}
              <audio src={value.audios ? value.audios[word] : null} controls />
            </div>
          ))}
          <button onClick={() => alert('Visto!')}>Visto</button>
          <button onClick={() => alert('X!')}>X</button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default SyllableExercise;
