import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Exercises/PhonologicalExercises.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function PhonologicalExercises() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = getAuth();
  const { selectedChild } = useContext(ChildContext);
  const [guestCharacter, setGuestCharacter] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const [bubbleMessage, setBubbleMessage] = useState('¡Hola! Elige un ejercicio para empezar a jugar.');

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
    const message = "¡Hola! Elige un ejercicio para empezar a jugar.";
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
  }, []);

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

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setBubbleMessage('¡Hola! Elige un ejercicio para empezar a jugar.');
    setNicaImage(nicaPresenting);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 10000);

    return () => clearTimeout(timer);
  };

  const getNicaImageStyle = () => {
    if (nicaImage === nicaPresenting) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
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

  return (
    <div className={styles.phonologicalExercisesContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
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
        <h1 className={styles.exerciseTitle}>Ejercicios Fonológicos</h1>
        <div className={styles.buttonGroup}>
          <button className={`${styles.exerciseButton} ${styles.exerciseButtonTop}`} onClick={() => handleNavigate('/vocalMenu')}>
            <i className={`${styles.icon} fas fa-font`}></i> Vocales
          </button>
          <div className={styles.exerciseButtonColumn}>
            <button className={styles.exerciseButton} onClick={() => handleNavigate('/age-fonemas/3')}>
              <i className={`${styles.icon} fas fa-child`}></i> 3 años
            </button>
            <button className={styles.exerciseButton} onClick={() => handleNavigate('/age-fonemas/4')}>
              <i className={`${styles.icon} fas fa-child`}></i> 4 años
            </button>
          </div>
          <div className={styles.exerciseButtonColumn}>
            <button className={styles.exerciseButton} onClick={() => handleNavigate('/age-fonemas/5')}>
              <i className={`${styles.icon} fas fa-child`}></i> 5 años
            </button>
            <button className={styles.exerciseButton} onClick={() => handleNavigate('/age-fonemas/6')}>
              <i className={`${styles.icon} fas fa-child`}></i> 6 años
            </button>
          </div>
        </div>
      </div>
      <div className={styles.characterContainer}>
        {isBubbleVisible && (
          <div className={styles.speechBubble}>
            <p className={styles.welcomeText}>{bubbleMessage}</p>
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
      >
        <h2 className={styles.modalTitle}>¿Quieres salir?</h2>
        <div className={styles.modalButtons}>
          <button onClick={confirmLogout} className={styles.confirmButton}>Sí</button>
          <button onClick={closeModal} className={styles.cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default PhonologicalExercises;
