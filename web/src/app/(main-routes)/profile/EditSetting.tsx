'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import FormTitle from '@/components/Core/FormTitle';
import Input from '@/components/Core/Input';
import SwitchComponent from '@/components/Core/SwitchComponent';
import { Toast } from '@/components/Core/Toast';
import UserCard from '@/components/Generic/Card/UserCard';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import { Spinner } from '@nextui-org/react';
import { Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import * as Yup from 'yup';

const EditSetting = () => {
  const { t } = useTranslation();
  const { data: session, update }: any = useSession();
  const { public_post_api } = usePublicApi();
  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const [loading, setLoading] = useState({ is_private: false, promotion_update: false });

  // Initial values for the form
  const initialValues = {
    profileVisibility: session?.user?.user?.is_private == 1 ? true : false,
    receivePromotionalOffers: session?.user?.user?.promotion_update == 1 ? true : false,
  };

  // Validation schema
  const validationSchema = Yup.object({
    profileVisibility: Yup.boolean(),
    receivePromotionalOffers: Yup.boolean(),
  });

  const handlePrivateSubmit = (is_private, setFieldValue) => {
    try {
      setLoading({ is_private: true, promotion_update: false });
      let body = {
        is_private: is_private ? 1 : 0,
        promotion_update: session?.user?.user?.promotion_update,
      };
      public_post_api({ path: `user/update-settings`, body: body })
        .then(async (res) => {
          if (res?.success) {
            await update({ updated: true });
            Toast.success(t('settings_updated_successfully'));
          } else {
            Toast.error(res?.error);
            setFieldValue('profileVisibility', session?.user?.user?.is_private == 1 ? true : false);
          }
        })
        .finally(() => setLoading({ is_private: false, promotion_update: false }));
    } catch (error) {
      console.log({ error });
      setLoading({ is_private: false, promotion_update: false });
    }
  };
  const handlePromotionalSubmit = (promotion_update, setFieldValue) => {
    try {
      setLoading({ is_private: false, promotion_update: true });
      let body = {
        is_private: session?.user?.user?.is_private,
        promotion_update: promotion_update ? 1 : 0,
      };
      public_post_api({ path: `user/update-settings`, body: body })
        .then(async (res) => {
          if (res?.success) {
            await update({ updated: true });
            Toast.success(t('settings_updated_successfully'));
          } else {
            Toast.error(res?.error);
            setFieldValue('receivePromotionalOffers', session?.user?.user?.promotion_update == 1 ? true : false);
          }
        })
        .finally(() => setLoading({ is_private: false, promotion_update: false }));
    } catch (error) {
      console.log({ error });
      setLoading({ is_private: false, promotion_update: false });
    }
  };
  // Form submit handler

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={() => {}}>
      {({ values, dirty, setFieldValue, isSubmitting }) => (
        <Form>
          <UserCard>
            <UserCard.Body customClass="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <FormTitle title={t('settings')} />

                {/* <ButtonComponent
                  disabled={!dirty}
                  role="button"
                  variant="primary"
                  label={t('save')}
                  type="submit"
                  isLoading={isSubmitting}
                /> */}
              </div>
              <div className="grid sm:grid-cols-2 gap-y-5 gap-x-4 lg:gap-x-12 items-center">
                <div className="space-y-3.5">
                  <p className="text-white text-lg font-medium">{t('profile_visibility')}</p>
                  <div className="flex items-center gap-3.5 text-white">
                    <p>{t('public')}</p>
                    <Field
                      name="profileVisibility"
                      component={({ field }) =>
                        loading?.is_private ? (
                          <Spinner color="primary" size="sm" />
                        ) : (
                          <SwitchComponent
                            {...field}
                            isSelected={field.value}
                            onToggle={(val) => {
                              handlePrivateSubmit(val, setFieldValue);
                            }}
                          />
                        )
                      }
                    />
                    <p>{t('private')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <p className="text-white text-base sm:text-lg font-medium">{t('receive_promotional_offers')}</p>
                  <Field
                    name="receivePromotionalOffers"
                    component={({ field }) =>
                      loading?.promotion_update ? (
                        <Spinner color="primary" size="sm" />
                      ) : (
                        <SwitchComponent
                          {...field}
                          isSelected={field.value}
                          onToggle={(val) => {
                            handlePromotionalSubmit(val, setFieldValue);
                          }}
                        />
                      )
                    }
                  />
                </div>
                {/* <div className="space-y-1.5">
                  <p className="text-white text-sm font-medium">{t('email')}</p>
                  <div className="py-3.5 px-5 bg-white-gr rounded-full flex items-center gap-2.5">
                    <p className="text-white text-sm font-semibold">sample@gmail.com</p>
                    <Image className="w-5 h-5" src="/images/tick-mark.png" width={20} height={20} alt="verified" />
                  </div>
                </div> */}
                {session?.user?.user?.country_code && (
                  <div className="space-y-1.5">
                    <Input
                      icon={
                        <span className="size-[18px] rounded-full overflow-hidden">
                          <Image
                            className="w-full h-full object-cover"
                            src={config.COUNTRY_FLAG?.replace(':COUNTRY_CODE', session?.user?.user?.country_code?.toLowerCase())}
                            alt="country"
                            width={100}
                            height={100}
                          />
                        </span>
                      }
                      type="text"
                      id="country"
                      // label={t('country')}
                      placeholder={t('country')}
                      value={regionNames.of(session?.user?.user?.country_code)}
                      readOnly={true}
                    />
                  </div>
                )}
              </div>
            </UserCard.Body>
          </UserCard>
        </Form>
      )}
    </Formik>
  );
};

export default EditSetting;
