import React, { useState } from "react";  
import { Link , useNavigate } from 'react-router-dom';  
import { auth, signInWithEmailAndPassword } from "../../firebase";
import '../../css/Access/therapistLogin.css';  

function TherapistLogin() {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();
  
  const signInWithEmailAndPasswordHandler =   
          (event, email, password) => { 
              event.preventDefault();  
              signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Signed in 
                  navigate("/chooseChild"); // Replace "/next-page" with the path you want to navigate to
                })
                .catch(error => {  
                  setError("Error al ingresar con correo electrónico y contraseña");  
                  console.error("Error signing in with password and email", error);  
                });  
  };  
  
  const onChangeHandler = (event) => {  
      const { name, value } = event.currentTarget;  
  
      if(name === 'userEmail') {  
          setEmail(value);  
      }  
      else if(name === 'userPassword'){  
        setPassword(value);  
      }  
  };  
  
  return (  
    <div className="login-container">  
      <div className="login-form-container">
        <Link to="/" className="btn btn-secondary back-button">
          <i className="fas fa-home"></i>
        </Link>
        <h1 className="login-title">Iniciar sesión como Terapista</h1>  
        {error !== null && <div className="error-message">{error}</div>}  
        <form className="login-form">  
          <label htmlFor="userEmail" className="form-label">  
            Correo Electrónico:  
          </label>  
          <input  
            type="email"  
            className="form-input"  
            name="userEmail"  
            value={email}  
            placeholder="E.g: faruq123@gmail.com"  
            id="userEmail"  
            onChange={(event) => onChangeHandler(event)}  
          />  
          <label htmlFor="userPassword" className="form-label">  
            Contraseña:  
          </label>  
          <input  
            type="password"  
            className="form-input"  
            name="userPassword"  
            value={password}  
            placeholder="Tu Contraseña"  
            id="userPassword"  
            onChange={(event) => onChangeHandler(event)}  
          />  
          <button  
            className="login-button"  
            onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}  
          >  
            Iniciar sesión  
          </button>  
        </form>   
        <p className="text-center my-3">  
          ¿No tienes una cuenta? {" "}  
          <Link to="/registerTherapist" className="register-link">  
            Regístrate aquí  
          </Link>{" "}  
        </p>  
      </div>  
    </div>  
  );  
}  
  
export default TherapistLogin;
