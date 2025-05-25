import { useState } from 'react';

export const useEditVenue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateVenue = async (venueId, venueData) => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');

      console.log('🔄 Updating venue:', venueId, venueData);

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        },
        body: JSON.stringify(venueData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('❌ Failed to update venue', data);
        throw new Error(data.errors?.map(error => error.message).join(', ') || 'Failed to update venue');
      }

      console.log('✅ Successfully updated venue:', data.data);
      setLoading(false);
      return data.data;
    } catch (error) {
      console.error('❌ Failed to update venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const deleteVenue = async (venueId) => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');

      console.log('🗑️ Deleting venue:', venueId);

      const res = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': `${apiKey}`,
        }
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('❌ Failed to delete venue', data);
        throw new Error(data.errors?.map(error => error.message).join(', ') || 'Failed to delete venue');
      }

      console.log('✅ Successfully deleted venue');
      setLoading(false);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete venue', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    updateVenue,
    deleteVenue,
    loading,
    error
  };
}; 