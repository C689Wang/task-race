import React from 'react';

interface BattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RaceModal: React.FC<BattleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-80 text-center">
        <h2 className="text-white text-xl mb-4">Waiting on player</h2>
        <div className="flex justify-center space-x-1 mt-2">
          <span className="animate-bounce text-white">.</span>
          <span className="animate-bounce text-white delay-200">.</span>
          <span className="animate-bounce text-white delay-400">.</span>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-red-600 rounded text-white hover:bg-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RaceModal;
