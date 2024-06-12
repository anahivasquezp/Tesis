import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHome, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import '../../css/Vocals/VocalPage.css';

const VocalPage = () => {
  const { vocal } = useParams();

  return (
    <div className="main-container">
      <div className="button-container">
        <Link to="/" className="button-left back-button"><FaHome size={50} /></Link>
        <Link to="/" className="button-right back-button"><FaArrowLeft size={50} /></Link>
        <Link to={`/vocal/${vocal}/conciencia-fonemica`} className="button-right next-button"><FaArrowRight size={50} /></Link>
      </div>
      <div className="content-container">
        <h2 className="vocal-title">Vocal: {vocal}</h2>
        <div className="speech-bubble">
          <p>Aquí se realizará un ejercicio con la vocal {vocal}.</p>
        </div>
      </div>
    </div>
  );
};

export default VocalPage;
