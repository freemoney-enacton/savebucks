'use client';

import OtpInput from '@/components/Core/OtpInput';
import { Toast } from '@/components/Core/Toast';
import { useTranslation } from '@/i18n/client';
import { stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { ErrorMessage, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import ModalComponent from './ModalComponent';
import { usePublicApi } from '@/Hook/Api/Client/use-client';

export default function VerifyEmail({ onClose, isOpen, onOpenChange, type, data }: any) {
  const { t } = useTranslation();
  const { update }: any = useSession();
  const ProfileVerifyValue: any = useRecoilValue(stringAtomFamily(atomKey.ProfileVerifyValue));
  const ProfileEmailValue: any = useRecoilValue(stringAtomFamily(atomKey.ProfileEmailValue));
  const { public_post_api } = usePublicApi();

  const otpInitialValues = {
    otp: '',
  };

  const otpValidationSchema = Yup.object({
    otp: Yup.string().length(6, t('otp_must_be_6_digits')).required(t('otp_required')),
  });

  const handleOtpSubmit = (values, { setSubmitting }) => {
    const body = {
      email: type == 'email' ? (ProfileEmailValue ? ProfileEmailValue : null) : null,
      phone_no: type != 'email' ? (ProfileVerifyValue?.includes('+') ? ProfileVerifyValue : `+${ProfileVerifyValue}`) : null,
      otp: Number(values.otp),
    };
    try {
      public_post_api({
        path: 'auth/verify-user',
        body: body,
      })
        .then(async (response) => {
          if (response?.success) {
            Toast.success(response?.msg);
            onClose();
            await update({ updated: true });
          } else {
            Toast.error(response?.error);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <ModalComponent
      onCloseClick={() => {
        // setDialCode('');
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      customClass="!max-w-[380px]"
    >
      <div>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h4 className="text-white text-xl font-semibold">{t('verify') + ' ' + t(type)}</h4>

            {/* <p>{t('please_confirm_email')}</p> */}
          </div>

          <Formik initialValues={otpInitialValues} validationSchema={otpValidationSchema} onSubmit={handleOtpSubmit}>
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="space-y-2 text-center">
                  <h4 className="text-white text-xl font-semibold">{t('confirm_otp')}</h4>
                  <p>{t('confirm_otp_verify')}</p>
                </div>
                <OtpInput numInputs={6} value={values.otp} onChange={(otp) => setFieldValue('otp', otp)} />

                <ErrorMessage name="otp" component="div" className="text-red-500 text-xs mt-1" />
                <ButtonComponent
                  role="button"
                  label={t('submit')}
                  variant="primary"
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </ModalComponent>
  );
}
