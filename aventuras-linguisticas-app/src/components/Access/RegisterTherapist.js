import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import styles from '../../css/Access/RegisterTherapist.module.css';
import characterImage from '../../images/personaje_neutral.jpg';

function RegisterTherapist() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const navigate = useNavigate();

  const registerTherapist = async (event) => {
    event.preventDefault();

    const age = calculateAge(birthDate);

    if (age < 18) {
      setError("Debes tener al menos 18 años para registrarte.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "therapists", user.uid), {
        email: email,
        birthDate: birthDate,
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

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const differenceInMs = Date.now() - birthDate.getTime();
    const age_dt = new Date(differenceInMs);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

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
          <label htmlFor="birthDate" className={styles.formLabel}>
            Fecha de Nacimiento:
          </label>
          <input
            type="date"
            className={styles.formInput}
            name="birthDate"
            value={birthDate}
            placeholder="Tu Fecha de Nacimiento"
            onChange={(event) => setBirthDate(event.target.value)}
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
