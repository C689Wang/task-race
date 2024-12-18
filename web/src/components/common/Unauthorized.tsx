import React from 'react';
import Link from 'next/link';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-300 text-lg mb-8">
          Oops! Looks like you haven&apos;t created an account yet. Take a selfie to get started!
        </p>
        <Link 
          href="/" 
          className="bg-zinc-800/30 hover:bg-zinc-900 text-white font-bold py-3 px-6 rounded transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized; 