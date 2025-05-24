import React from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">About Holidaze</h1>
      
      <div className="prose prose-lg mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to Holidaze</h2>
          <p className="text-gray-700 text-center mb-6">
            Your premier destination for discovering and booking unique venues for unforgettable experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-700">
              At Holidaze, we connect travelers with exceptional venues around the world. 
              Whether you're planning a romantic getaway, family vacation, or business trip, 
              we help you find the perfect place to stay.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">For Venue Owners</h3>
            <p className="text-gray-700">
              We provide venue managers with powerful tools to showcase their properties, 
              manage bookings, and connect with guests from around the globe. 
              Join our platform and grow your hospitality business.
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-4">Why Choose Holidaze?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🏨</div>
              <h4 className="font-semibold mb-2">Curated Venues</h4>
              <p className="text-gray-600 text-sm">
                Hand-picked accommodations that meet our quality standards
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-gray-600 text-sm">
                Competitive rates and transparent pricing with no hidden fees
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌟</div>
              <h4 className="font-semibold mb-2">Quality Service</h4>
              <p className="text-gray-600 text-sm">
                24/7 customer support to ensure your perfect stay
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to Start Your Journey?</h3>
          <p className="text-gray-700 mb-4">
            Discover amazing venues and create memories that will last a lifetime.
          </p>
          <div className="space-x-4">
            <Link 
              to="/venues" 
              className="inline-block btn-primary px-6 py-2 rounded-lg transition duration-200"
            >
              Browse Venues
            </Link>
            <Link 
              to="/venues" 
              className="inline-block btn-outline px-6 py-2 rounded-lg transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs; 