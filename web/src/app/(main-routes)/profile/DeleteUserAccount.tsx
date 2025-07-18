'use client';
import { Toast } from '@/components/Core/Toast';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import ModalComponent from '@/components/Generic/Modals/ModalComponent';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from '@nextui-org/react';
import { useState } from 'react';

const DeleteUserAccount = () => {
  const { t } = useTranslation();
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { public_get_api } = usePublicApi();
  const { logoutUser } = useUtils();

  const onDeleteButtonClick = async () => {
    try {
      setLoadingDeleteAccount(true);
      public_get_api({ path: `user/remove` })
        .then((res) => {
          if (res?.success) {
            logoutUser('account_deleted_successfully');
            onClose();
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => setLoadingDeleteAccount(false));
    } catch (error) {
      console.log({ error });
      setLoadingDeleteAccount(false);
    }
  };
  return (
    <>
      <div className="space-y-3 max-sm:text-center">
        <h3 className="text-red-400 text-xl sm:text-2xl font-medium">{t('delete_account')}</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-4">
          <div className="max-w-[600px] font-medium">
            <p>{t('once_you_delete_your_account')}</p>
          </div>
          <div className="flex-shrink-0">
            <ButtonComponent
              role="button"
              variant="danger"
              label={t('delete_account')}
              onClick={() => onOpen()}
              icon={<TrashIcon className="size-4" />}
            />
          </div>
        </div>
      </div>

      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} customClass="max-w-[480px] sm:max-w-[388px] !p-[30px]">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="relative">
              <TrashIcon className="size-16 mx-auto text-red-400" />
              <div className="absolute right-1/2 transform translate-x-1/2 -bottom-2 z-[0] bg-brown h-14 w-14 filter blur-[55px] rounded-full"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-white text-sm font-medium">{t('are_you_sure_want_delete_your_account')}</p>
              <p className="text-xs">{t('this_action_is_irreversible')}</p>
            </div>
            <div className="flex item-center justify-center gap-3.5">
              <ButtonComponent
                role="button"
                variant="outline"
                label={t('cancel')}
                customClass="!py-3"
                onClick={() => onClose()}
              />
              <ButtonComponent
                isLoading={loadingDeleteAccount}
                role="button"
                variant="danger"
                label={t('delete_account')}
                onClick={() => {
                  onDeleteButtonClick();
                }}
                icon={<TrashIcon className="size-4" />}
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};

export default DeleteUserAccount;
