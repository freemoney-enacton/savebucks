'use client';
import AuthModal from '@/components/Core/AuthModal';
import OfferModal from '@/components/Generic/Modals/OfferModal';
import Pills from '@/components/Generic/Pills';
import ReferralLeaderBoard from '@/components/Generic/Section/ReferralLeaderBoard';
import TableWithFilter from '@/components/Generic/Table/TableWithFilter';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { ArrowUpRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReferTabComponent() {
  const { t } = useTranslation();
  const { data: session }: any = useSession();
  const { getCurrencyString, getTranslatedValue } = useUtils();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const { public_get_api } = usePublicApi();

  const { updatePreviousUrl, formattedDate } = useUtils();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleOfferClick = (data) => {
    if (status === 'unauthenticated') {
      authOnOpen();
    } else {
      updatePreviousUrl();
      window.history.pushState({}, '', `/offer/${data?.slug}`);
      onOpen();
      try {
        setLoading(true);
        public_get_api({ path: `tasks/${data?.network}/${data?.campaign_id}` })
          .then((res) => {
            if (res?.data && res?.success) {
              setOfferModalData(res?.data);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    }
  };
  const levelColumns = [
    {
      header: t('tier'),
      accessorFn: (row) => `${row.icon} ${row.label} ${row.tier} `,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="flex items-center gap-2">
              {row.original.icon && (
                <div className="flex-shrink-0 h-4">
                  <Image className="max-h-4 !w-auto" src={row.original.icon} alt="icon" width={80} height={80} />
                </div>
              )}
              <span className="whitespace-nowrap">{row.original.label}</span>
              {session?.user?.user?.tierDetails?.tier == row.original.tier && (
                <span className="active-tier flex-shrink-0 py-0.5 px-2 bg-green-450 text-xs text-black rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
          </>
        );
      },
    },
    {
      header: t('commission'),
      accessorKey: 'affiliate_commission',
      cell: ({ cell, row }) => {
        return <span>{row.original.affiliate_commission}%</span>;
      },
    },
    {
      header: t('requirements'),
      accessorKey: 'required_affiliate_earnings',
      cell: ({ cell, row }) => {
        return (
          <span>
            {getCurrencyString(row.original.required_affiliate_earnings)} {t('affiliate_earnings')}
          </span>
        );
      },
    },
  ];
  const defaultColumns = [
    {
      header: t('joining_date'),
      accessorKey: 'joining_date',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.joining_date)}</div>;
      },
    },
    {
      header: t('username'),
      accessorKey: 'name',
      cell: (info) => info.getValue(),
    },
    {
      header: t('user_earning'),
      accessorKey: 'referral_earning',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.referral_earning ? row.original.referral_earning : 0)}</div>;
      },
    },
    {
      header: t('email'),
      accessorKey: 'email',
      cell: (info) => info.getValue(),
    },
    {
      header: t('my_earning'),
      accessorKey: 'earnings',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.earnings ? row.original.earnings : 0)}</div>;
      },
    },
    {
      header: t('Reward_count'),
      accessorKey: 'count',
      cell: (info) => info.getValue(),
    },
  ];
  const defaultRewardColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.created_at)}</div>;
      },
    },
    {
      header: t('reward_type'),
      accessorKey: 'bonus_name',
      cell: (info) => info.getValue(),
    },
    {
      header: t('amount'),
      accessorKey: 'amount',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.amount ? row.original?.amount : 0)}</div>;
      },
    },
    {
      header: t('reward_status'),
      accessorFn: (row) => `${row.status} ${row.created_at}`,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills label={row.original.status} tooltip={true} created_at={row.original.expires_on} />
            </div>
          </>
        );
      },
    },
  ];

  const defaultReferralColumns = [
    {
      header: t('date'),
      accessorKey: 'joining_date',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.joining_date)}</div>;
      },
    },
    {
      header: t('username'),
      accessorKey: 'name',
      cell: (info) => info.getValue(),
    },
    {
      header: t('user_earning'),
      accessorKey: 'referral_earning',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.referral_earning ? row.original?.referral_earning : 0)}</div>;
      },
    },
    {
      header: t('offer_name'),
      accessorFn: (row) => `${row.offerName} ${row.task_type}`,
      cell: ({ cell, row }) => {
        setData(row.original);
        return (
          <div
            className={`${row.original?.task_type == 'tasks' && 'cursor-pointer'} flex items-center gap-1`}
            onClick={() => row.original?.task_type == 'tasks' && handleOfferClick(row.original)}
          >
            <span>{row.original.offerName}</span>
            <div className="cursor-pointer">
              {row.original?.task_type == 'tasks' && (
                <ArrowUpRight className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => {}} />
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: t('my_earning'),
      accessorKey: 'earnings',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.earnings ? row.original.earnings : 0)}</div>;
      },
    },
    {
      header: t('status'),
      accessorKey: 'status',
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills label={row.original.status} />
            </div>
          </>
        );
      },
    },
  ];
  const defaultCbReferralColumns = [
    {
      header: t('date'),
      accessorKey: 'joining_date',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.joining_date)}</div>;
      },
    },
    {
      header: t('username'),
      accessorKey: 'name',
      cell: (info) => info.getValue(),
    },
    {
      header: t('user_earning'),
      accessorKey: 'referral_earning',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.referral_earning ? row.original.referral_earning : 0)}</div>;
      },
    },
    {
      header: t('store_name'),
      accessorFn: (row) => `${row.store_name}`,
      cell: ({ cell, row }) => {
        setData(row.original);
        return (
          <div>
            <span>{getTranslatedValue(row.original.store_name)}</span>
            <div className="cursor-pointer">
              {row.original?.task_type == 'tasks' && (
                <ArrowUpRight className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => {}} />
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: t('my_earning'),
      accessorKey: 'earnings',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.earnings ? row.original.earnings : 0)}</div>;
      },
    },
    {
      header: t('status'),
      accessorKey: 'status',
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills label={row.original.status} />
            </div>
          </>
        );
      },
    },
  ];

  const handleTabClick = (type) => {
    switch (type) {
      case 'tier':
        router.push('?type=tier', {
          scroll: false,
        });
        break;
      case 'affiliates':
        router.push('?type=affiliates', {
          scroll: false,
        });
        break;
      case 'rewards':
        router.push('?type=rewards', {
          scroll: false,
        });
        break;
      case 'referral':
        router.push('?type=referral', {
          scroll: false,
        });
        break;
      case 'cbreferral':
        router.push('?type=cbreferral', {
          scroll: false,
        });
        break;
      case 'leaderboard':
        router.push('?type=leaderboard', {
          scroll: false,
        });
        break;
      default:
        router.push('?type=tier', {
          scroll: false,
        });
        break;
    }
  };
  const scrollToComponent = (scrollNumber) => {
    setTimeout(() => {
      const tabWrapper = document.querySelector('.earn-tab-wrapper');
      if (tabWrapper instanceof HTMLElement) {
        const currentScroll = tabWrapper.scrollLeft;
        const maxScroll = tabWrapper.scrollWidth - tabWrapper.clientWidth;
        const targetScroll = Math.min(currentScroll + scrollNumber, maxScroll);

        tabWrapper.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }
    }, 100);
  };
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathname = searchParams.get('type');
  const tabKeyMap = {
    tier: 'tier',
    affiliates: 'affiliates',
    rewards: 'rewards',
    referral: 'referral',
    cbreferral: 'cbreferral',
    leaderboard: 'leaderboard',
  };
  const selectedTabKey = pathname && typeof pathname === 'string' ? tabKeyMap[pathname] : 'tier';
  useEffect(() => {
    if (pathname == 'tier') {
      scrollToComponent(150);
    }
    if (pathname == 'affiliates') {
      scrollToComponent(250);
    }
    if (pathname == 'rewards') {
      scrollToComponent(400);
    }
    if (pathname == 'referral') {
      scrollToComponent(500);
    }
    if (pathname == 'cbreferral') {
      scrollToComponent(600);
    }
    if (pathname == 'leaderboard') {
      scrollToComponent(700);
    }
  }, [pathname]);

  return (
    <div>
      <Tabs
        selectedKey={selectedTabKey}
        aria-label="454"
        classNames={{
          base: 'w-full',
          tabList: 'earn-tab-wrapper bg-black-600 p-2 sm:p-2.5 rounded-lg',
          tab: 'text-white !h-auto !p-0 focus:ring-offset-0 focus:ring-0 focus:!outline-0 focus:border-0 focus-visible:!outline-0 data-[focus-visible=true]:z-[1]',
          tabContent: 'rounded-lg py-2 px-3 sm:px-5 max-sm:text-xs group-data-[selected=true]:!text-black font-medium',
          cursor: 'bg-primary-gr rounded-lg',
          panel: 'custom-panel-class pt-0 sm:pt-10 px-0 py-0',
        }}
      >
        <Tab
          key="tier"
          title={
            <p
              onClick={() => {
                handleTabClick('tier');
              }}
            >
              {t('tier')}
            </p>
          }
        >
          <TableWithFilter
            title={t('refer_level_table_title')}
            defaultColumns={levelColumns}
            apiEndPoint="tier"
            visibleColumnNames={[t('commission'), t('requirements')]}
          />
        </Tab>
        <Tab
          key="affiliates"
          title={
            <p
              onClick={() => {
                handleTabClick('affiliates');
              }}
            >
              {t('affiliates')}
            </p>
          }
        >
          <TableWithFilter
            title={t('refer_affiliate_table_title')}
            defaultColumns={defaultColumns}
            apiEndPoint="referreduser/referrals"
            visibleColumnNames={[t('username'), t('my_earning')]}
          />
        </Tab>
        <Tab
          key="rewards"
          title={
            <p
              onClick={() => {
                handleTabClick('rewards');
              }}
            >
              {t('rewards')}
            </p>
          }
        >
          <TableWithFilter
            title={t('refer_rewards_table_title')}
            apiEndPoint="user-bonuses/"
            defaultColumns={defaultRewardColumns}
            visibleColumnNames={[t('reward_type'), t('amount')]}
          />
        </Tab>
        <Tab
          key="referral"
          title={
            <p
              onClick={() => {
                handleTabClick('referral');
              }}
            >
              {t('referral')}
            </p>
          }
        >
          <TableWithFilter
            title={t('refer_referral_table_title')}
            apiEndPoint="referreduser/task-referrals"
            defaultColumns={defaultReferralColumns}
            visibleColumnNames={[t('username'), t('user_earning')]}
          />
        </Tab>
        <Tab
          key="cbreferral"
          title={
            <p
              onClick={() => {
                handleTabClick('cbreferral');
              }}
            >
              {t('cashback_referral')}
            </p>
          }
        >
          <TableWithFilter
            title={t('refer_referral_table_title')}
            apiEndPoint="referreduser/cashback-referrals"
            defaultColumns={defaultCbReferralColumns}
            visibleColumnNames={[t('username'), t('user_earning')]}
          />
        </Tab>
        <Tab
          key="leaderboard"
          title={
            <p
              onClick={() => {
                handleTabClick('leaderboard');
              }}
            >
              {t('leaderboard')}
            </p>
          }
        >
          <ReferralLeaderBoard />
        </Tab>
      </Tabs>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />

      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
    </div>
  );
}
