import { auth } from '@/auth';
import Footer from '@/components/Generic/Footer/footer';
import Header from '@/components/Generic/Header/header';
import AuthLayout from '@/components/Layouts/AuthLayout';
import MainLayout from '@/components/Layouts/MainLayout';
import { cookies } from 'next/headers';

const ProtectedLayout = async ({ children }) => {
  const isMobileApp = cookies().get('isMobileApp')?.value;
  const session: any = await auth();

  return (
    <AuthLayout>
      <MainLayout>
        <Header session={session} stats={null} showTicker={false} homepageHeader={true} />
        <main
          className={`main-wrapper ${isMobileApp ? 'pb-28' : ''} min-h-[calc(100dvh-68px-256px)] sm:min-h-[calc(100dvh-96px-24px)]`}
        >
          {children}
        </main>
        {!isMobileApp && <Footer session={session} />}
      </MainLayout>
    </AuthLayout>
  );
};

export default ProtectedLayout;
