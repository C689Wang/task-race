import React from 'react';
import Link from 'next/link';

interface ErrorProps {
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ message = 'Something went wrong' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-300 text-lg mb-6">{message}</p>
        <Link 
          href="/" 
          className="text-sm text-[#ccc] hover:text-[#ecf0f1] transition duration-300 underline"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Error; 