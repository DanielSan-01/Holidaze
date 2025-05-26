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
        const errorData = await response.json().catch(() => ({}));
        
        // Provide specific error messages based on status code and API response
        let errorMessage;
        if (response.status === 400) {
          if (errorData.errors && errorData.errors.length > 0) {
            // Use the specific error from the API
            errorMessage = errorData.errors[0].message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = 'Invalid registration data. Please check your information and try again.';
          }
        } else if (response.status === 409) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = errorData.message || `Registration failed. Please try again.`;
        }
        
        throw new Error(errorMessage);
      }
      const data = await response.json();
      console.log('Registration successful:', data);

      const loginResponse = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginResponse.ok) {
        const loginErrorData = await loginResponse.json().catch(() => ({}));
        
        let loginErrorMessage;
        if (loginResponse.status === 401) {
          loginErrorMessage = 'Registration successful, but automatic login failed. Please try logging in manually.';
        } else if (loginResponse.status === 400) {
          loginErrorMessage = loginErrorData.message || 'Registration successful, but automatic login failed. Please try logging in manually.';
        } else {
          loginErrorMessage = 'Registration successful, but automatic login failed. Please try logging in manually.';
        }
        
        throw new Error(loginErrorMessage);
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
        console.warn('Failed to create API key after registration, but registration was successful');
        // Don't throw error here - registration and login were successful
        // API key creation failure shouldn't block the user
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