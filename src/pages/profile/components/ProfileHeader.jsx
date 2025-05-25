import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ profile }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      {/* Profile Header */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Link
          to="/profile/edit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </Link>
      </div>

      {/* Banner */}
      {profile.banner?.url && (
        <div className="mb-6">
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || 'Profile banner'}
            className="w-full h-32 object-cover rounded"
          />
        </div>
      )}

      {/* Profile Info */}
      <div className="flex items-start space-x-4 mb-6">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || 'Profile avatar'}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
          {profile.bio && <p className="mt-2">{profile.bio}</p>}
          <p className="mt-2">
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              profile.venueManager 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {profile.venueManager ? 'Venue Manager' : 'Customer'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 