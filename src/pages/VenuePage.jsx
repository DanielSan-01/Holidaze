import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { PlaneLoader } from '../components/loader';
import { AuthModal } from '../components/auth';
import { ImageGallery, VenueDetails, VenueMap } from '../components/venue';
import { BookingCalendar } from '../components/booking';

export default function VenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Booking form state
  const [bookingDates, setBookingDates] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1
  });
  const [dateError, setDateError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch venue data
  useEffect(() => {
    fetchVenue();
  }, [id]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch venue: ${response.status}`);
      }
      
      const data = await response.json();
      setVenue(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Create booking
  const handleBooking = async () => {
    setDateError('');
    
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Validate dates
    if (!bookingDates.dateFrom || !bookingDates.dateTo) {
      setDateError('Please select both check-in and check-out dates');
      return;
    }
    
    const checkIn = new Date(bookingDates.dateFrom);
    const checkOut = new Date(bookingDates.dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      setDateError('Check-in date cannot be in the past');
      return;
    }
    
    if (checkOut <= checkIn) {
      setDateError('Check-out date must be after check-in date');
      return;
    }

    if (bookingDates.guests > venue.maxGuests) {
      setDateError(`Maximum ${venue.maxGuests} guests allowed`);
      return;
    }

    // Check if dates are available (not overlapping with existing bookings)
    const isDateAvailable = venue.bookings?.every(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return (checkOut <= bookingStart || checkIn >= bookingEnd);
    });

    if (!isDateAvailable) {
      setDateError('Selected dates are not available');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Get auth data from localStorage
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');
      
      if (!accessToken) {
        setDateError('Please log in to make a booking');
        setBookingLoading(false);
        return;
      }

      const bookingPayload = {
        dateFrom: bookingDates.dateFrom,
        dateTo: bookingDates.dateTo,
        guests: parseInt(bookingDates.guests),
        venueId: id
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      // Add API key if available
      if (apiKey) {
        headers['X-Noroff-API-Key'] = apiKey;
      }

      const response = await fetch('https://v2.api.noroff.dev/holidaze/bookings', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingPayload)
      });

      if (!response.ok) {
        throw new Error(`Booking failed: ${response.status}`);
      }

      const result = await response.json();
      setBookingLoading(false);
      
      // Redirect to profile with booking data for receipt display
      navigate('/profile', { 
        state: { 
          newBooking: result.data,
          venue: venue 
        } 
      });
    } catch (err) {
      setDateError(err.message);
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDates(prev => ({
      ...prev,
      [name]: value
    }));
    setDateError('');
  };

  const handleCalendarDateChange = ({ checkIn, checkOut }) => {
    setBookingDates(prev => ({
      ...prev,
      dateFrom: checkIn,
      dateTo: checkOut
    }));
    setDateError('');
  };

  const calculateNights = () => {
    if (!bookingDates.dateFrom || !bookingDates.dateTo) return 0;
    const checkIn = new Date(bookingDates.dateFrom);
    const checkOut = new Date(bookingDates.dateTo);
    const diffTime = checkOut - checkIn;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * venue?.price * bookingDates.guests;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <PlaneLoader 
          text="Loading venue details..." 
          size={90}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-red-500 text-center">Error: {error}</div>
        <button
          onClick={() => navigate('/venues')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Venues
        </button>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">Venue not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Venue Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/venues')}
          className="text-blue-500 hover:text-blue-700 mb-4"
        >
          ← Back to Venues
        </button>
        <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span>User rating {venue.rating}/5</span>
          <span>Max {venue.maxGuests} guests</span>
        </div>
      </div>

      {/* Images */}
      <ImageGallery images={venue.media} venueName={venue.name} />

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Venue Details */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Location */}
          {venue.location && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-700">
                {[venue.location.address, venue.location.city, venue.location.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Amenities */}
          {venue.meta && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {venue.meta.wifi && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">📶 WiFi</span>}
                {venue.meta.parking && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🚗 Parking</span>}
                {venue.meta.breakfast && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">�� Breakfast</span>}
                {venue.meta.pets && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🐕 Pets</span>}
              </div>
            </div>
          )}

          {/* Venue Policies */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Checkout: 11:00 AM</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Cancellation: 48 hours notice</span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner */}
          {venue.owner && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Hosted by</h2>
              <div className="flex items-center gap-3">
                {venue.owner.avatar?.url && (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{venue.owner.name}</p>
                  {venue.owner.bio && <p className="text-gray-600 text-sm">{venue.owner.bio}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Map Section - Flexible height that adapts to available space */}
          {venue.location && (
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-xl font-semibold mb-2">Map</h2>
              <VenueMap venue={venue} height="flex-1 min-h-80" />
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 shadow-lg sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>
            
            {/* Dynamic Pricing Display */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-black">
                ${venue.price}/night per guest
              </div>
              <div className="text-sm text-black">
                ${venue.price * bookingDates.guests}/night for {bookingDates.guests} guest{bookingDates.guests > 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Dates
                </label>
                <BookingCalendar
                  bookedDates={venue.bookings || []}
                  onDateChange={handleCalendarDateChange}
                  checkIn={bookingDates.dateFrom}
                  checkOut={bookingDates.dateTo}
                  minDate={new Date()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select
                  name="guests"
                  value={bookingDates.guests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: venue.maxGuests }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booking Summary */}
              {bookingDates.dateFrom && bookingDates.dateTo && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between text-sm">
                    <span>{calculateNights()} nights × ${venue.price}</span>
                    <span>${calculateNights() * venue.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{bookingDates.guests} guests</span>
                    <span>×{bookingDates.guests}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              )}

              {dateError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {dateError}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
} 