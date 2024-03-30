import React, { useState, useEffect } from 'react';
import Header from '../Component/Header';
import Firebase from '../Firebase'; // Update Firebase import path
import '../Component/Header.css';

function Home() {
  const [newsTitles, setNewsTitles] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newsRef = Firebase.child('TodayNews');
    newsRef.on('value', (snapshot) => {
      const newsData = snapshot.val();
      if (newsData) {
        const titles = Object.values(newsData).map(newsItem => newsItem.title);
        setNewsTitles(titles);
        setLoading(false);
      } else {
        setError('No news available');
        setLoading(false);
      }
    });

    return () => {
      newsRef.off('value');
    };
  }, []);

  const handleTitleClick = (title) => {
    const newsRef = Firebase.child('TodayNews');
    newsRef.once('value', (snapshot) => {
      const newsData = snapshot.val();
      if (newsData) {
        const selectedNewsItem = Object.values(newsData).find(newsItem => newsItem.title === title);
        // Toggle selected news
        setSelectedNews(prevSelectedNews => {
          if (prevSelectedNews && prevSelectedNews.title === selectedNewsItem.title) {
            return null; // Deselect if already selected
          } else {
            return selectedNewsItem; // Otherwise select news
          }
        });
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        {loading ? (
          <p className="home-loading">Loading...</p>
        ) : error ? (
          <p className="home-error">{error}</p>
        ) : (
          <div className="news-list">
            {newsTitles.map((title, index) => (
              <a key={index} onClick={() => handleTitleClick(title)} href="#" className="news-item"> {/* Change to anchor tag */}
                <h3 className="news-title">{title}</h3>
              </a>
            ))}
          </div>
        )}
      </div>
      {selectedNews && (
        <div className="selected-news">
          <h2 className="selected-news-title">{selectedNews.title}</h2>
          <p className="selected-news-info"><strong>Category:</strong> {selectedNews.category}</p>
          <p className="selected-news-info"><strong>Date and Time:</strong> {selectedNews.dateTime}</p>
          <p className="selected-news-info"><strong>Location:</strong> {selectedNews.location}</p>
          <p className="selected-news-info"><strong>Source:</strong> {selectedNews.source}</p>
          <p className="selected-news-info"><strong>Author:</strong> {selectedNews.author}</p>
          <p className="selected-news-info"><strong>Tags/Keywords:</strong> {selectedNews.tags}</p>
          <p className="selected-news-info"><strong>Contact Information:</strong> {selectedNews.contactInfo}</p>
          <p className="selected-news-content"><strong>Content:</strong> {selectedNews.content}</p>
          <p className="selected-news-content"><strong>Additional Comments:</strong> {selectedNews.additionalComments}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
