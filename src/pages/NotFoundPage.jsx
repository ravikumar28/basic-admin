import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;