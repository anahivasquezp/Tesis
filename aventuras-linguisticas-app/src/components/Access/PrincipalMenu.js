import React, { useContext, useEffect, useState } from 'react';
import { ChildContext } from './ChildContext';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../css/Access/PrincipalMenu.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root'); // Set the app element for accessibility

function PrincipalMenu() {
    const { selectedChild } = useContext(ChildContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const [guestCharacter, setGuestCharacter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [therapistName, setTherapistName] = useState('');
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);
    const [nicaImage, setNicaImage] = useState(nicaPresenting);

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

    useEffect(() => {
        const message = "¡Hola! Bienvenido al menú principal. Te recomiendo que empieces por Conciencia Fonética. ¡Diviértete!";
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
            const message = "¡Hola! Bienvenido al menú principal. Te recomiendo que empieces por Conciencia Fonética. ¡Diviértete!";
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
                <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
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
            <div className={styles.characterContainer}>
                {isBubbleVisible && (
                    <div className={styles.speechBubble}>
                        <p className={styles.welcomeText}>¡Hola! Bienvenido al menú principal. Te recomiendo que empieces por Conciencia Fonética. ¡Diviértete!</p>
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
                shouldCloseOnOverlayClick={true}
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

export default PrincipalMenu;
