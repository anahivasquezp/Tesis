import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Exercises/AgeFonemas.module.css';
import starImage from '../../images/star.png';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function AgeFonemas() {
  const { age } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { selectedChild } = useContext(ChildContext);
  const [guestCharacter, setGuestCharacter] = useState(null);
  const [scores, setScores] = useState({});

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
    const fetchScores = async () => {
      if (selectedChild) {
        const db = getFirestore();
        const childDoc = await getDoc(doc(db, 'children', selectedChild.id));
        if (childDoc.exists()) {
          setScores(childDoc.data().scores || {});
        }
      }
    };

    fetchScores();
  }, [selectedChild]);

  const loadFonemasByAge = (age) => {
    const fonemas = {
      '3': ['m', 'ch', 'k', 'n', 'enie', 'p', 't', 'f', 'y', 'l', 'j'],
      '4': ['b', 'd', 'g', 'bl', 'pl'],
      '5': ['r', 'fl', 'kl', 'br', 'kr', 'gr'],
      '6': ['rr', 's', 'gl', 'fr', 'pr', 'tr', 'dr']
    };
    return fonemas[age] || [];
  };

  const calculateStars = (fonema) => {
    const keys = [
      `fonema_${fonema}`,
      ...["A", "E", "I", "O", "U"].map(syl => `conciencia_fonemica_${fonema}_${syl}`),
      ...["silaba_inicial", "silaba_media", "silaba_final", "silaba_inversa"].map(type => `syllable_${fonema}_${type}`),
      `phrase_${fonema}`
    ];
    const totalExercises = keys.length;
    const score = keys.reduce((acc, key) => acc + (scores[key] || 0), 0);
    const resolvedExercises = keys.filter(key => scores[key] !== undefined).length;

    return { totalExercises: resolvedExercises, score };
  };

  const renderStars = (score, totalExercises) => {
    const stars = [];
    const maxStarsPerRow = 5;

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

    const rows = [];
    for (let i = 0; i < stars.length; i += maxStarsPerRow) {
      rows.push(
        <div key={i} className={styles.starsRow}>
          {stars.slice(i, i + maxStarsPerRow)}
        </div>
      );
    }

    return rows;
  };

  const fonemas = loadFonemasByAge(age);

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
        <button className={`${styles.topButton} ${styles.infoButton}`}>
          <i className="fas fa-info"></i>
        </button>
        <Link to="/phonological-exercises" className={`${styles.topButton} ${styles.menuButton}`}>
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
        <h1 className={styles.title}>Fonemas para {age} años</h1>
        <div className={styles.fonemasContainer}>
          {fonemas.map(fonema => {
            const { totalExercises, score } = calculateStars(fonema);
            return (
              <div key={fonema} className={styles.fonemaItem}>
                <button className={styles.fonemaButton}>
                  <Link to={`/exercise/${fonema}`} className={styles.fonemaLink}>{fonema.toUpperCase()}</Link>
                  {totalExercises > 0 && (
                    <div className={styles.starsContainer}>
                      {renderStars(score, totalExercises)}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
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

export default AgeFonemas;
