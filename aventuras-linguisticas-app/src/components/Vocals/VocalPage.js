import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Vocals/VocalPage.module.css';
import neutralCharacterImage from '../../images/Nica_Neutral.png';
import presentingCharacterImage from '../../images/Nica_presenta.png';
import correctCharacterImage from '../../images/Nica_Correcto.png';
import incorrectCharacterImage from '../../images/Nica_Incorrecto.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

const VocalPage = () => {
  const { vocal } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [bubbleMessage, setBubbleMessage] = useState(`¡Vamos con la vocal ${vocal.toUpperCase()}!`);
  const [characterImage, setCharacterImage] = useState(presentingCharacterImage);
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
      } catch (error) {
        console.log('Video no encontrado.');
        setVideoUrl(''); // Clear video URL if not found
      } finally {
        setLoading(false);
      }
    };

    fetchGuestCharacter();
    fetchVideo();
  }, [storage, vocal]);

  useEffect(() => {
    const message = `¡Vamos con la vocal ${vocal.toUpperCase()}!`;
    const utterance = new SpeechSynthesisUtterance(message);
    let timer;

    const showBubble = () => {
      setIsBubbleVisible(true);
      setBubbleMessage(message);
      setCharacterImage(presentingCharacterImage);
      timer = setTimeout(() => {
        setIsBubbleVisible(false);
        setCharacterImage(neutralCharacterImage);
      }, 10000);
    };

    showBubble();

    return () => {
      clearTimeout(timer);
    };
  }, [vocal]);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const handleSoundClick = () => {
        const message = bubbleMessage;
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      };

      soundButton.addEventListener('click', handleSoundClick);

      return () => {
        soundButton.removeEventListener('click', handleSoundClick);
      };
    }
  }, [bubbleMessage, isBubbleVisible]);

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setBubbleMessage(`¡Vamos con la vocal ${vocal.toUpperCase()}!`);
    setCharacterImage(presentingCharacterImage);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setCharacterImage(neutralCharacterImage);
    }, 10000);

    return () => clearTimeout(timer);
  };

  const handleResult = async (isCorrect) => {
    setIsBubbleVisible(true);
    if (isCorrect) {
      setCharacterImage(correctCharacterImage);
      setBubbleMessage('¡Correcto! ¡Sigue así!');
    } else {
      setCharacterImage(incorrectCharacterImage);
      setBubbleMessage('¡Oh no! ¡Inténtalo otra vez!');
    }

    const timer = setTimeout(() => {
      setCharacterImage(neutralCharacterImage);
      setIsBubbleVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
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

  const getNicaImageStyle = () => {
    if (characterImage === correctCharacterImage) {
      return { width: '500px', height: 'auto' };
    } else if (characterImage === incorrectCharacterImage) {
      return { width: '330px', height: 'auto' };
    } else if (characterImage === presentingCharacterImage) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
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
        <h1 className={styles.vocalTitle}>Conciencia Fonémica: <span className={styles.fileName}>{vocal.toUpperCase()}</span></h1>
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
      {isBubbleVisible && (
        <div className={styles.speechBubble}>
          <p className={styles.welcomeText}>{bubbleMessage}</p>
          <button id="soundButton" className={styles.soundButtonSmall}>
            <i className="fas fa-volume-up"></i>
          </button>
        </div>
      )}
      <img src={characterImage} alt="Character" className={`${styles.mainCharacterImage} ${styles.nicaImage}`} style={getNicaImageStyle()} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Logout"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2 className={styles.modalTitle}>¿Quieres salir?</h2>
        <div className={styles.modalButtons}>
          <button onClick={confirmLogout} className={styles.confirmButton}>Sí</button>
          <button onClick={closeModal} className={styles.cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
};

export default VocalPage;
