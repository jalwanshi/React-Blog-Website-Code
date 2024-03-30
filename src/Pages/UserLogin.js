import React, { useState } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase'; // Assuming Firebase.js is in the src directory

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState(''); // New state for the message

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the username is already taken
    Firebase.child('users').orderByChild('username').equalTo(formData.username).once('value', snapshot => {
      if (snapshot.exists()) {
        setUsernameError('Username is already taken.');
        setMessage(''); // Clear any previous message
      } else {
        setUsernameError('');
        // Check if the email is already taken
        Firebase.child('users').orderByChild('email').equalTo(formData.email).once('value', snapshot => {
          if (snapshot.exists()) {
            setEmailError('Email is already registered.');
            setMessage(''); // Clear any previous message
          } else {
            setEmailError('');
            // Push form data to Firebase
            Firebase.child('users').push(formData)
              .then(() => {
                console.log('Form Data:', formData);
                setMessage('Data submitted successfully, Wait for Admin Approvel.'); // Set success message
                // Clear form after submission
                setFormData({
                  username: '',
                  password: '',
                  email: '',
                  firstName: '',
                  lastName: '',
                  address: '',
                  city: '',
                  state: '',
                  zip: ''
                });
              })
              .catch((error) => {
                console.error('Error saving to Firebase:', error);
                setMessage('Failed to submit data. Please try again later.'); // Set error message
              });
          }
        });
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="user-login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            {usernameError && <p className="error-message">{usernameError}</p>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="city">City:</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="state">State:</label>
            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="zip">Zip Code:</label>
            <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
          </div>
          {/* Display message */}
          {message && <p className="message">{message}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
