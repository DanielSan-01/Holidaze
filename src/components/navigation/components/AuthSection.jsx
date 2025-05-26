import React from 'react';
import { Link } from 'react-router-dom';

const AuthSection = ({ 
  isAuthenticated, 
  user, 
  isActive, 
  onLogout, 
  onOpenAuthModal, 
  onLinkClick,
  isMobile = false 
}) => {
  const linkClass = isMobile ? 'mobile-nav-link' : 'nav-link';
  const activeLinkClass = isMobile ? 'mobile-nav-link-active' : 'nav-link-active';
  const containerClass = isMobile ? 'flex flex-col space-y-3' : 'hidden md:flex items-center space-x-4';

  if (isAuthenticated) {
    return (
      <div className={containerClass}>
        <Link 
          to="/profile" 
          className={`${linkClass} ${isActive('/profile') ? activeLinkClass : ''}`}
          onClick={isMobile ? onLinkClick : undefined}
        >
          My Profile
        </Link>
        {user?.venueManager && (
          <>
            <Link 
              to="/venues/manage" 
              className={`${linkClass} ${isActive('/venues/manage') ? activeLinkClass : ''}`}
              onClick={isMobile ? onLinkClick : undefined}
            >
              Manage Venues
            </Link>
            <Link 
              to="/admin" 
              className={`${linkClass} ${isActive('/admin') ? activeLinkClass : ''}`}
              onClick={isMobile ? onLinkClick : undefined}
            >
              Admin
            </Link>
          </>
        )}
        <button
          onClick={onLogout}
          className={isMobile 
            ? "mobile-nav-link text-left text-red-600 hover:text-red-800 hover:bg-red-50"
            : "text-gray-600 hover:text-gray-900"
          }
          type="button"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <button
        onClick={() => onOpenAuthModal('login')}
        className={isMobile 
          ? "mobile-nav-link text-left bg-blue-600 text-white hover:bg-blue-700"
          : "btn-primary"
        }
        type="button"
      >
        Login/Register
      </button>
    </div>
  );
};

export default AuthSection; 