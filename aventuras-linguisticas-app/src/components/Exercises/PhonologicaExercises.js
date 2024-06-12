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
            <h1 className="exercise-title">Ejercicios Fonológicos</h1>
            <div className="button-group">
                <button className="exercise-button" onClick={() => handleNavigate('/vocalMenu')}>
                    <i className="fas fa-font"></i> Vocales
                </button>
                <button className="exercise-button" onClick={() => handleNavigate('/age-fonemas/3')}>
                    <i className="fas fa-child"></i> 3 años
                </button>
                <button className="exercise-button" onClick={() => handleNavigate('/age-fonemas/4')}>
                    <i className="fas fa-child"></i> 4 años
                </button>
                <button className="exercise-button" onClick={() => handleNavigate('/age-fonemas/5')}>
                    <i className="fas fa-child"></i> 5 años
                </button>
                <button className="exercise-button" onClick={() => handleNavigate('/age-fonemas/6')}>
                    <i className="fas fa-child"></i> 6 años
                </button>
            </div>
        </div>
    );
}

export default PhonologicalExercises;
