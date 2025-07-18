'use client';
import { directLogin } from '@/actions/auth-actions';
import Checkbox from '@/components/Core/Checkbox';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes-config';
import { ErrorMessage, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import { SvgFacebook, SvgGoogle } from '../Icons';

const SignUpV1 = ({ onModalClose, referralCode, id, registerPage = false }: any) => {
  const reCaptchaRef = useRef<any>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { public_post_api } = usePublicApi();
  const { handleSocialSignin } = useUtils();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    referral: referralCode ? referralCode : '',
    newsLatter: false,
  };
  const validationSchema = Yup.object({
    // name: Yup.string().required('Required'),
    email: Yup.string()
      .email(t('invalid_email_address'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, t('invalid_email_address'))
      .required(t('email_required')),
    // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    password: Yup.string()
      .min(6, t('password_must_be_at_least_6_characters'))
      .matches(/[A-Z]/, t('password_must_contain_at_least_one_uppercase_letter'))
      .matches(/[a-z]/, t('password_must_contain_at_least_one_lowercase_letter'))
      .matches(/\d/, t('password_must_contain_at_least_one_digit'))
      .required(t('password_is_required')),
    referral: Yup.string(),
    terms: Yup.bool().oneOf([true], t('terms_and_conditions_are_required')).required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    (async () => {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      try {
        const user: any = await public_post_api({
          path: 'auth/register',
          body: {
            name: values.email.split('@')[0],
            email: values.email,
            password: values.password,
            // referral: values.referral,
            newsletter: values.newsLatter,
            recaptcha: recaptcha,
          },
        });

        if (user.success && user.data.token) {
          const res = await directLogin({ token: user.data.token });
          if (res?.error) {
            Toast.error(res?.error || 'Something went wrong');
          } else {
            Toast.success(t('registered_successfully'));
            onModalClose && onModalClose();
            router.push(DEFAULT_LOGIN_REDIRECT);
            window.location.reload();
          }
        } else {
          Toast.error(user.error || '');
        }
      } catch (error) {
        console.log('🚀 ~ handleSubmit ~ error:', error);
        Toast.error(t('something_went_wrong_please_try_again'));
        reCaptchaRef.current.reset();
      } finally {
        reCaptchaRef.current.reset();
        setSubmitting(false);
      }
    })();
  };

  return (
    <div className="space-y-5">
      <h3 className="text-4xl font-medium leading-[1] text-center">{t('sign_up_for_free')}</h3>

      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* <Input
                type="text"
                label="Name"
                id="name"
                placeholder="Enter Name"
                required={true}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                hint={<ErrorMessage name="name" component="div" className="text-red-500" />}
              /> */}
              <Input
                type="text"
                label="Email"
                id="email"
                placeholder={t('email_address...')}
                required={true}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                hint={<ErrorMessage name="email" component="div" className="text-red-500" />}
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
                hint={<ErrorMessage name="password" component="div" className="text-red-500" />}
              />

              {/* <Input
                type="text"
                label="Referral Code"
                id="referral"
                placeholder="Enter referral code"
                value={values.referral}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.referral}
                hint={<ErrorMessage name="referral" component="div" className="text-red-500" />}
              /> */}

              <div className="space-y-1">
                <Checkbox
                  label={t('i_agree_to_receive_promotional_emails')}
                  id={'signup-terms'}
                  checked={values.newsLatter}
                  onChange={(e) => setFieldValue('newsLatter', e.target.checked)}
                  onBlur={handleBlur}
                  error={errors.newsLatter}
                />
              </div>
              <div style={{ display: 'none' }}>
                <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
              </div>
              <ButtonComponent
                role="button"
                label={t('get_started_now')}
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                customClass="w-full !py-3"
                type="submit"
              />
            </div>
          </form>
        )}
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

      <p className="text-sm">{t('signup_disclaimer')}</p>
      {registerPage && (
        <p className="text-center text-sm font-medium">
          {t('existing_user')}{' '}
          <Link className="text-primary hover:underline transition ease-in-out duration-300" href="/login">
            {t('sign_in')}
          </Link>
        </p>
      )}
    </div>
  );
};

export default SignUpV1;
