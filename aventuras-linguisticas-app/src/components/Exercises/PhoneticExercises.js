import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Exercises/PhoneticExercises.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function PhoneticExercises() {
  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const { selectedChild } = useContext(ChildContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const files = ['perro', 'gato', 'piano', 'ambulancia']; // Reemplaza con la lista de archivos disponibles
      const randomFile = files[Math.floor(Math.random() * files.length)];
      setFileName(randomFile.toUpperCase());

      const imageRef = ref(storage, `images/concienciaFonetica/${randomFile}.webp`);
      const audioRef = ref(storage, `audios/concienciaFonetica/${randomFile}.mp3`);

      const imageUrl = await getDownloadURL(imageRef);
      const audioUrl = await getDownloadURL(audioRef);

      setImageUrl(imageUrl);
      setAudioUrl(audioUrl);
      setLoading(false);
    };

    const fetchGuestCharacter = () => {
      const storedCharacter = sessionStorage.getItem('guestCharacter');
      if (storedCharacter) {
        setGuestCharacter(JSON.parse(storedCharacter));
      }
    };

    fetchMedia();
    fetchGuestCharacter();
  }, [storage]);

  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleResult = async (isCorrect) => {
    if (auth.currentUser && selectedChild) {
      const score = isCorrect ? 1 : 0;
      const childDoc = doc(db, 'children', selectedChild.id);
      await updateDoc(childDoc, {
        phoneticAwarenessScore: score,
      });
    }
  };

  const handleNext = () => {
    navigate('/Menu');
  };

  const isAuthenticated = auth.currentUser && selectedChild;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    closeModal();
    if (auth.currentUser) {
      signOut(auth).then(() => {
        navigate('/');
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.exerciseContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
          <i className="fas fa-info"></i>
        </button>
        <Link to="/Menu" className={`${styles.topButton} ${styles.menuButton}`}>
          <i className="fas fa-bars"></i>
        </Link>
      </div>
      <div className={styles.userInfoContainer}>
        {isAuthenticated ? (
          <>
            <h2 className={styles.userName}>{selectedChild.name}</h2>
            <img src={selectedChild.characterImage} alt={selectedChild.character} className={styles.userImage} />
          </>
        ) : (
          guestCharacter && (
            <>
              <h2 className={styles.userName}>Invitado</h2>
              <img src={guestCharacter.url} alt="Invitado" className={styles.userImage} />
            </>
          )
        )}
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.exerciseTitle}>Conciencia Fonética: {fileName}</h1>
        {loading ? (
          <p className={styles.loadingText}>Cargando...</p>
        ) : (
          <img src={imageUrl} alt="Ejercicio" className={styles.exerciseImage} />
        )}
        <div className={styles.buttonContainer}>
          <button className={styles.exerciseButton} onClick={playAudio} disabled={loading}>
            <i className="fas fa-volume-up"></i> Escuchar Sonido
          </button>
          {isAuthenticated && (
            <>
              <button className={`${styles.exerciseButton} ${styles.correctButton}`} onClick={() => handleResult(true)} disabled={loading}>
                <i className="fas fa-check"></i> Correcto
              </button>
              <button className={`${styles.exerciseButton} ${styles.incorrectButton}`} onClick={() => handleResult(false)} disabled={loading}>
                <i className="fas fa-times"></i> Incorrecto
              </button>
            </>
          )}
          <button className={`${styles.exerciseButton} ${styles.nextButton}`} onClick={handleNext}>
            <i className="fas fa-arrow-right"></i> Siguiente
          </button>
        </div>
      </div>
      <img src={characterImage} alt="Character" className={styles.mainCharacterImage} />
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

export default PhoneticExercises;
