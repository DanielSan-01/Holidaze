import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchHotels } from '../api/hotelApi.js';
import { VenueCard } from '../components/venue';
import { PlaneLoader } from '../components/loader';
import { SearchVenues, FilterVenues, SortVenues } from '../components/search and filters';
import { filterVenues, hasActiveFilters, sortVenues } from '../utils/venueFilters.js';
import BackToTopButton from '../components/ui/BackToTopButton.jsx';

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

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = {};
    
    // Check for amenity filters in URL
    if (searchParams.get('wifi') === 'true') urlFilters.wifi = true;
    if (searchParams.get('parking') === 'true') urlFilters.parking = true;
    if (searchParams.get('breakfast') === 'true') urlFilters.breakfast = true;
    if (searchParams.get('pets') === 'true') urlFilters.pets = true;
    
    // Check for other filters
    if (searchParams.get('minPrice')) urlFilters.minPrice = searchParams.get('minPrice');
    if (searchParams.get('maxPrice')) urlFilters.maxPrice = searchParams.get('maxPrice');
    if (searchParams.get('maxGuests')) urlFilters.maxGuests = searchParams.get('maxGuests');
    if (searchParams.get('minRating')) urlFilters.minRating = searchParams.get('minRating');
    if (searchParams.get('checkIn')) urlFilters.checkIn = searchParams.get('checkIn');
    if (searchParams.get('checkOut')) urlFilters.checkOut = searchParams.get('checkOut');
    
    // Check for search term
    if (searchParams.get('search')) setSearchTerm(searchParams.get('search'));
    
    // Check for sort
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort'));
    
    // Apply filters if any exist
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  // Apply filters and sorting whenever search term, filters, sort, or venues change
  useEffect(() => {
    let result = filterVenues(hotels, searchTerm, filters);
    result = sortVenues(result, sortBy);
    setFilteredHotels(result);
  }, [hotels, searchTerm, filters, sortBy]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchTerm) {
      newSearchParams.set('search', newSearchTerm);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL parameters to reflect current filters
    const newSearchParams = new URLSearchParams();
    
    // Add amenity filters
    if (newFilters.wifi) newSearchParams.set('wifi', 'true');
    if (newFilters.parking) newSearchParams.set('parking', 'true');
    if (newFilters.breakfast) newSearchParams.set('breakfast', 'true');
    if (newFilters.pets) newSearchParams.set('pets', 'true');
    
    // Add other filters
    if (newFilters.minPrice) newSearchParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) newSearchParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.maxGuests) newSearchParams.set('maxGuests', newFilters.maxGuests);
    if (newFilters.minRating) newSearchParams.set('minRating', newFilters.minRating);
    if (newFilters.checkIn) newSearchParams.set('checkIn', newFilters.checkIn);
    if (newFilters.checkOut) newSearchParams.set('checkOut', newFilters.checkOut);
    
    // Add search term if exists
    if (searchTerm) newSearchParams.set('search', searchTerm);
    
    // Add sort if exists
    if (sortBy) newSearchParams.set('sort', sortBy);
    
    setSearchParams(newSearchParams);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSortBy) {
      newSearchParams.set('sort', newSortBy);
    } else {
      newSearchParams.delete('sort');
    }
    setSearchParams(newSearchParams);
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
  
  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center">
        <div className="text-red-600 text-lg font-semibold mb-2" role="alert" aria-live="polite">
          Error Loading Venues
        </div>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadVenues}
          className="mt-4 btn-primary"
          aria-label="Retry loading venues"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasFilters = hasActiveFilters(filters);
  const isFiltering = hasActiveSearch || hasFilters;

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Skip Navigation Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Page Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Venues</h1>
        <p className="text-gray-600 text-lg">Book your next adventure</p>
      </header>
      
      {/* Search and Filter Section */}
      <section aria-label="Search and filter venues" className="mb-8">
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
      </section>
      
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6" role="region" aria-label="Search results summary">
        <div>
          {isFiltering && (
            <p className="text-sm text-gray-600" aria-live="polite">
              {filteredHotels.length === 0 ? 'No venues found' : 
               `Showing ${filteredHotels.length} of ${hotels.length} venues`}
            </p>
          )}
        </div>
        {isFiltering && (
          <button
            onClick={clearAllFilters}
            className="btn-outline text-sm"
            aria-label="Clear all search filters and sorting"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Main Content */}
      <main id="main-content">
        {filteredHotels.length === 0 && hotels.length > 0 ? (
          <section className="text-center py-12" role="region" aria-label="No results found">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No venues found</h2>
            <p className="text-gray-500 text-lg mb-2">No venues found matching your search criteria.</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search terms or filters.</p>
            <button
              onClick={clearAllFilters}
              className="btn-primary"
              aria-label="Clear search and filters to show all venues"
            >
              Clear Search & Filters
            </button>
          </section>
        ) : (
          <section aria-label="Venue listings">
            <h2 className="sr-only">
              {isFiltering ? `${filteredHotels.length} filtered venues` : `All ${filteredHotels.length} venues`}
            </h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              role="list"
              aria-label="Venue cards"
            >
              {filteredHotels.map((hotel, idx) => (
                <div key={hotel.id || idx} role="listitem">
                  <VenueCard hotelData={hotel} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}

export default Venues; 