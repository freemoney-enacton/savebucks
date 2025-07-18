'use client';
import AuthModal from '@/components/Core/AuthModal';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import ProviderDropdown from '@/components/Generic/dropdowns/ProviderDropdown';
import MissingClaimModal from '@/components/Generic/Modals/MissingClaimModal';
import OfferModal from '@/components/Generic/Modals/OfferModal';
import Pills from '@/components/Generic/Pills';
import TableWithFilter from '@/components/Generic/Table/TableWithFilter';
import { config } from '@/config';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import useUserClaim from '@/Hook/Api/Client/use-user-claim';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { AppRoutes } from '@/routes-config';
import { FolderArrowDownIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from '@nextui-org/react';
import { ArrowUpRight, CheckCircleIcon, CircleXIcon } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SubTabComponent from './SubTabComponent';

const SectionHeader = ({ title, img, isActive, onClick }) => {
  return (
    <button
      role="button"
      onClick={onClick}
      className={`p-[2px] rounded-[10px] transition-ease ${
        isActive ? 'bg-tertiary-gr' : 'bg-black-250 hover:opacity-80 active:opacity-50'
      }`}
    >
      <div className="h-full w-full min-w-[113px] sm:min-w-[150px] bg-black-250 py-5 px-3 rounded-lg space-y-3">
        <div className="h-7 sm:h-10">
          <Image className="max-h-7 sm:max-h-10 !w-auto mx-auto" src={img} alt="icon" width={100} height={100} />
        </div>
        <p className="w-full text-sm font-medium text-center whitespace-nowrap">{title}</p>
      </div>
    </button>
  );
};

export default function TabComponent({ tabFromQuery, type }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const { updatePreviousUrl, formattedDate, getTranslatedValue } = useUtils();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [tableApiEndPoint, setTableApiEndPoint] = useState('cashback/claims');
  const [activeSection, setActiveSection] = useState('earning');
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const {
    isOpen: missingIsOpen,
    onOpen: missingOnOpen,
    onOpenChange: missingOnOpenChange,
    onClose: missingOnClose,
  } = useDisclosure();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { public_get_api } = usePublicApi();
  const { claimStoreList, getClaimStoreList, claimLoading } = useUserClaim();

  useEffect(() => {
    getClaimStoreList();
  }, []);

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

  const generateQuery = () => {
    let baseQuery;

    if (selectedProvider) {
      baseQuery = `network=${selectedProvider}`;
    }
    return baseQuery;
  };

  const defaultPayoutColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original?.created_at)}</div>;
      },
    },
    {
      header: t('withdrawal_id'),
      accessorKey: 'payment_id',
      cell: (info) => info.getValue(),
    },
    {
      header: t('account_type'),
      accessorFn: (row) => `${row.payment_icon} ${row.payment_mode}`,
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original?.payment_icon && (
              <Image
                className="max-h-5 sm:max-h-6 !w-auto"
                src={row.original?.payment_icon}
                alt="icon"
                width={25}
                height={25}
              ></Image>
            )}
            <span>{row.original?.payment_mode}</span>
          </div>
        );
      },
    },
    {
      header: t('account'),
      accessorKey: 'account',
      cell: (info) => info.getValue(),
    },
    {
      header: t('amount'),
      accessorFn: (row) => `${row.amount} ${row.transactional_amount}`,
      cell: ({ cell, row }) => {
        return (
          <div className="flex flex-col">
            <span>{getCurrencyString(row.original?.amount ? row.original?.amount : 0)}</span>
            <span className={`text-xs ${row.original.transactional_amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {row.original.transactional_amount
                ? row.original.transactional_amount > 0
                  ? t('bonus') + ': ' + getCurrencyString(row.original.transactional_amount)
                  : t('fees') + ': ' + getCurrencyString(row.original.transactional_amount)
                : ''}
            </span>
          </div>
        );
      },
    },
    {
      header: t('status'),
      accessorFn: (row) => `${row.status} ${row.created_at}`,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills label={row.original.status} tooltip={true} created_at={row.original.created_at} />
            </div>
          </>
        );
      },
    },
  ];
  const defaultOnGoingTaskColumns = [
    {
      header: t('start_date'),
      accessorKey: 'clicked_on',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.clicked_on)}</div>;
      },
    },
    {
      header: t('device'),
      accessorKey: 'platforms',
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[70px] flex gap-1.5 justify-end sm:justify-start">
            {row.original.platforms?.includes(config.IOS_KEY) && (
              <div className="w-[18px] h-[18px]">
                <Image className="w-[18px] h-[18px]" src="/images/ios-black.png" width={50} height={50} alt="logo" />
                {/* <span className="capitalize">{config.IOS_KEY}</span> */}
              </div>
            )}
            {row.original.platforms?.includes(config.ANDROID_KEY) && (
              <div className="w-[18px] h-[18px]">
                <Image className="w-[18px] h-[18px]" src="/images/android-black.png" width={50} height={50} alt="logo" />
                {/* <span className="capitalize">{config.ANDROID_KEY}</span> */}
              </div>
            )}
            {row.original.platforms?.includes(config.DESKTOP_KEY) && (
              <div className="w-[18px] h-[18px]">
                <Image className="w-[18px] h-[18px]" src="/images/desktop-black.png" width={50} height={50} alt="logo" />
                {/* <span className="capitalize">{config.DESKTOP_KEY}</span> */}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: t('offer_name'),
      accessorFn: (row) => `${row.name} ${row.image}`,
      cell: ({ cell, row }) => {
        return (
          <>
            {/* mobile component */}
            <div className="sm:hidden cursor-pointer flex items-center gap-2">
              <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                {row.original.image ? (
                  <Image className="h-full w-full object-cover" src={row.original.image} alt="icon" width={80} height={80} />
                ) : (
                  <Image className="h-full w-full object-cover" src="/images/offer-1.png" alt="icon" width={80} height={80} />
                )}
              </div>
              <p className="line-clamp-1 break-all">{row.original?.name}</p>
            </div>
            {/* desktop component */}
            <div
              className="max-sm:hidden min-w-[200px] cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleOfferClick(row.original);
              }}
            >
              <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                {row.original?.image ? (
                  <Image
                    className="h-full w-full object-cover"
                    src={row.original?.image}
                    alt="icon"
                    width={25}
                    height={25}
                  ></Image>
                ) : (
                  <Image
                    className="h-full w-full object-cover"
                    src="/images/offer-1.png"
                    alt="icon"
                    width={25}
                    height={25}
                  ></Image>
                )}
              </div>
              <p className="line-clamp-1 break-all">{row.original?.name}</p>
              <ArrowUpRight className="flex-shrink-0 w-4 h-4 text-white cursor-pointer" />
            </div>
          </>
        );
      },
    },
    {
      header: t('offer_partner'),
      accessorFn: (row) => `${row.provider} ${row.networkName}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center max-sm:justify-start gap-2">
            {row.original?.provider?.icon && (
              <div className="h-4 w-[73px]s">
                <Image
                  className="max-h-4 !h-auto !w-auto rounded"
                  src={row.original?.provider?.icon}
                  alt="icon"
                  width={80}
                  height={80}
                ></Image>
              </div>
            )}
            {/* <span>{row.original?.networkName}</span> */}
          </div>
        );
      },
    },
    {
      header: t('support'),
      accessorKey: 'provider',
      cell: ({ cell, row }) => {
        return (
          <Link
            href={row.original?.provider.support_url || ''}
            target="_blank"
            className="cursor-pointer flex items-center max-sm:justify-end"
          >
            <Image
              className="max-h-5 sm:max-h-6 !w-auto"
              src={'/images/coupon_icon.png'}
              alt="icon"
              width={25}
              height={25}
            ></Image>
          </Link>
        );
      },
    },
  ];
  const defaultChargeBackColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.created_at)}</div>;
      },
    },
    {
      header: t('offer_name'),
      accessorFn: (row) => `${row.task_image} ${row.task_name} ${row.task_type}`,
      cell: ({ cell, row }) => {
        setData(row.original);
        return (
          <>
            {/* mobile component */}
            <div className={`sm:hidden ${row.original?.task_type == 'tasks' && 'cursor-pointer'} flex items-center gap-2`}>
              {row.original?.task_type == 'tasks' && (
                <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                  <Image
                    className="h-full w-full object-cover"
                    src={row.original?.task_image ? row.original?.task_image : '/images/offer-1.png'}
                    alt="icon"
                    width={80}
                    height={80}
                  ></Image>
                </div>
              )}
              <p className="line-clamp-1 break-all">{row.original?.task_name}</p>
            </div>
            {/* desktop component */}
            <div
              className={`max-sm:hidden min-w-[200px] ${
                row.original?.task_type == 'tasks' && 'cursor-pointer'
              } flex items-center gap-2`}
              onClick={() => row.original?.task_type == 'tasks' && handleOfferClick(row.original)}
            >
              {row.original?.task_image && (
                <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                  <Image
                    className="h-full w-full object-cover"
                    src={row.original?.task_image ? row.original?.task_image : '/images/offer-1.png'}
                    alt="icon"
                    width={80}
                    height={80}
                  ></Image>
                </div>
              )}
              <p className="line-clamp-1 break-all">{row.original?.task_name}</p>
              {row.original?.task_type == 'tasks' && <ArrowUpRight className="flex-shrink-0 w-4 h-4 text-white cursor-pointer" />}
            </div>
          </>
        );
      },
    },
    {
      header: t('offer_partner'),
      accessorFn: (row) => `${row.networkIcon} ${row.networkName}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center max-sm:justify-end gap-2">
            {row.original?.networkIcon && (
              <div className="h-4 w-[73px]s">
                <Image
                  className="max-h-4 !h-auto !w-auto rounded"
                  src={row.original?.networkIcon}
                  alt="icon"
                  width={80}
                  height={80}
                ></Image>
              </div>
            )}
            {/* <span>{row.original?.networkName}</span> */}
          </div>
        );
      },
    },
    {
      header: t('reward'),
      accessorKey: 'payout',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.payout ? row.original.payout : 0)}</div>;
      },
    },

    {
      header: t('status'),
      accessorKey: 'status',
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills label={row.original.status} tooltip={false} />
            </div>
          </>
        );
      },
    },
  ];
  const defaultMissingClaimColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.created_at)}</div>;
      },
    },
    {
      header: t('claim_id'),
      accessorKey: 'id',
      cell: ({ cell, row }) => {
        return <div>#{row.original.id}</div>;
      },
    },
    {
      header: t('shopping_trip_date'),
      accessorKey: 'click_time',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.click_time)}</div>;
      },
    },
    {
      header: t('store'),
      accessorKey: 'store_name',
      cell: ({ cell, row }) => {
        return <div>{getTranslatedValue(row.original.store_name)}</div>;
      },
    },
    {
      header: t('order_number'),
      accessorKey: 'order_id',
      cell: ({ cell, row }) => {
        return <div>{row.original.order_id}</div>;
      },
    },
    {
      header: t('order_amount'),
      accessorFn: (row) => `${row.order_amount} ${row.currency}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center max-sm:justify-end gap-2">
            {row.original.order_amount ? row.original?.order_amount + ' ' + row.original?.currency : 0}
          </div>
        );
      },
    },

    {
      header: t('status'),
      accessorFn: (row) => `${row.status} ${row.updated_at}`,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="w-fit">
              <Pills
                label={row.original.status}
                tooltip={true}
                created_at={row.original.updated_at}
                tooltip_text={' '}
                tooltip_status={row.original.status == 'closed' || row.original.status == 'hold' ? row.original.status : ''}
              />
            </div>
          </>
        );
      },
    },
  ];
  const defaultClicksColumns = [
    {
      header: t('trip_date'),
      accessorKey: 'click_time',
      cell: ({ cell, row }) => {
        return <div>{formattedDate(row.original.click_time)}</div>;
      },
    },
    {
      header: t('click_id'),
      accessorKey: 'code',
      cell: ({ cell, row }) => {
        return <div>{row.original.code}</div>;
      },
    },
    {
      header: t('store'),
      accessorKey: 'store_name',
      cell: ({ cell, row }) => {
        return <div>{getTranslatedValue(row.original.store_name)}</div>;
      },
    },
    {
      header: t('cashback'),
      accessorKey: 'cashback_enabled',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center justify-end sm:justify-start">
            {row.original.cashback_enabled ? <CheckCircleIcon color="green" size={20} /> : <CircleXIcon color="red" size={20} />}
          </div>
        );
      },
    },

    {
      header: t('status'),
      accessorFn: (row) => `${row.user_cashback_id}`,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="w-fit">
              <Pills
                label={row.original.user_cashback_id ? t('tracked') : t('clicked')}
                tooltip={true}
                created_at={row.original.updated_at}
                tooltip_text={' '}
                tooltip_status={row.original.status == 'closed' || row.original.status == 'hold' ? row.original.status : ''}
              />
            </div>
          </>
        );
      },
    },
  ];

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
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/overview/ongoing-offer') {
      scrollToComponent(150);
    }
    if (pathname === '/overview/charge-back') {
      scrollToComponent(250);
    }
    if (pathname === '/overview/missing-claims') {
      scrollToComponent(400);
    }
    if (pathname === '/overview/clicks') {
      scrollToComponent(500);
    }
  }, [pathname]);

  // Determine which section to show based on tabFromQuery or pathname
  const getCurrentSection = () => {
    if (tabFromQuery === 'earning' || pathname.includes(AppRoutes.overviewEarning)) {
      return 'earning';
    } else if (tabFromQuery === 'withdrawal' || pathname.includes(AppRoutes.overviewWithdrawal)) {
      return 'withdrawal';
    } else if (tabFromQuery === 'ongoing-offer' || pathname.includes(AppRoutes.overviewOngoingOffer)) {
      return 'ongoing-offer';
    } else if (tabFromQuery === 'charge-back' || pathname.includes(AppRoutes.overviewChargeBack)) {
      return 'charge-back';
    } else if (tabFromQuery === 'missing-claims' || pathname.includes(AppRoutes.overviewMissingClaim)) {
      return 'missing-claims';
    } else if (tabFromQuery === 'clicks' || pathname.includes(AppRoutes.overviewClicksClaim)) {
      return 'clicks';
    }
    return 'earning'; // default
  };

  useEffect(() => {
    setActiveSection(getCurrentSection());
  }, [tabFromQuery, pathname]);

  const handleSectionChange = (section) => {
    // Update URL based on section
    if (section === 'earning') {
      router.push(AppRoutes.overviewEarning + '?type=offers', { scroll: false });
    } else if (section === 'withdrawal') {
      router.push(AppRoutes.overviewWithdrawal, { scroll: false });
    } else if (section === 'ongoing-offer') {
      router.push(AppRoutes.overviewOngoingOffer, { scroll: false });
    } else if (section === 'charge-back') {
      router.push(AppRoutes.overviewChargeBack, { scroll: false });
    } else if (section === 'missing-claims') {
      router.push(AppRoutes.overviewMissingClaim, { scroll: false });
    } else if (section === 'clicks') {
      router.push(AppRoutes.overviewClicksClaim, { scroll: false });
    }
  };

  // all sections
  const renderEarningSection = () => (
    <div>
      <SubTabComponent type={type ? type : 'offers'} />
    </div>
  );

  const renderWithdrawalSection = () => (
    <>
      <div className="max-sm:pt-3 sm:pb-5 flex items-center justify-end">
        <ButtonComponent role="link" url={AppRoutes.cashout} label={t('cashout')} variant="primary" />
      </div>
      <TableWithFilter
        apiEndPoint="payments/payout-history"
        defaultColumns={defaultPayoutColumns}
        title={t('withdraw_table_title')}
        visibleColumnNames={[t('account_type'), t('amount')]}
        headerImageKey={'payment_icon'}
        headerTitleKey={'payment_mode'}
      />
    </>
  );

  const renderOngoingOffersSection = () => (
    <div>
      <TableWithFilter
        query={generateQuery()}
        apiEndPoint="tasks/active"
        defaultColumns={defaultOnGoingTaskColumns}
        title={t('ongoing_offers_table_title')}
        filterDropdown={
          <ProviderDropdown type={'active_task'} selectedSetting={selectedProvider} setSelectedSetting={setSelectedProvider} />
        }
        visibleColumnNames={[t('offer_name')]}
        headerImageKey="image"
        headerTitleKey="name"
        hideColumnName={t('offer_name')}
        viewOffer={true}
      />
    </div>
  );

  const renderChargeBackSection = () => (
    <TableWithFilter
      apiEndPoint="cbearnings/charge-backs"
      defaultColumns={defaultChargeBackColumns}
      title={t('chargebacks_table_title')}
      visibleColumnNames={[t('offer_name'), t('reward')]}
      headerImageKey={data.task_type === 'tasks' ? 'task_image' : null}
      headerTitleKey="task_name"
      hideColumnName={t('offer_name')}
      viewOffer={true}
    />
  );

  const renderMissingClaimSection = () => (
    <>
      {claimStoreList?.length > 0 ? (
        <div className="max-sm:pt-3 sm:pb-5 flex items-center justify-end">
          <ButtonComponent
            role="button"
            label={t('create_claim')}
            variant="primary"
            icon={<FolderArrowDownIcon className="size-4 sm:size-5" />}
            onClick={() => {
              missingOnOpen();
            }}
          />
        </div>
      ) : null}
      {/* TODO: Adjust mobile view column */}
      <TableWithFilter
        apiEndPoint={tableApiEndPoint}
        defaultColumns={defaultMissingClaimColumns}
        title={t('missing_claims')}
        visibleColumnNames={[t('store'), t('order_amount')]}
        headerImageKey={data.task_type === 'tasks' ? 'task_image' : null}
        headerTitleKey="task_name"
        hideColumnName={t('offer_name')}
        viewOffer={true}
        filterDropdown={
          !claimLoading && claimStoreList?.length <= 0 ? (
            <div className="bg-yellow-100 rounded-md p-2 text-sm">{t('no_trip_found')}</div>
          ) : null
        }
      />
    </>
  );
  const renderClicksSection = () => (
    <>
      {/* TODO: Adjust mobile view column */}
      <TableWithFilter
        apiEndPoint={'cashback/clicks'}
        defaultColumns={defaultClicksColumns}
        title={t('clicks')}
        visibleColumnNames={[t('store'), t('cashback')]}
      />
    </>
  );

  return (
    <div>
      <div className="w-full inline-flex">
        {/* <div className="earn-tab-wrapper inline-flex gap-2.5 sm:gap-5 overflow-x-auto no-scrollbar"> */}
        <div className="flex p-1 h-fit items-center flex-nowrap overflow-x-scroll scrollbar-hide rounded-medium earn-tab-wrapper bg-transparent gap-2.5 sm:gap-5">
          <SectionHeader
            title={t('earning')}
            img="/images/user-tab1.png"
            isActive={activeSection === 'earning'}
            onClick={() => handleSectionChange('earning')}
          />
          <SectionHeader
            title={t('withdrawal')}
            img="/images/user-tab2.png"
            isActive={activeSection === 'withdrawal'}
            onClick={() => handleSectionChange('withdrawal')}
          />
          <SectionHeader
            title={t('nav_ongoing_offers')}
            img="/images/user-tab3.png"
            isActive={activeSection === 'ongoing-offer'}
            onClick={() => handleSectionChange('ongoing-offer')}
          />
          <SectionHeader
            title={t('nav_chargebacks')}
            img="/images/user-tab4.png"
            isActive={activeSection === 'charge-back'}
            onClick={() => handleSectionChange('charge-back')}
          />
          <SectionHeader
            title={t('missing_claims')}
            img="/images/user-tab5.png"
            isActive={activeSection === 'missing-claims'}
            onClick={() => handleSectionChange('missing-claims')}
          />
          <SectionHeader
            title={t('clicks')}
            img="/images/user-tab6.png"
            isActive={activeSection === 'clicks'}
            onClick={() => handleSectionChange('clicks')}
          />
        </div>
      </div>

      <div className="pt-4 sm:pt-10">
        {activeSection === 'earning' && renderEarningSection()}
        {activeSection === 'withdrawal' && renderWithdrawalSection()}
        {activeSection === 'ongoing-offer' && renderOngoingOffersSection()}
        {activeSection === 'charge-back' && renderChargeBackSection()}
        {activeSection === 'missing-claims' && renderMissingClaimSection()}
        {activeSection === 'clicks' && renderClicksSection()}
      </div>

      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
      <MissingClaimModal
        isOpen={missingIsOpen}
        onOpenChange={missingOnOpenChange}
        onClose={missingOnClose}
        onSuccess={() => {
          setTableApiEndPoint('');
          getClaimStoreList();
          setTimeout(() => {
            setTableApiEndPoint('cashback/claims');
          }, 10);
        }}
      />
    </div>
  );
}
