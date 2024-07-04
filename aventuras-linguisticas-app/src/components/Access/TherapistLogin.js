import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Modal from 'react-modal';
import styles from '../../css/Access/therapistLogin.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';

Modal.setAppElement('#root');

function TherapistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const message = "¡Bienvenido! Por favor, ingrese su correo electrónico y contraseña para iniciar sesión como terapista.";
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
      const message = "¡Bienvenido! Por favor, ingrese su correo electrónico y contraseña para iniciar sesión como terapista.";
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

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/chooseChild");
      })
      .catch(error => {
        setError("Error al ingresar con correo electrónico y contraseña");
        console.error("Error signing in with password and email", error);
      });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleSendResetEmail = () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setResetMessage("Correo de restablecimiento enviado.");
      })
      .catch((error) => {
        setResetMessage("Error al enviar el correo de restablecimiento.");
        console.error("Error sending password reset email", error);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.topButtonsContainer}>
        <Link to="/" className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </Link>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
      </div>
      <div className={styles.loginFormContainer}>
        <h1 className={styles.loginTitle}>Iniciar sesión como Terapista</h1>
        {error !== null && <div className={styles.errorMessage}>{error}</div>}
        <form className={styles.loginForm}>
          <label htmlFor="userEmail" className={styles.formLabel}>
            Correo Electrónico:
          </label>
          <input
            type="email"
            className={styles.formInput}
            name="userEmail"
            value={email}
            placeholder="E.g: faruq123@gmail.com"
            id="userEmail"
            onChange={(event) => onChangeHandler(event)}
          />
          <label htmlFor="userPassword" className={styles.formLabel}>
            Contraseña:
          </label>
          <input
            type="password"
            className={styles.formInput}
            name="userPassword"
            value={password}
            placeholder="Tu Contraseña"
            id="userPassword"
            onChange={(event) => onChangeHandler(event)}
          />
          <button
            className={styles.loginButton}
            onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password) }}
          >
            Iniciar sesión
          </button>
        </form>
        <Link onClick={handleForgotPassword} className={styles.forgotPasswordLink}>
          ¿Olvidaste tu contraseña?
        </Link>
        <p className={styles.registerText}>
          ¿No tienes una cuenta? {" "}
          <Link to="/registerTherapist" className={styles.registerLink}>
            Regístrate aquí
          </Link>{" "}
        </p>
      </div>
      <img src={nicaImage} alt="Character" className={styles.characterImage} style={getNicaImageStyle()} />
      {isBubbleVisible && (
        <div className={styles.speechBubble}>
          <p className={styles.welcomeText}>¡Bienvenido! Por favor, ingrese su correo electrónico y contraseña para iniciar sesión como terapista.</p>
          <button id="soundButton" className={styles.soundButton}>
            <i className="fas fa-volume-up"></i>
          </button>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Restablecer contraseña"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Restablecer contraseña</h2>
        <input
          type="email"
          className={styles.formInput}
          name="resetEmail"
          value={resetEmail}
          placeholder="Ingrese su correo electrónico"
          id="resetEmail"
          onChange={(event) => setResetEmail(event.currentTarget.value)}
        />
        <button onClick={handleSendResetEmail} className={styles.resetButton}>Enviar correo de restablecimiento</button>
        {resetMessage && <p className={styles.resetMessage}>{resetMessage}</p>}
      </Modal>
    </div>
  );
}

export default TherapistLogin;
