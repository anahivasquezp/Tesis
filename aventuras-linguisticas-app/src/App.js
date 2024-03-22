// Importamos las bibliotecas y componentes necesarios  
import React from 'react'; // React es la biblioteca base para construir componentes  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Estos son componentes de enrutamiento de la biblioteca 'react-router-dom'  
import VocalMenu from './components/Vocals/VocalMenu'; // Este es un componente personalizado para el menú de vocales  
import VocalPage from './components/Vocals/VocalPage'; // Este es un componente personalizado para la página de una vocal específica  
import ConcienciaFonemicaPage from './components/ConcienciaFonemicaPage'; // Este es un componente personalizado para la página de conciencia fonémica de una vocal  
import './App.css'; // Este es el archivo de estilos CSS para este componente  
import MainWindow from './components/Access/MainWindow'; // Este es un componente personalizado para la ventana principal
import TherapistLogin from './components/Access/TherapistLogin'; // Este es un componente personalizado para el login del terapeuta
import Guest from './components/Access/Guest'; // Este es un componente personalizado para el login del terapeuta
import RegisterTherapist from './components/Access/RegisterTherapist'; // Este es un componente personalizado para el registro del terapeuta
import ChooseChild from './components/Access/ChooseChild'; // Este es un componente personalizado para elegir el niño
import RegisterChild from './components/Access/RegisterChild'; // Este es un componente personalizado para registrar el niño
import PrincipalMenu from './components/Access/PrincipalMenu'; // Este es un componente personalizado para el menú principal

import { ChildProvider } from './components/Access/ChildContext'; 

// Definimos el componente App  
function App() {  
  // El componente retorna un elemento Router que define las rutas de nuestra aplicación  
  return (  
    <ChildProvider>
      <Router>
          <div className="app">
            <Routes>  
              <Route path="/" element={<MainWindow />} /> 
              <Route path="/therapistLogin" element={<TherapistLogin />} /> 
              <Route path="/guest" element={<Guest />} /> 
              <Route path="/registerTherapist" element={<RegisterTherapist />} /> 
              <Route path="/chooseChild"c                        element={<ChooseChild />} /> 
              <Route path="/registerChild" element={<RegisterChild />} /> 
              <Route path="/vocalMenu" element={<VocalMenu />} /> 
              <Route path="/Menu" element={<PrincipalMenu />} /> 
              <Route path="/vocal/:vocal" element={<VocalPage />} /> 
              <Route path="/vocal/:vocal/conciencia-fonemica" element={<ConcienciaFonemicaPage />} />
            </Routes> 
          </div>       
      </Router>  
    </ChildProvider>
  ); 
}  
  
// Exportamos el componente App para que pueda ser importado y utilizado en otros archivos  
export default App;  
