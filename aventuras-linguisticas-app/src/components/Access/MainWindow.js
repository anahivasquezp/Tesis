import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/Access/MainWindow.module.css';
import farmBackground from '../../images/therapist_login_bg.webp';
import characterImage from '../../images/Nica_presenta.png';
import titleImage from '../../images/title.png';
import logoEpn from '../../images/logo_epn.png';
import logoLudolab from '../../images/logo_ludolab.png';

function App() {
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);

    useEffect(() => {
        const message = "¡Hola! Soy Nica. ¿Eres terapista o invitado? Elige uno.";
        const utterance = new SpeechSynthesisUtterance(message);
        const soundButton = document.getElementById('soundButton');

        soundButton.addEventListener('click', () => {
            speechSynthesis.speak(utterance);
        });

        const timer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 10000);

        return () => {
            soundButton.removeEventListener('click', () => {
                speechSynthesis.cancel();
            });
            clearTimeout(timer);
        };
    }, []);

    const handleShowBubble = () => {
        setIsBubbleVisible(true);
        const timer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 10000);
        return () => clearTimeout(timer);
    };

    return (
        <div className={styles.mainContainer} style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className={styles.topButtonsContainer}>
                <Link to="/instructions">
                    <button className={`${styles.topButton} ${styles.aboutButton}`}>
                        Acerca De
                    </button>
                </Link>
                <button onClick={handleShowBubble} className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
                </button>
            </div>
            <div className={styles.contentContainer}>
                <img src={titleImage} alt="Title" className={styles.titleImage} />
                <h2 className={styles.Subtitle}>Seleccione si es terapista o invitado:</h2>
                <div className={styles.buttonContainer}>
                    <Link to="/therapistLogin">
                        <button className={`${styles.accessButton} ${styles.terapistaBtn}`}>Terapista</button>
                    </Link>
                    <Link to="/Guest">
                        <button className={`${styles.accessButton} ${styles.guestBtn}`}>Invitado</button>
                    </Link>
                </div>
            </div>
            <div className={styles.characterContainer}>
                {isBubbleVisible && (
                    <div className={styles.speechBubble}>
                        <p className={styles.welcomeText}>¡Hola! Soy Nica. ¿Eres terapista o invitado? Elige uno.</p>
                        <div className={styles.bubbleButtons}>
                            <button id="soundButton" className={styles.soundButton}>
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                )}
                <img src={characterImage} alt="Character" className={styles.characterImage} />
            </div>
            <div className={styles.logosContainer}>
                <img src={logoEpn} alt="Logo EPN" className={styles.logo} />
                <img src={logoLudolab} alt="Logo Ludolab" className={styles.logo} />
            </div>
        </div>
    );
}

export default App;
