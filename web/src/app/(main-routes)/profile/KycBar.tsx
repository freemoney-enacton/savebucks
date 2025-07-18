'use client';
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import Pills from '@/components/Generic/Pills';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import UserCard from '@/components/Generic/Card/UserCard';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import { useSession } from 'next-auth/react';
import { Toast } from '@/components/Core/Toast';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';

const KycBar = () => {
  const { t } = useTranslation();
  const [loadingKycApi, setLoadingKycApi] = useState(false);
  const { public_post_api } = usePublicApi();
  const { data, update }: any = useSession();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  const handleKYC = async () => {
    setLoadingKycApi(true);
    try {
      if (data?.user?.user?.kyc_verification_status == 'In Review') {
        await update({ updated: true });
        Toast.success(t('kyc_status_updated_successfully'));
        setLoadingKycApi(false);
      } else {
        public_post_api({ path: `kyc-verify`, body: { redirect_url: `${window.location.href}?is_verified=true` } })
          .then((res) => {
            if (res?.data && res?.success) {
              window.location.href = res.data.session_url;
            }
          })
          .finally(() => setLoadingKycApi(false));
      }
    } catch (error) {
      console.log(error);
      setLoadingKycApi(false);
    }
  };
  const getButtonLabel = () => {
    switch (data?.user?.user?.kyc_verification_status) {
      case 'Not Started':
        return t('complete_kyc');
      case 'In Progress':
        return t('kyc_in_progress');
      case 'In Review':
        return t('check_status');
      case 'Declined':
      case 'Expired':
      case 'Abandoned':
      case 'Kyc Expired':
        return t('try_again');
      default:
        break;
    }
  };
  if (!settings?.services?.kyc_verification_enabled) return null;
  return (
    <UserCard>
      <div className="w-full  flex items-center justify-between py-2 px-4">
        <div className="flex-col space-y-2">
          <p>{t('kyc_update')}</p>
          <Pills label={data?.user?.user?.kyc_verification_status} />
        </div>

        {data?.user?.user?.kyc_verification_status != 'Approved' ? (
          <ButtonComponent
            disabled={loadingKycApi}
            role="button"
            variant="primary"
            label={getButtonLabel()}
            type="submit"
            isLoading={loadingKycApi}
            onClick={handleKYC}
            customClass="py-1.5 xl:py-2 px-2 xl:px-2.5"
          />
        ) : null}
      </div>
    </UserCard>
  );
};

export default KycBar;
