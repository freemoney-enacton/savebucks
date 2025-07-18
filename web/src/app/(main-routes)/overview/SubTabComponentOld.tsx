import React, { useState } from 'react';
import { Tabs, Tab, useDisclosure } from '@nextui-org/react';
import TableWithFilter from '@/components/Generic/Table/TableWithFilter';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import Pills from '@/components/Generic/Pills';
import { useUtils } from '@/Hook/use-utils';
import { ArrowUpRight } from 'lucide-react';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import AuthModal from '@/components/Core/AuthModal';
import OfferModal from '@/components/Generic/Modals/OfferModal';
import { useRouter } from 'next/navigation';
import ProviderDropdown from '@/components/Generic/dropdowns/ProviderDropdown';
// import Cookies from 'js-cookie';

export default function SubTabComponentOld({ type }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { getCurrencyString, formattedDate, getTranslatedValue } = useUtils();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const [selectedProvider, setSelectedProvider] = useState('');

  const { updatePreviousUrl } = useUtils();
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

  const handleTabClick = (type) => {
    setSelectedProvider(''); // Reset selected provider on tab change
    router.push(`?type=${type}`, {
      scroll: false,
    });
  };
  const defaultOfferColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div className="whitespace-nowrap">{formattedDate(row.original.created_at)}</div>;
      },
    },
    {
      header: t('offer_name'),
      accessorFn: (row) => `${row.task_image} ${row.task_name} ${row.goal_name}`,
      cell: ({ cell, row }) => {
        setData(row.original);
        return (
          <>
            {/* mobile component */}
            <div className="sm:hidden cursor-pointer flex items-center gap-2">
              <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                {row.original.task_image ? (
                  <Image className="h-full w-full object-cover" src={row.original.task_image} alt="icon" width={80} height={80} />
                ) : (
                  <Image className="h-full w-full object-cover" src="/images/offer-1.png" alt="icon" width={80} height={80} />
                )}
              </div>
              <p className="line-clamp-1 break-all">
                {row.original.task_name} {row.original.goal_name ? ` - ${row.original.goal_name}` : ''}
              </p>
            </div>
            {/* desktop component */}
            <div
              className="max-sm:hidden min-w-[200px] cursor-pointer flex items-center gap-2"
              onClick={() => handleOfferClick(row.original)}
            >
              <div className="flex-shrink-0 h-[30px] w-[30px] bg-black-600 rounded-md overflow-hidden">
                {row.original.task_image ? (
                  <Image className="h-full w-full object-cover" src={row.original.task_image} alt="icon" width={80} height={80} />
                ) : (
                  <Image className="h-full w-full object-cover" src="/images/offer-1.png" alt="icon" width={80} height={80} />
                )}
              </div>
              <p className="line-clamp-1 break-all">
                {row.original.task_name} {row.original.goal_name ? ` - ${row.original.goal_name}` : ''}
              </p>
              <ArrowUpRight className="flex-shrink-0 w-4 h-4 text-white cursor-pointer" onClick={() => {}} />
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
            {row.original.networkIcon && (
              <div className="h-4 w-[73px]s">
                <Image className="max-h-4 !w-auto rounded" src={row.original.networkIcon} alt="icon" width={80} height={80} />
              </div>
            )}
            {/* <span>{row.original.networkName}</span> */}
          </div>
        );
      },
    },
    {
      header: t('rewards'),
      accessorKey: 'payout',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.payout ? row.original.payout : 0)}</div>;
      },
    },
    {
      header: t('reward_status'),
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
  const defaultSurveyColumns = [
    {
      header: t('date'),
      accessorKey: 'created_at',
      cell: ({ cell, row }) => {
        return <div className="whitespace-nowrap">{formattedDate(row.original.created_at)}</div>;
      },
    },
    {
      header: t('offer_name'),
      accessorKey: 'task_name',
      cell: (info) => <p className="min-w-[200px]">{info.getValue()}</p>,
    },
    {
      header: t('offer_partner'),
      accessorFn: (row) => `${row.networkIcon} ${row.networkName}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center max-sm:justify-end gap-2">
            {row.original.networkIcon && (
              <div className="h-4 w-[73px]s">
                <Image className="max-h-4 !w-auto rounded" src={row.original.networkIcon} alt="icon" width={80} height={80} />
              </div>
            )}
            {/* <span>{row.original.networkName}</span> */}
          </div>
        );
      },
    },
    {
      header: t('rewards'),
      accessorKey: 'payout',
      cell: ({ cell, row }) => {
        return <div>{getCurrencyString(row.original?.payout ? row.original.payout : 0)}</div>;
      },
    },
    {
      header: t('reward_status'),
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
  const defaultShoppingColumns = [
    {
      header: t('date'),
      accessorKey: 'transaction_time',
      cell: ({ cell, row }) => {
        return <div className="whitespace-nowrap">{formattedDate(row.original.transaction_time)}</div>;
      },
    },
    {
      header: t('click_id'),
      accessorKey: 'click_code',
      // cell: (info) => info.getValue(),
      cell: (info) => <p>{info.getValue()}</p>,
    },
    {
      header: t('store'),
      accessorFn: (row) => `${row.store_logo} ${row.store_name}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center gap-2">
            {/* {row.original.store_logo && (
              <div className="h-4 w-[73px]s">
                <Image className="max-h-4 !w-auto rounded" src={row.original.store_logo} alt="icon" width={80} height={80} />
              </div>
            )} */}
            <span>{getTranslatedValue(row.original.store_name)}</span>
          </div>
        );
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
      header: t('cashback_amount'),
      accessorFn: (row) => `${row.cashback} ${row.cashback_type}`,
      cell: ({ cell, row }) => {
        return (
          <div className="min-w-[73px]s flex items-center gap-2">
            {getCurrencyString(row.original?.cashback ? row.original.cashback : 0)}{' '}
            <span className="text-xs">
              {'('}
              {row.original.cashback_type}
              {')'}
            </span>
            {/* <div className="border-1 border-gray-700 rounded p-1">{row.original.cashback_type}</div> */}
          </div>
        );
      },
    },

    {
      header: t('status'),
      accessorFn: (row) => `${row.status} ${row.expected_date}`,
      cell: ({ cell, row }) => {
        return (
          <>
            <div className="">
              <Pills
                label={row.original.status}
                tooltip={true}
                created_at={row.original.expected_date}
                tooltip_text={t('confirmed_by')}
              />
            </div>
          </>
        );
      },
    },
  ];

  const generateQuery = (typeData) => {
    let baseQuery;

    baseQuery = `type=${typeData}`;

    if (selectedProvider) {
      if (typeData === 'tasks' && type === 'offers') baseQuery += `&network=${selectedProvider}`;
      else if (typeData === 'surveys' && type === 'surveys') baseQuery += `&network=${selectedProvider}`;
      else {
        baseQuery;
      }
    }
    return baseQuery;
  };

  return (
    <>
      <Tabs
        selectedKey={type}
        aria-label="Options"
        classNames={{
          base: 'w-full max-sm:pt-4',
          tabList: 'bg-black-600 p-2 sm:p-2.5 rounded-lg',
          tab: 'text-white !h-auto !p-0 focus:ring-offset-0 focus:ring-0 focus:!outline-0 focus:border-0 focus-visible:!outline-0 data-[focus-visible=true]:z-[1]',
          tabContent: 'rounded-lg py-2 px-3 sm:px-5 max-sm:text-xs group-data-[selected=true]:!text-black font-medium',
          cursor: 'bg-primary-gr rounded-lg',
          panel: 'custom-panel-class pt-0 sm:pt-10 px-0 py-0',
        }}
      >
        <Tab
          key="offers"
          title={
            <p
              onClick={() => {
                handleTabClick('offers');
                setSelectedProvider('');
              }}
            >
              {t('offers')}
            </p>
          }
        >
          <div>
            <TableWithFilter
              query={generateQuery('tasks')}
              apiEndPoint="cbearnings"
              defaultColumns={defaultOfferColumns}
              title={t('earning_from_offers')}
              filterDropdown={
                <ProviderDropdown type={type} selectedSetting={selectedProvider} setSelectedSetting={setSelectedProvider} />
              }
              visibleColumnNames={[t('offer_name'), t('rewards')]}
              headerImageKey="task_image"
              headerTitleKey="task_name"
              hideColumnName={t('offer_name')}
              viewOffer={true}
            />
          </div>
        </Tab>
        <Tab
          key="surveys"
          title={
            <p
              onClick={() => {
                handleTabClick('surveys');
                setSelectedProvider('');
              }}
            >
              {t('surveys')}
            </p>
          }
        >
          <TableWithFilter
            query={generateQuery('surveys')}
            apiEndPoint="cbearnings"
            defaultColumns={defaultSurveyColumns}
            title={t('earning_from_survey')}
            filterDropdown={
              <ProviderDropdown type={type} selectedSetting={selectedProvider} setSelectedSetting={setSelectedProvider} />
            }
            visibleColumnNames={[t('offer_name'), t('rewards')]}
            headerTitleKey="task_name"
            hideColumnName={t('offer_name')}
          />
        </Tab>
        <Tab
          key="shopping"
          title={
            <p
              onClick={() => {
                handleTabClick('shopping');
                setSelectedProvider('');
              }}
            >
              {t('shopping')}
            </p>
          }
        >
          <TableWithFilter
            apiEndPoint="cashback/earnings"
            defaultColumns={defaultShoppingColumns}
            title={t('earning_from_cashback')}
            visibleColumnNames={[t('store'), t('cashback_amount')]}
            headerTitleKey="store_name"
            hideColumnName={t('store_name')}
            viewOffer={true}
          />
        </Tab>
      </Tabs>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />

      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
    </>
  );
}
