'use client';
import Navbar from '@/components/Navbar/Navbar';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import Unauthorized from '@/components/common/Unauthorized';
import React from 'react';
import QRCode from 'react-qr-code';
import useSWR from 'swr';
import useLocalStorageState from 'use-local-storage-state';

const QRPage = () => {
  const [user] = useLocalStorageState<string>('user');

  const { data, error, isLoading } = useSWR(
    user ? `/api/players/${user}` : null,
    (...args) => fetch(...args).then(res => res.json()),
    { fallbackData: {} }
  );

  if (!user) return <Unauthorized />;

  if (error) return <Error message="Failed to load QR code" />;
  if (!data && isLoading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 p-6 max-w-full overflow-x-scroll">
        <h1 className="text-3xl mt-4 font-bold leading-6 text-center w-full">
          My QR code
        </h1>
        <div className="mx-auto mt-16 flex flex-col items-center justify-center max-w-full overflow-x-scroll">
          {data.qrCode && (
            <>
              <QRCode
                size={128}
                style={{ height: '300px', width: '300px' }}
                value={data.qrCode.encoding}
                viewBox={`0 0 256 256`}
              />
              <button
                className="bg-zinc-800/30 w-32 hover:bg-zinc-900 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => window.print()}
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QRPage;
