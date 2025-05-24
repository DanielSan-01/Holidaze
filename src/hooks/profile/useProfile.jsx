import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { storage } from '../../utils/storage.js';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async (name, options = {}) => {
    setLoading(true);
    setError(null);
    
    if (!storage.hasCompleteAuth() || !user?.name) {
      setError('Missing access token, API key, or user information');
      setLoading(false);
      return;
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();
      
      const queryParams = new URLSearchParams();
      if (options._bookings) queryParams.append('_bookings', 'true');
      if (options._venues) queryParams.append('_venues', 'true');
      
      const queryString = queryParams.toString();
      const url = `https://v2.api.noroff.dev/holidaze/profiles/${name}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched profile:', data.data);
      setProfile(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile data', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const updateProfile = async (name, updatedProfile) => {
    setLoading(true);
    setError(null);
    
    if (!storage.hasCompleteAuth() || !user) {
      setError('Missing access token, API key, or user information');
      setLoading(false);
      return;
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${name}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!res.ok) {
        const errorData = await res.json(); 
        console.log('Error:', errorData.errors);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProfile(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to update profile data', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const fetchAllProfiles = async () => {
    setLoading(true);
    setError(null);
    
    if (!storage.hasCompleteAuth()) {
      setError('Missing access token or API key');
      setLoading(false);
      return;
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();

      const res = await fetch('https://v2.api.noroff.dev/holidaze/profiles', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch all profiles', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchAllProfiles,
    setProfile,
    setError,
  };
}; 