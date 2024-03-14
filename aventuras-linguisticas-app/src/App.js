// App.js  
  
import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import VocalMenu from './components/VocalMenu';  
import VocalPage from './components/VocalPage';  
import ConcienciaFonemicaPage from './components/ConcienciaFonemicaPage';
import './App.css';  
  
function App() {  
  return (  
    <Router>  
      <div className="app">  
        <Routes>  
          <Route path="/" element={<VocalMenu />} />  
          <Route path="/vocal/:vocal" element={<VocalPage />} /> 
          <Route path="/vocal/:vocal/conciencia-fonemica" element={<ConcienciaFonemicaPage />} />   
        </Routes>  
      </div>  
    </Router>  
  );  
}  
  
export default App;  
