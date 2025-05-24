import React, { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../../utils/storage.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());

  // Method to manually sync user state (called after registration)
  const syncUserState = useCallback(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
  }, []);

  // Listen for auth state changes (from registration)
  React.useEffect(() => {
    const handleAuthChange = () => {
      syncUserState();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, [syncUserState]);

  const login = useCallback(async (email, password) => {
    const res = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      
      // Provide more specific error messages based on status code
      let errorMessage;
      if (res.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (res.status === 400) {
        errorMessage = err.message || 'Invalid email or password format.';
      } else if (res.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = err.message || 'Failed to login. Please try again.';
      }
      
      throw new Error(errorMessage);
    }
    const data = await res.json();
    storage.setUser(data.data);
    storage.setAccessToken(data.data.accessToken);
    
    // Create API key after successful login
    try {
      const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.data.accessToken}`,
        },
        body: JSON.stringify({ name: data.data.name }),
      });

      if (apiKeyResponse.ok) {
        const apiKeyData = await apiKeyResponse.json();
        storage.setApiKey(apiKeyData.data.key);
        console.log('API key created during login:', apiKeyData.data.key);
      } else {
        console.warn('Failed to create API key during login, but login was successful');
      }
    } catch (apiError) {
      console.warn('API key creation failed during login:', apiError.message);
      // Don't throw error here - login was successful even if API key creation failed
    }
    
    setUser(data.data);
    return data;
  }, []);

  const register = useCallback(async (email, password, name, bio, avatar, banner, venueManager) => {
    const url = 'https://v2.api.noroff.dev/auth/register';
    const payload = { email, password, name, bio, avatar, banner, venueManager };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Auto-login after registration
    await login(email, password);
    return data;
  }, [login]);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, syncUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 