import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import styles from '../../css/Access/Guest.module.css';
import characterImage from '../../images/Nica_Neutral.png';

function Guest() {
    const [characters, setCharacters] = useState([]);
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);
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

    useEffect(() => {
        const message = "Por favor, selecciona tu personaje.";
        const utterance = new SpeechSynthesisUtterance(message);
        const soundButton = document.getElementById('soundButton');

        soundButton.addEventListener('click', () => {
            speechSynthesis.speak(utterance);
        });

        return () => {
            soundButton.removeEventListener('click', () => {
                speechSynthesis.cancel();
            });
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleCharacterSelect = (character) => {
        sessionStorage.setItem('guestCharacter', JSON.stringify(character));
        navigate('/Menu');
    };

    const handleShowBubble = () => {
        setIsBubbleVisible(true);
        const timer = setTimeout(() => {
            setIsBubbleVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.topButtonsContainer}>
                <Link to="/" className={styles.topButton}>
                    <i className="fas fa-home"></i>
                </Link>
                <button className={styles.topButton} onClick={handleShowBubble}>
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
            <div className={styles.characterSection}>
                {isBubbleVisible && (
                    <div className={styles.speechBubble}>
                        <p className={styles.welcomeText}>Por favor, selecciona tu personaje.</p>
                        <div className={styles.bubbleButtons}>
                            <button id="soundButton" className={styles.soundButton}>
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>
                    </div>
                )}
                <img src={characterImage} alt="Character" className={styles.mainCharacterImage} />
            </div>
        </div>
    );
}

export default Guest;
