import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import HotelCard from '../components/HotelCard.jsx';
import { SearchBar, SearchFilters } from '../components/search';

function Venues() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchHotels()
      .then(data => {
        console.log('Fetched hotels:', data);
        setHotels(data);
        setFilteredHotels(data);
        setLoading(false);
        
        // Initialize search from URL params after data is loaded
        const urlSearch = searchParams.get('search');
        if (urlSearch) {
          setSearchTerm(urlSearch);
          applyFiltersAndSearch(urlSearch, {});
        }
      })
      .catch(err => {
        setError('Failed to fetch hotels');
        setLoading(false);
      });
  }, []);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    applyFiltersAndSearch(newSearchTerm, filters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (newSearchTerm.trim()) {
      newParams.set('search', newSearchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFiltersAndSearch(searchTerm, newFilters);
  };

  const applyFiltersAndSearch = (currentSearchTerm, filterOptions) => {
    let filtered = [...hotels];

    // Apply search filter
    if (currentSearchTerm && currentSearchTerm.trim()) {
      const searchLower = currentSearchTerm.toLowerCase();
      filtered = filtered.filter(hotel => 
        hotel.name?.toLowerCase().includes(searchLower) ||
        hotel.description?.toLowerCase().includes(searchLower) ||
        hotel.location?.city?.toLowerCase().includes(searchLower) ||
        hotel.location?.country?.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filters
    if (filterOptions.minPrice) {
      filtered = filtered.filter(hotel => hotel.price >= parseFloat(filterOptions.minPrice));
    }
    if (filterOptions.maxPrice) {
      filtered = filtered.filter(hotel => hotel.price <= parseFloat(filterOptions.maxPrice));
    }

    // Apply guest filter
    if (filterOptions.maxGuests) {
      filtered = filtered.filter(hotel => hotel.maxGuests >= parseInt(filterOptions.maxGuests));
    }

    // Apply amenity filters
    if (filterOptions.wifi) {
      filtered = filtered.filter(hotel => hotel.meta?.wifi);
    }
    if (filterOptions.parking) {
      filtered = filtered.filter(hotel => hotel.meta?.parking);
    }
    if (filterOptions.breakfast) {
      filtered = filtered.filter(hotel => hotel.meta?.breakfast);
    }
    if (filterOptions.pets) {
      filtered = filtered.filter(hotel => hotel.meta?.pets);
    }

    setFilteredHotels(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setFilteredHotels(hotels);
    setSearchParams({});
  };

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== false);
  const isFiltering = hasActiveSearch || hasActiveFilters;

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Venues</h1>
      <p className="text-gray-600 mb-6 text-center">Browse available venues</p>
      
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search venues by name, location, or description..."
        initialValue={searchTerm}
      />
      <SearchFilters onFilterChange={handleFilterChange} filters={filters} />
      
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
            <HotelCard key={hotel.id || idx} hotelData={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Venues; 