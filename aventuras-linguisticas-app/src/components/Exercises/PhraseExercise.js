import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { ChildContext } from '../Access/ChildContext';

const db = getFirestore(); // Inicializa Firestore

function FraseExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext); // Obtén y actualiza el niño seleccionado
  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [imageURL, setImageURL] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (value) {
      const storage = getStorage();
      const imageRef = ref(storage, `images/frases/Frase_${fonema.toUpperCase()}.webp`);

      console.log(`Fetching image for Frase_${fonema.toUpperCase()}.webp`);

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
    }
  }, [value, fonema]);

  const handleNextPage = () => {
    navigate(`/Congratulations/${fonema}`); // Asegúrate de que la ruta sea correcta
  }

  const handleVisto = async () => {
    if (selectedChild) {
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
      handleNextPage();
    } else {
      console.error("No child selected");
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error :(</p>}
      {value && (
        <div>
          <h1>Frase de la {fonema.toUpperCase()}</h1>
          <p>{value.frase}</p>
          {imageLoading ? (
            <p>Cargando imagen...</p>
          ) : imageURL ? (
            <img src={imageURL} alt={`Frase ${fonema}`} />
          ) : (
            <p>No se pudo cargar la imagen.</p>
          )}
          <audio src={value.audio} controls />
          <button onClick={handleVisto}>Visto</button>
          <button onClick={() => alert('X!')}>X</button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default FraseExercise;
