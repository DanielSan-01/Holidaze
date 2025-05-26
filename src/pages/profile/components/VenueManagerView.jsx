import React, { useState, useEffect } from 'react';
import VenueCard from './VenueCard.jsx';
import RevenueDashboard from './RevenueDashboard.jsx';
import { VenueCalendarModal } from '../../../components/booking';

const VenueManagerView = ({ 
  ownedVenues, 
  onCreateVenue, 
  onEditVenue, 
  onVenueClick 
}) => {
  const [showVenueSelector, setShowVenueSelector] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedVenueForCalendar, setSelectedVenueForCalendar] = useState(null);
  const [revenueStats, setRevenueStats] = useState({
    totalUpcomingRevenue: 0,
    monthlyRevenue: 0,
    averageBookingValue: 0,
    totalBookings: 0,
    occupancyRate: 0,
    topPerformingVenue: null
  });

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

  // Get all upcoming bookings from owned venues
  useEffect(() => {
    if (ownedVenues.length > 0) {
      setLoadingBookings(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allBookings = [];
      
      ownedVenues.forEach(venue => {
        if (venue.bookings && venue.bookings.length > 0) {
          venue.bookings.forEach(booking => {
            const bookingDate = new Date(booking.dateFrom);
            if (bookingDate >= today) {
              allBookings.push({
                ...booking,
                venue: {
                  id: venue.id,
                  name: venue.name,
                  media: venue.media
                }
              });
            }
          });
        }
      });

      // Sort by date (earliest first)
      allBookings.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      setUpcomingBookings(allBookings);
      
      // Calculate revenue statistics
      calculateRevenueStats(allBookings, ownedVenues);
      setLoadingBookings(false);
    }
  }, [ownedVenues]);

  const toggleVenueSelector = (e) => {
    e.stopPropagation();
    setShowVenueSelector(!showVenueSelector);
  };

  const handleEditVenue = (venueId) => {
    onEditVenue(venueId);
    setShowVenueSelector(false);
  };

  const handleViewCalendar = (venue) => {
    setSelectedVenueForCalendar(venue);
    setShowCalendarModal(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendarModal(false);
    setSelectedVenueForCalendar(null);
  };

  const formatDateRange = (dateFrom, dateTo) => {
    const checkIn = new Date(dateFrom).toLocaleDateString();
    const checkOut = new Date(dateTo).toLocaleDateString();
    return `${checkIn} - ${checkOut}`;
  };

  const calculateNights = (dateFrom, dateTo) => {
    const checkIn = new Date(dateFrom);
    const checkOut = new Date(dateTo);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateRevenueStats = (bookings, venues) => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const next30Days = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    let totalUpcomingRevenue = 0;
    let monthlyRevenue = 0;
    let venueBookingCounts = {};
    let venueRevenues = {};
    
    // Initialize venue tracking
    venues.forEach(venue => {
      venueBookingCounts[venue.id] = 0;
      venueRevenues[venue.id] = 0;
    });
    
    bookings.forEach(booking => {
      const venue = venues.find(v => v.id === booking.venue.id);
      if (!venue) return;
      
      const nights = calculateNights(booking.dateFrom, booking.dateTo);
      const bookingRevenue = nights * venue.price;
      const bookingDate = new Date(booking.dateFrom);
      
      // Total upcoming revenue
      totalUpcomingRevenue += bookingRevenue;
      
      // Monthly revenue (next 30 days)
      if (bookingDate <= next30Days) {
        monthlyRevenue += bookingRevenue;
      }
      
      // Track per venue
      venueBookingCounts[booking.venue.id]++;
      venueRevenues[booking.venue.id] += bookingRevenue;
    });
    
    // Find top performing venue
    let topPerformingVenue = null;
    let maxRevenue = 0;
    venues.forEach(venue => {
      if (venueRevenues[venue.id] > maxRevenue) {
        maxRevenue = venueRevenues[venue.id];
        topPerformingVenue = {
          ...venue,
          revenue: maxRevenue,
          bookingCount: venueBookingCounts[venue.id]
        };
      }
    });
    
    // Calculate occupancy rate (simplified - based on bookings vs available days)
    const totalPossibleDays = venues.length * 30; // 30 days ahead
    const totalBookedDays = bookings.reduce((total, booking) => {
      const bookingDate = new Date(booking.dateFrom);
      if (bookingDate <= next30Days) {
        return total + calculateNights(booking.dateFrom, booking.dateTo);
      }
      return total;
    }, 0);
    const occupancyRate = totalPossibleDays > 0 ? (totalBookedDays / totalPossibleDays) * 100 : 0;
    
    setRevenueStats({
      totalUpcomingRevenue,
      monthlyRevenue,
      averageBookingValue: bookings.length > 0 ? totalUpcomingRevenue / bookings.length : 0,
      totalBookings: bookings.length,
      occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
      topPerformingVenue
    });
  };

  return (
    <div className="space-y-6">
      {/* Revenue Dashboard */}
      {ownedVenues.length > 0 && (
        <RevenueDashboard revenueStats={revenueStats} />
      )}

      {/* My Venues Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">My Venues</h3>
        
        <div className="flex gap-3 mb-6">
          <button 
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm" 
            onClick={onCreateVenue}
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
                onClick={onVenueClick}
                showOwnerBadge={true}
                onViewCalendar={handleViewCalendar}
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

      {/* Upcoming Bookings Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Bookings for My Venues</h3>
        
        {loadingBookings ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      {booking.venue.media?.[0]?.url && (
                        <img 
                          src={booking.venue.media[0].url} 
                          alt={booking.venue.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                            onClick={() => onVenueClick(booking.venue.id)}>
                          {booking.venue.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Guest: {booking.customer?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Check-in:</span>
                        <p className="font-medium">{new Date(booking.dateFrom).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Check-out:</span>
                        <p className="font-medium">{new Date(booking.dateTo).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests:</span>
                        <p className="font-medium">{booking.guests}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Nights:</span>
                        <p className="font-medium">{calculateNights(booking.dateFrom, booking.dateTo)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                                         <p className="font-semibold text-green-600">
                       ${(calculateNights(booking.dateFrom, booking.dateTo) * (ownedVenues.find(v => v.id === booking.venue.id)?.price || 0)).toLocaleString()}
                     </p>
                    <p className="text-xs text-green-500 mt-1">✓ Confirmed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No upcoming bookings for your venues.</p>
            <p className="text-sm">Bookings will appear here when guests make reservations.</p>
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      <VenueCalendarModal
        isOpen={showCalendarModal}
        onClose={handleCloseCalendar}
        venue={selectedVenueForCalendar}
        bookings={selectedVenueForCalendar?.bookings || []}
      />
    </div>
  );
};

export default VenueManagerView; 