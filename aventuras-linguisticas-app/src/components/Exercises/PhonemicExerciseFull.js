import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/PhonemicExerciseFull.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';
import nicaCorrecto from '../../images/Nica_Correcto.png';
import nicaIncorrecto from '../../images/Nica_Incorrecto.png';

Modal.setAppElement('#root');

const db = getFirestore();

function ConcienciaFonemicaExerciseFull() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const syllables = ["A", "E", "I", "O", "U"];

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [videoIndex, setVideoIndex] = useState(0);
  const [videoURL, setVideoURL] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [bubbleMessage, setBubbleMessage] = useState(`¡Mira el video y repite después la conciencia fonémica de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}${syllables[videoIndex]}!`);
  const [bubbleTimeout, setBubbleTimeout] = useState(null);

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
    if (selectedChild) {
      const currentScore = selectedChild.scores?.[`conciencia_fonemica_${fonema}_${syllables[videoIndex]}`];
      setExerciseScore(currentScore !== undefined ? currentScore : -1);
    }
  }, [selectedChild, fonema, videoIndex]);

  useEffect(() => {
    if (videoIndex < syllables.length) {
      const storage = getStorage();
      const videoPath = `videos/${fonema.toUpperCase()}/Audio_ConcienciaFonemica_${fonema.toUpperCase()}${syllables[videoIndex]}.mp4`;
      const videoRef = ref(storage, videoPath);

      getDownloadURL(videoRef)
        .then((url) => {
          setVideoURL(url);
          setVideoLoading(false);
        })
        .catch((error) => {
          setVideoLoading(false);
        });
    }
  }, [videoIndex, fonema]);

  useEffect(() => {
    const message = `¡Mira el video y repite después la conciencia fonémica de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}${syllables[videoIndex]}!`;
    showBubble(message, nicaPresenting, 10000);
  }, [fonema, videoIndex]);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const handleSoundClick = () => {
        const utterance = new SpeechSynthesisUtterance(bubbleMessage);
        speechSynthesis.speak(utterance);
      };

      soundButton.addEventListener('click', handleSoundClick);

      return () => {
        soundButton.removeEventListener('click', handleSoundClick);
      };
    }
  }, [bubbleMessage]);

  const showBubble = (message, image, duration) => {
    if (bubbleTimeout) {
      clearTimeout(bubbleTimeout);
    }
    setBubbleMessage(message);
    setNicaImage(image);
    setIsBubbleVisible(true);
    const timeout = setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, duration);
    setBubbleTimeout(timeout);
  };

  const handleShowBubble = () => {
    showBubble(`¡Mira el video y repite después la conciencia fonémica de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}${syllables[videoIndex]}!`, nicaPresenting, 10000);
  };

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
    const newScore = 1;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [`conciencia_fonemica_${fonema}_${syllables[videoIndex]}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.conciencia_fonemica_${fonema}_${syllables[videoIndex]}`]: newScore
    });

    setSelectedChild(updatedChild);
    setExerciseScore(newScore);
    showBubble('¡Correcto! ¡Muy bien hecho! ¡Sigue así!', nicaCorrecto, 5000);
  };

  const handleIncorrecto = async () => {
    const newScore = 0;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [`conciencia_fonemica_${fonema}_${syllables[videoIndex]}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.conciencia_fonemica_${fonema}_${syllables[videoIndex]}`]: newScore
    });

    setSelectedChild(updatedChild);
    setExerciseScore(newScore);
    showBubble('¡Oh no! ¡Inténtalo otra vez!', nicaIncorrecto, 5000);
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

  const getNicaImageStyle = () => {
    if (nicaImage === nicaCorrecto) {
      return { width: '500px', height: 'auto' };
    } else if (nicaImage === nicaIncorrecto) {
      return { width: '330px', height: 'auto' };
    } else if (nicaImage === nicaPresenting) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
  };

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
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
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
        <h1 className={styles.exerciseTitle}>Conciencia Fonémica: <span className={styles.fileName}>{fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}{syllables[videoIndex]}</span> </h1>
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
                  <button onClick={handleVisto} className={`${styles.exerciseButton} ${styles.correctButton}`} disabled={exerciseScore === 1}>
                    <i className="fas fa-check"></i> Correcto
                  </button>
                  <button onClick={handleIncorrecto} className={`${styles.exerciseButton} ${styles.incorrectButton}`} disabled={exerciseScore === 0}>
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
      {isBubbleVisible && (
        <div className={styles.speechBubble}>
          <p className={styles.welcomeText}>{bubbleMessage}</p>
          <button id="soundButton" className={styles.soundButtonSmall}>
            <i className="fas fa-volume-up"></i>
          </button>
        </div>
      )}
      <img src={nicaImage} alt="Character" className={`${styles.mainCharacterImage} ${styles.nicaImage}`} style={getNicaImageStyle()} />
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
