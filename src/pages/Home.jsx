import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';
import { SearchVenues, FilterVenues, SortVenues } from '../components/search and filters';
import { filterVenues, hasActiveFilters, sortVenues } from '../utils/venueFilters.js';

function Home() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels()
      .then(data => {
        setHotels(data);
        setFilteredHotels(data.slice(0, 9)); // Show 9 cards initially
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  // Apply filters and sorting whenever search term, filters, or sort change
  useEffect(() => {
    let result = filterVenues(hotels, searchTerm, filters);
    result = sortVenues(result, sortBy);
    // Set results - show more when searching/filtering, fewer when just browsing
    const maxResults = (searchTerm.trim() || hasActiveFilters(filters)) ? 12 : 9;
    setFilteredHotels(result.slice(0, maxResults));
  }, [hotels, searchTerm, filters, sortBy]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const viewAllResults = () => {
    // If there's an active search, pass it to the venues page via URL
    const params = new URLSearchParams();
    if (searchTerm?.trim()) {
      params.set('search', searchTerm);
    }
    const queryString = params.toString();
    navigate(`/venues${queryString ? `?${queryString}` : ''}`);
  };

  const clearSearchAndFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
    setFilteredHotels(hotels.slice(0, 9));
  };

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  const isFiltering = hasActiveSearch || hasFilters;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Hero Section with Search */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Holidaze</h1>
        <p className="text-xl text-gray-600 mb-8">Find your perfect holiday accommodation</p>
        
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchVenues 
            onSearch={handleSearch}
            placeholder="Search by destination, venue name, or description..."
            initialValue={searchTerm}
          />
          <FilterVenues 
            onFilterChange={handleFilterChange}
            filters={filters}
            onClearFilters={clearSearchAndFilters}
            onSort={handleSort}
            currentSort={sortBy}
          />
          <SortVenues 
            onSort={handleSort}
            currentSort={sortBy}
          />
        </div>
      </div>

      {/* Results Section */}
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
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {isFiltering ? 'Search Results' : 'Featured Venues'}
                </h2>
                {isFiltering && (
                  <p className="text-sm text-gray-600 mt-1">
                    Searching through all {hotels.length} venues
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {isFiltering && (
                  <button
                    onClick={clearSearchAndFilters}
                    className="btn-outline text-sm"
                  >
                    Clear All
                  </button>
                )}
                {filteredHotels.length > 0 && (
                  <button
                    onClick={viewAllResults}
                    className="btn-outline text-sm"
                  >
                    View All Venues →
                  </button>
                )}
              </div>
            </div>

            {/* No Results Message */}
            {isFiltering && filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h3>
                <p className="text-gray-500 mb-6">
                  No venues match your search criteria. Try adjusting your search terms or filters.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearSearchAndFilters}
                    className="btn-outline"
                  >
                    Clear Search & Filters
                  </button>
                  <button
                    onClick={viewAllResults}
                    className="btn-primary"
                  >
                    Browse All Venues
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search Results Count */}
                {isFiltering && filteredHotels.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    Found {filteredHotels.length} venues{filteredHotels.length >= 12 ? ' (showing first 12)' : ''}
                  </div>
                )}

                {/* Venues Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {filteredHotels.map((hotel, idx) => (
                    <HotelCard key={hotel.id || idx} hotelData={hotel} />
                  ))}
                </div>

                {isFiltering && filteredHotels.length >= 12 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Showing first {filteredHotels.length} results
                    </p>
                    <button
                      onClick={viewAllResults}
                      className="btn-primary"
                    >
                      View All Search Results
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