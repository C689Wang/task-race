import React from 'react';
import Spinner from './Spinner';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-32 px-4">
      <Spinner />
      <p className="text-gray-300 mt-4">Loading...</p>
    </div>
  );
};

export default Loading; 