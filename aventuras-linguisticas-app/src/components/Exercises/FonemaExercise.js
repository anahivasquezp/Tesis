import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ChildContext } from '../Access/ChildContext';
import '../../css/Exercises/FonemaExercise.css'; // Importamos los estilos CSS

const db = getFirestore();

function FonemaExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [imageURL, setImageURL] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, `images/fonemas/Fonema_${fonema.toUpperCase()}.webp`);
    const audioRef = ref(storage, `audios/fonemas/Audio_Fonema_${fonema.toUpperCase()}.m4a`);

    getDownloadURL(imageRef)
      .then((url) => {
        setImageURL(url);
        setImageLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga de la imagen", error);
        setImageLoading(false);
      });

    getDownloadURL(audioRef)
      .then((url) => {
        setAudioURL(url);
        setAudioLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga del audio", error);
        setAudioLoading(false);
      });
  }, [fonema]);

  const handleNextPage = () => {
    navigate(`/PhonemicExerciseFull/${fonema}`);
  }

  const playAudio = () => {
    const audio = new Audio(audioURL);
    audio.play();
  }

  const handleVisto = async () => {
    const newScore = (selectedChild.scores?.[fonema] || 0) + 1;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [fonema]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.${fonema}`]: newScore
    });

    setSelectedChild(updatedChild);

    navigate(`/PhonemicExerciseFull/${fonema}`);
  };

  return (
    <div className="main-container">
      {loading && <p>Cargando...</p>}
      {error && <p>Error :(</p>}
      {value && (
        <div className="content-container">
          <h1 className="title">Fonema de la {fonema.toUpperCase()}</h1>
          {imageLoading ? (
            <p>Cargando imagen...</p>
          ) : imageURL ? (
            <img src={imageURL} alt={`Imagen del fonema ${fonema}`} className="fonema-image" />
          ) : (
            <p>No se pudo cargar la imagen.</p>
          )}
          {audioLoading ? (
            <p>Cargando audio...</p>
          ) : audioURL ? (
            <button onClick={playAudio} className="audio-button">Reproducir sonido</button>
          ) : (
            <p>No se pudo cargar el audio.</p>
          )}
          <div className="button-group">
            <button onClick={handleVisto} className="action-button button-check">Visto</button>
            <button onClick={() => alert('X!')} className="action-button button-times">X</button>
            <button onClick={handleNextPage} className="action-button next-button">Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FonemaExercise;
