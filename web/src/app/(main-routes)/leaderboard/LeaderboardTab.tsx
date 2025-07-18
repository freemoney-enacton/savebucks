'use client';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import LeaderboardTable from './LeaderboardTable';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import Loader from '@/components/Core/Loader';
import LeaderboardCard from '@/components/Generic/Card/LeaderboardCard';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useUtils } from '@/Hook/use-utils';

const LeaderboardTab = ({ leaderBoardDetails }) => {
  const [userDetailsCache, setUserDetailsCache] = useState<any>({});
  const [tabDataCache, setTabDataCache] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState(Object.keys(leaderBoardDetails)[0]); // Initially select the first tab
  const { public_get_api } = usePublicApi();
  const [loading, setLoading] = useState(false);
  const { getCurrencyString } = useUtils();

  useEffect(() => {
    if (!tabDataCache[selectedTab]) {
      callDetailsApi(selectedTab);
    }
    if (!userDetailsCache[selectedTab]) {
      callUserDetailsApi(selectedTab);
    }
  }, [selectedTab]);

  const callUserDetailsApi = async (tabCode: string) => {
    setLoading(true);
    await public_get_api({
      path: `leaderboards/user-details/${tabCode}`,
    })
      .then((res) => {
        if (res) {
          // Store user details for the selected tab
          setUserDetailsCache((prevCache) => ({
            ...prevCache,
            [tabCode]: res?.userRank,
          }));
        }
      })
      .finally(() => setLoading(false))
      .catch((error) => {
        setLoading(false);
      });
  };

  const callDetailsApi = async (tabCode: string) => {
    setLoading(true);
    await public_get_api({
      path: `leaderboards/details/${tabCode}`,
    })
      .then((res) => {
        if (res) {
          const updatedData = [null, null, null];
          res?.top3Earners?.forEach((user) => {
            if (user.rank === 1) updatedData[1] = user;
            else if (user.rank === 2) updatedData[0] = user;
            else if (user.rank === 3) updatedData[2] = user;
          });
          // Store the leaderboard details for the selected tab
          setTabDataCache((prevCache) => ({
            ...prevCache,
            [tabCode]: updatedData,
          }));
        }
      })
      .finally(() => setLoading(false))
      .catch((error) => {
        setLoading(false);
      });
  };

  const CustomTabHeader = ({ title, onClick }: any) => {
    return (
      <div onClick={onClick}>
        <p>{title}</p>
      </div>
    );
  };

  return (
    <>
      {Object.entries(leaderBoardDetails)?.length > 0 ? (
        <Tabs
          aria-label="Options"
          classNames={{
            base: 'w-full justify-center',
            tabList: 'bg-black-600 p-2 sm:p-2.5 rounded-lg',
            tab: 'text-white !h-auto !p-0 focus:ring-offset-0 focus:ring-0 focus:!outline-0 focus:border-0 focus-visible:!outline-0 data-[focus-visible=true]:z-[1]',
            tabContent: 'rounded-lg py-2 px-3 sm:px-5 max-sm:text-xs group-data-[selected=true]:!text-black font-medium',
            cursor: 'bg-primary-gr rounded-lg',
            panel: 'custom-panel-class pt-0 sm:pt-10 px-0 py-0',
          }}
        >
          {Object.entries(leaderBoardDetails).map(([key, details]: [string, any], index: number) => {
            return (
              <Tab
                key={key}
                title={
                  <CustomTabHeader
                    onClick={() => {
                      setSelectedTab(key);
                    }}
                    title={`${getCurrencyString(details?.leaderboard?.prize)} ${details?.leaderboard?.name}`}
                  />
                }
              >
                <>
                  {tabDataCache[key]?.length > 0 && (
                    <div className="relative w-full max-w-[400px] sm:max-w-[588px] pb-10 sm:pb-16 flex items-end mx-auto">
                      {tabDataCache[key]?.map((data, index) => {
                        return <LeaderboardCard key={index} data={data} index={index} />;
                      })}

                      {/* <div className="absolute top-8 sm:top-16 lg:top-20 right-1/2 transform translate-x-1/2 z-[0] bg-primary size-16 sm:size-[120px] lg:size-[170px] filter blur-[192px] rounded-full"></div> */}
                    </div>
                  )}
                  <div className="leaderboard-table space-y-2.5">
                    <SectionTitleWithIcon
                      title={`${getCurrencyString(details?.leaderboard?.prize)} ${details?.leaderboard?.name}`}
                      img={'/images/leaderboard-page-icon.png'}
                    />
                    <LeaderboardTable
                      end_date={details?.leaderboard?.end_date}
                      user_details={userDetailsCache[key]} // Use cached user details
                      type={key}
                    />
                  </div>
                </>
              </Tab>
            );
          })}
        </Tabs>
      ) : (
        <span>loading</span>
      )}
      {loading && <Loader />}
    </>
  );
};

export default LeaderboardTab;
