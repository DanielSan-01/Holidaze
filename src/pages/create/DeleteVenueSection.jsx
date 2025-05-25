import { useState } from 'react';

export default function DeleteVenueSection({ venue, onDelete, loading }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      // Keep confirmation dialog open on error
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-2">Delete Venue</h4>
        <p className="text-red-700 text-sm mb-4">
          This action cannot be undone. This will permanently delete "{venue?.name}" and all associated bookings.
        </p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={handleDeleteClick}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Delete Venue
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-red-100 border border-red-300 rounded">
              <p className="text-red-800 font-semibold">⚠️ Are you absolutely sure?</p>
              <p className="text-red-700 text-sm mt-1">
                This will permanently delete "{venue?.name}" and cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Deleting...' : 'Yes, Delete Forever'}
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 