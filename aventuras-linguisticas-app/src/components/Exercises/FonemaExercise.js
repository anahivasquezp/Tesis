import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/FonemaExercise.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';
import nicaCorrecto from '../../images/Nica_Correcto.png';
import nicaIncorrecto from '../../images/Nica_Incorrecto.png';
import { db, auth } from '../../firebase';

Modal.setAppElement('#root');

function FonemaExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [imageURL, setImageURL] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [bubbleMessage, setBubbleMessage] = useState(`¡Bienvenido! Estos son los fonemas para ${fonema.toUpperCase()}.`);

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
      const currentScore = selectedChild.scores?.[`fonema_${fonema}`];
      setExerciseScore(currentScore !== undefined ? currentScore : -1);
    }
  }, [selectedChild, fonema]);

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

  useEffect(() => {
    const message = `¡Bienvenido! Estos son los fonemas para ${fonema.toUpperCase()}.`;
    const utterance = new SpeechSynthesisUtterance(message);
    let timer;

    const showBubble = () => {
      setIsBubbleVisible(true);
      setNicaImage(nicaPresenting);
      timer = setTimeout(() => {
        setIsBubbleVisible(false);
        setNicaImage(nicaNeutral);
      }, 10000);
    };

    showBubble();

    return () => {
      clearTimeout(timer);
    };
  }, [fonema]);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const message = `¡Bienvenido! Estos son los fonemas para ${fonema.toUpperCase()}.`;
      const utterance = new SpeechSynthesisUtterance(message);

      const handleSoundClick = () => {
        speechSynthesis.speak(utterance);
      };

      soundButton.addEventListener('click', handleSoundClick);

      return () => {
        soundButton.removeEventListener('click', handleSoundClick);
      };
    }
  }, [fonema, isBubbleVisible]);

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setBubbleMessage(`¡Bienvenido! Estos son los fonemas para ${fonema.toUpperCase()}.`);
    setNicaImage(nicaPresenting);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 10000);

    return () => clearTimeout(timer);
  };

  const playAudio = () => {
    const audio = new Audio(audioURL);
    audio.play();
  };

  const handleVisto = async () => {
    const newScore = 1;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [`fonema_${fonema}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.fonema_${fonema}`]: newScore
    });

    setSelectedChild(updatedChild);
    setExerciseScore(newScore); 
    setNicaImage(nicaCorrecto);
    setBubbleMessage('¡Correcto! ¡Muy bien hecho!');
    setIsBubbleVisible(true);
    setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 5000);
  };

  const handleIncorrecto = async () => {
    const newScore = 0;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [`fonema_${fonema}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.fonema_${fonema}`]: newScore
    });

    setSelectedChild(updatedChild);
    setExerciseScore(newScore); 
    setNicaImage(nicaIncorrecto);
    setBubbleMessage('Incorrecto. ¡Inténtalo de nuevo!');
    setIsBubbleVisible(true);
    setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 5000);
  };

  const handleNextPage = () => {
    navigate(`/PhonemicExerciseFull/${fonema}`);
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
        <h1 className={styles.exerciseTitle}>Fonema: <span className={styles.fileName}>{fonema.toUpperCase()}</span></h1>
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
                <button onClick={playAudio} className={`${styles.exerciseButton} ${styles.soundButton}`}>
                  <i className="fas fa-volume-up"></i> Escuchar Sonido
                </button>
              ) : (
                <p>No se pudo cargar el audio.</p>
              )}
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
              <button onClick={handleNextPage} className={`${styles.exerciseButton} ${styles.nextButton}`}>
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

export default FonemaExercise;
