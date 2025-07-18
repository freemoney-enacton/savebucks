'use client';
import { useTranslation } from '@/i18n/client';

export default function NoDataFound({ msg }: { msg?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center w-full h-full py-8 sm:py-10">
      <p className="text-white">{t(msg || 'no_data_found')}</p>
    </div>
  );
}
