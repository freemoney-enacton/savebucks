import { atom, atomFamily } from 'recoil';
import Cookies from 'js-cookie';
import { config } from '@/config';
let defaultCurrencyShow = Cookies.get(config.CURRENCY_SHOW_COOKIE);

export const booleanDefaultFalseAtomFamily = atomFamily({
  key: 'booleanDefaultFalseAtomFamily',
  default: false,
});

export const booleanDefaultTrueAtomFamily: any = atomFamily({
  key: 'booleanDefaultTrueAtomFamily',
  default: true,
});

export const stringAtomFamily = atomFamily({
  key: 'stringAtomFamily',
  default: '',
});

export const arrayAtomFamily: any = atomFamily({
  key: 'arrayAtomFamily',
  default: [],
});

export const objectAtomFamily: any = atomFamily({
  key: 'objectAtomFamily',
  default: {},
});
export const currencyTypeAtom: any = atom({
  key: 'currencyTypeAtom',
  default: defaultCurrencyShow === 'true' ? true : false,
});
export const numberAtomFamily: any = atomFamily({
  key: 'numberAtomFamily',
  default: 0,
});
