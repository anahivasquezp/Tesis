import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Exercises/CongratulationsPhonetic.module.css';
import starImage from '../../images/star.png';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

const CongratulationsPhonetic = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { selectedChild } = useContext(ChildContext);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (auth.currentUser && selectedChild) {
        const childDoc = await getDoc(doc(db, 'children', selectedChild.id));
        if (childDoc.exists()) {
          const data = childDoc.data();
          setScore(data.phoneticAwarenessScore || 0);
        }
      }
    };

    const fetchGuestCharacter = () => {
      const storedCharacter = sessionStorage.getItem('guestCharacter');
      if (storedCharacter) {
        setGuestCharacter(JSON.parse(storedCharacter));
      }
    };

    fetchScores();
    fetchGuestCharacter();
  }, [auth.currentUser, selectedChild, db]);

  const handleContinue = () => {
    navigate('/Menu');
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

  const renderStars = (score) => {
    return (
      <img
        src={starImage}
        alt="star"
        className={score === 1 || !isAuthenticated ? styles.filledStar : styles.emptyStar}
      />
    );
  };

  return (
    <div className={styles.congratulationsContainer}>
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

      <div className={styles.contentContainer}>
        {isAuthenticated ? (
          <>
            <h1 className={styles.congratulationsTitle}>¡Felicidades {selectedChild.name}!</h1>
            <p className={styles.congratulationsText}>
              Has completado los ejercicios de conciencia fonética con un puntaje de {score}/1.
            </p>
            <img
              src={selectedChild.characterImage}
              alt={selectedChild.character}
              className={styles.largeImage}
            />
            <div className={styles.starsContainer}>{renderStars(score)}</div>
          </>
        ) : (
          <>
            <h1 className={styles.congratulationsTitle}>¡Felicidades!</h1>
            <p className={styles.congratulationsText}>
              ¡Felicidades por completar los ejercicios de conciencia fonética!
            </p>
            {guestCharacter && (
              <img src={guestCharacter.url} alt="Invitado" className={styles.largeImage} />
            )}
            <div className={styles.starsContainer}>{renderStars(1)}</div>
          </>
        )}
        <button className={styles.continueButton} onClick={handleContinue}>
          Continuar
        </button>
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
          <button onClick={confirmLogout} className={styles.confirmButton}>
            Sí
          </button>
          <button onClick={closeModal} className={styles.cancelButton}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CongratulationsPhonetic;
