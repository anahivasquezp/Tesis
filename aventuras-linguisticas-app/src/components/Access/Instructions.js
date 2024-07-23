import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/Access/Instructions.module.css';
import farmBackground from '../../images/therapist_login_bg.webp';
import characterImage from '../../images/Nica_presenta.png';
import logoEpn from '../../images/logo_epn.png';
import logoFis from '../../images/logo_fis.png';
import logoLudolab from '../../images/logo_ludolab.png';
import creativeCommons from '../../images/creative_commons.png';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function Instructions() {
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);

    useEffect(() => {
        const message = "¡Hola! Soy Nica. Vamos a conocer más sobre el juego.";
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);

        const hideBubbleTimer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 10000); // 10 seconds

        return () => {
            clearTimeout(hideBubbleTimer);
            speechSynthesis.cancel();
        };
    }, []);

    const handleShowBubble = () => {
        setIsBubbleVisible(true);
        const message = "¡Hola! Soy Nica. Vamos a conocer más sobre el juego.";
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);

        const hideBubbleTimer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 10000); // 10 seconds

        return () => {
            clearTimeout(hideBubbleTimer);
        };
    };

    return (
        <div className={styles.mainContainer} style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className={styles.topButtonsContainer}>
                <Link to="/" className={styles.link}>
                    <button className={`${styles.topButton} ${styles.backButton}`}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                </Link>
                <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
                    <i className="fas fa-info"></i>
                </button>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.logosContainer}>
                    <img src={logoEpn} alt="Logo EPN" className={styles.logoLeft} />
                    <img src={logoFis} alt="Logo FIS" className={styles.logoCenter} />
                    <img src={logoLudolab} alt="Logo Ludolab" className={styles.logoRight} />
                </div>
                <h1 className={styles.instructionsTitle}>Créditos</h1>
                <p className={styles.instructionsText}>
                    El presente proyecto tiene como objetivo desarrollar un juego serio educativo y gamificado para ayudar a los niños a mejorar la pronunciación de fonemas durante su desarrollo. Este juego está diseñado para ser utilizado bajo la supervisión de un experto, como un terapeuta del lenguaje, o, en su caso, por un padre de familia que haya sido orientado por un terapeuta del lenguaje. A través de distintos ejercicios fonológicos, el juego proporciona una experiencia interactiva y atractiva para los niños. El desarrollo de este proyecto ha sido posible gracias al apoyo del laboratorio LudoLab.
                </p>
                <p className={styles.instructionsText}>
                    LUDOLAB, un laboratorio de Sistemas de Información e Inclusión Social, que responde a los desafíos actuales con un enfoque en investigación, creatividad y responsabilidad. Su misión es contribuir al desarrollo mediante Sistemas de Información centrados en el usuario.
                </p>
                <div className={styles.creditsContainer}>
                    <div className={styles.creditColumn}>
                        <h3>Tutora</h3>
                        <p>Ph.D Mayra Carrión Toro</p>
                    </div>
                    <div className={styles.creditColumn}>
                        <h3>Autor</h3>
                        <p>Srta. Anahí Nicole Vásquez Pacheco</p>
                    </div>
                    <div className={styles.creditColumn}>
                        <h3>Colaboradores</h3>
                        <p>Ph.D Boris Astudillo</p>
                        <p>Ph.D Marco Santorum G.</p>
                        <p>Srta. Angela Vásquez</p>
                    </div>
                </div>
                <div className={styles.directorContainer}>
                    <h3>Directora LudoLab</h3>
                    <p>Ph.D Mayra Carrión Toro</p>
                </div>
                <div className={styles.socialMediaContainer}>
                    <FaFacebook className={styles.socialIcon} />
                    <FaInstagram className={styles.socialIcon} />
                    <FaTwitter className={styles.socialIcon} />
                </div>
                <div className={styles.footerContainer}>
                    <img src={creativeCommons} alt="Creative Commons" className={styles.creativeCommons} />
                    <p className={styles.footerText}>ludolab.epn.edu.ec</p>
                    <p className={styles.footerText}>ludolab@epn.edu.ec</p>
                </div>
            </div>
            <div className={styles.characterContainer}>
                {isBubbleVisible && (
                    <div className={styles.speechBubble}>
                        <p className={styles.welcomeText}>¡Hola! Soy Nica. Vamos a conocer más sobre el juego.</p>
                        <div className={styles.bubbleButtons}>
                            <button id="soundButton" className={styles.soundButton}>
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                )}
                <img src={characterImage} alt="Character" className={styles.characterImage} />
            </div>
        </div>
    );
}

export default Instructions;
