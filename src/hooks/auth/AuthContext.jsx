import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Listen for localStorage changes (from registration)
  const syncUserFromStorage = useCallback(() => {
    const stored = localStorage.getItem('user');
    const newUser = stored ? JSON.parse(stored) : null;
    if (JSON.stringify(newUser) !== JSON.stringify(user)) {
      setUser(newUser);
    }
  }, [user]);

  // Check for user updates from registration
  React.useEffect(() => {
    const interval = setInterval(syncUserFromStorage, 1000);
    return () => clearInterval(interval);
  }, [syncUserFromStorage]);

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
    localStorage.setItem('user', JSON.stringify(data.data));
    localStorage.setItem('accessToken', data.data.accessToken);
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
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 