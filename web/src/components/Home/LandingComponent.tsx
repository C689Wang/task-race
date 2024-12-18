import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import Image from 'next/image';
import Link from 'next/link';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import Webcam from 'react-webcam';
import Spinner from '../common/Spinner';

type LandingComponentProps = {
  isNewUser: boolean;
  setIsNewUser: Dispatch<SetStateAction<boolean>>;
  user: string | undefined;
  webcamRef: RefObject<Webcam>;
  image: string | null;
  captureImage: () => void;
  retakeImage: () => void;
  createUser: (image: string) => Promise<void>;
  sendMessage: (message: string) => void;
  submitLoading: boolean;
};

const LandingComponent: React.FC<LandingComponentProps> = ({
  isNewUser,
  setIsNewUser,
  user,
  webcamRef,
  image,
  captureImage,
  retakeImage,
  createUser,
  sendMessage,
  submitLoading,
}) => {
  const processQrCode = (result: IDetectedBarcode[]) => {
    if (result.length == 0) {
      return;
    } else {
      const first = result[0];
      const value = first.rawValue;
      if (value !== user) {
        sendMessage(
          JSON.stringify({
            Action: 'initiate_request',
            Origin: user,
            Target: value,
          })
        );
      }
    }
  };

  const renderCameraComponent = () => {
    if (image) {
      return (
        <div className="mb-10 flex flex-col justify-center items-center gap-2 md:mb-0">
          {submitLoading ? (
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
          <div
            className="w-64 flex w-auto justify-between"
            style={{ gap: '16px' }}
          >
            <button
              className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => createUser(image)}
              disabled={submitLoading}
            >
              Submit
            </button>
            <button
              className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => retakeImage()}
              disabled={submitLoading}
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

  const renderTextComponent = () => {
    if (user) {
      return (
        <p className="border-b border-gray-300 dark:border-neutral-800 dark:from-inherit w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          You are ready to go! Scan somebody else&apos;s QR code to initiate a
          race
        </p>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between py-12 px-6`}
    >
      <div className="flex justify-center z-10 max-w-5xl w-full items-center lg:justify-between font-mono text-sm">
        {renderTextComponent()}
        <div
          className="fixed bottom-0 left-0 flex h-12 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none pb-8 md:pb-0 bold"
          style={{ gap: '16px' }}
        >
          {user && (
            <Link href="/qr" className="underline hover:text-purple-400">
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
      {isNewUser && !user ? (
        renderCameraComponent()
      ) : (
        <Scanner
          onScan={result => {
            processQrCode(result);
          }}
          styles={{
            container: {
              maxWidth: 500,
              maxHeight: 500,
              width: '100vw',
              height: '100vh',
              margin: 24,
            },
          }}
          allowMultiple={true}
        />
      )}
    </main>
  );
};
export default LandingComponent;
