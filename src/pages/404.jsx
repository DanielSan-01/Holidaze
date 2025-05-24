import React from 'react';
import { Link } from 'react-router-dom';

function FourOhFour() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-4">Page not found</p>
      <Link to="/venues" className="text-gray-600 hover:text-gray-900">
        Venues
      </Link>
    </div>
  );
}

export default FourOhFour; 