import MobBottomNav from '@/components/Generic/MobBottomNav';
import Sidebar from '@/components/Generic/Sidebar/sidebar';
import AuthLayout from '@/components/Layouts/AuthLayout';
import MainLayout from '@/components/Layouts/MainLayout';

const ProtectedLayout = ({ children }) => {
  return (
    <AuthLayout>
      <MainLayout>
        <Sidebar />
        <main className="h-screen sm:min-h-[calc(100vh-96px-24px)] xl:pl-[224px]">{children}</main>
        <MobBottomNav />
      </MainLayout>
    </AuthLayout>
  );
};

export default ProtectedLayout;
