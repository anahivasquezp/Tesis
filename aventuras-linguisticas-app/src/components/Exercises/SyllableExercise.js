import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/SyllableExercise.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';
import nicaCorrecto from '../../images/Nica_Correcto.png';
import nicaIncorrecto from '../../images/Nica_Incorrecto.png';

Modal.setAppElement('#root');

const db = getFirestore();

const syllableTypes = ['silaba_inicial', 'silaba_media', 'silaba_final', 'silaba_inversa'];

function SyllableExercise() {
  const { fonema } = useParams();
  const navigate = useNavigate();
  const { selectedChild, setSelectedChild } = useContext(ChildContext);
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const [value, loading, error] = useDocumentData(
    doc(collection(db, 'exercises'), fonema)
  );

  const [syllableIndex, setSyllableIndex] = useState(0);
  const [images, setImages] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const currentSyllableType = syllableTypes[syllableIndex];

  const [bubbleMessage, setBubbleMessage] = useState(`¡Escucha y repite! Sílabas de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()} - ${syllableTypes[syllableIndex].replace('silaba_', 'Sílabas ').toUpperCase()}!`);
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
      const currentScore = selectedChild.scores?.[`syllable_${fonema}_${currentSyllableType}`];
      setExerciseScore(currentScore !== undefined ? currentScore : -1);
    }
  }, [selectedChild, fonema, currentSyllableType]);

  useEffect(() => {
    const loadImages = async () => {
      if (value && value[currentSyllableType]) {
        if (value[currentSyllableType][0] === "no es común en español para niños") {
          handleNextPage();
          return;
        }
        const newImages = {};
        const storage = getStorage();
        for (let i = 0; i < value[currentSyllableType].length; i++) {
          const word = value[currentSyllableType][i];
          try {
            let imageUrl = '';
            try {
              const imageRefWebp = ref(storage, `images/silabas/${fonema.toUpperCase()}/${currentSyllableType}_${fonema.toUpperCase()}_${i}.webp`);
              imageUrl = await getDownloadURL(imageRefWebp);
            } catch {
              const imageRefPng = ref(storage, `images/silabas/${fonema.toUpperCase()}/${currentSyllableType}_${fonema.toUpperCase()}_${i}.png`);
              imageUrl = await getDownloadURL(imageRefPng);
            }
            newImages[word] = imageUrl;
          } catch (error) {
            console.error(`Error loading image for ${word}:`, error);
            newImages[word] = null;
          }
        }
        setImages(newImages);
        setImageLoading(false);
      }
    };
    setImageLoading(true);
    loadImages();
  }, [value, currentSyllableType, fonema]);

  useEffect(() => {
    const message = `¡Escucha y repite! Sílabas de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()} - ${currentSyllableType.replace('silaba_', 'Sílabas ').toUpperCase()}!`;
    showBubble(message, nicaPresenting, 10000);
  }, [fonema, currentSyllableType]);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const handleSoundClick = () => {
        const utterance = new SpeechSynthesisUtterance(bubbleMessage);
        utterance.rate = 0.8;  // Ajusta la velocidad del habla
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
    showBubble(`¡Escucha y repite! Sílabas de la ${fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()} - ${currentSyllableType.replace('silaba_', 'Sílabas ').toUpperCase()}!`, nicaPresenting, 10000);
  };

  const handleNextPage = () => {
    if (syllableIndex < syllableTypes.length - 1) {
      setSyllableIndex(syllableIndex + 1);
      setImageLoading(true);
      setImages({});
    } else {
      navigate(`/PhraseExercise/${fonema}`);
    }
  };

  const handlePreviousPage = () => {
    if (syllableIndex > 0) {
      setSyllableIndex(syllableIndex - 1);
      setImageLoading(true);
      setImages({});
    } else {
      navigate(`/PhonemicExerciseFull/${fonema}`);
    }
  };

  const handleVisto = async () => {
    const newScore = 1;
    const updatedChild = {
      ...selectedChild,
      scores: {
        ...selectedChild.scores,
        [`syllable_${fonema}_${currentSyllableType}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.syllable_${fonema}_${currentSyllableType}`]: newScore
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
        [`syllable_${fonema}_${currentSyllableType}`]: newScore
      }
    };

    const childRef = doc(db, 'children', selectedChild.id);
    await updateDoc(childRef, {
      [`scores.syllable_${fonema}_${currentSyllableType}`]: newScore
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

  const renderWordAudioButton = (word) => {
    const speakWord = () => {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;  // Ajusta la velocidad del habla
      speechSynthesis.speak(utterance);
    };

    return (
      <button onClick={speakWord} className={styles.audioButton}>
        <i className="fas fa-volume-up"></i>
      </button>
    );
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

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
        <button className={`${styles.topButton} ${styles.menuButton}`} onClick={() => navigate(`/age-fonemas/${getAgeGroup(fonema)}`)}>
          <i className="fas fa-bars"></i>
        </button>
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
        <button className={styles.closeButton} onClick={() => navigate('/phonological-exercises')}>
          <i className="fas fa-times"></i>
        </button>

        <h1 className={styles.exerciseTitle}>Ejercicios Fonológicos: <span className={styles.ageText}>{getAgeGroup(fonema)} años</span></h1>       
        <h1 className={styles.exerciseTitle}>{currentSyllableType.replace('silaba_', 'Sílabas ').toUpperCase()} DE LA <span className={styles.fileName}>{fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}</span></h1>
        <h2 className={styles.Subtitle1}>Reproduce cada una de las palabras y repite</h2>
        
        <div className={styles.wordsContainer}>
          {value && value[currentSyllableType] && value[currentSyllableType].map((word, index) => (
            <div key={index} className={styles.wordItem}>
              <p className={styles.wordText}>{word}</p>
              {imageLoading ? (
                <p className={styles.loadingText}>Cargando imagen...</p>
              ) : images[word] ? (
                <img src={images[word]} alt={word} className={styles.syllableImage} />
              ) : (
                <p>No se pudo cargar la imagen.</p>
              )}
              {word && renderWordAudioButton(word)}
            </div>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handlePreviousPage} className={`${styles.actionButton} ${styles.backButton}`}>
            <i className="fas fa-arrow-left"></i> Anterior
          </button>
          {isAuthenticated && (
            <>
              <button onClick={handleVisto} className={`${styles.actionButton} ${styles.correctButton}`} disabled={exerciseScore === 1}>
                <i className="fas fa-check"></i> Correcto
              </button>
              <button onClick={handleIncorrecto} className={`${styles.actionButton} ${styles.incorrectButton}`} disabled={exerciseScore === 0}>
                <i className="fas fa-times"></i> Incorrecto
              </button>
            </>
          )}
          <button onClick={handleNextPage} className={`${styles.actionButton} ${styles.nextButton}`}>
            <i className="fas fa-arrow-right"></i>Siguiente
          </button>
        </div>
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

export default SyllableExercise;
