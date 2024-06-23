import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { ChildContext } from './ChildContext';
import '../../css/Access/RegisterChild.css';

function EditChild() {
  const { selectedChild } = useContext(ChildContext);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [characterImages, setCharacterImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChild) {
      setName(selectedChild.name);
      setBirthDate(selectedChild.birthDate);
      setSelectedImage(selectedChild.characterImage);
    }

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
  }, [selectedChild]);

  const handleUpdateChild = async (event) => {
    event.preventDefault();

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
      const childDoc = doc(db, 'children', selectedChild.id);
      await updateDoc(childDoc, {
        name: name,
        birthDate: birthDate,
        characterImage: selectedImage,
      });

      navigate('/chooseChild');
    } catch (error) {
      console.error('Error al actualizar al niño', error);
    }
  };

  const handleDeleteChild = async () => {
    try {
      const childDoc = doc(db, 'children', selectedChild.id);
      await deleteDoc(childDoc);

      navigate('/chooseChild');
    } catch (error) {
      console.error('Error al eliminar al niño', error);
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
        <h1 className="register-title">Editar un niño</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleUpdateChild}>
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

          <button type="submit" className="register-button">Guardar</button>
        </form>
        <button onClick={handleDeleteChild} className="delete-button">Eliminar</button>
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

export default EditChild;
