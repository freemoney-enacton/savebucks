import { config } from '@/config';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import useConstant from '@/Hook/Common/use-constant';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { Spinner, Tooltip, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TickerDropdown from './dropdowns/TickerDropdown';
import ModalComponent from './Modals/ModalComponent';
import UserPrivateProfile from './Modals/UserPrivateProfile';
import UserPublicProfile from './Modals/UserPublicProfile';
import TickerBarSkeleton from './Skeleton/TickerBarSkeleton';

const TickerBar = () => {
  const { TickerCountryDropDown } = useConstant();
  const [tickerData, setTickerData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [publicUserData, setPublicUserData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [privateUserName, setPrivateUserName] = useState('');
  const [selectedSetting, setSelectedSetting] = useState(TickerCountryDropDown[0]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { getCurrencyString, updatePreviousUrl, previousUrl } = useUtils();
  const { public_get_api } = usePublicApi();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    getDataFromApi(selectedSetting?.key);
    return () => {};
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getDataFromApi(selectedSetting?.key);
    }, config.TICKER_DATA_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [selectedSetting]);

  useEffect(() => {
    // Calculate the scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isTooltipOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isTooltipOpen]);

  const handleUserProfileClick = async (row) => {
    updatePreviousUrl();
    window.history.pushState({}, '', `/user/${row.user_referral_code}`);
    onOpen();
    if (!row.user_is_private) {
      setLoading(true);
      try {
        public_get_api({ path: `user/public-profile/${row.user_referral_code}` })
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

  const getDataFromApi = async (country_code) => {
    try {
      let urlParams = new URLSearchParams();
      if (country_code != 'globe') urlParams.append('country_code', country_code);
      public_get_api({ path: `ticker?limit=20&${urlParams.toString()}` })
        .then((res: any) => {
          if (res?.data && res?.success) {
            setTickerData(res.data);
          }
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (error) {}
  };

  function handleCountryChange(val) {
    setSelectedSetting(val);
    setLoader(true);
    getDataFromApi(val?.key);
  }

  return (
    <div className="ticker-bar bg-black-250 px-4 py-2 sm:py-3 xl:pl-[calc(224px+12px)] overflow-x-clip animate-fade-in">
      {loader ? (
        <TickerBarSkeleton />
      ) : (
        <>
          <div className="flex items-center gap-2.5 sm:gap-5">
            <TickerDropdown setSelectedSetting={handleCountryChange} selectedSetting={selectedSetting} />
            <div className="flex gap-2.5 tooltip-wrapper overflow-y-auto no-scrollbar">
              {tickerData.map((item: any, index: number) => (
                <Tooltip
                  placement="bottom"
                  showArrow={true}
                  shouldCloseOnBlur={true}
                  content={<ToolTipContent item={item} />}
                  classNames={{
                    content: ['p-2 !bg-white-gr max-w-[155px] !rounded-lg text-white text-xs'],
                    base: ['before:!bg-white-gr'],
                  }}
                  key={index}
                  onOpenChange={(isOpen) => setIsTooltipOpen(isOpen)}
                >
                  <div
                    key={index}
                    className="flex-shrink-0 w-[135px] sm:w-[155px] bg-white-gr p-2 sm:pr-2.5 border border-gray-400 rounded-lg cursor-pointer animate-fade-in"
                    onClick={() => {
                      handleUserProfileClick(item);
                    }}
                  >
                    <div className="h-full flex items-center gap-2">
                      {item?.ticker_type == 'Cashout' ? (
                        <div className="flex-shrink-0 size-[22px] sm:size-[27px] grid place-content-center rounded-full overflow-hidden">
                          {item?.ticker_data?.image ? (
                            <Image
                              src={item?.ticker_data?.image}
                              className="h-full w-full object-cover"
                              alt="logo"
                              width={30}
                              height={30}
                            />
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 overflow-hidden size-[22px] sm:size-[27px] bg-blue-700 grid place-content-center rounded-full">
                          {item?.user_image ? (
                            <Image
                              src={item?.user_image}
                              className="h-full w-full object-cover"
                              alt="logo"
                              width={30}
                              height={30}
                            />
                          ) : (
                            <p className="text-sm text-black font-semibold">
                              {item?.user_name ? item?.user_name?.charAt(0)?.toUpperCase() : ''}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="w-full flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xxs sm:text-xs font-semibold break-all line-clamp-1">
                            {item?.ticker_type == 'Cashout' ? item?.ticker_data?.paymentMethod : item?.user_name}
                          </p>
                          <p className="text-gray-600 text-8px sm:text-xxs break-all line-clamp-1">
                            {item?.ticker_type == 'Cashout' ? item?.ticker_type : item?.ticker_data?.providerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold">
                            {item?.ticker_type == 'Cashout'
                              ? getCurrencyString(item?.ticker_data?.amount)
                              : getCurrencyString(item?.ticker_data?.rewards)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </>
      )}
      <ModalComponent
        onCloseClick={() => {
          setPrivateUserName('');
          window.history.replaceState({}, '', previousUrl);
        }}
        isOpen={isOpen}
        onClose={() => {
          setPrivateUserName('');
          window.history.replaceState({}, '', previousUrl);
          onClose();
        }}
        onOpenChange={onOpenChange}
        customClass="!max-w-[570px] !min-h-0 sm:!min-h-0"
      >
        {privateUserName == '' ? (
          loading ? (
            <div className="h-48 w-full flex items-center justify-center">
              <Spinner color="primary" className="w-7 sm:w-10 h-7 sm:h-10 self-center" />
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

export default TickerBar;

const ToolTipContent = ({ item }) => {
  const { t } = useTranslation();
  const { getCurrencyString } = useUtils();
  return (
    <div className="">
      {item?.ticker_type == 'Cashout' ? (
        <div className="space-y-1.5">
          <p>
            {t('user_name')}: {item?.ticker_data?.userName}
          </p>
          <p>
            {t('withdrawal')}: {item?.ticker_data?.paymentMethod}
          </p>
          <p>
            {t('amount')}: {`${getCurrencyString(item?.ticker_data?.amount ? item?.ticker_data?.amount : 0)}`}
          </p>
        </div>
      ) : (
        <div>
          <p>
            {t('offer_name')}: {item?.ticker_data?.offerName}
          </p>
          <p>
            {t('offerwall')}: {item?.ticker_data?.providerName}
          </p>
          <p>
            {t('reward')}: {`${getCurrencyString(item?.ticker_data?.rewards ? item?.ticker_data?.rewards : 0)}`}
          </p>
        </div>
      )}
    </div>
  );
};
