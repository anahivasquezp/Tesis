import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext';
import styles from '../../css/Exercises/CongratulationsExercises.module.css';
import starImage from '../../images/star.png';
import nicaCorrecto from '../../images/Nica_Correcto.png';

Modal.setAppElement('#root');

const CongratulationsExercises = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { selectedChild } = useContext(ChildContext);
  const [score, setScore] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCharacter, setGuestCharacter] = useState(null);
  const { fonema } = useParams();

  useEffect(() => {
    const fetchScores = async () => {
      if (auth.currentUser && selectedChild) {
        const childDoc = await getDoc(doc(db, 'children', selectedChild.id));
        if (childDoc.exists()) {
          const data = childDoc.data();
          const exerciseKeys = [
            `fonema_${fonema}`,
            ...["A", "E", "I", "O", "U"].map(syl => `conciencia_fonemica_${fonema}_${syl}`),
            ...["silaba_inicial", "silaba_media", "silaba_final", "silaba_inversa"].map(type => `syllable_${fonema}_${type}`),
            `phrase_${fonema}`
          ];

          const totalScore = exerciseKeys.reduce((acc, key) => acc + (data.scores?.[key] || 0), 0);
          const resolvedExercises = exerciseKeys.filter(key => data.scores?.[key] !== undefined).length;

          setScore(totalScore);
          setTotalExercises(resolvedExercises);
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
  }, [auth.currentUser, selectedChild, db, fonema]);

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

  const renderStars = (score, totalExercises) => {
    const stars = [];
    for (let i = 0; i < totalExercises; i++) {
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
        <button onClick={() => navigate(`/age-fonemas/${ageGroup}`)} className={`${styles.topButton} ${styles.menuButton}`}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className={styles.contentContainer}>
        {isAuthenticated ? (
          <>
            <h1 className={styles.congratulationsTitle}>¡Felicidades {selectedChild.name}!</h1>
            <p className={styles.congratulationsText}>
              Has completado los ejercicios del fonema {fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()} con un puntaje de <span className={styles.score}>{score}/{totalExercises}</span>.
            </p>
            <img
              src={selectedChild.characterImage}
              alt={selectedChild.character}
              className={styles.largeImage}
            />
            <div className={styles.starsContainer}>{renderStars(score, totalExercises)}</div>
          </>
        ) : (
          <>
            <h1 className={styles.congratulationsTitle}>¡Felicidades!</h1>
            <p className={styles.congratulationsText}>
              ¡Felicidades por completar los ejercicios del fonema {fonema.toUpperCase() === 'ENIE' ? 'Ñ' : fonema.toUpperCase()}!
            </p>
            {guestCharacter && (
              <img src={guestCharacter.url} alt="Invitado" className={styles.largeImage} />
            )}
            <div className={styles.starsContainer}>{renderStars(5, 5)}</div>
          </>
        )}
        <button className={styles.continueButton} onClick={() => navigate(`/age-fonemas/${ageGroup}`)}>
          Regresar al Menú de {ageGroup} años
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

export default CongratulationsExercises;
