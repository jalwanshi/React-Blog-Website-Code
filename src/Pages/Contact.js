import React, { useState } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase'; // Update Firebase import path
import '../Component/Style.css'; // Importing the CSS file for styling

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Save form data to Firebase
    const enquiryRef = Firebase.child('Enquiry');
    enquiryRef.push(formData)
      .then(() => {
        console.log('Form data saved successfully.');
        // Show success popup and clear form data
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        // Close the success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      })
      .catch(error => {
        console.error('Error saving form data:', error);
        // Show error popup
        setShowErrorPopup(true);
      });
  };

  return (
    <div>
      <Header />
      <div className="contact-form-container">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
      {showSuccessPopup && <div className="popup success-popup">Your data has been successfully submitted.</div>}
      {showErrorPopup && <div className="popup error-popup">An error occurred while submitting the form. Please try again later.</div>}
    </div>
  );
};

export default Contact;
