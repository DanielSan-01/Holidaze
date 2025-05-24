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
      throw new Error(err.message || 'Failed to login');
    }
    const data = await res.json();
    storage.setUser(data.data);
    storage.setAccessToken(data.data.accessToken);
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