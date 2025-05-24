import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Mock profile data
const mockProfile = {
  name: "john_doe",
  email: "john.doe@stud.noroff.no",
  bio: "Passionate traveler and venue manager. I love discovering unique places and sharing amazing experiences with fellow travelers. Always looking for the next adventure!",
  avatar: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe's avatar"
  },
  banner: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
    alt: "John Doe's banner"
  },
  venueManager: true,
  _count: {
    bookings: 12,
    venues: 4
  },
  bookings: [
    {
      id: "booking-1",
      dateFrom: "2024-02-15T00:00:00.000Z",
      dateTo: "2024-02-18T00:00:00.000Z",
      guests: 2,
      venue: {
        id: "venue-visited-1",
        name: "Cozy Mountain Cabin",
        price: 120,
        media: [
          {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
            alt: "Cozy Mountain Cabin"
          }
        ],
        description: "A peaceful retreat in the mountains with stunning views and cozy amenities."
      }
    },
    {
      id: "booking-2",
      dateFrom: "2024-03-10T00:00:00.000Z",
      dateTo: "2024-03-14T00:00:00.000Z",
      guests: 4,
      venue: {
        id: "venue-visited-2",
        name: "Beachfront Villa",
        price: 280,
        media: [
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
            alt: "Beachfront Villa"
          }
        ],
        description: "Luxury beachfront property with private beach access and modern amenities."
      }
    },
    {
      id: "booking-3",
      dateFrom: "2024-04-05T00:00:00.000Z",
      dateTo: "2024-04-08T00:00:00.000Z",
      guests: 1,
      venue: {
        id: "venue-visited-3",
        name: "City Center Apartment",
        price: 95,
        media: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
            alt: "City Center Apartment"
          }
        ],
        description: "Modern apartment in the heart of the city, perfect for business travelers."
      }
    }
  ],
  venues: [
    {
      id: "venue-1",
      name: "Luxury Seaside Resort",
      description: "A beautiful seaside resort with stunning ocean views, private beach access, and world-class amenities. Perfect for romantic getaways or family vacations.",
      price: 350,
      ownerId: "john_doe",
      media: [
        {
          url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
          alt: "Luxury Seaside Resort exterior"
        }
      ],
      _count: {
        bookings: 23
      }
    },
    {
      id: "venue-2",
      name: "Historic Downtown Loft",
      description: "Charming loft in the heart of the historic district. Features exposed brick walls, high ceilings, and modern amenities. Walking distance to restaurants and shops.",
      price: 150,
      ownerId: "john_doe",
      media: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
          alt: "Historic Downtown Loft interior"
        }
      ],
      _count: {
        bookings: 18
      }
    },
    {
      id: "venue-3",
      name: "Mountain View Cabin",
      description: "Rustic cabin with breathtaking mountain views. Features a cozy fireplace, full kitchen, and outdoor deck. Perfect for nature lovers and hikers.",
      price: 200,
      ownerId: "jane_smith",
      media: [
        {
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
          alt: "Mountain View Cabin exterior"
        }
      ],
      _count: {
        bookings: 15
      }
    },
    {
      id: "venue-4",
      name: "Modern City Penthouse",
      description: "Stunning penthouse with panoramic city views. Features luxury furnishings, rooftop terrace, and state-of-the-art amenities. Ideal for business travelers.",
      price: 500,
      ownerId: "john_doe",
      media: [
        {
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop",
          alt: "Modern City Penthouse view"
        }
      ],
      _count: {
        bookings: 31
      }
    }
  ]
};

// Mock admin data - multiple users for admin view
const mockAdminProfiles = [
  {
    name: "john_doe",
    email: "john.doe@stud.noroff.no",
    bio: "Passionate traveler and venue manager. I love discovering unique places and sharing amazing experiences.",
    avatar: {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      alt: "John Doe's avatar"
    },
    venueManager: true,
    _count: { bookings: 12, venues: 4 }
  },
  {
    name: "jane_smith",
    email: "jane.smith@stud.noroff.no",
    bio: "Travel enthusiast and photographer. Always looking for the perfect sunset and cozy accommodations.",
    avatar: {
      url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      alt: "Jane Smith's avatar"
    },
    venueManager: false,
    _count: { bookings: 8, venues: 0 }
  },
  {
    name: "mike_wilson",
    email: "mike.wilson@stud.noroff.no",
    bio: "Business traveler and venue owner. I specialize in luxury accommodations for corporate guests.",
    avatar: {
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      alt: "Mike Wilson's avatar"
    },
    venueManager: true,
    _count: { bookings: 15, venues: 7 }
  },
  {
    name: "sarah_jones",
    email: "sarah.jones@stud.noroff.no",
    bio: "Digital nomad and travel blogger. I love finding unique stays around the world.",
    avatar: {
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      alt: "Sarah Jones's avatar"
    },
    venueManager: false,
    _count: { bookings: 22, venues: 0 }
  },
  {
    name: "alex_brown",
    email: "alex.brown@stud.noroff.no",
    bio: "Real estate investor and hospitality expert. I manage a portfolio of vacation rentals.",
    avatar: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      alt: "Alex Brown's avatar"
    },
    venueManager: true,
    _count: { bookings: 6, venues: 12 }
  }
];

export default function MockProfile() {
  const navigate = useNavigate();
  const profile = mockProfile;
  const [isAdminView, setIsAdminView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByVenueManager, setFilterByVenueManager] = useState('all');

  const handleBookingClick = (booking) => {
    // Navigate to the venue page instead of opening a modal
    navigate(`/venues/${booking.venue.id}`);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  const handleAdminToggle = () => {
    setIsAdminView(!isAdminView);
  };

  // Filter admin profiles based on search and filter criteria
  const getFilteredProfiles = () => {
    let filtered = [...mockAdminProfiles];

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

    return filtered;
  };

  // Check if user owns a venue
  const userOwnsVenue = (venue) => {
    return venue.ownerId === profile.name;
  };

  // Get venues owned by current user (for venue managers)
  const ownedVenues = profile.venues?.filter(venue => userOwnsVenue(venue)) || [];

  // Get unique venues from bookings (for previous visits)
  const visitedVenues = profile.bookings?.map(booking => ({
    ...booking.venue,
    lastVisited: booking.dateTo,
    rating: Math.floor(Math.random() * 2) + 4 // Random rating 4-5 stars
  })) || [];

  const filteredProfiles = getFilteredProfiles();

  // Render Admin View
  if (isAdminView) {
    // Use admin profile data (first admin profile as the "current admin")
    const adminProfile = mockAdminProfiles[0]; // Use john_doe as admin
    
    return (
      <div className="max-w-4xl mx-auto p-4">
        {/* Development Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-2">⚠️</div>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800">Development Mode - Mock Admin View</h3>
                <p className="text-sm text-yellow-700">
                  Showing mock admin profile data. No API calls are made in this view.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-yellow-800">Admin View</span>
              <button
                onClick={handleAdminToggle}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-red-600 hover:bg-red-700"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
              <span className="text-xs text-yellow-700">
                Click to go back to Profile
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          {/* Profile Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">Admin Profile</h1>
            <Link
              to="/profile/edit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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
            {adminProfile.avatar?.url && (
              <img
                src={adminProfile.avatar.url}
                alt={adminProfile.avatar.alt || 'Profile avatar'}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{adminProfile.name}</h2>
              <p className="text-gray-600">{adminProfile.email}</p>
              {adminProfile.bio && <p className="mt-2">{adminProfile.bio}</p>}
              <p className="mt-2">
                <span className="inline-block px-2 py-1 rounded text-sm bg-red-100 text-red-800">
                  Administrator
                </span>
                <span className={`inline-block px-2 py-1 rounded text-sm ml-2 ${
                  adminProfile.venueManager 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {adminProfile.venueManager ? 'Venue Manager' : 'Customer'}
                </span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{mockAdminProfiles.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold">Venue Managers</h3>
              <p className="text-2xl font-bold">
                {mockAdminProfiles.filter(p => p.venueManager).length}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Bookings Section */}
        {profile?.bookings && profile.bookings.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Recent Platform Bookings</h3>
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

        {/* Admin Venues Section */}
        {ownedVenues.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Platform Venues</h3>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm">
                + Add New Venue
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedVenues.map((venue) => (
                <div 
                  key={venue.id} 
                  className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => handleVenueClick(venue.id)}
                >
                  {/* Admin badge instead of Owner badge */}
                  <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                    Admin
                  </div>
                  
                  {venue.media?.[0]?.url && (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-blue-600 hover:text-blue-800">{venue.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">${venue.price}/night</span>
                    <span className="text-sm text-gray-600">
                      {venue._count?.bookings || 0} bookings
                    </span>
                  </div>
                  
                  {/* Admin management buttons */}
                  <div className="flex space-x-2 mt-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/venues/manage/${venue.id}`);
                      }}
                      className="flex-1 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Manage
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('View all bookings for this venue');
                      }}
                      className="flex-1 bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Profile View (existing code)
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Development Notice with Toggle */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Development Mode</h3>
              <p className="text-sm text-yellow-700">
                Showing mock profile data while API issues are resolved. 
                User type: {profile.venueManager ? 'Venue Manager' : 'Regular User'}
              </p>
            </div>
          </div>
          
          {/* Admin/User Toggle Button */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-yellow-800">
              Profile View
            </span>
            <button
              onClick={handleAdminToggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600 hover:bg-blue-700"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
            <span className="text-xs text-yellow-700">
              Click for Mock Admin view
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Link
            to="/profile/edit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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

        {/* Stats */}
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
        ownedVenues.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Venues</h3>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm">
                + Add New Venue
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedVenues.map((venue) => (
                <div 
                  key={venue.id} 
                  className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => handleVenueClick(venue.id)}
                >
                  {/* Owner badge */}
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    Owner
                  </div>
                  
                  {venue.media?.[0]?.url && (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-blue-600 hover:text-blue-800">{venue.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">${venue.price}/night</span>
                    <span className="text-sm text-gray-600">
                      {venue._count?.bookings || 0} bookings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        // Regular User View: My Previous Visits
        visitedVenues.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">My Previous Visits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visitedVenues.map((venue) => (
                <div 
                  key={venue.id} 
                  className="border rounded p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleVenueClick(venue.id)}
                >
                  {venue.media?.[0]?.url && (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0].alt || venue.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-blue-600 hover:text-blue-800">{venue.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{venue.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">${venue.price}/night</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm text-gray-600">{venue.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last visited: {new Date(venue.lastVisited).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
} 