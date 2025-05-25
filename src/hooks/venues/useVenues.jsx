import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { storage } from '../../utils/storage.js';

export const useVenues = () => {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVenues = async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (options._owner) queryParams.append('_owner', 'true');
      if (options._bookings) queryParams.append('_bookings', 'true');
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.page) queryParams.append('page', options.page);
      
      const queryString = queryParams.toString();
      const url = `https://v2.api.noroff.dev/holidaze/venues${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched venues:', data.data);
      setVenues(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch venues', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const fetchVenue = async (id, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (options._owner) queryParams.append('_owner', 'true');
      if (options._bookings) queryParams.append('_bookings', 'true');
      
      const queryString = queryParams.toString();
      const url = `https://v2.api.noroff.dev/holidaze/venues/${id}${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched venue:', data.data);
      setVenue(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const createVenue = async (venueData) => {
    setLoading(true);
    setError(null);
    
    console.log('Auth data check for venue creation:', {
      hasUser: !!user,
      hasCompleteAuth: storage.hasCompleteAuth(),
      userName: user?.name
    });
    
    if (!storage.hasCompleteAuth() || !user?.name) {
      const authData = storage.getAuthData();
      const missingItems = [];
      if (!authData.user) missingItems.push('user data');
      if (!authData.accessToken) missingItems.push('access token');
      if (!authData.apiKey) missingItems.push('API key');
      if (!user?.name) missingItems.push('user name from context');
      
      const errorMsg = `Missing: ${missingItems.join(', ')}. Please try logging out and logging in again.`;
      console.error('Venue creation failed:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();

      const res = await fetch('https://v2.api.noroff.dev/holidaze/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
        body: JSON.stringify(venueData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Create venue error:', errorData.errors);
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Created venue:', data.data);
      setVenues(prev => [...prev, data.data]);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to create venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const updateVenue = async (id, venueData) => {
    setLoading(true);
    setError(null);
    
    if (!storage.hasCompleteAuth() || !user) {
      setError('Missing access token, API key, or user information');
      setLoading(false);
      throw new Error('Authentication required');
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
        body: JSON.stringify(venueData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Update venue error:', errorData.errors);
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Updated venue:', data.data);
      setVenues(prev => prev.map(venue => venue.id === id ? data.data : venue));
      setVenue(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to update venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const deleteVenue = async (id) => {
    setLoading(true);
    setError(null);
    
    if (!storage.hasCompleteAuth() || !user) {
      setError('Missing access token, API key, or user information');
      setLoading(false);
      throw new Error('Authentication required');
    }

    try {
      const { accessToken, apiKey } = storage.getAuthData();

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Delete venue error:', errorData.errors);
        throw new Error(errorData.errors?.[0]?.message || `HTTP error! status: ${res.status}`);
      }

      console.log('Deleted venue with id:', id);
      setVenues(prev => prev.filter(venue => venue.id !== id));
      setLoading(false);
    } catch (error) {
      console.error('Failed to delete venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const searchVenues = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${encodeURIComponent(query)}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Search results:', data.data);
      setVenues(data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('Failed to search venues', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    venues,
    venue,
    loading,
    error,
    fetchVenues,
    fetchVenue,
    createVenue,
    updateVenue,
    deleteVenue,
    searchVenues,
    setVenues,
    setVenue,
    setError,
  };
}; 