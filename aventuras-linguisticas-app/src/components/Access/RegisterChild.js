import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/Access/RegisterChild.css';

function RegisterChild() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [characterImages, setCharacterImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacterImages = async () => {
      const storage = getStorage();
      const characterPromises = [];

      for (let i = 1; i <= 9; i++) {
        const imageRef = ref(storage, `images/invitados/invitado${i}.webp`);
        characterPromises.push(
          getDownloadURL(imageRef).then((url) => ({ id: `invitado${i}`, url }))
        );
      }

      const characters = await Promise.all(characterPromises);
      setCharacterImages(characters);
    };

    fetchCharacterImages();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const differenceInMs = Date.now() - birthDate.getTime();
    const ageDt = new Date(differenceInMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const registerChild = async (event) => {
    event.preventDefault();

    const age = calculateAge(birthDate);

    if (age < 3) {
      setError('El niño debe tener al menos 3 años para ser registrado.');
      return;
    }

    if (!name || !birthDate || !selectedImage) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      console.error('No user is authenticated.');
      return;
    }

    try {
      await addDoc(collection(db, 'children'), {
        name: name,
        birthDate: birthDate,
        characterImage: selectedImage,
        therapistId: user.uid,
      });

      navigate('/chooseChild');
    } catch (error) {
      console.error('Error al registrar al niño', error);
    }
  };

  return (
    <div className="register-child-container">
      <Link to="/" className="btn btn-secondary back-home-button">
        <i className="fas fa-home"></i>
      </Link>
      <Link to="/chooseChild" className="btn btn-secondary back-choose-child-button">
        <i className="fas fa-arrow-left"></i>
      </Link>
      <div className="form-container">
        <h1 className="register-title">Registrar un niño</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={registerChild}>
          <label htmlFor="name" className="form-label">Nombre:</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={name}
            placeholder="Nombre"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="birthDate" className="form-label">Fecha de nacimiento:</label>
          <input
            type="date"
            name="birthDate"
            className="form-input"
            value={birthDate}
            placeholder="Fecha de nacimiento"
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <button type="submit" className="register-button">Registrar</button>
        </form>
      </div>
      <div className="image-container">
        {characterImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.id}
            onClick={() => setSelectedImage(image.url)}
            className={`character-image ${selectedImage === image.url ? 'selected' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

export default RegisterChild;
