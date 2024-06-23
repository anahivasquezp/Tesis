import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../css/Access/MainWindow.module.css';
import farmBackground from '../../images/therapist_login_bg.webp';
import characterImage from '../../images/pig_granjera.png';

function App() {
    return (
        <div className={styles.mainContainer} style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className={styles.topButtonsContainer}>
                <button className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
                </button>
            </div>
            <div className={styles.contentContainer}>
                <h1 className={styles.gameTitle}>AVENTURAS LINGÜÍSTICAS EN LA GRANJA</h1>
                <div className={styles.buttonContainer}>
                    <Link to="/therapistLogin">
                        <button className={`${styles.accessButton} ${styles.terapistaBtn}`}>Terapista</button>
                    </Link>
                    <Link to="/Guest">
                        <button className={`${styles.accessButton} ${styles.guestBtn}`}>Invitado</button>
                    </Link>
                </div>
            </div>
            <img src={characterImage} alt="Character" className={styles.characterImage} />
        </div>
    );
}

export default App;
