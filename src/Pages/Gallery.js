import React, { useState, useEffect } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true); // State variable to track loading state

  useEffect(() => {
    // Fetch images from Firebase
    const fetchImages = async () => {
      try {
        const snapshot = await Firebase.child('Images').once('value');
        const imagesData = snapshot.val();
        if (imagesData) {
          const imagesArray = Object.values(imagesData);
          setImages(imagesArray);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false); // Set loading to false once images are fetched
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const handleImageClose = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <Header />
      {loading ? ( // Render loader if images are still loading
        <div className="loader">wait image are Loading...</div>
      ) : (
        <div className="gallery-container">
          {images.map((image, index) => (
            <div key={index} className="image-box" onClick={() => handleImageClick(image.Path)}>
              <img src={image.Path} alt={`Image ${index}`} className="thumbnail" />
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div className="full-image-overlay" onClick={handleImageClose}>
          <img src={selectedImage} alt="Full Size" className="full-image" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
