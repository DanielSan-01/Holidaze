import React from 'react';
import { Link } from 'react-router-dom';
import AuthSection from './AuthSection';

const MobileMenu = ({ 
  isOpen, 
  isActive, 
  onLinkClick, 
  isAuthenticated, 
  user, 
  onLogout, 
  onOpenAuthModal 
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
      <div className="flex flex-col space-y-3 pt-4">
        {/* Navigation Links */}
        <Link 
          to="/venues" 
          className={`mobile-nav-link ${isActive('/venues') ? 'mobile-nav-link-active' : ''}`}
          onClick={onLinkClick}
        >
          Venues
        </Link>
        <Link 
          to="/about" 
          className={`mobile-nav-link ${isActive('/about') ? 'mobile-nav-link-active' : ''}`}
          onClick={onLinkClick}
        >
          About us
        </Link>

        {/* Auth Section */}
        <AuthSection
          isAuthenticated={isAuthenticated}
          user={user}
          isActive={isActive}
          onLogout={onLogout}
          onOpenAuthModal={onOpenAuthModal}
          onLinkClick={onLinkClick}
          isMobile={true}
        />
      </div>
    </div>
  );
};

export default MobileMenu; 