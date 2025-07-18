import { auth } from '@/auth';
import Footer from '@/components/Generic/Footer/footer';
import Header from '@/components/Generic/Header/header';
import MobBottomNav from '@/components/Generic/MobBottomNav';
import Sidebar from '@/components/Generic/Sidebar/sidebar';
import AuthLayout from '@/components/Layouts/AuthLayout';
import MainLayout from '@/components/Layouts/MainLayout';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { cookies } from 'next/headers';

const ProtectedLayout = async ({ children }) => {
  const isMobileApp = cookies().get('isMobileApp')?.value;

  const session: any = await auth();
  let data;

  if (session?.user?.token) {
    data = await public_get_api({
      path: 'stats',
    });
  }
  const loggedIn = !!session?.user?.token;

  return (
    <AuthLayout>
      <MainLayout>
        <Header session={session} stats={data?.data} />
        <Sidebar />
        <main
          className={`main-wrapper ${
            isMobileApp ? 'pb-28' : ''
          } min-h-[calc(100vh-68px-256px)] sm:min-h-[calc(100vh-96px-24px)] xl:pl-[224px]`}
        >
          {children}
        </main>
        {!isMobileApp && <Footer session={session} />}
        {loggedIn && <MobBottomNav />}
      </MainLayout>
    </AuthLayout>
  );
};

export default ProtectedLayout;
