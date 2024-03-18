import React, { useState } from "react";  
import { Link } from 'react-router-dom';  
import { auth } from "../../firebase";
import '../../css/Access/therapistLogin.css';  

function TherapistLogin() {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [error, setError] = useState(null);  
  
  const signInWithEmailAndPasswordHandler =   
          (event,email, password) => { 
              event.preventDefault();  
              auth.signInWithEmailAndPassword(email, password).catch(error => {  
                setError("Error signing in with password and email!");  
                console.error("Error signing in with password and email", error);  
              });  
  };  
  
  const onChangeHandler = (event) => {  
      const {name, value} = event.currentTarget;  
  
      if(name === 'userEmail') {  
          setEmail(value);  
      }  
      else if(name === 'userPassword'){  
        setPassword(value);  
      }  
  };  
  
  return (  
    <div className="mt-8">  
      <h1 className="text-3xl mb-2 text-center font-bold">Iniciar sesión como Terapista</h1>  
      <div className="border border-blue-300 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">  
        {error !== null && <div className = "py-4 bg-red-600 w-full text-white text-center mb-3">{error}</div>}  
        <form className="">  
          <label htmlFor="userEmail" className="w-full block">  
            Email:  
          </label>  
          <input  
            type="email"  
            className="my-1 p-1 w-full"  
            name="userEmail"  
            value = {email}  
            placeholder="E.g: faruq123@gmail.com"  
            id="userEmail"  
            onChange = {(event) => onChangeHandler(event)}  
          />  
          <label htmlFor="userPassword" className="w-full block">  
            Contraseña:  
          </label>  
          <input  
            type="password"  
            className="mt-1 mb-3 p-1 w-full"  
            name="userPassword"  
            value = {password}  
            placeholder="Tu Contraseña"  
            id="userPassword"  
            onChange = {(event) => onChangeHandler(event)}  
          />  
          <button  
            className="bg-green-400 hover:bg-green-500 w-full py-2 text-white"  
            onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}  
          >  
            Iniciar sesión  
          </button>  
        </form>  
        <p className="text-center my-3">o</p>  
        <button className="bg-red-500 hover:bg-red-600 w-full py-2 text-white">  
          Iniciar sesión con Google  
        </button>  
        <p className="text-center my-3">  
          ¿No tienes una cuenta? {" "}  
          <Link to="/registerTherapist" className="text-blue-500 hover:text-blue-600">  
            Regístrate aquí  
          </Link>{" "}  
        </p>  
      </div>  
    </div>  
  );  
}  
  
export default TherapistLogin;  
