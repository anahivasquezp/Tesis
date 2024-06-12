import React, { useContext, useEffect, useState } from 'react';
import { ChildContext } from './ChildContext';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/Access/PrincipalMenu.css';

function PrincipalMenu() {
    const { selectedChild } = useContext(ChildContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const [guestCharacter, setGuestCharacter] = useState(null);

    useEffect(() => {
        const storedCharacter = sessionStorage.getItem('guestCharacter');
        if (storedCharacter) {
            setGuestCharacter(JSON.parse(storedCharacter));
        }
    }, []);

    const handleSignOut = () => {
        signOut(auth); // Firebase sign out for authenticated user
        sessionStorage.removeItem('guestCharacter'); // Clear guest character information
        navigate('/'); // Redirect to the home or login page
    };

    const handleNavigatePhonemicAwareness = () => {
        navigate('/phonemic-awareness-piano'); // Navigate to Phonemic Awareness page
    };

    const handleNavigatePhonologicalExercises = () => {
        navigate('/phonological-exercises'); // Navigate to Phonological Exercises page
    };

    return (
        <div className="menu-container">
            <Link to="/" className="btn btn-secondary back-home-button">
                <i className="fas fa-home"></i>
            </Link>
            <div className="user-info">
                {/* Show user info only if a user is logged in */}
                {auth.currentUser && (
                    <>
                        <h2>{auth.currentUser.email}</h2>
                        {selectedChild && (
                            <>
                                <h2>{selectedChild.name}</h2>
                                <img src={selectedChild.characterImage} alt={selectedChild.character} className="character-image" />
                            </>
                        )}
                    </>
                )}
                {/* Show guest character only if no user is logged in */}
                {!auth.currentUser && guestCharacter && (
                    <>
                        <h2>{guestCharacter.alt_description}</h2>
                        <img src={guestCharacter.urls.small} alt="Selected Character" className="character-image" />
                    </>
                )}
            </div>
            <div className="button-container">
                <button className="menu-button" onClick={handleNavigatePhonemicAwareness}>Conciencia fonética</button>
                <button className="menu-button" onClick={handleNavigatePhonologicalExercises}>Ejercicios fonológicos</button>
                <button className="menu-button" onClick={handleSignOut}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default PrincipalMenu;
