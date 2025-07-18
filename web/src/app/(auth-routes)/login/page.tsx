import Heading from '@/components/Core/Heading';
import SignInV1 from '@/components/Generic/Forms/SignInV1';
import EmptyHeader from '@/components/Generic/Header/EmptyHeader';
import SignIn from '@/components/Generic/SignIn';
import { config } from '@/config';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('login'),
  };
}
const LoginPage = async () => {
  const { t } = await createTranslation();

  return (
    <>
      <EmptyHeader />
      <div className="relative px-4 py-5 sm:py-8 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-black flex flex-col items-center justify-center overflow-hidden animate-fade-in">
        {config.AUTH_FORM_STYLE === '1' ? (
          <>
            <div className="relative max-w-[410px] mx-auto w-full space-y-4 sm:space-y-7">
              <div className="space-y-2.5 text-center">
                <Heading title={t('login_title')} />
                <p className="sm:text-15px">{t('login_description')}</p>
              </div>
              <div className="relative bg-black-600 p-4 sm:p-6 border border-gray-400 rounded-lg z-[1]">
                <SignIn LoginInPage={true} />
              </div>
              {/* decoration */}
              <div className="absolute top-0 z-[0] right-full size-28 xl:size-[220px] bg-purple filter blur-[200px] rounded-full"></div>
              <div className="absolute bottom-0 left-full z-[0] h-40 xl:h-[220px] w-40 xl:w-[320px] bg-[#CB5560] filter blur-[214px] rounded-full"></div>
            </div>
          </>
        ) : (
          <div className="sign_up_card_warpper">
            <div className="sign_up_card">
              <SignInV1 LoginInPage={true} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
