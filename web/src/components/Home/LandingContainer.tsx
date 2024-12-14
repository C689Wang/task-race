import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Webcam from 'react-webcam';
import RaceModal from '../modals/RaceModal/RaceModal';
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
  message,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      const event = JSON.parse(message);
      if (event.Action === 'race_created') {
        setIsOpen(true);
      }
    }
  }, [message]);

  return (
    <>
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
      />
      <RaceModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
};
export default LandingContainer;
