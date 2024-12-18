'use client';
import Loading from '@/components/common/Loading';
import LandingContainer from '@/components/Home/LandingContainer';
import { useWebsocket } from '@/context/WebsocketContext';
import { upload } from '@vercel/blob/client';
import { nanoid } from 'nanoid';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useLocalStorageState from 'use-local-storage-state';

export default function Home() {
  const [user, setUser] = useLocalStorageState<string>('user');
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const captureImage = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);

  const retakeImage = () => {
    setImage(null);
  };

  const createUser = async (image: string) => {
    setSubmitLoading(true);
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
    setSubmitLoading(false);
  };

  const { message, sendMessage, loading } = useWebsocket();

  if (loading) return <Loading />;

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
      submitLoading={submitLoading}
    />
  );
}
