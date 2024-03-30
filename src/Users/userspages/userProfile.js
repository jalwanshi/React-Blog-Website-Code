import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Firebase from '../../Firebase';
import UserHeader from '../UserHeader';

const UserProfile = () => {
  const { key } = useParams(); // Define 'key' variable using useParams hook
  const [userData, setUserData] = useState(null); // State to store user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle between viewing and editing mode

  useEffect(() => {
    // Fetch user details from Firebase using key
    Firebase.child("ApprovedUsers").child(key).once("value", function(snapshot) {
      const userData = snapshot.val();
      if (userData) {
        setUserData(userData); // Set user data to state
      }
    });
  }, [key]); // Add 'key' to dependency array to re-run useEffect when 'key' changes

  const handleEdit = () => {
    setIsEditing(true); // Set editing mode to true
  };

  const handleSave = () => {
    // Update user data in the user profile being viewed
    Firebase.child("ApprovedUsers").child(key).update(userData);

    // Fetch all users from Firebase
    Firebase.child("users").once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const userKey = childSnapshot.key;
        const userDataFromFirebase = childSnapshot.val();
        // Check if email matches
        if (userDataFromFirebase.email === userData.email) {
          // Update user data in "users" node in Firebase
          Firebase.child("users").child(userKey).update(userData);
        }
      });
    });

    setIsEditing(false); // Set editing mode to false
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div>
      <UserHeader />
      <div className="profile-card">
        {/* Display user profile card */}
        {userData && (
          <div className="card">
            <div className="user-details">
              <label>Username:</label>
              <input type="text" value={userData.username} disabled />
              <label>Email:</label>
              <input type="text" value={userData.email} disabled />
              <label>Password:</label>
              <input type="text" value={userData.password} disabled={!isEditing} name="password" onChange={handleChange} />
              <label>First Name:</label>
              <input type="text" value={userData.firstName} disabled={!isEditing} name="firstName" onChange={handleChange} />
              <label>Last Name:</label>
              <input type="text" value={userData.lastName} disabled={!isEditing} name="lastName" onChange={handleChange} />
              <label>Address:</label>
              <input type="text" value={userData.address} disabled={!isEditing} name="address" onChange={handleChange} />
              <label>City:</label>
              <input type="text" value={userData.city} disabled={!isEditing} name="city" onChange={handleChange} />
              <label>State:</label>
              <input type="text" value={userData.state} disabled={!isEditing} name="state" onChange={handleChange} />
              <label>ZIP:</label>
              <input type="text" value={userData.zip} disabled={!isEditing} name="zip" onChange={handleChange} />
              <label>ID:</label>
              <input type="text" value={key} disabled />
            </div>
          </div>
        )}
      </div>
      <div className="edit-button">
        {!isEditing ? (
          <button onClick={handleEdit}>Edit</button>
        ) : (
          <button onClick={handleSave}>Save</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
