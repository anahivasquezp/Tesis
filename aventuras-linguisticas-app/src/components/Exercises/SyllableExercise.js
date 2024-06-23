import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { getFirestore, doc, collection, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/SyllableExercise.module.css';
import characterImage from '../../images/pig_granjera.png';

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

  const currentSyllableType = syllableTypes[syllableIndex];

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
            const imageRef = ref(storage, `images/silabas/${fonema.toUpperCase()}/${currentSyllableType}_${fonema.toUpperCase()}_${i}.webp`);
            const imageUrl = await getDownloadURL(imageRef);
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
    if (selectedChild) {
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
    }
  };

  const handleIncorrecto = async () => {
    if (selectedChild) {
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
    }
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

  const renderWordAudioButton = (word) => {
    const speakWord = () => {
      const utterance = new SpeechSynthesisUtterance(word);
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

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
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
        <h1 className={styles.title}>Sílabas de la {fonema.toUpperCase()}</h1>
        <h2 className={styles.subtitle}>{currentSyllableType.replace('silaba_', 'Sílabas ').toUpperCase()}</h2>
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
              {word ? (
                <>
                  {renderWordAudioButton(word)}
                  <audio src={value.audios ? value.audios[word] : null} controls className={styles.audioControl} />
                </>
              ) : (
                <p>No se pudo cargar la palabra.</p>
              )}
            </div>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handlePreviousPage} className={`${styles.actionButton} ${styles.backButton}`}>
            <i className="fas fa-arrow-left"></i> Atrás
          </button>
          {isAuthenticated && (
            <>
              <button onClick={handleVisto} className={`${styles.actionButton} ${styles.correctButton}`}>
                <i className="fas fa-check"></i> Correcto
              </button>
              <button onClick={handleIncorrecto} className={`${styles.actionButton} ${styles.incorrectButton}`}>
                <i className="fas fa-times"></i> Incorrecto
              </button>
            </>
          )}
          <button onClick={handleNextPage} className={`${styles.actionButton} ${styles.nextButton}`}>
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
}

export default SyllableExercise;
