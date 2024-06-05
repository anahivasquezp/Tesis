import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from "../../firebase"; // Importa tu instancia de Firestore
import { collection, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ChildContext } from '../Access/ChildContext';

function FonemaExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild } = useContext(ChildContext);

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

    console.log(`Fetching image for Fonema_${fonema.toUpperCase()}.webp`);
    console.log(`Fetching audio for Audio_Fonema_${fonema.toUpperCase()}.m4a`);

    getDownloadURL(imageRef)
      .then((url) => {
        console.log("Image URL fetched:", url);
        setImageURL(url);
        setImageLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga de la imagen", error);
        setImageLoading(false);
      });

    getDownloadURL(audioRef)
      .then((url) => {
        console.log("Audio URL fetched:", url);
        setAudioURL(url);
        setAudioLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga del audio", error);
        setAudioLoading(false);
      });
  }, [fonema]);

  const handleNextPage = () => {
    navigate(`/PhonemicExerciseFull/${fonema}`); // Asegúrate de que la ruta sea correcta
  }

  const playAudio = () => {
    const audio = new Audio(audioURL);
    audio.play();
  }

  const handleVisto = async () => {
    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.${fonema}`]: (selectedChild.scores?.[fonema] || 0) + 1
    });
    navigate(`/PhonemicExerciseFull/${fonema}`);
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error :(</p>}
      {value && (
        <div>
          <h1>Fonema de la {fonema.toUpperCase()}</h1>
          {imageLoading ? (
            <p>Cargando imagen...</p>
          ) : imageURL ? (
            <img src={imageURL} alt={`Imagen del fonema ${fonema}`} />
          ) : (
            <p>No se pudo cargar la imagen.</p>
          )}
          {audioLoading ? (
            <p>Cargando audio...</p>
          ) : audioURL ? (
            <button onClick={playAudio}>Reproducir sonido</button>
          ) : (
            <p>No se pudo cargar el audio.</p>
          )}
          <button onClick={handleVisto}>Visto</button>
          <button onClick={() => alert('X!')}>X</button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default FonemaExercise;
