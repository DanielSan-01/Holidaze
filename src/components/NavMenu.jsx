import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/AuthContext.jsx';
import AuthModal from './AuthModal.jsx';

function NavMenu() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
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

  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-semibold">
            Holidaze
          </Link>
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link to="/venues" className="text-gray-600 hover:text-gray-900">
            Venues
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user?.venueManager && (
                <Link to="/venues/manage" className="text-gray-600 hover:text-gray-900">
                  Manage Venues
                </Link>
              )}
              <Link to="/bookings" className="text-gray-600 hover:text-gray-900">
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="text-gray-600 hover:text-gray-900"
                type="button"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="btn-primary"
                type="button"
              >
                Register
              </button>
            </>
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