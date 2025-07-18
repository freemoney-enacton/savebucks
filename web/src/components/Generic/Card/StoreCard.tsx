import { config } from '@/config';
import { useUtils } from '@/Hook/use-utils';
import Image from 'next/image';
const StoreCard = ({ data }: { data: any }) => {
  const { getCurrencyString, getTranslatedValue } = useUtils();
  const onStoreClick = () => {
    window.location.href = `/single-store/${data.slug}`;
  };

  const getCashbackString = () => {
    if (data.amount_type == 'percent') {
      return data.cashback_amount + '%';
    } else if (data.amount_type == 'fixed') {
      return getCurrencyString(data.cashback_amount);
    }
  };
  return (
    <div
      onClick={onStoreClick}
      role="button"
      className="relative h-full bg-black p-4 pb-3 flex flex-col gap-2 sm:gap-2.5 border border-gray-400 rounded-lg hover:shadow-md transition-ease"
    >
      <div className="shrink-0 relative h-[52px] sm:h-[84px] flex items-center justify-center bg-black-600 p-2 sm:p-3 rounded-[80px]">
        {/* Brand Logo */}
        {data.logo ? (
          <Image
            height={100}
            width={100}
            src={data.logo}
            alt={`${getTranslatedValue(data.name)} logo`}
            className="max-h-8 sm:max-h-14 w-auto h-auto"
            loading="lazy"
          />
        ) : null}
        {/* Country Flag */}
        {data.country_tenancy?.length > 0 ? (
          <div className="absolute -bottom-0.5 sm:bottom-0 right-0 sm:right-2 size-[18px] sm:size-5 rounded-full overflow-hidden">
            <Image
              height={100}
              width={100}
              src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', data.country_tenancy[0]?.toLowerCase())}
              alt="Country Flag"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>

      <div className="h-full flex flex-col gap-1">
        {/* Brand Name */}
        <h4 className="flex-shrink-0 text-sm sm:text-lg font-semibold line-clamp-1 break-all">{getTranslatedValue(data.name)}</h4>

        <div className="h-full flex flex-col justify-between gap-1">
          {/* Tagline */}
          {data?.categories?.length > 0 && (
            <p className="text-xxs sm:text-sm line-clamp-1 break-all">
              {data.categories[0]}
              {data.categories?.length > 1 && <span> +{data.categories?.length - 1}</span>}
            </p>
          )}
          {/* Discount */}
          {data?.cashback_enabled ? (
            <div className="mt-auto text-base sm:text-xl font-semibold text-green-500 text-end">
              <span className="!text-white text-sm sm:text-base">{data.rate_type} </span> {getCashbackString()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
