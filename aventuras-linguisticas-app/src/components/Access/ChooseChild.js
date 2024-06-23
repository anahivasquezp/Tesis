import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../css/Access/ChooseChild.module.css';
import { ChildContext } from './ChildContext';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function ChooseChild() {
  const [children, setChildren] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedChild } = useContext(ChildContext);
  const [selectedId, setSelectedId] = useState(null);
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
        <button className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
        </button>
      </div>
      <div className={styles.contentContainer}>
        <h1 className={styles.chooseChildTitle}>Elige un niño</h1>
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

export default ChooseChild;
