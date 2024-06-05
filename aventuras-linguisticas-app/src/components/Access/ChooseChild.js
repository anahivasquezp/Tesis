import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Access/ChooseChild.css';
import { ChildContext } from './ChildContext';

function ChooseChild() {
  const [children, setChildren] = useState([]);
  const { setSelectedChild } = useContext(ChildContext);
  const [selectedId, setSelectedId] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      const childrenQuery = query(
        collection(db, 'children'),
        where('therapistId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(childrenQuery);
      setChildren(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchChildren();
  }, [auth, db]);

  const handleChildClick = (child) => {
    setSelectedChild(child);
    setSelectedId(child.id);
    navigate('/Menu');
  };

  return (
    <div className="container">
      <h1>Elige un niño</h1>
      {children.map((child) => (
        <div
          key={child.id}
          className={`child-container ${child.id === selectedId ? 'selected' : ''}`}
          onClick={() => handleChildClick(child)}
        >
          <h2>{child.name}</h2>
          <img src={child.characterImage} alt={child.character} />
        </div>
      ))}
      <Link to="/registerChild" className="add-button">+</Link>
    </div>
  );
}

export default ChooseChild;
