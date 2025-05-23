import React, { useEffect, useState } from 'react';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels()
      .then(data => {
        setHotels(data.slice(0, 9)); // Only show 9 cards
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Holidaze</h1>
      <p className="text-xl text-gray-600 mb-8">Find your perfect holiday accommodation</p>
      {loading && <div>Loading venues...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => (
            <HotelCard key={idx} hotelData={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home; 