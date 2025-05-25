import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';
import { SearchVenues, FilterVenues } from '../components/search and filters';
import { filterVenues, hasActiveFilters } from '../utils/venueFilters.js';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels()
      .then(data => {
        setHotels(data);
        setFilteredHotels(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  // Apply filters whenever search term, filters, or venues change
  useEffect(() => {
    const result = filterVenues(hotels, searchTerm, filters);
    setFilteredHotels(result);
  }, [hotels, searchTerm, filters]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSearchParams({});
  };

  const viewAllVenues = () => {
    navigate('/venues');
  };

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  const isFiltering = hasActiveSearch || hasFilters;

  // Show filtered results if searching/filtering, otherwise show first 9 as featured
  const displayVenues = isFiltering ? filteredHotels : hotels.slice(0, 9);

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Holidaze</h1>
        <p className="text-xl text-gray-600 mb-8">Find your perfect holiday accommodation</p>
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 mb-8">
        <SearchVenues 
          onSearch={handleSearch}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          placeholder="Search venues by name, location, or description..."
          initialValue={searchTerm}
        />
        
        <FilterVenues 
          onFilterChange={handleFilterChange}
          filters={filters}
          onClearFilters={clearAllFilters}
        />

        {/* Results Header */}
        {isFiltering && (
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {filteredHotels.length === 0 ? 'No venues found' : 
                 `Showing ${filteredHotels.length} of ${hotels.length} venues`}
              </p>
            </div>
            <button
              onClick={clearAllFilters}
              className="btn-outline text-sm"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Venues Section */}
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
        
        {!loading && !error && (
          <>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {isFiltering ? 'Search Results' : 'Featured Venues'}
              </h2>
            </div>

            {/* No Results Message */}
            {isFiltering && filteredHotels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No venues found matching your search criteria.</p>
                <p className="text-gray-400 text-sm mt-2 mb-4">Try adjusting your search terms or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary"
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <>
                {/* Venues Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {displayVenues.map((hotel, idx) => (
                    <HotelCard key={hotel.id || idx} hotelData={hotel} />
                  ))}
                </div>

                {/* Call to Action - only show if not filtering */}
                {!isFiltering && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Discover {hotels.length - displayVenues.length}+ more amazing venues
                    </p>
                    <button
                      onClick={viewAllVenues}
                      className="btn-primary"
                    >
                      Browse All Venues
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home; 