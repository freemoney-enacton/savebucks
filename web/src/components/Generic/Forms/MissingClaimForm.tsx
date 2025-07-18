import DatePickerComponent from '@/components/Core/DatePickerComponent';
import Input from '@/components/Core/Input';
import InputFileUpload from '@/components/Core/InputFileUpload';
import SelectComponent from '@/components/Core/SelectComponent';
import TextArea from '@/components/Core/TextArea';
import { Toast } from '@/components/Core/Toast';
import { claim_platform } from '@/Helper/constant';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import useUserClaim from '@/Hook/Api/Client/use-user-claim';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { ErrorMessage, Form, Formik } from 'formik';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import { SvgCalender, SvgNote, SvgPackage, SvgPhoneDesktop, SvgStore } from '../Icons';

const MissingClaimForm = ({ onClose, onSuccess }: { onClose?: any; onSuccess?: () => void }) => {
  const { t } = useTranslation();
  const { public_get_api, public_post_api } = usePublicApi();
  const [tripList, setTripList] = useState<any>([]);
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const [selectedClickTime, setSelectedClickTime] = useState<any>('');
  const { claimStoreList } = useUserClaim();

  const MAXSIZE = '2mb';
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const getClaimClickList = (store_id) => {
    if (store_id)
      try {
        public_get_api({ path: `cashback/claims/claim-clicks/${store_id}` }).then((res: any) => {
          if (res.success && !res.error) {
            setTripList(res.data);
          }
        });
      } catch (error) {}
  };

  const validationSchema = Yup.object().shape({
    store: Yup.string().required(t('store_required')),
    shoppingTrip: Yup.string().required(t('shopping_trip_required')),
    orderingPlatform: Yup.string().required(t('ordering_platform_required')),
    orderNumber: Yup.string().required(t('order_number_required')),
    currency: Yup.string().required(t('currency_required')),
    amount: Yup.number().required(t('amount_required')).positive(t('positive_amount_required')),
    date: Yup.date().required(t('date_required')),
    receipt: Yup.mixed()
      .required(t('receipt_required'))
      .test('fileSize', t('file_too_large'), (value: any) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE;
      })
      .test('fileType', t('unsupported_file_format'), (value: any) => {
        if (!value) return true;
        const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return supportedFormats.includes(value.type);
      }),
    message: Yup.string().required(t('message_required')).min(10, t('message_must_be_10_character_long')),
  });

  const initialValues = {
    store: '',
    shoppingTrip: '',
    orderingPlatform: '',
    orderNumber: '',
    currency: '',
    amount: '',
    date: null,
    receipt: null,
    message: '',
  };
  function convertToDateFormat(dateObj) {
    // Extract the day, month, and year
    const day = String(dateObj.day).padStart(2, '0');
    const month = String(dateObj.month).padStart(2, '0');
    const year = dateObj.year;

    // Return in dd/mm/yyyy format
    return `${day}/${month}/${year}`;
  }
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let form_body = new FormData();
      const body = {
        store_id: values.store,
        click_id: values.shoppingTrip,
        order_id: values.orderNumber,
        platform: values.orderingPlatform,
        currency: values.currency,
        order_amount: values.amount,
        transaction_date: values.date ? convertToDateFormat(values.date) : '',
        comment: values.message,
        receipt: values.receipt,
      };
      for (let key in body) {
        form_body.append(key, body[key]);
      }

      const res = await public_post_api({
        path: 'cashback/claims/create',
        body: form_body,
        addContentType: false,
      });
      if (res?.error) return Toast.error(res?.error);
      if (res.success) {
        Toast.success(res?.message);
        onSuccess?.();
        setSelectedClickTime('');
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  // const notes = `<ul>
  //       <li>Please wait 3 days from the transaction date before making a missing cashback claim.</li>
  //       <li>A missing cashback claim is not permitted for transactions older than 15 days.</li>
  //       <li>Some stores do not allow missing cashback claims, please check the relevant store page for further details.</li>
  //   </ul>`;

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-3 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold">{t('create_claim')}</h3>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <SelectComponent
                label={t('enter_store')}
                items={claimStoreList}
                selectedKeys={values.store ? new Set([values.store]) : new Set([])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0]?.toString() || '';
                  setFieldValue('store', selected);
                  setFieldValue('shoppingTrip', '');
                  getClaimClickList(selected);
                }}
                return_value_key={'id'}
                selected_value_key={'name'}
                icon={<SvgStore className="size-[18px]" />}
                error={touched.store && errors.store}
              />
              <ErrorMessage name="store" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <SelectComponent
                label={t('enter_shopping_trip')}
                items={tripList}
                selectedKeys={values.shoppingTrip ? new Set([values.shoppingTrip]) : new Set([])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0]?.toString() || '';
                  setSelectedClickTime(selected ? tripList.find((trip: any) => trip.id == selected)?.click_time : '');
                  setFieldValue('shoppingTrip', selected);
                }}
                return_value_key={'id'}
                selected_value_key={'click_time'}
                icon={<SvgCalender className="size-[18px]" />}
                error={touched.shoppingTrip && errors.shoppingTrip}
              />
              <ErrorMessage name="shoppingSpree" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <SelectComponent
                label={t('enter_ordering_platform')}
                items={claim_platform}
                selectedKeys={values.orderingPlatform ? new Set([values.orderingPlatform]) : new Set([])}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0]?.toString() || '';
                  setFieldValue('orderingPlatform', selected);
                }}
                return_value_key={'id'}
                selected_value_key={'label'}
                icon={<SvgPhoneDesktop className="size-[18px]" />}
                error={touched.orderingPlatform && errors.orderingPlatform}
              />
              <ErrorMessage name="orderingPlatform" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <Input
                type="text"
                id="orderNumber"
                name="orderNumber"
                placeholder={t('enter_order_number')}
                required={true}
                icon={<SvgPackage className="size-[18px]" />}
                value={values.orderNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.orderNumber && errors.orderNumber}
              />
              <ErrorMessage name="orderNumber" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-6">
            <div className="col-span-12 sm:col-span-7 flex items-center gap-1.5">
              <div className="w-full">
                <SelectComponent
                  label={t('currency')}
                  items={settings?.currencies ? settings?.currencies : []}
                  selectedKeys={values.currency ? new Set([values.currency]) : new Set([])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0]?.toString() || '';
                    setFieldValue('currency', selected);
                  }}
                  return_value_key={'iso_code'}
                  selected_value_key={'iso_code'}
                  icon={<SvgNote className="size-[18px]" />}
                  error={touched.currency && errors.currency}
                />
                <ErrorMessage name="currency" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder={t('crowd')}
                  customClass="max-w-[111px] !px-4"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.amount && errors.amount}
                />
                <ErrorMessage name="amount" component="p" className="text-red-500 text-xs mt-1" />
              </div>
            </div>
            <div className="col-span-12 sm:col-span-5">
              <DatePickerComponent
                value={values.date}
                onChange={(date: any) => {
                  setFieldValue('date', date);
                }}
                minValue={selectedClickTime ? parseDate(new Date(selectedClickTime)?.toISOString().split('T')[0]) : null}
                maxValue={today(getLocalTimeZone())}
              />
              <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
            </div>
          </div>
          <div className="space-y-1.5">
            <InputFileUpload accept=".jpeg, .jpg, .png, .pdf" onChange={(e) => setFieldValue('receipt', e)} />

            <div className="flex justify-between">
              <ErrorMessage name="receipt" component="p" className="text-red-500 text-xs" />
              <p className="text-xs font-medium text-right">
                {t('max_allowed_file_size')} {MAXSIZE}. {t('accepted_formats_jpeg_jpg_png_pdf')}
              </p>
            </div>
          </div>
          <div>
            <TextArea
              id="message"
              name="message"
              placeholder={t('support_textarea_placeholder')}
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.message && errors.message}
              rows={4}
            />
            <ErrorMessage name="message" component="p" className="text-red-500 text-xs mt-1" />
          </div>
          {/* <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('important_note')}</h4>
            <div className="cms-box text-xs [&>ul>li]:!mt-1" dangerouslySetInnerHTML={{ __html: notes }}></div>
          </div> */}
          <ButtonComponent
            role="button"
            type="submit"
            variant="primary"
            label={t('submit')}
            icon={<RocketLaunchIcon className="size-4" />}
            customClass="w-full py-3"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
};

export default MissingClaimForm;
