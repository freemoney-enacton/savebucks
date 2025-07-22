import CheckSocial from '@/components/Generic/CheckSocial';
import { cookies } from 'next/headers';

const SocialSignInPage = async ({ searchParams }) => {
  const token = searchParams?.token;
  const userToken = token || cookies().get('token')?.value;
  const action = searchParams?.action || '';
  return <CheckSocial token={userToken} action={action} />;
};

export default SocialSignInPage;
