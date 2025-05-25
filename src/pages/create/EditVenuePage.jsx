import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/AuthContext.jsx';
import { useProfile } from '../../hooks/profile/useProfile.jsx';
import { useEditVenue } from './hooks/useEditVenue.js';
import { useVenues } from '../../hooks/venues/useVenues.jsx';
import EditVenueForm from './EditVenueForm.jsx';
import DeleteVenueSection from './DeleteVenueSection.jsx';

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, fetchProfile } = useProfile();
  const { venue, loading: venueLoading, error: venueError, fetchVenue } = useVenues();
  const { updateVenue, deleteVenue, loading, error } = useEditVenue();

  useEffect(() => {
    if (user && id) {
      fetchProfile(user.name, { _venues: true });
      fetchVenue(id);
    }
  }, [user, id]);

  const handleSave = async (venueData) => {
    try {
      await updateVenue(id, venueData);
      navigate('/profile', { 
        state: { message: 'Venue updated successfully!', type: 'success' }
      });
    } catch (error) {
      console.error('Failed to update venue:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVenue(id);
      navigate('/profile', { 
        state: { message: 'Venue deleted successfully!', type: 'success' }
      });
    } catch (error) {
      console.error('Failed to delete venue:', error);
      throw error; // Re-throw to let DeleteVenueSection handle it
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  // Loading state
  if (profileLoading || venueLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (venueError || !venue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Venue</h2>
          <p className="text-red-700 mb-4">{venueError || 'Venue not found'}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // Check venue manager status from profile data (like your example)
  if (!profile?.venueManager) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Access Denied</h2>
          <p className="text-yellow-700 mb-4">You need to be a venue manager to edit venues.</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Venue</h1>
        <p className="text-gray-600">Update your venue information and settings.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <EditVenueForm
          venue={venue}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />

        <DeleteVenueSection
          venue={venue}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
} 