// @ts-nocheck
import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { config } from './config';
import { public_get_api, public_post_api } from './Hook/Api/Server/use-server';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        try {
          const { email, password, recaptcha, token } = credentials;
          if (token) {
            const user = await fetch(`${config.BASE_API_END_POINT}validate?token=${token}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'GET',
            }).then((res) => res.json());
            if (user.success && !user.error) {
              const userInfo = await fetch(`${config.API_END_POINT}user/me`, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `${token}`,
                },
                method: 'GET',
              }).then((res) => res.json());
              if (userInfo.success && !userInfo.error) {
                return {
                  user: userInfo?.data,
                  token,
                };
              } else {
                throw new Error(userInfo.error || 'User not found.');
              }
            } else {
              throw new Error(user?.error || 'User not found.');
            }
          } else {
            const user = await public_post_api({ path: 'auth/login', body: { email, password, recaptcha } });
            if (user.success && user.data.token) {
              const userInfo = await fetch(`${config.API_END_POINT}user/me`, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `${user.data.token}`,
                },
                method: 'GET',
              }).then((res) => res.json());
              if (userInfo.success && !userInfo.error) {
                return {
                  token: user.data.token,
                  user: userInfo?.data,
                };
              } else {
                throw new Error(userInfo?.error || 'User not found.');
              }
            } else {
              throw new Error(user.error || 'User not found.');
            }
          }
        } catch (error) {
          console.log('🚀 ~ authorize ~ error:', error);
          throw new Error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.token = user.token;
        token.user = user.user;
      }
      if (trigger === 'update') {
        const res = await public_get_api({ path: `user/me` });
        if (res.data?.id) {
          token.user = res.data;
        }
      }
      return token;
    },
    // @ts-ignore
    async session({ session, newSession, token }) {
      if (token.sub && token.user) {
        session.user.token = token.token;
        session.user.user = token.user;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: config.NEXT_AUTH_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        priority: 'medium',
        secure: false,
      },
    },
  },
});
