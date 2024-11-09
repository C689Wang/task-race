'use client';
import LandingContainer from '@/components/Home/LandingContainer';
import { WebSocketContext } from '@/context/websocketContext';
import { upload } from '@vercel/blob/client';
import { nanoid } from 'nanoid';
import { useCallback, useContext, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useLocalStorageState from 'use-local-storage-state';

export default function Home() {
  // const [user, setUser] = useState<string>();
  const [user, setUser] = useLocalStorageState<string>('user');
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const websocketContext = useContext(WebSocketContext);

  const captureImage = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);

  const retakeImage = () => {
    setImage(null);
  };

  const createUser = async (image: string) => {
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const profilePhoto = await upload(`profile-${nanoid()}.png`, blob, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });
    const userRaw = await fetch('api/players', {
      method: 'POST',
      body: JSON.stringify({
        profilePhoto: profilePhoto.url,
      }),
    });
    const userData = await userRaw.json();
    setUser(userData.id);
  };

  if (!websocketContext) return <div>Loading...</div>;

  const { message, sendMessage } = websocketContext;

  return (
    <LandingContainer
      isNewUser={isNewUser}
      setIsNewUser={setIsNewUser}
      user={user}
      webcamRef={webcamRef}
      image={image}
      captureImage={captureImage}
      retakeImage={retakeImage}
      createUser={createUser}
      message={message}
      sendMessage={sendMessage}
    />
  );
}
