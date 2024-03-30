import React, { useState } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase'; // Import Firebase
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === 'Admin' && password === 'Admin123') {
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/upload-news');
      }, 1000);
      return;
    }

    const usersRef = Firebase.child('ApprovedUsers'); // Change to ApprovedUsers
    usersRef.once('value', (snapshot) => {
      const approvedUsers = snapshot.val();

      if (!approvedUsers) {
        setError('Wait for admin approval');
        return;
      }

      // Check if the entered username exists in approved users
      const userKeys = Object.keys(approvedUsers);
      const userKey = userKeys.find((key) => approvedUsers[key].username === username);

      if (!userKey || approvedUsers[userKey].password !== password) {
        setError('Invalid username or password');
        return;
      }

      setLoginSuccess(true);
      setTimeout(() => {
        navigate(`/sendNews/${userKey}`);
      }, 1000);
    });
  };

  const handleForgotPassword = () => {
    // Add code to handle forgot password functionality
    // Redirect user to a page to reset password or send password reset email
    // For demonstration purposes, let's navigate to a hypothetical ForgotPassword page
    navigate('/forgot-password');
  };

  return (
    <div>
      <Header />
      <div className="user-login-form">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loginSuccess && <p style={{ color: 'green' }}>Login Successful</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={handlePasswordChange} />
          </div>
        
          <button type="submit">Login</button>
          <div className="forgot-password-container">
            <span className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
