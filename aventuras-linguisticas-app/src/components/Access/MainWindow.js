import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../css/Access/MainWindow.css'; 

function App() {

    return (
        <div className='main-container'>
            <div>
                <h1>AVENTURAS LINGÜÍSTICAS EN LA GRANJA</h1>
            </div>
            <div className="button-container">
                <Link to={`/therapistLogin`}>
                    <button className="Terapista">Terapista</button>
                </Link>
                <Link to={`/Guest`}>
                    <button className="button-right">Invitado</button>
                </Link>
            </div>
        </div>
    );

}

export default App;