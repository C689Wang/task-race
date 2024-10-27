import { Scanner } from '@yudiel/react-qr-scanner';
import Link from 'next/link';
import Image from 'next/image';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import Webcam from 'react-webcam';

type HomeProps = {
  isNewUser: boolean;
  setIsNewUser: Dispatch<SetStateAction<boolean>>;
  user: string | undefined;
  webcamRef: RefObject<Webcam>;
  image: string | null;
  captureImage: () => void;
  retakeImage: () => void;
  createUser: (image: string) => Promise<void>;
};

const LandingComponent: React.FC<HomeProps> = ({
  isNewUser,
  setIsNewUser,
  user,
  webcamRef,
  image,
  captureImage,
  retakeImage,
  createUser,
}) => {
  const renderCameraComponent = () => {
    if (image) {
      return (
        <div className="mb-10 flex flex-col justify-center items-center gap-2 md:mb-0">
          <Image width={500} height={500} src={image || ''} alt="Taken photo" />
          <div
            className="w-64 flex w-auto justify-between"
            style={{ gap: '16px' }}
          >
            <button
              className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => createUser(image)}
            >
              Submit
            </button>
            <button
              className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => retakeImage()}
            >
              Retake
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-5 flex flex-col items-center justify-center md:mb-0">
          <Webcam ref={webcamRef} height={500} width={500} />
          <button
            className="bg-blue-500 w-32 h-12 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
            onClick={captureImage}
          >
            Take photo
          </button>
        </div>
      );
    }
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between py-12 px-6`}
    >
      <div className="flex justify-center z-10 max-w-5xl w-full items-center lg:justify-between font-mono text-sm">
        <p className="border-b border-gray-300 dark:border-neutral-800 dark:from-inherit w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          Get started by taking a selfie! Or click{' '}
          <a
            className="underline hover:text-purple-400 cursor-pointer"
            onClick={() => setIsNewUser(false)}
          >
            here
          </a>{' '}
          if you already have a QR code!
        </p>
        <div
          className="fixed bottom-0 left-0 flex h-12 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none pb-8 md:pb-0 bold"
          style={{ gap: '16px' }}
        >
          {user && (
            <Link href="/QR" className="underline hover:text-purple-400">
              My QR
            </Link>
          )}
          <Link href="/album" className="underline hover:text-purple-400">
            Album
          </Link>
          <Link href="/leaderboard" className="underline hover:text-purple-400">
            Leaderboard
          </Link>
        </div>
      </div>
      {isNewUser ? (
        renderCameraComponent()
      ) : (
        <Scanner
          onScan={() => {}}
          styles={{
            container: {
              maxWidth: 500,
              maxHeight: 500,
              width: '100vw',
              height: '100vh',
              margin: 24,
            },
          }}
        />
      )}
    </main>
  );
};
export default LandingComponent;
