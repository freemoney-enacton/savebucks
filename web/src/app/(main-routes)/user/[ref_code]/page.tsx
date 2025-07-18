import SectionTitle from '@/components/Core/SectionTitle';
import UserProfileDetailsCard from '@/components/Generic/Card/UserProfileDetailsCard';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import UserEarningInfo from '../../overview/UserEarningInfo';
import UserPublicTable from '@/components/Generic/Table/UserPublicTable';
import UserPrivateProfile from '@/components/Generic/Modals/UserPrivateProfile';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('user'),
  };
}

const UserProfilePage = async ({ params }: { params: { ref_code: string } }) => {
  const { t } = await createTranslation();
  const userData = await public_get_api({ path: `user/public-profile/${params.ref_code}` });
  if (!userData?.data?.id) return notFound();
  return (
    <div className="py-5 sm:py-10 text-white">
      <div className="container">
        <div className="space-y-4 sm:space-y-10">
          <SectionTitle title={t('profile')} customClass="!text-left w-fit" />
          {userData?.data?.is_private ? (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 2xl:gap-10">
              <UserPrivateProfile name={userData?.data?.name} />
            </div>
          ) : (
            <>
              <div className="pt-3 grid lg:grid-cols-[minmax(430px,_430px)_1fr] 2xl:grid-cols-2 gap-6 2xl:gap-10">
                <UserProfileDetailsCard userProfileInfo={userData.data} />
                <UserEarningInfo EarningStats={userData?.data?.stats} hideCurrencyConverterSwitch={true} />
              </div>
              <UserPublicTable ref_code={params.ref_code} userProfilePage={true} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
