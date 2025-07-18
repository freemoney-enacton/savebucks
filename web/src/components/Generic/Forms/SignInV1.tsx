'use client';
import { login } from '@/actions/auth-actions';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes-config';
import { useDisclosure } from '@nextui-org/react';
import { ErrorMessage, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import { SvgFacebook, SvgGoogle } from '../Icons';
import ForgotPassword from '../Modals/ForgotPassword';

const SignInV1 = ({ onModalClose, LoginInPage = false }: any) => {
  const { t } = useTranslation();
  const reCaptchaRef = useRef<any>(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { handleSocialSignin } = useUtils();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
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
              Toast.success(t('login_successful'));
              setSubmitting(false);
              // onModalClose();
              onClose();
              window.location.reload();
            }
          })
          .finally(() => {
            reCaptchaRef.current.reset();
            setSubmitting(false);
          });
      } catch (error) {
        reCaptchaRef.current.reset();
        setSubmitting(false);
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
        <h3 className="text-4xl font-medium leading-[1] text-center">{t('sign_in_with')}</h3>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
            return (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <Input
                    type="text"
                    label="Email"
                    id="email"
                    placeholder="Enter Email"
                    required={true}
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
                    label="Password"
                    id="password"
                    placeholder="Enter password"
                    required={true}
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
                  <button type="button" onClick={handleClick} className="ml-auto block w-fit text-white text-xs">
                    {t('Forgot Password?')}
                  </button>
                </div>

                <ButtonComponent
                  role="button"
                  label={t('sign_in')}
                  variant="primary"
                  customClass="w-full !py-3"
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </form>
            );
          }}
        </Formik>

        <p className="text-sm">{t('joining_terms_sentence')}</p>

        <div className="or_sec">
          <p className="flex-shrink-0 text-white text-sm font-medium text-center">{t('or')}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              handleSocialSignin('facebook');
            }}
            className="w-full h-12 bg-secondary hover:bg-primary hover:text-black flex items-center justify-center gap-2 rounded-md transition-ease uppercase"
          >
            <SvgFacebook className="flex-shrink-0 size-6" />
            {t('sign_up_with_facebook')}
          </button>

          <button
            onClick={() => {
              handleSocialSignin('google');
            }}
            className="w-full h-12 bg-secondary hover:bg-primary hover:text-black flex items-center justify-center gap-2 rounded-md transition-ease uppercase"
          >
            <SvgGoogle className="flex-shrink-0 size-6" />
            {t('sign_up_with_google')}
          </button>
          <button
            onClick={() => {
              handleSocialSignin('apple');
            }}
            className="w-full h-12 bg-secondary hover:bg-primary hover:text-black flex items-center justify-center gap-2 rounded-md transition-ease uppercase"
          >
            <Image src="/images/apple.png" className="max-h-5 w-auto" width={20} height={20} alt="apple" />
            {t('sign_up_with_apple')}
          </button>
        </div>

        {LoginInPage && (
          <p className="text-center text-sm font-medium">
            {t('not_member')}{' '}
            <Link className="text-primary hover:underline transition-ease" href="/register">
              {t('sign_up')}
            </Link>
          </p>
        )}
      </div>
      <ForgotPassword isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  );
};

export default SignInV1;
