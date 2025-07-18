import Card from '@/components/Core/Card';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';

const DosAndDonts = ({ data }) => {
  const { t } = useTranslation();
  const { getTranslatedValue } = useUtils();

  return (
    <>
      {getTranslatedValue(data.terms_todo) || getTranslatedValue(data.terms_not_todo) ? (
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {getTranslatedValue(data.terms_todo) ? (
            <Card variant="outline" size="lg" className="space-y-3 sm:space-y-5">
              <SectionTitleWithIcon img="/images/single-store-do.png" title={t('store_dos_title')} className="lg:text-2xl" />
              <div
                className="text-xs sm:text-sm cms-box"
                dangerouslySetInnerHTML={{ __html: getTranslatedValue(data.terms_todo) }}
              />
            </Card>
          ) : null}
          {getTranslatedValue(data.terms_not_todo) ? (
            <Card variant="outline" size="lg" className="space-y-3 sm:space-y-5">
              <SectionTitleWithIcon img="/images/single-store-donts.png" title={t('store_donts_title')} className="lg:text-2xl" />
              <div
                className="text-xs sm:text-sm cms-box"
                dangerouslySetInnerHTML={{ __html: getTranslatedValue(data.terms_not_todo) }}
              />
            </Card>
          ) : null}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default DosAndDonts;
