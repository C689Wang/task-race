'use client';
import { nanoid } from 'nanoid';
import React, { ReactNode, useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import AcceptModal from '../components/modals/AcceptModal/AcceptModal';
import { useWebsocket } from './WebsocketContext';

interface Notification {
  id: string;
  userId: string;
  onAccept: () => void;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    // { id: '123', userId: 'hello', onAccept: () => {} },
    // { id: '333', userId: 'BYEBYE', onAccept: () => {} },
  ]);
  const [user] = useLocalStorageState<string>('user');

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

  useEffect(() => {
    if (message) {
      const event = JSON.parse(message);
      if (event.Action === 'race_sent') {
        addNotification(event.Origin, event.Race);
      }
    }
  }, [message]);

  return (
    <>
      {children}
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
