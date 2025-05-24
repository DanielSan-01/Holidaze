import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export function useRegister() {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = async (email, password, name, bio, avatar, banner, venueManager) => {
    setIsSubmitting(true);
    try {
      await register(email, password, name, bio, avatar, banner, venueManager);
    } catch (error) {
      setIsSubmitting(false);
      throw error;
    }
    setIsSubmitting(false);
  };

  return { registerUser, isSubmitting };
} 