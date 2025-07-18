import Heading from '@/components/Core/Heading';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import BonusCodeSection from '@/components/Generic/Section/BonusCodeSection';
import CMSSection from '@/components/Generic/Section/CMSSection';
import LadderSection from '@/components/Generic/Section/LadderSection';
import RewardsStreakSection from '@/components/Generic/Section/RewardsStreakSection';
import SocialClaimSection from '@/components/Generic/Section/SocialClaimSection';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  const rewardData = await public_get_api({
    path: `cms/pages/rewards`,
  });
  return {
    title: rewardData?.data?.meta_title || t('rewards'),
    description: rewardData?.data?.meta_description || t('rewards'),
  };
}

const Rewards = async () => {
  const { t } = await createTranslation();
  let [ladderDetails, streaks, rewardData] = await Promise.all([
    public_get_api({
      path: `bonuses/daily-bonus-ladder/details`,
    }),
    public_get_api({
      path: `bonuses/daily-streaks/details`,
    }),
    public_get_api({
      path: `cms/pages/rewards`,
    }),
  ]);
  if (rewardData?.data?.[0]?.status != 'publish') notFound();
  const RenderRewardSection = ({ item }) => {
    return <CMSSection item={item} page={'Rewards'} />;
  };

  return (
    <section className="section">
      <div className="container">
        <div className="space-y-4 sm:space-y-7">
          <div className="flex items-center justify-between gap-2">
            <Heading title={t('rewards')} customClass="sm:!text-3xl !w-fit" />

            <BonusCodeSection />
          </div>

          <div className="grid md:grid-cols-[1fr_328px] gap-4 sm:gap-6 lg:gap-10">
            <div className="rewards-card-section space-y-4 sm:space-y-10">
              {rewardData?.data?.[0]?.blocks?.length > 0 ? (
                <div className="containerss">
                  {rewardData?.data[0]?.blocks?.map((item, index) => (
                    <RenderRewardSection key={index} item={item} />
                  ))}
                </div>
              ) : null}

              {streaks?.data && <RewardsStreakSection streaksData={streaks?.data} />}

              <div className="space-y-3 sm:space-y-6">
                <SectionTitleWithIcon title={t('how_it_works')} img={'/images/reward-hiw-icon.png'} />
                <p>{t('reward_hiw_description')}</p>
              </div>

              <SocialClaimSection />
            </div>
            <LadderSection ladderData={ladderDetails?.data} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rewards;
