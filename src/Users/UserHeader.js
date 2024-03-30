import React, { useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import Firebase from '../Firebase';

const UserHeader = () => {
  const { key } = useParams(); 
  useEffect(() => { 
    console.log('Key:', key); // Check the value of key
    Firebase.child("ApprovedUsers").child(key).on("value", function(snapshot) {
      console.log(snapshot.val());
    });
  }, [key]); 

  const handleLogout = () => {
    console.log("User Logged out");
  };

  return (
    <div>
      <header id="user-header"> 
        <nav>
          <ul>
            <li><Link to={`/sendNews/${key}`}>Send News</Link></li> 
            <li><Link to={`/userProfile/${key}`}>Profile</Link></li> 
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default UserHeader;
