import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useBookingReceipt = (user, fetchProfile) => {
  const [showBookingReceipt, setShowBookingReceipt] = useState(false);
  const [newBookingData, setNewBookingData] = useState(null);
  const [bookingVenue, setBookingVenue] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle incoming booking data from venue page
  useEffect(() => {
    if (location.state?.newBooking && location.state?.venue) {
      setNewBookingData(location.state.newBooking);
      setBookingVenue(location.state.venue);
      setShowBookingReceipt(true);
      
      // Clear the location state to prevent showing receipt again on refresh
      navigate(location.pathname, { replace: true });
      
      // Refresh profile to show the new booking
      if (user && fetchProfile) {
        fetchProfile(user.name, { _bookings: true, _venues: true });
      }
    }
  }, [location.state, user, navigate, location.pathname, fetchProfile]);

  // Helper functions for booking receipt
  const calculateNights = () => {
    if (!newBookingData?.dateFrom || !newBookingData?.dateTo) return 0;
    const checkIn = new Date(newBookingData.dateFrom);
    const checkOut = new Date(newBookingData.dateTo);
    const diffTime = checkOut - checkIn;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * bookingVenue?.price * newBookingData?.guests;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const closeReceipt = () => {
    setShowBookingReceipt(false);
    setNewBookingData(null);
    setBookingVenue(null);
  };

  const handleViewBookings = () => {
    // Already on profile page, just close the modal
    closeReceipt();
  };

  return {
    showBookingReceipt,
    newBookingData,
    bookingVenue,
    calculateNights,
    calculateTotal,
    formatDate,
    closeReceipt,
    handleViewBookings
  };
}; 