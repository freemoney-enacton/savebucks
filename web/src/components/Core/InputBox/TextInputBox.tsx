'use client';
import { useTranslation } from '@/i18n/client';

export default function TextInputBox({
  labelTextKey,
  iconComponent,
  placeholderTextKey,
  isPassword = false,
  name,
  passwordIconComponent,
  isPasswordVisible,
}: {
  labelTextKey: string;
  iconComponent: any;
  placeholderTextKey: string;
  isPassword?: boolean;
  name?: string;
  passwordIconComponent?: any;
  isPasswordVisible?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-[5px]">
      <p className="text-sm text-themeWhite">{t('labelTextKey')}</p>
      <div className="flex w-72 h-10 bg-gradient-to-l from-WhiteWhiteGradient-0 to-WhiteWhiteGradient-1 rounded-full justify-between items-center">
        <div className="flex">
          {iconComponent}
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            className="bg-transparent text-themeWhite placeholder-text-lightGray focus:outline-none focus:ring-0 pl-1"
            placeholder={t(placeholderTextKey)}
          />
        </div>
        {isPassword && passwordIconComponent}
      </div>
    </div>
  );
}
