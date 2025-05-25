import React from 'react';

const ProfileStats = ({ profile, ownedVenues, visitedVenues }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Bookings</h3>
        <p className="text-2xl font-bold">{profile._count?.bookings || 0}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">
          {profile.venueManager ? 'Venues Owned' : 'Places Visited'}
        </h3>
        <p className="text-2xl font-bold">
          {profile.venueManager ? ownedVenues.length : visitedVenues.length}
        </p>
      </div>
    </div>
  );
};

export default ProfileStats; 