import SectionTitle from '@/components/Core/SectionTitle';
import { createTranslation } from '@/i18n/server';
import EditProfile from './EditProfile';
import EditSetting from './EditSetting';
import ChangePassword from './ChangePassword';
import { auth } from '@/auth';
import DeleteUserAccount from './DeleteUserAccount';
import { Metadata } from 'next';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import KycBar from './KycBar';
import CheckUserKyc from '@/components/Generic/CheckUserKyc';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const settings = await public_get_api({
    path: 'settings',
  });
  return {
    title: settings?.data?.seo?.userdashboard_profile_title || t('refer_and_earn'),
    description: t('refer_and_earn'),
  };
}

export default async function ProfilePage() {
  const { t } = await createTranslation();
  const data: any = await auth();
  const userId = data?.user?.user?.id;
  return (
    <>
      <div className="section text-white">
        <div className="container">
          <CheckUserKyc />
          <SectionTitle title={t('Profile')} customClass="!text-left w-fit" />
          <div className="space-y-5 sm:space-y-10 pt-3">
            {/* edit profile */}
            <EditProfile />
            <KycBar />
            {/* settings */}
            <EditSetting />
            {/* change password */}
            {data?.user?.user?.provider_type == 'email' && <ChangePassword />}
            {/* delete account */}
            {userId == 473 || userId == 600 || userId == 601 || userId == 609 ? null : <DeleteUserAccount />}
          </div>
        </div>
      </div>
      {/* delete account modal */}
    </>
  );
}
