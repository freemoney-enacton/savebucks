'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { Toast } from '@/components/Core/Toast';
import EmptyHeader from '@/components/Generic/Header/EmptyHeader';
import IFrameSection from '@/components/Generic/IFrameSection';
import { useTranslation } from '@/i18n/client';
import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const TaskIFrame = ({ params }) => {
  const { t } = useTranslation();
  const [SurveyURL, setSurveyURL] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const { public_get_api } = usePublicApi();
  useEffect(() => {
    try {
      public_get_api({ path: `tasks/redirect/${params.slug}` })
        .then((res) => {
          if (res?.status === 200) setSurveyURL(res);
          else {
            Toast.error(res?.data?.message);
          }
        })
        .finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
    }
  }, []);

  // get iframe api
  return (
    <div className="min-h-screen">
      <title>{t('survey')}</title>
      <EmptyHeader redirect_home={true} />
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <IFrameSection SurveyURL={SurveyURL?.data?.[0]?.offer_url} />
      )}
    </div>
  );
};

export default TaskIFrame;
