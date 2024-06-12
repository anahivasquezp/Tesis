import React, { useState } from "react";  
import { Link, useNavigate } from 'react-router-dom';  
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";    
import { getFirestore, doc, setDoc } from "firebase/firestore";    
import '../../css/Access/RegisterTherapist.css';    

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
        birthDate: birthDate ,                
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
    <div className="register-container">    
      <div className="register-form-container">
        <Link to="/" className="btn btn-secondary back-home-button">
          <i className="fas fa-home"></i>
        </Link>
        <Link to="/therapistLogin" className="btn btn-secondary back-login-button">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="register-title">Registrarse como Terapista</h1>    
  
        {error && <div className="error-message">{error}</div>}  
  
        <form className="register-form">      
          <label htmlFor="userEmail" className="form-label">  
            Correo Electrónico:  
          </label>  
          <input      
            type="email"    
            className="form-input"    
            name="email"    
            value={email}    
            placeholder="E.g: faruq123@gmail.com"    
            onChange={(e) => setEmail(e.target.value)}    
          />      
  
          <label htmlFor="userPassword" className="form-label">  
            Contraseña:  
          </label>  
          <input      
            type="password"    
            className="form-input"    
            name="password"    
            value={password}    
            placeholder="Tu Contraseña"    
            onChange={(e) => setPassword(e.target.value)}    
          />    
  
          <label htmlFor="birthDate" className="form-label">  
            Fecha de Nacimiento:  
          </label>  
          <input      
            type="date"      
            className="form-input"      
            name="birthDate"      
            value={birthDate}      
            placeholder="Tu Fecha de Nacimiento"      
            onChange={(event) => setBirthDate(event.target.value)}      
          />      
  
          <button className="register-button" onClick={registerTherapist}>    
            Registrarse    
          </button>    
        </form>    
      </div>    
    </div>    
  );     
}      
  
export default RegisterTherapist;
