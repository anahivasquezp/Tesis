import { useContext } from 'react';  
import { ChildContext } from './ChildContext';  
import { getAuth } from 'firebase/auth';  
import '../../css/Access/PrincipalMenu.css'; // Asegúrate de importar tu archivo CSS  
  
function PrincipalMenu() {  
  const { selectedChild } = useContext(ChildContext);  
  const auth = getAuth();  
  
  return (  
    <div className="menu-container">  
      <div className="user-info">  
        <h2>{auth.currentUser.email}</h2>  
        {selectedChild && (  
          <>  
            <h2>{selectedChild.name}</h2>  
            <img src={selectedChild.characterImage} alt={selectedChild.character} />  
          </>  
        )}  
      </div>  
      <div className="button-container">  
        <button>Conciencia fonética</button>  
        <button>Ejercicios fonológicos</button>  
      </div>  
    </div>  
  );  
}  
  
export default PrincipalMenu;  
