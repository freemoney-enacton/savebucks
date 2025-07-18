import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const LeaderboardCard = ({ data, name, amount, index }: { data?: any; name?: any; amount?: any; index: number }) => {
  console.log(index);
  const { getCurrencyString } = useUtils();
  const { t } = useTranslation();
  return (
    <div
      className={twMerge(
        'relative w-full max-w-[150px] sm:max-w-[200px] mt-20 sm:mt-[118px] bg-rank-card-bg border-2 border-rank-card-border rounded-t-[20px] space-y-2',
        index == 1 ? 'min-h-[150px] sm:min-h-[260px]' : 'min-h-[115px] sm:min-h-[200px]',
        index == 0
          ? '-mr-0.5 shadow-leaderboard-card rounded-bl-lg'
          : index == 1
          ? 'shadow-drop-leaderboard-card'
          : index == 2
          ? '-ml-0.5 rounded-br-lg'
          : ''
      )}
    >
      <div className="relative h-fit w-fit mx-auto z-0">
        <div
          className={twMerge(
            index == 1
              ? 'bg-leaderboard-rank-1-border-gr'
              : index == 0
              ? 'bg-leaderboard-rank-2-border-gr'
              : 'bg-leaderboard-rank-3-border-gr',
            'size-[70px] sm:size-[120px] mx-auto -mt-16 sm:-mt-[118px] p-1 sm:p-2.5 rounded-full shadow-leaderboard-ring'
          )}
        >
          <div
            className={twMerge(
              index == 1
                ? 'bg-leaderboard-rank-1-bg-gr'
                : index == 0
                ? 'bg-leaderboard-rank-2-bg-gr'
                : 'bg-leaderboard-rank-3-bg-gr',
              'h-full w-full p-0 sm:p-1 rounded-full'
            )}
          >
            {data?.user_image ? (
              <Image
                src={data?.user_image}
                alt={`${data?.user_name}'s profile`}
                className="h-full w-full object-cover rounded-full"
                width={300}
                height={300}
                quality={100}
              />
            ) : (
              <div className="w-full h-full grid place-content-center rounded-full px-3 text-center">
                <span
                  className={twMerge(
                    'text-black font-semibold',
                    !data?.user_id && !name ? 'text-8px sm:text-xs' : 'text-xl sm:text-4xl',
                    index == 1 ? '!text-rank-1-text' : index == 0 ? '!text-rank-2-text' : '!text-rank-3-text'
                  )}
                >
                  {data?.user_id
                    ? data?.user_name?.charAt(0)?.toUpperCase()
                    : name
                    ? name?.charAt(0)?.toUpperCase()
                    : t('to_be_announced')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 z-[-1]">
          <div
            className="w-7 sm:w-12 h-[75px] sm:h-32 shadow-leaderboard-rings p-[1px]"
            style={{
              filter: 'drop-shadow(-10px 10px 3px #0000003d)',
            }}
          >
            <div
              className={twMerge(
                'h-full w-full p-[1px]',
                index == 1 ? 'bg-rank-1-border' : index == 0 ? 'bg-rank-2-border' : 'bg-rank-3-border'
              )}
              style={{
                clipPath:
                  'polygon(0px 0px, 100% 0px, 100% 100%, calc(100% - 1px) 100%, 50% calc(100% - calc(19% - 1px)), 1px 100%, 0px 100%)',
              }}
            >
              <div
                className={twMerge(
                  'h-full w-full flex items-end justify-center',
                  index == 1
                    ? 'bg-leaderboard-rank-1-ribbon-gr'
                    : index == 0
                    ? 'bg-leaderboard-rank-2-ribbon-gr'
                    : 'bg-leaderboard-rank-3-ribbon-gr'
                )}
                style={{
                  // clipPath: 'polygon(0 0,100% 0,100% 100%,calc(100% - .01em) 100%,50% calc(100% - 20px),.01em 100%,0 100%)',
                  clipPath: 'polygon(0 0,100% 0,100% 100%,calc(100% - .01em) 100%,50% calc(100% - 19%),.01em 100%,0 100%)',
                }}
              >
                <p
                  className={twMerge(
                    'text-white text-xs sm:text-2xl font-semibold pb-4 sm:pb-6',
                    index == 1 ? 'text-rank-1-text' : index == 0 ? 'text-rank-2-text' : 'text-rank-3-text'
                  )}
                >
                  {index == 0 ? 2 : index == 1 ? 1 : 3}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          'absolute bottom-0 inset-x-0 py-2 sm:py-4 px-2 sm:px-3 space-y-2.5 sm:space-y-6 text-center',
          index == 1 ? 'space-y-8 sm:space-y-20' : ''
        )}
      >
        <p className="text-white text-sm sm:text-lg font-semibold line-clamp-1 break-all">{data?.user_name || name}</p>
        {(data?.user_id && data?.reward) || amount ? (
          <p className="sm:text-xl lg:text-2xl font-bold">
            {(data?.user_id && data?.reward && getCurrencyString(data?.reward)) || amount}
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LeaderboardCard;
