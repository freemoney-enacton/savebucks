import Card from '@/components/Core/Card';
import { SvgCalender, SvgClock } from '@/components/Generic/Icons';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';

const StoreTrackerCard = ({ data, className }: { data: any; className?: string }) => {
  const { t } = useTranslation();
  const { getTranslatedValue } = useUtils();
  return (
    <Card className={`space-y-3 sm:space-y-5 ${className} animate-none`}>
      <div className="space-y-1 sm:space-y-2">
        <h5 className="text-base sm:text-xl font-semibold">{t('categories')}</h5>
        <p className="text-xs sm:text-sm">{data?.categories?.join(', ')}</p>
      </div>

      <div className="flex md:flex-col max-md:items-center max-md:justify-between gap-3 sm:gap-5">
        {/* confirm duration Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <SvgClock className="flex-shrink-0 size-5 sm:size-8 text-yellow" />
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm">{t('marked_in')}</p>
              <span className="font-bold text-base sm:text-xl">{getTranslatedValue(data?.tracking_speed)}</span>
            </div>
          </div>
        </div>

        {/* confirm days Box */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <SvgCalender className="flex-shrink-0 size-5 sm:size-8 text-green" />
            <div className="flex flex-col">
              <p className="text-xs sm:text-sm">{t('confirmed_until')}</p>
              <span className="font-bold text-base sm:text-xl">{data.confirm_days}</span>
            </div>
          </div>
        </div>
      </div>

      <p>
        {t('post_booking_request')}:{' '}
        {data.is_claimable ? (
          <span className="text-green-800 font-semibold">{t('yes')}</span>
        ) : (
          <span className="text-red-800 font-semibold">{t('no')}</span>
        )}
      </p>
      <p>{t('these_are_guidelines')}</p>
    </Card>
  );
};

export default StoreTrackerCard;
