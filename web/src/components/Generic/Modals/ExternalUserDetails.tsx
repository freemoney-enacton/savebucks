import { public_get_api } from '@/Hook/Api/Server/use-server';
import { useUtils } from '@/Hook/use-utils';
import { Spinner, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState, forwardRef, useImperativeHandle } from 'react';
import ModalComponent from '../Modals/ModalComponent';
import UserPrivateProfile from '../Modals/UserPrivateProfile';
import UserPublicProfile from '../Modals/UserPublicProfile';

const ExternalUserDetails = forwardRef(({ user }: any, ref) => {
  const [loading, setLoading] = useState(false);
  const [publicUserData, setPublicUserData] = useState<any>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { previousUrl } = useUtils();
  const router = useRouter();

  const handleUserProfileClick = async () => {
    window.history.pushState({}, '', `/user/${user.user_referral_code}`);
    onOpen();
    if (!user.is_private) {
      setLoading(true);
      try {
        await public_get_api({ path: `user/public-profile/${user.user_referral_code}` })
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

  useImperativeHandle(ref, () => ({
    handleUserProfileClick,
  }));

  return (
    <>
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
            <div className="h-48 w-full flex items-center justify-center min-h-0">
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
});
ExternalUserDetails.displayName = 'ExternalUserDetails';
export default ExternalUserDetails;
