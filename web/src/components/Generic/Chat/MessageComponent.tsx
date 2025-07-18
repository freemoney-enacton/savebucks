import { public_get_api } from '@/Hook/Api/Server/use-server';
import { Spinner, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react';
import ModalComponent from '../Modals/ModalComponent';
import UserPrivateProfile from '../Modals/UserPrivateProfile';
import UserPublicProfile from '../Modals/UserPublicProfile';
import { useUtils } from '@/Hook/use-utils';
import { useRouter } from 'next/navigation';
import { Filter } from 'bad-words';

const MessageComponent = ({ message }: { message: any }) => {
  const filter = new Filter();
  const formatMessage = (message) => {
    if (!message.mentions || typeof message.mentions !== 'object') {
      return message.content.split('\n').map((line, index) => <React.Fragment key={index}>{filter.clean(line)}</React.Fragment>);
    }
    const parts = message.content.split(/\[@uid-(.*?)\]/g);
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        return part.split('\n').map((line, i) => <React.Fragment key={index + '-' + i}>{filter.clean(line)}</React.Fragment>);
      } else {
        const user = message.mentions[part];
        if (user) {
          return <UserInfoModalComponent key={index} user={user} />;
        }
        return <React.Fragment key={index}>{`[@uid-${part}]`}</React.Fragment>;
      }
    });
  };

  return <div>{formatMessage(message)}</div>;
};

export default MessageComponent;

function UserInfoModalComponent({ user }) {
  const [loading, setLoading] = useState(false);
  const [publicUserData, setPublicUserData] = useState<any>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { previousUrl, updatePreviousUrl } = useUtils();
  const router = useRouter();

  const handleUserProfileClick = async () => {
    window.history.pushState({}, '', `/user/${user.referral_code}`);
    onOpen();
    if (!user.is_private) {
      setLoading(true);
      try {
        await public_get_api({ path: `user/public-profile/${user.referral_code}` })
          .then((res) => {
            if (res) {
              setPublicUserData(res?.data);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <span
        onClick={() => {
          updatePreviousUrl();
          handleUserProfileClick();
        }}
        className="text-blue-500 cursor-pointer hover:opacity-75 transition-ease"
      >
        @{user.name}
      </span>
      <ModalComponent
        onCloseClick={() => {
          router.replace(previousUrl);
        }}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        onOpenChange={onOpenChange}
        customClass="!max-w-[570px] !min-h-0 sm:!min-h-0"
      >
        {!user.is_private ? (
          loading ? (
            <div className="h-48 w-full flex items-center justify-center">
              <Spinner color="primary" className="w-7 sm:w-10 h-7 sm:h-10 self-center" />
            </div>
          ) : (
            <UserPublicProfile userInfo={publicUserData} />
          )
        ) : (
          <UserPrivateProfile name={user.name} modal={true} />
        )}
      </ModalComponent>
    </>
  );
}
