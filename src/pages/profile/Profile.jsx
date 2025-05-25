import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth/AuthContext.jsx';
import { useProfile } from '../../hooks/profile/useProfile.jsx';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './components/ProfileHeader.jsx';
import ProfileStats from './components/ProfileStats.jsx';
import VenueCard from './components/VenueCard.jsx';

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, error, fetchProfile } = useProfile();
  const [retryAttempts, setRetryAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('Fetching profile for user:', user.name);
      fetchProfile(user.name, { _bookings: true, _venues: true });
    }
  }, [user]);

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

  // Check if user owns a venue (using real API data structure)
  const userOwnsVenue = (venue) => {
    return venue.owner?.name === user?.name;
  };

  // Get venues owned by current user (for venue managers)
  const ownedVenues = profile?.venues?.filter(venue => userOwnsVenue(venue)) || [];

  // Get unique venues from bookings (for previous visits)
  const visitedVenues = profile?.bookings?.map(booking => ({
    ...booking.venue,
    lastVisited: booking.dateTo,
    rating: Math.floor(Math.random() * 2) + 4 // Random rating 4-5 stars
  })) || [];

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
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
        <ProfileStats 
          profile={profile} 
          ownedVenues={ownedVenues} 
          visitedVenues={visitedVenues} 
        />
      </div>

      {/* Bookings Section */}
      {profile?.bookings && profile.bookings.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
          <div className="space-y-4">
            {profile.bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-blue-600 hover:text-blue-800">{booking.venue.name}</h4>
                    <p className="text-gray-600">
                      {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Guests: {booking.guests}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${booking.venue.price}/night</p>
                    <p className="text-sm text-green-600 font-medium">✓ Confirmed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Section: My Venues (for venue managers) OR My Previous Visits (for regular users) */}
      {profile.venueManager ? (
        // Venue Manager View: My Venues
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">My Venues</h3>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm" 
              onClick={handleCreateVenue}
            >
              + Add New Venue
            </button>
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
        // Regular User View: My Previous Visits
        visitedVenues.length > 0 && (
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
        )
      )}
    </div>
  );
} 