import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Vocals/VocalMenu.module.css';
import neutralCharacterImage from '../../images/Nica_Neutral.png';
import presentingCharacterImage from '../../images/Nica_presenta.png';
import starImage from '../../images/star.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function VocalMenu() {
  const [imagenes, setImagenes] = useState({ a: '', e: '', i: '', o: '', u: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [scores, setScores] = useState({});
  const [characterImage, setCharacterImage] = useState(presentingCharacterImage);
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const { selectedChild } = useContext(ChildContext);
  const [guestCharacter, setGuestCharacter] = useState(null);

  const vocales = ['a', 'e', 'i', 'o', 'u'];

  useEffect(() => {
    const fetchGuestCharacter = () => {
      const storedCharacter = sessionStorage.getItem('guestCharacter');
      if (storedCharacter) {
        setGuestCharacter(JSON.parse(storedCharacter));
      }
    };

    fetchGuestCharacter();

    const fetchImagenes = async () => {
      try {
        const newImages = {};
        for (const vocal of vocales) {
          const randomIndex = Math.floor(Math.random() * 2) + 1;
          const imageRef = ref(storage, `images/vocales/${vocal}_${randomIndex}.webp`);
          const imageUrl = await getDownloadURL(imageRef);
          newImages[vocal] = imageUrl;
        }
        setImagenes(newImages);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImagenes();
  }, [storage]);

  useEffect(() => {
    const fetchScores = async () => {
      if (selectedChild) {
        const childDoc = await getDoc(doc(db, 'children', selectedChild.id));
        if (childDoc.exists()) {
          const childData = childDoc.data();
          console.log('Fetched child data:', childData);
          setScores(childData);
        }
      }
    };

    fetchScores();
  }, [selectedChild, db]);

  useEffect(() => {
    const message = "¡Hola! ¡Elige una vocal para empezar a jugar!";
    const utterance = new SpeechSynthesisUtterance(message);
    const soundButton = document.getElementById('soundButton');

    if (soundButton) {
      soundButton.addEventListener('click', () => {
        speechSynthesis.speak(utterance);
      });

      const timer = setTimeout(() => {
        setIsBubbleVisible(false);
        setCharacterImage(neutralCharacterImage);
      }, 10000);

      return () => {
        soundButton.removeEventListener('click', () => {
          speechSynthesis.cancel();
        });
        clearTimeout(timer);
      };
    }
  }, []);

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setCharacterImage(presentingCharacterImage);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setCharacterImage(neutralCharacterImage);
    }, 10000);

    return () => clearTimeout(timer);
  };

  const getNicaImageStyle = () => {
    if (characterImage === presentingCharacterImage) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
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

  const getPhoneticAwarenessScore = (vocal) => {
    if (isAuthenticated) {
      const score = scores[`phoneticAwarenessScore_${vocal}`] || 0;
      console.log(`Score for ${vocal}:`, score);
      return score;
    }
    return 0;
  };

  const renderStar = (vocal) => {
    const score = getPhoneticAwarenessScore(vocal);
    const starClass = score === 1 ? styles.filledStar : styles.emptyStar;
    return (
      <img
        src={starImage}
        alt="star"
        className={`${styles.starImage} ${starClass}`}
      />
    );
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
        <Link to="/phonological-exercises" className={`${styles.topButton} ${styles.menuButton}`} style={{ textDecoration: 'none' }}>
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
      <h1 className={styles.exerciseTitle}>Ejercicios Fonológicos: <span className={styles.exerciseTitle2} >Vocales</span></h1>
        <h2 className={styles.Subtitle}>Seleccione una vocal y complete el ejercicio respectivo:</h2>
        {loading ? (
          <p className={styles.loadingText}>Cargando...</p>
        ) : (
          <div className={styles.vocalContainer}>
            {vocales.map(vocal => (
              <button key={vocal} className={styles.vocalButton} onClick={() => navigate(`/vocal/${vocal}/conciencia-fonemica`)}>
                <img src={imagenes[vocal]} alt={`Vocal ${vocal.toUpperCase()}`} className={styles.vocalImage} />
                <span className={styles.vocalText}>{vocal.toUpperCase()}</span>
                {isAuthenticated && renderStar(vocal)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.characterContainer}>
        {isBubbleVisible && (
          <div className={styles.speechBubble}>
            <p className={styles.welcomeText}>¡Hola! ¡Elige una vocal para empezar a jugar!</p>
            <button id="soundButton" className={styles.soundButton}>
              <i className="fas fa-volume-up"></i>
            </button>
          </div>
        )}
        <img src={characterImage} alt="Character" className={styles.mainCharacterImage} style={getNicaImageStyle()} />
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

export default VocalMenu;
