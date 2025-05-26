import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SearchVenues from '../SearchVenues';
import FilterVenues from '../FilterVenues';
import { filterVenues, sortVenues } from '../../../utils/venueFilters';

// Mock the security utils
vi.mock('../../../utils/security.js', () => ({
  sanitizeInput: vi.fn((input) => input),
  validateSearchQuery: vi.fn(() => true)
}));

// Test wrapper for router context
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Search and Filter System Integration Tests', () => {
  const mockVenues = [
    {
      id: '1',
      name: 'Luxury Beach Resort',
      description: 'Beautiful beachfront property with stunning ocean views',
      price: 250,
      maxGuests: 4,
      rating: 4.8,
      location: { city: 'Miami', country: 'USA' },
      meta: { wifi: true, parking: true, breakfast: false, pets: false }
    },
    {
      id: '2',
      name: 'Mountain Cabin Retreat',
      description: 'Cozy cabin in the mountains perfect for hiking',
      price: 120,
      maxGuests: 6,
      rating: 4.2,
      location: { city: 'Denver', country: 'USA' },
      meta: { wifi: false, parking: true, breakfast: true, pets: true }
    },
    {
      id: '3',
      name: 'City Center Apartment',
      description: 'Modern apartment in downtown area',
      price: 180,
      maxGuests: 2,
      rating: 4.5,
      location: { city: 'New York', country: 'USA' },
      meta: { wifi: true, parking: false, breakfast: false, pets: false }
    },
    {
      id: '4',
      name: 'Budget Hostel',
      description: 'Affordable accommodation for backpackers',
      price: 50,
      maxGuests: 8,
      rating: 3.8,
      location: { city: 'Austin', country: 'USA' },
      meta: { wifi: true, parking: false, breakfast: true, pets: false }
    }
  ];

  describe('SearchVenues Component', () => {
    const mockOnSearch = vi.fn();
    const mockSetSearchParams = vi.fn();
    const mockSearchParams = new URLSearchParams();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders search input with placeholder', () => {
      render(
        <TestWrapper>
          <SearchVenues 
            onSearch={mockOnSearch}
            placeholder="Search venues..."
          />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search venues...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('calls onSearch when user types', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchVenues onSearch={mockOnSearch} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'beach');

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenLastCalledWith('beach');
      });
    });

    it('shows clear button when input has value', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchVenues onSearch={mockOnSearch} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
    });

    it('clears search when clear button clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchVenues onSearch={mockOnSearch} />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'test');
      
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(searchInput).toHaveValue('');
      expect(mockOnSearch).toHaveBeenLastCalledWith('');
    });

    it('updates URL parameters when setSearchParams provided', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchVenues 
            onSearch={mockOnSearch}
            searchParams={mockSearchParams}
            setSearchParams={mockSetSearchParams}
          />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'beach');

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });

    it('initializes with value from initialValue prop', () => {
      render(
        <TestWrapper>
          <SearchVenues 
            onSearch={mockOnSearch}
            initialValue="beach resort"
          />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveValue('beach resort');
    });
  });

  describe('FilterVenues Component', () => {
    const mockOnFilterChange = vi.fn();
    const mockOnClearFilters = vi.fn();
    const mockOnSort = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders filter toggle button', () => {
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      const filterButton = screen.getByText('Filters');
      expect(filterButton).toBeInTheDocument();
      expect(filterButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands filter panel when toggle clicked', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      const filterButton = screen.getByText('Filters');
      await user.click(filterButton);

      expect(filterButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Available Dates')).toBeInTheDocument();
      expect(screen.getByText('Price Range ($)')).toBeInTheDocument();
      expect(screen.getByText('Amenities')).toBeInTheDocument();
    });

    it('shows active filter indicator when filters applied', () => {
      const activeFilters = { wifi: true, minPrice: '100' };
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          filters={activeFilters}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('handles price filter changes', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const minPriceInput = screen.getByLabelText('Minimum price per night');
      await user.type(minPriceInput, '100');

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({ minPrice: '100' })
        );
      });
    });

    it('handles amenity filter changes', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const wifiCheckbox = screen.getByLabelText(/WiFi/);
      await user.click(wifiCheckbox);

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({ wifi: true })
        );
      });
    });

    it('handles date filter changes', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const checkInInput = screen.getByLabelText('Check-in date');
      await user.type(checkInInput, '2024-01-15');

      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({ checkIn: '2024-01-15' })
        );
      });
    });

    it('prevents invalid date ranges', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const checkInInput = screen.getByLabelText('Check-in date');
      const checkOutInput = screen.getByLabelText('Check-out date');

      await user.type(checkInInput, '2024-01-20');
      await user.type(checkOutInput, '2024-01-15'); // Earlier than check-in

      // Check-out should not be set to an invalid date
      expect(mockOnFilterChange).not.toHaveBeenCalledWith(
        expect.objectContaining({ checkOut: '2024-01-15' })
      );
    });

    it('clears all filters when clear button clicked', async () => {
      const user = userEvent.setup();
      const activeFilters = { wifi: true, minPrice: '100' };
      
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          filters={activeFilters}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const clearButton = screen.getByText('Clear all filters');
      await user.click(clearButton);

      expect(mockOnClearFilters).toHaveBeenCalled();
    });

    it('handles sort changes', async () => {
      const user = userEvent.setup();
      render(
        <FilterVenues 
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          onSort={mockOnSort}
        />
      );

      // Expand filters
      await user.click(screen.getByText('Filters'));

      const sortSelect = screen.getByLabelText('Sort venues by');
      await user.selectOptions(sortSelect, 'price-low');

      expect(mockOnSort).toHaveBeenCalledWith('price-low');
    });
  });

  describe('Venue Filtering Logic', () => {
    it('filters venues by search term in name', () => {
      const result = filterVenues(mockVenues, 'beach');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Luxury Beach Resort');
    });

    it('filters venues by search term in description', () => {
      const result = filterVenues(mockVenues, 'hiking');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Mountain Cabin Retreat');
    });

    it('filters venues by search term in location', () => {
      const result = filterVenues(mockVenues, 'miami');
      expect(result).toHaveLength(1);
      expect(result[0].location.city).toBe('Miami');
    });

    it('filters venues by price range', () => {
      const filters = { minPrice: '100', maxPrice: '200' };
      const result = filterVenues(mockVenues, '', filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(venue => venue.price >= 100 && venue.price <= 200)).toBe(true);
    });

    it('filters venues by max guests', () => {
      const filters = { maxGuests: '4' };
      const result = filterVenues(mockVenues, '', filters);
      
      expect(result.every(venue => venue.maxGuests >= 4)).toBe(true);
    });

    it('filters venues by rating', () => {
      const filters = { minRating: '4.5' };
      const result = filterVenues(mockVenues, '', filters);
      
      expect(result.every(venue => venue.rating >= 4.5)).toBe(true);
    });

    it('filters venues by amenities', () => {
      const filters = { wifi: true, parking: true };
      const result = filterVenues(mockVenues, '', filters);
      
      expect(result.every(venue => venue.meta.wifi && venue.meta.parking)).toBe(true);
    });

    it('combines multiple filters', () => {
      const filters = { 
        minPrice: '100', 
        maxPrice: '200', 
        wifi: true,
        maxGuests: '4'
      };
      const result = filterVenues(mockVenues, '', filters);
      
      expect(result.every(venue => 
        venue.price >= 100 && 
        venue.price <= 200 && 
        venue.meta.wifi && 
        venue.maxGuests >= 4
      )).toBe(true);
    });

    it('combines search term with filters', () => {
      const filters = { wifi: true };
      const result = filterVenues(mockVenues, 'apartment', filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('City Center Apartment');
    });

    it('returns empty array when no matches', () => {
      const result = filterVenues(mockVenues, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('handles empty search term', () => {
      const result = filterVenues(mockVenues, '');
      expect(result).toHaveLength(mockVenues.length);
    });

    it('handles empty filters object', () => {
      const result = filterVenues(mockVenues, '', {});
      expect(result).toHaveLength(mockVenues.length);
    });
  });

  describe('Venue Sorting Logic', () => {
    it('sorts venues by price low to high', () => {
      const result = sortVenues(mockVenues, 'price-low');
      const prices = result.map(venue => venue.price);
      expect(prices).toEqual([50, 120, 180, 250]);
    });

    it('sorts venues by price high to low', () => {
      const result = sortVenues(mockVenues, 'price-high');
      const prices = result.map(venue => venue.price);
      expect(prices).toEqual([250, 180, 120, 50]);
    });

    it('sorts venues by rating high to low', () => {
      const result = sortVenues(mockVenues, 'rating-high');
      const ratings = result.map(venue => venue.rating);
      expect(ratings).toEqual([4.8, 4.5, 4.2, 3.8]);
    });

    it('sorts venues by name A to Z', () => {
      const result = sortVenues(mockVenues, 'name-asc');
      const names = result.map(venue => venue.name);
      expect(names[0]).toBe('Budget Hostel');
      expect(names[names.length - 1]).toBe('Mountain Cabin Retreat');
    });

    it('sorts venues by max guests high to low', () => {
      const result = sortVenues(mockVenues, 'guests-high');
      const guests = result.map(venue => venue.maxGuests);
      expect(guests).toEqual([8, 6, 4, 2]);
    });

    it('returns original order for invalid sort criteria', () => {
      const result = sortVenues(mockVenues, 'invalid-sort');
      expect(result).toEqual(mockVenues);
    });

    it('returns original order for empty sort criteria', () => {
      const result = sortVenues(mockVenues, '');
      expect(result).toEqual(mockVenues);
    });

    it('handles empty venues array', () => {
      const result = sortVenues([], 'price-low');
      expect(result).toEqual([]);
    });
  });

  describe('Integration Scenarios', () => {
    it('handles complex search and filter combination', () => {
      const searchTerm = 'resort';
      const filters = { 
        minPrice: '200', 
        wifi: true, 
        maxGuests: '4' 
      };
      const sortBy = 'price-high';
      
      let result = filterVenues(mockVenues, searchTerm, filters);
      result = sortVenues(result, sortBy);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Luxury Beach Resort');
    });

    it('maintains filter state across search changes', () => {
      const filters = { wifi: true };
      
      // First search
      let result = filterVenues(mockVenues, 'apartment', filters);
      expect(result).toHaveLength(1);
      
      // Change search but keep filters
      result = filterVenues(mockVenues, 'resort', filters);
      expect(result).toHaveLength(1);
      expect(result[0].meta.wifi).toBe(true);
    });

    it('handles URL parameter integration', () => {
      // Simulate URL parameters being converted to filters
      const urlParams = new URLSearchParams('?wifi=true&minPrice=100&search=cabin');
      const searchTerm = urlParams.get('search');
      const filters = {
        wifi: urlParams.get('wifi') === 'true',
        minPrice: urlParams.get('minPrice')
      };
      
      const result = filterVenues(mockVenues, searchTerm, filters);
      expect(result).toHaveLength(0); // Mountain cabin doesn't have wifi
    });

    it('handles edge case with all filters applied', () => {
      const filters = {
        minPrice: '50',
        maxPrice: '300',
        maxGuests: '2',
        minRating: '3',
        wifi: true,
        parking: false,
        breakfast: false,
        pets: false
      };
      
      const result = filterVenues(mockVenues, '', filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('City Center Apartment');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array(1000).fill(null).map((_, index) => ({
        id: index.toString(),
        name: `Venue ${index}`,
        description: `Description ${index}`,
        price: Math.floor(Math.random() * 500) + 50,
        maxGuests: Math.floor(Math.random() * 10) + 1,
        rating: Math.random() * 2 + 3,
        location: { city: 'City', country: 'Country' },
        meta: { wifi: Math.random() > 0.5, parking: true, breakfast: false, pets: false }
      }));
      
      const start = performance.now();
      const result = filterVenues(largeDataset, 'Venue 1');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles malformed venue data gracefully', () => {
      const malformedVenues = [
        { id: '1', name: null, price: 'invalid', meta: null },
        { id: '2', description: undefined, location: {} },
        { id: '3' } // Missing most properties
      ];
      
      expect(() => {
        filterVenues(malformedVenues, 'test');
      }).not.toThrow();
    });

    it('handles special characters in search', () => {
      const venuesWithSpecialChars = [
        { ...mockVenues[0], name: 'Café & Restaurant' },
        { ...mockVenues[1], description: 'Beautiful (scenic) views!' }
      ];
      
      const result1 = filterVenues(venuesWithSpecialChars, 'café');
      const result2 = filterVenues(venuesWithSpecialChars, 'scenic');
      
      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
    });
  });
}); 