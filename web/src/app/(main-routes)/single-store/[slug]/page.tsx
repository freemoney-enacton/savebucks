import { public_get_api } from '@/Hook/Api/Server/use-server';
import { createTranslation } from '@/i18n/server';
import { FALLBACK_LOCALE, LANGUAGE_COOKIE } from '@/i18n/settings';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import SingleStorePage from '../_components/SingleStorePage';
import PageLoader from '@/components/Generic/PageLoader';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { t } = await createTranslation();
  const local = cookies().get(LANGUAGE_COOKIE)?.value || FALLBACK_LOCALE;

  const settings = await public_get_api({
    path: `stores/${params.slug}`,
  });
  return {
    title: settings?.data?.meta_title?.[local] || t('single_store'),
    description: settings?.meta_desc?.[local] || t('single_store'),
  };
}

const SingleStore = async ({ params }: { params: { slug: string } }) => {
  let getStoreData = await public_get_api({ path: `stores/${params.slug}` });
  if (!getStoreData.success) {
    return notFound();
  } else {
    getStoreData = getStoreData.data;
  }

  return getStoreData ? <SingleStorePage data={getStoreData} /> : <PageLoader />;
};

export default SingleStore;
