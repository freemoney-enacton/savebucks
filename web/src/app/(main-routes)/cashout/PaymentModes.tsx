'use client';
import NoDataFound from '@/components/Core/NoDataFound';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import CashoutCard from './CashoutCard';
import GiftCardPayout from './GiftCardPayout';

const PaymentModes = ({ paymentModeData, giftCard }) => {
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const type = settings?.theme?.cashout_card_style;
  const { t } = useTranslation();
  return (
    <div className="">
      <p className="text-base sm:text-xl font-semibold">{t('choose_withdrawal_method')}</p>
      {/* <Tabs
        aria-label="454"
        classNames={{
          base: 'w-full',
          tabList: 'bg-black-600 p-2 sm:p-2.5 rounded-lg',
          tab: 'text-white !h-auto !p-0 focus:ring-offset-0 focus:ring-0 focus:!outline-0 focus:border-0 focus-visible:!outline-0 data-[focus-visible=true]:z-[1]',
          tabContent: 'rounded-lg py-2 px-3 sm:px-5 max-sm:text-xs group-data-[selected=true]:!text-black font-medium',
          cursor: 'bg-primary-gr rounded-lg',
          panel: 'custom-panel-class p-0 data-[focus-visible=true]:!outline-0',
        }}
      >
        <Tab key="0" title={'All'}>
          <div
            className={`grid ${
              type === 'with_card_image'
                ? 'grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(216px,1fr))] gap-3 sm:gap-6'
                : 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-6'
            }  pt-5`}
          >
            {paymentModeData?.paymentTypes?.map((data, index) => (
              <CashoutCard
                userCountry={paymentModeData?.userCountry}
                data={data}
                key={index}
                currencySymbol={paymentModeData?.currencySymbol}
                type={type}
              />
            ))}
          </div> */}
      {/* </Tab> */}
      <div
        className={`grid ${
          type === 'with_card_image'
            ? 'grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(216px,1fr))] gap-3 sm:gap-6'
            : 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6'
        }  pt-5`}
      >
        {giftCard?.giftcards
          ? giftCard?.giftcards?.map((item, index) => (
              <GiftCardPayout
                data={item}
                key={index}
                currencySymbol={paymentModeData?.currencySymbol}
                userCountry={paymentModeData?.userCountry}
                type={type}
              />
            ))
          : null}
        {paymentModeData?.paymentTypes?.length > 0 ? (
          paymentModeData?.paymentTypes?.map((item, index) => (
            <CashoutCard
              data={item}
              key={index}
              currencySymbol={paymentModeData?.currencySymbol}
              userCountry={paymentModeData?.userCountry}
              type={type}
            />
          ))
        ) : (
          <NoDataFound />
        )}
      </div>

      {/* </Tab> */}
      {/* )} */}
      {/* </Tabs> */}
    </div>
  );
};

export default PaymentModes;
