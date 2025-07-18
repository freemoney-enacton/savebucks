'use client';
import FormTitle from '@/components/Core/FormTitle';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import UserCard from '@/components/Generic/Card/UserCard';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from '@/i18n/client';
import * as Yup from 'yup';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const ChangePassword = () => {
  const { t } = useTranslation();
  const reCaptchaRef = useRef<any>(null);
  const { public_post_api } = usePublicApi();

  // Initial values for the form
  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(t('current_password_required')),
    newPassword: Yup.string()
      .min(6, t('password_must_be_at_least_6_characters'))
      .matches(/[A-Z]/, t('password_must_contain_at_least_one_uppercase_letter'))
      .matches(/[a-z]/, t('password_must_contain_at_least_one_lowercase_letter'))
      .matches(/\d/, t('password_must_contain_at_least_one_digit'))
      .required(t('new_password_required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], t('passwords_must_match'))
      .required(t('confirm_password_required')),
  });

  // Form submit handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Handle form submission
    try {
      const recaptcha = await reCaptchaRef.current.executeAsync();
      let body = {
        currentPassword: values.currentPassword,
        password: values.newPassword,
        recaptcha,
      };
      public_post_api({ path: `auth/change-password`, body: body })
        .then((res) => {
          if (res?.success) {
            Toast.success(t('password_changed_successfully'));
            resetForm();
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => {
          setSubmitting(false);
          reCaptchaRef.current.reset();
        });
    } catch (error) {
      console.log({ error });
      setSubmitting(false);
      reCaptchaRef.current.reset();
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, dirty }) => (
        <Form>
          <UserCard>
            <UserCard.Body customClass="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <FormTitle title={t('change_password')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-y-5 gap-x-4 lg:gap-x-12">
                <Field name="currentPassword">
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      id="currentPassword"
                      // label={t('current_password')}
                      icon={<LockClosedIcon className="size-[18px]" />}
                      placeholder={t('enter_current_password')}
                      hint={<ErrorMessage name="currentPassword" component="div" />}
                    />
                  )}
                </Field>
                <div className="max-sm:hidden"></div>
                <Field name="newPassword">
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      id="newPassword"
                      // label={t('new_password')}
                      icon={<LockClosedIcon className="size-[18px]" />}
                      placeholder={t('enter_new_password')}
                      hint={<ErrorMessage name="newPassword" component="div" />}
                    />
                  )}
                </Field>
                <Field name="confirmPassword">
                  {({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      id="confirmPassword"
                      // label={t('confirm_password')}
                      icon={<LockClosedIcon className="size-[18px]" />}
                      placeholder={t('enter_confirm_password')}
                      hint={<ErrorMessage name="confirmPassword" component="div" />}
                    />
                  )}
                </Field>
                <ReCAPTCHA ref={reCaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
              </div>
              <div className="text-center">
                <ButtonComponent
                  disabled={!dirty}
                  role="button"
                  variant="primary"
                  label={t('change_password')}
                  type="submit"
                  isLoading={isSubmitting}
                />
              </div>
            </UserCard.Body>
          </UserCard>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
