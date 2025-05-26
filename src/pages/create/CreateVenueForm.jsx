import React, { useState } from 'react';
import { useCreateVenue } from '../../hooks/venues';
import { useNavigate } from 'react-router-dom';
import { VenueForm } from '../../components/venue';



const CreateVenueForm = () => {
  const { createVenue, loading, error } = useCreateVenue();
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (venueData) => {
    try {
      const result = await createVenue(venueData);
      if (result) {
        console.log('✅ Venue created successfully:', result.name, 'ID:', result.id);
        setSuccessData(result);
      }
    } catch (err) {
      console.error('Failed to create venue:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Success state - show success message with options
  if (successData) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Created Successfully!</h3>
          <p className="text-sm text-gray-500 mb-6">
            Your venue "{successData.name}" has been created and is now live.
            <br />
            <span className="text-xs">Note: It may take a moment for the venue to appear in your profile.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/venue/${successData.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Venue
            </button>
            <button
              onClick={() => navigate('/profile?refresh=true')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Go to My Venues
            </button>
            <button
              onClick={() => setSuccessData(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Create Another Venue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
          {error}
        </div>
      )}

      <VenueForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitText="Create Venue"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CreateVenueForm; 