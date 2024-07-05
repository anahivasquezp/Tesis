import React, { useState, useEffect, useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { ChildContext } from './ChildContext';
import styles from '../../css/Access/EditChild.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function EditChild() {
  const { selectedChild } = useContext(ChildContext);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [characterImages, setCharacterImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);

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

  useEffect(() => {
    const message = "Editar la información del niño.";
    const utterance = new SpeechSynthesisUtterance(message);
    let timer;

    const showBubble = () => {
      setIsBubbleVisible(true);
      setNicaImage(nicaPresenting);
      timer = setTimeout(() => {
        setIsBubbleVisible(false);
        setNicaImage(nicaNeutral);
      }, 5000);
    };

    showBubble();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const message = "Editar la información del niño.";
      const utterance = new SpeechSynthesisUtterance(message);

      const handleSoundClick = () => {
        speechSynthesis.speak(utterance);
      };

      soundButton.addEventListener('click', handleSoundClick);

      return () => {
        soundButton.removeEventListener('click', handleSoundClick);
      };
    }
  }, [isBubbleVisible]);

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setNicaImage(nicaPresenting);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const getNicaImageStyle = () => {
    if (nicaImage === nicaPresenting) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
  };

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
    <div className={styles.editChildContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
        <Link to="/chooseChild" className={`${styles.topButton} ${styles.backButton}`}>
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.editTitle}>Editar un niño</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleUpdateChild}>
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

          <button type="submit" className={styles.editButton}>Guardar</button>
        </form>
        <button onClick={handleDeleteChild} className={styles.deleteButton}>Eliminar</button>
      </div>
      <div className={styles.imageContainer}>
        {characterImages.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.id}
            onClick={() => setSelectedImage(image.url)}
            className={`${styles.characterImage} ${selectedImage === image.url ? styles.selected : ''}`}
            style={selectedImage === image.url ? { width: '150px', height: '150px' } : {}}
          />
        ))}
      </div>
      <div className={styles.characterContainer}>
        {isBubbleVisible && (
          <div className={styles.speechBubble}>
            <p className={styles.welcomeText}>Editar la información del niño.</p>
            <button id="soundButton" className={styles.soundButton}>
              <i className="fas fa-volume-up"></i>
            </button>
          </div>
        )}
        <img src={nicaImage} alt="Character" className={styles.mainCharacterImage} style={getNicaImageStyle()} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Logout"
        className={styles.modal}
        overlayClassName={styles.overlay}
        shouldCloseOnOverlayClick={true}
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

export default EditChild;
