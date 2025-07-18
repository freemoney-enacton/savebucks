'use client';
import { login } from '@/actions/auth-actions';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { AppRoutes, DEFAULT_LOGIN_REDIRECT } from '@/routes-config';
import { EnvelopeIcon, LockClosedIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from '@nextui-org/react';
import { ErrorMessage, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import Input from '../Core/Input';
import { Toast } from '../Core/Toast';
import ButtonComponent from './ButtonComponent';
import ForgotPassword from './Modals/ForgotPassword';

export default function SignIn({ onModalClose, LoginInPage = false }: any) {
  const navigate = usePathname();
  const { t } = useTranslation();
  const reCaptchaRef = useRef<any>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { handleSocialSignin } = useUtils();
  const translatedText = t('login_privacy_policy_sentence');
  const replacedText = translatedText.replace('{{privacyPolicy}}', '<PRIVACY>');
  const parts = replacedText.split(/(<PRIVACY>)/);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('invalid_email_address'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, t('invalid_email_address'))
      .required(t('email_required')),
    password: Yup.string()
      .min(6, t('password_must_be_at_least_6_characters'))
      .matches(/[A-Z]/, t('password_must_contain_at_least_one_uppercase_letter'))
      .matches(/[a-z]/, t('password_must_contain_at_least_one_lowercase_letter'))
      .matches(/\d/, t('password_must_contain_at_least_one_digit'))
      .required(t('password_required')),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    (async () => {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      try {
        const { email, password } = values;
        login({ email, password, recaptcha })
          .then((data) => {
            if (data?.error) {
              Toast.error(data?.error || '');
            } else {
              router.push(DEFAULT_LOGIN_REDIRECT);
              if (typeof window !== 'undefined' && window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'LOGIN_SUCCESS',
                    data: {
                      email,
                    },
                  })
                );
              }
              Toast.success(t('login_successful'));

              // onModalClose();
              onClose();
              window.location.reload();
              setTimeout(() => {
                setSubmitting(false);
              }, 2000);
            }
          })
          .finally(() => {
            reCaptchaRef?.current?.reset();
            setTimeout(() => {
              setSubmitting(false);
            }, 2000);
          });
      } catch (error) {
        reCaptchaRef?.current?.reset();
        setTimeout(() => {
          setSubmitting(false);
        }, 2000);
      }
    })();
  };

  const handleClick = () => {
    onOpen();
    // its not working it will be fixed later as it will take much and not able to find the solution
    // onModalClose(true);
  };

  return (
    <>
      <div className="space-y-5 m-auto">
        {LoginInPage && (
          <>
            <h3 className="text-center text-base sm:text-lg font-bold">{t('login_for_free_now')}</h3>
            <div className="flex items-center justify-center gap-2.5">
              <div className="bg-tertiary-gr p-[1px] rounded-lg hover:translate-y-[-2px] transition-linear">
                <Link
                  href={AppRoutes.register}
                  className={`min-w-[100px] sm:min-w-[132px] block py-2 px-4 ${
                    navigate === AppRoutes.register ? 'bg-tertiary-gr text-black' : 'bg-black'
                  } rounded-[7px] text-sm font-bold text-center`}
                >
                  {t('register')}
                </Link>
              </div>
              <Link
                href={AppRoutes.login}
                className={`min-w-[100px] sm:min-w-[132px] block py-2 px-4 ${
                  navigate === AppRoutes.login ? 'bg-tertiary-gr text-black' : 'bg-black border-primary'
                } border rounded-lg text-sm font-bold text-center hover:translate-y-[-2px] transition-linear`}
              >
                {t('login')}
              </Link>
            </div>
          </>
        )}
        <div className="text-center space-y-2.5">
          <p className="text-white text-base font-bold">{t('sign_in_with')}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                handleSocialSignin('facebook');
              }}
              className="h-11 w-11 bg-black grid place-content-center border border-gray-400 rounded-full hover:translate-y-[-2px] transition-linear"
            >
              <Image src="/images/facebook.png" className="max-h-5 w-auto" width={40} height={40} alt="facebook" />
            </button>
            <button
              onClick={() => {
                handleSocialSignin('google');
              }}
              className="h-11 w-11 bg-black grid place-content-center border border-gray-400 rounded-full hover:translate-y-[-2px] transition-linear"
            >
              <Image src="/images/google.png" className="max-h-5 w-auto" width={40} height={40} alt="google" />
            </button>
            <button
              onClick={() => {
                handleSocialSignin('apple');
              }}
              className="h-11 w-11 bg-black grid place-content-center border border-gray-400 rounded-full hover:translate-y-[-2px] transition-linear"
            >
              <Image src="/images/apple.png" className="max-h-5 w-auto" width={40} height={40} alt="google" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          <div className="bg-border-gr2 h-[1px] max-w-[136px] w-full rotate-180"></div>
          <p className="text-white text-sm font-medium">{t('Or')}</p>
          <div className="bg-border-gr2 h-[1px] max-w-[136px] w-full"></div>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <Input
                    type="text"
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

                  <Input
                    type="password"
                    id="password"
                    placeholder={t('password_placeholder')}
                    required={true}
                    icon={<LockClosedIcon className="w-[18px] h-[18px] text-white" />}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    hint={
                      <>
                        <ErrorMessage name="password" component="span" />
                      </>
                    }
                  />
                </div>

                <div className="!mt-2">
                  <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
                  <button type="button" onClick={handleClick} className="ml-auto block w-fit text-white text-xs font-medium">
                    {t('Forgot Password?')}
                  </button>
                </div>

                <ButtonComponent
                  role="button"
                  label={t('start_earn_money_now')}
                  variant="primary"
                  icon={<RocketLaunchIcon className="size-5" />}
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </form>
            );
          }}
        </Formik>
        <p className="text-xs font-medium">
          {parts.map((part, index) => {
            if (part === '<PRIVACY>') {
              return (
                <Link
                  key={index}
                  href={AppRoutes.privacyPolicy}
                  target="_blank"
                  className="text-primary hover:opacity-75 transition-ease"
                >
                  {t('privacy_policy')}
                </Link>
              );
            }
            return part;
          })}
        </p>
      </div>
      <ForgotPassword isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  );
}
