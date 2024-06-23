import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/FonemaExercise.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root');

const db = getFirestore();

function FonemaExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [imageURL, setImageURL] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);

  useEffect(() => {
    const fetchGuestCharacter = () => {
      const storedCharacter = sessionStorage.getItem('guestCharacter');
      if (storedCharacter) {
        setGuestCharacter(JSON.parse(storedCharacter));
      }
    };

    fetchGuestCharacter();
  }, []);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, `images/fonemas/Fonema_${fonema.toUpperCase()}.webp`);
    const audioRef = ref(storage, `audios/fonemas/Audio_Fonema_${fonema.toUpperCase()}.m4a`);

    getDownloadURL(imageRef)
      .then((url) => {
        setImageURL(url);
        setImageLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga de la imagen", error);
        setImageLoading(false);
      });

    getDownloadURL(audioRef)
      .then((url) => {
        setAudioURL(url);
        setAudioLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la URL de descarga del audio", error);
        setAudioLoading(false);
      });
  }, [fonema]);

  const handleNextPage = () => {
    navigate(`/PhonemicExerciseFull/${fonema}`);
  };

  const playAudio = () => {
    const audio = new Audio(audioURL);
    audio.play();
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

    setSelectedChild(updatedChild);
  };

  const handleIncorrecto = async () => {
    const currentScore = selectedChild.scores?.[fonema] || 0;
    const newScore = currentScore > 0 ? currentScore - 1 : 0;
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

    setSelectedChild(updatedChild);
  };

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

  const isAuthenticated = auth.currentUser && selectedChild;

  const getAgeGroup = (fonema) => {
    const ageGroups = {
      '3': ['m', 'ch', 'k', 'n', 'enie', 'p', 't', 'f', 'y', 'l', 'j'],
      '4': ['b', 'd', 'g', 'bl', 'pl'],
      '5': ['r', 'fl', 'kl', 'br', 'kr', 'gr'],
      '6': ['rr', 's', 'gl', 'fr', 'pr', 'tr', 'dr']
    };

    for (const age in ageGroups) {
      if (ageGroups[age].includes(fonema)) {
        return age;
      }
    }
    return null;
  };

  const ageGroup = getAgeGroup(fonema);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
          <i className="fas fa-info"></i>
        </button>
        {ageGroup && (
          <button className={`${styles.topButton} ${styles.menuButton}`} onClick={() => navigate(`/age-fonemas/${ageGroup}`)}>
            <i className="fas fa-bars"></i>
          </button>
        )}
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
        <h1 className={styles.exerciseTitle}>Fonema: {fonema.toUpperCase()}</h1>
        {loading ? (
          <p className={styles.loadingText}>Cargando...</p>
        ) : error ? (
          <p>Error :(</p>
        ) : (
          <>
            {imageLoading ? (
              <p className={styles.loadingText}>Cargando imagen...</p>
            ) : imageURL ? (
              <img src={imageURL} alt={`Imagen del fonema ${fonema}`} className={styles.fonemaImage} />
            ) : (
              <p>No se pudo cargar la imagen.</p>
            )}
            <div className={styles.buttonContainer}>
              {audioLoading ? (
                <p className={styles.loadingText}>Cargando audio...</p>
              ) : audioURL ? (
                <button onClick={playAudio} className={styles.exerciseButton}>
                  <i className="fas fa-volume-up"></i> Escuchar Sonido
                </button>
              ) : (
                <p>No se pudo cargar el audio.</p>
              )}
              {isAuthenticated && (
                <>
                  <button onClick={handleVisto} className={`${styles.exerciseButton} ${styles.correctButton}`}>
                    <i className="fas fa-check"></i> Correcto
                  </button>
                  <button onClick={handleIncorrecto} className={`${styles.exerciseButton} ${styles.incorrectButton}`}>
                    <i className="fas fa-times"></i> Incorrecto
                  </button>
                </>
              )}
              <button onClick={() => navigate(`/PhonemicExerciseFull/${fonema}`)} className={`${styles.exerciseButton} ${styles.nextButton}`}>
                <i className="fas fa-arrow-right"></i> Adelante
              </button>
            </div>
          </>
        )}
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

export default FonemaExercise;
