import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/profile';
import { useAuth } from '../hooks/auth';
import { PlaneLoader } from '../components/loader';

export default function Admin() {
  const { user } = useAuth();
  const { loading, error, fetchAllProfiles } = useProfile();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByVenueManager, setFilterByVenueManager] = useState('all');

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, filterByVenueManager]);

  const loadProfiles = async () => {
    try {
      const data = await fetchAllProfiles();
      setProfiles(data || []);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  };

  const filterProfiles = () => {
    let filtered = [...profiles];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (profile.bio && profile.bio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by venue manager status
    if (filterByVenueManager !== 'all') {
      const isVenueManager = filterByVenueManager === 'true';
      filtered = filtered.filter(profile => profile.venueManager === isVenueManager);
    }

    setFilteredProfiles(filtered);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <PlaneLoader 
          text="Loading admin dashboard..." 
          size={100}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-red-600 text-center">
          Error: {error}
          <br />
          <small className="text-gray-500 mt-2 block">
            Note: Admin features may require additional API permissions that are not yet configured.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Show message if no profiles loaded */}
        {profiles.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-8">
            Unable to load profiles at this time. This may be due to API configuration requirements.
          </div>
        )}

        {profiles.length > 0 && (
          <>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Profiles
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or bio..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter by Venue Manager */}
                <div className="sm:w-48">
                  <label htmlFor="venueManagerFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <select
                    id="venueManagerFilter"
                    value={filterByVenueManager}
                    onChange={(e) => setFilterByVenueManager(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="true">Venue Managers</option>
                    <option value="false">Customers</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Showing {filteredProfiles.length} of {profiles.length} profiles
              </div>
            </div>

            {/* Profiles Grid */}
            {filteredProfiles.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No profiles found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <div key={profile.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Profile Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      {profile.avatar?.url ? (
                        <img
                          src={profile.avatar.url}
                          alt={profile.avatar.alt || 'Profile avatar'}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{profile.email}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {/* Status and Stats */}
                    <div className="space-y-2">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          profile.venueManager 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {profile.venueManager ? 'Venue Manager' : 'Customer'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Bookings: {profile._count?.bookings || 0}</span>
                        <span>Venues: {profile._count?.venues || 0}</span>
                      </div>
                    </div>

                    {/* Banner Preview */}
                    {profile.banner?.url && (
                      <div className="mt-3">
                        <img
                          src={profile.banner.url}
                          alt={profile.banner.alt || 'Profile banner'}
                          className="w-full h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profiles.length}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profiles.filter(p => p.venueManager).length}
                  </div>
                  <div className="text-sm text-gray-600">Venue Managers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {profiles.filter(p => !p.venueManager).length}
                  </div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {profiles.reduce((total, p) => total + (p._count?.venues || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Venues</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 