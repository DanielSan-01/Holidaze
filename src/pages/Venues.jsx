import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import { VenueCard } from '../components/venue';
import { PlaneLoader } from '../components/loader';
import { SearchVenues, FilterVenues, SortVenues } from '../components/search and filters';
import { filterVenues, hasActiveFilters, sortVenues } from '../utils/venueFilters.js';

function Venues() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const loadVenues = async () => {
    setLoading(true);
    try {
      const data = await fetchHotels();
      console.log('Fetched hotels:', data);
      
      setHotels(data);
      setFilteredHotels(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  // Apply filters and sorting whenever search term, filters, sort, or venues change
  useEffect(() => {
    let result = filterVenues(hotels, searchTerm, filters);
    result = sortVenues(result, sortBy);
    setFilteredHotels(result);
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
    setSearchParams({});
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PlaneLoader 
        text="Loading venues..." 
        size={100}
      />
    </div>
  );
  if (error) return <div className="text-red-500">{error}</div>;

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  const isFiltering = hasActiveSearch || hasFilters;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Venues</h1>
      <p className="text-gray-600 mb-6 text-center">Browse available venues</p>
      
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
        onSort={handleSort}
        currentSort={sortBy}
      />
      
      <SortVenues 
        onSort={handleSort}
        currentSort={sortBy}
      />
      
      {/* Results Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {isFiltering && (
            <p className="text-sm text-gray-600">
              {filteredHotels.length === 0 ? 'No venues found' : 
               `Showing ${filteredHotels.length} of ${hotels.length} venues`}
            </p>
          )}
        </div>
        {isFiltering && (
          <button
            onClick={clearAllFilters}
            className="btn-outline text-sm"
          >
            Clear All
          </button>
        )}
      </div>
      
      {filteredHotels.length === 0 && hotels.length > 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel, idx) => (
            <VenueCard key={hotel.id || idx} hotelData={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Venues; 