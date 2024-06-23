import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../css/Access/RegisterChild.module.css';

Modal.setAppElement('#root'); // Set the app element for accessibility

function RegisterChild() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [characterImages, setCharacterImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out', error);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    closeModal();
    handleLogout();
  };

  return (
    <div className={styles.registerChildContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
       </button>
        <Link to="/chooseChild" className={`${styles.topButton} ${styles.backButton}`}>
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.registerTitle}>Registrar un niño</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={registerChild}>
          <label htmlFor="name" className={styles.formLabel}>Nombre:</label>
          <input
            type="text"
            name="name"
            className={styles.formInput}
            value={name}
            placeholder="Nombre"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="birthDate" className={styles.formLabel}>Fecha de nacimiento:</label>
          <input
            type="date"
            name="birthDate"
            className={styles.formInput}
            value={birthDate}
            placeholder="Fecha de nacimiento"
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <button type="submit" className={styles.registerButton}>Registrar</button>
        </form>
      </div>
      <div className={styles.imageContainer}>
        {characterImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.id}
            onClick={() => setSelectedImage(image.url)}
            className={`${styles.characterImage} ${selectedImage === image.url ? styles.selected : ''}`}
          />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Logout"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2 className={styles.modalTitle}>¿Deseas salir?</h2>
        <div className={styles.modalButtons}>
          <button onClick={confirmLogout} className={styles.confirmButton}>Sí</button>
          <button onClick={closeModal} className={styles.cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default RegisterChild;
