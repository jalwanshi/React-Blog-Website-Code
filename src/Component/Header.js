import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
        <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
        <li className="nav-item"><Link to="/gallery" className="nav-link">Gallery</Link></li>
        <li className="nav-item"><Link to="/video" className="nav-link">Video</Link></li>
        <li className="nav-item dropdown">
          <span className="nav-link">Login ▼</span>
          <ul className="dropdown-content">
            <li><Link to="/admin-login" className="nav-link">Login</Link></li>
            <li><Link to="/user-login" className="nav-link">SignUp</Link></li>
          </ul>
        </li>
        <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
