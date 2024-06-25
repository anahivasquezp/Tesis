import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/Access/MainWindow.module.css';
import farmBackground from '../../images/therapist_login_bg.webp';
import characterImage from '../../images/Nica_presenta.png';
import titleImage from '../../images/title.png';

function App() {
    useEffect(() => {
        const message = "¡Bienvenidos a Aventuras Lingüísticas en la Granja! Por favor, elijan si son terapistas o invitados.";
        const utterance = new SpeechSynthesisUtterance(message);
        const soundButton = document.getElementById('soundButton');

        soundButton.addEventListener('click', () => {
            speechSynthesis.speak(utterance);
        });

        return () => {
            soundButton.removeEventListener('click', () => {
                speechSynthesis.cancel();
            });
        };
    }, []);

    return (
        <div className={styles.mainContainer} style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className={styles.topButtonsContainer}>
                <Link to="/instructions">
                    <button className={`${styles.topButton} ${styles.infoButton}`}>
                        <i className="fas fa-info"></i>
                    </button>
                </Link>
            </div>
            <div className={styles.contentContainer}>
                <img src={titleImage} alt="Title" className={styles.titleImage} />
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
                <div className={styles.speechBubble}>
                    <p className={styles.welcomeText}>¡Bienvenidos a Aventuras Lingüísticas en la Granja! Por favor, elijan si son terapistas o invitados.</p>
                    <button id="soundButton" className={styles.soundButton}>
                        <i className="fas fa-volume-up"></i>
                    </button>
                </div>
                <img src={characterImage} alt="Character" className={styles.characterImage} />
            </div>
        </div>
    );
}

export default App;
