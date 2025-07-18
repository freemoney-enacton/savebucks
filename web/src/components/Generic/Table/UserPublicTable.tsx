'use client';
import AuthModal from '@/components/Core/AuthModal';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useUtils } from '@/Hook/use-utils';
import { useDisclosure } from '@nextui-org/react';
import dayjs from 'dayjs';
import { ArrowUpRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OfferModal from '../Modals/OfferModal';
import TableWithFilter from './TableWithFilter';
// import { config } from '@/config';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import useMobileBreakpoint from '@/Hook/use-mobile';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import ModalComponent from '../Modals/ModalComponent';
import TableComponent from './TableComponent';
var relativeTime = require('dayjs/plugin/relativeTime');

const UserPublicTable = ({ ref_code, hidePagination = false, userProfilePage = false }) => {
  const { t } = useTranslation();
  dayjs.extend(relativeTime);

  const { status }: any = useSession();

  const [loading, setLoading] = useState(false);
  const [OfferModalData, setOfferModalData] = useState<any>({});
  const [data, setData] = useState<any>([]);
  const { getCurrencyString, updatePreviousUrl } = useUtils();
  const { isMobile } = useMobileBreakpoint();

  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { public_get_api } = usePublicApi();
  const [SurveyURL, setSurveyURL] = useState('');
  const { isOpen: outUrlIsOpen, onOpenChange: outUrlOnOpenChange } = useDisclosure();

  const handleOfferClick = (data) => {
    if (status === 'unauthenticated') {
      authOnOpen();
    }
    if (!data?.slug) {
      setSurveyURL(data?.url);
      updatePreviousUrl();
      outUrlOnOpenChange();
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

  const defaultColumns = [
    {
      header: t('offer'),
      accessorFn: (row) => `${row.image} ${row.name}`,
      cell: ({ cell, row }) => {
        setData(row.original);
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
              className="max-sm:hidden flex cursor-pointer items-center gap-2.5 text-white"
              onClick={() => handleOfferClick(row.original)}
            >
              <div className="flex-shrink-0 size-[30px] rounded-md overflow-hidden">
                {row.original.image ? (
                  <Image className="h-full w-full object-cover" src={row.original.image} alt="icon" width={80} height={80} />
                ) : (
                  <Image className="h-full w-full object-cover" src="/images/offer-1.png" alt="icon" width={80} height={80} />
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="w-20 truncate">{row.original.name}</span>

                <div
                  className="cursor-pointer"
                  // onClick={() => {
                  //   router.push(`/user/${row.original.user_referral_code}`);
                  // }}
                >
                  <ArrowUpRight className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => {}} />
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      header: t('time'),
      accessorKey: 'last_activity',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center max-sm:justify-end text-white whitespace-nowrap">
            <span>{dayjs(row.original?.last_activity).fromNow()}</span>
          </div>
        );
      },
    },
    {
      header: t('rewards'),
      accessorKey: 'earning',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center text-white">
            <span>
              {/* {config.DEFAULT_CURRENCY_SYMBOL} */}
              {getCurrencyString(row.original.earning)}
            </span>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="space-y-3.5">
        <SectionTitleWithIcon title={t('activity')} img="/images/activity-icon.png" />

        {userProfilePage ? (
          <TableWithFilter
            defaultColumns={defaultColumns}
            apiEndPoint={`user/public-profile-activity/${ref_code}`}
            hidePagination={hidePagination}
            visibleColumnNames={[t('offer'), t('rewards')]}
            viewOffer={true}
            headerImageKey={'image'}
            headerTitleKey={'name'}
          />
        ) : isMobile ? (
          <TableWithFilter
            defaultColumns={defaultColumns}
            apiEndPoint={`user/public-profile-activity/${ref_code}`}
            hidePagination={hidePagination}
            visibleColumnNames={[t('offer'), t('rewards')]}
            viewOffer={true}
            headerImageKey={'image'}
            headerTitleKey={'name'}
          />
        ) : (
          <TableComponent
            column={defaultColumns}
            apiEndPoint={`user/public-profile-activity/${ref_code}`}
            hidePagination={hidePagination}
          />
        )}
      </div>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
      <ModalComponent isOpen={outUrlIsOpen} onOpenChange={outUrlOnOpenChange} customClass="relative !p-0 max-w-[570px]">
        <>
          <div className="iframe-parent">
            <button
              className="absolute bottom-0 right-0 p-3 bg-black/10 rounded-xl"
              onClick={() => window.open(SurveyURL, '_blank')}
            >
              <ArrowTopRightOnSquareIcon className="size-5 text-white cursor-pointer" />
            </button>
            <iframe src={SurveyURL} className="w-full min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-88px)]"></iframe>
          </div>
        </>
      </ModalComponent>
      <OfferModal isOpen={isOpen} onOpenChange={onOpenChange} data={data} OfferModalData={OfferModalData} loading={loading} />
    </>
  );
};

export default UserPublicTable;
