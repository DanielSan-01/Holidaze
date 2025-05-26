import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth';

// Mock profile data
const mockProfile = {
  name: "demo_manager",
  email: "demo.manager@stud.noroff.no",
  bio: "Demo venue manager account showcasing the powerful management tools available on Holidaze. Experience how easy it is to manage your properties and track your revenue.",
  avatar: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    alt: "Demo Manager's avatar"
  },
  banner: {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
    alt: "Demo Manager's banner"
  },
  venueManager: true,
  _count: {
    bookings: 28,
    venues: 5
  }
};

// Mock venues with detailed booking data for demo
const mockVenues = [
    {
    id: "demo-venue-1",
    name: "Luxury Seaside Resort",
    description: "A beautiful seaside resort with stunning ocean views, private beach access, and world-class amenities. Perfect for romantic getaways or family vacations.",
    price: 350,
    maxGuests: 8,
    rating: 4.8,
    created: "2024-01-15T00:00:00.000Z",
    updated: "2024-01-20T00:00:00.000Z",
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: false
    },
    location: {
      address: "123 Ocean Drive",
      city: "Miami Beach",
      zip: "33139",
      country: "USA",
      continent: "North America",
      lat: 25.7617,
      lng: -80.1918
    },
        media: [
          {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
        alt: "Luxury Seaside Resort exterior"
          }
        ],
    owner: {
      name: "demo_manager",
      email: "demo.manager@stud.noroff.no",
      bio: "Demo venue manager",
      avatar: {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        alt: "Demo Manager's avatar"
      },
      banner: {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
        alt: "Demo Manager's banner"
      },
      venueManager: true
    },
    bookings: [
    {
        id: "booking-1",
        dateFrom: "2025-01-25T00:00:00.000Z",
        dateTo: "2025-01-28T00:00:00.000Z",
      guests: 4,
        created: "2024-12-01T00:00:00.000Z",
        updated: "2024-12-01T00:00:00.000Z",
        customer: {
          name: "sarah_johnson",
          email: "sarah.johnson@example.com",
          avatar: {
            url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            alt: "Sarah Johnson's avatar"
          }
        },
      venue: {
          id: "demo-venue-1",
          name: "Luxury Seaside Resort",
        media: [
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
              alt: "Luxury Seaside Resort exterior"
            }
          ]
      }
    },
    {
        id: "booking-2",
        dateFrom: "2025-02-10T00:00:00.000Z",
        dateTo: "2025-02-14T00:00:00.000Z",
        guests: 2,
        created: "2024-12-05T00:00:00.000Z",
        updated: "2024-12-05T00:00:00.000Z",
        customer: {
          name: "mike_wilson",
          email: "mike.wilson@example.com",
          avatar: {
            url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            alt: "Mike Wilson's avatar"
      }
        },
        venue: {
          id: "demo-venue-1",
      name: "Luxury Seaside Resort",
      media: [
        {
          url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
          alt: "Luxury Seaside Resort exterior"
            }
          ]
        }
        }
      ],
      _count: {
        bookings: 23
      }
    },
    {
    id: "demo-venue-2",
      name: "Historic Downtown Loft",
      description: "Charming loft in the heart of the historic district. Features exposed brick walls, high ceilings, and modern amenities. Walking distance to restaurants and shops.",
      price: 150,
    maxGuests: 4,
    rating: 4.6,
    created: "2024-02-10T00:00:00.000Z",
    updated: "2024-02-15T00:00:00.000Z",
    meta: {
      wifi: true,
      parking: false,
      breakfast: false,
      pets: true
    },
    location: {
      address: "456 Historic Street",
      city: "Charleston",
      zip: "29401",
      country: "USA",
      continent: "North America",
      lat: 32.7765,
      lng: -79.9311
    },
      media: [
        {
          url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
          alt: "Historic Downtown Loft interior"
        }
      ],
    owner: {
      name: "demo_manager",
      email: "demo.manager@stud.noroff.no"
    },
    bookings: [
      {
        id: "booking-3",
        dateFrom: "2025-01-15T00:00:00.000Z",
        dateTo: "2025-01-18T00:00:00.000Z",
        guests: 2,
        created: "2024-12-10T00:00:00.000Z",
        updated: "2024-12-10T00:00:00.000Z",
        customer: {
          name: "alex_brown",
          email: "alex.brown@example.com",
          avatar: {
            url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            alt: "Alex Brown's avatar"
          }
        },
        venue: {
          id: "demo-venue-2",
          name: "Historic Downtown Loft",
          media: [
            {
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
              alt: "Historic Downtown Loft interior"
            }
          ]
        }
        }
      ],
      _count: {
        bookings: 18
      }
    },
    {
    id: "demo-venue-3",
      name: "Mountain View Cabin",
      description: "Rustic cabin with breathtaking mountain views. Features a cozy fireplace, full kitchen, and outdoor deck. Perfect for nature lovers and hikers.",
      price: 200,
    maxGuests: 6,
    rating: 4.9,
    created: "2024-03-05T00:00:00.000Z",
    updated: "2024-03-10T00:00:00.000Z",
    meta: {
      wifi: false,
      parking: true,
      breakfast: false,
      pets: true
    },
    location: {
      address: "789 Mountain Trail",
      city: "Aspen",
      zip: "81611",
      country: "USA",
      continent: "North America",
      lat: 39.1911,
      lng: -106.8175
    },
      media: [
        {
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
          alt: "Mountain View Cabin exterior"
        }
      ],
    owner: {
      name: "demo_manager",
      email: "demo.manager@stud.noroff.no"
    },
    bookings: [
    {
        id: "booking-4",
        dateFrom: "2025-02-01T00:00:00.000Z",
        dateTo: "2025-02-05T00:00:00.000Z",
        guests: 4,
        created: "2024-12-15T00:00:00.000Z",
        updated: "2024-12-15T00:00:00.000Z",
        customer: {
          name: "emma_davis",
          email: "emma.davis@example.com",
          avatar: {
            url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            alt: "Emma Davis's avatar"
          }
        },
        venue: {
          id: "demo-venue-3",
          name: "Mountain View Cabin",
          media: [
            {
              url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
              alt: "Mountain View Cabin exterior"
            }
          ]
        }
      },
      {
        id: "booking-5",
        dateFrom: "2025-02-20T00:00:00.000Z",
        dateTo: "2025-02-23T00:00:00.000Z",
        guests: 6,
        created: "2024-12-18T00:00:00.000Z",
        updated: "2024-12-18T00:00:00.000Z",
        customer: {
          name: "david_miller",
          email: "david.miller@example.com",
          avatar: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            alt: "David Miller's avatar"
          }
        },
        venue: {
          id: "demo-venue-3",
          name: "Mountain View Cabin",
      media: [
        {
              url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
              alt: "Mountain View Cabin exterior"
            }
          ]
        }
        }
      ],
      _count: {
      bookings: 15
      }
    }
];

// Add more venues to reach the 5 venues count
mockVenues.push(
  {
    id: "demo-venue-4",
    name: "Urban Studio Apartment",
    description: "Modern studio apartment in the heart of downtown. Perfect for business travelers and solo adventurers. Features high-speed wifi and a fully equipped kitchenette.",
    price: 95,
    maxGuests: 2,
    rating: 4.4,
    created: "2024-04-01T00:00:00.000Z",
    updated: "2024-04-05T00:00:00.000Z",
    meta: {
      wifi: true,
      parking: false,
      breakfast: false,
      pets: false
    },
    location: {
      address: "321 Downtown Ave",
      city: "New York",
      zip: "10001",
      country: "USA",
      continent: "North America",
      lat: 40.7128,
      lng: -74.0060
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
        alt: "Urban Studio Apartment interior"
      }
    ],
    owner: {
      name: "demo_manager",
      email: "demo.manager@stud.noroff.no"
    },
    bookings: [
      {
        id: "booking-6",
        dateFrom: "2025-01-20T00:00:00.000Z",
        dateTo: "2025-01-25T00:00:00.000Z",
        guests: 1,
        created: "2024-12-12T00:00:00.000Z",
        updated: "2024-12-12T00:00:00.000Z",
        customer: {
          name: "lisa_chen",
          email: "lisa.chen@example.com",
    avatar: {
      url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            alt: "Lisa Chen's avatar"
          }
    },
        venue: {
          id: "demo-venue-4",
          name: "Urban Studio Apartment",
          media: [
            {
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
              alt: "Urban Studio Apartment interior"
            }
          ]
        }
      }
    ],
    _count: {
      bookings: 12
    }
  },
  {
    id: "demo-venue-5",
    name: "Countryside Villa",
    description: "Spacious villa surrounded by rolling hills and vineyards. Perfect for family gatherings and romantic retreats. Features a private pool and outdoor dining area.",
    price: 280,
    maxGuests: 10,
    rating: 4.7,
    created: "2024-05-10T00:00:00.000Z",
    updated: "2024-05-15T00:00:00.000Z",
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: true
    },
    location: {
      address: "567 Vineyard Road",
      city: "Napa Valley",
      zip: "94558",
      country: "USA",
      continent: "North America",
      lat: 38.2975,
      lng: -122.2869
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
        alt: "Countryside Villa exterior"
      }
    ],
    owner: {
      name: "demo_manager",
      email: "demo.manager@stud.noroff.no"
    },
    bookings: [
      {
        id: "booking-7",
        dateFrom: "2025-03-15T00:00:00.000Z",
        dateTo: "2025-03-20T00:00:00.000Z",
        guests: 8,
        created: "2024-12-20T00:00:00.000Z",
        updated: "2024-12-20T00:00:00.000Z",
        customer: {
          name: "robert_taylor",
          email: "robert.taylor@example.com",
    avatar: {
            url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            alt: "Robert Taylor's avatar"
          }
        },
        venue: {
          id: "demo-venue-5",
          name: "Countryside Villa",
          media: [
            {
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
              alt: "Countryside Villa exterior"
            }
          ]
        }
      },
      {
        id: "booking-8",
        dateFrom: "2025-04-10T00:00:00.000Z",
        dateTo: "2025-04-14T00:00:00.000Z",
        guests: 6,
        created: "2024-12-22T00:00:00.000Z",
        updated: "2024-12-22T00:00:00.000Z",
        customer: {
          name: "maria_garcia",
          email: "maria.garcia@example.com",
    avatar: {
            url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            alt: "Maria Garcia's avatar"
          }
        },
        venue: {
          id: "demo-venue-5",
          name: "Countryside Villa",
          media: [
            {
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
              alt: "Countryside Villa exterior"
            }
          ]
        }
      }
    ],
    _count: {
      bookings: 19
    }
  }
);

// Mock revenue stats for demo
const mockRevenueStats = {
  totalUpcomingRevenue: 18750,
  monthlyRevenue: 12400,
  averageBookingValue: 1250,
  totalBookings: 15,
  occupancyRate: 82.3,
  topPerformingVenue: {
    id: "demo-venue-1",
    name: "Luxury Seaside Resort",
    revenue: 7350,
    bookingCount: 8
  }
};

// Revenue Dashboard Component (copied from the real one)
const RevenueDashboard = ({ revenueStats }) => {
    return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Upcoming Revenue */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-green-600">Total Upcoming Revenue</p>
              <p className="text-2xl font-bold text-green-800">
                ${revenueStats.totalUpcomingRevenue.toLocaleString()}
                </p>
              </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Next 30 Days Revenue */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Next 30 Days</p>
              <p className="text-2xl font-bold text-blue-800">
                ${revenueStats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
          </div>
            </div>
        </div>

        {/* Average Booking Value */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-purple-800">
                ${revenueStats.averageBookingValue.toLocaleString()}
              </p>
            </div>
            <div className="text-purple-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
                    <div>
              <p className="text-sm font-medium text-orange-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-orange-800">
                {revenueStats.occupancyRate.toFixed(1)}%
              </p>
                    </div>
            <div className="text-orange-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
                    </div>
                  </div>
                </div>
            </div>
          </div>
  );
};

// Venue Card Component (simplified version)
const VenueCard = ({ venue, onClick, showOwnerBadge = false, onViewCalendar }) => {
  const handleViewCalendar = (e) => {
    e.stopPropagation();
    if (onViewCalendar) {
      onViewCalendar(venue);
    }
  };

  return (
                <div 
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => onClick(venue.id)}
                >
                  {venue.media?.[0]?.url && (
                    <img
                      src={venue.media[0].url}
          alt={venue.name}
          className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-blue-600 hover:text-blue-800 flex-1">
            {venue.name}
          </h4>
          {showOwnerBadge && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
              Owner
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {venue.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">${venue.price}/night</span>
          <span className="text-sm text-gray-500">
                      {venue._count?.bookings || 0} bookings
                    </span>
                  </div>
                  
        {/* Action buttons for venue managers */}
                  <div className="flex space-x-2 mt-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
              alert('Demo: Edit venue functionality');
                      }}
            className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
            Edit
                    </button>
                    <button 
            onClick={handleViewCalendar}
                      className="flex-1 bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
            Calendar
                    </button>
                  </div>
                </div>
      </div>
    );
};

export default function MockProfile() {
  const navigate = useNavigate();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedVenueForCalendar, setSelectedVenueForCalendar] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Manually created upcoming bookings for demo
  const upcomingBookings = [
    {
      id: "booking-1",
      dateFrom: "2025-01-25T00:00:00.000Z",
      dateTo: "2025-01-28T00:00:00.000Z",
      guests: 4,
      created: "2024-12-01T00:00:00.000Z",
      updated: "2024-12-01T00:00:00.000Z",
      customer: {
        name: "sarah_johnson",
        email: "sarah.johnson@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          alt: "Sarah Johnson's avatar"
        }
      },
      venue: {
        id: "demo-venue-1",
        name: "Luxury Seaside Resort",
        media: [
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
            alt: "Luxury Seaside Resort exterior"
          }
        ]
      }
    },
    {
      id: "booking-2",
      dateFrom: "2025-02-10T00:00:00.000Z",
      dateTo: "2025-02-14T00:00:00.000Z",
      guests: 2,
      created: "2024-12-05T00:00:00.000Z",
      updated: "2024-12-05T00:00:00.000Z",
      customer: {
        name: "mike_wilson",
        email: "mike.wilson@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          alt: "Mike Wilson's avatar"
        }
      },
      venue: {
        id: "demo-venue-1",
        name: "Luxury Seaside Resort",
        media: [
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop",
            alt: "Luxury Seaside Resort exterior"
          }
        ]
      }
    },
    {
      id: "booking-3",
      dateFrom: "2025-01-15T00:00:00.000Z",
      dateTo: "2025-01-18T00:00:00.000Z",
      guests: 2,
      created: "2024-12-10T00:00:00.000Z",
      updated: "2024-12-10T00:00:00.000Z",
      customer: {
        name: "alex_brown",
        email: "alex.brown@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          alt: "Alex Brown's avatar"
        }
      },
      venue: {
        id: "demo-venue-2",
        name: "Historic Downtown Loft",
        media: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
            alt: "Historic Downtown Loft interior"
          }
        ]
      }
    },
    {
      id: "booking-4",
      dateFrom: "2025-02-01T00:00:00.000Z",
      dateTo: "2025-02-05T00:00:00.000Z",
      guests: 4,
      created: "2024-12-15T00:00:00.000Z",
      updated: "2024-12-15T00:00:00.000Z",
      customer: {
        name: "emma_davis",
        email: "emma.davis@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          alt: "Emma Davis's avatar"
        }
      },
      venue: {
        id: "demo-venue-3",
        name: "Mountain View Cabin",
        media: [
          {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
            alt: "Mountain View Cabin exterior"
          }
        ]
      }
    },
    {
      id: "booking-5",
      dateFrom: "2025-02-20T00:00:00.000Z",
      dateTo: "2025-02-23T00:00:00.000Z",
      guests: 6,
      created: "2024-12-18T00:00:00.000Z",
      updated: "2024-12-18T00:00:00.000Z",
      customer: {
        name: "david_miller",
        email: "david.miller@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          alt: "David Miller's avatar"
        }
      },
      venue: {
        id: "demo-venue-3",
        name: "Mountain View Cabin",
        media: [
          {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
            alt: "Mountain View Cabin exterior"
          }
        ]
      }
    },
    {
      id: "booking-6",
      dateFrom: "2025-01-20T00:00:00.000Z",
      dateTo: "2025-01-25T00:00:00.000Z",
      guests: 1,
      created: "2024-12-12T00:00:00.000Z",
      updated: "2024-12-12T00:00:00.000Z",
      customer: {
        name: "lisa_chen",
        email: "lisa.chen@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          alt: "Lisa Chen's avatar"
        }
      },
      venue: {
        id: "demo-venue-4",
        name: "Urban Studio Apartment",
        media: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop",
            alt: "Urban Studio Apartment interior"
          }
        ]
      }
    },
    {
      id: "booking-7",
      dateFrom: "2025-03-15T00:00:00.000Z",
      dateTo: "2025-03-20T00:00:00.000Z",
      guests: 8,
      created: "2024-12-20T00:00:00.000Z",
      updated: "2024-12-20T00:00:00.000Z",
      customer: {
        name: "robert_taylor",
        email: "robert.taylor@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          alt: "Robert Taylor's avatar"
        }
      },
      venue: {
        id: "demo-venue-5",
        name: "Countryside Villa",
        media: [
          {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
            alt: "Countryside Villa exterior"
          }
        ]
      }
    },
    {
      id: "booking-8",
      dateFrom: "2025-04-10T00:00:00.000Z",
      dateTo: "2025-04-14T00:00:00.000Z",
      guests: 6,
      created: "2024-12-22T00:00:00.000Z",
      updated: "2024-12-22T00:00:00.000Z",
      customer: {
        name: "maria_garcia",
        email: "maria.garcia@example.com",
        avatar: {
          url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          alt: "Maria Garcia's avatar"
        }
      },
      venue: {
        id: "demo-venue-5",
        name: "Countryside Villa",
        media: [
          {
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop",
            alt: "Countryside Villa exterior"
          }
        ]
      }
    }
  ];

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  const handleCreateVenue = () => {
    alert('Demo: Create venue functionality - Sign up to access full features!');
  };

  const handleEditVenue = (venueId) => {
    alert('Demo: Edit venue functionality - Sign up to access full features!');
  };

  const handleViewCalendar = (venue) => {
    setSelectedVenueForCalendar(venue);
    setShowCalendarModal(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendarModal(false);
    setSelectedVenueForCalendar(null);
  };

  const openRegisterModal = () => {
    setIsAuthModalOpen(true);
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-2xl font-bold mb-2">🎯 Venue Manager Demo Dashboard</h1>
            <p className="text-blue-100">
              Experience the power of our venue management tools. This is a preview of what you'll get as a venue manager.
              </p>
            </div>
          <button
            onClick={openRegisterModal}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
          </div>

      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
            <img
            src={mockProfile.avatar.url} 
            alt={mockProfile.avatar.alt}
              className="w-20 h-20 rounded-full object-cover"
            />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{mockProfile.name}</h2>
            <p className="text-gray-600">{mockProfile.email}</p>
            <p className="text-gray-700 mt-2">{mockProfile.bio}</p>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              ✓ Venue Manager
              </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Total Bookings</h3>
            <p className="text-2xl font-bold">{mockProfile._count.bookings}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Venues Owned</h3>
            <p className="text-2xl font-bold">{mockProfile._count.venues}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Revenue Dashboard */}
        <RevenueDashboard revenueStats={mockRevenueStats} />

        {/* My Venues Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">My Venues</h3>
          
          <div className="flex gap-3 mb-6">
            <button 
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm" 
              onClick={handleCreateVenue}
            >
              + Add New Venue
            </button>
            <button 
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
              onClick={() => alert('Demo: Edit venue selector - Sign up to access full features!')}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Venue
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={handleVenueClick}
                showOwnerBadge={true}
                onViewCalendar={handleViewCalendar}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Bookings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Bookings for My Venues</h3>
          
          {upcomingBookings.length > 0 ? (
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
                            onClick={() => handleVenueClick(booking.venue.id)}>
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
                      ${(calculateNights(booking.dateFrom, booking.dateTo) * (mockVenues.find(v => v.id === booking.venue.id)?.price || 0)).toLocaleString()}
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

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to Start Managing Your Venues?</h3>
          <p className="mb-4">
            Join thousands of successful venue managers who use Holidaze to grow their business.
          </p>
          <div className="space-x-4">
            <button
              onClick={openRegisterModal}
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign Up Free
            </button>
            <Link 
              to="/venues" 
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Venues
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Calendar Modal */}
      {showCalendarModal && selectedVenueForCalendar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseCalendar}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedVenueForCalendar.media?.[0]?.url && (
                    <img 
                      src={selectedVenueForCalendar.media[0].url} 
                      alt={selectedVenueForCalendar.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedVenueForCalendar.name}</h2>
                    <p className="text-sm text-gray-600">Demo Booking Calendar</p>
                    </div>
                  </div>
                <button
                  onClick={handleCloseCalendar}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">Interactive Calendar</h3>
                <p className="text-gray-600 mb-4">
                  In the full version, you'll see an interactive calendar with all your bookings, 
                  availability management, and booking details.
                </p>
                <Link 
                  to="/register" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up to Access Full Calendar
                </Link>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
    </div>
  );
} 