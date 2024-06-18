import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from "../../firebase";
import styles from '../../css/Access/therapistLogin.module.css';
import characterImage from '../../images/personaje_neutral.jpg';

function TherapistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className={styles.loginContainer}>
      <div className={styles.topButtonsContainer}>
        <Link to="/" className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </Link>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
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
        <p className="text-center my-3">
          ¿No tienes una cuenta? {" "}
          <Link to="/registerTherapist" className={styles.registerLink}>
            Regístrate aquí
          </Link>{" "}
        </p>
      </div>
      <img src={characterImage} alt="Character" className={styles.characterImage} />
    </div>
  );
}

export default TherapistLogin;
