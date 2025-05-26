import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth';
import AuthModal from './AuthModal.jsx';

const LoginRegisterButton = ({ 
  className = "bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors",
  text = "Sign Up Now"
}) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // If user is already logged in, don't show the button
  if (user) {
    return null;
  }

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <button
        onClick={() => openAuthModal('register')}
        className={className}
        type="button"
      >
        {text}
      </button>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default LoginRegisterButton; 