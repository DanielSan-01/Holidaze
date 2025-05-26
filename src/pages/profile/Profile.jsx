import { useEffect, useState } from 'react';
import { useAuth, useProfile, useVenueRating, useBookingReceipt } from '../../hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlaneLoader } from '../../components/loader';
import ProfileHeader from './components/ProfileHeader.jsx';
import ProfileStats from './components/ProfileStats.jsx';
import VenueCard from './components/VenueCard.jsx';
import { VenueRating } from '../../components/venue';
import { CancelBooking, CancellationReceipt, BookingReceipt } from '../../components/booking';

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, error, fetchProfile } = useProfile();
  const { submitRating, getRating, hasRated } = useVenueRating();
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVenueSelector, setShowVenueSelector] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showCancelSuccessModal, setShowCancelSuccessModal] = useState(false);
  const [cancelledBookingDetails, setCancelledBookingDetails] = useState(null);
  const navigate = useNavigate();
  
  // Use the booking receipt hook
  const {
    showBookingReceipt,
    newBookingData,
    bookingVenue,
    calculateNights,
    calculateTotal,
    formatDate,
    closeReceipt,
    handleViewBookings
  } = useBookingReceipt(user, fetchProfile);

  useEffect(() => {
    if (user) {
      console.log('Fetching profile for user:', user.name);
      fetchProfile(user.name, { _bookings: true, _venues: true });
      

    }
  }, [user]);

  // Sync bookings state with profile data
  useEffect(() => {
    if (profile?.bookings) {
      setBookings(profile.bookings);
    }
  }, [profile?.bookings]);

  // Close venue selector when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowVenueSelector(false);
    };

    if (showVenueSelector) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showVenueSelector]);



  const handleRetry = () => {
    if (retryAttempts >= 3) {
      alert('Too many retry attempts. Please refresh the page or try again later.');
      return;
    }
    
    setRetryAttempts(prev => prev + 1);
    fetchProfile(user.name, { _bookings: true, _venues: true });
  };

  const handleBookingClick = (booking) => {
    navigate(`/venue/${booking.venue.id}`);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  const handleCreateVenue = () => {
    navigate('/venues/create');
  };

  const handleEditVenue = (venueId) => {
    console.log('🔧 Editing venue:', venueId);
    navigate(`/venues/edit/${venueId}`);
    setShowVenueSelector(false);
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      await submitRating(ratingData);
      console.log('Rating submitted successfully:', ratingData);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      throw error;
    }
  };

  const toggleVenueSelector = (e) => {
    e.stopPropagation();
    console.log('🔽 Toggle venue selector, current state:', showVenueSelector);
    console.log('🏠 Owned venues count:', ownedVenues.length);
    setShowVenueSelector(!showVenueSelector);
  };

  // Check if user owns a venue (using real API data structure)
  const userOwnsVenue = (venue) => {
    // When venues are fetched with _venues=true in a user's profile,
    // all returned venues are owned by that user (API design)
    return true;
  };

  // Get venues owned by current user (for venue managers)
  const ownedVenues = profile?.venues || [];

  // Get unique venues from bookings (for previous visits)
  const visitedVenues = profile?.bookings?.map(booking => ({
    ...booking.venue,
    lastVisited: booking.dateTo,
    rating: Math.floor(Math.random() * 2) + 4 // Random rating 4-5 stars
  })) || [];

  // Debug logging
  console.log('Profile debug:', {
    venueManager: profile?.venueManager,
    totalVenues: profile?.venues?.length || 0,
    ownedVenues: ownedVenues.length,
    userName: user?.name,
    allVenues: profile?.venues?.map(v => ({ 
      id: v.id, 
      name: v.name, 
      created: v.created
    })) || []
  });

  const handleCancelSuccess = (cancelledBookingId) => {
    // Find the cancelled booking details before removing it
    const cancelledBooking = bookings.find(booking => booking.id === cancelledBookingId);
    
    // Remove the cancelled booking from local state
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== cancelledBookingId)
    );
    
    // Store cancelled booking details and show success modal
    setCancelledBookingDetails(cancelledBooking);
    setShowCancelSuccessModal(true);
    
    console.log(`Booking ${cancelledBookingId} cancelled successfully`);
  };



  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PlaneLoader 
          text="Loading your profile..." 
          size={100}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Profile</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="space-y-2">
              {retryAttempts < 3 && (
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mr-4"
                >
                  Try Again {retryAttempts > 0 && `(${retryAttempts}/3)`}
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
            {retryAttempts >= 3 && (
              <p className="text-sm text-red-600 mt-4">
                Maximum retry attempts reached. Please refresh the page or contact support if the problem persists.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          <p className="text-gray-600">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader profile={profile} />
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <ProfileStats 
            profile={profile} 
            ownedVenues={ownedVenues} 
            visitedVenues={visitedVenues} 
          />
        </div>
      </div>

      {/* Bookings Section */}
      {bookings && bookings.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded p-4"
              >
                <div 
                  className="cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 -m-2"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-blue-600 hover:text-blue-800 text-wrap-title">{booking.venue.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm">Guests: {booking.guests}</p>
                      {/* Cancel Link positioned under guests info */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <CancelBooking 
                          booking={booking}
                          onCancelSuccess={handleCancelSuccess}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.venue.price}/night</p>
                      <p className="text-sm text-green-600 font-medium">✓ Confirmed</p>
                    </div>
                  </div>
                </div>
                
                {/* Rating Component */}
                <VenueRating 
                  booking={booking}
                  onRatingSubmit={handleRatingSubmit}
                  disabled={false}
                  existingRating={getRating(booking.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Section: My Venues (for venue managers) OR My Previous Visits (for regular users) */}
      {profile.venueManager ? (
        // Venue Manager View: My Venues
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">My Venues</h3>
          
          <div className="flex gap-3 mb-6">
            <button 
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm" 
              onClick={handleCreateVenue}
            >
              + Add New Venue
            </button>

            {/* Edit Venue Dropdown */}
            {ownedVenues.length > 0 && (
              <div className="relative flex-1">
                <button 
                  onClick={toggleVenueSelector}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Venue
                </button>
                
                {showVenueSelector && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-sm text-gray-600 mb-2 px-2">Select a venue to edit:</div>
                      {ownedVenues.map((venue) => (
                        <button
                          key={venue.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVenue(venue.id);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center space-x-3"
                        >
                          {venue.media?.[0]?.url && (
                            <img 
                              src={venue.media[0].url} 
                              alt={venue.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {venue.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ${venue.price}/night
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {ownedVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={handleVenueClick}
                  showOwnerBadge={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">You haven't created any venues yet.</p>
              <p className="text-sm">Click the "Add New Venue" button above to get started!</p>
            </div>
          )}
        </div>
      ) : (
        // Regular User View
        <>
          {/* Show venues if they have any, regardless of venue manager status */}
          {ownedVenues.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">My Venues</h3>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm" 
                  onClick={handleCreateVenue}
                >
                  + Add New Venue
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ownedVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onClick={handleVenueClick}
                    showOwnerBadge={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Previous Visits */}
          {visitedVenues.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">My Previous Visits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitedVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onClick={handleVenueClick}
                    showLastVisited={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show create venue option if no venues and no visits */}
          {ownedVenues.length === 0 && visitedVenues.length === 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8 text-gray-500">
                <h3 className="text-lg font-semibold mb-4">Get Started</h3>
                <p className="mb-4">You haven't created any venues or made any bookings yet.</p>
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors" 
                  onClick={handleCreateVenue}
                >
                  + Create Your First Venue
                </button>
              </div>
            </div>
          )}
        </>
      )}



      {/* Cancellation Success Modal */}
      <CancellationReceipt
        cancelledBooking={cancelledBookingDetails}
        isOpen={showCancelSuccessModal}
        onClose={() => {
          setShowCancelSuccessModal(false);
          setCancelledBookingDetails(null);
        }}
        onViewVenue={(venueId) => navigate(`/venue/${venueId}`)}
      />

      {/* Booking Success Receipt Modal */}
      <BookingReceipt
        bookingData={newBookingData}
        venue={bookingVenue}
        isOpen={showBookingReceipt}
        onClose={closeReceipt}
        onViewBookings={handleViewBookings}
        calculateNights={calculateNights}
        calculateTotal={calculateTotal}
        formatDate={formatDate}
        showViewBookingsButton={false} // Hide since we're already on the bookings page
        autoRedirect={false}
        userName={user?.name}
      />
    </div>
  );
} 