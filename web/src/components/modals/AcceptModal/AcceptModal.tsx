import React from 'react';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

interface AcceptModalProps {
  userId: string;
  onAccept: () => void;
  onDecline: () => void;
}

const AcceptModal: React.FC<AcceptModalProps> = ({
  userId,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="flex max-w-sm px-4 py-3 mt-2 bg-gray-800 text-gray-300 shadow-lg rounded-lg z-50">
      <div className="flex items-center justify-between">
        <span className="text-md font-semibold">
          {`User ${userId} has requested you a race!`}
        </span>
        <div className="flex space-x-4 ml-2">
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
