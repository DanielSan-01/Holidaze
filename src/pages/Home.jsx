import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels()
      .then(data => {
        setHotels(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  const viewAllVenues = () => {
    navigate('/venues');
  };

  // Show first 9 venues as featured
  const featuredVenues = hotels.slice(0, 9);

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Holidaze</h1>
        <p className="text-xl text-gray-600 mb-8">Find your perfect holiday accommodation</p>
      </div>

      {/* Featured Venues Section */}
      <div className="px-4">
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading venues...</div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        )}
        
        {!loading && !error && featuredVenues.length > 0 && (
          <>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Featured Venues</h2>
            </div>

            {/* Venues Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {featuredVenues.map((hotel, idx) => (
                <HotelCard key={hotel.id || idx} hotelData={hotel} />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Discover {hotels.length - featuredVenues.length}+ more amazing venues
              </p>
              <button
                onClick={viewAllVenues}
                className="btn-primary"
              >
                Browse All Venues
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home; 