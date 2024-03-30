import React, { useState } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase'; // Import Firebase

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userKey, setUserKey] = useState(null);
  const [enteredKey, setEnteredKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Reset any previous error message
    setError('');
    setSuccessMessage('');
  };

  const handleKeyChange = (event) => {
    setEnteredKey(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Query Firebase to find the user with the provided email
      const snapshot = await Firebase.child('users').orderByChild('email').equalTo(email).once('value');
      const userData = snapshot.val();

      if (!userData) {
        setError('No user found with this email.');
        return;
      }

      // Get the key of the first user (assuming there's only one user with the same email)
      const userKey = Object.keys(userData)[0];
      setUserKey(userKey);
    } catch (error) {
      console.error('Error retrieving user data:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleKeySubmit = () => {
    // Handle the submission of the entered key
    console.log('Entered Key:', enteredKey);
    // Reset input field
    setEnteredKey('');
  };

  const handleNewPasswordSubmit = async () => {
    try {
      if (!userKey) {
        setError('Please enter a valid key.');
        return;
      }

      // Update the password associated with the key in 'users'
      await Firebase.child(`users/${userKey}`).update({ password: newPassword });

      // Update the password associated with the key in 'ApprovedUsers'
      await Firebase.child(`ApprovedUsers/${userKey}`).update({ password: newPassword });

      setSuccessMessage('Password updated successfully!');
      // Reset input field
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {userKey && (
            <div>
              <p>User found with this email.</p>
              <p>User Key: {userKey}</p>
              <div>
                <label htmlFor="key">Enter Key:</label>
                <input
                  type="text"
                  id="key"
                  value={enteredKey}
                  onChange={handleKeyChange}
                  placeholder="Enter the key"
                />
                
              </div>
              {enteredKey && (
                <div>
                  <label htmlFor="newPassword">Enter your New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder="Enter your new password"
                  />
                  <button type="button" onClick={handleNewPasswordSubmit}>Update Password</button>
                </div>
              )}
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
