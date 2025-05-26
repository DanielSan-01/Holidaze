import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { AuthModal } from '../auth';

function NavMenu() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-semibold">
            Holidaze
          </Link>
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

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'nav-link-active' : ''}`}
              >
                My Profile
              </Link>
              {user?.venueManager && (
                <>
                  <Link 
                    to="/venues/manage" 
                    className={`nav-link ${isActive('/venues/manage') ? 'nav-link-active' : ''}`}
                  >
                    Manage Venues
                  </Link>
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
                  >
                    Admin
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn-primary"
              type="button"
            >
              Login/Register
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
}

export default NavMenu; 