import { getAuth } from 'firebase/auth';  
import { getFirestore, addDoc, collection } from 'firebase/firestore';  
import { useState, useEffect } from 'react';  
import { useNavigate, Link } from 'react-router-dom';  
import apiUnsplash from '../../apis/apiUnsplash'; 
import '../../css/Access/RegisterChild.css';
  
function RegisterChild() {  
  const [name, setName] = useState('');  
  const [birthDate, setBirthDate] = useState('');  
  const [characterImages, setCharacterImages] = useState([]);  
  const [selectedImage, setSelectedImage] = useState(null);  
  const auth = getAuth();  
  const db = getFirestore();  
  const navigate = useNavigate();  
  
  useEffect(() => {  
    const fetchCharacterImages = async () => {  
      const response = await apiUnsplash.get('/search/photos', {  
        params: {  
          query: 'cartoon animal'  
        }  
      });  
  
      setCharacterImages(response.data.results);  
    };  
  
    fetchCharacterImages();  
  }, []);  
  
  const registerChild = async (event) => {  
    event.preventDefault();  
  
    try {  
        await addDoc(collection(db, 'children'), {  
          name: name,  
          birthDate: birthDate,  
          characterImage: selectedImage,  
          therapistId: auth.currentUser.uid  
        });  
        
        navigate('/chooseChild');  
      } catch (error) {  
        console.error('Error al registrar al niño', error);  
      } 
  };  
  
  return (  
    <div className="register-child-container">
      <Link to="/" className="btn btn-secondary back-home-button">
        <i className="fas fa-home"></i>
      </Link>
      <Link to="/chooseChild" className="btn btn-secondary back-choose-child-button">
        <i className="fas fa-arrow-left"></i>
      </Link>
      <div className="form-container">  
        <h1 className="register-title">Registrar un niño</h1>  
    
        <form onSubmit={registerChild}>  
          <label htmlFor="name" className="form-label">Nombre:</label>
          <input  
            type="text"  
            name="name"  
            className="form-input"
            value={name}  
            placeholder="Nombre"  
            onChange={(e) => setName(e.target.value)}  
          />  
    
          <label htmlFor="birthDate" className="form-label">Fecha de nacimiento:</label>
          <input  
            type="date"  
            name="birthDate"  
            className="form-input"
            value={birthDate}  
            placeholder="Fecha de nacimiento"  
            onChange={(e) => setBirthDate(e.target.value)}  
          />  
    
          <button type="submit" className="register-button">Registrar</button>  
        </form>  
      </div>
      <div className="image-container">  
        {characterImages.map((image) => (  
          <img  
            key={image.id}  
            src={image.urls.small}  
            alt={image.alt_description}  
            onClick={() => setSelectedImage(image.urls.small)}  
            className={`character-image ${selectedImage === image.urls.small ? 'selected' : ''}`} 
          />  
        ))}  
      </div>
    </div>  
  );  
}  
  
export default RegisterChild;
