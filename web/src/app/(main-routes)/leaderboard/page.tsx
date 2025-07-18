import React from 'react';
import SectionTitle from '@/components/Core/SectionTitle';
import { createTranslation } from '@/i18n/server';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { Metadata } from 'next';
import LeaderboardTab from './LeaderboardTab';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('leaderboard'),
  };
}

const LeaderBoardPage = async () => {
  const { t } = await createTranslation();

  // Fetch leaderboard codes
  const response = await public_get_api({
    path: `leaderboards/running`,
  });
  if (response?.status != 200 && response?.error) {
    return (
      <div className="min-h-[calc(100vh-68px-256px)] sm:min-h-[calc(100vh-96px-24px)] flex items-center justify-center w-full h-full">
        <SectionTitle customClass="text-center" title={response?.error} />
      </div>
    );
  }

  const { status, ...leaderBoardCode } = response;

  const apiPromises: Promise<void>[] = [];
  const leaderboardDetails = {};

  if (leaderBoardCode) {
    Object.values(leaderBoardCode).forEach((leaderboard: any, index: number) => {
      const code = leaderboard?.code;

      // Push API promise to fetch leaderboard details
      apiPromises.push(
        public_get_api({
          path: `leaderboards/details/${code}`,
        }).then((details) => {
          if (!details.error) leaderboardDetails[`${code}`] = details;
        })
      );
    });
  }

  // Wait for all API calls to resolve
  await Promise.all(apiPromises);

  return (
    <section className="section">
      <div className="container max-w-[1200px] space-y-4 sm:space-y-8">
        <SectionTitle customClass="w-fit text-left" title={t('leaderboard')} />

        {Object.keys(leaderboardDetails).length > 0 && <LeaderboardTab leaderBoardDetails={leaderboardDetails} />}
      </div>
    </section>
  );
};

export default LeaderBoardPage;
