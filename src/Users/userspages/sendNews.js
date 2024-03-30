import React, { useEffect, useState } from 'react';
import UserHeader from '../UserHeader'; // UserHeader component import
import Firebase from '../../Firebase';
import { useParams } from 'react-router-dom';

const SendNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    dateTime: '',
    location: '',
    source: '',
    author: '',
    tags: '',
    contactInfo: '',
    content: '',
    additionalComments: ''
  });
  
const {key}=useParams()
useEffect(function()

{
  Firebase.child("ApprovedUsers").child(key).on("value", function(snapshot) {
  
    console.log(snapshot.val());
  });

},[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     // Check if any field is empty
  for (const key in formData) {
    if (formData[key].trim() === '') {
      alert(`Please fill in the ${key} field`);
      return; // Prevent form submission if any field is empty
    }
  }
    
    // Save form data to Firebase with a unique ID
    const newsRef = Firebase.child('SendNewsFromWorker').push(); // Generate a unique key
    const newsId = newsRef.key; // Get the unique ID
    
    Firebase.child(`SendNewsFromWorker/${newsId}`).set(formData) // Save form data with the unique ID
      .then(() => {
        console.log('Form data saved successfully');
        // Clear form data after submission
        setFormData({
          title: '',
          category: '',
          dateTime: '',
          location: '',
          source: '',
          author: '',
          tags: '',
          contactInfo: '',
          content: '',
          additionalComments: ''
        });
        // Show alert
        alert('News sent to Admin');
      })
      .catch((error) => {
        console.error('Error saving form data:', error);
      });
  };
  
  return (
    <div>
      <UserHeader/>
      <div className="upload-news-container">
        <h2>Send News to Admin</h2>
        <form onSubmit={handleSubmit} className="upload-news-form">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />

          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} />

          <label>Date and Time:</label>
          <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} />

          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />

          <label>Source:</label>
          <input type="text" name="source" value={formData.source} onChange={handleChange} />

          <label>Author:</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} />

          <label>Tags/Keywords:</label>
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} />

          <label>Contact Information:</label>
          <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />

          <label>Content:</label>
          <textarea name="content" value={formData.content} onChange={handleChange} />

          <label>Additional Comments:</label>
          <textarea name="additionalComments" value={formData.additionalComments} onChange={handleChange} />

          <button type="submit">Sent</button>
        </form>
      </div>
    </div>
  );
};

export default SendNews;
