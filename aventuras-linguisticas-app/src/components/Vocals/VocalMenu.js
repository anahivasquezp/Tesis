import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { ChildContext } from '../Access/ChildContext'; // Ajusta la ruta según sea necesario
import styles from '../../css/Vocals/VocalMenu.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function VocalMenu() {
  const [imagenes, setImagenes] = useState({ a: '', e: '', i: '', o: '', u: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const storage = getStorage();
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
    <div className={styles.mainContainer}>
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
        <h1 className={styles.exerciseTitle}>Ejercicios con Vocales</h1>
        {loading ? (
          <p className={styles.loadingText}>Cargando...</p>
        ) : (
          <div className={styles.vocalContainer}>
            {vocales.map(vocal => (
              <button key={vocal} className={styles.vocalButton} onClick={() => navigate(`/vocal/${vocal}/conciencia-fonemica`)}>
                <img src={imagenes[vocal]} alt={`Vocal ${vocal.toUpperCase()}`} className={styles.vocalImage} />
                <span className={styles.vocalText}>{vocal.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
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

export default VocalMenu;
