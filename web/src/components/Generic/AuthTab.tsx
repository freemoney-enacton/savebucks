'use client';
import React, { useEffect, useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import { Tabs, Tab, Spinner } from '@nextui-org/react';
import { useTranslation } from '@/i18n/client';
import { config } from '@/config';
import SignInV1 from './Forms/SignInV1';
import SignUpV1 from './Forms/SignupV1';

export default function AuthTab({ onClose, defaultSelectedKey, id }: any) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="min-h-[472px] h-full w-full flex items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="max-w-[480px] w-full mx-auto">
          <Tabs
            aria-label="Options"
            radius={'full'}
            defaultSelectedKey={defaultSelectedKey}
            classNames={{
              base: 'w-full !mx-auto !flex !items-center !justify-center ',
              tabList: '!rounded-none bg-transparent !p-0 !h-auto',
              cursor: 'hidden w-full !rounded-none !bg-tertiary-gr px-5 !py-3',
              tab: '!w-full !p-[1px] data-[selected=true]:!p-0 !rounded-none !bg-tertiary-gr !rounded-lg !h-auto focus:ring-offset-0 focus:ring-0 focus:outline-0 focus:border-0 focus-visible:!outline-0 focus-visible:!outline-offset-0 data-[focus-visible=true]:ring-offset-0 data-[focus-visible=true]:ring-0 data-[focus-visible=true]:outline-0 data-[focus-visible=true]:border-0 data-[focus-visible=true]:!outline-0 data-[focus-visible=true]:!outline-offset-0',
              wrapper: 'px-5 !py-3',
              tabContent:
                '!min-w-[100px] sm:!min-w-[132px] !px-[19px] group-data-[selected=true]:!px-5 !py-[7px] group-data-[selected=true]:!py-2 !rounded-[7px] !bg-black group-data-[selected=true]:!bg-tertiary-gr group-data-[selected=true]:!text-btn-primary-text !text-sm !font-bold !text-center',
              panel: 'px-0 pb-0',
            }}
          >
            <Tab key="signup" title={t('register')}>
              {config.AUTH_FORM_STYLE === '1' ? <SignUp onModalClose={onClose} /> : <SignUpV1 onModalClose={onClose} />}
            </Tab>
            <Tab key="signin" title={t('login')}>
              {config.AUTH_FORM_STYLE === '1' ? <SignIn onModalClose={onClose} /> : <SignInV1 onModalClose={onClose} />}
            </Tab>
          </Tabs>
        </div>
      )}
    </>
  );
}
