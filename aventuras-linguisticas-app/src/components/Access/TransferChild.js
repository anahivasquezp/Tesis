import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import Modal from 'react-modal';
import { ChildContext } from './ChildContext';
import styles from '../../css/Access/TransferChild.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root');

const TransferChild = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const { selectedChild } = useContext(ChildContext);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapists = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user is authenticated.');
        return;
      }

      const therapistsQuery = query(collection(db, 'therapists'));
      const querySnapshot = await getDocs(therapistsQuery);

      // Filter out the current therapist
      const filteredTherapists = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(therapist => therapist.id !== user.uid);

      setTherapists(filteredTherapists);
    };

    fetchTherapists();
  }, [db, auth]);

  useEffect(() => {
    const message = "¡Vamos a elegir un nuevo terapeuta!";
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
      const message = "¡Vamos a elegir un nuevo terapeuta!";
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

  const handleTransfer = async () => {
    if (selectedTherapist && selectedChild) {
      const childRef = doc(db, 'children', selectedChild.id);
      await updateDoc(childRef, {
        therapistId: selectedTherapist.id
      });
      navigate('/chooseChild');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmTransfer = () => {
    closeModal();
    handleTransfer();
  };

  const getNicaImageStyle = () => {
    if (nicaImage === nicaPresenting) {
      return { width: '400px', height: 'auto' };
    } else {
      return { width: '330px', height: 'auto' };
    }
  };

  return (
    <div className={styles.transferChildContainer}>
      <div className={styles.topButtonsContainer}>
        <button onClick={() => navigate('/editChild')} className={`${styles.topButton} ${styles.backButton}`}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.transferChildTitle}>Elige al nuevo terapeuta para el niño</h1>
        {selectedChild && (
          <div className={styles.childInfo}>
            <h2 className={styles.childName}>Niño a transferir: {selectedChild.name}</h2>
            <img src={selectedChild.characterImage} alt={selectedChild.name} className={styles.childImage} />
          </div>
        )}
        <div className={styles.therapistsList}>
          {therapists.map((therapist) => (
            <div
              key={therapist.id}
              className={`${styles.therapistContainer} ${therapist.id === selectedTherapist?.id ? styles.selected : ''}`}
              onClick={() => setSelectedTherapist(therapist)}
            >
              <h2 className={styles.therapistName}>{therapist.name}</h2>
              <p className={styles.therapistEmail}>{therapist.email}</p>
            </div>
          ))}
        </div>
        <button onClick={openModal} className={styles.transferButton} disabled={!selectedTherapist}>
          Transferir
        </button>
      </div>
      <div className={styles.characterContainer}>
        {isBubbleVisible && (
          <div className={styles.speechBubble}>
            <p className={styles.welcomeText}>¡Vamos a elegir un nuevo terapeuta!</p>
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
        contentLabel="Confirm Transfer"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2 className={styles.modalTitle}>¿Estás seguro que deseas transferir al niño al terapeuta seleccionado?</h2>
        <div className={styles.modalButtons}>
          <button onClick={confirmTransfer} className={styles.confirmButton}>Sí</button>
          <button onClick={closeModal} className={styles.cancelButton}>No</button>
        </div>
      </Modal>
    </div>
  );
};

export default TransferChild;
