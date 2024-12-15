'use client';
import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import AcceptModal from '../components/modals/AcceptModal/AcceptModal';
import { useWebsocket } from './WebsocketContext';
import RaceModal from '@/components/modals/RaceModal/RaceModal';

interface Notification {
  id: string;
  userId: string;
  onAccept: () => void;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRaceModalOpen, setIsRaceModalOpen] = useState<boolean>(false);
  const [currentOpponent, setCurrentOpponent] = useState<string>('');
  const [currentRace, setCurrentRace] = useState<string>('');
  const [user] = useLocalStorageState<string>('user');
  const [view, setView] = useState<'Lobby' | 'Game'>('Lobby');
  const [prompt, setPrompt] = useState<string>('');

  const { message, sendMessage } = useWebsocket();

  const addNotification = (userId: string, raceId: string) => {
    const id = nanoid();
    setNotifications(prev => [
      ...prev,
      {
        id,
        userId,
        onAccept: () =>
          sendMessage(
            JSON.stringify({
              Action: 'join_race',
              Origin: user,
              Target: userId,
              Race: raceId,
            })
          ),
      },
    ]);

    // Auto-remove after 20 seconds
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }, 20000);
  };

  const leaveRace = () => {
    setIsRaceModalOpen(false);
    sendMessage(
      JSON.stringify({
        Action: 'leave_race',
        Origin: user,
        Target: currentOpponent,
        Race: currentRace,
      })
    );
  };

  useEffect(() => {
    if (message) {
      const event = JSON.parse(message);
      if (event.Action === 'race_sent') {
        if (!isRaceModalOpen) {
          addNotification(event.Origin, event.Race);
        }
      } else if (event.Action === 'race_created') {
        setIsRaceModalOpen(true);
        setCurrentOpponent(event.Origin);
        setCurrentRace(event.Race);
      } else if (event.Action === 'race_started') {
        setIsRaceModalOpen(true);
        if (event.Origin === user) {
          setCurrentOpponent(event.Target);
        } else {
          setCurrentOpponent(event.Origin);
        }
        setCurrentRace(event.Race);
        setView('Game');
        setPrompt(event.Prompt);
      }
    }
  }, [message]);

  return (
    <>
      {children}
      <RaceModal
        isOpen={isRaceModalOpen}
        onClose={() => leaveRace()}
        view={view}
        prompt={prompt}
      />
      <div className="fixed flex top-4 w-full flex-col justify-center items-center z-50">
        {notifications.map(notification => (
          <AcceptModal
            key={notification.id}
            userId={notification.userId}
            onAccept={() => {
              notification.onAccept();
              setNotifications(prev =>
                prev.filter(n => n.id !== notification.id)
              );
            }}
            onDecline={() => {
              setNotifications(prev =>
                prev.filter(n => n.id !== notification.id)
              );
            }}
          />
        ))}
      </div>
    </>
  );
};
