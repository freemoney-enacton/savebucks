import { config } from '@/config';
import Image from 'next/image';
import React from 'react';

const GiftCard = ({ type, data, item, setSelectedCurrencyCard, selectedCountry, index, setIsSelected, isSelected }) => {
  const handleSelected = () => {
    setIsSelected(index);
    setSelectedCurrencyCard(item);
  };

  return type === 'with_card_image' ? (
    <div className="payment-card-wrapper">
      {/* card */}
      <div
        role="button"
        className={`payment-card p-2 bg-black border-2 rounded-lg space-y-2 ${
          isSelected == index ? 'border-primary' : 'border-transparent'
        } hover:opacity-80 transition-ease`}
        onClick={() => {
          // ShowSelectedCard();
          handleSelected();
        }}
      >
        {data?.card_image ? (
          <div className="aspect-[128/80] rounded-lg overflow-hidden">
            <Image className="h-full w-full object-cover" src={data?.card_image} alt="logo" width={1000} height={1000} />
          </div>
        ) : null}
        <p className="text-sm sm:text-base font-semibold text-center leading-[1.2]">
          {data?.country_configuration?.filter((item: any) => item.country_code === selectedCountry)?.[0]?.currency_code
            ? new Intl.NumberFormat(
                `en-${
                  data?.country_configuration?.filter((item: any) => item.country_code === selectedCountry)?.[0]?.country_code
                }`,
                {
                  style: 'currency',
                  currency: data?.country_configuration?.filter((item: any) => item.country_code === selectedCountry)?.[0]
                    ?.currency_code,
                }
              ).format(item?.payable_amount)
            : item?.payable_amount}
        </p>
        {/* <p className="capitalize">{data?.name}</p> */}
        {/* <div className="absolutes -top-1 right-1">
          <Image
            className="max-h-3.5 w-auto h-auto mx-auto"
            src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', selectedCountry?.toLowerCase())}
            alt="logo"
            width={200}
            height={200}
          />
        </div> */}
      </div>
    </div>
  ) : type === 'with_logo' ? (
    <div className="payment-card-wrapper">
      {/* card */}
      <div
        className={`payment-card relative text-center bg-black-600 border rounded-xl p-3 space-y-3 ${
          isSelected == index ? 'border-primary' : ''
        } hover:border-primary transition-ease cursor-pointer`}
        onClick={() => {
          // ShowSelectedCard();
          handleSelected();
        }}
      >
        <div className="pt-3">
          {data?.image ? (
            <Image className="max-h-10 w-auto h-auto mx-auto" src={data?.image} alt="logo" width={200} height={200} />
          ) : null}
        </div>
        <div>
          <p>
            {new Intl.NumberFormat(
              `en-${
                data?.country_configuration?.filter((item: any) => item.country_code === selectedCountry)?.[0]?.country_code
              }`,
              {
                style: 'currency',
                currency: data?.country_configuration?.filter((item: any) => item.country_code === selectedCountry)?.[0]
                  ?.currency_code,
              }
            ).format(item?.payable_amount)}
          </p>
          <p className="capitalize">{data?.name}</p>
        </div>
        <div className="absolute -top-1 right-1">
          {selectedCountry ? (
            <Image
              className="max-h-3.5 w-auto h-auto mx-auto"
              src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', selectedCountry?.toLowerCase())}
              alt="logo"
              width={200}
              height={200}
            />
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default GiftCard;
