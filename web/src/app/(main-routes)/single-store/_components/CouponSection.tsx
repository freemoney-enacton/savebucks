import NoDataFound from '@/components/Core/NoDataFound';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import CouponCard from '@/components/Generic/Card/CouponCard';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';

const CouponSection = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const { getTranslatedValue } = useUtils();

  return (
    <section className="space-y-3 sm:space-y-5">
      <SectionTitleWithIcon
        title={t('store_coupons_title').replace('{{store_name}}', getTranslatedValue(data?.name))}
        className="lg:text-2xl"
      />

      <div className="coupon-grid">
        {data.coupons.map((item, index) => (
          <CouponCard key={index} data={item} store={data} />
        ))}
      </div>
      {data.coupons.length === 0 && <NoDataFound msg={t('no_coupons_found')} />}
    </section>
  );
};

export default CouponSection;
