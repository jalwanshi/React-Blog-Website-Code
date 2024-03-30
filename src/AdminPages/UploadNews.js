import React, { useState } from 'react';
import AdminHeader from '../Component/AdminHeader';
import '../Component/Style.css'; // CSS file ka import
import firebase from '../Firebase'; // Import path update karna hoga

const UploadNews = () => {
  const initialFormData = {
    title: "",
    category: "",
    dateTime: "",
    location: "",
    source: "",
    author: "",
    content: "",
    tags: "",
    contactInfo: "",
    additionalComments: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title !== "" && formData.content !== "") {
      firebase.child("TodayNews").push(formData); // unique key ke saath push karna
      setFormData(initialFormData); // Form reset karne ke liye
    } else {
      alert("Koi field khali nahi hona chahiye");
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="upload-news-container">
        <h2>Upload News</h2>
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

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UploadNews;
