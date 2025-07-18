'use client';
import { directLogin } from '@/actions/auth-actions';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
// import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
// import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
// import { atomKey } from '@/recoil/atom-key';
import { AppRoutes, DEFAULT_LOGIN_REDIRECT } from '@/routes-config';
import { EnvelopeIcon, LockClosedIcon, RocketLaunchIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';
// import { Spinner } from '@nextui-org/react';
import { ErrorMessage, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
// import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
// import Checkbox from '../Core/Checkbox';
import { useUtils } from '@/Hook/use-utils';
import Checkbox from '../Core/Checkbox';
import Input from '../Core/Input';
import { Toast } from '../Core/Toast';
import ButtonComponent from './ButtonComponent';

export default function SignUp({ onModalClose, referralCode, id, registerPage = false }: any) {
  const navigate = usePathname();
  // const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  // const loading = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  const reCaptchaRef = useRef<any>(null);
  const { t } = useTranslation();
  const router = useRouter();
  // const { getCurrencyString } = useUtils();
  const { public_post_api } = usePublicApi();
  const translatedText = t('register_privacy_policy_sentence');
  const replacedText = translatedText.replace('{{privacyPolicy}}', '<PRIVACY>');
  const parts = replacedText.split(/(<PRIVACY>)/);
  const { handleSocialSignin } = useUtils();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    referral: referralCode ? referralCode : '',
    newsLatter: false,
  };
  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t('name_required')),
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
    referral: Yup.string().trim(),
    // terms: Yup.bool().oneOf([true], t('terms_and_conditions_are_required')).required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    (async () => {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      try {
        const user: any = await public_post_api({
          path: 'auth/register',
          body: {
            name: values.name,
            email: values.email,
            password: values.password,
            referral: values.referral,
            newsletter: values.newsLatter,
            recaptcha: recaptcha,
          },
        });

        if (user.success && user.data.token) {
          const res = await directLogin({ token: user.data.token });
          if (res?.error) {
            Toast.error(res?.error || 'Something went wrong');
          } else {
            if (typeof window !== 'undefined' && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'LOGIN_SUCCESS',
                  data: {
                    email: values.email,
                  },
                })
              );
            }
            Toast.success(t('registered_successfully'));
            import('react-facebook-pixel')
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.trackCustom('CompleteRegistration', values.email);
              });
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
      {registerPage && (
        <>
          <h3 className="text-center text-base sm:text-lg font-bold">{t('register_for_free_now')}</h3>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href={AppRoutes.register}
              className={`min-w-[100px] sm:min-w-[132px] block py-2 px-4 ${
                navigate === AppRoutes.register ? 'bg-tertiary-gr text-black' : 'bg-black'
              } rounded-lg text-sm font-bold text-center hover:translate-y-[-2px] transition-linear`}
            >
              {t('register')}
            </Link>
            <div className="bg-tertiary-gr p-[1px] rounded-lg hover:translate-y-[-2px] transition-linear">
              <Link
                href={AppRoutes.login}
                className={`min-w-[100px] sm:min-w-[132px] block py-2 px-4 ${
                  navigate === AppRoutes.login ? 'bg-tertiary-gr text-black' : 'bg-black'
                } rounded-[7px] text-sm font-bold text-center`}
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </>
      )}
      <div className="text-center space-y-2.5">
        <p className="text-white text-sm font-semibold">{t('sign_up_with')}</p>
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
            <Image src="/images/apple.png" className="max-h-5 w-auto" width={40} height={40} alt="apple" />
          </button>
        </div>
      </div>

      {/* <div className="flex items-center justify-center gap-2.5">
        <Image src="/images/gift.png" className="flex-shrink-0 max-h-[30px] w-auto" width={20} height={20} alt="gift" />
        <p className="text-gray-400">
          {t('sign_up_now_and_win_upto')}{' '}
          <span className="font-bold bg-tertiary-gr text-gradient">
            {loading || Object.values(settings)?.length == 0 ? (
              <Spinner size="sm" color="white" />
            ) : settings ? (
              referralCode ? (
                getCurrencyString(settings?.bonuses?.find((bonus: any) => bonus.code == 'join_with_refer')?.amount)
              ) : (
                getCurrencyString(settings?.bonuses?.find((bonus: any) => bonus.code == 'join_no_refer')?.amount)
              )
            ) : (
              0
            )}
          </span>
        </p>
      </div> */}

      <div className="flex items-center justify-center gap-2.5">
        <div className="bg-border-gr2 h-[1px] max-w-[136px] w-full rotate-180"></div>
        <p className="text-white text-sm font-medium">{t('Or')}</p>
        <div className="bg-border-gr2 h-[1px] max-w-[136px] w-full"></div>
      </div>

      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Input
                type="text"
                // label="Name"
                id="name"
                placeholder="Enter Name"
                required={true}
                icon={<UserIcon className="w-[18px] h-[18px] text-white" />}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                hint={<ErrorMessage name="name" component="div" className="text-red-500" />}
              />
              <Input
                type="text"
                // label="Email"
                id="email"
                placeholder="Enter Email"
                required={true}
                icon={<EnvelopeIcon className="w-[18px] h-[18px] text-white" />}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                hint={<ErrorMessage name="email" component="div" className="text-red-500" />}
              />

              <Input
                type="password"
                // label="Password"
                id="password"
                placeholder="Enter password"
                required={true}
                icon={<LockClosedIcon className="w-[18px] h-[18px] text-white" />}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                hint={<ErrorMessage name="password" component="div" className="text-red-500" />}
              />

              <Input
                type="text"
                // label="Referral Code"
                id="referral"
                placeholder="Enter referral code"
                icon={<UsersIcon className="w-[18px] h-[18px] text-white" />}
                value={values.referral}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.referral}
                hint={<ErrorMessage name="referral" component="div" className="text-red-500" />}
              />

              <div className="space-y-1">
                <Checkbox
                  label={t('i_agree_to_receive_promotional_emails')}
                  id={`signup-terms${Math.random()}`}
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
                // label={t('sign_up')}
                label={t('start_earn_money_now')}
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                icon={<RocketLaunchIcon className="size-5" />}
                customClass="w-full !py-3"
                type="submit"
              />
            </div>
          </form>
        )}
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
      {/* <p className="text-xs">{t('signup_disclaimer')}</p> */}
    </div>
  );
}
