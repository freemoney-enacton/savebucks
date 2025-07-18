'use client';

import { FALLBACK_LOCALE } from '../../i18n/settings';
import { useRecoilValue } from 'recoil';
import { stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';

export function useLocale() {
  const lng: any = useRecoilValue(stringAtomFamily(atomKey.translation.currentSelectedLanguage)) || FALLBACK_LOCALE;
  return lng;
}
