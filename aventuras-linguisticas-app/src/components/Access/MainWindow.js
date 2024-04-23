import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Access/MainWindow.css'; 
import farmBackground from '../../images/main_window_bg.webp'; // Asegúrate de que la ruta de la imagen sea correcta

function App() {
    return (
        <div className='main-container' style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className="title-container">
                <h1 id="game-title1">LINGÜÍSTICAS</h1>
                <h1 id="game-title2">AVENTURAS</h1>
            </div>
            <div className="button-container">
                <Link to={`/therapistLogin`}>
                    <button className="access-button terapista-btn">Terapista</button>
                </Link>
                <Link to={`/Guest`}>
                    <button className="access-button guest-btn">Invitado</button>
                </Link>
            </div>
        </div>
    );
}

export default App;
