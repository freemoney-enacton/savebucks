'use client';
import React, { useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import { useTranslation } from '@/i18n/client';
import { useDisclosure } from '@nextui-org/react';
import ModalComponent from '../Modals/ModalComponent';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import RewardSpinModal from '../Modals/RewardSpinModal';
import { useUtils } from '@/Hook/use-utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { GiftIcon } from '@heroicons/react/24/solid';
import { SvgCashFill } from '../Icons';

const BonusCodeSection = () => {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  const { public_post_api } = usePublicApi();

  const [spinRewardData, setSpinRewardData] = useState<any>({});
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isSpinOpen, onOpen: onSpinOpen, onOpenChange: onOpenSpinChange, onClose: onSpinClose } = useDisclosure();

  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  const initialValues = {
    code: '',
  };

  const validationSchema = Yup.object({
    code: Yup.string().required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      public_post_api({ path: `bonuses/bonus-codes/claim/${values.code}`, body: {} })
        .then((res) => {
          if (res?.data && res?.success) {
            if (res?.data?.bonusCode?.reward_type == 'flat') {
              Toast.successTop(
                t('bonus_code_claimed_successfully').replace('%{amount}', getCurrencyString(res?.data?.bonusCode?.amount))
              );
            } else if (res?.data?.bonusCode?.reward_type == 'spin') {
              setSpinRewardData(res.data);
              setTimeout(() => {
                onClose();
                onSpinOpen();
              }, 500);
            }
          } else {
            Toast.errorTop(res?.error);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
      onClose();
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ButtonComponent
        role="button"
        label={t('bonus_code')}
        variant="primary"
        icon={<GiftIcon className="size-4" />}
        onClick={() => onOpen()}
      />
      <Image
        className="absolute right-0 top-0 size-[100px]"
        src={'/images/win-right-bg.png'}
        alt="icon"
        width={200}
        height={200}
      />
      {/* bonus code modal */}
      <ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} customClass="!max-w-[570px]">
        <div className="space-y-1">
          <h4 className="text-white text-base font-semibold">{t('bonus_code')}</h4>
          <p className="text-sm font-medium">{t('follow_our_social_to_get_bonus_code')}</p>
          <div className="flex items-center gap-2 py-2">
            {/* {settings?.social_handles?.map((link) => (
              <Link key={link} href={link} className="h-6 hover:opacity-80 transition-ease">
                {link.img && <Image className="max-h-6 w-auto h-auto" src={link.img} alt="social-icons" width={80} height={80} />}
              </Link>
            ))} */}
            {settings?.social_handles &&
              Object.entries(settings?.social_handles)
                .filter(([key, value]) => value !== null)
                .map(([key, value]: any) => (
                  <Link key={key} href={value} className="h-6 hover:opacity-80 transition-ease" target="_blank">
                    <Image
                      src={`/images/${key}.png`}
                      className="max-h-6 w-auto h-auto"
                      alt="social-icons"
                      width={80}
                      height={80}
                    />
                  </Link>
                ))}
          </div>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Input
                    type="text"
                    id="code"
                    placeholder={t('enter_bonus_code')}
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.code}
                    hint={
                      <>
                        <ErrorMessage name="code" component="span" />
                      </>
                    }
                  />
                </div>

                <ButtonComponent
                  role="button"
                  label={t('claim')}
                  variant="primary"
                  customClass="!py-2"
                  icon={<SvgCashFill className="size-4" />}
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </form>
            )}
          </Formik>
        </div>
      </ModalComponent>
      {/* spin modal */}
      <ModalComponent isOpen={isSpinOpen} onOpenChange={onOpenSpinChange} onClose={onSpinClose} customClass="!max-w-[650px]">
        <div>
          {Object.keys(spinRewardData).length > 0 && (
            <RewardSpinModal spinRewardData={spinRewardData} spin_type={t('bonus_spin')} />
          )}
        </div>
      </ModalComponent>
    </div>
  );
};

export default BonusCodeSection;
