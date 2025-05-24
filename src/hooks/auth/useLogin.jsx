import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

export function useLogin() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (email, password, onSuccess) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return { loginUser, isLoading, error };
} 