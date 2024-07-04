import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from './ChildContext';
import styles from '../../css/Access/ChooseChild.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function ChooseChild() {
  const [children, setChildren] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const { setSelectedChild } = useContext(ChildContext);
  const [selectedId, setSelectedId] = useState(null);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error('No user is authenticated.');
        return;
      }

      const childrenQuery = query(
        collection(db, 'children'),
        where('therapistId', '==', user.uid)
      );
      const querySnapshot = await getDocs(childrenQuery);
      setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchChildren();
  }, [auth, db]);

  useEffect(() => {
    const message = "Elige un niño para jugar.";
    const utterance = new SpeechSynthesisUtterance(message);
    let timer;

    const showBubble = () => {
      setIsBubbleVisible(true);
      setNicaImage(nicaPresenting);
      timer = setTimeout(() => {
        setIsBubbleVisible(false);
        setNicaImage(nicaNeutral);
      }, 5000);
    };

    showBubble();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const soundButton = document.getElementById('soundButton');
    if (soundButton) {
      const message = "Elige un niño para jugar.";
      const utterance = new SpeechSynthesisUtterance(message);

      const handleSoundClick = () => {
        speechSynthesis.speak(utterance);
      };

      soundButton.addEventListener('click', handleSoundClick);

      return () => {
        soundButton.removeEventListener('click', handleSoundClick);
      };
    }
  }, [isBubbleVisible]);

  const handleShowBubble = () => {
    setIsBubbleVisible(true);
    setNicaImage(nicaPresenting);
    const timer = setTimeout(() => {
      setIsBubbleVisible(false);
      setNicaImage(nicaNeutral);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const getNicaImageStyle = () => {
    if (nicaImage === nicaPresenting) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
  };

  const handleChildClick = (child) => {
    setSelectedChild(child);
    setSelectedId(child.id);
    navigate('/Menu');
  };

  const handleEditChild = (child) => {
    setSelectedChild(child);
    setSelectedId(child.id);
    navigate('/editChild');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out', error);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    closeModal();
    handleLogout();
  };

  return (
    <div className={styles.chooseChildContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.chooseChildTitle}>Elige un niño para jugar</h1>
        <div className={styles.childrenList}>
          {children.map((child) => (
            <div
              key={child.id}
              className={`${styles.childContainer} ${child.id === selectedId ? styles.selected : ''}`}
              onClick={() => handleChildClick(child)}
            >
              <h2 className={styles.childName}>{child.name}</h2>
              <img src={child.characterImage} alt={child.character} className={styles.childImage} />
              <button onClick={(e) => { e.stopPropagation(); handleEditChild(child); }} className={styles.editButton}>
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          ))}
        </div>
        <Link to="/registerChild" className={styles.addButton}>
          <i className="fas fa-plus"></i>
        </Link>
      </div>
      <div className={styles.characterContainer}>
        {isBubbleVisible && (
          <div className={styles.speechBubble}>
            <p className={styles.welcomeText}>Elige un niño para jugar.</p>
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
        <h2 className={styles.modalTitle}>¿Deseas salir?</h2>
        <div className={styles.modalButtons}>
          <button onClick={confirmLogout} className={styles.confirmButton}>Sí</button>
          <button onClick={closeModal} className={styles.cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default ChooseChild;
