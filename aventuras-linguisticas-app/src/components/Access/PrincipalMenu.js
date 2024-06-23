import React, { useContext, useEffect, useState } from 'react';
import { ChildContext } from './ChildContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../css/Access/PrincipalMenu.module.css';
import characterImage from '../../images/pig_granjera.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function PrincipalMenu() {
    const { selectedChild } = useContext(ChildContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const [guestCharacter, setGuestCharacter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [therapistName, setTherapistName] = useState('');

    useEffect(() => {
        const storedCharacter = sessionStorage.getItem('guestCharacter');
        if (storedCharacter) {
            setGuestCharacter(JSON.parse(storedCharacter));
        }

        const fetchTherapistName = async () => {
            if (auth.currentUser) {
                const db = getFirestore();
                const docRef = doc(db, 'therapists', auth.currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTherapistName(docSnap.data().therapistName);
                }
            }
        };

        fetchTherapistName();
    }, [auth.currentUser]);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            sessionStorage.removeItem('guestCharacter');
            navigate('/');
        }).catch((error) => {
            console.error('Error signing out', error);
        });
    };

    const handleLogoutGuest = () => {
        sessionStorage.removeItem('guestCharacter');
        navigate('/');
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
            handleSignOut();
        } else {
            handleLogoutGuest();
        }
    };

    const handleNavigatePhonemicAwareness = () => {
        navigate('/phonetic-exercises');
    };

    const handleNavigatePhonologicalExercises = () => {
        navigate('/phonological-exercises');
    };

    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const diff_ms = Date.now() - birth.getTime();
        const age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    return (
        <div className={styles.menuContainer}>
            <div className={styles.topButtonsContainer}>
                <button onClick={openModal} className={`${styles.topButton} ${styles.homeButton}`}>
                    <i className="fas fa-home"></i>
                </button>
                <button className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
                </button>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.userInfo}>
                    {auth.currentUser ? (
                        <>
                            <h2 className={styles.infoText}>Terapista: {therapistName}</h2>
                            {selectedChild && (
                                <>
                                    <h2 className={styles.infoText}>Niño: {selectedChild.name}</h2>
                                    <img src={selectedChild.characterImage} alt={selectedChild.character} className={styles.characterImage} />
                                    <h3 className={styles.infoText}>Edad: {calculateAge(selectedChild.birthDate)} años</h3>
                                </>
                            )}
                        </>
                    ) : (
                        guestCharacter && (
                            <>
                                <h2 className={styles.infoText}>Invitado</h2>
                                <img src={guestCharacter.url} alt="Selected Character" className={styles.characterImage} />
                            </>
                        )
                    )}
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.menuButton} onClick={handleNavigatePhonemicAwareness}>Conciencia Fonética</button>
                    <button className={styles.menuButton} onClick={handleNavigatePhonologicalExercises}>Ejercicios fonológicos</button>
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

export default PrincipalMenu;
