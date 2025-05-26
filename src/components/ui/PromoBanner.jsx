import React from 'react';
import { LoginRegisterButton } from '../auth';

const PromoBanner = ({ 
  title = "Sign in to discover our best prices and unbeatable deals",
  className = "",
  onOpenAuthModal
}) => {
  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <LoginRegisterButton onOpenAuthModal={onOpenAuthModal} />
      </div>
    </div>
  );
};

export default PromoBanner; 