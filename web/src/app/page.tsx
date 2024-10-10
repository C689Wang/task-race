'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import Webcam from 'react-webcam';

export default function Home() {
  const [user, setUser] = useState<string>();
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
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
          className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none pb-8 md:pb-0 bold"
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
        <Webcam />
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
}
