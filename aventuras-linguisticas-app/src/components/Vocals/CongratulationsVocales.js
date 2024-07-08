import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Vocals/CongratulationsVocales.module.css';
import starImage from '../../images/star.png';
import nicaCorrecto from '../../images/Nica_Correcto.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

const CongratulationsVocales = () => {
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
          const totalScore = ['a', 'e', 'i', 'o', 'u'].reduce(
            (acc, vocal) => acc + (data[`phoneticAwarenessScore_${vocal}`] || 0),
            0
          );
          setScore(totalScore);
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
    navigate('/phonological-exercises');
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
      signOut(auth)
        .then(() => {
          navigate('/');
        })
        .catch((error) => {
          console.error('Error signing out', error);
        });
    } else {
      navigate('/');
    }
  };

  const isAuthenticated = auth.currentUser && selectedChild;

  const renderStars = (score) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <img
          key={i}
          src={starImage}
          alt="star"
          className={i < score ? styles.filledStar : styles.emptyStar}
        />
      );
    }
    return stars;
  };

  return (
    <div className={styles.congratulationsContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
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
              Has completado los ejercicios de vocales con un puntaje de <span className={styles.score}>{score}/5</span>.
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
              ¡Felicidades por completar los ejercicios de vocales!
            </p>
            {guestCharacter && (
              <img src={guestCharacter.url} alt="Invitado" className={styles.largeImage} />
            )}
            <div className={styles.starsContainer}>{renderStars(5)}</div>
          </>
        )}
        <button className={styles.continueButton} onClick={handleContinue}>
          Continuar
        </button>
      </div>
      <img src={nicaCorrecto} alt="Character" className={styles.mainCharacterImage} />
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

export default CongratulationsVocales;
