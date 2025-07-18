'use client';
import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import React from 'react';
import { useRecoilValue } from 'recoil';
import FormTitle from '../Core/FormTitle';
import { Spinner } from '@nextui-org/react';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';

const SupportInfo = () => {
  const { t } = useTranslation();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const settings_loading: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  return (
    <div className="space-y-4 sm:space-y-8">
      <FormTitle customClass="sm:text-2xl" title={t('need_help')} />
      {settings_loading && <Spinner color="secondary" />}

      {settings?.default?.support_email && !settings_loading ? (
        <div className="space-y-1">
          <FormTitle customClass="sm:text-xl" title={t('email')} />
          <p>
            <Link
              className="cursor-pointer hover:text-primary transition-ease"
              href={`mailto:${settings?.default?.support_email}`}
            >
              {settings?.default?.support_email}
            </Link>
          </p>
        </div>
      ) : null}
      {settings?.default?.support_phone_number && !settings_loading ? (
        <div className="space-y-1">
          <FormTitle customClass="sm:text-xl" title={t('phone_number')} />
          <p>
            <Link className="hover:text-primary transition-ease" href={`tel:${settings?.default?.support_phone_number}`}>
              {settings?.default?.support_phone_number}
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SupportInfo;
