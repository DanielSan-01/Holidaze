import { useState } from 'react';
import { useAuth } from '../auth';
import { storage } from '../../utils/storage.js';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async (name, options = {}) => {
    setLoading(true);
    setError(null);
    
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
        const errorData = await res.json().catch(() => ({}));
        
        let errorMessage;
        if (res.status === 404) {
          errorMessage = 'Profile not found. Please check the username and try again.';
        } else if (res.status === 401) {
          errorMessage = 'You are not authorized to view this profile. Please log in again.';
        } else if (res.status === 403) {
          errorMessage = 'You do not have permission to access this profile.';
        } else if (res.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = errorData.message || 'Failed to load profile. Please try again.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('Fetched profile:', data.data);
      console.log('🔍 Profile API Debug:', {
        profileName: data.data?.name,
        venueManager: data.data?.venueManager,
        venuesCount: data.data?.venues?.length || 0,
        venues: data.data?.venues?.map(v => ({
          id: v.id,
          name: v.name,
          ownerName: v.owner?.name
        })) || [],
        bookingsCount: data.data?.bookings?.length || 0
      });
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
        const errorData = await res.json().catch(() => ({})); 
        console.log('Error:', errorData.errors);
        
        let errorMessage;
        if (res.status === 400) {
          if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].message;
          } else {
            errorMessage = 'Invalid profile data. Please check your information and try again.';
          }
        } else if (res.status === 401) {
          errorMessage = 'You are not authorized to update this profile. Please log in again.';
        } else if (res.status === 403) {
          errorMessage = 'You do not have permission to update this profile.';
        } else if (res.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = errorData.message || 'Failed to update profile. Please try again.';
        }
        
        throw new Error(errorMessage);
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
        const errorData = await res.json().catch(() => ({}));
        
        let errorMessage;
        if (res.status === 401) {
          errorMessage = 'You are not authorized to view profiles. Please log in again.';
        } else if (res.status === 403) {
          errorMessage = 'You do not have permission to access this resource.';
        } else if (res.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = errorData.message || 'Failed to load profiles. Please try again.';
        }
        
        throw new Error(errorMessage);
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