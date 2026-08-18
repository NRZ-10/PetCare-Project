import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <SearchX className="w-20 h-20 text-red-500" />
      </div>
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
