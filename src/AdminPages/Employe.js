import React, { useState, useEffect } from 'react';
import AdminHeader from '../Component/AdminHeader';
import Firebase from '../Firebase';

const Employee = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await Firebase.child('SendNewsFromWorker').once('value');
        const news = snapshot.val();
        if (news) {
          const newsArray = Object.entries(news).map(([key, value]) => ({ key, ...value }));
          setNewsData(newsArray);
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (index) => {
    try {
      const newsKey = newsData[index].key; // Get the key of the news entry
      const newsItem = newsData[index]; // Get the news item to be moved
      await Firebase.child(`SendNewsFromWorker/${newsKey}`).remove(); // Remove the news from the current location
  
      // Add the news to the "TodayNews" key
      await Firebase.child('TodayNews').push(newsItem);
  
      console.log('News approved and moved to TodayNews:', newsItem);
      // Update local state to remove the approved entry
      setNewsData((prevNewsData) => prevNewsData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error approving news:', error);
    }
  };
  

  const handleDelete = async (index) => {
    try {
      const newsKey = newsData[index].key; // Get the key of the news entry
      await Firebase.child(`SendNewsFromWorker/${newsKey}`).remove(); // Delete the entry from Firebase
      console.log('News entry deleted successfully from Firebase');
      // Update local state to remove the deleted entry
      setNewsData((prevNewsData) => prevNewsData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting news entry:', error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <h2>Employee News</h2>
      <h3>News Sent by Workers</h3>
      <div className="table-container">
        <table className="news-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Title</th>
              <th>Category</th>
              <th>Date and Time</th>
              <th>Location</th>
              <th>Source</th>
              <th>Author</th>
              <th>Tags/Keywords</th>
              <th>Contact Information</th>
              <th>Content</th>
              <th>Additional Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsData.map((news, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{news.title}</td>
                <td>{news.category}</td>
                <td>{news.dateTime}</td>
                <td>{news.location}</td>
                <td>{news.source}</td>
                <td>{news.author}</td>
                <td>{news.tags}</td>
                <td>{news.contactInfo}</td>
                <td>{news.content}</td>
                <td>{news.additionalComments}</td>
                <td>
                <button className='button3' onClick={() => handleApprove(index)}>Approve</button>
                <button className='button4' onClick={() => handleDelete(index)}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
