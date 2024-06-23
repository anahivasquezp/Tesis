import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/PhonemicExerciseFull.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root');

const db = getFirestore();

function ConcienciaFonemicaExerciseFull() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [videoIndex, setVideoIndex] = useState(0);
  const [videoURL, setVideoURL] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  const syllables = ["A", "E", "I", "O", "U"];

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
      setVideoURL(null);
    } else {
      navigate(`/SyllableExercise/${fonema}`);
    }
  };

  const handlePreviousVideo = () => {
    if (videoIndex > 0) {
      setVideoIndex(videoIndex - 1);
      setVideoLoading(true);
      setVideoURL(null);
    } else {
      navigate(`/exercise/${fonema}`);
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
      '3': ['m', 'ch', 'k', 'n', 'ñ', 'p', 't', 'f', 'y', 'l', 'j'],
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
        <h1 className={styles.exerciseTitle}>Conciencia Fonémica: {fonema.toUpperCase()}{syllables[videoIndex]}</h1>
        {loading ? (
          <p className={styles.loadingText}>Cargando...</p>
        ) : error ? (
          <p>Error :(</p>
        ) : (
          <>
            {videoLoading ? (
              <p className={styles.loadingText}>Cargando video...</p>
            ) : videoURL ? (
              <video src={videoURL} controls className={styles.fonemaVideo} />
            ) : (
              <p>No se pudo cargar el video.</p>
            )}
            <div className={styles.buttonContainer}>
              <button onClick={handlePreviousVideo} className={`${styles.exerciseButton} ${styles.backButton}`}>
                <i className="fas fa-arrow-left"></i> Atrás
              </button>
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
              <button onClick={handleNextVideo} className={`${styles.exerciseButton} ${styles.nextButton}`}>
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

export default ConcienciaFonemicaExerciseFull;
