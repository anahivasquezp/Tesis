import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import { FaHome, FaArrowRight, FaArrowLeft, FaInfoCircle, FaBars } from 'react-icons/fa';
import styles from '../../css/Vocals/VocalPage.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

const VocalPage = () => {
  const { vocal } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const { selectedChild } = useContext(ChildContext);
  const [guestCharacter, setGuestCharacter] = useState(null);

  useEffect(() => {
    const fetchGuestCharacter = () => {
      const storedCharacter = sessionStorage.getItem('guestCharacter');
      if (storedCharacter) {
        setGuestCharacter(JSON.parse(storedCharacter));
      }
    };

    const fetchVideo = async () => {
      try {
        const videoRef = ref(storage, `videos/vocales/Conciencia_Fonemica_${vocal.toUpperCase()}.mp4`);
        const videoUrl = await getDownloadURL(videoRef);
        setVideoUrl(videoUrl);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('Video no encontrado.');
      }
    };

    fetchGuestCharacter();
    fetchVideo();
  }, [storage, vocal]);

  const handleResult = async (isCorrect) => {
    if (auth.currentUser && selectedChild) {
      const score = isCorrect ? 1 : 0;
      const childDoc = doc(db, 'children', selectedChild.id);
      await updateDoc(childDoc, {
        [`phoneticAwarenessScore_${vocal}`]: score,
      });
    }
  };

  const nextVocal = (currentVocal) => {
    const nextVowels = { a: 'e', e: 'i', i: 'o', o: 'u', u: 'congratulationsVocales' };
    return nextVowels[currentVocal];
  };

  const prevVocal = (currentVocal) => {
    const prevVowels = { e: 'a', i: 'e', o: 'i', u: 'o' };
    return prevVowels[currentVocal];
  };

  const handleNext = () => {
    const next = nextVocal(vocal);
    if (next === 'congratulationsVocales') {
      navigate('/congratulationsVocales');
    } else {
      navigate(`/vocal/${next}/conciencia-fonemica`);
    }
  };

  const handlePrev = () => {
    const prev = prevVocal(vocal);
    if (prev) {
      navigate(`/vocal/${prev}/conciencia-fonemica`);
    }
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
      }).catch((error) => {
        console.error('Error signing out', error);
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
          <i className="fas fa-info"></i>
        </button>
        <Link to="/vocalMenu" className={`${styles.topButton} ${styles.menuButton}`}>
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
        <h1 className={styles.vocalTitle}>Conciencia Fonémica: {vocal.toUpperCase()}</h1>
        <div className={styles.videoContainer}>
          {loading ? (
            <p className={styles.loadingText}>Cargando...</p>
          ) : videoUrl ? (
            <video src={videoUrl} controls className={styles.video} />
          ) : (
            <p className={styles.loadingText}>Video no encontrado.</p>
          )}
        </div>
        <div className={styles.buttonContainer}>

          {['e', 'i', 'o', 'u'].includes(vocal) && (
            <button className={`${styles.exerciseButton} ${styles.backButton}`} onClick={handlePrev}>
              <i className="fas fa-arrow-left"></i> Atrás
            </button>
          )}

          {isAuthenticated && (
            <>
              <button className={`${styles.exerciseButton} ${styles.correctButton}`} onClick={() => handleResult(true)}>
                <i className="fas fa-check"></i> Correcto
              </button>
              <button className={`${styles.exerciseButton} ${styles.incorrectButton}`} onClick={() => handleResult(false)}>
                <i className="fas fa-times"></i> Incorrecto
              </button>
            </>
          )}
          <button className={`${styles.exerciseButton} ${styles.nextButton}`} onClick={handleNext}>
            <i className="fas fa-arrow-right"></i> Adelante
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
};

export default VocalPage;
