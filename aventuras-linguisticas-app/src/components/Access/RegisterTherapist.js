import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importación añadida
import styles from '../../css/Access/RegisterTherapist.module.css';
import nicaNeutral from '../../images/Nica_Neutral.png';
import nicaPresenting from '../../images/Nica_presenta.png';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function RegisterTherapist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [nicaImage, setNicaImage] = useState(nicaPresenting);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); // Inicialización añadida

  useEffect(() => {
    const message = "Por favor, ingresa tu nombre, correo electrónico y contraseña para registrarte.";
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
      const message = "Por favor, ingresa tu nombre, correo electrónico y contraseña para registrarte.";
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

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const registerWithEmailAndPasswordHandler = async (event, email, password) => {
    event.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      // Añadir el terapeuta a Firestore
      await setDoc(doc(db, "therapists", user.uid), {
        name: name,
        email: email,
        therapistId: user.uid
      });

      navigate("/therapistLogin");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil.');
      } else {
        setError('Error al registrarse con correo electrónico y contraseña');
      }
      console.error("Error signing up with email and password", error);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'userName') {
      setName(value);
    } else if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.topButtonsContainer}>
        <Link to="/" className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </Link>
        <button className={`${styles.topButton} ${styles.infoButton}`} onClick={handleShowBubble}>
          <i className="fas fa-info"></i>
        </button>
      </div>
      <div className={styles.registerFormContainer}>
        <h1 className={styles.registerTitle}>Registrarse como Terapeuta</h1>
        <h2 className={styles.Subtitle}>Por favor, ingrese su nombre, correo electrónico y contraseña para registrarse:</h2>
        {error !== null && <div className={styles.errorMessage}>{error}</div>}
        <form className={styles.registerForm}>
          <label htmlFor="userName" className={styles.formLabel}>
            Nombre:
          </label>
          <input
            type="text"
            className={styles.formInput}
            name="userName"
            value={name}
            placeholder="E.g: Juan Pérez"
            id="userName"
            onChange={(event) => onChangeHandler(event)}
          />
          <label htmlFor="userEmail" className={styles.formLabel}>
            Correo Electrónico:
          </label>
          <input
            type="email"
            className={styles.formInput}
            name="userEmail"
            value={email}
            placeholder="E.g: juanperez@gmail.com"
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
            className={styles.registerButton}
            onClick={(event) => { registerWithEmailAndPasswordHandler(event, email, password) }}
          >
            Registrarse
          </button>
        </form>
        <p className={styles.registerText}>
          ¿Ya tienes una cuenta? {" "}
          <Link to="/therapistLogin" className={styles.loginLink}>
            Inicia sesión aquí
          </Link>{" "}
        </p>
      </div>
      <img src={nicaImage} alt="Character" className={styles.characterImage} style={getNicaImageStyle()} />
      {isBubbleVisible && (
        <div className={styles.speechBubble}>
          <p className={styles.welcomeText}>Por favor, ingresa tu nombre, correo electrónico y contraseña para registrarte.</p>
          <button id="soundButton" className={styles.soundButton}>
            <i className="fas fa-volume-up"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default RegisterTherapist;
