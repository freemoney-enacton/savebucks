import React from 'react';
import SectionTitleWithIcon from '@/components/Core/SectionTitleWithIcon';
import CashoutCard from '@/app/(main-routes)/cashout/CashoutCard';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';

const PaymentModeSection = async () => {
  const { t } = await createTranslation();
  let PaymentModes = await public_get_api({
    path: 'payments/types',
  });
  const settings = await public_get_api({ path: 'settings' });
  const type = settings?.data?.theme?.cashout_card_style;

  return (
    <section className="section">
      <div className="container">
        <SectionTitleWithIcon title={t('withdraw_cash')} img="/images/atm-cashout.png" />
        <div
          className={`grid ${
            type === 'with_card_image'
              ? 'grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(216px,1fr))] gap-3 sm:gap-6'
              : 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6'
          }  pt-5`}
        >
          {PaymentModes?.data?.paymentTypes?.length > 0
            ? PaymentModes?.data?.paymentTypes?.map((data, index): any => <CashoutCard data={data} key={index} type={type} />)
            : null}
        </div>
      </div>
    </section>
  );
};

export default PaymentModeSection;
