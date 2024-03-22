import { getAuth } from 'firebase/auth';  
import { getFirestore, addDoc, collection } from 'firebase/firestore';  
import { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
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
    <div className="container">  
      <div className="image-container">  
        {characterImages.map((image) => (  
          <img  
            key={image.id}  
            src={image.urls.small}  
            alt={image.alt_description}  
            onClick={() => setSelectedImage(image.urls.small)}  
            style={{ border: selectedImage === image.urls.small ? '2px solid blue' : 'none' }}  
          />  
        ))}  
      </div>  
    
      <div className="form-container">  
        <h1>Registrar un niño</h1>  
    
        <form onSubmit={registerChild}>  
          <input  
            type="text"  
            name="name"  
            value={name}  
            placeholder="Nombre"  
            onChange={(e) => setName(e.target.value)}  
          />  
    
          <input  
            type="date"  
            name="birthDate"  
            value={birthDate}  
            placeholder="Fecha de nacimiento"  
            onChange={(e) => setBirthDate(e.target.value)}  
          />  
    
          <button type="submit">Registrar</button>  
        </form>  
      </div>  
    </div>  
  );  
}  
  
export default RegisterChild;  
