import React from 'react';
import { useAuth } from '../../hooks/auth';

const LoginRegisterButton = ({ 
  className = "bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors",
  text = "Sign Up Now",
  onOpenAuthModal
}) => {
  const { user } = useAuth();

  // If user is already logged in, don't show the button
  if (user) {
    return null;
  }

  return (
    <button
      onClick={() => onOpenAuthModal('register')}
      className={className}
      type="button"
    >
      {text}
    </button>
  );
};

export default LoginRegisterButton; 