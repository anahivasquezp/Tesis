import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Exercises/PhonologicalExercises.css';

function PhonologicalExercises() {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="phonological-exercises-container">
            <h1>Ejercicios Fonológicos</h1>
            <div className="button-group">
                <button onClick={() => handleNavigate('/vocalMenu')}>Vocales</button>
                <button onClick={() => handleNavigate('/age-fonemas/3')}>3 años</button>
                <button onClick={() => handleNavigate('/age-fonemas/4')}>4 años</button>
                <button onClick={() => handleNavigate('/age-fonemas/5')}>5 años</button>
                <button onClick={() => handleNavigate('/age-fonemas/6')}>6 años</button>
            </div>
        </div>
    );
}

export default PhonologicalExercises;
