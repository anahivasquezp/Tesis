import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBotPAcQCpaSslwhGrgY2MnwnO8aRkEH6Y",
  authDomain: "aventuras-linguisticas.firebaseapp.com",
  projectId: "aventuras-linguisticas",
  storageBucket: "aventuras-linguisticas.appspot.com",
  messagingSenderId: "249036642109",
  appId: "1:249036642109:web:2655ef1eeec602f9b71754"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth service
const auth = getAuth();

// Export the Firebase Auth service
export { auth, signInWithEmailAndPassword };
export default app;