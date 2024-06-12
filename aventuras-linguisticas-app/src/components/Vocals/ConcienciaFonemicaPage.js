import React, { useEffect, useState } from 'react';
import getGifUrl from '../../apis/apiGiphy';
import { Link, useParams } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import '../../css/Vocals/ConcienciaFonemicaPage.css';

const ConcienciaFonemicaPage = () => {
  const { vocal } = useParams();
  const [gifUrl, setGifUrl] = useState(null);

  useEffect(() => {
    const fetchGif = async () => {
      const searchQuery = `${vocal}`;
      const url = await getGifUrl(searchQuery);
      setGifUrl(url);
    };

    fetchGif();
  }, [vocal]);

  return (
    <div className='main-container'>
      <div className="button-container">
        <Link to="/" className="button-left back-button"><FaHome size={50} /></Link>
        <Link to={`/vocal/${vocal}`} className="button-right back-button"><FaArrowLeft size={50} /></Link>
      </div>
      <div className="content-container">
        <h2 className="vocal-title">Conciencia fonémica de la vocal: {vocal}</h2>
        {gifUrl && <img src={gifUrl} alt={`GIF de la vocal ${vocal}`} className="vocal-gif" />}
        <div className="action-buttons">
          <button className="button-check"><FaCheck size={50} /></button>
          <button className="button-times"><FaTimes size={50} /></button>
        </div>
        <button className='reproducir-sonido'>Reproducir sonido</button>
      </div>
    </div>
  );
};

export default ConcienciaFonemicaPage;
