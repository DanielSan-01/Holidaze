import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AmenityStoryCards = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const amenityStories = [
    {
      id: 'wifi',
      title: 'WiFi',
      description: 'Stay connected with high-speed internet',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'parking',
      title: 'Parking',
      description: 'Convenient parking for your vehicle',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      id: 'breakfast',
      title: 'Breakfast',
      description: 'Start your day with delicious meals',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'pets',
      title: 'Pet-friendly',
      description: 'Bring your furry friends along',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      id: 'pool',
      title: 'Pool',
      description: 'Relax and unwind by the water',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'spa',
      title: 'Spa',
      description: 'Rejuvenate with luxury treatments',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&crop=center',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const handleCardClick = (amenityId) => {
    // Navigate to venues page with amenity filter
    navigate(`/venues?${amenityId}=true`);
  };

  const handleKeyDown = (e, amenityId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(amenityId);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Discover your next booking by your favorite amenities
          </h2>
          <p className="text-gray-600 text-lg">
            Find the perfect stay with the amenities that matter most to you
          </p>
        </div>

        {/* Scrollable Cards Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {amenityStories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 w-80 h-96 relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => handleCardClick(story.id)}
                onKeyDown={(e) => handleKeyDown(e, story.id)}
                tabIndex={0}
                role="button"
                aria-label={`Browse venues with ${story.title} amenity`}
              >
                {/* Background Image */}
                <img
                  src={story.image}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${story.gradient} opacity-70`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="transform transition-transform duration-300 hover:translate-y-[-4px]">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                      {story.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
                      {story.description}
                    </p>
                    
                    {/* Call to Action */}
                    <div className="mt-4 flex items-center text-white/90 text-sm font-medium">
                      <span>Explore venues</span>
                      <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Subtle Border */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex space-x-2">
            {amenityStories.slice(0, 4).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AmenityStoryCards; 