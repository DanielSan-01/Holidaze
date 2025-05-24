import { useState } from 'react';
import { storage } from '../../utils/storage.js';

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (email, password, name, bio, avatar, banner, venueManager) => {
    const url = 'https://v2.api.noroff.dev/auth/register';
    const payload = { email, password, name, bio, avatar, banner, venueManager };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    try {
      setIsSubmitting(true);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Registration successful:', data);

      const loginResponse = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        throw new Error(`HTTP error! status: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      storage.setUser(loginData.data);
      storage.setAccessToken(loginData.data.accessToken);

      const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.data.accessToken}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!apiKeyResponse.ok) {
        throw new Error(`HTTP error! status: ${apiKeyResponse.status}`);
      }

      const apiKeyData = await apiKeyResponse.json();
      console.log('API key created:', apiKeyData);
      storage.setApiKey(apiKeyData.data.key);

      // Dispatch custom event to notify AuthContext to sync
      window.dispatchEvent(new CustomEvent('auth-state-changed'));

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, isSubmitting };
} 