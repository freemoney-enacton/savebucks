import UserCard from '@/components/Generic/Card/UserCard';
import ModalComponent from '@/components/Generic/Modals/ModalComponent';
import UserPrivateProfile from '@/components/Generic/Modals/UserPrivateProfile';
import UserPublicProfile from '@/components/Generic/Modals/UserPublicProfile';
import TableComponent from '@/components/Generic/Table/TableComponent';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { Spinner, useDisclosure } from '@nextui-org/react';
import dayjs from 'dayjs';
import { ArrowUpRight, LucideClock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
var relativeTime = require('dayjs/plugin/relativeTime');

const LeaderboardTable = ({ end_date, user_details, type }) => {
  dayjs.extend(relativeTime);

  const [publicUserData, setPublicUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [privateUserName, setPrivateUserName] = useState('');

  const { t } = useTranslation();
  const router = useRouter();
  const { data: session, status }: any = useSession();
  const { getCurrencyString, updatePreviousUrl, previousUrl } = useUtils();
  const userInfo = session?.user?.user;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleUserProfileClick = async (row) => {
    updatePreviousUrl();
    window.history.pushState({}, '', `/user/${row.user_referral_code}`);
    onOpen();
    if (!row.user_is_private) {
      setLoading(true);
      try {
        await public_get_api({ path: `user/public-profile/${row.user_referral_code}` })
          .then((res) => {
            if (res) {
              setPublicUserData(res?.data);
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    } else {
      setPrivateUserName(row.user_name);
    }
  };

  const defaultColumns = [
    {
      header: t('rank_user'),
      accessorFn: (row) => `${row.rank} ${row.user_name} ${row.user_referral_code} ${row.user_is_private} ${row.user_id}`,
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div
              className={`flex-shrink-0 size-6 rounded-full grid place-content-center text-white font-medium ${
                row.original.rank === 1
                  ? 'bg-rank-1 '
                  : row.original.rank === 2
                  ? 'bg-rank-2'
                  : row.original.rank === 3
                  ? 'bg-rank-3'
                  : 'bg-black-250'
              }`}
            >
              {row.original.rank}
            </div>
            <div className="flex-shrink-0 h-6 w-[0.5px] bg-gray-400"></div>
            <div className="flex items-center gap-1 text-white">
              <div
                onClick={() => {
                  row.original?.user_id ? handleUserProfileClick(row.original) : {};
                }}
                className="cursor-pointer flex items-center gap-2"
              >
                {row.original.user_image ? (
                  <div className="flex-shrink-0 size-6 rounded-full overflow-hidden">
                    <Image
                      className="h-full w-full object-cover"
                      src={row.original.user_image}
                      alt="profile image"
                      width={100}
                      height={100}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 size-6 bg-blue-700 text-black grid place-content-center rounded-full overflow-hidden">
                    <span className="px-1">{row.original.user_id ? row.original.user_name?.charAt(0)?.toUpperCase() : ''}</span>
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {row.original.user_id ? row.original.user_name : t('to_be_announced')}
                </span>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  // router.push(`/user/${row.original.user_referral_code}`);
                  row.original?.user_id ? handleUserProfileClick(row.original) : {};
                }}
              >
                {row.original?.user_id && <ArrowUpRight className="w-4 h-4 text-primary-gr cursor-pointer" onClick={() => {}} />}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: t('earning'),
      accessorKey: 'earnings',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center text-white text-xs sm:text-sm font-medium">
            <span>{getCurrencyString(row.original.earnings)}</span>
          </div>
        );
      },
    },
    {
      header: t('prize'),
      accessorKey: 'reward',
      cell: ({ cell, row }) => {
        return (
          <div className="flex items-center text-white text-xs sm:text-sm font-medium">
            <span>{getCurrencyString(row.original.reward)}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <UserCard customClass="mt-4s sm:mt-10s">
        <UserCard.Head>
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 rounded-[40px]">
              {userInfo?.avatar ? (
                <div className="flex-shrink-0 size-10 rounded-full overflow-hidden">
                  <Image
                    className="h-full w-full object-cover rounded-full"
                    src={userInfo?.avatar}
                    alt="profile image"
                    width={100}
                    height={100}
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-10 h-10 bg-blue-700 grid place-content-center rounded-full">
                  <p className="text-[22px] text-black">{userInfo?.name ? userInfo?.name?.charAt(0)?.toUpperCase() : ''}</p>
                </div>
              )}
              <p className="font-medium">
                {type === 'monthly_leaderboard' ? t('you_earned') : t('you_earned_today')}{' '}
                <span className="text-white">
                  {status === 'authenticated' && user_details?.reward ? getCurrencyString(user_details?.reward) : '-'}
                </span>{' '}
                {t('and_your_rank')}{' '}
                <span className="text-white">{status === 'authenticated' && user_details?.rank ? user_details?.rank : '-'}</span>
              </p>
            </div>
            <div className="max-sm:self-end flex items-center gap-3">
              <LucideClock className="flex-shrink-0 size-6 text-white" />
              <p>
                {dayjs(end_date).isBefore(dayjs()) ? t('ended_at') : t('ends_in')}{' '}
                <span className="text-white">{dayjs(end_date).fromNow()}</span>
              </p>
            </div>
          </div>
        </UserCard.Head>
        <UserCard.Body>
          <TableComponent column={defaultColumns} apiEndPoint={`leaderboards/entries/${type}`} />
        </UserCard.Body>
      </UserCard>

      <ModalComponent
        onCloseClick={() => {
          setPrivateUserName('');
          window.history.replaceState({}, '', previousUrl);
          router.back();
        }}
        isOpen={isOpen}
        onClose={() => {
          setPrivateUserName('');
          window.history.replaceState({}, '', previousUrl);
          router.back();
          onClose();
        }}
        onOpenChange={onOpenChange}
        customClass="!max-w-[570px] !min-h-0 sm:!min-h-0"
      >
        {privateUserName == '' ? (
          loading ? (
            <div className="h-48 w-full flex items-center justify-center">
              <Spinner color="primary" className="size-7 sm:size-10 self-center" />
            </div>
          ) : (
            <UserPublicProfile userInfo={publicUserData} />
          )
        ) : (
          <UserPrivateProfile name={privateUserName} modal={true} />
        )}
      </ModalComponent>
    </div>
  );
};

export default LeaderboardTable;
