import React from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

interface AcceptModalProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const AcceptModal: React.FC<AcceptModalProps> = ({
  isVisible,
  onAccept,
  onDecline,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full px-4 py-3 bg-gray-800 text-gray-300 shadow-lg rounded-lg z-50">
      <div className="flex items-center justify-between">
        <span className="text-md font-semibold">
          A user has requested you a battle!
        </span>
        <div className="flex space-x-4">
          <button
            onClick={onAccept}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Accept"
          >
            <AiOutlineCheck size={24} />
          </button>
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Decline"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptModal;
