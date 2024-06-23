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
      const user = auth.currentUser;

      if (!user) {
        console.error('No user is authenticated.');
        return;
      }

      const childrenQuery = query(
        collection(db, 'children'),
        where('therapistId', '==', user.uid)
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

  const handleEditChild = (child) => {
    setSelectedChild(child);
    setSelectedId(child.id);
    navigate('/editChild');
  };

  return (
    <div className="choose-child-container">
      <Link to="/" className="btn btn-secondary back-home-button">
        <i className="fas fa-home"></i>
      </Link>
      <Link to="/therapistLogin" className="btn btn-secondary back-login-button">
        <i className="fas fa-arrow-left"></i>
      </Link>
      <h1 className="choose-child-title">Elige un niño</h1>
      <div className="children-list">
        {children.map((child) => (
          <div
            key={child.id}
            className={`child-container ${child.id === selectedId ? 'selected' : ''}`}
          >
            <h2 onClick={() => handleChildClick(child)}>{child.name}</h2>
            <img src={child.characterImage} alt={child.character} className="child-image" />
            <button onClick={() => handleEditChild(child)} className="edit-button">
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
        ))}
      </div>
      <Link to="/registerChild" className="add-button">+</Link>
    </div>
  );
}

export default ChooseChild;
