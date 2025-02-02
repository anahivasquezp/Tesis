// Importamos las bibliotecas y componentes necesarios  
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'; // React es la biblioteca base para construir componentes  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Estos son componentes de enrutamiento de la biblioteca 'react-router-dom'  
import VocalMenu from './components/Vocals/VocalMenu'; // Este es un componente personalizado para el menú de vocales  
import VocalPage from './components/Vocals/VocalPage'; // Este es un componente personalizado para la página de una vocal específica  
import './App.css'; // Este es el archivo de estilos CSS para este componente  
import MainWindow from './components/Access/MainWindow'; // Este es un componente personalizado para la ventana principal
import TherapistLogin from './components/Access/TherapistLogin'; // Este es un componente personalizado para el login del terapeuta
import Guest from './components/Access/Guest'; // Este es un componente personalizado para el login del terapeuta
import RegisterTherapist from './components/Access/RegisterTherapist'; // Este es un componente personalizado para el registro del terapeuta
import ChooseChild from './components/Access/ChooseChild'; // Este es un componente personalizado para elegir el niño
import TransferChild from './components/Access/TransferChild';
import EditChild from './components/Access/EditChild';
import RegisterChild from './components/Access/RegisterChild'; // Este es un componente personalizado para registrar el niño
import PrincipalMenu from './components/Access/PrincipalMenu'; // Este es un componente personalizado para el menú principal
import { ChildProvider } from './components/Access/ChildContext'; 
import PhoneticExercises from './components/Exercises/PhoneticExercises'; // Import the missing component  
import PhonologicalExercises from './components/Exercises/PhonologicaExercises'; // Import the missing component
import AgeFonemas from './components/Exercises/AgeFonemas';
import FonemaExercise from './components/Exercises/FonemaExercise';
import PhonemicExerciseFull from './components/Exercises/PhonemicExerciseFull'; // Import the missing component
import SyllableExercise from './components/Exercises/SyllableExercise'; // Import the missing component
import PhraseExercise from './components/Exercises/PhraseExercise'; // Import the missing component
import CongratulationsExercises from './components/Exercises/CongratulationsExercises';
import CongratulationsVocales from './components/Vocals/CongratulationsVocales';
import CongratulationsPhonetic from './components/Exercises/CongratulationsPhonetic';
import Instructions from './components/Access/Instructions';




// Definimos el componente App  
function App() {  
  // El componente retorna un elemento Router que define las rutas de nuestra aplicación  
  return (  
    <ChildProvider>
      <Router>
          <div className="app">
            <Routes>  
              <Route path="/" element={<MainWindow />} /> 
              <Route path="/instructions" element={<Instructions/>} />
              <Route path="/therapistLogin" element={<TherapistLogin />} /> 
              <Route path="/guest" element={<Guest />} /> 
              <Route path="/registerTherapist" element={<RegisterTherapist />} /> 
              <Route path="/chooseChild" element={<ChooseChild />} /> 
              <Route path="/transferChild" element={<TransferChild />} />
              <Route path="/editChild" element={<EditChild />} />
              <Route path="/registerChild" element={<RegisterChild />} />               
              <Route path="/Menu" element={<PrincipalMenu />} /> 
              <Route path="/vocalMenu" element={<VocalMenu />} /> 
              <Route path="/vocal/:vocal/conciencia-fonemica" element={<VocalPage />} />
              <Route path="/congratulationsVocales" element={<CongratulationsVocales />} />
              <Route path="/phonetic-exercises" element={<PhoneticExercises />} />
              <Route path="/congratulationsPhonetic" element={<CongratulationsPhonetic />} />
              <Route path="/phonological-exercises" element={<PhonologicalExercises />} />
              <Route path="/age-fonemas/:age" element={<AgeFonemas />} />
              <Route path="/exercise/:fonema" element={<FonemaExercise />} />   
              <Route path="/PhonemicExerciseFull/:fonema" element={<PhonemicExerciseFull />} />  
              <Route path="/SyllableExercise/:fonema" element={<SyllableExercise />} />  
              <Route path="/PhraseExercise/:fonema" element={<PhraseExercise />} />  
              <Route path="/congratulationsExercises/:fonema" element={<CongratulationsExercises />} />
            </Routes> 
          </div>       
      </Router>  
    </ChildProvider>
  ); 
}  
  
// Exportamos el componente App para que pueda ser importado y utilizado en otros archivos  
export default App;  
