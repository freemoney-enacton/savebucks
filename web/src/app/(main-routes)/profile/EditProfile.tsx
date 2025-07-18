'use client';

import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useUtils } from '@/Hook/use-utils';
import FormTitle from '@/components/Core/FormTitle';
import Input from '@/components/Core/Input';
import InputFileUpload from '@/components/Core/InputFileUpload';
import { Toast } from '@/components/Core/Toast';
import ButtonComponent from '@/components/Generic/ButtonComponent';
import UserCard from '@/components/Generic/Card/UserCard';
import { SvgCalender, SvgReferral, SvgUser } from '@/components/Generic/Icons';
import VerifyEmail from '@/components/Generic/Modals/VerifyEmail';
import { useTranslation } from '@/i18n/client';
import { booleanDefaultFalseAtomFamily, stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useDisclosure } from '@nextui-org/react';
import { ErrorMessage, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as Yup from 'yup';

const EditProfile = () => {
  const [verifyKey, setVerifyKey] = useState('');
  const PhoneValid: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.validPhoneNumber));
  const [ProfileVerifyValue, setProfileVerifyValue]: any = useRecoilState(stringAtomFamily(atomKey.ProfileVerifyValue));
  const [ProfileEmailValue, setProfileEmailValue]: any = useRecoilState(stringAtomFamily(atomKey.ProfileEmailValue));
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session, update }: any = useSession();
  const { public_post_api } = usePublicApi();
  const { formattedDate } = useUtils();

  const MAXSIZE = '2mb';
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  // Initial values
  const initialValues = {
    name: session?.user?.user?.name || '',
    email: session?.user?.user?.email ? session?.user?.user?.email : ProfileEmailValue ? ProfileEmailValue : '',
    phoneNumber: session?.user?.user?.phone_no ? session?.user?.user?.phone_no : ProfileVerifyValue ? ProfileVerifyValue : '',
  };
  const updateSession = async () => {
    await update({ updated: true });
  };
  useEffect(() => {
    updateSession();
  }, []);
  useEffect(() => {
    if (session?.user?.user?.email) {
      setProfileEmailValue(session?.user?.user?.email);
    }
    if (session?.user?.user?.phone_no) {
      setProfileVerifyValue(session?.user?.user?.phone_no);
    }
  });
  // Define validation schemas for Formik forms
  const profileValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('name_minimum_3_characters'))
      .max(50, t('name_maximum_50_characters'))
      .required(t('name_required')),
    email: Yup.string()
      .email(t('invalid_email_address'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, t('invalid_email_address'))
      .required(t('email_required')),
    phoneNumber: Yup.string()
      // .matches(/^[0-9]+$/, t('phone_number_must_be_digit'))
      .min(10, t('phone_number_minimum_10_digit'))
      // .max(10, t('phone_number_maximum_10_digit'))
      .required(t('phone_number_required')),
  });

  const profilePicValidationSchema = Yup.object().shape({
    receipt: Yup.mixed()
      .required(t('profile_pic_required'))
      .test('fileSize', t('file_too_large'), (value: any) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE;
      })
      .test('fileType', t('unsupported_file_format'), (value: any) => {
        if (!value) return true;
        const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return supportedFormats.includes(value.type);
      }),
  });

  const handleProfileSubmit = (values, { setSubmitting }) => {
    try {
      let form_body = new FormData();
      const body = {
        name: values.name,
        email: values.email,
        ...(values.phoneNumber
          ? { phone_no: values.phoneNumber?.includes('+') ? values.phoneNumber : `+${values.phoneNumber}` }
          : {}),
      };
      for (let key in body) {
        form_body.append(key, body[key]);
      }
      public_post_api({ path: `user/update`, body: form_body, addContentType: false })
        .then(async (res) => {
          if (res?.success) {
            await update({ updated: true });
            Toast.success(t('profile_updated_successfully'));
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => setSubmitting(false));
    } catch (error) {
      console.error('Error updating profile:', error);
      setSubmitting(false);
    }
  };
  const handleSendOtp = (values, { setFieldError, setSubmitting }) => {
    if (PhoneValid) {
      setVerifyKey('phone');
      const body = {
        phone_no: values.phoneNumber?.includes('+') ? values.phoneNumber : `+${values.phoneNumber}`,
      };
      try {
        public_post_api({
          path: 'auth/send-verification-otp',
          body: body,
        })
          .then(async (response) => {
            if (response?.success) {
              await update({ updated: true });
              Toast.success(response?.msg);
              // onOpen();
            } else {
              Toast.error(response?.error);
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      setFieldError('phoneNumber', t('invalid_phone_number'));
      setSubmitting(false);
    }
  };
  const handleEmailOtpSend = (values, { setSubmitting }) => {
    setVerifyKey('email');
    try {
      const body = {
        email: values.email,
      };
      public_post_api({
        path: 'auth/send-verification-otp',
        body: body,
      })
        .then((response) => {
          if (response?.success) {
            Toast.success(response?.msg);
            onOpen();
          } else {
            Toast.error(response?.error);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleProfilePicSubmit = (values, { setSubmitting }) => {
    try {
      let form_body = new FormData();
      form_body.append('avatar', values.receipt);
      public_post_api({ path: `user/update`, body: form_body, addContentType: false })
        .then(async (res) => {
          if (res?.success) {
            await update({ updated: true });
            Toast.success(t('profile_updated_successfully'));
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => setSubmitting(false));
    } catch (error) {
      console.error('Error updating profile:', error);
      setSubmitting(false);
    }
  };
  return (
    <>
      {/* Form for Name */}
      <UserCard>
        <UserCard.Body customClass="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <FormTitle title={t('edit_profile')} />
          </div>
          <div className="grid md:grid-cols-2 gap-y-5 gap-x-4 lg:gap-x-12">
            {/* form for name */}
            <Formik
              initialValues={{ name: initialValues.name }}
              enableReinitialize
              validationSchema={profileValidationSchema.pick(['name'])}
              onSubmit={(values, { setSubmitting }) => {
                handleProfileSubmit({ ...initialValues, name: values.name }, { setSubmitting });
              }}
            >
              {({ values, dirty, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    id="name"
                    // label={t('user_name')}
                    placeholder={t('enter_user_name')}
                    icon={<SvgUser className="size-[18px]" />}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    hint={<ErrorMessage name="name" component="span" />}
                    button={
                      <ButtonComponent
                        disabled={!dirty}
                        role="button"
                        variant="primary"
                        label={t('save')}
                        type="submit"
                        isLoading={isSubmitting}
                        customClass="py-1.5 xl:py-2 px-2 xl:px-2.5"
                      />
                    }
                  />
                </form>
              )}
            </Formik>

            {/* joining date */}
            <Input
              type="text"
              id="joiningDate"
              readOnly
              // label={t('joining_date')}
              icon={<SvgCalender className="size-[18px]" />}
              placeholder={t('nobody')}
              value={formattedDate(session?.user?.user?.created_at)}
            />

            {/* referral name */}
            {session?.user?.user?.referrerName && (
              <Input
                type="text"
                id="referral"
                // label={t('referral')}
                // placeholder={t('nobody')}
                placeholder={t('referral')}
                icon={<SvgReferral className="size-[18px]" />}
                value={session?.user?.user?.referrerName}
                readOnly
              />
            )}

            {/* Form for Email */}
            <Formik
              initialValues={{ email: initialValues.email }}
              enableReinitialize
              validationSchema={profileValidationSchema.pick(['email'])}
              onSubmit={handleEmailOtpSend}
            >
              {({ values, setFieldValue, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div>
                    <Input
                      type="email"
                      id="email"
                      // label={t('email')}
                      placeholder={t('enter_email')}
                      value={values.email}
                      icon={<EnvelopeIcon className="size-[18px]" />}
                      onChange={(e) => {
                        setProfileEmailValue(e.target.value);
                        setFieldValue('email', e.target.value);
                      }}
                      onBlur={handleBlur}
                      error={errors.email}
                      readOnly={session?.user?.user?.is_email_verified}
                      hint={<ErrorMessage name="email" component="span" />}
                      customClass="pr-20"
                      button={
                        !session?.user?.user?.is_email_verified && (
                          <ButtonComponent
                            disabled={!!errors.email && isSubmitting}
                            role="button"
                            variant="primary"
                            label={t('verify_email')}
                            type="button"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            customClass="py-1.5 xl:py-2 px-2 xl:px-2.5"
                          />
                        )
                      }
                    />
                  </div>
                </form>
              )}
            </Formik>

            {/* Form for Phone Number */}
            <Formik
              initialValues={{ phoneNumber: initialValues.phoneNumber }}
              enableReinitialize
              validationSchema={profileValidationSchema.pick(['phoneNumber'])}
              onSubmit={handleSendOtp}
            >
              {({ values, setFieldValue, dirty, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div>
                    <Input
                      type="phone"
                      id="phoneNumber"
                      // label={t('phone_number')}
                      placeholder={t('enter_phone_number')}
                      value={values.phoneNumber}
                      onChange={(e) => {
                        setProfileVerifyValue(e);
                        setFieldValue('phoneNumber', e);
                      }}
                      onBlur={handleBlur}
                      error={errors.phoneNumber}
                      isVerified={session?.user?.user?.is_phone_no_verified}
                      readOnly={session?.user?.user?.is_phone_no_verified}
                      hint={<ErrorMessage name="phoneNumber" component="span" />}
                      button={
                        !session?.user?.user?.is_phone_no_verified && (
                          <ButtonComponent
                            disabled={!values.phoneNumber && !dirty}
                            role="button"
                            variant="primary"
                            label={t('save')}
                            type="button"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            customClass="py-1.5 xl:py-2 px-2 xl:px-2.5"
                          />
                        )
                      }
                    />
                  </div>
                </form>
              )}
            </Formik>
          </div>

          <div className="grid md:grid-cols-2 gap-y-5 gap-x-4 lg:gap-x-12">
            {/* Form for file upload */}
            <Formik
              initialValues={{
                receipt: session?.user?.user?.avatar ? session?.user?.user?.avatar : '',
              }}
              enableReinitialize
              validationSchema={profilePicValidationSchema}
              onSubmit={handleProfilePicSubmit}
            >
              {({ setFieldValue, isSubmitting, handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2" key={session?.user?.user?.avatar}>
                    <InputFileUpload
                      value={values.receipt}
                      label={t('upload_profile_picture')}
                      onChange={(e) => setFieldValue('receipt', e)}
                    />
                    <div className="flex justify-between">
                      <ErrorMessage name="receipt" component="p" className="text-red-500 text-xs" />
                      <p className="text-xs font-medium text-right">
                        {t('max_allowed_file_size')} {MAXSIZE}. {t('accepted_formats_jpeg_jpg_png_pdf')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <ButtonComponent
                        // disabled={!values.phoneNumber && !dirty}
                        role="button"
                        variant="primary"
                        label={t('upload')}
                        type="button"
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        customClass="py-1.5 xl:py-2 px-2 xl:px-2.5"
                      />
                      <p className="text-xs font-medium text-right">{t('only_png_jpg_images_are_supported')}</p>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </UserCard.Body>
      </UserCard>

      {/* Verify Email Modal */}
      <VerifyEmail
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        type={verifyKey}
        data={verifyKey == 'email' ? session?.user?.user?.email : session?.user?.user?.phone_no}
      />
    </>
  );
};

export default EditProfile;
