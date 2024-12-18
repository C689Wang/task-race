import Image from 'next/image';
import React from 'react';

interface WinnerModalProps {
  onClose: () => void;
  hasWon: boolean;
  winningPhoto: string;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  onClose,
  hasWon,
  winningPhoto,
}) => {
  const modalText = () => {
    if (hasWon) {
      return 'Nice! You have won the race.';
    } else {
      return 'You lost this time! Better luck next time.';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="flex w-full max-w-md bg-gray-800 text-gray-300 rounded-lg shadow-lg p-6 items-center flex-col">
        <h2 className="text-xl font-bold mb-4 text-center">{modalText()}</h2>
        <div className="flex flex-col items-center space-y-4">
          <Image
            width={500}
            height={500}
            src={winningPhoto}
            alt="Winning photo"
          />
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500"
        >
          Leave
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
