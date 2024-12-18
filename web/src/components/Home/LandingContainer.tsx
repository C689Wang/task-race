import React, { Dispatch, RefObject, SetStateAction } from 'react';
import Webcam from 'react-webcam';
import LandingComponent from './LandingComponent';

type HomeProps = {
  isNewUser: boolean;
  setIsNewUser: Dispatch<SetStateAction<boolean>>;
  user: string | undefined;
  webcamRef: RefObject<Webcam>;
  image: string | null;
  captureImage: () => void;
  retakeImage: () => void;
  createUser: (image: string) => Promise<void>;
  sendMessage: (message: string) => void;
  message: string | undefined;
  submitLoading: boolean;
};

const LandingContainer: React.FC<HomeProps> = ({
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
  return (
    <LandingComponent
      isNewUser={isNewUser}
      setIsNewUser={setIsNewUser}
      user={user}
      webcamRef={webcamRef}
      image={image}
      captureImage={captureImage}
      retakeImage={retakeImage}
      createUser={createUser}
      sendMessage={sendMessage}
      submitLoading={submitLoading}
    />
  );
};
export default LandingContainer;
