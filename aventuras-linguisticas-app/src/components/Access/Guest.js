import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiUnsplash from '../../apis/apiUnsplash'; // Asegúrate que la ruta está correcta

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
        <div>
            <h1>Invitado</h1>
            <h2>Seleccione su personaje:</h2>
            <div className="character-container">
                {characters.map((character) => (
                    <img
                        key={character.id}
                        src={character.urls.small}
                        alt={character.alt_description}
                        onClick={() => handleCharacterSelect(character)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Guest;
