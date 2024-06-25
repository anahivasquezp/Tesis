import React from 'react';
import { Link } from 'react-router-dom';import styles from '../../css/Access/Instructions.module.css'; // Asegúrate de crear el archivo CSS
import farmBackground from '../../images/therapist_login_bg.webp';
import characterImage from '../../images/pig_granjera.png';

function Instructions() {
    return (
        <div className={styles.mainContainer} style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className={styles.topButtonsContainer}>
                <Link to="/">
                    <button className={`${styles.topButton} ${styles.backButton}`}>
                        <i className="fas fa-arrow-left"></i> Regresar
                    </button>
                </Link>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.instructionsBox}>
                    <h1 className={styles.instructionsTitle}>Instrucciones</h1>
                    <p className={styles.instructionsText}>
                        Bienvenido a Aventuras Lingüísticas en la Granja. En esta plataforma, los niños pueden aprender fonemas y mejorar sus habilidades lingüísticas a través de juegos interactivos y divertidos. A continuación se detallan algunas instrucciones y consejos para utilizar esta plataforma:
                    </p>
                    <ul className={styles.instructionsList}>
                        <li>Elige el rol de Terapista si eres un profesional y necesitas acceder a las herramientas terapéuticas.</li>
                        <li>Elige el rol de Invitado para acceder a las actividades como usuario invitado.</li>
                        <li>Usa el menú superior para navegar a través de las diferentes secciones de la plataforma.</li>
                        <li>Completa los ejercicios y acumula estrellas para motivar el aprendizaje continuo.</li>
                    </ul>
                </div>
            </div>
            <img src={characterImage} alt="Character" className={styles.characterImage} />
        </div>
    );
}

export default Instructions;
