import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import styles from '../../css/Access/RegisterTherapist.module.css';
import characterImage from '../../images/pig_granjera.png';

function RegisterTherapist() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [therapistName, setTherapistName] = useState("");
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const navigate = useNavigate();

  const registerTherapist = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "therapists", user.uid), {
        email: email,
        therapistName: therapistName,
      });

      navigate("/therapistLogin");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado.');
        console.error("Error al registrarse", error);
      } else {
        setError("Error al registrarse. Por favor intenta de nuevo.");
        console.error("Error al registrarse", error);
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.topButtonsContainer}>
        <Link to="/" className={`${styles.topButton} ${styles.homeButton}`}>
          <i className="fas fa-home"></i>
        </Link>
        <button className={`${styles.topButton} ${styles.infoButton}`}>
          <i className="fas fa-info"></i>
        </button>
        <Link to="/therapistLogin" className={`${styles.topButton} ${styles.backButton}`}>
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <div className={styles.registerFormContainer}>
        <h1 className={styles.registerTitle}>Registrarse como Terapista</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form className={styles.registerForm}>
          <label htmlFor="userEmail" className={styles.formLabel}>
            Correo Electrónico:
          </label>
          <input
            type="email"
            className={styles.formInput}
            name="email"
            value={email}
            placeholder="E.g: faruq123@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="userPassword" className={styles.formLabel}>
            Contraseña:
          </label>
          <input
            type="password"
            className={styles.formInput}
            name="password"
            value={password}
            placeholder="Tu Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="therapistName" className={styles.formLabel}>
            Nombre del Terapista:
          </label>
          <input
            type="text"
            className={styles.formInput}
            name="therapistName"
            value={therapistName}
            placeholder="Tu Nombre"
            onChange={(event) => setTherapistName(event.target.value)}
          />
          <button className={styles.registerButton} onClick={registerTherapist}>
            Registrarse
          </button>
        </form>
      </div>
      <img src={characterImage} alt="Character" className={styles.characterImage} />
    </div>
  );
}

export default RegisterTherapist;
