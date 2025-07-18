'use client';
import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { Spinner } from '@nextui-org/react';
import PhoneInput2 from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const PhoneInput = ({
  onDialCodeChange,
  placeholder,
  id,
  customClass,
  label,
  onChange,
  hint,
  icon,
  isVerified = false,
  required: required = false,
  readOnly = false,
  button,
  ...rest
}: any) => {
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const settings_loading: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  const countryCodes = settings?.countries?.map(({ code }) => code.toLowerCase()) || [];
  const setPhoneValid = useSetRecoilState(booleanDefaultFalseAtomFamily(atomKey.validPhoneNumber));
  return (
    <div className="relative">
      <PhoneInput2
        inputClass={`!h-12 !w-full !pl-14 py-3.5 px-5 !bg-transparent !bg-input-gr !rounded-lg !border-0 placeholder:text-white placeholder:text-sm focus:ring-0 focus:border-0 focus:shadow-md outline-none !text-base transition-ease ${
          customClass ? customClass : ''
        } ${icon ? 'pl-14' : ''} ${readOnly ? 'pr-14' : ''} ${button ? 'pr-24' : ''} input-class`}
        buttonClass="!ml-2.5 !my-2.5 !bg-black-600 !border-0 !rounded hover:!bg-black-600 focus:!bg-black-600 transition-ease"
        dropdownClass="!bg-black-600 !border-0 !rounded-lg transition-ease"
        placeholder={placeholder}
        disabled={readOnly}
        onChange={(value, country: any, e, formattedValue) => {
          onChange && onChange(value);
          // const { format, dialCode } = country;
          // if (format?.length === formattedValue?.length && (value.startsWith(dialCode) || dialCode.startsWith(value))) {
          //   setPhoneValid(true);
          // } else {
          //   setPhoneValid(false);
          // }
          setPhoneValid(true);
        }}
        autocompleteSearch={true}
        enableSearch={true}
        country={settings?.currentCountry?.toLowerCase() || 'in'}
        onlyCountries={countryCodes || undefined}
        value={rest.value}
        countryCodeEditable={false}
      />
      {!settings_loading && countryCodes.length > 0 ? (
        <></>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-transparent filter backdrop-blur">
          <Spinner color="white" size="sm" />
        </div>
      )}
      {/* <input
        className={`!pl-[75px] py-3 px-5 w-full bg-transparent !bg-white-gr rounded-full border-0 placeholder:text-gray-400 placeholder:text-sm text-gray-400 focus:ring-0 focus:border-0 outline-none ${
          customClass ? customClass : ''
        } ${icon ? 'pl-14' : ''} ${readOnly ? 'pr-14' : ''} ${button ? 'pr-24' : ''}`}
        type="tel"
        placeholder={placeholder}
        name={id}
        id={id}
        onChange={onChange}
        readOnly={readOnly}
        {...rest}
      /> */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {settings_loading[0] ? (
          <Spinner color="white" size="sm" />
        ) : isVerified ? (
          <>
            {/* <span className="block w-full min-w-16 bg-black-600 rounded-full px-1 py-1.5 text-white text-center text-xs sm:text-sm">
              {session?.user?.user?.phone_no
                ? session?.user?.user?.phone_no
                : settings?.countries
                ? settings?.countries?.filter((item: any) => item?.code === session?.user?.user?.country_code)?.[0]?.dial_code
                : ''}
            </span> */}
          </>
        ) : (
          <>
            {/* <Select
              placeholder={
                session?.user?.user?.phone_no
                  ? session?.user?.user?.phone_no?.split(' ')[0]
                  : settings?.countries
                  ? settings?.countries?.filter((item: any) => item?.code === session?.user?.user?.country_code)?.[0]?.dial_code
                  : []
              }
              disabled
              className="min-w-10 w-fit"
              classNames={{
                label: 'group-data-[filled=true]:-translate-y-5',
                trigger:
                  'rounded-full bg-black-600 py-1 !pl-2 px-1 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-2 data-[hover=true]:bg-white-gr flex items-center gap-1',
                listboxWrapper: 'max-h-[200px]',
                value: '!text-white',
                selectorIcon: '!text-white',
              }}
              listboxProps={{
                itemClasses: {
                  base: [
                    'rounded-0',
                    'text-white',
                    'transition-opacity',
                    'data-[hover=true]:bg-black-600',
                    // 'dark:data-[hover=true]:bg-default-50',
                    'data-[selectable=true]:!bg-black-600',
                    'data-[pressed=true]:bg-black-600',
                    'data-[focus-visible=true]:ring-0',
                  ],
                },
              }}
              onChange={(e) => {
                onDialCodeChange(e.target.value);
              }}
              popoverProps={{
                classNames: {
                  base: '',
                  content: 'p-0 bg-black-600 w-max max-w-[100px]',
                },
              }}
            >
              {settings?.[0]?.countries?.map((item: any, index: number) => (
                <SelectItem key={item.dial_code}>{item.dial_code}</SelectItem>
              ))}
            </Select> */}
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
