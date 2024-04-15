import React, { useContext, useEffect, useState } from 'react';
import { ChildContext } from './ChildContext';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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

    return (
        <div className="menu-container">
            <div className="user-info">
                {/* Show user info only if a user is logged in */}
                {auth.currentUser && (
                    <>
                        <h2>{auth.currentUser.email}</h2>
                        {selectedChild && (
                            <>
                                <h2>{selectedChild.name}</h2>
                                <img src={selectedChild.characterImage} alt={selectedChild.character} />
                            </>
                        )}
                    </>
                )}
                {/* Show guest character only if no user is logged in */}
                {!auth.currentUser && guestCharacter && (
                    <>
                        <h2>{guestCharacter.alt_description}</h2>
                        <img src={guestCharacter.urls.small} alt="Selected Character" />
                    </>
                )}
            </div>
            <div className="button-container">
                <button>Conciencia fonética</button>
                <button>Ejercicios fonológicos</button>
                <button onClick={handleSignOut}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default PrincipalMenu;
