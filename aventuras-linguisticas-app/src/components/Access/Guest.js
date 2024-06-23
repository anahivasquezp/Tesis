import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; // Importa las funciones necesarias de Firebase
import styles from '../../css/Access/Guest.module.css';
import characterImage from '../../images/pig_granjera.png';

function Guest() {
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            const storage = getStorage();
            const characterPromises = [];

            for (let i = 1; i <= 9; i++) {
                const imageRef = ref(storage, `images/invitados/invitado${i}.webp`);
                characterPromises.push(
                    getDownloadURL(imageRef).then((url) => ({ id: `invitado${i}`, url }))
                );
            }

            const characters = await Promise.all(characterPromises);
            setCharacters(characters);
        };

        fetchCharacters();
    }, []);

    const handleCharacterSelect = (character) => {
        sessionStorage.setItem('guestCharacter', JSON.stringify(character));
        navigate('/Menu');
    };

    return (
        <div className={styles.guestContainer}>
            <div className={styles.topButtonsContainer}>
                <Link to="/" className={`${styles.topButton} ${styles.homeButton}`}>
                    <i className="fas fa-home"></i>
                </Link>
                <button className={`${styles.topButton} ${styles.infoButton}`}>
                    <i className="fas fa-info"></i>
                </button>
            </div>
            <div className={styles.contentContainer}>
                <h1 className={styles.guestTitle}>Invitado</h1>
                <h2 className={styles.guestSubtitle}>Seleccione su personaje:</h2>
                <div className={styles.characterContainer}>
                    {characters.map((character) => (
                        <img
                            key={character.id}
                            src={character.url}
                            alt={character.id}
                            onClick={() => handleCharacterSelect(character)}
                            className={styles.guestCharacterImage}
                        />
                    ))}
                </div>
            </div>
            <img src={characterImage} alt="Character" className={styles.mainCharacterImage} />
        </div>
    );
}

export default Guest;
