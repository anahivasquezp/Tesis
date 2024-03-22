import React, { useState } from "react";      
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";    
import { getFirestore, doc, setDoc } from "firebase/firestore";    
import { useNavigate } from 'react-router-dom';    
  
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
    <div>    
      <h1>Registrarse como Terapista</h1>    
  
      {error && <p>{error}</p>}  
  
      <form>      
        <input      
          type="email"    
          name="email"    
          value={email}    
          placeholder="Tu Email"    
          onChange={(e) => setEmail(e.target.value)}    
        />      
  
        <input      
          type="password"    
          name="password"    
          value={password}    
          placeholder="Tu Contraseña"    
          onChange={(e) => setPassword(e.target.value)}    
        />    
  
        <input      
          type="date"      
          name="birthDate"      
          value = {birthDate}      
          placeholder="Tu Fecha de Nacimiento"      
          onChange = {(event) => setBirthDate(event.target.value)}      
        />      
  
        <button onClick={registerTherapist}>    
          Registrarse    
        </button>    
      </form>    
    </div>    
  );     
}      
  
export default RegisterTherapist;    
