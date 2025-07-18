import CheckSocial from '@/components/Generic/CheckSocial';
import { cookies } from 'next/headers';

const SocialSignInPage = async ({ searchParams }) => {
  const token = searchParams?.token;
  const userToken = token || cookies().get('token')?.value;
  return <CheckSocial token={userToken} />;
};

export default SocialSignInPage;
