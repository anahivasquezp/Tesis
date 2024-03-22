import { getAuth } from 'firebase/auth';  
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';  
import { useEffect, useState } from 'react';  
import { Link } from 'react-router-dom';  
import '../../css/Access/ChooseChild.css';  // Importa el archivo CSS  
  
function ChooseChild() {  
  const [children, setChildren] = useState([]);  
  const auth = getAuth();  
  const db = getFirestore();  
  
  useEffect(() => {  
    const fetchChildren = async () => {  
      const childrenQuery = query(  
        collection(db, 'children'),  
        where('therapistId', '==', auth.currentUser.uid)  
      );  
      const querySnapshot = await getDocs(childrenQuery);  
      setChildren(querySnapshot.docs.map(doc => doc.data()));  
    };  
  
    fetchChildren();  
  }, [auth, db]);  
  
  return (  
    <div className="container">  
      <h1>Elige un niño</h1>  
  
      {children.map(child => (  
        <div key={child.id} className="child-container">  
          <h2>{child.name}</h2>  
          <img src={child.characterImage} alt={child.character} />  
        </div>  
      ))}  
  
      <Link to="/registerChild" className="add-button">+</Link>  
    </div>  
  );  
}  
  
export default ChooseChild;  
