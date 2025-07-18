'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import TableWithFilter from '../Table/TableWithFilter';
// import ReffralLeaderCard from '../Card/ReffralLeaderCard';
import LeaderboardCard from '../Card/LeaderboardCard';

const ReferralLeaderBoard = () => {
  const { t } = useTranslation();
  const [leaderBoardList, setLeaderBoardList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { public_get_api } = usePublicApi();
  const { getCurrencyString } = useUtils();

  useEffect(() => {
    setLoading(true);
    try {
      public_get_api({ path: 'referreduser/referral-leaderboard' })
        .then((res) => {
          if (res?.data && res?.success) {
            setLeaderBoardList(res?.data);
          }
        })
        .finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const defaultReferralLeaderBoardColumns = [
    {
      header: t('date'),
      hideHeader: true,
      accessorKey: 'joining_date',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className={`flex-shrink-0 size-6 rounded-full grid place-content-center bg-black-250 text-gray-600 font-medium`}>
              {row.index + 1}
            </div>
            <div className="flex-shrink-0 h-6 w-[0.5px] bg-gray-400"></div>
            <p className="text-white text-xs sm:text-sm font-medium">{t('anonymous')}</p>
          </div>
        );
      },
    },
    {
      header: t('user_earning'),
      accessorKey: 'referral_earning',
      cell: ({ cell, row }) => {
        return (
          <p className="text-white text-xs sm:text-sm font-medium text-right">
            {getCurrencyString(row.original.user_earning_amount ? row.original.user_earning_amount : 0)}
          </p>
        );
      },
    },
  ];

  return (
    <div className="referral-leaderboard-table">
      {loading ? (
        <div className="py-[30%] flex items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          {leaderBoardList?.length > 0 && (
            <div className="max-sm:pt-4 space-y-4 sm:space-y-10">
              <h3 className="text-sm sm:text-xl font-semibold bg-white-heading-gr text-gradient">
                {t('affliate_leaderboard_title')}
              </h3>
              <div className="relative w-full max-w-[400px] sm:max-w-[588px] pb-10 sm:pb-16 flex items-end mx-auto">
                <LeaderboardCard
                  name={t('anonymous')}
                  amount={leaderBoardList[1]?.user_earning_amount && getCurrencyString(leaderBoardList[1]?.user_earning_amount)}
                  index={0}
                />
                <LeaderboardCard
                  name={t('anonymous')}
                  amount={leaderBoardList[0]?.user_earning_amount && getCurrencyString(leaderBoardList[0]?.user_earning_amount)}
                  index={1}
                />
                <LeaderboardCard
                  name={t('anonymous')}
                  amount={leaderBoardList[2]?.user_earning_amount && getCurrencyString(leaderBoardList[2]?.user_earning_amount)}
                  index={2}
                />
                {/* old style */}
                {/* <ReffralLeaderCard
                  rank={2}
                  name={t('anonymous')}
                  amount={leaderBoardList[1]?.user_earning_amount && getCurrencyString(leaderBoardList[1]?.user_earning_amount)}
                />
                <ReffralLeaderCard
                  rank={1}
                  name={t('anonymous')}
                  amount={leaderBoardList[0]?.user_earning_amount && getCurrencyString(leaderBoardList[0]?.user_earning_amount)}
                />
                <ReffralLeaderCard
                  rank={3}
                  name={t('anonymous')}
                  amount={leaderBoardList[2]?.user_earning_amount && getCurrencyString(leaderBoardList[2]?.user_earning_amount)}
                /> */}
                {/* <div className="absolute top-8 sm:top-16 lg:top-20 right-1/2 transform translate-x-1/2 z-[0] bg-primary size-16 sm:size-[120px] lg:size-[170px] filter blur-[192px] rounded-full"></div> */}
              </div>
              <TableWithFilter
                apiEndPoint="referreduser/referral-leaderboard"
                defaultColumns={defaultReferralLeaderBoardColumns}
                cardCustomClass="!pt-2 sm:!pt-4"
                hidePagination={true}
                hideNextPageNavigation={true}
                visibleColumnNames={[t('date')]}
                showDefaultPerPage={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReferralLeaderBoard;
