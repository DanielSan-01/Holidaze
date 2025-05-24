import React, { useEffect, useState } from 'react';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';

function Venues() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels()
      .then(data => {
        console.log('Fetched hotels:', data);
        setHotels(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Venues</h1>
      <p className="text-gray-600 mb-6 text-center">Browse available venues</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.map((hotel, idx) => (
          <HotelCard key={idx} hotelData={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Venues; 