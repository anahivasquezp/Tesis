import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ChildContext } from '../Access/ChildContext';

const db = getFirestore(); // Inicializa Firestore

function ConcienciaFonemicaExerciseFull() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext); // Obtén y actualiza el niño seleccionado
  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [videoIndex, setVideoIndex] = useState(0);
  const [videoURL, setVideoURL] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  
  const syllables = ["A", "E", "I", "O", "U"];
  
  useEffect(() => {
    if (videoIndex < syllables.length) {
      const storage = getStorage();
      const videoPath = `videos/${fonema.toUpperCase()}/Audio_ConcienciaFonemica_${fonema.toUpperCase()}${syllables[videoIndex]}.mp4`;
      const videoRef = ref(storage, videoPath);

      console.log(`Fetching video from path: ${videoPath}`);

      getDownloadURL(videoRef)
        .then((url) => {
          console.log("Video URL fetched:", url);
          setVideoURL(url);
          setVideoLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener la URL de descarga del video", error);
          setVideoLoading(false);
        });
    }
  }, [videoIndex, fonema]);

  const handleNextVideo = () => {
    if (videoIndex < syllables.length - 1) {
      setVideoIndex(videoIndex + 1);
      setVideoLoading(true);
      setVideoURL(null); // Reset URL for loading next video
    } else {
      navigate(`/SyllableExercise/${fonema}`);
    }
  };

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

    setSelectedChild(updatedChild); // Actualiza el contexto con el nuevo puntaje

    handleNextVideo(); // Move to the next video after updating the score
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error :(</p>}
      {value && (
        <div>
          <h1>Conciencia Fonémica de la {fonema.toUpperCase()}</h1>
          {videoLoading ? (
            <p>Cargando video...</p>
          ) : videoURL ? (
            <video src={videoURL} controls />
          ) : (
            <p>No se pudo cargar el video.</p>
          )}
          <div>
            <button onClick={handleVisto}>Visto</button>
            <button onClick={() => alert('X!')}>X</button>
            <button onClick={handleNextVideo}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConcienciaFonemicaExerciseFull;
