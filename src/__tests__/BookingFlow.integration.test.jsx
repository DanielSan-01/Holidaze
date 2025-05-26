import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import VenuePage from '../pages/VenuePage';
import { AuthProvider } from '../hooks/auth/AuthContext';

// Mock fetch globally
global.fetch = vi.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-venue-id' })
  };
});

// Mock auth hooks
const mockUser = {
  name: 'testuser',
  email: 'test@stud.noroff.no',
  venueManager: false
};

vi.mock('../hooks/auth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true
  })
}));

// Test wrapper with all necessary providers
const TestWrapper = ({ children, initialEntries = ['/venue/test-venue-id'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('Booking Flow Integration Tests', () => {
  const mockVenue = {
    id: 'test-venue-id',
    name: 'Test Beach Resort',
    description: 'Beautiful beachfront property',
    price: 200,
    maxGuests: 4,
    rating: 4.5,
    location: {
      address: '123 Beach St',
      city: 'Miami',
      country: 'USA'
    },
    meta: {
      wifi: true,
      parking: true,
      breakfast: false,
      pets: false
    },
    media: [
      {
        url: 'https://example.com/image1.jpg',
        alt: 'Beach resort view'
      }
    ],
    owner: {
      name: 'Resort Owner',
      email: 'owner@example.com',
      avatar: {
        url: 'https://example.com/avatar.jpg',
        alt: 'Owner avatar'
      }
    },
    bookings: [
      {
        id: 'existing-booking-1',
        dateFrom: '2024-01-15',
        dateTo: '2024-01-18',
        guests: 2
      }
    ]
  };

  const mockBookingResponse = {
    data: {
      id: 'new-booking-123',
      dateFrom: '2024-01-20',
      dateTo: '2024-01-25',
      guests: 2,
      created: '2024-01-10T10:00:00.000Z'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful venue fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockVenue })
    });

    // Mock localStorage with auth tokens
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'accessToken') return 'mock-access-token';
      if (key === 'apiKey') return 'mock-api-key';
      return null;
    });
  });

  describe('Complete Booking Journey', () => {
    it('should complete successful booking flow', async () => {
      const user = userEvent.setup();
      
      // Mock successful booking API call
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookingResponse
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      // Wait for venue to load
      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Verify venue details are displayed
      expect(screen.getByText('Beautiful beachfront property')).toBeInTheDocument();
      expect(screen.getByText('$200/night per guest')).toBeInTheDocument();
      expect(screen.getByText('Max 4 guests')).toBeInTheDocument();

      // Select dates using calendar
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20); // Check-in
      await user.click(date25); // Check-out

      // Select number of guests
      const guestSelect = screen.getByDisplayValue('1 guest');
      await user.selectOptions(guestSelect, '2');

      // Verify booking summary appears
      await waitFor(() => {
        expect(screen.getByText('5 nights × $200')).toBeInTheDocument();
        expect(screen.getByText('2 guests')).toBeInTheDocument();
        expect(screen.getByText('$2,000')).toBeInTheDocument(); // 5 nights × $200 × 2 guests
      });

      // Click book now button
      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      // Verify API call was made with correct data
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://v2.api.noroff.dev/holidaze/bookings',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer mock-access-token',
              'X-Noroff-API-Key': 'mock-api-key'
            }),
            body: JSON.stringify({
              dateFrom: '2024-01-20',
              dateTo: '2024-01-25',
              guests: 2,
              venueId: 'test-venue-id'
            })
          })
        );
      });

      // Verify navigation to profile with booking data
      expect(mockNavigate).toHaveBeenCalledWith('/profile', {
        state: {
          newBooking: mockBookingResponse.data,
          venue: mockVenue
        }
      });
    });

    it('should handle booking with maximum guests', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookingResponse
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      // Select maximum guests (4)
      const guestSelect = screen.getByDisplayValue('1 guest');
      await user.selectOptions(guestSelect, '4');

      // Verify pricing calculation
      await waitFor(() => {
        expect(screen.getByText('$4,000')).toBeInTheDocument(); // 5 nights × $200 × 4 guests
      });

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://v2.api.noroff.dev/holidaze/bookings',
          expect.objectContaining({
            body: JSON.stringify({
              dateFrom: '2024-01-20',
              dateTo: '2024-01-25',
              guests: 4,
              venueId: 'test-venue-id'
            })
          })
        );
      });
    });

    it('should handle single night booking', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookingResponse
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select consecutive dates for single night
      const date20 = screen.getByText('20');
      const date21 = screen.getByText('21');
      
      await user.click(date20);
      await user.click(date21);

      // Verify single night calculation
      await waitFor(() => {
        expect(screen.getByText('1 nights × $200')).toBeInTheDocument();
        expect(screen.getByText('$200')).toBeInTheDocument(); // 1 night × $200 × 1 guest
      });

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://v2.api.noroff.dev/holidaze/bookings',
          expect.objectContaining({
            body: JSON.stringify({
              dateFrom: '2024-01-20',
              dateTo: '2024-01-21',
              guests: 1,
              venueId: 'test-venue-id'
            })
          })
        );
      });
    });
  });

  describe('Booking Validation', () => {
    it('should prevent booking unavailable dates', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Try to select a date that's already booked (15th)
      const bookedDate = screen.getByText('15');
      expect(bookedDate).toBeDisabled();
      expect(bookedDate).toHaveClass('line-through');

      // Verify clicking disabled date doesn't work
      await user.click(bookedDate);
      
      // Book button should not be enabled without valid dates
      const bookButton = screen.getByText('Book Now');
      expect(bookButton).toBeInTheDocument();
    });

    it('should prevent booking past dates', async () => {
      const user = userEvent.setup();

      // Mock current date to be after some dates in the calendar
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-12'));

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Dates before current date should be disabled
      const pastDate = screen.getByText('10');
      expect(pastDate).toBeDisabled();

      vi.useRealTimers();
    });

    it('should show error for invalid date selection', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Try to book without selecting dates
      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      await waitFor(() => {
        expect(screen.getByText('Please select both check-in and check-out dates')).toBeInTheDocument();
      });
    });

    it('should prevent booking with too many guests', async () => {
      const user = userEvent.setup();

      // Mock venue with lower max guests
      const venueWithLowCapacity = {
        ...mockVenue,
        maxGuests: 2
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: venueWithLowCapacity })
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Guest selector should only show options up to maxGuests
      const guestSelect = screen.getByDisplayValue('1 guest');
      const options = guestSelect.querySelectorAll('option');
      expect(options).toHaveLength(2); // 1 and 2 guests only
    });

    it('should handle overlapping booking attempts', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Try to select dates that overlap with existing booking
      const date16 = screen.getByText('16'); // This overlaps with existing booking (15-18)
      expect(date16).toBeDisabled();
    });
  });

  describe('Authentication Requirements', () => {
    it('should show auth modal when user not logged in', async () => {
      const user = userEvent.setup();

      // Mock no auth tokens
      mockLocalStorage.getItem.mockReturnValue(null);

      // Mock unauthenticated user
      vi.doMock('../hooks/auth', () => ({
        useAuth: () => ({
          user: null,
          isAuthenticated: false
        })
      }));

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      // Try to book
      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      // Should show auth modal instead of making booking
      await waitFor(() => {
        expect(screen.getByText('Login')).toBeInTheDocument();
      });
    });

    it('should handle expired auth tokens', async () => {
      const user = userEvent.setup();

      // Mock API returning 401 unauthorized
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates and book
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Booking failed: 401/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();

      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates and try to book
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle API errors with specific messages', async () => {
      const user = userEvent.setup();

      // Mock API error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ 
          message: 'Venue is not available for the selected dates' 
        })
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      await waitFor(() => {
        expect(screen.getByText(/Booking failed: 400/)).toBeInTheDocument();
      });
    });

    it('should handle venue loading errors', async () => {
      // Mock venue fetch error
      fetch.mockRejectedValueOnce(new Error('Failed to fetch venue'));

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Error: Failed to fetch venue')).toBeInTheDocument();
      });

      // Should show back to venues button
      expect(screen.getByText('Back to Venues')).toBeInTheDocument();
    });

    it('should handle missing venue data', async () => {
      // Mock empty venue response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: null })
      });

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Venue not found')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching venue', () => {
      // Mock slow venue fetch
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      expect(screen.getByText('Loading venue details...')).toBeInTheDocument();
    });

    it('should show loading state during booking submission', async () => {
      const user = userEvent.setup();

      // Mock slow booking API
      fetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockBookingResponse
          }), 1000)
        )
      );

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates and book
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      // Should show loading state
      expect(screen.getByText('Booking...')).toBeInTheDocument();
      expect(bookButton).toBeDisabled();
    });
  });

  describe('Price Calculations', () => {
    it('should calculate correct total for multiple nights and guests', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select 7 nights (20th to 27th)
      const date20 = screen.getByText('20');
      const date27 = screen.getByText('27');
      
      await user.click(date20);
      await user.click(date27);

      // Select 3 guests
      const guestSelect = screen.getByDisplayValue('1 guest');
      await user.selectOptions(guestSelect, '3');

      // Verify calculation: 7 nights × $200 × 3 guests = $4,200
      await waitFor(() => {
        expect(screen.getByText('7 nights × $200')).toBeInTheDocument();
        expect(screen.getByText('3 guests')).toBeInTheDocument();
        expect(screen.getByText('$4,200')).toBeInTheDocument();
      });
    });

    it('should update price dynamically when guests change', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Select dates first
      const date20 = screen.getByText('20');
      const date25 = screen.getByText('25');
      
      await user.click(date20);
      await user.click(date25);

      // Initial price with 1 guest
      await waitFor(() => {
        expect(screen.getByText('$1,000')).toBeInTheDocument(); // 5 nights × $200 × 1 guest
      });

      // Change to 2 guests
      const guestSelect = screen.getByDisplayValue('1 guest');
      await user.selectOptions(guestSelect, '2');

      // Price should update
      await waitFor(() => {
        expect(screen.getByText('$2,000')).toBeInTheDocument(); // 5 nights × $200 × 2 guests
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for booking form', async () => {
      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Check for accessible form elements
      expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /book now/i })).toBeInTheDocument();
    });

    it('should announce booking errors to screen readers', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <VenuePage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Beach Resort')).toBeInTheDocument();
      });

      // Try to book without dates
      const bookButton = screen.getByText('Book Now');
      await user.click(bookButton);

      const errorMessage = await screen.findByText('Please select both check-in and check-out dates');
      expect(errorMessage).toHaveClass('text-red-600');
    });
  });
}); 