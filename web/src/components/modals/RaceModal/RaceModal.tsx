import Spinner from '@/components/common/Spinner';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface RaceModalProps {
  onClose: () => void;
  view: 'Lobby' | 'Game';
  loading: boolean;
  handleSubmit: (image: string) => void;
  prompt?: string;
}

const RaceModal: React.FC<RaceModalProps> = ({
  onClose,
  view,
  loading,
  handleSubmit,
  prompt,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const captureImage = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      {view === 'Lobby' ? (
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
      ) : (
        <div className="w-full max-w-md bg-gray-800 text-gray-300 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Race Prompt</h2>
          <p className="text-center mb-6">{prompt}</p>

          {image ? (
            <div className="flex flex-col items-center space-y-4">
              {loading ? (
                <>
                  <p className="text-white mt-6">Submitting Image...</p>
                  <Spinner />
                </>
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={image || ''}
                  alt="Taken photo"
                />
              )}

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setImage(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition"
                >
                  Retake
                </button>
                <button
                  onClick={() => handleSubmit(image)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded">
                <Webcam ref={webcamRef} height={500} width={500} />
              </div>
              <button
                onClick={captureImage}
                className="px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
              >
                Take Picture
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaceModal;
