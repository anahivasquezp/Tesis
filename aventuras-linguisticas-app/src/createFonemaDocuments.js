const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBotPAcQCpaSslwhGrgY2MnwnO8aRkEH6Y",
    authDomain: "aventuras-linguisticas.firebaseapp.com",
    projectId: "aventuras-linguisticas",
    storageBucket: "aventuras-linguisticas.appspot.com",
    messagingSenderId: "249036642109",
    appId: "1:249036642109:web:2655ef1eeec602f9b71754"
  };  

firebase.initializeApp(firebaseConfig);  

const db = firebase.firestore();  

const fonemas = {  
  '3': ['m', 'ch', 'k', 'n', 'enie', 'p', 't', 'f', 'y', 'l', 'j'],  
  '4': ['b', 'd', 'g', 'bl', 'pl'],  
  '5': ['r', 'fl', 'kl', 'br', 'kr', 'gr'],  
  '6': ['rr', 's', 'gl', 'fr', 'pr', 'tr', 'dr']  
};  

async function createFonemaDocuments() {  
    try {
      for (const age in fonemas) {  
        for (let fonema of fonemas[age]) {  
          // Reemplaza la ñ con enie y cualquier otro caracter no alfanumérico con un guión
          //fonema = fonema.replace('ñ', 'enie').replace(/[^a-z0-9]/gi, '-');
          const data = {  
            image: 'https://example.com/default_image.jpg',  
            audio: 'https://example.com/default_audio.mp3',  
            concienciaFonemica: ['conciencia_fonemica_default'],  
            silabas: ['silaba_default'],  
            frase: {texto: 'frase_default'}  
          };
          console.log(`Escribiendo datos para fonema ${fonema}: `, data);
          await db.collection('exercises').doc(fonema).set(data);  
        }  
      }  
      console.log('Documentos creados.');
    } catch (error) {
      console.error('Error al crear documentos: ', error);
    }
  }  
  
  createFonemaDocuments();