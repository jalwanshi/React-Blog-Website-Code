import React, { useState, useEffect } from 'react';
import AdminHeader from '../Component/AdminHeader';
import Firebase from '../Firebase';

const PopupMessage = ({ message, closePopup }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-btn" onClick={closePopup}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

const UploadGallery = () => {
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [alertMessages, setAlertMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showUploadedImages, setShowUploadedImages] = useState(false); // State variable to toggle uploaded images table
  const [imagePreview, setImagePreview] = useState(null); // State variable for image preview

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        setShowPopup(false);
        setAlertMessages([]);
      }, 800); // Change the duration as needed (here it's 1 second)
    }
  }, [showPopup]);

  useEffect(() => {
    // Fetch uploaded images from Firebase on component mount
    const fetchImages = async () => {
      try {
        const snapshot = await Firebase.child("Images").once('value');
        const imagesData = snapshot.val();
        if (imagesData) {
          const images = Object.entries(imagesData).map(([key, value]) => ({ key, ...value }));
          setUploadedImages(images);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    const allowedExtensions = ["jpeg", "jpg", "png"];

    if (imageFile && allowedExtensions.includes(imageFile.type.split("/")[1].toLowerCase())) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        setImagePath(reader.result);
        setImageName(imageFile.name);
        setImagePreview(reader.result); // Set image preview
      };
    } else {
      setAlertMessages(["Only jpeg, jpg, and png images are allowed."]);
    }
  };

  const handleImageUpload = () => {
    if (imagePath) {
      Firebase.child("Images").push({ Path: imagePath }, (error) => {
        if (error) {
          setAlertMessages(["Error occurred while saving the image."]);
        } else {
          setAlertMessages(["Image saved successfully!"]);
          // Refresh the uploaded images after upload
          Firebase.child("Images").once('value', (snapshot) => {
            const imagesData = snapshot.val();
            if (imagesData) {
              const images = Object.entries(imagesData).map(([key, value]) => ({ key, ...value }));
              setUploadedImages(images);
            }
          });
        }
        setShowPopup(true);
        setImagePath('');
        setImageName('');
        setImagePreview(null); // Reset image preview
      });
    } else {
      setAlertMessages(["Please upload an image first."]);
      setShowPopup(true);
    }
  };

  const handleImageChange = (index) => {
    // Trigger input click to choose new image
    document.getElementById(`fileInput_${index}`).click();
  };

  const handleNewImageSelection = (index, event) => {
    const imageFile = event.target.files[0];
    const allowedExtensions = ["jpeg", "jpg", "png"];

    if (imageFile && allowedExtensions.includes(imageFile.type.split("/")[1].toLowerCase())) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        Firebase.child("Images").child(uploadedImages[index].key).update({ Path: reader.result })
          .then(() => {
            setAlertMessages(["Image changed successfully!"]);
            setShowPopup(true);
            // Update the uploaded images state after successful image change
            const updatedImages = [...uploadedImages];
            updatedImages[index].Path = reader.result;
            setUploadedImages(updatedImages);
          })
          .catch((error) => {
            console.error("Error changing image:", error);
            setAlertMessages(["Error occurred while changing the image."]);
            setShowPopup(true);
          });
      };
    } else {
      setAlertMessages(["Only jpeg, jpg, and png images are allowed."]);
      setShowPopup(true);
    }
  };

  const handleImageDelete = (index) => {
    const imageKey = uploadedImages[index].key;
    Firebase.child("Images").child(imageKey).remove()
      .then(() => {
        setAlertMessages(["Image deleted successfully!"]);
        setShowPopup(true);
        // Update the uploaded images state after successful image deletion
        const updatedImages = uploadedImages.filter((image, i) => i !== index);
        setUploadedImages(updatedImages);
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
        setAlertMessages(["Error occurred while deleting the image."]);
        setShowPopup(true);
      });
  };

  return (
    <div>
      <AdminHeader />
      <div className="upload-preview-container">
        <div className="content">
          <h5><span>Upload Images For Gallery</span></h5>
          <div className="file-upload-section">
            <label htmlFor="fileInput" className="file-upload-label">Choose Your Image</label>
            <input type="file" id="fileInput" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />} {/* Display image preview */}
            {imageName && <span className="file-name">{imageName}</span>}
          </div>
          <button onClick={handleImageUpload} className="upload-button">Upload</button>
          {showPopup && alertMessages.map((message, index) => (
            <PopupMessage key={index} message={message} closePopup={() => setShowPopup(false)} />
          ))}
        </div>
        <div className="preview-section">
          {showUploadedImages ? (
            <>
              <button onClick={() => setShowUploadedImages(false)}>Hide Uploaded Images</button>
              <h3>Uploaded Images</h3>
              <table className="image-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedImages.map((image, index) => (
                    <tr key={index}>
                      <td><img src={image.Path} alt={`Uploaded Image ${index}`} className="image-thumbnail" /></td>
                      <td>
                        <button onClick={() => handleImageChange(index)} className="image-action-button">Change</button>
                        <input type="file" id={`fileInput_${index}`} onChange={(event) => handleNewImageSelection(index, event)} style={{ display: 'none' }} />
                        <button onClick={() => handleImageDelete(index)} className="image-action-button">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <button onClick={() => setShowUploadedImages(true)}>Show Uploaded Images</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadGallery;
