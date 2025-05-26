import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNav = ({ isActive }) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link 
        to="/venues" 
        className={`nav-link ${isActive('/venues') ? 'nav-link-active' : ''}`}
      >
        Venues
      </Link>
      <Link 
        to="/about" 
        className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
      >
        About us
      </Link>
    </div>
  );
};

export default DesktopNav; 