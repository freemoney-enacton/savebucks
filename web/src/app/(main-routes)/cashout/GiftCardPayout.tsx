'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import AuthModal from '@/components/Core/AuthModal';
import Checkbox from '@/components/Core/Checkbox';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import ModalComponent from '@/components/Generic/Modals/ModalComponent';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { ArrowRightEndOnRectangleIcon, BanknotesIcon, IdentificationIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from '@nextui-org/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';

export default function GiftCardPayout({ type, data, currencySymbol, userCountry }: any) {
  const [receivableAmount, setReceivableAmount] = useState(data?.denomination ? data?.denomination?.[0] : '');
  const [isChecked, setIsChecked] = useState(false);
  const { status, data: session }: any = useSession();
  const [convertedReceivableAmount, setConvertedReceivableAmount] = useState(0);
  const [paypalEmail, setPaypalEmail] = useState(session?.user?.user?.email ? session?.user?.user?.email : '');
  const { t } = useTranslation();
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
  const { getCurrencyString } = useUtils();
  const router = useRouter();
  const { public_get_api, public_post_api } = usePublicApi();
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));

  const currencyObj = data?.currency ? settings?.currencies?.find((c) => c.iso_code === data.currency) : null;
  const currencyDisplay = currencyObj?.symbol || data?.currency || '';
  useEffect(() => {
    if (!settings?.currencies || !data?.currency || !receivableAmount) {
      setConvertedReceivableAmount(0);
      return;
    }
    // Try to find the currency object for data.currency
    let currencyObj = settings.currencies.find((c) => c.iso_code === data.currency);

    // If not found, fallback to Euro
    if (!currencyObj) {
      currencyObj = settings.currencies.find((c) => c.iso_code === 'EUR');
    }

    const rate = currencyObj ? Number(currencyObj.conversion_rate) : 1;
    setConvertedReceivableAmount(Number(receivableAmount) * rate);
  }, [settings?.currencies, data?.currency, receivableAmount]);

  async function getHistory() {
    try {
      const res = await public_get_api({ path: `payments/payout-history?page=1` });
      return res.data?.length;
    } catch (error) {
      return 0;
    }
  }
  const validationSchema = Yup.object({
    email: Yup.string().email(t('invalid_email_address')).required('Required'),
  });

  const handleCardClick = async () => {
    if (status === 'authenticated') {
      if (session?.user?.user?.is_email_verified == 0) {
        verifyOnOpen();
        return;
      }
      if (settings?.services?.kyc_verification_enabled && session?.user?.user?.kyc_verified == 0) {
        const historyLength = await getHistory();
        if (settings?.services?.kyc_verification_on_first_payout) {
          if (historyLength > 0) {
            countrySpecificOnOpen();
          } else {
            kycOnOpen();
          }
        } else {
          if (historyLength == 0) {
            countrySpecificOnOpen();
          } else {
            kycOnOpen();
          }
        }
      } else {
        countrySpecificOnOpen();
      }
    } else {
      authOnOpen();
    }
  };
  const handleSubmit = () => {
    // Handle form submission
    try {
      const body = {
        payment_method_code: 'giftcard',
        account: paypalEmail ? paypalEmail : session?.user?.user?.email,
        payment_input: {},
        amount: receivableAmount ? Number(receivableAmount) : 0,
        cashback_amount: 0,
        bonus_amount: 0,
        receivable_amount: receivableAmount ? Number(receivableAmount) : 0,
        pay_amount: receivableAmount ? Number(receivableAmount) : 0,
        additional_info: {
          sku: data?.sku,
          name: data?.name,
          currency: data?.currency ? data?.currency : settings?.default?.default_currency,
          amount: receivableAmount ? Number(receivableAmount) : 0,
        },
      };
      public_post_api({
        path: 'payments/payout',
        body: body,
      }).then((res) => {
        if (res?.success) {
          Toast.success(t('payment_request_created_successfully'));
          setReceivableAmount('');
          countrySpecificOnClose();
          router.push('/overview/withdrawal');
          router.refresh();
        } else {
          Toast.error(res?.error);
        }
      });
    } catch (error) {}
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div
        role="button"
        onClick={() => {
          handleCardClick();
        }}
        className={`h-fit w-full p-2.5 bg-black-250 border border-transparent hover:border-primary rounded-lg hover:shadow-md space-y-2.5 transition-ease`}
      >
        {data?.image ? (
          <div className="aspect-[216/120] rounded-md overflow-hidden">
            <Image className="h-full w-full object-cover" src={data?.image} alt="logo" width={1000} height={1000} />
          </div>
        ) : null}
        <div className="space-y-1">
          <p className="text-sm sm:text-lg font-semibold">{data?.name}</p>
          <p className="text-xs sm:text-sm font-medium">
            <p className="text-xs sm:text-sm font-medium">
              {data?.denomination && Array.isArray(data?.denomination) && data?.denomination.length > 0 ? (
                data?.currency ? (
                  <>
                    {data.denomination[0]}
                    {currencyDisplay} - {data.denomination[data.denomination.length - 1]}
                    {currencyDisplay}
                  </>
                ) : (
                  <>
                    {getCurrencyString(data.denomination[0])} -{' '}
                    {getCurrencyString(data.denomination[data.denomination.length - 1])}
                  </>
                )
              ) : null}
            </p>
          </p>
        </div>
      </div>

      <ModalComponent
        isOpen={countrySpecificIsOpen}
        onOpenChange={countrySpecificOnOpenChange}
        onClose={countrySpecificOnClose}
        onCloseClick={() => {
          setReceivableAmount(data?.denomination ? data?.denomination[0] : '');
          setPaypalEmail(session?.user?.user?.email ? session?.user?.user?.email : '');
        }}
      >
        <div className="space-y-6 text-sm text-white">
          <div className="flex items-center gap-3.5">
            <div className={`h-12 w-12 rounded-md grid place-content-center`}>
              {data?.image ? (
                <Image className="max-h-12 !w-auto !h-auto" src={data?.image} alt="logo" width={64} height={64} />
              ) : null}
            </div>
            <p className="text-white text-xl font-bold">{data?.name}</p>
          </div>
          <p>{data?.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 cursor-pointer">
            {data?.denomination && typeof data?.denomination == 'object' && data?.denomination?.length > 0
              ? data?.denomination?.map((item: any, index) => (
                  <div className="payment-card-wrapper" key={index}>
                    <div
                      role="button"
                      className={`payment-card p-2 bg-black border-2 rounded-lg space-y-2 ${
                        receivableAmount == item ? 'border-primary' : 'border-transparent'
                      } hover:opacity-80 transition-ease`}
                      onClick={() => {
                        setReceivableAmount(item);
                      }}
                    >
                      {data?.image ? (
                        <div className="aspect-[128/80] rounded-lg overflow-hidden">
                          <Image className="h-full w-full object-cover" src={data?.image} alt="logo" width={1000} height={1000} />
                        </div>
                      ) : null}
                      <p className="text-sm sm:text-base font-semibold text-center leading-[1.2]">
                        {data?.currency ? (
                          <>
                            {item}
                            {currencyDisplay}
                          </>
                        ) : (
                          getCurrencyString(item)
                        )}
                      </p>
                    </div>
                  </div>
                ))
              : null}
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
              <p>{getCurrencyString(convertedReceivableAmount || receivableAmount || 0)}</p>
            </div>

            <Formik initialValues={{ email: paypalEmail }} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, handleChange, handleSubmit, handleBlur, values, errors }) => (
                <Form className="space-y-6">
                  <Field name="email">
                    {({ field }) => (
                      <Input
                        {...field}
                        type={'text'}
                        id="email"
                        label={t('enter_your_email')}
                        placeholder={t('enter_your_email')}
                        error={errors.email}
                        value={values.email}
                        onChange={(e) => {
                          handleChange(e);
                          setPaypalEmail(e.target.value);
                        }}
                        onBlur={handleBlur}
                        required={true}
                        hint={<ErrorMessage name="email" component="div" />}
                      />
                    )}
                  </Field>
                  <Checkbox
                    label={t('i_understand_my_order_is_non_refundable')}
                    id={'non-refundable-checkbox'}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    // onBlur={handleBlur}
                    // error={errors.terms}
                  />

                  <ButtonComponent
                    role="button"
                    variant="primary"
                    label="Withdraw"
                    icon={<BanknotesIcon className="w-5 h-5" />}
                    customClass="w-full !py-3"
                    onClick={handleSubmit}
                    disabled={isChecked ? false : true}
                  />
                </Form>
              )}
            </Formik>
          </div>
          {/* {data?.sku != 'PAYPAL' ? (
            <>
              <Checkbox
                label={t('i_understand_my_order_is_non_refundable')}
                id={'non-refundable-checkbox'}
                checked={isChecked}
                onChange={handleCheckboxChange}
                // onBlur={handleBlur}
                // error={errors.terms}
              />
              <ButtonComponent
                role="button"
                variant="primary"
                label="Withdraw"
                icon={<BanknotesIcon className="w-5 h-5" />}
                customClass="w-full !py-3"
                onClick={() => {
                  if (receivableAmount) {
                    handleSubmit();
                  } else {
                    Toast.show(t('please_select_amount'));
                  }
                }}
                disabled={isChecked ? false : true}
              />{' '}
            </>
          ) : null} */}
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
