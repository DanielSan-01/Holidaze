import { useState, useEffect } from 'react';
import { storage } from '../../utils/storage.js';

export const useVenueManagerData = (ownedVenues) => {
  const [venuesWithBookings, setVenuesWithBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ownedVenues && ownedVenues.length > 0) {
      fetchVenuesWithBookings();
    }
  }, [ownedVenues]);

  const fetchVenuesWithBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { accessToken, apiKey } = storage.getAuthData();
      
      // Fetch each venue individually with bookings
      const venuePromises = ownedVenues.map(async (venue) => {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'X-Noroff-API-Key': `${apiKey}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch venue ${venue.id}: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
      });

      const venuesData = await Promise.all(venuePromises);
      setVenuesWithBookings(venuesData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch venues with bookings:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    venuesWithBookings,
    loading,
    error,
    refetch: fetchVenuesWithBookings
  };
}; 