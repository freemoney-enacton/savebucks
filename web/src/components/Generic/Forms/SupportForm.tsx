'use client';
import Input from '@/components/Core/Input';
import { useTranslation } from '@/i18n/client';
import React, { useRef } from 'react';
import SupportDropdown from '../SelectDropdowns/SupportDropdown';
import TextArea from '@/components/Core/TextArea';
import ButtonComponent from '../ButtonComponent';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { Toast } from '@/components/Core/Toast';
import { useRecoilValue } from 'recoil';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import ReCAPTCHA from 'react-google-recaptcha';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/solid';

const SupportForm = ({ type = 'support' }) => {
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const { t } = useTranslation();
  const reCaptchaRef = useRef<any>(null);
  const { public_post_api } = usePublicApi();

  const categoriesWithId =
    settings &&
    settings?.forms?.contact_form_reasons.map((category, index) => ({
      id: index, // ID starts from 1
      label: category,
    }));

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('name_minimum_3_characters'))
      .max(50, t('name_maximum_50_characters'))
      .required(t('name_required')),

    email: Yup.string()
      .email(t('invalid_email_address'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, t('invalid_email_address'))
      .required(t('email_required')),

    support: Yup.string().required(t('support_required')),

    message: Yup.string().min(10, t('message_must_be_10_character_long')).required(t('message_required')),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    (async () => {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      try {
        let body = {
          name: values.name,
          email: values.email,
          reason: values.support,
          message: values.message,
          recaptcha: recaptcha,
        };
        public_post_api({ path: type === 'business_inquiries' ? `business-inquiry-forms` : `contact-forms`, body: body })
          .then(async (res) => {
            if (res?.success) {
              Toast.success(t('form_submitted_successfully'));
              resetForm();
            } else {
              Toast.error(res?.error);
            }
          })
          .finally(() => setSubmitting(false));
      } catch (error) {
        console.log({ error });
        setSubmitting(false);
      }
    })();
  };
  return (
    <div className="max-lg:max-w-[600px] mx-auto px-5 py-6 sm:p-8 xl:p-8 2xl:p-12 bg-black-250 rounded-lg">
      <Formik
        initialValues={{
          name: type == 'business_inquiries' ? settings?.default?.name : '',
          email: '',
          message: '',
          support: '',
        }}
        enableReinitialize
        validationSchema={validationSchema} // Define your validation schema here
        onSubmit={handleSubmit} // Define your submit handler here
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              id="name"
              placeholder={t('enter_name')}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              readOnly={type == 'business_inquiries'}
              hint={<ErrorMessage name="name" component="span" />}
              icon={<UserIcon className="size-[18px]" />}
            />
            <Input
              type="email"
              id="email"
              placeholder={t('enter_email')}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              hint={<ErrorMessage name="email" component="span" />}
              icon={<EnvelopeIcon className="size-[18px]" />}
            />
            {categoriesWithId?.length > 0 && (
              <SupportDropdown
                data={categoriesWithId}
                value={values.support}
                onChange={(val) => {
                  setFieldValue('support', val);
                }}
                onBlur={handleBlur}
                error={touched['support'] && errors.support}
                hint={<ErrorMessage name="support" component="span" />}
              />
            )}
            <TextArea
              id="message"
              placeholder={t('support_textarea_placeholder')}
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              hint={<ErrorMessage name="message" component="span" />}
            />
            <div className="hidden">
              <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
            </div>
            <ButtonComponent
              disabled={isSubmitting}
              role="button"
              variant="primary"
              label={t('submit')}
              type="submit"
              isLoading={isSubmitting}
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default SupportForm;
