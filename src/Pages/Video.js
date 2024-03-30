import React, { useEffect, useState } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase';
import '../Component/Video.css';

const Video = () => {
  const [videos, setVideos] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    Firebase.child("Video").on("value", function (snap) {
      if (snap.val() == null) {
        setVideos({});
        setCategories([]);
      } else {
        setVideos(snap.val());
        const uniqueCategories = ['All', ...new Set(Object.values(snap.val()).map(video => video.Category))];
        setCategories(uniqueCategories);
      }
    });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <Header />
    
      <div className='container4'>
        <div className="row4">
          <div className="col-lg-17">
            <nav className="category-nav">
              <ul>
                {categories.map((category, index) => (
                  <li key={index}>
                    <button onClick={() => handleCategoryChange(category)} className={selectedCategory === category ? 'active' : ''}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="row4">
          {Object.keys(videos).map((key) => {
            const video = videos[key];
            if (selectedCategory === 'All' || video.Category === selectedCategory) {
              return (
                <div className="col-lg-47" key={key}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.Url}`}
                  ></iframe>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default Video;
