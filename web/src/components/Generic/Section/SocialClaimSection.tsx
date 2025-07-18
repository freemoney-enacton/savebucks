'use client';
import { config } from '@/config';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useDisclosure } from '@nextui-org/react';
import { useQRCode } from 'next-qrcode';
import { useRecoilValue } from 'recoil';
import SocialClaimCard from '../Card/SocialClaimCard';
import ModalComponent from '../Modals/ModalComponent';

const SocialClaimSection = () => {
  const { t } = useTranslation();
  const { getCurrencyString, isMobileApp, isMobileBrowser } = useUtils();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { Image: QRImage } = useQRCode();

  const handleAppInstallBonus = () => {
    if (isMobileBrowser) {
      window.open(settings?.default?.app_link, '_blank');
    } else {
      onOpen();
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 lg:gap-10">
        {/* <SocialClaimCard
          imgUrl={'/images/reward-social-twitter.png'}
          title={t('follow_us_on_twitter')}
          btnName={t('claim_coins')?.replace(
            '%{coin}',
          settings?.bonuses
              ? getCurrencyString(settings?.bonuses?.find((bonus: any) => bonus.code == 'twitter_follow')?.amount)
              : 0
          )}
          )}
        /> */}
        {settings?.bonuses?.find((bonus: any) => bonus.code == 'app_install' && !isMobileApp) && (
          <SocialClaimCard
            imgUrl={settings?.default?.app_logo}
            title={t('download_our_app')}
            onClick={() => {
              handleAppInstallBonus();
            }}
            btnName={t('download_for_coins')?.replace(
              '%{coin}',
              settings?.bonuses
                ? settings?.bonuses?.find((bonus: any) => bonus.code == 'app_install')
                  ? getCurrencyString(settings?.bonuses?.find((bonus: any) => bonus.code == 'app_install')?.amount)
                  : '0'
                : '0'
            )}
          />
        )}
      </div>
      <ModalComponent onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} customClass="">
        <div className="flex flex-col space-y-5 justify-center items-center">
          <span>{t('scan_the_qr_code_with_your_phone')}</span>
          <QRImage
            text={settings?.default?.app_link ?? config.WEB_URL ?? ''}
            options={{
              type: 'image/jpeg',
              quality: 0.3,
              errorCorrectionLevel: 'M',
              margin: 1,
              scale: 1,
              width: 200,
              color: {
                dark: '#000',
                light: '#FFF',
              },
            }}
          />
        </div>
      </ModalComponent>
    </div>
  );
};

export default SocialClaimSection;
