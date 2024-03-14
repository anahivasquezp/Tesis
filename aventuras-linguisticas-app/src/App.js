// Importamos las bibliotecas y componentes necesarios  
import React from 'react'; // React es la biblioteca base para construir componentes  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Estos son componentes de enrutamiento de la biblioteca 'react-router-dom'  
import VocalMenu from './components/VocalMenu'; // Este es un componente personalizado para el menú de vocales  
import VocalPage from './components/VocalPage'; // Este es un componente personalizado para la página de una vocal específica  
import ConcienciaFonemicaPage from './components/ConcienciaFonemicaPage'; // Este es un componente personalizado para la página de conciencia fonémica de una vocal  
import './App.css'; // Este es el archivo de estilos CSS para este componente  
  
// Definimos el componente App  
function App() {  
  // El componente retorna un elemento Router que define las rutas de nuestra aplicación  
  return (  
    <Router> // Router es un componente que envuelve y proporciona funcionalidad de enrutamiento a sus componentes hijos  
      <div className="app"> // Este es un contenedor para las rutas de nuestra aplicación  
        <Routes> // Routes es un componente que envuelve y proporciona un contexto para sus componentes Route hijos  
          <Route path="/" element={<VocalMenu />} /> // Esta es la ruta para la página principal ("/") que muestra el componente VocalMenu  
          <Route path="/vocal/:vocal" element={<VocalPage />} /> // Esta es la ruta para una página de vocal específica ("/vocal/:vocal") que muestra el componente VocalPage  
          <Route path="/vocal/:vocal/conciencia-fonemica" element={<ConcienciaFonemicaPage />} /> // Esta es la ruta para la página de conciencia fonémica de una vocal ("/vocal/:vocal/conciencia-fonemica") que muestra el componente ConcienciaFonemicaPage  
        </Routes> // Cierre del componente Routes  
      </div> // Cierre del contenedor  
    </Router> // Cierre del componente Router  
  ); // Fin de la declaración de retorno  
}  
  
// Exportamos el componente App para que pueda ser importado y utilizado en otros archivos  
export default App;  
