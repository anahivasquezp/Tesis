import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Access/MainWindow.css';
import farmBackground from '../../images/therapist_login_bg.webp'; // Asegúrate de que la ruta de la imagen sea correcta

function App() {
    return (
        <div className="main-container" style={{ backgroundImage: `url(${farmBackground})` }}>
            <div className="title-container d-flex flex-column justify-content-center align-items-center">
                <h1 id="game-title1">AVENTURAS LINGÜÍSTICAS EN LA GRANJA</h1>
                <div className="button-container d-flex justify-content-center">
                    <Link to="/therapistLogin">
                        <button className="access-button terapista-btn">Terapista</button>
                    </Link>
                    <Link to="/Guest">
                        <button className="access-button guest-btn">Invitado</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default App;
