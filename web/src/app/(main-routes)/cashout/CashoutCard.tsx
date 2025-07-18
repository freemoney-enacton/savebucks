'use client';
import { useUtils } from '@/Hook/use-utils';
import AuthModal from '@/components/Core/AuthModal';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import GiftCard from '@/components/Generic/Card/GiftCard';
import ModalComponent from '@/components/Generic/Modals/ModalComponent';
import { useTranslation } from '@/i18n/client';
import { ArrowRightEndOnRectangleIcon, BanknotesIcon, IdentificationIcon } from '@heroicons/react/24/solid';
import { Select, SelectItem, Spinner, useDisclosure } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import * as Yup from 'yup';
import CountryDropdown from '../profile/CountryDropdown';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import Checkbox from '@/components/Core/Checkbox';

export default function CashoutCard({ type, data, currencySymbol, userCountry }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(data?.enabledCountries ? data?.enabledCountries[0] : '');
  const [receivableAmount, setReceivableAmount] = useState('');
  const [initialValues, setInitialValues] = useState({ account: '', amount: '' });
  const [selectedCurrencyCard, setSelectedCurrencyCard] = useState<any>('');
  const [isSelected, setIsSelected] = useState(null);
  const [payable_amount, setPayable_amount] = useState('');
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    isOpen: countrySpecificIsOpen,
    onOpen: countrySpecificOnOpen,
    onOpenChange: countrySpecificOnOpenChange,
    onClose: countrySpecificOnClose,
  } = useDisclosure();
  const { isOpen: kycIsOpen, onOpen: kycOnOpen, onOpenChange: kycOnOpenChange, onClose: kycOnClose } = useDisclosure();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const {
    isOpen: verifyIsOpen,
    onOpen: verifyOnOpen,
    onOpenChange: verifyOnOpenChange,
    onClose: verifyOnClose,
  } = useDisclosure();
  const { data: session }: any = useSession();
  const { getCurrencyString } = useUtils();
  const router = useRouter();
  const { public_get_api, public_post_api } = usePublicApi();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  const countryConfig = data?.country_configuration && data?.country_configuration?.[0];

  const payoutAmounts = countryConfig?.payout_amounts?.map((p) => Number(p.payable_amount)) || [];

  const minAmount =
    payoutAmounts.length > 0 ? Math.min(...payoutAmounts) : data?.minimum_amount ? Number(data.minimum_amount) : null;
  const maxAmount = payoutAmounts.length > 0 ? Math.max(...payoutAmounts) : null;

  const currencyObj = countryConfig?.currency_code
    ? settings?.currencies?.find((c) => c.iso_code === countryConfig?.currency_code)
    : null;
  const currencyCode = currencyObj?.symbol || currencySymbol || '';

  const validationSchema = Yup.object(
    data.payment_inputs &&
      data.payment_inputs?.reduce(
        (schema, field) => {
          if (field.required) {
            schema[field.key] = Yup.string().required(`${field.label} is required`);
          }
          return schema;
        },
        {
          account:
            data?.account_input_type == 'email'
              ? Yup.string().email(t('invalid_email_address')).required(t('email_required'))
              : Yup.string().required(t('email_required')),
          amount: Yup.number().required(t('amount_required')).positive(t('amount_must_be_positive_number')),
        }
      )
  );

  async function getHistory() {
    try {
      const res = await public_get_api({ path: `payments/payout-history?page=1` });
      return res.data?.length;
    } catch (error) {
      return 0;
    }
  }

  const handleCardClick = async () => {
    if (session?.user?.user?.id) {
      if (session?.user?.user?.is_email_verified == 0) {
        verifyOnOpen();
        return;
      }
      if (settings?.services?.kyc_verification_enabled && session?.user?.user?.kyc_verified == 0) {
        const historyLength = await getHistory();
        if (settings?.services?.kyc_verification_on_first_payout) {
          if (historyLength > 0) {
            if (data?.country_configuration?.length > 0) {
              countrySpecificOnOpen();
            } else {
              onOpen();
            }
          } else {
            kycOnOpen();
          }
        } else {
          if (historyLength == 0) {
            if (data?.country_configuration?.length > 0) {
              countrySpecificOnOpen();
            } else {
              onOpen();
            }
          } else {
            kycOnOpen();
          }
        }
      } else {
        if (data?.country_configuration?.length > 0) {
          countrySpecificOnOpen();
        } else {
          onOpen();
        }
      }

      //   if (data?.country_configuration?.length > 0) {
      //     countrySpecificOnOpen();
      //   }

      setIsLoading(true);
      // session?.user?.user?.kyc_verified == 0 && settings?.services?.kyc_verification_enabled
      //   ? kycOnOpen()
      //   : data?.country_configuration?.length > 0
      //   ? countrySpecificOnOpen()
      //   : onOpen();

      const defaultInitialValues = data.payment_inputs?.reduce(
        (values, field) => {
          values[field.key] = '';
          return values;
        },
        { account: '', amount: '' }
      );
      try {
        public_get_api({ path: `user/payment-mode?methodCode=${data.code}` })
          .then((res) => {
            if (res?.data && res?.success) {
              const mergedInitialValues = {
                ...defaultInitialValues,
                ...res.data,
                ...res.data.payment_inputs,
              };

              delete mergedInitialValues.payment_inputs;

              setInitialValues(mergedInitialValues);
            } else {
              setInitialValues(defaultInitialValues);
            }
          })
          .finally(() => setIsLoading(false));
      } catch (error) {
        console.log(error);
      }
    } else {
      authOnOpen();
    }
  };
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Handle form submission
    try {
      const paymentInputsData = data.payment_inputs?.reduce((obj, field) => {
        obj[field.key] = values[field.key];
        return obj;
      }, {});
      const body = {
        payment_method_code: data.code,
        account: values.account.toString(),
        payment_input: paymentInputsData,
        amount: Number(values.amount),
        cashback_amount: 0,
        bonus_amount: 0,
        receivable_amount: payable_amount ? Number(payable_amount) : 0,
        pay_amount: receivableAmount ? Number(receivableAmount) : calculatedAmount ? Number(calculatedAmount) : 0,
      };
      public_post_api({
        path: 'payments/payout',
        body: body,
      })
        .then((res) => {
          if (res?.success) {
            Toast.success(t('payment_request_created_successfully'));
            setReceivableAmount('');
            resetForm();
            onClose();
            countrySpecificOnClose();
            router.push('/overview/withdrawal');
            router.refresh();
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => setSubmitting(false));
    } catch (error) {}
  };
  function calculateAmount(originalAmount) {
    // Extract necessary data from your API response
    const { transaction_bonus_amount, transaction_bonus_type, transaction_fees_amount, transaction_fees_type } = data;

    let calculatedAmount = originalAmount;

    // Step 1: Add bonus amount if applicable
    if (transaction_bonus_amount) {
      if (transaction_bonus_type === 'fixed') {
        calculatedAmount += parseFloat(transaction_bonus_amount);
      } else if (transaction_bonus_type === 'percent') {
        const bonusPercentage = parseFloat(transaction_bonus_amount);
        const bonusAmount = originalAmount * (bonusPercentage / 100);
        calculatedAmount += bonusAmount;
      }
    }

    // Step 2: Deduct fees amount if applicable
    if (transaction_fees_amount) {
      if (transaction_fees_type === 'fixed') {
        calculatedAmount -= parseFloat(transaction_fees_amount);
      } else if (transaction_fees_type === 'percent') {
        const feePercentage = parseFloat(transaction_fees_amount);
        const feeAmount = originalAmount * (feePercentage / 100);
        calculatedAmount -= feeAmount;
      }
    }

    // Step 3: Apply both bonus and fees if both are present
    // if (transaction_bonus_amount && transaction_fees_amount) {
    //   if (transaction_bonus_type === 'fixed' && transaction_fees_type === 'percent') {
    //     // Case where bonus is fixed and fees are percent
    //     calculatedAmount += parseFloat(transaction_bonus_amount);

    //     const feePercentage = parseFloat(transaction_fees_amount);
    //     const feeAmount = originalAmount * (feePercentage / 100);
    //     calculatedAmount -= feeAmount;
    //   } else if (transaction_bonus_type === 'percent' && transaction_fees_type === 'fixed') {
    //     // Case where bonus is percent and fees are fixed
    //     const bonusPercentage = parseFloat(transaction_bonus_amount);
    //     const bonusAmount = originalAmount * (bonusPercentage / 100);
    //     calculatedAmount += bonusAmount;

    //     calculatedAmount -= parseFloat(transaction_fees_amount);
    //   } else if (transaction_bonus_type === 'fixed' && transaction_fees_type === 'fixed') {
    //     // Case where both bonus and fees are fixed
    //     calculatedAmount += parseFloat(transaction_bonus_amount);
    //     calculatedAmount -= parseFloat(transaction_fees_amount);
    //   } else if (transaction_bonus_type === 'percent' && transaction_fees_type === 'percent') {
    //     // Case where both bonus and fees are percent
    //     const bonusPercentage = parseFloat(transaction_bonus_amount);
    //     const bonusAmount = originalAmount * (bonusPercentage / 100);
    //     calculatedAmount += bonusAmount;

    //     const feePercentage = parseFloat(transaction_fees_amount);
    //     const feeAmount = originalAmount * (feePercentage / 100);
    //     calculatedAmount -= feeAmount;
    //   }
    // }
    if (data?.conversion_rate) {
      const cryptoAmount = calculatedAmount * parseFloat(data?.conversion_rate);
      setCalculatedAmount(cryptoAmount);
    } else {
      setCalculatedAmount(calculatedAmount);
    }
  }
  const [isCheckedSecond, setIsCheckedSecond] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleCheckboxSecondChange = () => {
    setIsCheckedSecond(!isCheckedSecond);
  };

  return (
    <>
      {type === 'with_card_image' ? (
        <div
          role="button"
          onClick={() => {
            handleCardClick();
          }}
          className={`h-fit w-full p-2.5 bg-black-250 border border-transparent hover:border-primary rounded-lg hover:shadow-md space-y-2.5 transition-ease`}
        >
          {data?.card_image ? (
            <div className="aspect-[216/120] rounded-md overflow-hidden">
              <Image className="h-full w-full object-cover" src={data?.card_image} alt="logo" width={1000} height={1000} />
            </div>
          ) : null}
          <div className="space-y-1">
            <p className="text-sm sm:text-lg font-semibold">{data?.name}</p>
            <p className="text-xs sm:text-sm font-medium">
              {minAmount && maxAmount ? `${minAmount} ${currencyCode} - ${maxAmount} ${currencyCode}` : null}
            </p>
          </div>
        </div>
      ) : type === 'with_logo' ? (
        <div
          onClick={() => {
            handleCardClick();
          }}
          className={`py-5 px-6 flex items-center gap-2 rounded-lg shadow-cashout-card cursor-pointer border-2 border-transparent hover:border-2 hover:border-white transition-ease`}
        >
          <div className="flex-shrink-0">
            {data?.image ? <Image className="max-h-[90px] w-auto" src={data?.image} alt="logo" width={80} height={80} /> : null}
          </div>
          <p className="text-white font-semibold text-xl">{data?.name}</p>
          <p className="text-xs sm:text-sm font-medium">
            {minAmount && maxAmount ? `${currencyCode} ${minAmount} - ${currencyCode} ${maxAmount}` : null}
          </p>
        </div>
      ) : null}
      <ModalComponent
        isOpen={countrySpecificIsOpen}
        onOpenChange={countrySpecificOnOpenChange}
        onClose={countrySpecificOnClose}
        onCloseClick={() => {
          setReceivableAmount('');
          setSelectedCurrencyCard('');
          setIsSelected(null);
          setSelectedCountry(data?.enabledCountries ? data?.enabledCountries[0] : '');
        }}
      >
        <div className="space-y-6 text-sm text-white">
          <div className="flex items-center gap-3.5">
            <div className={`h-12 w-12 rounded-md grid place-content-center`}>
              {data?.image ? (
                <Image className="max-h-12 !w-auto !h-auto" src={data?.image} alt="logo" width={64} height={64} />
              ) : null}
            </div>
            <p className="text-white text-xl font-bold">{data?.title}</p>
          </div>
          <p>{data?.description}</p>

          {data?.enabledCountries && data?.enabledCountries?.includes(userCountry) ? null : (
            <p className="text-red">{t('not_available_in_your_country').replace('%{payment_mode}', data?.name)}</p>
          )}
          {/* {data?.enabledCountries && data?.enabledCountries?.includes(userCountry) ? ( */}
          <CountryDropdown
            data={data?.enabledCountries}
            selectedCountry={(e) => {
              setSelectedCountry(e);
              setReceivableAmount('');
              setIsSelected(null);
              setSelectedCurrencyCard('');
            }}
          />
          {/* ) : ( */}
          {/* )} */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 cursor-pointer">
            {data?.country_configuration
              ?.filter((item: any) => item.country_code === selectedCountry)?.[0]
              ?.payout_amounts?.map((item: any, index) => (
                <GiftCard
                  type={type}
                  data={data}
                  item={item}
                  key={index}
                  index={index}
                  setIsSelected={setIsSelected}
                  isSelected={isSelected}
                  setSelectedCurrencyCard={(e) => {
                    setPayable_amount(e?.payable_amount);
                    setSelectedCurrencyCard(e);
                    setReceivableAmount(e?.calculated_receivable_amount);
                    setInitialValues({ ...initialValues, amount: e?.calculated_receivable_amount });
                  }}
                  selectedCountry={selectedCountry}
                />
              ))}
          </div>
          <div className="space-y-2">
            {data?.transaction_fees_amount && (
              <div className="flex items-center justify-between gap-2 text-gray-600">
                <p>{t('fee')}</p>
                <p>
                  {data?.transaction_fees_type == 'fixed'
                    ? getCurrencyString(data?.transaction_fees_amount)
                    : Number(data?.transaction_fees_amount)?.toFixed(2) + '%'}
                </p>
              </div>
            )}
            {data?.transaction_bonus_amount && (
              <div className="flex items-center justify-between gap-2 text-gray-600">
                <p>{t('bonus')}</p>
                <p>
                  {data?.transaction_bonus_type == 'fixed'
                    ? getCurrencyString(data?.transaction_bonus_amount)
                    : Number(data?.transaction_bonus_amount).toFixed(2) + '%'}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 font-semibold">
              <p>
                {t('you_receive')}
                {data?.conversion_enabled ? `(${data?.name})` : null}
              </p>
              <p>
                {getCurrencyString(
                  selectedCurrencyCard?.calculated_receivable_amount ? selectedCurrencyCard?.calculated_receivable_amount : 0
                )}
              </p>
            </div>

            {/* TODO: MAKE THIS CHECKBOX DYNAMIC */}
            <Checkbox
              label={t('i_understand_my_order_is_non_refundable')}
              id={'non-refundable-checkbox'}
              checked={isChecked}
              onChange={handleCheckboxChange}
              // onBlur={handleBlur}
              // error={errors.terms}
            />
          </div>

          <ButtonComponent
            role="button"
            variant="primary"
            label="Withdraw"
            icon={<BanknotesIcon className="w-5 h-5" />}
            customClass="w-full !py-3"
            onClick={() => {
              if (receivableAmount) {
                // countrySpecificOnClose();
                onOpen();
              } else {
                Toast.show(t('please_select_amount'));
              }
            }}
            disabled={isChecked ? false : true}
          />
        </div>
      </ModalComponent>

      <ModalComponent isOpen={kycIsOpen} onOpenChange={kycOnOpenChange} onClose={kycOnClose} onCloseClick={() => {}}>
        <div className="space-y-10 text-sm text-white ">
          <p className="text-white text-xl font-bold">{t('kyc_verification_required')}</p>
          <p className="text-white text-medium font-regular text-center">{t('complete_your_kyc_to_continue')}</p>
          <ButtonComponent
            role="link"
            variant="primary"
            label={t('complete_kyc')}
            icon={<IdentificationIcon className="w-5 h-5" />}
            customClass="w-full !py-3"
            url="/profile"
          />
        </div>
      </ModalComponent>

      <ModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        onCloseClick={() => {
          setReceivableAmount('');
          countrySpecificOnClose();
          setIsSelected(null);
        }}
      >
        <div className="space-y-6 text-sm text-white">
          <ArrowLeft
            className="w-5 h-5 text-white cursor-pointer"
            onClick={() => {
              onClose();
            }}
          />
          <div className="flex items-center gap-3.5">
            <div className={`h-12 w-12 rounded-md grid place-content-center`}>
              {data?.image ? (
                <Image className="max-h-12 !w-auto !h-auto" src={data?.image} alt="logo" width={64} height={64} />
              ) : null}
            </div>
            <p className="text-white text-xl font-bold">{data?.title}</p>
          </div>
          <p>{data?.description}</p>
          {isLoading ? (
            <div className="py-8 grid place-content-center">
              <Spinner className="text-white" size="lg" />
            </div>
          ) : (
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, handleChange, values }) => (
                <Form className="space-y-6">
                  <Field name="account">
                    {({ field }) => (
                      <Input
                        {...field}
                        type={data?.account_input_type ? data?.account_input_type : 'text'}
                        id="account"
                        label={data?.account_input_label ? data?.account_input_label : 'Account'}
                        placeholder={data?.account_input_label ? data?.account_input_label : 'Account'}
                        hint={<ErrorMessage name="account" component="div" />}
                      />
                    )}
                  </Field>
                  <span className="text-xs">{data?.account_input_hint}</span>
                  {data?.payment_inputs &&
                    data?.payment_inputs?.map((input: any) => (
                      <Field name={input.key} key={input.key}>
                        {({ field }) =>
                          input.type === 'select' ? (
                            <div className="space-y-1.5">
                              <label className="text-white text-sm font-medium" htmlFor={input.key}>
                                {input.label}
                              </label>

                              <Select
                                {...field}
                                items={Object.entries(
                                  input.options
                                    ? typeof input.options == 'string'
                                      ? input.options?.split(',')
                                      : input.options
                                    : []
                                )}
                                placeholder={input.placeholder}
                                className="font-medium"
                                classNames={{
                                  label: 'group-data-[filled=true]:-translate-y-5',
                                  trigger:
                                    'h-fit min-h-[unset] px-3 py-2 bg-black justify-between border border-gray-400 rounded-lg [&>svg]:static [&>div]:!w-auto gap-2 cursor-pointer',
                                  listbox: 'p-3 bg-black-600 border-gray-400 rounded-lg [&>ul]:gap-2.5 overflow-hidden',
                                  listboxWrapper: 'max-h-[200px]',
                                }}
                                listboxProps={{
                                  itemClasses: {
                                    base: [
                                      'rounded-0 py-2',
                                      'text-white',
                                      'transition-opacity',
                                      'data-[hover=true]:!bg-gray-400',
                                      'data-[selected=true]:!bg-gray-400',
                                      'data-[selectable=true]:focus:!bg-gray-400',
                                      'data-[pressed=true]:!bg-gray-400',
                                      'data-[focus-visible=true]:ring-0',
                                    ],
                                    selectedIcon: 'hidden',
                                  },
                                }}
                                popoverProps={{
                                  placement: 'bottom-end',
                                  classNames: {
                                    content: 'p-0 bg-black-600 !rounded-lg',
                                  },
                                }}
                                renderValue={(items) => {
                                  return items.map((item: any) => (
                                    <div key={item.data[1]} className="flex items-center gap-2">
                                      <p>{item.data[1]}</p>
                                    </div>
                                  ));
                                }}
                              >
                                {(item: any) => {
                                  return (
                                    <SelectItem key={item[1]} value={item[1]}>
                                      {item[1]}
                                    </SelectItem>
                                  );
                                }}
                              </Select>
                            </div>
                          ) : (
                            <Input
                              {...field}
                              type={input.type}
                              id={input.key}
                              label={input.label}
                              placeholder={input.placeholder}
                              hint={<ErrorMessage name={input.key} component="div" />}
                            />
                          )
                        }
                      </Field>
                    ))}
                  <Field name="amount">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        id="amount"
                        label={t('amount')}
                        placeholder={t('amount')}
                        hint={<ErrorMessage name="amount" component="div" />}
                        onChange={(e) => {
                          handleChange(e);
                          calculateAmount(e.target.value);
                        }}
                        readOnly={receivableAmount}
                      />
                    )}
                  </Field>
                  <span className="text-xs">
                    {t('minimum_withdrawal_amount')} : {getCurrencyString(data?.minimum_amount)}
                  </span>
                  {/* {data?.conversion_enabled && (
                    <>
                      <div className="flex items-center justify-between gap-2 text-gray-600s">
                        <p className="capitalize">
                          {data.name} {t('rate')}
                        </p>
                        <p className="capitalize">
                          {1 + ' ' + data.name} = {config.DEFAULT_CURRENCY_SYMBOL}
                          {data.conversion_rate}
                        </p>
                      </div>
                    </>
                  )} */}
                  {/* info box */}
                  <div className="space-y-2">
                    {data?.transaction_fees_amount && (
                      <div className="flex items-center justify-between gap-2 text-gray-600">
                        <p>{t('fee')}</p>
                        <p>
                          {data?.transaction_fees_type == 'fixed'
                            ? getCurrencyString(data?.transaction_fees_amount)
                            : Number(data?.transaction_fees_amount)?.toFixed(2) + '%'}
                        </p>
                      </div>
                    )}
                    {data?.transaction_bonus_amount && (
                      <div className="flex items-center justify-between gap-2 text-gray-600">
                        <p>{t('bonus')}</p>
                        <p>
                          {data?.transaction_bonus_type == 'fixed'
                            ? getCurrencyString(data?.transaction_bonus_amount)
                            : Number(data?.transaction_bonus_amount).toFixed(2) + '%'}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 font-semibold">
                      <p>
                        {t('you_receive')}
                        {data?.conversion_enabled ? `(${data?.name})` : null}
                      </p>
                      <p>
                        {data?.country_configuration?.length > 0
                          ? getCurrencyString(values.amount)
                          : getCurrencyString(calculatedAmount)}
                      </p>
                    </div>
                    {/* TODO: MAKE THIS CHECKBOX DYNAMIC */}
                    <Checkbox
                      label={t('i_understand_my_order_is_non_refundable')}
                      id={'second-non-refundable-checkbox'}
                      checked={isCheckedSecond}
                      onChange={handleCheckboxSecondChange}
                      // onBlur={handleBlur}
                      // error={errors.terms}
                    />
                  </div>
                  <ButtonComponent
                    role="button"
                    variant="primary"
                    label="Withdraw"
                    icon={<BanknotesIcon className="w-5 h-5" />}
                    customClass="w-full !py-3"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isCheckedSecond}
                  />
                </Form>
              )}
            </Formik>
          )}
        </div>
      </ModalComponent>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
      <ModalComponent isOpen={verifyIsOpen} onOpenChange={verifyOnOpenChange} onClose={verifyOnClose}>
        <div>
          <p className="text-center font-bold">{t('verify_your_account_details')}</p>
          <p className="text-center">{session?.user?.user?.is_email_verified == 0 ? t('verify_your_email') : ''}</p>
          <ButtonComponent
            role="link"
            variant="primary"
            label="Verify"
            icon={<ArrowRightEndOnRectangleIcon className="w-5 h-5" />}
            customClass="w-full !py-3"
            url="/profile"
          />
        </div>
      </ModalComponent>
    </>
  );
}
