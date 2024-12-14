'use client';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useContext,
} from 'react';
import WebSocketService from '../lib/websocketService';
import useLocalStorageState from 'use-local-storage-state';

interface WebSocketContextType {
  message: string | undefined;
  sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>();
  const [ws, setWS] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [user] = useLocalStorageState<string>('user');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  console.log(user);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      setMessage(event.data);
    };

    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      const wservice = WebSocketService.getInstance();
      wservice.connect('ws://localhost:8080/handler');
      wsRef.current = wservice.socket;
      setWS(wservice.socket);
    }

    wsRef.current?.addEventListener('message', handleMessage);
    wsRef.current?.addEventListener('open', () => {
      setIsConnected(true);
    });

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        ws?.removeEventListener('message', handleMessage);
        wsRef.current?.removeEventListener('open', () => {
          setIsConnected(true);
        });
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected && user) {
      WebSocketService.getInstance().sendMessage(
        JSON.stringify({
          origin: user,
          action: 'player_join',
        })
      );
    }
  }, [user, isConnected]);

  const sendMessage = (message: string) => {
    WebSocketService.getInstance().sendMessage(message);
  };

  if (!isConnected) return;

  return (
    <WebSocketContext.Provider value={{ message, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const websocketContext = useContext(WebSocketContext);
  if (!websocketContext) {
    return {
      message: '',
      loading: true,
      sendMessage: () => {},
    };
  } else {
    return {
      ...websocketContext,
      loading: false,
    };
  }
};
