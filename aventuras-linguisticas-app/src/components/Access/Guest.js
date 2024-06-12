import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiUnsplash from '../../apis/apiUnsplash'; // Asegúrate de que la ruta es correcta
import '../../css/Access/Guest.css';

function Guest() {
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            const response = await apiUnsplash.get('/search/photos', {
                params: {
                    query: 'cartoon animal',
                    per_page: 5
                }
            });
            setCharacters(response.data.results);
        };

        fetchCharacters();
    }, []);

    const handleCharacterSelect = (character) => {
        sessionStorage.setItem('guestCharacter', JSON.stringify(character)); // Guarda el personaje seleccionado en sessionStorage
        navigate('/Menu'); // Redirige al menú principal
    };

    return (
        <div className="guest-container">
            <Link to="/" className="btn btn-secondary back-home-button">
                <i className="fas fa-home"></i>
            </Link>
            <h1 className="guest-title">Invitado</h1>
            <h2 className="guest-subtitle">Seleccione su personaje:</h2>
            <div className="character-container">
                {characters.map((character) => (
                    <img
                        key={character.id}
                        src={character.urls.small}
                        alt={character.alt_description}
                        onClick={() => handleCharacterSelect(character)}
                        className="character-image"
                    />
                ))}
            </div>
        </div>
    );
}

export default Guest;
