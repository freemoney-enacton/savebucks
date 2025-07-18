'use client';
import Input from '@/components/Core/Input';
import TextArea from '@/components/Core/TextArea';
import { Toast } from '@/components/Core/Toast';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { ErrorMessage, Formik } from 'formik';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
import ButtonComponent from '../ButtonComponent';
import SupportDropdown from '../SelectDropdowns/SupportDropdown';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';
import { usePublicApi } from '@/Hook/Api/Client/use-client';

const BusinessInquiryForm = () => {
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const { t } = useTranslation();
  const reCaptchaRef = useRef<any>(null);
  const { public_post_api } = usePublicApi();

  const categoriesWithId =
    settings &&
    settings?.forms?.business_inquiry_reasons.map((category, index) => ({
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
    website: Yup.string().matches(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      t('invalid_website_name')
    ),
    company_name: Yup.string().min(3, t('name_minimum_3_characters')).max(50, t('name_maximum_50_characters')),
    support: Yup.string().required(t('support_required')),
    subject: Yup.string().min(3, t('name_minimum_3_characters')).required(t('subject_required')),
    message: Yup.string().min(10, t('message_must_be_10_character_long')).required(t('message_required')),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    (async () => {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      try {
        let body = {
          name: values.name,
          email: values.email,
          website: values.website,
          company_name: values.company_name,
          reason: values.support,
          subject: values.subject,
          message: values.message,
          recaptcha: recaptcha,
        };
        public_post_api({ path: `business-inquiry-forms`, body: body })
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
          name: '',
          email: '',
          website: '',
          company_name: '',
          subject: '',
          message: '',
          support: '',
        }}
        enableReinitialize
        validationSchema={validationSchema} // Define your validation schema here
        onSubmit={handleSubmit} // Define your submit handler here
      >
        {({ values, touched, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="text"
                id="name"
                placeholder={t('enter_name')}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                hint={<ErrorMessage name="name" component="span" />}
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
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="website"
                id="website"
                placeholder={t('enter_your_website_name')}
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.website}
                hint={<ErrorMessage name="website" component="span" />}
              />
              <Input
                type="company_name"
                id="company_name"
                placeholder={t('enter_your_company_name')}
                value={values.company_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.company_name}
                hint={<ErrorMessage name="company_name" component="span" />}
              />
            </div>
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
            <Input
              id="subject"
              placeholder={t('enter_subject')}
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subject}
              hint={<ErrorMessage name="subject" component="span" />}
            />
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
              role="button"
              variant="primary"
              label={t('submit')}
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessInquiryForm;
