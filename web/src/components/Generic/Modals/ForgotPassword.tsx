'use client';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import { useTranslation } from '@/i18n/client';
import { EnvelopeIcon, LockClosedIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { ErrorMessage, Formik } from 'formik';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import OtpInput from '@/components/Core/OtpInput';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import ModalComponent from './ModalComponent';
import { usePublicApi } from '@/Hook/Api/Client/use-client';

export default function ForgotPassword({ isOpen, onOpenChange, onClose }: any) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const reCaptchaRef = useRef<any>(null);
  const { public_post_api } = usePublicApi();

  const handleNextStep = () => {
    if (step < 3) {
      setStep((prevStep) => prevStep + 1);
    } else {
      null;
    }
  };
  const EmailValidationScheme = Yup.object().shape({
    email: Yup.string().email('Invalid email').required(t('email_required')),
  });
  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().required(t('otp_required')),
  });
  const changePasswordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one digit')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });
  const handleEmailSubmission = async (values, { setSubmitting }) => {
    try {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      const validateEmail = await public_post_api({
        path: `auth/forgot-password`,
        body: { email: values.email, recaptcha: recaptcha },
      });
      if (validateEmail?.success) {
        Toast.success(validateEmail?.msg);
        handleNextStep();
        setUserEmail(values.email);
        reCaptchaRef.current.reset();
      } else {
        Toast.error(validateEmail?.error);
        reCaptchaRef.current.reset();
      }
    } catch (error) {
      reCaptchaRef.current.reset();
      console.log('🚀 ~ handleEmailSubmission ~ error:', error);
    } finally {
      setSubmitting(false);
      reCaptchaRef.current.reset();
    }
  };

  const VerifyOTP = async (values, { setSubmitting }) => {
    try {
      const validateOTP = await public_post_api({
        path: `auth/verify-otp`,
        body: { email: userEmail, otp: Number(values.otp) },
      });
      if (validateOTP?.success) {
        Toast.success(validateOTP?.msg);
        handleNextStep();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        Toast.error(validateOTP?.error);
      }
    } catch (error) {
      console.log('🚀 ~ handleOTPSubmission ~ error:', error);
      setSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async (values, { setSubmitting }) => {
    try {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      const validatePassword = await public_post_api({
        path: `auth/reset-password`,
        body: { email: userEmail, password: values.newPassword, recaptcha: recaptcha },
      });
      if (validatePassword?.success) {
        Toast.success(validatePassword?.msg);
        onOpenChange(false);
        setStep(1);
      } else {
        Toast.error(validatePassword?.error);
      }
    } catch (error) {
      console.log('🚀 ~ handleChangePasswordSubmit ~ error:', error);
    } finally {
      setSubmitting(false);
      reCaptchaRef.current.reset();
    }
  };
  return (
    <ModalComponent
      onCloseClick={() => {
        setStep(1);
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      customClass="!max-w-[480px]"
    >
      <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
      <div>
        {step === 1 && (
          <Formik initialValues={{ email: '' }} validationSchema={EmailValidationScheme} onSubmit={handleEmailSubmission}>
            {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-center">
                  <h4 className="text-white text-xl font-bold">{t('forgot_password_modal')}</h4>
                  <p>{t('send_you_an_otp')}</p>
                </div>
                <Input
                  type="text"
                  // label={t('email')}
                  id="email"
                  placeholder={t('email_placeholder')}
                  required={true}
                  icon={<EnvelopeIcon className="w-[18px] h-[18px] text-white" />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  hint={
                    <>
                      <ErrorMessage name="email" component="span" />
                    </>
                  }
                />
                <ButtonComponent
                  role="button"
                  label={t('submit')}
                  variant="primary"
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  icon={<RocketLaunchIcon className="size-5" />}
                />
              </form>
            )}
          </Formik>
        )}
        {step === 2 && (
          <Formik initialValues={{ otp: '' }} validationSchema={otpValidationSchema} onSubmit={VerifyOTP}>
            {({ setFieldValue, values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-center">
                  <h4 className="text-white text-xl font-bold">{t('confirm_otp')}</h4>
                  <p>{t('confirm_otp_verify')}</p>
                </div>
                {/* <Input
                  type="number"
                  label={t('otp')}
                  id="otp"
                  placeholder={t('otp_placeholder')}
                  required={true}
                  icon={<PaperAirplaneIcon className="w-[18px] h-[18px] text-white" />}
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.otp}
                  hint={
                    <>
                      <ErrorMessage name="otp" component="span" />
                    </>
                  }
                /> */}
                <OtpInput numInputs={6} onChange={(otp) => setFieldValue('otp', otp)} value={values.otp} />
                <p className="block text-red text-xs">
                  <ErrorMessage name="otp" component="span" />
                </p>
                <ButtonComponent
                  role="button"
                  label={t('submit')}
                  variant="primary"
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  icon={<RocketLaunchIcon className="size-5" />}
                />
              </form>
            )}
          </Formik>
        )}
        {step === 3 && (
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={changePasswordValidationSchema}
            onSubmit={handleChangePasswordSubmit}
          >
            {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-center">
                  <h4 className="text-white text-xl font-bold">{t('change_password')}</h4>
                  <p>{t('change_password_desc')}</p>
                </div>
                <Input
                  type="password"
                  // label={t('new_password')}
                  id="newPassword"
                  placeholder={t('new_password_placeholder')}
                  required={true}
                  icon={<LockClosedIcon className="w-[18px] h-[18px] text-white" />}
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  hint={
                    <>
                      <ErrorMessage name="newPassword" component="span" />
                    </>
                  }
                />
                <Input
                  type="password"
                  // label={t('confirm_password')}
                  id="confirmPassword"
                  placeholder={t('confirm_password_placeholder')}
                  required={true}
                  icon={<LockClosedIcon className="w-[18px] h-[18px] text-white" />}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  hint={
                    <>
                      <ErrorMessage name="confirmPassword" component="span" />
                    </>
                  }
                />
                <ButtonComponent
                  role="button"
                  label={t('submit')}
                  variant="primary"
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  icon={<RocketLaunchIcon className="size-5" />}
                />
              </form>
            )}
          </Formik>
        )}
      </div>
    </ModalComponent>
  );
}
