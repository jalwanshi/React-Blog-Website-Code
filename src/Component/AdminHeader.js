import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <nav className="admin-navbar">
      <ul className="admin-nav-list">
        <li className="admin-nav-item">
          <Link to="/upload-news" className="admin-nav-link">Upload News</Link>
        </li>
        <li className="admin-nav-item">
          <Link to="/upload-gallery" className="admin-nav-link">Upload Gallery</Link>
        </li>
        <li className="admin-nav-item">
          <Link to="/uploadvideo" className="admin-nav-link">Upload Videos</Link>
        </li>
        <li className="admin-nav-item">
          <Link to="/display-contact" className="admin-nav-link">Display Contact</Link>
        </li>
        <li className="admin-nav-item">
          <Link to="/employee-news" className="admin-nav-link">News From Employee</Link>
        </li>
        <li className="admin-nav-item">
          <Link to="/" className="admin-nav-link">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminHeader;
