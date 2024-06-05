import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from "../../firebase";  // Importa tu instancia de Firestore
import { collection, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function FraseExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
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
          <button onClick={() => alert('Visto!')}>Visto</button>
          <button onClick={() => alert('X!')}>X</button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      )}
    </div>
  );
}

export default FraseExercise;
